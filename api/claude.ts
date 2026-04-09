// Vercel Serverless Function (Node runtime) — Claude API proxy.
// The Anthropic API key is read from process.env.ANTHROPIC_API_KEY (set in
// Vercel → Project → Settings → Environment Variables). It NEVER appears in
// the client bundle or in source control.
//
// Client posts: { model?, system?, messages, max_tokens? }
// Returns Anthropic JSON pass-through.
//
// IMPORTANT: This file deliberately avoids importing ANY Node built-in modules
// (including `import type`). Vercel's ncc bundler + TS compiler choke on
// unresolved node: specifiers even for type-only imports when @types/node is
// not installed, and Vercel deploys the broken output anyway — producing
// FUNCTION_INVOCATION_FAILED at runtime. Inline types sidestep the issue.

// Declare process so we don't need @types/node.
declare const process: { env: Record<string, string | undefined> };

export const config = {
  // 12 MB body cap covers ~3 photos at 3-4 MB each.
  api: { bodyParser: { sizeLimit: "12mb" } },
};
export const maxDuration = 60;

const DEFAULT_MODEL = "claude-opus-4-5";
const DEFAULT_MAX_TOKENS = 2048;

// Minimal inline types so we never need `import type` from "http".
interface Req {
  method?: string;
  body?: unknown;
  setEncoding(enc: string): void;
  on(event: string, cb: (...args: unknown[]) => void): void;
}
interface Res {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(data?: string): void;
}

export default async function handler(req: Req, res: Res): Promise<void> {
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

  // Vercel auto-parses JSON bodies for Node functions. If for any reason
  // it didn't (e.g. wrong content-type), parse manually from the raw stream.
  let body: { model?: string; system?: string; messages?: unknown; max_tokens?: number } | null = null;
  if (req.body && typeof req.body === "object") {
    body = req.body as unknown as typeof body;
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

  // Defensive 55s wall on the upstream call. Vercel will already kill us at
  // maxDuration (60s), but giving fetch its own AbortSignal lets us return a
  // friendlier error message before that happens.
  const ac = new AbortController();
  const upstreamTimeout = setTimeout(() => ac.abort(), 55_000);

  let upstream: Response;
  try {
    upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: body.model || DEFAULT_MODEL,
        max_tokens: body.max_tokens || DEFAULT_MAX_TOKENS,
        system: body.system,
        messages: body.messages,
      }),
      signal: ac.signal,
    });
  } catch (e: unknown) {
    clearTimeout(upstreamTimeout);
    const aborted = e instanceof Error && e.name === "AbortError";
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
  clearTimeout(upstreamTimeout);

  const text = await upstream.text();
  // Always return JSON to client. If upstream returned non-JSON, wrap it.
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
}

function sendJson(res: Res, status: number, obj: unknown): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.setHeader("access-control-allow-origin", "*");
  res.end(JSON.stringify(obj));
}

function readRawBody(req: Req): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: unknown) => { data += chunk; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}
