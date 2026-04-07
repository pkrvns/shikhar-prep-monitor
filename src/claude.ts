// Client-side helper to talk to /api/claude (Vercel Edge Function).
// Never holds the API key.

export const CLAUDE_MODEL = "claude-opus-4-5";

export interface TextBlock { type: "text"; text: string; }
export interface ImageBlock {
  type: "image";
  source: { type: "base64"; media_type: "image/jpeg" | "image/png" | "image/webp" | "image/gif"; data: string };
}
export type ContentBlock = TextBlock | ImageBlock;

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string | ContentBlock[];
}

export interface ClaudeResponse {
  content?: Array<{ type: "text"; text: string }>;
  error?: { type: string; message: string };
}

export async function callClaude(opts: {
  messages: ClaudeMessage[];
  system?: string;
  max_tokens?: number;
  model?: string;
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  try {
    const r = await fetch("/api/claude", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: opts.model || CLAUDE_MODEL,
        max_tokens: opts.max_tokens || 2048,
        system: opts.system,
        messages: opts.messages,
      }),
    });
    const data = (await r.json()) as ClaudeResponse;
    if (!r.ok) {
      const msg = data?.error?.message || `HTTP ${r.status}`;
      return { ok: false, error: msg };
    }
    const text = data.content?.find(c => c.type === "text")?.text || "";
    return { ok: true, text };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

// Convert a File (from <input type="file">) into a base64 image block ready for Claude.
export async function fileToImageBlock(file: File): Promise<ImageBlock> {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
  type Allowed = (typeof allowed)[number];
  const mime = (allowed as readonly string[]).includes(file.type) ? (file.type as Allowed) : "image/jpeg";

  // Downscale large photos to keep request under ~3 MB and reduce token cost.
  const dataUrl = await downscaleImage(file, 1600);
  const base64 = dataUrl.split(",")[1] || "";
  return { type: "image", source: { type: "base64", media_type: mime, data: base64 } };
}

async function downscaleImage(file: File, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

// ---------- High-level helpers ----------

export interface AnalyzeWorkInput {
  taskTopic: string;
  taskSubject: string;
  taskChapter: string;
  images: ImageBlock[];
  studentName?: string;
}

export interface AnalyzeWorkResult {
  verdict: "correct" | "partial" | "incorrect";
  marks_awarded: number;
  marks_max: number;
  summary: string;
  mistakes: Array<{
    type: "silly" | "concept" | "formula" | "time" | "reading";
    what_went_wrong: string;
    correct_approach: string;
  }>;
  next_steps: string;
}

export async function analyzeWork(input: AnalyzeWorkInput): Promise<{ ok: true; data: AnalyzeWorkResult } | { ok: false; error: string }> {
  const sys = `You are Shweta's AI assistant grading her son ${input.studentName || "Shikhar"}'s CBSE Class 12 work.
You are strict but encouraging, and you grade as a CBSE board examiner would.
Always respond with VALID JSON ONLY, no markdown fences, matching this exact schema:
{
  "verdict": "correct" | "partial" | "incorrect",
  "marks_awarded": number,
  "marks_max": number,
  "summary": "1-2 sentence overall comment",
  "mistakes": [
    {
      "type": "silly" | "concept" | "formula" | "time" | "reading",
      "what_went_wrong": "specific description",
      "correct_approach": "step-by-step correct method"
    }
  ],
  "next_steps": "1 sentence: what to practice next"
}
If the work is fully correct, return mistakes: [].`;

  const userText = `Task assigned today:
- Subject: ${input.taskSubject}
- Chapter: ${input.taskChapter}
- Topic: ${input.taskTopic}

The attached photo(s) are Shikhar's solved work for this task. Please grade and analyze.`;

  const result = await callClaude({
    system: sys,
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: userText },
          ...input.images,
        ],
      },
    ],
  });

  if (!result.ok) return { ok: false, error: result.error };

  try {
    const cleaned = result.text.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(cleaned) as AnalyzeWorkResult;
    return { ok: true, data: parsed };
  } catch {
    return { ok: false, error: "Claude response was not valid JSON. Raw: " + result.text.slice(0, 200) };
  }
}

export async function solveDoubt(question: string, image?: ImageBlock): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const sys = `You are a patient CBSE Class 12 tutor for Physics, Chemistry, and Maths.
Answer in clear, NCERT-style step-by-step format. Use simple language.
Show all formulas and substitutions. Highlight the final answer at the end.
Keep response concise and exam-focused.`;

  const content: ContentBlock[] = [{ type: "text", text: question || "Solve the problem in the image." }];
  if (image) content.push(image);

  return callClaude({
    system: sys,
    max_tokens: 2000,
    messages: [{ role: "user", content }],
  });
}

export interface DailyReportInput {
  date: string; // YYYY-MM-DD
  studentName: string;
  weekNum: number;
  weekLabel: string;
  tasksToday: Array<{ subject: string; topic: string; type: string; status: string }>;
  evaluationsToday: Array<{ subject: string; topic: string; verdict: string; marks: string; summary: string }>;
  errorsToday: Array<{ subject: string; topic: string; type: string; what: string }>;
}

export async function generateDailyReport(input: DailyReportInput): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const sys = `You are writing a warm, concise daily progress report for Shweta about her son ${input.studentName}'s CBSE Class 12 board prep.
Tone: factual, encouraging, actionable. Maximum 180 words. Use this exact structure with these section headers:

📊 TODAY (one sentence summary)
✅ STRENGTHS (1-2 bullets)
⚠️ WEAK SPOTS (1-2 bullets, be specific about chapters/concepts)
🎯 TOMORROW (1 actionable focus)

Do NOT use markdown formatting like ** or ##. Just plain text with the emoji headers and bullet • characters.`;

  const userText = `Date: ${input.date}
Week ${input.weekNum}: ${input.weekLabel}

TASKS ASSIGNED TODAY:
${input.tasksToday.map(t => `• [${t.status}] ${t.subject} — ${t.topic} (${t.type})`).join("\n") || "• None"}

EVALUATIONS TODAY:
${input.evaluationsToday.map(e => `• ${e.subject} — ${e.topic}: ${e.verdict} ${e.marks} — ${e.summary}`).join("\n") || "• None"}

ERRORS LOGGED TODAY:
${input.errorsToday.map(e => `• ${e.subject} (${e.type}): ${e.what}`).join("\n") || "• None"}

Write the daily report for Shweta.`;

  return callClaude({
    system: sys,
    max_tokens: 600,
    messages: [{ role: "user", content: userText }],
  });
}
