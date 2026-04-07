import { useState, useEffect, useCallback, useRef } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { SYLLABUS_LINKS, SAMPLE_PAPERS, PYQ_LINKS, GENERAL_RESOURCES, FORMULAS, PYQ_PRIORITIES, TEST_PAPERS, TAG_COLORS, type LinkSection } from "./data";
import { analyzeWork, solveDoubt, generateDailyReport, suggestErrorFix, fileToImageBlock, type ImageBlock, type AnalyzeWorkResult, type PriorAttemptCtx } from "./claude";

type Subject = "physics" | "chemistry" | "maths";
type Phase = "foundation" | "practice" | "mock";
type TaskStatus = "pending" | "done" | "skipped";
type View = "dashboard" | "schedule" | "weekly" | "daily" | "errors" | "revisit" | "monthly" | "adjust" | "analytics" | "resources" | "formulas" | "evaluate" | "check";

interface DayTask {
  id: string;
  subject: Subject;
  chapter: number;
  chapterName: string;
  topic: string;
  type: "study" | "practice" | "revision" | "test" | "buffer";
  hours: number;
}

interface WeekData {
  week: number;
  phase: Phase;
  startDate: string;
  label: string;
  days: Record<string, DayTask[]>;
}

interface ProgressEntry {
  taskId: string;
  status: TaskStatus;
  date: string;
  notes: string;
  rating: number;                 // legacy 1-5; kept so Revisit/Analytics work
  // ---- Structured task review (new) ----
  completedSteps?: number[];      // indexes of study instructions Shikhar completed
  problemSteps?: number[];        // indexes of study instructions that caused trouble
  topicConfidence?: "good" | "average" | "bad"; // replaces the old emoji star rating
  completionNote?: string;        // optional 1-line free-text reflection
}

interface ErrorEntry {
  id: string;
  date: string;
  subject: Subject;
  chapter: string;
  topic: string;
  errorType: "silly" | "concept" | "time" | "formula" | "reading";
  question: string;
  whatWentWrong: string;
  correctApproach: string;
  resolved: boolean;
  claudeTip?: string; // personalised improvement suggestion from Claude
}

// One Claude analysis of one upload of one task. Many submissions can exist
// for the same (taskId, date) pair — that's how we track improvement.
interface WorkSubmission {
  id: string;
  taskId: string;
  date: string;          // YYYY-MM-DD the assignment is FOR
  submittedAt: string;   // ISO timestamp of upload
  attemptNum: number;    // 1, 2, 3...
  verdict: "correct" | "partial" | "incorrect";
  marksAwarded: number;
  marksMax: number;
  summary: string;
  mistakes: Array<{ type: string; what_went_wrong: string; correct_approach: string }>;
  nextSteps: string;
  improvement?: {
    direction: "improved" | "declined" | "same";
    fixed_mistakes: string[];
    repeated_mistakes: string[];
    new_mistakes: string[];
    note: string;
  };
}

const PHYS_CH = ["Electric Charges and Fields","Electrostatic Potential & Capacitance","Current Electricity","Moving Charges and Magnetism","Magnetism and Matter","Electromagnetic Induction","Alternating Currents","Electromagnetic Waves","Ray Optics & Optical Instruments","Wave Optics","Dual Nature of Radiation & Matter","Atoms","Nuclei","Semiconductor Electronics"];
const CHEM_CH = ["Solutions","Electrochemistry","Chemical Kinetics","d- and f-Block Elements","Coordination Compounds","Haloalkanes and Haloarenes","Alcohols, Phenols & Ethers","Aldehydes, Ketones & Carboxylic Acids","Amines","Biomolecules"];
const MATH_CH = ["Relations and Functions","Inverse Trigonometric Functions","Matrices","Determinants","Continuity & Differentiability","Applications of Derivatives","Integrals","Applications of Integrals","Differential Equations","Vectors","Three-Dimensional Geometry","Linear Programming","Probability"];

const SUBJ: Record<Subject, { bg: string; text: string; light: string; border: string; ring: string; gradient: string; icon: string }> = {
  physics: { bg: "bg-blue-600", text: "text-blue-600", light: "bg-blue-50", border: "border-blue-100", ring: "ring-blue-500/20", gradient: "from-blue-500 to-blue-600", icon: "Phy" },
  chemistry: { bg: "bg-emerald-600", text: "text-emerald-600", light: "bg-emerald-50", border: "border-emerald-100", ring: "ring-emerald-500/20", gradient: "from-emerald-500 to-emerald-600", icon: "Chm" },
  maths: { bg: "bg-violet-600", text: "text-violet-600", light: "bg-violet-50", border: "border-violet-100", ring: "ring-violet-500/20", gradient: "from-violet-500 to-violet-600", icon: "Mth" },
};

const PHASE_META: Record<Phase, { bg: string; text: string; activeBg: string; activeBorder: string; sw: number; ew: number; label: string; range: string; icon: string }> = {
  foundation: { bg: "bg-sky-50", text: "text-sky-700", activeBg: "bg-sky-100", activeBorder: "border-sky-400", sw: 1, ew: 17, label: "Foundation", range: "Week 1-17", icon: "I" },
  practice: { bg: "bg-amber-50", text: "text-amber-700", activeBg: "bg-amber-100", activeBorder: "border-amber-400", sw: 18, ew: 24, label: "Practice", range: "Week 18-24", icon: "II" },
  mock: { bg: "bg-rose-50", text: "text-rose-700", activeBg: "bg-rose-100", activeBorder: "border-rose-400", sw: 25, ew: 28, label: "Mocks", range: "Week 25-28", icon: "III" },
};

const TYPE_BADGE: Record<string, string> = {
  test: "bg-red-50 text-red-600 ring-1 ring-red-500/10",
  practice: "bg-amber-50 text-amber-600 ring-1 ring-amber-500/10",
  revision: "bg-purple-50 text-purple-600 ring-1 ring-purple-500/10",
  study: "bg-sky-50 text-sky-600 ring-1 ring-sky-500/10",
  buffer: "bg-gray-50 text-gray-500 ring-1 ring-gray-500/10",
};

function mkTask(w: number, d: string, s: Subject, ch: number, topic: string, type: DayTask["type"], hrs: number, idx: number): DayTask {
  const chs = s === "physics" ? PHYS_CH : s === "chemistry" ? CHEM_CH : MATH_CH;
  return { id: `w${w}-${d}-${s}-${idx}`, subject: s, chapter: ch, chapterName: chs[ch - 1] || "Revision", topic, type, hours: hrs };
}

function generateSchedule(): WeekData[] {
  const weeks: WeekData[] = [];
  const startDate = new Date(2026, 3, 6);
  function weekRange(w: number): string {
    const s = new Date(startDate); s.setDate(s.getDate() + (w - 1) * 7);
    const e = new Date(s); e.setDate(e.getDate() + 5);
    return `${s.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} - ${e.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`;
  }
  const foundation = [
    { p: 1, c: 1, m: 1, l: "Electrostatics I + Solutions + Relations" },
    { p: 2, c: 2, m: 2, l: "Electrostatics II + Electrochemistry + Inv Trig" },
    { p: 3, c: 3, m: 3, l: "Current Electricity + Kinetics + Matrices" },
    { p: 4, c: 4, m: 4, l: "Moving Charges + d&f Block + Determinants" },
    { p: 5, c: 5, m: 5, l: "Magnetism + Coord Compounds + Continuity" },
    { p: 0, c: 0, m: 0, l: "BUFFER - Revision Week 1-5", b: true },
    { p: 6, c: 6, m: 6, l: "EMI + Haloalkanes + App of Derivatives" },
    { p: 7, c: 7, m: 7, l: "AC + Alcohols/Phenols + Integrals I" },
    { p: 8, c: 8, m: 7, l: "EM Waves + Aldehydes/Ketones + Integrals II" },
    { p: 9, c: 9, m: 8, l: "Ray Optics + Amines + App of Integrals" },
    { p: 10, c: 10, m: 9, l: "Wave Optics + Biomolecules + Diff Equations" },
    { p: 0, c: 0, m: 0, l: "BUFFER - Revision Week 7-11", b: true },
    { p: 11, c: 0, m: 10, l: "Dual Nature + Vectors (Chem revision)" },
    { p: 12, c: 0, m: 11, l: "Atoms + 3D Geometry (Chem revision)" },
    { p: 13, c: 0, m: 12, l: "Nuclei + Linear Programming (Chem revision)" },
    { p: 14, c: 0, m: 13, l: "Semiconductors + Probability (Chem revision)" },
    { p: 0, c: 0, m: 0, l: "BUFFER - Full syllabus review", b: true },
  ] as Array<{ p: number; c: number; m: number; l: string; b?: boolean }>;
  foundation.forEach((f, i) => {
    const w = i + 1;
    const d: Record<string, DayTask[]> = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
    if (f.b) {
      d.Mon = [mkTask(w, "Mon", "physics", 0, "Revision: Physics weak areas", "revision", 3, 0)];
      d.Tue = [mkTask(w, "Tue", "chemistry", 0, "Revision: Chemistry weak areas", "revision", 3, 0)];
      d.Wed = [mkTask(w, "Wed", "maths", 0, "Revision: Maths weak areas", "revision", 3, 0)];
      d.Thu = [mkTask(w, "Thu", "physics", 0, "Practice: Numericals", "practice", 3, 0)];
      d.Fri = [mkTask(w, "Fri", "chemistry", 0, "Practice: Reactions", "practice", 3, 0)];
      d.Sat = [mkTask(w, "Sat", "maths", 0, "Practice: Mixed Problems", "practice", 3, 0)];
    } else {
      if (f.p > 0) { d.Mon = [mkTask(w, "Mon", "physics", f.p, `${PHYS_CH[f.p - 1]} - Theory+NCERT`, "study", 3, 0)]; d.Tue = [mkTask(w, "Tue", "physics", f.p, `${PHYS_CH[f.p - 1]} - Numericals`, "practice", 3, 0)]; }
      if (f.c > 0) { d.Wed = [mkTask(w, "Wed", "chemistry", f.c, `${CHEM_CH[f.c - 1]} - Theory+NCERT`, "study", 3, 0)]; d.Thu = [mkTask(w, "Thu", "chemistry", f.c, `${CHEM_CH[f.c - 1]} - Problems`, "practice", 3, 0)]; }
      else if (f.p > 0) { d.Wed = [mkTask(w, "Wed", "chemistry", 0, "Chemistry Revision", "revision", 2, 0)]; d.Thu = [mkTask(w, "Thu", "chemistry", 0, "Chemistry Numericals", "revision", 2, 0)]; }
      if (f.m > 0) { d.Fri = [mkTask(w, "Fri", "maths", f.m, `${MATH_CH[f.m - 1]} - Theory+Examples`, "study", 3, 0)]; d.Sat = [mkTask(w, "Sat", "maths", f.m, `${MATH_CH[f.m - 1]} - Exercises`, "practice", 3, 0)]; }
    }
    d.Sun = [mkTask(w, "Sun", "physics", f.p, "Weekly Test: Physics (1hr)", "test", 1, 0), mkTask(w, "Sun", "chemistry", f.c || 0, "Weekly Test: Chemistry (1hr)", "test", 1, 1), mkTask(w, "Sun", "maths", f.m, "Weekly Test: Maths (1hr)", "test", 1, 2)];
    weeks.push({ week: w, phase: "foundation", startDate: weekRange(w), label: f.l, days: d });
  });
  const practiceLabels = ["Physics - Electrostatics+Current+Magnetism", "Physics - Optics+Modern+Semi", "Chemistry - Physical Chemistry", "Chemistry - Organic+Inorganic", "Maths - Calculus Marathon", "Maths - Algebra+Vectors+3D+Prob", "Cross-Subject Mixed"];
  for (let i = 0; i < 7; i++) {
    const w = 18 + i;
    const d: Record<string, DayTask[]> = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
    const sj: Subject = i < 2 ? "physics" : i < 4 ? "chemistry" : i < 6 ? "maths" : "physics";
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((dn, di) => { const s: Subject = i === 6 ? (di < 2 ? "physics" : di < 4 ? "chemistry" : "maths") : sj; d[dn] = [mkTask(w, dn, s, 0, "Intensive PYQ+Numericals", "practice", 3, 0)]; });
    d.Sun = [mkTask(w, "Sun", "physics", 0, "Weekly Test: Physics", "test", 1, 0), mkTask(w, "Sun", "chemistry", 0, "Weekly Test: Chemistry", "test", 1, 1), mkTask(w, "Sun", "maths", 0, "Weekly Test: Maths", "test", 1, 2)];
    weeks.push({ week: w, phase: "practice", startDate: weekRange(w), label: practiceLabels[i], days: d });
  }
  for (let i = 0; i < 4; i++) {
    const w = 25 + i;
    const d: Record<string, DayTask[]> = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
    d.Mon = [mkTask(w, "Mon", "physics", 0, `Mock Test ${i + 1} - Physics (3hrs)`, "test", 3, 0)];
    d.Tue = [mkTask(w, "Tue", "physics", 0, "Mock Analysis+Revision", "revision", 3, 0)];
    d.Wed = [mkTask(w, "Wed", "chemistry", 0, `Mock Test ${i + 1} - Chemistry (3hrs)`, "test", 3, 0)];
    d.Thu = [mkTask(w, "Thu", "chemistry", 0, "Mock Analysis+Revision", "revision", 3, 0)];
    d.Fri = [mkTask(w, "Fri", "maths", 0, `Mock Test ${i + 1} - Maths (3hrs)`, "test", 3, 0)];
    d.Sat = [mkTask(w, "Sat", "maths", 0, "Mock Analysis+Error Journal", "revision", 3, 0)];
    d.Sun = [mkTask(w, "Sun", "physics", 0, "Rest+Light Revision", "revision", 2, 0)];
    weeks.push({ week: w, phase: "mock", startDate: weekRange(w), label: `MOCK TEST SERIES - Round ${i + 1}`, days: d });
  }
  return weeks;
}

// Schedule start: Apr 6, 2026 (Monday). Used for date-based "what's due by today" math.
const SCHEDULE_START = new Date(2026, 3, 6);
const DAY_INDEX: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
function taskCalDate(week: number, dayName: string): Date {
  const d = new Date(SCHEDULE_START);
  d.setDate(d.getDate() + (week - 1) * 7 + (DAY_INDEX[dayName] ?? 0));
  d.setHours(0, 0, 0, 0);
  return d;
}
function todayMidnight(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}
// Per-task-type checklist of study instructions. Module-level so both
// DailyView and the TaskCard review panel can use it.
function getTipInstructions(t: { type: DayTask["type"] }): string[] {
  if (t.type === "study") return [
    "Read the NCERT theory chapter completely before attempting any problem — do not skip any paragraph.",
    "Highlight every formula, definition, and key concept with a marker as you read.",
    "Solve all NCERT in-text (within-chapter) questions immediately after reading each section.",
    "Write a 5-line summary of the chapter in your own words at the end of the session.",
    "If something is unclear, note it down and bring it to Shweta ma'am before the next session.",
  ];
  if (t.type === "practice") return [
    "Close your notebook and attempt every problem from scratch — no peeking at solved examples.",
    "Set a timer for each problem: 3 min for 1-mark, 5 min for 2-mark, 10 min for 5-mark questions.",
    "Circle every problem you couldn't solve or took more than the allotted time — these are priority doubts.",
    "After finishing, verify answers one-by-one and write down exactly where you went wrong.",
    "Log any formula errors or concept mistakes in the Error Journal immediately.",
  ];
  if (t.type === "test") return [
    "Keep your phone in another room and sit at a clean desk — treat this as the actual board exam.",
    "Read the full question paper for 5 minutes before writing — plan which questions to attempt first.",
    "Attempt high-confidence questions first; come back to difficult ones after securing easy marks.",
    "Leave 10 minutes at the end strictly for revision and checking units/signs.",
    "After the test, score yourself honestly using the marking scheme and log mistakes in Error Journal.",
  ];
  if (t.type === "revision") return [
    "Pull out your previous notes and error journal for this chapter before starting.",
    "Focus 70% of time on topics you rated 1–2 in confidence; only skim topics rated 4–5.",
    "Re-derive all key formulas from scratch on a blank page — do not copy from notes.",
    "Solve at least 5 PYQ questions from this chapter to check your revision depth.",
    "Update your confidence rating for each topic after revision.",
  ];
  return [
    "Use this buffer time to complete any pending tasks from earlier in the week.",
    "If all tasks are done, do a quick 20-minute formula drill across all three subjects.",
    "Review your Error Journal — pick 3 unresolved errors and work through them.",
    "Rest properly if you have studied for 5+ hours today — sleep consolidates memory.",
  ];
}

