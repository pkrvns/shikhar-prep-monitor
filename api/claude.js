// Vercel Serverless Function (Node runtime) — Claude API proxy.
// Written as plain JS because Vercel's ncc bundler cannot produce working
// output from TypeScript 6.x — every .ts function crashes with
// FUNCTION_INVOCATION_FAILED at module load time.

/** @type {import('http').RequestListener} */
module.exports = async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("access-control-allow-methods", "POST, OPTIONS");
    res.setHeader("access-control-allow-headers", "content-type");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, {
      error: { type: "missing_api_key", message: "ANTHROPIC_API_KEY env var not set on Vercel." },
    });
    return;
  }

  // Vercel auto-parses JSON bodies for Node functions.
  let body = null;
  if (req.body && typeof req.body === "object") {
    body = req.body;
  } else {
    try {
      const raw = await readRawBody(req);
      body = raw ? JSON.parse(raw) : null;
    } catch {
      sendJson(res, 400, { error: "invalid_json" });
      return;
    }
  }

  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    sendJson(res, 400, { error: "missing_messages" });
    return;
  }

  const DEFAULT_MODEL = "claude-opus-4-5";
  const DEFAULT_MAX_TOKENS = 2048;
  const wantStream = body.stream === true;

  const ac = new AbortController();
  // For streaming we must NOT auto-abort at 55s — streams often last longer.
  // Vercel's function maxDuration (60s) will bound it. For non-streaming we
  // keep the 55s safety net so the client gets a clean error instead of a
  // mystery 504 from the platform.
  const upstreamTimeout = wantStream ? null : setTimeout(() => ac.abort(), 55000);

  // Kill the upstream request if the client disconnects mid-stream.
  req.on("close", () => { try { ac.abort(); } catch { /* noop */ } });

  let upstream;
  try {
    upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        ...(wantStream ? { accept: "text/event-stream" } : {}),
      },
      body: JSON.stringify({
        model: body.model || DEFAULT_MODEL,
        max_tokens: body.max_tokens || DEFAULT_MAX_TOKENS,
        system: body.system,
        messages: body.messages,
        ...(wantStream ? { stream: true } : {}),
      }),
      signal: ac.signal,
    });
  } catch (e) {
    if (upstreamTimeout) clearTimeout(upstreamTimeout);
    const aborted = e && e.name === "AbortError";
    sendJson(res, 504, {
      error: {
        type: aborted ? "upstream_timeout" : "upstream_fetch_failed",
        message: aborted
          ? "Claude took longer than 55 seconds to respond. Try a shorter prompt or fewer sub-topics at once."
          : e instanceof Error ? e.message : "Network error contacting Anthropic",
      },
    });
    return;
  }
  if (upstreamTimeout) clearTimeout(upstreamTimeout);

  // ---- Streaming branch: forward Anthropic's SSE bytes verbatim ----
  if (wantStream) {
    // If Anthropic returned a non-OK status, they emit JSON not SSE — surface it.
    if (!upstream.ok || !upstream.body) {
      let errText = "";
      try { errText = await upstream.text(); } catch { /* noop */ }
      res.statusCode = upstream.status || 502;
      res.setHeader("content-type", "application/json");
      res.setHeader("access-control-allow-origin", "*");
      res.setHeader("cache-control", "no-store");
      res.end(errText || JSON.stringify({ error: { type: "upstream_error", message: "no body" } }));
      return;
    }
    res.statusCode = 200;
    res.setHeader("content-type", "text/event-stream");
    res.setHeader("cache-control", "no-store, no-transform");
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("x-accel-buffering", "no"); // disable proxy buffering
    // Flush headers immediately so the browser starts reading the stream.
    if (typeof res.flushHeaders === "function") res.flushHeaders();

    try {
      const reader = upstream.body.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value && value.length) res.write(Buffer.from(value));
      }
    } catch (e) {
      // Client disconnect or upstream abort — nothing useful to send.
      try { res.write(`event: error\ndata: ${JSON.stringify({ message: e instanceof Error ? e.message : "stream aborted" })}\n\n`); } catch { /* noop */ }
    }
    res.end();
    return;
  }

  // ---- Non-streaming branch (unchanged) ----
  const text = await upstream.text();
  let payload = text;
  try {
    JSON.parse(text);
  } catch {
    payload = JSON.stringify({
      error: { type: "upstream_non_json", status: upstream.status, message: text.slice(0, 500) },
    });
  }
  res.statusCode = upstream.status;
  res.setHeader("content-type", "application/json");
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("cache-control", "no-store");
  res.end(payload);
};

module.exports.config = {
  api: { bodyParser: { sizeLimit: "12mb" } },
};
module.exports.maxDuration = 60;

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.setHeader("access-control-allow-origin", "*");
  res.end(JSON.stringify(obj));
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}
