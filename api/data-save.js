// POST /api/data-save — persist a key-value pair to Upstash Redis
// Body: { key: "shikhar-progress", value: { ... } }

module.exports = async function handler(req, res) {
  // CORS
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("access-control-allow-methods", "POST, OPTIONS");
    res.setHeader("access-control-allow-headers", "content-type");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "method_not_allowed" }));
    return;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "missing_upstash_config" }));
    return;
  }

  // Parse body
  let body = null;
  if (req.body && typeof req.body === "object") {
    body = req.body;
  } else {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString("utf8");
      body = raw ? JSON.parse(raw) : null;
    } catch {
      res.statusCode = 400;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ error: "invalid_json" }));
      return;
    }
  }

  if (!body || typeof body.key !== "string" || !body.key.startsWith("shikhar-") && !body.key.startsWith("eval-")) {
    res.statusCode = 400;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "invalid_key", message: "Key must start with shikhar- or eval-" }));
    return;
  }

  // Save to Upstash via REST API (SET key value).
  // We store the JSON-serialised value as a Redis string. Upstash's /set/{key}
  // endpoint uses the request body verbatim as the value — so we send the
  // JSON string once. (Double-stringifying was the old bug: arrays/objects
  // would round-trip back as stringified JSON, crashing .filter() callers.)
  const payload = JSON.stringify(body.value);
  try {
    const resp = await fetch(`${url}/set/${encodeURIComponent(body.key)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: payload,
    });
    const result = await resp.json();
    res.statusCode = 200;
    res.setHeader("content-type", "application/json");
    res.setHeader("access-control-allow-origin", "*");
    res.end(JSON.stringify({ ok: true, result }));
  } catch (e) {
    res.statusCode = 502;
    res.setHeader("content-type", "application/json");
    res.setHeader("access-control-allow-origin", "*");
    res.end(JSON.stringify({ error: "upstash_error", message: e instanceof Error ? e.message : "unknown" }));
  }
};
