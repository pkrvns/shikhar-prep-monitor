// Vercel Edge Function — Claude API proxy.
// The Anthropic API key is read from process.env.ANTHROPIC_API_KEY (set in
// Vercel → Project → Settings → Environment Variables). It NEVER appears in
// the client bundle or in source control.
//
// Client posts: { model?, system?, messages, max_tokens? }
// Returns Anthropic JSON pass-through.

export const config = { runtime: "edge" };

const DEFAULT_MODEL = "claude-opus-4-5";
const DEFAULT_MAX_TOKENS = 2048;
const MAX_BODY_BYTES = 12 * 1024 * 1024; // 12 MB hard cap (covers ~3 photos at 3-4 MB each)

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  const apiKey = (globalThis as { process?: { env?: { ANTHROPIC_API_KEY?: string } } }).process?.env?.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonResponse(
      { error: "missing_api_key", message: "ANTHROPIC_API_KEY env var not set on Vercel." },
      500,
    );
  }

  // Size check
  const lenHeader = req.headers.get("content-length");
  if (lenHeader && Number(lenHeader) > MAX_BODY_BYTES) {
    return jsonResponse({ error: "payload_too_large", limit_bytes: MAX_BODY_BYTES }, 413);
  }

  let body: {
    model?: string;
    system?: string;
    messages?: unknown;
    max_tokens?: number;
  };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonResponse({ error: "missing_messages" }, 400);
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
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
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "cache-control": "no-store",
    },
  });
}

function jsonResponse(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
  });
}
