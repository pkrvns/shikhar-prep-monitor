// Minimal serverless function — no imports, no types, no dependencies.
// If this still returns FUNCTION_INVOCATION_FAILED, the issue is in
// Vercel's build cache or project config, not in our code.

export default function handler(_req: any, res: any) {
  res.statusCode = 200;
  res.setHeader("content-type", "application/json");
  res.setHeader("access-control-allow-origin", "*");
  res.end(JSON.stringify({ ok: true, time: Date.now() }));
}