// Map the new 3-way confidence onto the legacy 1-5 rating that Revisit and
// Analytics already understand. "bad" stays in the spaced-repetition zone.
const CONFIDENCE_TO_RATING: Record<"good" | "average" | "bad", number> = {
  good: 5,
  average: 3,
  bad: 1,
};

function realWeekFromToday(): number {
  const t = todayMidnight();
  if (t < SCHEDULE_START) return 1;
  const days = Math.floor((t.getTime() - SCHEDULE_START.getTime()) / 86400000);
  return Math.max(1, Math.min(28, Math.floor(days / 7) + 1));
}

function loadData<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}
function saveData(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error(e); }
}
function playBeep(freq = 880, dur = 0.2) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = freq; osc.type = "sine"; gain.gain.value = 0.12;
    osc.start(); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur); osc.stop(ctx.currentTime + dur);
  } catch {}
}

// ====== Shared UI Components ======
function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const base = "bg-white rounded-2xl border border-gray-100 shadow-sm";
  if (onClick) return <button onClick={onClick} className={`${base} hover:shadow-md hover:border-gray-200 active:scale-[0.98] transition-all duration-200 text-left w-full ${className}`}>{children}</button>;
  return <div className={`${base} ${className}`}>{children}</div>;
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center text-[16px] font-semibold px-2 py-0.5 rounded-md tracking-wide ${className}`}>{children}</span>;
}

// ====== TaskCardImpl ======
// Defined at module level so its component identity is stable across App
// re-renders. The structured-review draft state lives here, so a parent
// re-render (e.g. flash() toast) cannot wipe a half-filled review form.
type MarkTaskFn = (
  tid: string,
  st: TaskStatus,
  rat?: number,
  extras?: Partial<Pick<ProgressEntry, "completedSteps" | "problemSteps" | "topicConfidence" | "completionNote">>,
) => void;

function confLabel(c: "good" | "average" | "bad") {
  return c === "good" ? "Good" : c === "average" ? "Average" : "Bad";
}
function confColor(c: "good" | "average" | "bad") {
  return c === "good"
    ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
    : c === "average"
    ? "bg-amber-100 text-amber-700 ring-amber-200"
    : "bg-red-100 text-red-700 ring-red-200";
}

function TaskCardImpl({
  task,
  idx,
  entry,
  markTask,
}: {
  task: DayTask;
  idx: number;
  entry: ProgressEntry | undefined;
  markTask: MarkTaskFn;
}) {
  const isDone = entry?.status === "done";
  const isSkip = entry?.status === "skipped";
  const sc = SUBJ[task.subject];
  const steps = getTipInstructions(task);

  const [showReview, setShowReview] = useState(false);
  const [draftCompleted, setDraftCompleted] = useState<Set<number>>(() => new Set(entry?.completedSteps || []));
  const [draftProblems, setDraftProblems] = useState<Set<number>>(() => new Set(entry?.problemSteps || []));
  const [draftConfidence, setDraftConfidence] = useState<"good" | "average" | "bad" | "">(entry?.topicConfidence || "");
  const [draftNote, setDraftNote] = useState<string>(entry?.completionNote || "");

  // When the user clicks Edit on a previously-saved task, refill the draft
  // from the persisted entry. We only re-seed when the panel opens, never
  // while it's already open (so typing is never overwritten by re-renders).
  const openReview = () => {
    setDraftCompleted(new Set(entry?.completedSteps || []));
    setDraftProblems(new Set(entry?.problemSteps || []));
    setDraftConfidence(entry?.topicConfidence || "");
    setDraftNote(entry?.completionNote || "");
    setShowReview(true);
  };

  const toggleSet = (
    set: Set<number>,
    setter: (s: Set<number>) => void,
    i: number,
  ) => {
    const next = new Set(set);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setter(next);
  };

  const submitReview = () => {
    if (!draftConfidence) return;
    markTask(task.id, "done", CONFIDENCE_TO_RATING[draftConfidence], {
      completedSteps: Array.from(draftCompleted).sort((a, b) => a - b),
      problemSteps: Array.from(draftProblems).sort((a, b) => a - b),
      topicConfidence: draftConfidence,
      completionNote: draftNote.trim() || undefined,
    });
    setShowReview(false);
  };

  return (
    <div
      style={{ animationDelay: `${idx * 50}ms` }}
      className={`animate-fade-in-up rounded-2xl border p-3.5 transition-all duration-200 ${
        isDone
          ? "bg-gray-50/80 border-gray-100"
          : isSkip
          ? "bg-gray-50/50 border-gray-100 opacity-50"
          : `${sc.light} ${sc.border}`
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <Badge className={`bg-gradient-to-r ${sc.gradient} text-white uppercase`}>{sc.icon}</Badge>
            <Badge className={TYPE_BADGE[task.type] || TYPE_BADGE.buffer}>{task.type}</Badge>
            {task.chapter > 0 && <span className="text-[16px] text-gray-400 font-medium">Ch.{task.chapter}</span>}
          </div>
          <p className={`text-[17px] font-semibold leading-snug ${isDone ? "line-through text-gray-400" : "text-gray-800"}`}>{task.topic}</p>
          <p className="text-[17px] text-gray-400 mt-1">{task.hours}h &middot; {task.chapterName}</p>

          {entry?.topicConfidence && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ring-1 ${confColor(entry.topicConfidence)}`}>
                {confLabel(entry.topicConfidence)}
              </span>
              {entry.completedSteps && entry.completedSteps.length > 0 && (
                <span className="text-[11px] text-gray-500">{entry.completedSteps.length}/{steps.length} steps done</span>
              )}
              {entry.problemSteps && entry.problemSteps.length > 0 && (
                <span className="text-[11px] text-amber-600 font-semibold">{entry.problemSteps.length} problem{entry.problemSteps.length === 1 ? "" : "s"}</span>
              )}
            </div>
          )}
          {entry?.completionNote && (
            <p className="text-[12px] text-gray-500 italic mt-1.5">&ldquo;{entry.completionNote}&rdquo;</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {!isDone && !isSkip && (
            <>
              <button onClick={() => (showReview ? setShowReview(false) : openReview())} className="text-[17px] bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 active:scale-95 font-semibold transition-all shadow-sm shadow-brand-600/20">Done</button>
              <button onClick={() => markTask(task.id, "skipped")} className="text-[17px] text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-100 active:scale-95 font-medium transition-all">Skip</button>
            </>
          )}
          {isDone && (
            <>
              <button onClick={() => (showReview ? setShowReview(false) : openReview())} className="text-[14px] text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-50 active:scale-95 font-semibold transition-all">Edit</button>
              <button onClick={() => markTask(task.id, "pending")} className="text-[14px] text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-100 active:scale-95 font-medium transition-all">Undo</button>
            </>
          )}
          {isSkip && (
            <button onClick={() => markTask(task.id, "pending")} className="text-[17px] text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-100 active:scale-95 font-medium transition-all">Undo</button>
          )}
        </div>
      </div>

      {showReview && (
        <div className="mt-3 pt-3 border-t border-gray-200/60 space-y-4">
          <div>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-2">Study Instructions for {task.type}</p>
            <p className="text-[11px] text-gray-400 mb-2">Tick what was completed. Mark &#9888; on any step that gave trouble.</p>
            <ol className="space-y-1.5">
              {steps.map((step, i) => {
                const done = draftCompleted.has(i);
                const trouble = draftProblems.has(i);
                return (
                  <li key={i} className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSet(draftCompleted, setDraftCompleted, i)}
                      className={`w-6 h-6 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center text-[11px] font-bold transition-all active:scale-90 ${done ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 bg-white text-transparent"}`}
                      aria-label="Mark step done"
                    >&#10003;</button>
                    <button
                      type="button"
                      onClick={() => toggleSet(draftProblems, setDraftProblems, i)}
                      className={`w-6 h-6 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center text-[11px] font-bold transition-all active:scale-90 ${trouble ? "bg-amber-400 border-amber-400 text-white" : "border-gray-300 bg-white text-transparent"}`}
                      aria-label="Mark step as a problem"
                    >&#9888;</button>
                    <p className={`text-[13px] leading-snug flex-1 ${done ? "text-gray-700" : "text-gray-600"}`}>{step}</p>
                  </li>
                );
              })}
            </ol>
          </div>

          <div>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-2">How is this topic now?</p>
            <div className="grid grid-cols-3 gap-2">
              {(["good", "average", "bad"] as const).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setDraftConfidence(c)}
                  className={`text-[14px] py-2 rounded-xl font-bold transition-all active:scale-95 ring-1 ${draftConfidence === c ? confColor(c) : "bg-gray-50 text-gray-500 ring-gray-200 hover:bg-gray-100"}`}
                >
                  {c === "good" ? "👍 Good" : c === "average" ? "🤔 Average" : "👎 Bad"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-2">Note (optional)</p>
            <input
              type="text"
              value={draftNote}
              onChange={e => setDraftNote(e.target.value)}
              placeholder="One line — what to remember about this session"
              className="w-full text-[13px] text-gray-700 border border-gray-200 rounded-xl px-3 py-2 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={submitReview}
              disabled={!draftConfidence}
              className="flex-1 bg-brand-600 disabled:bg-gray-300 text-white text-[14px] py-2.5 rounded-xl font-semibold active:scale-[0.98] transition-all"
            >
              {isDone ? "Update Review" : "Save & Mark Done"}
            </button>
            <button
              type="button"
              onClick={() => setShowReview(false)}
              className="text-[13px] text-gray-400 px-3 py-2.5 rounded-xl hover:bg-gray-100 active:scale-95 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressRing({ pct, size = 48, stroke = 4, color = "#4f46e5" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
    </svg>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">{children}</h2>;
}

