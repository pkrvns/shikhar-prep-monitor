// GET /api/data-load?key=shikhar-progress — load a single key
// GET /api/data-load?all=1 — load all shikhar-* and eval-* keys

module.exports = async function handler(req, res) {
  // CORS
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("access-control-allow-methods", "GET, OPTIONS");
    res.setHeader("access-control-allow-headers", "content-type");
    res.end();
    return;
  }

  if (req.method !== "GET") {
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

  const headers = { Authorization: `Bearer ${token}` };

  // Parse query params from URL
  const parsedUrl = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const key = parsedUrl.searchParams.get("key");
  const all = parsedUrl.searchParams.get("all");

  try {
    if (all === "1") {
      // Get all keys matching shikhar-* and eval-*
      const [r1, r2] = await Promise.all([
        fetch(`${url}/keys/shikhar-*`, { headers }).then(r => r.json()),
        fetch(`${url}/keys/eval-*`, { headers }).then(r => r.json()),
      ]);
      const keys = [...(r1.result || []), ...(r2.result || [])];
      if (keys.length === 0) {
        res.statusCode = 200;
        res.setHeader("content-type", "application/json");
        res.setHeader("access-control-allow-origin", "*");
        res.end(JSON.stringify({ ok: true, data: {} }));
        return;
      }
      // MGET all keys in one call
      const mgetArgs = keys.map(k => encodeURIComponent(k)).join("/");
      const mgetResp = await fetch(`${url}/mget/${mgetArgs}`, { headers });
      const mgetResult = await mgetResp.json();
      const data = {};
      const values = mgetResult.result || [];
      for (let i = 0; i < keys.length; i++) {
        if (values[i] !== null && values[i] !== undefined) {
          data[keys[i]] = decodeStoredValue(values[i]);
        }
      }
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.setHeader("access-control-allow-origin", "*");
      res.end(JSON.stringify({ ok: true, data }));
    } else if (key) {
      // Single key lookup
      const resp = await fetch(`${url}/get/${encodeURIComponent(key)}`, { headers });
      const result = await resp.json();
      let value = null;
      if (result.result !== null && result.result !== undefined) {
        value = decodeStoredValue(result.result);
      }
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.setHeader("access-control-allow-origin", "*");
      res.end(JSON.stringify({ ok: true, key, value }));
    } else {
      res.statusCode = 400;
      res.setHeader("content-type", "application/json");
      res.setHeader("access-control-allow-origin", "*");
      res.end(JSON.stringify({ error: "missing_key_or_all_param" }));
    }
  } catch (e) {
    res.statusCode = 502;
    res.setHeader("content-type", "application/json");
    res.setHeader("access-control-allow-origin", "*");
    res.end(JSON.stringify({ error: "upstash_error", message: e instanceof Error ? e.message : "unknown" }));
  }
};

// Decode a value pulled from Upstash. New writes are single-JSON-encoded
// (e.g. the string `"[1,2,3]"` for the array [1,2,3]), but older writes were
// double-encoded (e.g. `"\"[1,2,3]\""`) which JSON.parse only peels once,
// leaving a bare JSON-looking string. If the first parse yields a string
// that itself looks like JSON, peel a second time — this auto-heals any
// legacy corrupt values the moment the client syncs.
function decodeStoredValue(raw) {
  let value;
  try { value = JSON.parse(raw); } catch { return raw; }
  if (typeof value === "string") {
    const s = value.trimStart();
    if (s.startsWith("{") || s.startsWith("[") || s === "null" || s === "true" || s === "false" || /^-?\d/.test(s)) {
      try { value = JSON.parse(value); } catch { /* leave as string */ }
    }
  }
  return value;
}
