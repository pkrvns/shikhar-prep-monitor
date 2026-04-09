// Vercel Serverless Function (Node runtime) — Claude API proxy.
// The Anthropic API key is read from process.env.ANTHROPIC_API_KEY (set in
// Vercel → Project → Settings → Environment Variables). It NEVER appears in
// the client bundle or in source control.
//
// Client posts: { model?, system?, messages, max_tokens? }
// Returns Anthropic JSON pass-through.
//
// Switched off the Edge runtime (which has a hard 25-second wall on Hobby
// and was killing long multi-sub-topic doubt prompts with HTTP 504
// FUNCTION_INVOCATION_TIMEOUT). Node runtime supports up to 60 s on Hobby
// via the maxDuration export below — enough headroom for the slowest
// Claude responses we're sending.

import type { IncomingMessage, ServerResponse } from "node:http";
import { Readable } from "node:stream";

export const config = {
  // 12 MB body cap covers ~3 photos at 3-4 MB each.
  api: { bodyParser: { sizeLimit: "12mb" } },
};
export const maxDuration = 60;

const DEFAULT_MODEL = "claude-opus-4-5";
const DEFAULT_MAX_TOKENS = 2048;

// Vercel Node functions inject a parsed `body` onto the request when the
// content-type is JSON, but it's not in the standard IncomingMessage type.
type VercelNodeRequest = IncomingMessage & { body?: unknown };

export default async function handler(
  req: VercelNodeRequest,
  res: ServerResponse,
): Promise<void> {
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
  let body: { model?: string; system?: string; messages?: unknown; max_tokens?: number; stream?: boolean } | null = null;
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

  // Defensive 60s wall on the upstream call. Vercel will already kill us at
  // maxDuration, but giving fetch its own AbortSignal lets us return a
  // friendlier error message before that happens.
  //
  // NOTE: we deliberately do NOT register a `req.on("close")` listener here
  // to abort on client disconnect. Vercel's bodyParser fully consumes and
  // ends the request stream before invoking this handler, so 'close' fires
  // immediately on the next tick — which would abort the upstream fetch
  // before it even starts and surface as HTTP 500. The 55 s timeout above
  // plus maxDuration:60 already prevent runaway functions, and for the
  // streaming path the response pipe naturally errors out when the client
  // disconnects, so the listener was redundant anyway.
  const ac = new AbortController();
  const upstreamTimeout = setTimeout(() => ac.abort(), 55_000);

  const wantStream = body.stream === true;

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
        stream: wantStream || undefined,
      }),
      signal: ac.signal,
    });
  } catch (e) {
    clearTimeout(upstreamTimeout);
    const aborted = (e as Error)?.name === "AbortError";
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

  // ----- STREAMING PATH -----
  // Anthropic returns its own SSE stream when stream:true. We forward those
  // bytes verbatim — the client parses message_delta events and renders
  // tokens as they arrive. No buffering on our side.
  if (wantStream && upstream.body) {
    res.statusCode = upstream.status;
    res.setHeader("content-type", upstream.status === 200 ? "text/event-stream" : "application/json");
    res.setHeader("cache-control", "no-store, no-transform");
    res.setHeader("access-control-allow-origin", "*");
    // x-accel-buffering: no disables Vercel/proxy response buffering so
    // tokens actually arrive incrementally instead of in one big flush.
    res.setHeader("x-accel-buffering", "no");
    res.setHeader("connection", "keep-alive");
    try {
      // Convert the Web ReadableStream from fetch into a Node Readable so
      // we can pipe it to the response. Works on Node 18+ (Vercel runtime).
      const nodeStream = Readable.fromWeb(upstream.body as unknown as Parameters<typeof Readable.fromWeb>[0]);
      nodeStream.on("error", (err: Error) => {
        try { res.end(); } catch { /* noop */ }
        console.error("stream error:", err);
      });
      nodeStream.pipe(res);
      nodeStream.on("end", () => clearTimeout(upstreamTimeout));
    } catch (e) {
      clearTimeout(upstreamTimeout);
      sendJson(res, 502, { error: { type: "stream_pipe_failed", message: e instanceof Error ? e.message : String(e) } });
    }
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

function sendJson(res: ServerResponse, status: number, obj: unknown): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.setHeader("access-control-allow-origin", "*");
  res.end(JSON.stringify(obj));
}

function readRawBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: string) => { data += chunk; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}
