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
          try { data[keys[i]] = JSON.parse(values[i]); } catch { data[keys[i]] = values[i]; }
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
        try { value = JSON.parse(result.result); } catch { value = result.result; }
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