function Avatar({ name, src, size = 36, fallbackBg = "from-brand-500 to-brand-700", style }: { name: string; src?: string; size?: number; fallbackBg?: string; style?: React.CSSProperties }) {
  const [errored, setErrored] = useState(false);
  const initials = name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  const showImg = src && !errored;
  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center text-white font-bold shadow-md ${showImg ? "" : `bg-gradient-to-br ${fallbackBg}`}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36), ...style }}
      title={name}
      aria-label={name}
    >
      {showImg ? (
        <img src={src} alt={name} onError={() => setErrored(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl mb-3">{icon}</div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

// ====== MAIN APP ======
export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [schedule] = useState<WeekData[]>(() => generateSchedule());
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [selW, setSelW] = useState(1);
  const [actW, setActW] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const installDismissed = useRef(false);
  // Persist update-banner dismissal across reloads. Once user clicks Update or X
  // we hide the banner for 6 hours. A genuinely-newer SW after that window will
  // re-trigger needRefresh anyway.
  const [hideUpdate, setHideUpdate] = useState<boolean>(() => {
    try {
      const until = Number(localStorage.getItem("shikhar-update-dismissed-until") || "0");
      return Date.now() < until;
    } catch { return false; }
  });
  // Daily reports keyed by YYYY-MM-DD
  const [reports, setReports] = useState<Record<string, { text: string; generatedAt: string }>>({});
  const reportRunning = useRef(false);

  // ---------- CheckView state (lifted to App so it survives App re-renders) ----------
  // CheckView is defined inside App() which means it remounts on every parent
  // re-render (e.g. when addError or flash fires). Local useState inside CheckView
  // would be wiped. So we keep all of its state here.
  const [checkTab, setCheckTab] = useState<"work" | "doubt" | "report">("work");
  const [checkDate, setCheckDate] = useState<string>("");        // YYYY-MM-DD — set in init effect
  const [checkSelTaskId, setCheckSelTaskId] = useState<string>("");
  const [checkImages, setCheckImages] = useState<ImageBlock[]>([]);
  const [checkPreviews, setCheckPreviews] = useState<string[]>([]);
  const [checkAnalyzing, setCheckAnalyzing] = useState(false);
  const [checkResult, setCheckResult] = useState<AnalyzeWorkResult | null>(null);
  const [checkAnalyzeErr, setCheckAnalyzeErr] = useState<string>("");
  const [submissions, setSubmissions] = useState<WorkSubmission[]>([]);
  // Tracks which error rows are currently fetching a Claude improvement tip.
  const [tipLoadingId, setTipLoadingId] = useState<string>("");
  const [doubtQ, setDoubtQ] = useState("");
  const [doubtImg, setDoubtImg] = useState<ImageBlock | null>(null);
  const [doubtPreview, setDoubtPreview] = useState<string>("");
  const [doubtSolving, setDoubtSolving] = useState(false);
  const [doubtAns, setDoubtAns] = useState<string>("");
  const [doubtErr, setDoubtErr] = useState<string>("");

  // SW update handling
  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(r) { console.log("SW registered:", r); },
    onRegisterError(e) { console.log("SW error:", e); },
  });

  const persistDismissUpdate = () => {
    try {
      const sixHours = 6 * 60 * 60 * 1000;
      localStorage.setItem("shikhar-update-dismissed-until", String(Date.now() + sixHours));
    } catch {}
    setHideUpdate(true);
  };
  const doUpdate = () => {
    persistDismissUpdate();
    try { updateServiceWorker(true); } catch (e) { console.log("update err", e); }
    // Hard reload as a fallback in case the SW activation doesn't auto-reload
    setTimeout(() => { window.location.reload(); }, 800);
  };
  const dismissUpdate = () => persistDismissUpdate();

  // Online/offline detection
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  // Install prompt (Android Chrome)
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      if (!installDismissed.current) setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    (installPrompt as any).prompt();
    const { outcome } = await (installPrompt as any).userChoice;
    if (outcome === "accepted") { setInstallPrompt(null); setShowInstallBanner(false); }
  };

  const dismissInstall = () => {
    installDismissed.current = true;
    setShowInstallBanner(false);
  };

  useEffect(() => {
    setProgress(loadData("shikhar-progress", {}));
    setNotes(loadData("shikhar-notes", {}));
    // Always derive active week from today's real calendar — never trust stale localStorage value.
    const realW = realWeekFromToday();
    setActW(realW); setSelW(realW);
    saveData("shikhar-active-week", realW);
    setErrors(loadData("shikhar-errors", []));
    setReports(loadData("shikhar-reports", {}));
    setSubmissions(loadData("shikhar-submissions", []));
    // Default checkDate to today (local YYYY-MM-DD)
    const now = new Date();
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    setCheckDate(iso);
    setLoading(false);
  }, []);

  const flash = useCallback((m: string, f = 880) => { setToast(m); playBeep(f); setTimeout(() => setToast(""), 2200); }, []);
  const chgActW = useCallback((w: number) => { setActW(w); saveData("shikhar-active-week", w); flash(`Week ${w} active`, 660); }, [flash]);

  const markTask = useCallback((tid: string, st: TaskStatus, rat = 0, extras?: Partial<Pick<ProgressEntry, "completedSteps" | "problemSteps" | "topicConfidence" | "completionNote">>) => {
    setProgress(prev => {
      // Preserve any existing review fields when toggling status only.
      const existing = prev[tid];
      const merged: ProgressEntry = {
        taskId: tid,
        status: st,
        date: new Date().toISOString(),
        notes: existing?.notes || "",
        rating: rat || existing?.rating || 0,
        completedSteps: extras?.completedSteps ?? existing?.completedSteps,
        problemSteps: extras?.problemSteps ?? existing?.problemSteps,
        topicConfidence: extras?.topicConfidence ?? existing?.topicConfidence,
        completionNote: extras?.completionNote ?? existing?.completionNote,
      };
      const u = { ...prev, [tid]: merged };
      saveData("shikhar-progress", u);
      return u;
    });
    flash(st === "done" ? "Marked complete" : st === "skipped" ? "Skipped" : "Restored", st === "done" ? 880 : 440);
  }, [flash]);

  const updNote = useCallback((k: string, t: string) => { setNotes(prev => { const u = { ...prev, [k]: t }; saveData("shikhar-notes", u); return u; }); }, []);

  const addError = useCallback((entry: Omit<ErrorEntry, "id" | "date" | "resolved">) => {
    setErrors(prev => { const u = [{ ...entry, id: `err-${Date.now()}`, date: new Date().toISOString(), resolved: false }, ...prev]; saveData("shikhar-errors", u); return u; });
    flash("Error logged", 550);
  }, [flash]);

  const toggleErrorResolved = useCallback((id: string) => { setErrors(prev => { const u = prev.map(e => e.id === id ? { ...e, resolved: !e.resolved } : e); saveData("shikhar-errors", u); return u; }); }, []);
  const deleteError = useCallback((id: string) => { setErrors(prev => { const u = prev.filter(e => e.id !== id); saveData("shikhar-errors", u); return u; }); flash("Removed", 440); }, [flash]);

  // Ask Claude for a personalised improvement tip on a specific error entry.
  const fetchErrorTip = useCallback(async (id: string) => {
    const target = errors.find(e => e.id === id);
    if (!target) return;
    setTipLoadingId(id);
    const res = await suggestErrorFix({
      subject: target.subject,
      chapter: target.chapter,
      topic: target.topic,
      errorType: target.errorType,
      whatWentWrong: target.whatWentWrong,
      correctApproach: target.correctApproach,
      studentName: "Shikhar",
    });
    setTipLoadingId("");
    if (res.ok) {
      setErrors(prev => {
        const u = prev.map(e => e.id === id ? { ...e, claudeTip: res.text.trim() } : e);
        saveData("shikhar-errors", u);
        return u;
      });
    } else {
      flash("Tip failed: " + res.error.slice(0, 30), 330);
    }
  }, [errors, flash]);

  const allTasks = schedule.flatMap(w => Object.values(w.days).flat());
  const totalT = allTasks.length;
  const doneT = allTasks.filter(t => progress[t.id]?.status === "done").length;
  const skipT = allTasks.filter(t => progress[t.id]?.status === "skipped").length;
  const pctAll = totalT > 0 ? Math.round((doneT / totalT) * 100) : 0;

  const sStats = (s: Subject) => { const st = allTasks.filter(t => t.subject === s); const sd = st.filter(t => progress[t.id]?.status === "done").length; return { total: st.length, done: sd, pct: st.length ? Math.round((sd / st.length) * 100) : 0 }; };
  const wProg = (w: WeekData) => { const wt = Object.values(w.days).flat(); const wd = wt.filter(t => progress[t.id]?.status === "done").length; return { total: wt.length, done: wd, pct: wt.length ? Math.round((wd / wt.length) * 100) : 0 }; };
  const curPh: Phase = actW <= 17 ? "foundation" : actW <= 24 ? "practice" : "mock";
  // Date-based "behind": count tasks whose scheduled calendar date is on or BEFORE yesterday
  // and are still neither done nor skipped. Today's tasks are not yet counted as behind.
  const behind = (() => {
    const today = todayMidnight();
    let count = 0;
    schedule.forEach(w => {
      Object.entries(w.days).forEach(([day, tasks]) => {
        const d = taskCalDate(w.week, day);
        if (d < today) {
          tasks.forEach(t => {
            const st = progress[t.id]?.status;
            if (st !== "done" && st !== "skipped") count++;
          });
        }
      });
    });
    return count;
  })();

  const getRevisitItems = () => {
    const weak = Object.values(progress).filter(p => p.status === "done" && p.rating > 0 && p.rating <= 2);
    const items: Array<{ task: DayTask; entry: ProgressEntry; revisitDates: string[]; urgency: "overdue" | "today" | "upcoming" | "done" }> = [];
    weak.forEach(entry => {
      const task = allTasks.find(t => t.id === entry.taskId); if (!task) return;
      const dd = new Date(entry.date);
      const r1 = new Date(dd); r1.setDate(r1.getDate() + 3);
      const r2 = new Date(dd); r2.setDate(r2.getDate() + 7);
      const r3 = new Date(dd); r3.setDate(r3.getDate() + 14);
      const revisitDates = [r1, r2, r3].map(d => d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }));
      const now = new Date();
      const nr = r1 > now ? r1 : r2 > now ? r2 : r3 > now ? r3 : null;
      let urgency: typeof items[0]["urgency"] = "done";
      if (nr) { const diff = Math.floor((nr.getTime() - now.getTime()) / 86400000); urgency = diff < 0 ? "overdue" : diff === 0 ? "today" : "upcoming"; }
      items.push({ task, entry, revisitDates, urgency });
    });
    items.sort((a, b) => ({ overdue: 0, today: 1, upcoming: 2, done: 3 })[a.urgency] - ({ overdue: 0, today: 1, upcoming: 2, done: 3 })[b.urgency]);
    return items;
  };

  const ph = sStats("physics"), ch = sStats("chemistry"), ma = sStats("maths");

  // ---------- Daily Report helpers ----------
  const fmtTodayISO = useCallback(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const buildReportInput = useCallback((dateISO: string) => {
    const realW = realWeekFromToday();
    const week = schedule[realW - 1];
    // Find tasks scheduled for that calendar date
    const targetDate = new Date(dateISO + "T00:00:00");
    const tasksToday: Array<{ subject: string; topic: string; type: string; status: string }> = [];
    schedule.forEach(w => {
      Object.entries(w.days).forEach(([day, tasks]) => {
        const d = taskCalDate(w.week, day);
        if (d.getTime() === targetDate.getTime()) {
          tasks.forEach(t => {
            const st = progress[t.id]?.status || "pending";
            tasksToday.push({ subject: t.subject, topic: t.topic, type: t.type, status: st });
          });
        }
      });
    });
    // Evaluations from EvaluateView (eval-w*-*) — coarse summary
    const evaluationsToday: Array<{ subject: string; topic: string; verdict: string; marks: string; summary: string }> = [];
    // Errors logged today
    const errorsToday = errors
      .filter(e => e.date.slice(0, 10) === dateISO)
      .map(e => ({ subject: e.subject, topic: e.topic, type: e.errorType, what: e.whatWentWrong }));
    return {
      date: dateISO,
      studentName: "Shikhar",
      weekNum: realW,
      weekLabel: week?.label || "",
      tasksToday,
      evaluationsToday,
      errorsToday,
    };
  }, [schedule, progress, errors]);

  const runDailyReport = useCallback(async (dateISO?: string) => {
    if (reportRunning.current) return;
    const date = dateISO || fmtTodayISO();
    reportRunning.current = true;
    try {
      const input = buildReportInput(date);
      const res = await generateDailyReport(input);
      if (res.ok) {
        setReports(prev => {
          const u = { ...prev, [date]: { text: res.text, generatedAt: new Date().toISOString() } };
          saveData("shikhar-reports", u);
          return u;
        });
        flash("Daily report ready", 660);
      } else {
        flash("Report failed: " + res.error.slice(0, 30), 330);
      }
    } finally {
      reportRunning.current = false;
    }
  }, [buildReportInput, fmtTodayISO, flash]);

  // Auto-generate report on app open if it's >= 21:00 IST and today's report is missing.
  useEffect(() => {
    if (loading) return;
    const todayISO = fmtTodayISO();
    if (reports[todayISO]) return;
    const now = new Date();
    if (now.getHours() < 21) return; // wait until 9 PM
    // Fire and forget
    runDailyReport(todayISO);
  }, [loading, reports, runDailyReport, fmtTodayISO]);

  // Re-pick the first task whenever checkDate changes (or on initial load).
  // MUST be declared before the `if (loading) return` early return below
  // so hook order stays stable across renders.
  useEffect(() => {
    if (loading || !checkDate) return;
    const target = new Date(checkDate + "T00:00:00").getTime();
    let firstTaskId = "";
    for (const w of schedule) {
      for (const [day, ts] of Object.entries(w.days)) {
        if (taskCalDate(w.week, day).getTime() === target && ts[0]) {
          firstTaskId = ts[0].id;
          break;
        }
      }
      if (firstTaskId) break;
    }
    setCheckSelTaskId(firstTaskId);
    // Clear staged images / result when the user switches dates
    setCheckImages([]);
    setCheckPreviews([]);
    setCheckResult(null);
    setCheckAnalyzeErr("");
  }, [loading, checkDate, schedule]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 animate-pulse" />
        <p className="text-xs text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  );

  // ====== Task Card ======
  // TaskCard is a thin wrapper that injects App's progress + markTask into
  // the module-scoped TaskCardImpl. Defining the impl outside App means React
  // keeps it stable across App re-renders, so the review-form draft state
  // (checklist, problems, confidence, note) is NEVER wiped mid-edit.
  const TaskCard = ({ task, idx = 0 }: { task: DayTask; idx?: number }) => (
    <TaskCardImpl task={task} idx={idx} entry={progress[task.id]} markTask={markTask} />
  );

  // ====== Progress Bar ======
  const SubjectBar = ({ pct, color, label, detail }: { pct: number; color: string; label: string; detail: string }) => (
    <div className="flex items-center gap-3 py-2">
      <span className="text-[16px] font-semibold text-gray-700 w-20">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[17px] text-gray-400 font-medium w-12 text-right">{detail}</span>
      <span className="text-[16px] font-bold text-gray-700 w-10 text-right">{pct}%</span>
    </div>
  );

  // ====== VIEWS ======

  const DashboardView = () => (
    <div className="space-y-5 animate-fade-in-up">
      {/* Week Selector */}
      <Card className="p-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest">Active Week</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">{schedule[actW - 1]?.label}</p>
          </div>
          <div className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full">{schedule[actW - 1]?.startDate}</div>
        </div>
        {/* Phase-grouped week pills */}
        <div className="space-y-2">
          {(["foundation", "practice", "mock"] as Phase[]).map(phase => {
            const meta = PHASE_META[phase];
            const phaseWeeks = schedule.filter(w => w.phase === phase);
            return (
              <div key={phase}>
                <p className={`text-[17px] font-bold uppercase tracking-widest mb-1.5 ${meta.text}`}>{meta.label}</p>
                <div className="flex gap-1 flex-wrap">
                  {phaseWeeks.map(w => {
                    const isActive = w.week === actW;
                    const wp = wProg(w);
                    const done = wp.pct === 100;
                    return (
                      <button key={w.week} onClick={() => chgActW(w.week)}
                        className={`relative w-[30px] h-[30px] rounded-lg text-[17px] font-bold transition-all duration-200 active:scale-90 flex items-center justify-center
                          ${isActive
                            ? "bg-brand-600 text-white shadow-md shadow-brand-600/30 scale-110"
                            : done
                              ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 hover:ring-emerald-300"
                              : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          }`}>
                        {w.week}
                        {done && !isActive && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Hero Progress */}
      <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 rounded-2xl p-5 text-white shadow-xl shadow-brand-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-6 -mb-6" />
        <div className="relative flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold">Overall Progress</h2>
            <p className="text-[17px] text-white/60 mt-0.5">28 Weeks &middot; Apr 6 - Oct 18, 2026</p>
          </div>
          <div className="relative flex items-center justify-center">
            <ProgressRing pct={pctAll} size={56} stroke={5} color="#fff" />
            <span className="absolute text-sm font-black">{pctAll}%</span>
          </div>
        </div>
        <div className="h-2 bg-white/15 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${pctAll}%` }} />
        </div>
        <div className="flex justify-between mt-3 text-[17px] text-white/50 font-medium">
          <span>{doneT} completed</span><span>{skipT} skipped</span><span>{totalT - doneT - skipT} remaining</span>
        </div>
      </div>

      {/* Phase Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {(["foundation", "practice", "mock"] as Phase[]).map(p => {
          const info = PHASE_META[p]; const isAct = curPh === p;
          const pTasks = schedule.filter(w => w.phase === p).flatMap(w => Object.values(w.days).flat());
          const pDone = pTasks.filter(t => progress[t.id]?.status === "done").length;
          const pPct = pTasks.length ? Math.round((pDone / pTasks.length) * 100) : 0;
          return (
            <Card key={p} onClick={() => { setSelW(info.sw); setView("weekly"); }} className={`p-3 text-center ${isAct ? `${info.activeBg} ${info.activeBorder} border-2 shadow-md` : ""}`}>
              <div className={`w-7 h-7 rounded-lg ${isAct ? info.activeBg : "bg-gray-50"} flex items-center justify-center text-[16px] font-black ${info.text} mx-auto mb-1.5`}>{info.icon}</div>
              <p className={`text-[17px] font-bold ${isAct ? info.text : "text-gray-600"}`}>{info.label}</p>
              <p className={`text-[16px] mt-0.5 ${isAct ? info.text : "text-gray-400"}`}>{info.range}</p>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2 mx-1">
                <div className={`h-full rounded-full transition-all duration-700 ${isAct ? "bg-current" : "bg-gray-300"} ${info.text}`} style={{ width: `${pPct}%` }} />
              </div>
              <p className={`text-[17px] font-bold mt-1.5 ${isAct ? info.text : "text-gray-400"}`}>{pPct}%</p>
            </Card>
          );
        })}
      </div>

      {/* Subject Progress */}
      <Card className="px-4 py-3">
        <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subject Progress</p>
        <SubjectBar pct={ph.pct} color="bg-blue-500" label="Physics" detail={`${ph.done}/${ph.total}`} />
        <SubjectBar pct={ch.pct} color="bg-emerald-500" label="Chemistry" detail={`${ch.done}/${ch.total}`} />
        <SubjectBar pct={ma.pct} color="bg-violet-500" label="Maths" detail={`${ma.done}/${ma.total}`} />
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-2.5">
        {([
          { v: "weekly" as View, title: `Week ${actW}`, sub: schedule[actW - 1]?.label, icon: "\uD83D\uDCC5", act: () => { setSelW(actW); setView("weekly"); } },
          { v: "schedule" as View, title: "28-Week Plan", sub: "Full schedule", icon: "\uD83D\uDDD3\uFE0F", act: () => setView("schedule") },
          { v: "monthly" as View, title: "Monthly", sub: "Calendar view", icon: "\uD83D\uDCC6", act: () => setView("monthly") },
          { v: "analytics" as View, title: "Analytics", sub: `${pctAll}% overall`, icon: "\uD83D\uDCCA", act: () => setView("analytics") },
          { v: "errors" as View, title: "Error Journal", sub: `${errors.length} logged`, icon: "\uD83D\uDCDD", act: () => setView("errors") },
          { v: "revisit" as View, title: "Spaced Revisit", sub: `${getRevisitItems().filter(i => i.urgency === "overdue").length} overdue`, icon: "\uD83D\uDD04", act: () => setView("revisit") },
          { v: "resources" as View, title: "Resources", sub: "CBSE links & PYQs", icon: "\uD83C\uDF10", act: () => setView("resources") },
          { v: "evaluate" as View, title: "Evaluate Test", sub: "Score papers", icon: "\u2705", act: () => setView("evaluate") },
        ]).map(item => (
          <Card key={item.v} onClick={item.act} className="p-3.5">
            <div className="flex items-start gap-2.5">
              <span className="text-lg">{item.icon}</span>
              <div>
                <p className="text-[17px] font-semibold text-gray-800">{item.title}</p>
                <p className="text-[17px] text-gray-400 mt-0.5">{item.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {behind > 5 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-red-700">{behind} tasks behind schedule</p>
            <p className="text-[17px] text-red-500 mt-0.5">Use Adjust to catch up</p>
          </div>
          <button onClick={() => setView("adjust")} className="text-[17px] bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 active:scale-95 font-semibold transition-all shadow-sm shadow-red-600/20">Adjust</button>
        </div>
      )}
    </div>
  );

  const ScheduleView = () => (
    <div className="space-y-2.5 animate-fade-in-up">
      <SectionTitle>28-Week Schedule</SectionTitle>
      {schedule.map((w, i) => {
        const wp = wProg(w); const ic = w.week === actW; const info = PHASE_META[w.phase];
        return (
          <Card key={w.week} onClick={() => { setSelW(w.week); setView("weekly"); }} className={`p-3.5 ${ic ? "ring-2 ring-brand-500/20 border-brand-200" : ""}`} >
            <div style={{ animationDelay: `${i * 30}ms` }} className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Badge className={`${info.bg} ${info.text}`}>W{w.week}</Badge>
                  {ic && <Badge className="bg-brand-600 text-white">Active</Badge>}
                </div>
                <span className="text-[16px] text-gray-400 font-medium">{w.startDate}</span>
              </div>
              <p className="text-[17px] font-semibold text-gray-800 mt-1">{w.label}</p>
              <div className="flex items-center gap-2.5 mt-2.5">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${wp.pct === 100 ? "bg-emerald-500" : "bg-brand-500"}`} style={{ width: `${wp.pct}%` }} />
                </div>
                <span className="text-[17px] font-semibold text-gray-500">{wp.done}/{wp.total}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  const WeeklyView = () => {
    const w = schedule[selW - 1]; if (!w) return null;
    const wp = wProg(w); const info = PHASE_META[w.phase];
    return (
      <div className="space-y-4 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelW(Math.max(1, selW - 1))} className="w-9 h-9 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 flex items-center justify-center active:scale-90 transition-all shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="text-center">
            <Badge className={`${info.bg} ${info.text}`}>Week {w.week}</Badge>
            <p className="text-[16px] text-gray-400 mt-1 font-medium">{w.startDate}</p>
          </div>
          <button onClick={() => setSelW(Math.min(28, selW + 1))} className="w-9 h-9 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 flex items-center justify-center active:scale-90 transition-all shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
        <Card className="p-4">
          <p className="text-[17px] font-bold text-gray-800">{w.label}</p>
          <div className="flex items-center gap-3 mt-2.5">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${wp.pct === 100 ? "bg-emerald-500" : "bg-brand-500"}`} style={{ width: `${wp.pct}%` }} />
            </div>
            <span className="text-[17px] font-bold text-gray-700">{wp.pct}%</span>
          </div>
        </Card>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
          const tasks = w.days[day] || []; if (!tasks.length) return null;
          return (
            <div key={day}>
              <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">{day}</p>
              <div className="space-y-2">{tasks.map((t, i) => <TaskCard key={t.id} task={t} idx={i} />)}</div>
            </div>
          );
        })}
        <Card className="p-4">
          <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-2">Notes &middot; Week {w.week}</p>
          <textarea value={notes[`week-${w.week}`] || ""} onChange={e => updNote(`week-${w.week}`, e.target.value)} placeholder="Observations, tutor feedback, weak areas..."
            className="w-full text-[17px] text-gray-700 border border-gray-100 rounded-xl p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 bg-gray-50/50 placeholder:text-gray-300 transition-all" />
        </Card>
      </div>
    );
  };

  const DailyView = () => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    void fullDayNames;

    // Format Date as local YYYY-MM-DD (NOT toISOString — that gives UTC and breaks for IST)
    const fmtLocalISO = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    // Schedule range: 28 weeks starting Monday April 6, 2026
    const SCHEDULE_START = new Date(2026, 3, 6);
    const SCHEDULE_END = new Date(2026, 3, 6); SCHEDULE_END.setDate(SCHEDULE_END.getDate() + 28 * 7 - 1);

    const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
    const isoToday = fmtLocalISO(todayDate);

    // Date navigation state — defaults to today (clamped to schedule range)
    const [viewDateISO, setViewDateISO] = useState<string>(() => {
      if (todayDate < SCHEDULE_START) return fmtLocalISO(SCHEDULE_START);
      if (todayDate > SCHEDULE_END) return fmtLocalISO(SCHEDULE_END);
      return isoToday;
    });

    const viewDate = new Date(viewDateISO + "T00:00:00");
    const now = viewDate;
    const today = dayNames[viewDate.getDay()];
    const isToday = viewDateISO === isoToday;

    // Compute week number from viewDate relative to schedule start
    const daysFromStart = Math.floor((viewDate.getTime() - SCHEDULE_START.getTime()) / 86400000);
    const computedWeek = Math.floor(daysFromStart / 7) + 1;
    const inRange = computedWeek >= 1 && computedWeek <= 28;
    const w = inRange ? schedule[computedWeek - 1] : schedule[actW - 1];
    const ts = inRange ? (w.days[today] || []) : [];

    const shiftDate = (delta: number) => {
      const d = new Date(viewDate); d.setDate(d.getDate() + delta);
      if (d < SCHEDULE_START) return;
      if (d > SCHEDULE_END) return;
      setViewDateISO(fmtLocalISO(d));
    };
    const goToday = () => setViewDateISO(isoToday);
    const minISO = fmtLocalISO(SCHEDULE_START);
    const maxISO = fmtLocalISO(SCHEDULE_END);
    const canPrev = new Date(viewDate.getTime() - 86400000) >= SCHEDULE_START;
    const canNext = new Date(viewDate.getTime() + 86400000) <= SCHEDULE_END;

    const totalHours = ts.reduce((a, t) => a + t.hours, 0);
    const doneCount = ts.filter(t => progress[t.id]?.status === "done").length;
    const dayPct = ts.length > 0 ? Math.round((doneCount / ts.length) * 100) : 0;
    const subjects = [...new Set(ts.map(t => t.subject))];
    const doneHoursToday = ts.filter(t => progress[t.id]?.status === "done").reduce((a, t) => a + t.hours, 0);

    // Suggested time blocks
    const timeSlots: { time: string; task: DayTask }[] = [];
    let hour = 9; // start at 9 AM
    ts.forEach(t => {
      const startH = hour;
      const endH = hour + t.hours;
      const fmt = (h: number) => h < 12 ? `${h}AM` : h === 12 ? "12PM" : `${h - 12}PM`;
      timeSlots.push({ time: `${fmt(startH)} - ${fmt(endH)}`, task: t });
      hour = endH + 0.5; // 30 min break between
    });

    // Motivational based on day
    const dayMsg: Record<string, string> = {
      Mon: "Fresh start to the week! Physics day — build strong foundations.",
      Tue: "Keep the momentum going. Practice makes permanent.",
      Wed: "Midweek focus! Chemistry needs attention to detail.",
      Thu: "Push through — you're halfway there this week.",
      Fri: "Maths day! Solve, solve, solve. Speed + accuracy.",
      Sat: "Weekend grind. Extra practice pays off on exam day.",
      Sun: "Test day! Treat it like a real exam. Analyze every mistake.",
    };

    return (
      <div className="space-y-4 animate-fade-in-up">
        {/* Date Navigation */}
        <Card className="p-3">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => shiftDate(-1)}
              disabled={!canPrev}
              className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold text-lg transition-all"
              aria-label="Previous day"
            >
              ‹
            </button>
            <div className="flex-1 flex flex-col items-center">
              <input
                type="date"
                value={viewDateISO}
                min={minISO}
                max={maxISO}
                onChange={(e) => setViewDateISO(e.target.value)}
                className="text-[14px] font-bold text-gray-800 bg-transparent border-none focus:outline-none text-center cursor-pointer"
              />
              {!isToday && (
                <button
                  onClick={goToday}
                  className="text-[11px] text-brand-600 font-semibold mt-0.5 hover:underline"
                >
                  Jump to Today
                </button>
              )}
              {isToday && (
                <span className="text-[11px] text-emerald-600 font-semibold mt-0.5">● Today</span>
              )}
            </div>
            <button
              onClick={() => shiftDate(1)}
              disabled={!canNext}
              className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold text-lg transition-all"
              aria-label="Next day"
            >
              ›
            </button>
          </div>
        </Card>

        {/* Out-of-range warning */}
        {!inRange && (
          <Card className="p-3 bg-amber-50 border-amber-200">
            <p className="text-[13px] text-amber-700 font-semibold text-center">
              This date is outside the 28-week schedule (Apr 6 – Oct 18, 2026).
            </p>
          </Card>
        )}

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 rounded-2xl p-5 text-white shadow-xl shadow-brand-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-4 -mb-4" />
          <div className="relative">
            <p className="text-[17px] text-white/50 font-medium">{now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <h2 className="text-xl font-bold mt-1">{isToday ? "Today's Plan" : viewDate < todayDate ? "Past Day Plan" : "Upcoming Day Plan"}</h2>
            <p className="text-[17px] text-white/50 mt-0.5">Week {inRange ? computedWeek : actW} &middot; {w.label}</p>
            {ts.length > 0 && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
                <div>
                  <p className="text-xl font-black">{totalHours}h</p>
                  <p className="text-[17px] text-white/40 uppercase tracking-wider">Study Time</p>
                </div>
                <div>
                  <p className="text-xl font-black">{ts.length}</p>
                  <p className="text-[17px] text-white/40 uppercase tracking-wider">Tasks</p>
                </div>
                <div>
                  <p className="text-xl font-black">{subjects.length}</p>
                  <p className="text-[17px] text-white/40 uppercase tracking-wider">{subjects.length === 1 ? "Subject" : "Subjects"}</p>
                </div>
                <div className="ml-auto">
                  <div className="relative flex items-center justify-center">
                    <ProgressRing pct={dayPct} size={44} stroke={4} color="#fff" />
                    <span className="absolute text-[17px] font-black">{dayPct}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {ts.length === 0 ? (
          <EmptyState icon={"\uD83C\uDF1F"} title="No tasks scheduled" subtitle={isToday ? "Enjoy your day off!" : "No tasks were planned for this day."} />
        ) : (
          <>
            {/* Motivational Note */}
            <Card className="p-3.5 bg-amber-50/50 border-amber-100">
              <div className="flex gap-2.5 items-start">
                <span className="text-base mt-0.5">{"\uD83D\uDCA1"}</span>
                <p className="text-[16px] text-gray-700 leading-relaxed">{dayMsg[today] || "Stay focused and consistent!"}</p>
              </div>
            </Card>

            {/* Progress Summary */}
            {doneCount > 0 && (
              <Card className="p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest">{isToday ? "Today's Progress" : "Day Progress"}</p>
                  <span className="text-[17px] font-bold text-gray-600">{doneCount}/{ts.length} tasks &middot; {doneHoursToday}h done</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${dayPct === 100 ? "bg-emerald-500" : "bg-brand-500"}`} style={{ width: `${dayPct}%` }} />
                </div>
              </Card>
            )}

            {/* Subject Focus */}
            <Card className="p-3.5">
              <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">{isToday ? "Today's Focus" : "Day Focus"}</p>
              <div className="flex gap-2">
                {subjects.map(s => {
                  const sc = SUBJ[s];
                  const subTasks = ts.filter(t => t.subject === s);
                  const subHours = subTasks.reduce((a, t) => a + t.hours, 0);
                  return (
                    <div key={s} className={`flex-1 rounded-xl p-2.5 ${sc.light} ${sc.border} border`}>
                      <Badge className={`bg-gradient-to-r ${sc.gradient} text-white uppercase`}>{sc.icon}</Badge>
                      <p className="text-[16px] font-semibold text-gray-800 mt-1.5 capitalize">{s}</p>
                      <p className="text-[16px] text-gray-400">{subHours}h &middot; {subTasks.length} {subTasks.length === 1 ? "task" : "tasks"}</p>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Timetable */}
            <Card className="p-4">
              <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-3">Suggested Timetable</p>
              <div className="space-y-0">
                {timeSlots.map(({ time, task }, i) => {
                  const p_ = progress[task.id];
                  const isDone = p_?.status === "done";
                  const sc = SUBJ[task.subject];
                  return (
                    <div key={task.id} className="flex gap-3">
                      {/* Timeline */}
                      <div className="flex flex-col items-center" style={{ width: 20 }}>
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isDone ? "bg-emerald-500" : `bg-gradient-to-r ${sc.gradient}`} ring-2 ring-white`} />
                        {i < timeSlots.length - 1 && <div className={`w-0.5 flex-1 min-h-[40px] ${isDone ? "bg-emerald-200" : "bg-gray-200"}`} />}
                      </div>
                      {/* Content */}
                      <div className={`flex-1 pb-4 ${i < timeSlots.length - 1 ? "" : ""}`}>
                        <p className={`text-[16px] font-bold uppercase tracking-wider ${isDone ? "text-emerald-500" : sc.text}`}>{time}</p>
                        <p className={`text-[17px] font-semibold mt-0.5 ${isDone ? "line-through text-gray-400" : "text-gray-800"}`}>{task.topic}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge className={`bg-gradient-to-r ${sc.gradient} text-white uppercase`}>{sc.icon}</Badge>
                          <Badge className={TYPE_BADGE[task.type]}>{task.type}</Badge>
                          <span className="text-[16px] text-gray-400">{task.hours}h</span>
                        </div>
                        {isDone && <p className="text-[16px] text-emerald-500 font-semibold mt-1">{"\u2705"} Completed</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Detailed Task Cards */}
            <div>
              <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2.5">Tasks &middot; Mark Progress</p>
              <div className="space-y-2">{ts.map((t, i) => <TaskCard key={t.id} task={t} idx={i} />)}</div>
            </div>

            {/* Study Instructions */}
            <div className="rounded-2xl border-2 border-brand-400 bg-brand-50 overflow-hidden">
              <div className="bg-brand-500 px-4 py-3 flex items-center gap-2">
                <span className="text-white text-lg">📋</span>
                <p className="text-[15px] font-black text-white uppercase tracking-widest">Study Instructions {isToday ? "for Today" : `for ${viewDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}`}</p>
              </div>
              <div className="p-4 space-y-4">
                {ts.filter((t, i, arr) => arr.findIndex(x => x.type === t.type) === i).map(t => (
                  <div key={t.type}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${TYPE_BADGE[t.type]} font-bold uppercase`}>{t.type} session</Badge>
                    </div>
                    <ol className="space-y-1.5 pl-1">
                      {getTipInstructions(t).map((instr, i) => (
                        <li key={i} className="flex gap-2.5 items-start">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-500 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                          <p className="text-[14px] text-gray-700 leading-relaxed font-medium flex-1">{instr}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            {(() => {
              const unresolvedErrors = errors.filter(e => !e.resolved).length;
              const revisitItems = getRevisitItems();
              const overdueRevisit = revisitItems.filter(i => i.urgency === "overdue").length;
              const todayRevisit = revisitItems.filter(i => i.urgency === "today").length;
              const showRevisit = revisitItems.length > 0;
              return (
                <div className={`grid gap-2.5 ${showRevisit ? "grid-cols-2" : "grid-cols-1"}`}>
                  <Card onClick={() => setView("errors")} className="p-3.5">
                    <div className="flex items-start gap-2.5">
                      <span className="text-base">{"\uD83D\uDCDD"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[16px] font-semibold text-gray-800">Log Errors</p>
                          {unresolvedErrors > 0 && (
                            <span className="text-[11px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{unresolvedErrors}</span>
                          )}
                        </div>
                        <p className="text-[16px] text-gray-400 mt-0.5">
                          {unresolvedErrors > 0 ? `${unresolvedErrors} unresolved` : "Track mistakes from today"}
                        </p>
                      </div>
                    </div>
                  </Card>
                  {showRevisit && (
                    <Card onClick={() => setView("revisit")} className="p-3.5">
                      <div className="flex items-start gap-2.5">
                        <span className="text-base">{"\uD83D\uDD04"}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[16px] font-semibold text-gray-800">Revisit</p>
                            {overdueRevisit > 0 && (
                              <span className="text-[11px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{overdueRevisit}</span>
                            )}
                            {overdueRevisit === 0 && todayRevisit > 0 && (
                              <span className="text-[11px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{todayRevisit}</span>
                            )}
                          </div>
                          <p className="text-[16px] text-gray-400 mt-0.5">
                            {overdueRevisit > 0
                              ? `${overdueRevisit} overdue`
                              : todayRevisit > 0
                                ? `${todayRevisit} due today`
                                : `${revisitItems.length} scheduled`}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              );
            })()}
          </>
        )}
      </div>
    );
  };

  const ErrorsView = () => {
    const [showForm, setShowForm] = useState(false);
    const [subj, setSubj] = useState<Subject>("physics");
    const [chapInput, setChapInput] = useState("");
    const [topicInput, setTopicInput] = useState("");
    const [errType, setErrType] = useState<ErrorEntry["errorType"]>("concept");
    const [wrongInput, setWrongInput] = useState("");
    const [correctInput, setCorrectInput] = useState("");
    const [filter, setFilter] = useState<"all" | Subject>("all");

    const submit = () => {
      if (!chapInput || !wrongInput) { flash("Fill required fields", 330); return; }
      addError({ subject: subj, chapter: chapInput, topic: topicInput, errorType: errType, question: "", whatWentWrong: wrongInput, correctApproach: correctInput });
      setShowForm(false); setChapInput(""); setTopicInput(""); setWrongInput(""); setCorrectInput("");
    };
    const filtered = filter === "all" ? errors : errors.filter(e => e.subject === filter);
    const inputCls = "w-full text-[17px] text-gray-700 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 bg-white placeholder:text-gray-300 transition-all";

    return (
      <div className="space-y-4 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <SectionTitle>Error Journal</SectionTitle>
          <button onClick={() => setShowForm(!showForm)} className={`text-[17px] px-4 py-2 rounded-xl font-semibold active:scale-95 transition-all ${showForm ? "bg-gray-100 text-gray-600" : "bg-red-600 text-white shadow-sm shadow-red-600/20 hover:bg-red-700"}`}>
            {showForm ? "Cancel" : "+ Log Error"}
          </button>
        </div>

        {showForm && (
          <Card className="p-4 space-y-3 border-red-100 bg-red-50/30">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[16px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Subject</label>
                <select value={subj} onChange={e => setSubj(e.target.value as Subject)} className={inputCls}>
                  <option value="physics">Physics</option><option value="chemistry">Chemistry</option><option value="maths">Maths</option>
                </select>
              </div>
              <div>
                <label className="text-[16px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Error Type</label>
                <select value={errType} onChange={e => setErrType(e.target.value as ErrorEntry["errorType"])} className={inputCls}>
                  <option value="silly">Silly Mistake</option><option value="concept">Concept Gap</option><option value="time">Time Pressure</option><option value="formula">Formula Error</option><option value="reading">Misread Question</option>
                </select>
              </div>
            </div>
            <input value={chapInput} onChange={e => setChapInput(e.target.value)} placeholder="Chapter *" className={inputCls} />
            <input value={topicInput} onChange={e => setTopicInput(e.target.value)} placeholder="Topic (optional)" className={inputCls} />
            <textarea value={wrongInput} onChange={e => setWrongInput(e.target.value)} placeholder="What went wrong? *" className={`${inputCls} h-20 resize-none`} />
            <textarea value={correctInput} onChange={e => setCorrectInput(e.target.value)} placeholder="Correct approach (optional)" className={`${inputCls} h-20 resize-none`} />
            <button onClick={submit} className="w-full bg-red-600 text-white text-[17px] py-2.5 rounded-xl font-semibold hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm shadow-red-600/20">Save Error</button>
          </Card>
        )}

        {errors.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "physics", "chemistry", "maths"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`text-[17px] px-3 py-1.5 rounded-full font-semibold active:scale-95 transition-all ${filter === f ? "bg-brand-600 text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
                {f === "all" ? `All (${errors.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${errors.filter(e => e.subject === f).length})`}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 && !showForm && <EmptyState icon="\u2705" title="No errors logged" subtitle="Start logging mistakes to track patterns" />}

        {filtered.map((err, i) => (
          <Card key={err.id} className={`p-3.5 ${err.resolved ? "opacity-50" : ""}`}>
            <div style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-in-up">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <Badge className={`bg-gradient-to-r ${SUBJ[err.subject].gradient} text-white uppercase`}>{SUBJ[err.subject].icon}</Badge>
                    <Badge className="bg-gray-50 text-gray-500 ring-1 ring-gray-200">{err.errorType}</Badge>
                    {err.resolved && <Badge className="bg-emerald-50 text-emerald-600">Resolved</Badge>}
                  </div>
                  <p className="text-[17px] font-semibold text-gray-800">{err.chapter}{err.topic ? ` \u2014 ${err.topic}` : ""}</p>
                  <p className="text-[17px] text-red-500 mt-1.5 leading-relaxed"><b className="text-red-600">Wrong:</b> {err.whatWentWrong}</p>
                  {err.correctApproach && <p className="text-[17px] text-emerald-600 mt-1 leading-relaxed"><b>Correct:</b> {err.correctApproach}</p>}
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => toggleErrorResolved(err.id)} className={`text-[17px] px-3 py-1.5 rounded-lg active:scale-95 font-semibold transition-all ${err.resolved ? "bg-amber-50 text-amber-600" : "bg-emerald-600 text-white shadow-sm"}`}>
                    {err.resolved ? "Reopen" : "Resolve"}
                  </button>
                  <button onClick={() => deleteError(err.id)} className="text-[17px] text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-50 active:scale-95 font-medium transition-all">Remove</button>
                </div>
              </div>

              {/* Claude improvement tip */}
              {err.claudeTip ? (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[12px] font-bold text-brand-600 uppercase tracking-wider">{"\u2728"} Claude\u2019s Tip</p>
                    <button onClick={() => fetchErrorTip(err.id)} disabled={tipLoadingId === err.id}
                      className="text-[11px] text-gray-400 hover:text-brand-600 font-medium underline">
                      {tipLoadingId === err.id ? "Refreshing\u2026" : "Refresh"}
                    </button>
                  </div>
                  <p className="text-[14px] text-gray-700 leading-relaxed bg-brand-50/40 rounded-xl p-2.5 border border-brand-100/60">{err.claudeTip}</p>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button onClick={() => fetchErrorTip(err.id)} disabled={tipLoadingId === err.id}
                    className="w-full text-[13px] bg-brand-50 text-brand-700 font-semibold py-2 rounded-xl active:scale-[0.98] transition-all hover:bg-brand-100 disabled:opacity-60">
                    {tipLoadingId === err.id ? "Asking Claude\u2026" : "\u2728 Get Claude\u2019s improvement tip"}
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const RevisitView = () => {
    const items = getRevisitItems();
    const urgencyStyle = { overdue: "border-red-200 bg-red-50/50", today: "border-amber-200 bg-amber-50/50", upcoming: "border-blue-100 bg-blue-50/30", done: "border-gray-100 bg-gray-50" };
    const urgencyLabel = { overdue: "text-red-600 bg-red-50", today: "text-amber-600 bg-amber-50", upcoming: "text-blue-600 bg-blue-50", done: "text-gray-400 bg-gray-50" };
    return (
      <div className="space-y-4 animate-fade-in-up">
        <SectionTitle>Spaced Repetition</SectionTitle>
        <Card className="p-3.5 bg-brand-50/50 border-brand-100">
          <p className="text-[16px] text-brand-700 leading-relaxed">Topics rated 1-2 stars are automatically scheduled for revisits at <b>+3</b>, <b>+7</b>, and <b>+14</b> days.</p>
        </Card>
        {items.length === 0 && <EmptyState icon="\uD83C\uDFAF" title="No weak topics" subtitle="Topics rated 1-2 stars will appear here" />}
        {items.map(({ task, revisitDates, urgency }, i) => (
          <Card key={task.id} className={`p-3.5 ${urgencyStyle[urgency]}`}>
            <div style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-in-up">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Badge className={`bg-gradient-to-r ${SUBJ[task.subject].gradient} text-white uppercase`}>{SUBJ[task.subject].icon}</Badge>
                <Badge className={urgencyLabel[urgency]}>{urgency.toUpperCase()}</Badge>
              </div>
              <p className="text-[17px] font-semibold text-gray-800">{task.chapterName}</p>
              <p className="text-[17px] text-gray-400 mt-0.5">{task.topic}</p>
              <p className="text-[16px] text-gray-400 mt-2 font-medium">Revisit: {revisitDates.join(" \u2022 ")}</p>
              {(urgency === "overdue" || urgency === "today") && (
                <button onClick={() => markTask(task.id, "done", 4)} className="text-[17px] bg-emerald-600 text-white px-4 py-1.5 rounded-lg mt-2.5 hover:bg-emerald-700 active:scale-95 font-semibold transition-all shadow-sm shadow-emerald-600/20">Mark Revised</button>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const MonthlyView = () => {
    const months = [{ n: "April", w: [1, 2, 3, 4] }, { n: "May", w: [5, 6, 7, 8] }, { n: "June", w: [9, 10, 11, 12] }, { n: "July", w: [13, 14, 15, 16] }, { n: "August", w: [17, 18, 19, 20] }, { n: "September", w: [21, 22, 23, 24] }, { n: "October", w: [25, 26, 27, 28] }];
    return (
      <div className="space-y-3 animate-fade-in-up">
        <SectionTitle>Monthly Overview</SectionTitle>
        {months.map(m => {
          const mt = m.w.flatMap(wn => schedule[wn - 1] ? Object.values(schedule[wn - 1].days).flat() : []);
          const md = mt.filter(t => progress[t.id]?.status === "done").length;
          const pct = mt.length ? Math.round((md / mt.length) * 100) : 0;
          return (
            <Card key={m.n} className="p-4">
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-[17px] font-bold text-gray-800">{m.n} 2026</h3>
                <Badge className={`${pct >= 80 ? "bg-emerald-50 text-emerald-600" : pct >= 50 ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-500"}`}>{pct}%</Badge>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-gray-300"}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {m.w.map(wn => { const w = schedule[wn - 1]; if (!w) return null; const wp = wProg(w);
                  return (
                    <button key={wn} onClick={() => { setSelW(wn); setView("weekly"); }}
                      className={`rounded-xl p-2 text-center border hover:shadow-sm active:scale-95 transition-all ${wn === actW ? "border-brand-300 bg-brand-50 ring-1 ring-brand-500/10" : "border-gray-100 bg-gray-50/50 hover:bg-gray-50"}`}>
                      <p className="text-[16px] font-bold text-gray-500">W{wn}</p>
                      <p className={`text-[17px] font-bold mt-0.5 ${wp.pct === 100 ? "text-emerald-600" : wn === actW ? "text-brand-600" : "text-gray-400"}`}>{wp.pct}%</p>
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  const AnalyticsView = () => {
    const START = SCHEDULE_START;
    const today = todayMidnight();
    const daysSinceStart = Math.max(0, Math.floor((today.getTime() - START.getTime()) / 86400000));
    const currentWeekNum = realWeekFromToday();
    const prepStarted = today >= START;

    // Tasks that SHOULD be done by now — date-based: only tasks whose calendar date is ≤ today.
    // (Earlier logic counted ALL tasks of the current week which made every Monday inflate "pending" by 7-9.)
    const plannedTasks: DayTask[] = [];
    if (prepStarted) {
      schedule.forEach(w => {
        Object.entries(w.days).forEach(([day, tasks]) => {
          const d = taskCalDate(w.week, day);
          if (d <= today) plannedTasks.push(...tasks);
        });
      });
    }
    const plannedCount = plannedTasks.length;

    // Tasks actually done
    const actualDone = plannedTasks.filter(t => progress[t.id]?.status === "done").length;
    const actualSkipped = plannedTasks.filter(t => progress[t.id]?.status === "skipped").length;
    const pending = plannedCount - actualDone - actualSkipped;
    const completionRate = plannedCount > 0 ? Math.round((actualDone / plannedCount) * 100) : 0;

    // Subject-wise gap
    const subjectGap = (["physics", "chemistry", "maths"] as Subject[]).map(s => {
      const planned = plannedTasks.filter(t => t.subject === s);
      const done = planned.filter(t => progress[t.id]?.status === "done").length;
      const skipped = planned.filter(t => progress[t.id]?.status === "skipped").length;
      const gap = planned.length - done;
      const pct = planned.length > 0 ? Math.round((done / planned.length) * 100) : 0;
      return { subject: s, planned: planned.length, done, skipped, gap, pct };
    });

    // Task-type gap
    const typeGap = (["study", "practice", "test", "revision"] as DayTask["type"][]).map(type => {
      const planned = plannedTasks.filter(t => t.type === type);
      const done = planned.filter(t => progress[t.id]?.status === "done").length;
      const gap = planned.length - done;
      const pct = planned.length > 0 ? Math.round((done / planned.length) * 100) : 0;
      return { type, planned: planned.length, done, gap, pct };
    });

    // Weekly trend (last 6 weeks)
    const trendStart = Math.max(1, (prepStarted ? currentWeekNum : actW) - 5);
    const trendEnd = prepStarted ? currentWeekNum : actW;
    const weeklyTrend = [];
    for (let w = trendStart; w <= trendEnd; w++) {
      const week = schedule[w - 1];
      if (!week) continue;
      const tasks = Object.values(week.days).flat();
      const done = tasks.filter(t => progress[t.id]?.status === "done").length;
      const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
      weeklyTrend.push({ week: w, done, total: tasks.length, pct });
    }

    // Missed chapters (study tasks not done)
    const missedChapters = plannedTasks
      .filter(t => t.type === "study" && progress[t.id]?.status !== "done" && t.chapter > 0)
      .map(t => ({ subject: t.subject, chapter: t.chapter, name: t.chapterName, topic: t.topic }));
    // Deduplicate by chapter name
    const uniqueMissed = missedChapters.filter((ch, i, arr) => arr.findIndex(c => c.name === ch.name && c.subject === ch.subject) === i);

    // Hours analysis
    const plannedHours = plannedTasks.reduce((a, t) => a + t.hours, 0);
    const doneHours = plannedTasks.filter(t => progress[t.id]?.status === "done").reduce((a, t) => a + t.hours, 0);
    const totalProgramHours = allTasks.reduce((a, t) => a + t.hours, 0);

    // Status label
    const statusColor = completionRate >= 80 ? "text-emerald-600" : completionRate >= 50 ? "text-amber-600" : "text-red-600";
    const statusBg = completionRate >= 80 ? "bg-emerald-50" : completionRate >= 50 ? "bg-amber-50" : "bg-red-50";
    const statusLabel = completionRate >= 90 ? "Excellent" : completionRate >= 75 ? "On Track" : completionRate >= 50 ? "Needs Attention" : completionRate >= 25 ? "Behind Schedule" : prepStarted ? "Critical" : "Not Started";

    // Weakest subject
    const weakest = [...subjectGap].sort((a, b) => a.pct - b.pct)[0];

    return (
      <div className="space-y-5 animate-fade-in-up">
        <SectionTitle>Planned vs Actual</SectionTitle>

        {/* Status Banner */}
        <div className={`rounded-2xl p-4 border ${statusBg} ${completionRate >= 80 ? "border-emerald-200" : completionRate >= 50 ? "border-amber-200" : "border-red-200"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[16px] font-bold uppercase tracking-widest text-gray-400">Current Status</p>
              <p className={`text-lg font-black mt-0.5 ${statusColor}`}>{statusLabel}</p>
              <p className="text-[17px] text-gray-500 mt-1">
                {prepStarted
                  ? `You should be at Week ${currentWeekNum} by now`
                  : `Prep starts Apr 6, 2026 — ${Math.abs(daysSinceStart)} days to go`}
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <ProgressRing pct={completionRate} size={64} stroke={6} color={completionRate >= 80 ? "#10b981" : completionRate >= 50 ? "#f59e0b" : "#ef4444"} />
              <span className={`absolute text-sm font-black ${statusColor}`}>{completionRate}%</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2.5">
          <Card className="p-3.5 text-center">
            <p className="text-2xl font-black text-brand-600">{actualDone}</p>
            <p className="text-[16px] text-gray-400 font-semibold mt-0.5">Tasks Completed</p>
            <p className="text-[16px] text-gray-300 mt-0.5">of {plannedCount} planned</p>
          </Card>
          <Card className="p-3.5 text-center">
            <p className={`text-2xl font-black ${pending > 10 ? "text-red-500" : pending > 0 ? "text-amber-500" : "text-emerald-500"}`}>{pending}</p>
            <p className="text-[16px] text-gray-400 font-semibold mt-0.5">Tasks Pending</p>
            <p className="text-[16px] text-gray-300 mt-0.5">{actualSkipped} skipped</p>
          </Card>
          <Card className="p-3.5 text-center">
            <p className="text-2xl font-black text-blue-600">{doneHours}h</p>
            <p className="text-[16px] text-gray-400 font-semibold mt-0.5">Hours Invested</p>
            <p className="text-[16px] text-gray-300 mt-0.5">of {plannedHours}h planned</p>
          </Card>
          <Card className="p-3.5 text-center">
            <p className="text-2xl font-black text-violet-600">{totalProgramHours - doneHours}h</p>
            <p className="text-[16px] text-gray-400 font-semibold mt-0.5">Hours Remaining</p>
            <p className="text-[16px] text-gray-300 mt-0.5">of {totalProgramHours}h total</p>
          </Card>
        </div>

        {/* Subject-wise Gap Analysis */}
        <Card className="p-4">
          <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-3">Subject Gap Analysis</p>
          {subjectGap.map(s => {
            const sc = SUBJ[s.subject];
            const behindPct = s.planned > 0 ? 100 - s.pct : 0;
            return (
              <div key={s.subject} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Badge className={`bg-gradient-to-r ${sc.gradient} text-white uppercase`}>{sc.icon}</Badge>
                    <span className="text-[16px] font-semibold text-gray-700 capitalize">{s.subject}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[16px] font-bold text-gray-700">{s.done}/{s.planned}</span>
                    {s.gap > 0 && <span className="text-[16px] text-red-500 font-semibold ml-1.5">{s.gap} behind</span>}
                  </div>
                </div>
                {/* Stacked bar: done (green) + skipped (gray) + gap (red) */}
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  {s.done > 0 && <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${s.pct}%` }} />}
                  {s.skipped > 0 && <div className="h-full bg-gray-300 transition-all duration-700" style={{ width: `${s.planned > 0 ? (s.skipped / s.planned) * 100 : 0}%` }} />}
                  {behindPct > 0 && s.pct + (s.planned > 0 ? (s.skipped / s.planned) * 100 : 0) < 100 && (
                    <div className="h-full bg-red-200 transition-all duration-700 flex-1" />
                  )}
                </div>
                <div className="flex gap-3 mt-1">
                  <span className="text-[17px] text-gray-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Done {s.pct}%</span>
                  {s.skipped > 0 && <span className="text-[17px] text-gray-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />Skipped {s.skipped}</span>}
                  {s.gap > 0 && <span className="text-[17px] text-red-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-200 inline-block" />Gap {s.gap}</span>}
                </div>
              </div>
            );
          })}
        </Card>

        {/* Task Type Breakdown */}
        <Card className="p-4">
          <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-3">By Task Type</p>
          <div className="grid grid-cols-2 gap-2.5">
            {typeGap.map(t => (
              <div key={t.type} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <Badge className={TYPE_BADGE[t.type]}>{t.type}</Badge>
                  <span className="text-[17px] font-bold text-gray-600">{t.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${t.pct >= 80 ? "bg-emerald-500" : t.pct >= 50 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${t.pct}%` }} />
                </div>
                <p className="text-[16px] text-gray-400 mt-1">{t.done}/{t.planned} done</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Trend */}
        {weeklyTrend.length > 0 && (
          <Card className="p-4">
            <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-3">Weekly Completion Trend</p>
            <div className="flex items-end gap-1.5" style={{ height: 100 }}>
              {weeklyTrend.map(w => (
                <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[17px] font-bold text-gray-500">{w.pct}%</span>
                  <div className="w-full bg-gray-100 rounded-t-lg flex-1 relative" style={{ minHeight: 8 }}>
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-700 ${w.pct >= 80 ? "bg-emerald-500" : w.pct >= 50 ? "bg-amber-400" : w.pct > 0 ? "bg-red-400" : "bg-gray-200"}`}
                      style={{ height: `${Math.max(4, w.pct)}%` }}
                    />
                  </div>
                  <span className="text-[17px] text-gray-400 font-medium">W{w.week}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Missed Chapters */}
        {uniqueMissed.length > 0 && (
          <Card className="p-4 border-red-100 bg-red-50/30">
            <p className="text-[16px] font-bold text-red-400 uppercase tracking-widest mb-3">
              Missed Chapters ({uniqueMissed.length})
            </p>
            <p className="text-[17px] text-gray-500 mb-3">These study chapters were planned but not completed yet:</p>
            <div className="space-y-2">
              {uniqueMissed.map((ch, i) => (
                <div key={`${ch.subject}-${ch.name}-${i}`} className="flex items-center gap-2 bg-white rounded-xl p-2.5 border border-red-100">
                  <Badge className={`bg-gradient-to-r ${SUBJ[ch.subject].gradient} text-white uppercase`}>{SUBJ[ch.subject].icon}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-semibold text-gray-800 truncate">Ch.{ch.chapter} {ch.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recommendations */}
        <Card className="p-4 bg-brand-50/30 border-brand-100">
          <p className="text-[16px] font-bold text-brand-500 uppercase tracking-widest mb-3">Recommendations</p>
          <div className="space-y-2.5">
            {weakest && weakest.gap > 0 && (
              <div className="flex gap-2.5 items-start">
                <span className="text-sm mt-0.5">{"\u26A0\uFE0F"}</span>
                <p className="text-[16px] text-gray-700 leading-relaxed">
                  <b className="text-gray-900 capitalize">{weakest.subject}</b> is your weakest subject with {weakest.gap} pending tasks ({weakest.pct}% completion). Prioritize this in your next study sessions.
                </p>
              </div>
            )}
            {typeGap.find(t => t.type === "test" && t.pct < 60) && (
              <div className="flex gap-2.5 items-start">
                <span className="text-sm mt-0.5">{"\uD83D\uDCDD"}</span>
                <p className="text-[16px] text-gray-700 leading-relaxed">
                  Weekly tests completion is low. Regular testing is essential for exam readiness &mdash; don't skip test days.
                </p>
              </div>
            )}
            {uniqueMissed.length > 3 && (
              <div className="flex gap-2.5 items-start">
                <span className="text-sm mt-0.5">{"\uD83D\uDCD6"}</span>
                <p className="text-[16px] text-gray-700 leading-relaxed">
                  You have {uniqueMissed.length} missed study chapters. Consider using buffer weeks to catch up on the most weighted chapters first.
                </p>
              </div>
            )}
            {completionRate >= 80 && (
              <div className="flex gap-2.5 items-start">
                <span className="text-sm mt-0.5">{"\uD83C\uDF1F"}</span>
                <p className="text-[16px] text-gray-700 leading-relaxed">
                  Great progress! Maintain this pace and focus on converting weak-rated topics (Spaced Revisit) into strong ones.
                </p>
              </div>
            )}
            {!prepStarted && (
              <div className="flex gap-2.5 items-start">
                <span className="text-sm mt-0.5">{"\uD83D\uDE80"}</span>
                <p className="text-[16px] text-gray-700 leading-relaxed">
                  Preparation hasn't started yet. Use this time to set up your study environment and review Class 11 fundamentals.
                </p>
              </div>
            )}
            {doneHours > 0 && (
              <div className="flex gap-2.5 items-start">
                <span className="text-sm mt-0.5">{"\u23F1\uFE0F"}</span>
                <p className="text-[16px] text-gray-700 leading-relaxed">
                  Average pace: <b>{plannedCount > 0 ? (doneHours / Math.max(1, prepStarted ? currentWeekNum : 1)).toFixed(1) : 0}h/week</b>. Target is {(totalProgramHours / 28).toFixed(1)}h/week to finish on time.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  // ====== RESOURCES HUB ======
  const ResourcesView = () => {
    const [tab, setTab] = useState<"syllabus" | "sample" | "pyq" | "resources">("syllabus");
    const tabData: Record<string, LinkSection[]> = { syllabus: SYLLABUS_LINKS, sample: SAMPLE_PAPERS, pyq: PYQ_LINKS, resources: GENERAL_RESOURCES };
    const tabs = [
      { k: "syllabus" as const, label: "Syllabus" },
      { k: "sample" as const, label: "Papers" },
      { k: "pyq" as const, label: "PYQs" },
      { k: "resources" as const, label: "Resources" },
    ];
    return (
      <div className="space-y-4 animate-fade-in-up">
        <SectionTitle>CBSE Resource Hub</SectionTitle>
        <div className="flex gap-1.5">
          {tabs.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={`flex-1 text-[17px] py-2 rounded-xl font-semibold transition-all active:scale-95 ${tab === t.k ? "bg-brand-600 text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
              {t.label}
            </button>
          ))}
        </div>
        {tabData[tab]?.map((section, i) => (
          <Card key={i} className="p-4">
            <p className="text-[16px] font-bold text-gray-800 mb-2.5">{section.icon} {section.title}</p>
            <div className="space-y-2">
              {section.links.map((link, j) => (
                <div key={j} className="flex items-center gap-2">
                  {link.url !== "#" ? (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[16px] text-brand-600 hover:text-brand-800 underline underline-offset-2 flex-1">{link.label}</a>
                  ) : (
                    <span className="text-[16px] text-gray-600 flex-1">{link.label}</span>
                  )}
                  {link.tag && (
                    <span className={`text-[17px] font-bold px-1.5 py-0.5 rounded ${TAG_COLORS[link.tag]?.bg || "bg-gray-100"} ${TAG_COLORS[link.tag]?.text || "text-gray-600"}`}>{link.tag}</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // ====== FORMULA CARDS ======
  const FormulasView = () => {
    const [subFilter, setSubFilter] = useState<Subject | "all">("all");
    const [expandedCh, setExpandedCh] = useState<string | null>(null);
    const filtered = subFilter === "all" ? FORMULAS : FORMULAS.filter(f => f.subject === subFilter);
    const chapters = [...new Set(filtered.map(f => `${f.subject}-${f.chapterNum}-${f.chapter}`))];

    return (
      <div className="space-y-4 animate-fade-in-up">
        <SectionTitle>Formula Quick Reference</SectionTitle>
        {/* Subject Filter */}
        <div className="flex gap-1.5">
          {(["all", "physics", "chemistry", "maths"] as const).map(s => (
            <button key={s} onClick={() => setSubFilter(s)}
              className={`flex-1 text-[17px] py-2 rounded-xl font-semibold transition-all active:scale-95 ${subFilter === s ? "bg-brand-600 text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        {/* PYQ Priority Legend */}
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-[17px] text-gray-400 font-semibold">PYQ Priority:</span>
          {(["VERY HIGH", "HIGH", "MEDIUM"] as const).map(p => (
            <span key={p} className={`text-[17px] font-bold px-1.5 py-0.5 rounded ${TAG_COLORS[p].bg} ${TAG_COLORS[p].text}`}>{p}</span>
          ))}
        </div>
        {/* Chapter Accordion */}
        {chapters.map(chKey => {
          const [subj, numStr, ...rest] = chKey.split("-");
          const chName = rest.join("-");
          const chNum = parseInt(numStr);
          const chFormulas = filtered.filter(f => f.subject === subj && f.chapterNum === chNum);
          const chPriorities = PYQ_PRIORITIES.filter(p => p.subject === subj as Subject && p.chapterNum === chNum);
          const isOpen = expandedCh === chKey;
          const sc = SUBJ[subj as Subject];

          return (
            <Card key={chKey} className="overflow-hidden">
              <button onClick={() => setExpandedCh(isOpen ? null : chKey)} className="w-full p-3.5 flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <Badge className={`bg-gradient-to-r ${sc.gradient} text-white uppercase`}>{sc.icon}</Badge>
                  <div>
                    <p className="text-[16px] font-semibold text-gray-800">Ch.{chNum} {chName}</p>
                    <p className="text-[16px] text-gray-400">{chFormulas.length} formulas</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" className={`transition-transform ${isOpen ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {isOpen && (
                <div className="px-3.5 pb-3.5 space-y-3">
                  {/* Formulas */}
                  <div className="space-y-1.5">
                    {chFormulas.map((f, i) => (
                      <div key={i} className="flex items-baseline justify-between gap-2 py-1.5 border-b border-gray-50 last:border-0">
                        <span className="text-[17px] text-gray-500 font-medium">{f.name}</span>
                        <span className="text-[16px] font-mono font-semibold text-gray-800 text-right">{f.formula}</span>
                      </div>
                    ))}
                  </div>
                  {/* PYQ Priorities */}
                  {chPriorities.length > 0 && (
                    <div>
                      <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">PYQ Exam Priority</p>
                      {chPriorities.map((p, i) => (
                        <div key={i} className="flex items-center gap-2 py-1.5">
                          <span className={`text-[17px] font-bold px-1.5 py-0.5 rounded ${TAG_COLORS[p.priority].bg} ${TAG_COLORS[p.priority].text}`}>{p.priority}</span>
                          <span className="text-[17px] text-gray-700 flex-1">{p.topic}</span>
                          <span className="text-[16px] text-gray-400">{p.marks}m</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
        {filtered.length === 0 && <EmptyState icon={"\uD83D\uDCCB"} title="No formulas" subtitle="Select a subject to view formulas" />}
      </div>
    );
  };

  // ====== TEST EVALUATION ======
  const EvaluateView = () => {
    const [selWeek, setSelWeek] = useState(1);
    const [selSubj, setSelSubj] = useState<Subject>("physics");
    const [scores, setScores] = useState<Record<string, number>>({});
    const [saved, setSaved] = useState(false);

    const paper = TEST_PAPERS.find(p => p.week === selWeek && p.subject === selSubj);
    const scoreKey = `eval-w${selWeek}-${selSubj}`;

    useEffect(() => {
      const stored = localStorage.getItem(scoreKey);
      if (stored) { setScores(JSON.parse(stored)); setSaved(true); } else { setScores({}); setSaved(false); }
    }, [scoreKey]);

    const totalScored = Object.values(scores).reduce((a, b) => a + b, 0);
    const totalMax = paper ? paper.totalMarks : 30;
    const pct = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 0;

    const saveEval = () => {
      localStorage.setItem(scoreKey, JSON.stringify(scores));
      setSaved(true);
      flash("Evaluation saved", 880);
    };

    if (!paper) return <EmptyState icon={"\uD83D\uDCDD"} title="No test paper" subtitle="Test papers available for Week 1 & 2" />;

    return (
      <div className="space-y-4 animate-fade-in-up">
        <SectionTitle>Test Evaluation</SectionTitle>
        <Card className="p-3.5 bg-amber-50/50 border-amber-100">
          <div className="flex gap-2 items-start">
            <span className="text-sm mt-0.5">{"\uD83D\uDD12"}</span>
            <p className="text-[17px] text-gray-600 leading-relaxed"><b>For Shweta only.</b> Score each question using the marking rubric below.</p>
          </div>
        </Card>
        {/* Selectors */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Week</p>
            <div className="flex gap-1.5">
              {[1, 2].map(w => (
                <button key={w} onClick={() => { setSelWeek(w); setScores({}); setSaved(false); }}
                  className={`flex-1 text-[16px] py-2 rounded-xl font-semibold transition-all active:scale-95 ${selWeek === w ? "bg-brand-600 text-white" : "bg-gray-50 text-gray-500"}`}>
                  Week {w}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Subject</p>
            <div className="flex gap-1">
              {(["physics", "chemistry", "maths"] as Subject[]).map(s => (
                <button key={s} onClick={() => { setSelSubj(s); setScores({}); setSaved(false); }}
                  className={`flex-1 text-[16px] py-2 rounded-xl font-semibold transition-all active:scale-95 ${selSubj === s ? `bg-gradient-to-r ${SUBJ[s].gradient} text-white` : "bg-gray-50 text-gray-500"}`}>
                  {SUBJ[s].icon}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Score Summary */}
        <Card className={`p-4 ${pct >= 80 ? "bg-emerald-50/50 border-emerald-100" : pct >= 50 ? "bg-amber-50/50 border-amber-100" : "bg-gray-50"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest">Total Score</p>
              <p className="text-2xl font-black text-gray-800 mt-0.5">{totalScored} <span className="text-sm text-gray-400 font-medium">/ {totalMax}</span></p>
            </div>
            <div className="relative flex items-center justify-center">
              <ProgressRing pct={pct} size={56} stroke={5} color={pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#6b7280"} />
              <span className="absolute text-[17px] font-black text-gray-700">{pct}%</span>
            </div>
          </div>
          {saved && <p className="text-[16px] text-emerald-600 font-semibold mt-2">{"\u2705"} Saved</p>}
        </Card>
        {/* Questions by Section */}
        {paper.sections.map(section => (
          <Card key={section.name} className="p-4">
            <p className="text-[17px] font-bold text-gray-500 uppercase tracking-wider mb-3">{section.name}</p>
            <div className="space-y-3">
              {section.questions.map(q => {
                const qKey = `q${q.num}`;
                const qScore = scores[qKey] ?? -1;
                return (
                  <div key={q.num} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex-1">
                        <p className="text-[16px] font-semibold text-gray-800">Q{q.num}. {q.topic}</p>
                        <p className="text-[16px] text-gray-400 mt-0.5">Max: {q.marks} marks</p>
                      </div>
                      {/* Score Input */}
                      <div className="flex gap-1 flex-shrink-0">
                        {Array.from({ length: q.marks + 1 }, (_, i) => i).map(score => (
                          <button key={score} onClick={() => { setScores(prev => ({ ...prev, [qKey]: score })); setSaved(false); }}
                            className={`w-7 h-7 rounded-lg text-[17px] font-bold transition-all active:scale-90 ${qScore === score
                              ? score === q.marks ? "bg-emerald-600 text-white" : score === 0 ? "bg-red-500 text-white" : "bg-brand-600 text-white"
                              : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                            }`}>
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Rubric */}
                    <div className="space-y-0.5">
                      {q.rubric.map((r, ri) => (
                        <p key={ri} className="text-[16px] text-gray-400 pl-2 border-l-2 border-gray-100">{r}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
        {/* Actions */}
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={saveEval} className="bg-brand-600 text-white text-[16px] py-3 rounded-xl font-semibold hover:bg-brand-700 active:scale-[0.98] transition-all shadow-sm shadow-brand-600/20">
            Save Evaluation
          </button>
          <button onClick={() => setView("errors")} className="bg-gray-50 text-gray-600 text-[16px] py-3 rounded-xl font-semibold hover:bg-gray-100 active:scale-[0.98] transition-all">
            Log Errors {"\u2192"}
          </button>
        </div>
      </div>
    );
  };

  // ====== CHECK WORK / DOUBT SOLVER / DAILY REPORT (Claude) ======
  // All state lives in App so this view survives parent re-renders mid-analyze.

  // Tasks scheduled for the currently-selected check date (defaults to today,
  // but Shweta can pick any date — past or future — to review or upload work for).
  const tasksForCheckDate = (() => {
    if (!checkDate) return [] as DayTask[];
    const target = new Date(checkDate + "T00:00:00").getTime();
    const out: DayTask[] = [];
    schedule.forEach(w => {
      Object.entries(w.days).forEach(([day, ts]) => {
        if (taskCalDate(w.week, day).getTime() === target) out.push(...ts);
      });
    });
    return out;
  })();

  // Submissions for the currently selected (taskId, date) pair, ordered oldest first.
  const submissionsForCurrent = submissions
    .filter(s => s.taskId === checkSelTaskId && s.date === checkDate)
    .sort((a, b) => a.attemptNum - b.attemptNum);

  const lastSubmission = submissionsForCurrent[submissionsForCurrent.length - 1];

  // Cooldown: refuse to re-analyze the SAME task within this many minutes.
  const RESUBMIT_COOLDOWN_MIN = 15;
  const cooldownRemainingMin = lastSubmission
    ? Math.max(0, RESUBMIT_COOLDOWN_MIN - Math.floor((Date.now() - new Date(lastSubmission.submittedAt).getTime()) / 60000))
    : 0;
  const onPickFiles = async (files: FileList | null) => {
    if (!files) return;
    const blocks: ImageBlock[] = [];
    const previews: string[] = [];
    for (let i = 0; i < Math.min(files.length, 4); i++) {
      const f = files[i];
      try {
        const blk = await fileToImageBlock(f);
        blocks.push(blk);
        previews.push(`data:${blk.source.media_type};base64,${blk.source.data}`);
      } catch (e) {
        console.error("img convert", e);
      }
    }
    setCheckImages(blocks);
    setCheckPreviews(previews);
    setCheckResult(null);
    setCheckAnalyzeErr("");
  };

  const runAnalyze = async () => {
    const task = tasksForCheckDate.find(t => t.id === checkSelTaskId) || tasksForCheckDate[0];
    if (!task) { setCheckAnalyzeErr("No task selected"); return; }
    if (checkImages.length === 0) { setCheckAnalyzeErr("Please attach at least one photo"); return; }
    if (cooldownRemainingMin > 0) {
      setCheckAnalyzeErr(`Please wait ${cooldownRemainingMin} more min before re-submitting this task.`);
      return;
    }
    setCheckAnalyzing(true);
    setCheckResult(null);
    setCheckAnalyzeErr("");

    // Build prior-attempt context for THIS task on THIS date so Claude can compare.
    const prior = submissions
      .filter(s => s.taskId === task.id && s.date === checkDate)
      .sort((a, b) => a.attemptNum - b.attemptNum)
      .map<PriorAttemptCtx>(s => ({
        attemptNum: s.attemptNum,
        submittedAt: s.submittedAt,
        verdict: s.verdict,
        marks_awarded: s.marksAwarded,
        marks_max: s.marksMax,
        summary: s.summary,
        mistakes: s.mistakes,
      }));

    const res = await analyzeWork({
      taskTopic: task.topic,
      taskSubject: task.subject,
      taskChapter: task.chapterName,
      taskDate: checkDate,
      images: checkImages,
      studentName: "Shikhar",
      priorAttempts: prior.length > 0 ? prior : undefined,
    });
    setCheckAnalyzing(false);
    if (!res.ok) { setCheckAnalyzeErr(res.error); return; }

    setCheckResult(res.data);

    // Persist as a new submission record
    const attemptNum = prior.length + 1;
    const sub: WorkSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      taskId: task.id,
      date: checkDate,
      submittedAt: new Date().toISOString(),
      attemptNum,
      verdict: res.data.verdict,
      marksAwarded: res.data.marks_awarded,
      marksMax: res.data.marks_max,
      summary: res.data.summary,
      mistakes: res.data.mistakes,
      nextSteps: res.data.next_steps,
      improvement: res.data.improvement,
    };
    setSubmissions(prev => {
      const u = [...prev, sub];
      saveData("shikhar-submissions", u);
      return u;
    });

    // Auto-create error journal entries — but ONLY for genuinely-new mistakes
    // (skip ones repeated from a previous attempt to avoid duplicates).
    const repeatedSet = new Set((res.data.improvement?.repeated_mistakes || []).map(s => s.toLowerCase()));
    const newErrors: ErrorEntry[] = res.data.mistakes
      .filter(m => !repeatedSet.has(m.what_went_wrong.toLowerCase()))
      .map(m => ({
        id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        date: new Date().toISOString(),
        subject: task.subject,
        chapter: task.chapterName,
        topic: task.topic,
        errorType: m.type,
        question: task.topic,
        whatWentWrong: m.what_went_wrong,
        correctApproach: m.correct_approach,
        resolved: false,
      }));
    if (newErrors.length > 0) {
      setErrors(prev => {
        const u = [...newErrors, ...prev];
        saveData("shikhar-errors", u);
        return u;
      });
    }

    // Auto-mark task done only on the FIRST attempt for that day, so re-runs
    // don't downgrade an earlier strong rating.
    if (attemptNum === 1) {
      if (res.data.verdict === "correct") markTask(task.id, "done", 5);
      else if (res.data.verdict === "partial") markTask(task.id, "done", 3);
    } else {
      // On subsequent attempts, upgrade rating if Claude says they improved.
      if (res.data.improvement?.direction === "improved" && res.data.verdict === "correct") {
        markTask(task.id, "done", 5);
      }
    }
  };

  const onDoubtFile = async (files: FileList | null) => {
    if (!files || !files[0]) { setDoubtImg(null); setDoubtPreview(""); return; }
    const blk = await fileToImageBlock(files[0]);
    setDoubtImg(blk);
    setDoubtPreview(`data:${blk.source.media_type};base64,${blk.source.data}`);
  };

  const runDoubt = async () => {
    if (!doubtQ.trim() && !doubtImg) { setDoubtErr("Enter a question or attach a photo"); return; }
    setDoubtSolving(true); setDoubtAns(""); setDoubtErr("");
    const res = await solveDoubt(doubtQ, doubtImg || undefined);
    setDoubtSolving(false);
    if (res.ok) setDoubtAns(res.text); else setDoubtErr(res.error);
  };

  const CheckView = () => {
    const tab = checkTab;
    const setTab = setCheckTab;
    const selTaskId = checkSelTaskId;
    const setSelTaskId = setCheckSelTaskId;
    const images = checkImages;
    const imgPreviews = checkPreviews;
    const analyzing = checkAnalyzing;
    const result = checkResult;
    const analyzeErr = checkAnalyzeErr;
    const solving = doubtSolving;

    const todayISO = fmtTodayISO();
    const todaysReport = reports[todayISO];
    const sortedReportDates = Object.keys(reports).sort().reverse();

    return (
      <div className="space-y-4 animate-fade-in-up">
        <SectionTitle>Claude AI Tutor</SectionTitle>
        {/* Tabs */}
        <div className="flex gap-1.5">
          {([
            { k: "work" as const, label: "Check Work" },
            { k: "doubt" as const, label: "Doubt" },
            { k: "report" as const, label: "Report" },
          ]).map(t => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={`flex-1 text-[14px] py-2 rounded-xl font-semibold transition-all active:scale-95 ${tab === t.k ? "bg-brand-600 text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== CHECK WORK TAB ===== */}
        {tab === "work" && (
          <>
            {/* Date picker — Shweta can grade work for ANY day, past or future */}
            <Card className="p-4">
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Assignment Date</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const d = new Date(checkDate + "T00:00:00");
                    d.setDate(d.getDate() - 1);
                    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    setCheckDate(iso);
                  }}
                  className="w-9 h-9 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center active:scale-90 hover:bg-gray-100">‹</button>
                <input
                  type="date"
                  value={checkDate}
                  onChange={e => setCheckDate(e.target.value)}
                  className="flex-1 text-[14px] text-gray-700 border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-center font-semibold"
                />
                <button
                  onClick={() => {
                    const d = new Date(checkDate + "T00:00:00");
                    d.setDate(d.getDate() + 1);
                    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    setCheckDate(iso);
                  }}
                  className="w-9 h-9 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center active:scale-90 hover:bg-gray-100">›</button>
              </div>
              {checkDate !== todayISO && (
                <button onClick={() => setCheckDate(todayISO)} className="mt-2 text-[12px] text-brand-600 font-semibold underline">
                  Jump to today
                </button>
              )}
            </Card>

            <Card className="p-4">
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Task for {new Date(checkDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</p>
              {tasksForCheckDate.length === 0 ? (
                <p className="text-[14px] text-gray-500">No tasks scheduled for this date.</p>
              ) : (
                <select value={selTaskId} onChange={e => setSelTaskId(e.target.value)} className="w-full text-[14px] text-gray-700 border border-gray-200 rounded-xl px-3 py-2.5 bg-white">
                  {tasksForCheckDate.map(t => (
                    <option key={t.id} value={t.id}>{SUBJ[t.subject].icon} &mdash; {t.topic}</option>
                  ))}
                </select>
              )}
            </Card>

            {/* Prior attempts history for the selected (task, date) */}
            {submissionsForCurrent.length > 0 && (
              <Card className="p-4">
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Attempt History ({submissionsForCurrent.length})</p>
                <div className="space-y-2">
                  {submissionsForCurrent.map(s => {
                    const dirIcon = s.improvement?.direction === "improved" ? "📈" : s.improvement?.direction === "declined" ? "📉" : s.improvement ? "➡️" : "";
                    return (
                      <div key={s.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[13px] font-bold text-gray-600 flex-shrink-0">#{s.attemptNum}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Badge className={s.verdict === "correct" ? "bg-emerald-100 text-emerald-700" : s.verdict === "partial" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}>
                              {s.verdict}
                            </Badge>
                            <span className="text-[13px] font-bold text-gray-700">{s.marksAwarded}/{s.marksMax}</span>
                            {dirIcon && <span className="text-[14px]">{dirIcon}</span>}
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">{new Date(s.submittedAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            <Card className="p-4">
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                {submissionsForCurrent.length > 0 ? `Upload Re-Attempt #${submissionsForCurrent.length + 1}` : "Upload Shikhar\u2019s Solved Work"}
              </p>
              <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl py-6 text-center cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 transition-all">
                <input type="file" accept="image/*" multiple capture="environment" onChange={e => onPickFiles(e.target.files)} className="hidden" />
                <p className="text-[14px] text-gray-500 font-semibold">📷 Tap to take or choose photo(s)</p>
                <p className="text-[12px] text-gray-400 mt-1">Up to 4 photos &middot; auto-resized</p>
              </label>
              {imgPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {imgPreviews.map((p, i) => (
                    <img key={i} src={p} alt={`preview ${i + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-100" />
                  ))}
                </div>
              )}
              <button onClick={runAnalyze} disabled={analyzing || images.length === 0 || tasksForCheckDate.length === 0 || cooldownRemainingMin > 0}
                className="mt-3 w-full bg-brand-600 disabled:bg-gray-300 text-white text-[14px] py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
                {analyzing
                  ? "Analyzing with Claude…"
                  : cooldownRemainingMin > 0
                    ? `Wait ${cooldownRemainingMin} min before re-submit`
                    : submissionsForCurrent.length > 0 ? "Analyze Re-Attempt" : "Analyze with Claude"}
              </button>
              {analyzeErr && <p className="text-[12px] text-red-500 mt-2 font-semibold">⚠️ {analyzeErr}</p>}
            </Card>

            {result && (
              <Card className={`p-4 border-2 ${result.verdict === "correct" ? "border-emerald-200 bg-emerald-50/40" : result.verdict === "partial" ? "border-amber-200 bg-amber-50/40" : "border-red-200 bg-red-50/40"}`}>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={result.verdict === "correct" ? "bg-emerald-100 text-emerald-700" : result.verdict === "partial" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}>
                    {result.verdict.toUpperCase()}
                  </Badge>
                  <p className="text-[16px] font-black text-gray-800">{result.marks_awarded} / {result.marks_max}</p>
                </div>
                <p className="text-[14px] text-gray-700 leading-relaxed mb-3">{result.summary}</p>

                {/* Improvement panel (only present on re-attempts) */}
                {result.improvement && (
                  <div className={`rounded-xl p-3 mb-3 border ${result.improvement.direction === "improved" ? "bg-emerald-50 border-emerald-200" : result.improvement.direction === "declined" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[16px]">{result.improvement.direction === "improved" ? "📈" : result.improvement.direction === "declined" ? "📉" : "➡️"}</span>
                      <p className="text-[13px] font-bold uppercase tracking-wider text-gray-700">{result.improvement.direction}</p>
                    </div>
                    <p className="text-[13px] text-gray-700 mb-2">{result.improvement.note}</p>
                    {result.improvement.fixed_mistakes.length > 0 && (
                      <p className="text-[12px] text-emerald-700 mb-0.5">✓ Fixed: {result.improvement.fixed_mistakes.join("; ")}</p>
                    )}
                    {result.improvement.repeated_mistakes.length > 0 && (
                      <p className="text-[12px] text-amber-700 mb-0.5">↻ Still repeating: {result.improvement.repeated_mistakes.join("; ")}</p>
                    )}
                    {result.improvement.new_mistakes.length > 0 && (
                      <p className="text-[12px] text-red-700">+ New: {result.improvement.new_mistakes.join("; ")}</p>
                    )}
                  </div>
                )}

                {result.mistakes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Mistakes ({result.mistakes.length})</p>
                    {result.mistakes.map((m, i) => (
                      <div key={i} className="bg-white rounded-xl p-3 border border-gray-100">
                        <Badge className="bg-red-50 text-red-600 mb-1">{m.type}</Badge>
                        <p className="text-[13px] text-gray-700"><b>Wrong:</b> {m.what_went_wrong}</p>
                        <p className="text-[13px] text-gray-700 mt-1"><b>Correct:</b> {m.correct_approach}</p>
                      </div>
                    ))}
                    <p className="text-[11px] text-gray-400 italic">✓ Auto-added to Error Journal (duplicates skipped)</p>
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1">Next Steps</p>
                  <p className="text-[14px] text-gray-700">{result.next_steps}</p>
                </div>
              </Card>
            )}
          </>
        )}

        {/* ===== DOUBT SOLVER TAB ===== */}
        {tab === "doubt" && (
          <>
            <Card className="p-4">
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Ask a Doubt</p>
              <textarea value={doubtQ} onChange={e => setDoubtQ(e.target.value)} placeholder="Type your question or paste it here…"
                className="w-full text-[14px] text-gray-700 border border-gray-200 rounded-xl px-3 py-2.5 bg-white min-h-[100px]" />
              <label className="block mt-2 w-full border border-dashed border-gray-200 rounded-xl py-3 text-center cursor-pointer hover:border-brand-300 transition-all">
                <input type="file" accept="image/*" capture="environment" onChange={e => onDoubtFile(e.target.files)} className="hidden" />
                <p className="text-[13px] text-gray-500">📷 Optional: attach a photo of the question</p>
              </label>
              {doubtPreview && <img src={doubtPreview} alt="doubt" className="w-full max-h-40 object-contain rounded-lg border border-gray-100 mt-2" />}
              <button onClick={runDoubt} disabled={solving}
                className="mt-3 w-full bg-brand-600 disabled:bg-gray-300 text-white text-[14px] py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
                {solving ? "Solving…" : "Solve with Claude"}
              </button>
              {doubtErr && <p className="text-[12px] text-red-500 mt-2 font-semibold">⚠️ {doubtErr}</p>}
            </Card>
            {doubtAns && (
              <Card className="p-4">
                <p className="text-[12px] font-bold text-brand-600 uppercase tracking-widest mb-2">Solution</p>
                <pre className="text-[13px] text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{doubtAns}</pre>
              </Card>
            )}
          </>
        )}

        {/* ===== DAILY REPORT TAB ===== */}
        {tab === "report" && (
          <>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Today&rsquo;s Report</p>
                  <p className="text-[13px] text-gray-500">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
                </div>
                <button onClick={() => runDailyReport()} disabled={reportRunning.current}
                  className="bg-brand-600 disabled:bg-gray-300 text-white text-[12px] font-bold px-3 py-2 rounded-xl active:scale-95">
                  {reportRunning.current ? "Generating…" : todaysReport ? "Regenerate" : "Generate Now"}
                </button>
              </div>
              {todaysReport ? (
                <>
                  <pre className="text-[13px] text-gray-700 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">{todaysReport.text}</pre>
                  <p className="text-[11px] text-gray-400 mt-2">Generated {new Date(todaysReport.generatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                </>
              ) : (
                <p className="text-[13px] text-gray-500 italic">Auto-generates after 9:00 PM. Tap &ldquo;Generate Now&rdquo; for an instant report.</p>
              )}
            </Card>

            {sortedReportDates.length > 1 && (
              <Card className="p-4">
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Past Reports</p>
                <div className="space-y-2">
                  {sortedReportDates.filter(d => d !== todayISO).slice(0, 7).map(d => (
                    <details key={d} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <summary className="text-[13px] font-semibold text-gray-700 cursor-pointer">{new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</summary>
                      <pre className="text-[12px] text-gray-600 whitespace-pre-wrap font-sans leading-relaxed mt-2">{reports[d].text}</pre>
                    </details>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    );
  };

  const AdjustView = () => {
    const [markWeek, setMarkWeek] = useState(actW);
    const [confirmReset, setConfirmReset] = useState(false);
    const bulkAction = (action: "done" | "skip") => {
      const w = schedule[markWeek - 1]; if (!w) return;
      setProgress(prev => { const u = { ...prev }; Object.values(w.days).flat().forEach(t => { if (!u[t.id] || u[t.id].status === "pending") u[t.id] = { taskId: t.id, status: action === "done" ? "done" : "skipped", date: new Date().toISOString(), notes: "Bulk", rating: 0 }; }); saveData("shikhar-progress", u); return u; });
      flash(`Week ${markWeek} \u2014 all ${action}`, 660);
    };
    const reset = () => {
      if (!confirmReset) { setConfirmReset(true); return; }
      setProgress({}); setNotes({}); setErrors([]);
      saveData("shikhar-progress", {}); saveData("shikhar-notes", {}); saveData("shikhar-errors", []);
      flash("All data reset", 330); setConfirmReset(false);
    };
    const inputCls = "w-full text-[17px] text-gray-700 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 bg-white transition-all";

    return (
      <div className="space-y-4 animate-fade-in-up">
        <SectionTitle>Adjust & Manage</SectionTitle>
        <Card className="p-4">
          <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-3">Bulk Actions</p>
          <select value={markWeek} onChange={e => setMarkWeek(Number(e.target.value))} className={`${inputCls} mb-3`}>
            {schedule.map(w => <option key={w.week} value={w.week}>Week {w.week} \u2014 {w.label.slice(0, 40)}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => bulkAction("done")} className="text-[16px] bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 active:scale-[0.98] font-semibold transition-all shadow-sm shadow-emerald-600/20">Mark All Done</button>
            <button onClick={() => bulkAction("skip")} className="text-[16px] bg-amber-500 text-white py-2.5 rounded-xl hover:bg-amber-600 active:scale-[0.98] font-semibold transition-all shadow-sm shadow-amber-500/20">Skip All</button>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tutor Notes</p>
          <textarea value={notes["tutor"] || ""} onChange={e => updNote("tutor", e.target.value)} placeholder="Tutor coordination, important notes..."
            className={`${inputCls} h-28 resize-none`} />
        </Card>
        <Card className="p-4 border-red-100 bg-red-50/30">
          <p className="text-[16px] font-bold text-red-400 uppercase tracking-widest mb-3">Danger Zone</p>
          <button onClick={reset} className="text-[16px] bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 active:scale-[0.98] font-semibold transition-all shadow-sm shadow-red-600/20">
            {confirmReset ? "Confirm Reset \u2014 Click Again" : "Reset All Data"}
          </button>
          {confirmReset && <button onClick={() => setConfirmReset(false)} className="text-[17px] text-gray-400 ml-3 hover:text-gray-600">Cancel</button>}
        </Card>
      </div>
    );
  };

  // ====== Navigation ======
  const navItems: { v: View; label: string; icon: React.ReactNode }[] = [
    { v: "dashboard", label: "Home", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { v: "daily", label: "Today", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { v: "formulas", label: "Formulas", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
    { v: "evaluate", label: "Evaluate", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { v: "check", label: "Claude", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ flexShrink: 0, background: "#fff", borderBottom: "1px solid #e5e7eb", zIndex: 20, paddingTop: "env(safe-area-inset-top)" }}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Stacked avatars: Shikhar (front) + Shweta (back) */}
              <div className="flex items-center" style={{ position: "relative", width: 56, height: 36 }}>
                <Avatar name="Shweta" src="/shweta.jpg" size={36} fallbackBg="from-pink-400 to-rose-500" style={{ position: "absolute", left: 0, zIndex: 1, border: "2px solid #fff" }} />
                <Avatar name="Shikhar" src="/shikhar.jpg" size={36} fallbackBg="from-brand-500 to-brand-700" style={{ position: "absolute", left: 20, zIndex: 2, border: "2px solid #fff" }} />
              </div>
              <div>
                <h1 className="text-[15px] font-bold text-gray-900 leading-tight tracking-tight">Shikhar Prep Monitor</h1>
                <p className="text-[12px] text-gray-400 font-medium">Managed by Shweta &middot; Week {actW}</p>
              </div>
            </div>
            {behind > 5 && <div className="bg-red-50 text-red-600 text-[12px] font-bold px-2.5 py-1 rounded-full ring-1 ring-red-500/10">{behind} behind</div>}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 68, left: "50%", transform: "translateX(-50%)", zIndex: 99999 }} className="bg-gray-900 text-white text-[16px] font-medium px-5 py-2.5 rounded-xl shadow-2xl animate-toast">{toast}</div>
      )}

      {/* Offline banner */}
      {!isOnline && (
        <div style={{ flexShrink: 0, background: "#f59e0b", zIndex: 18 }} className="px-4 py-2 flex items-center justify-center gap-2">
          <span className="text-[13px] font-semibold text-white">You're offline — app works, data is saved locally</span>
        </div>
      )}

      {/* SW update banner */}
      {needRefresh && !hideUpdate && (
        <div style={{ flexShrink: 0, background: "#4f46e5", zIndex: 18 }} className="px-4 py-2 flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold text-white">New version available</span>
          <div className="flex items-center gap-2">
            <button onClick={doUpdate} className="bg-white text-brand-600 text-[12px] font-bold px-3 py-1 rounded-lg active:scale-95">Update</button>
            <button onClick={dismissUpdate} aria-label="Dismiss" className="text-white text-[16px] font-bold px-2 py-0.5 active:scale-90">{"\u00D7"}</button>
          </div>
        </div>
      )}

      {/* Install banner (Android Chrome) */}
      {showInstallBanner && (
        <div style={{ flexShrink: 0, background: "#fff", borderBottom: "1px solid #e5e7eb", zIndex: 18 }} className="px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">S</div>
            <div>
              <p className="text-[13px] font-bold text-gray-800">Install Shikhar App</p>
              <p className="text-[11px] text-gray-400">Add to home screen for offline use</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={dismissInstall} className="text-[12px] text-gray-400 px-2 py-1">Not now</button>
            <button onClick={handleInstall} className="bg-brand-600 text-white text-[12px] font-bold px-3 py-1.5 rounded-xl active:scale-95">Install</button>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-6">
          {view === "dashboard" && <DashboardView />}
          {view === "schedule" && <ScheduleView />}
          {view === "weekly" && <WeeklyView />}
          {view === "daily" && <DailyView />}
          {view === "errors" && <ErrorsView />}
          {view === "revisit" && <RevisitView />}
          {view === "monthly" && <MonthlyView />}
          {view === "analytics" && <AnalyticsView />}
          {view === "resources" && <ResourcesView />}
          {view === "formulas" && <FormulasView />}
          {view === "evaluate" && <EvaluateView />}
          {view === "check" && <CheckView />}
          {view === "adjust" && <AdjustView />}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav style={{ flexShrink: 0, background: "#ffffff", borderTop: "1px solid #e5e7eb", boxShadow: "0 -2px 10px rgba(0,0,0,0.06)", zIndex: 20, paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="max-w-2xl mx-auto px-1">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: "8px 0 10px" }}>
            {navItems.map(({ v, label, icon }) => (
              <button key={v} onClick={() => { setView(v); if (v === "weekly") setSelW(actW); }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 8px", minWidth: 56, border: "none", background: "none", cursor: "pointer" }}
                className={`rounded-xl transition-all active:scale-90 ${view === v ? "text-brand-600" : "text-gray-400 hover:text-gray-600"}`}>
                <div className={`transition-all ${view === v ? "scale-110" : ""}`}>{icon}</div>
                <span className={`text-[11px] font-semibold leading-none ${view === v ? "text-brand-600" : "text-gray-400"}`}>{label}</span>
                {view === v && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#4f46e5", marginTop: 2 }} />}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
