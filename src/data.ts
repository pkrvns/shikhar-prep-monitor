// ============================================
// Shikhar Prep Monitor — Reference Data
// Extracted from Study Guides, Formula Sheets,
// Answer Keys, and CBSE Resource Hub
// ============================================

export type Subject = "physics" | "chemistry" | "maths";
export type Priority = "VERY HIGH" | "HIGH" | "MEDIUM";

// ---- Resource Links ----
export interface LinkItem { label: string; url: string; tag?: string; }
export interface LinkSection { title: string; icon: string; links: LinkItem[]; }

export const SYLLABUS_LINKS: LinkSection[] = [
  { title: "Physics (Code 042)", icon: "\u26A1", links: [
    { label: "Official Syllabus 2025-26", url: "https://cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/Physics_SrSec_2025-26.pdf", tag: "OFFICIAL" },
  ]},
  { title: "Chemistry (Code 043)", icon: "\uD83E\uDDEA", links: [
    { label: "Official Syllabus 2025-26", url: "https://cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/Chemistry_SrSec_2025-26.pdf", tag: "OFFICIAL" },
    { label: "Chemistry Reading Material", url: "https://cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/Chemistry_SrSec_2025-26_RM.pdf" },
  ]},
  { title: "Mathematics (Code 041)", icon: "\uD83D\uDCD0", links: [
    { label: "Official Syllabus 2025-26", url: "https://cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/Maths_SrSec_2025-26.pdf", tag: "OFFICIAL" },
    { label: "Maths Reading Material", url: "https://cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/Maths_SrSecXI_2025-26_RM.pdf" },
  ]},
  { title: "English Core (Code 301)", icon: "\uD83D\uDCDD", links: [
    { label: "Official Syllabus 2025-26", url: "https://cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/English_core_SrSec_2025-26.pdf", tag: "OFFICIAL" },
  ]},
];

export const SAMPLE_PAPERS: LinkSection[] = [
  { title: "Physics — Sample Papers", icon: "\u26A1", links: [
    { label: "Sample Paper (English)", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2025_26/Physics-SQP.pdf", tag: "OFFICIAL" },
    { label: "Marking Scheme", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2025_26/Physics-MS.pdf", tag: "KEY" },
  ]},
  { title: "Chemistry — Sample Papers", icon: "\uD83E\uDDEA", links: [
    { label: "Sample Paper (English)", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2025_26/Chemistry-SQP.pdf", tag: "OFFICIAL" },
    { label: "Marking Scheme", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2025_26/Chemistry-MS.pdf", tag: "KEY" },
  ]},
  { title: "Mathematics — Sample Papers", icon: "\uD83D\uDCD0", links: [
    { label: "Sample Paper (English)", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2025_26/Maths-SQP.pdf", tag: "OFFICIAL" },
    { label: "Marking Scheme", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2025_26/Maths-MS.pdf", tag: "KEY" },
  ]},
  { title: "English Core — Sample Papers", icon: "\uD83D\uDCDD", links: [
    { label: "Sample Paper", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2025_26/EnglishCore-SQP.pdf", tag: "OFFICIAL" },
    { label: "Marking Scheme", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2025_26/EnglishCore-MS.pdf", tag: "KEY" },
  ]},
];

export const PYQ_LINKS: LinkSection[] = [
  { title: "CBSE Official Papers", icon: "\uD83C\uDFDB\uFE0F", links: [
    { label: "CBSE Official PYQ Portal", url: "https://www.cbse.gov.in/cbsenew/question-paper.html", tag: "OFFICIAL" },
  ]},
  { title: "Subject-wise PYQ Sources", icon: "\uD83D\uDCDA", links: [
    { label: "2025 Papers (All Sets) — SelfStudys", url: "https://www.selfstudys.com/books/cbse-prev-paper/english/class-12th", tag: "2025" },
    { label: "2024 Papers with Solutions — Oswaal", url: "https://www.oswaal360.com/pages/cbse-class-12-previous-year-question-papers-with-solution-free-pdf-download", tag: "2024" },
    { label: "Chapter-wise PYQs (2018-2025)", url: "https://www.cbse.page/", tag: "BEST" },
    { label: "Subject PYQs — Educart", url: "https://www.educart.co/previous-year-question-paper/cbse-previous-year-question-papers-class-12" },
  ]},
];

export const GENERAL_RESOURCES: LinkSection[] = [
  { title: "NCERT Official", icon: "\uD83D\uDCDA", links: [
    { label: "NCERT Textbooks — Free Download", url: "https://ncert.nic.in/textbook.php", tag: "FREE" },
    { label: "NCERT Exemplar Problems", url: "https://ncert.nic.in/exemplar-problems.php", tag: "MUST DO" },
  ]},
  { title: "CBSE Portals", icon: "\uD83C\uDFDB\uFE0F", links: [
    { label: "CBSE Academic Portal 2025-26", url: "https://cbseacademic.nic.in/curriculum_2026.html", tag: "OFFICIAL" },
    { label: "CBSE Sample Papers Hub", url: "https://cbseacademic.nic.in/SQP_CLASSXII_2025-26.html" },
  ]},
  { title: "Exam Pattern", icon: "\uD83D\uDCCB", links: [
    { label: "Physics: Theory 70 + Practical 30 = 100", url: "#" },
    { label: "Chemistry: Theory 70 + Practical 30 = 100", url: "#" },
    { label: "Maths: Theory 80 + Internal 20 = 100", url: "#" },
    { label: "33 questions in Physics (Sections A-E)", url: "#" },
  ]},
  { title: "Reference Books", icon: "\uD83D\uDCD6", links: [
    { label: "Physics — HC Verma (Concepts of Physics)", url: "#" },
    { label: "Physics — DC Pandey (Numericals)", url: "#" },
    { label: "Chemistry — NCERT Exemplar + MS Chouhan", url: "#" },
    { label: "Chemistry — N Avasthi (Physical)", url: "#" },
    { label: "Maths — RD Sharma / RS Aggarwal", url: "#" },
    { label: "Maths — NCERT Exemplar", url: "#", tag: "MUST DO" },
  ]},
];

// ---- Formulas ----
export interface Formula {
  subject: Subject;
  chapter: string;
  chapterNum: number;
  name: string;
  formula: string;
  unit?: string;
}

export const FORMULAS: Formula[] = [
  // Physics Ch.1 — Electric Charges and Fields
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, name: "Coulomb's Law", formula: "F = kq\u2081q\u2082/r\u00B2", unit: "N" },
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, name: "Coulomb's Constant", formula: "k = 1/(4\u03C0\u03B5\u2080) = 9\u00D710\u2079 Nm\u00B2/C\u00B2" },
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, name: "Electric Field", formula: "E = F/q\u2080 = kQ/r\u00B2", unit: "N/C" },
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, name: "Dipole Moment", formula: "p = q \u00D7 2a", unit: "Cm" },
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, name: "Field on Dipole Axis", formula: "E = 2kp/r\u00B3 (r >> a)" },
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, name: "Field on Equatorial", formula: "E = kp/r\u00B3 (r >> a)" },
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, name: "Gauss's Law", formula: "\u03A6 = \u222BE\u00B7dA = q/\u03B5\u2080" },
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, name: "Linear Charge", formula: "E = \u03BB/(2\u03C0\u03B5\u2080r)", unit: "N/C" },
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, name: "Infinite Plane", formula: "E = \u03C3/(2\u03B5\u2080)", unit: "N/C" },
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, name: "Torque on Dipole", formula: "\u03C4 = p \u00D7 E = pE sin\u03B8", unit: "Nm" },

  // Physics Ch.2 — Electrostatic Potential & Capacitance
  { subject: "physics", chapter: "Electrostatic Potential & Capacitance", chapterNum: 2, name: "Potential (point)", formula: "V = kQ/r", unit: "V" },
  { subject: "physics", chapter: "Electrostatic Potential & Capacitance", chapterNum: 2, name: "E-V Relation", formula: "E = -dV/dr" },
  { subject: "physics", chapter: "Electrostatic Potential & Capacitance", chapterNum: 2, name: "Capacitance", formula: "C = Q/V = \u03B5\u2080A/d", unit: "F" },
  { subject: "physics", chapter: "Electrostatic Potential & Capacitance", chapterNum: 2, name: "With Dielectric", formula: "C = K\u03B5\u2080A/d" },
  { subject: "physics", chapter: "Electrostatic Potential & Capacitance", chapterNum: 2, name: "Series Combination", formula: "1/C = 1/C\u2081 + 1/C\u2082 + ..." },
  { subject: "physics", chapter: "Electrostatic Potential & Capacitance", chapterNum: 2, name: "Parallel Combination", formula: "C = C\u2081 + C\u2082 + ..." },
  { subject: "physics", chapter: "Electrostatic Potential & Capacitance", chapterNum: 2, name: "Energy Stored", formula: "U = \u00BDC V\u00B2 = Q\u00B2/(2C)", unit: "J" },
  { subject: "physics", chapter: "Electrostatic Potential & Capacitance", chapterNum: 2, name: "Potential Energy (dipole)", formula: "U = -pE cos\u03B8", unit: "J" },

  // Chemistry Ch.1 — Solutions
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, name: "Molarity", formula: "M = moles of solute / L of solution", unit: "mol/L" },
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, name: "Molality", formula: "m = moles of solute / kg of solvent", unit: "mol/kg" },
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, name: "Mole Fraction", formula: "x\u2081 = n\u2081/(n\u2081 + n\u2082)" },
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, name: "Raoult's Law", formula: "P\u2081 = x\u2081P\u2081\u00B0" },
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, name: "Relative Lowering", formula: "\u0394P/P\u00B0 = x\u2082 (solute mole fraction)" },
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, name: "Elevation of BP", formula: "\u0394T\u1D47 = K\u1D47 \u00D7 m" },
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, name: "Depression of FP", formula: "\u0394T\u1DA0 = K\u1DA0 \u00D7 m" },
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, name: "Osmotic Pressure", formula: "\u03C0 = CRT = (n/V)RT", unit: "atm" },
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, name: "van't Hoff Factor", formula: "i = observed/calculated colligative property" },
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, name: "Henry's Law", formula: "P = K\u1D78 \u00D7 x" },

  // Chemistry Ch.2 — Electrochemistry
  { subject: "chemistry", chapter: "Electrochemistry", chapterNum: 2, name: "Nernst Equation", formula: "E = E\u00B0 - (RT/nF)ln Q" },
  { subject: "chemistry", chapter: "Electrochemistry", chapterNum: 2, name: "Nernst (25\u00B0C)", formula: "E = E\u00B0 - (0.0591/n)log Q" },
  { subject: "chemistry", chapter: "Electrochemistry", chapterNum: 2, name: "Gibbs Energy", formula: "\u0394G\u00B0 = -nFE\u00B0" },
  { subject: "chemistry", chapter: "Electrochemistry", chapterNum: 2, name: "Cell EMF", formula: "E\u00B0cell = E\u00B0cathode - E\u00B0anode" },
  { subject: "chemistry", chapter: "Electrochemistry", chapterNum: 2, name: "Conductivity", formula: "\u03BA = 1/\u03C1 = G\u00D7(l/A)", unit: "S/m" },
  { subject: "chemistry", chapter: "Electrochemistry", chapterNum: 2, name: "Molar Conductivity", formula: "\u039B\u2098 = \u03BA\u00D71000/M", unit: "Scm\u00B2/mol" },
  { subject: "chemistry", chapter: "Electrochemistry", chapterNum: 2, name: "Kohlrausch's Law", formula: "\u039B\u00B0\u2098 = \u03BD\u208A\u03BB\u00B0\u208A + \u03BD\u208B\u03BB\u00B0\u208B" },
  { subject: "chemistry", chapter: "Electrochemistry", chapterNum: 2, name: "Faraday's 1st Law", formula: "m = ZIt = (M\u00D7I\u00D7t)/(nF)" },

  // Maths Ch.1 — Relations and Functions
  { subject: "maths", chapter: "Relations and Functions", chapterNum: 1, name: "Reflexive", formula: "(a,a) \u2208 R for all a \u2208 A" },
  { subject: "maths", chapter: "Relations and Functions", chapterNum: 1, name: "Symmetric", formula: "(a,b) \u2208 R \u21D2 (b,a) \u2208 R" },
  { subject: "maths", chapter: "Relations and Functions", chapterNum: 1, name: "Transitive", formula: "(a,b),(b,c) \u2208 R \u21D2 (a,c) \u2208 R" },
  { subject: "maths", chapter: "Relations and Functions", chapterNum: 1, name: "Injective (1-1)", formula: "f(a)=f(b) \u21D2 a=b" },
  { subject: "maths", chapter: "Relations and Functions", chapterNum: 1, name: "Surjective (onto)", formula: "\u2200 b\u2208B, \u2203 a\u2208A: f(a)=b" },
  { subject: "maths", chapter: "Relations and Functions", chapterNum: 1, name: "Composition", formula: "(gof)(x) = g(f(x))" },
  { subject: "maths", chapter: "Relations and Functions", chapterNum: 1, name: "Inverse exists if", formula: "f is bijective (1-1 and onto)" },

  // Maths Ch.2 — Inverse Trigonometric Functions
  { subject: "maths", chapter: "Inverse Trigonometric Functions", chapterNum: 2, name: "sin\u207B\u00B9 domain", formula: "[-1,1] \u2192 [-\u03C0/2, \u03C0/2]" },
  { subject: "maths", chapter: "Inverse Trigonometric Functions", chapterNum: 2, name: "cos\u207B\u00B9 domain", formula: "[-1,1] \u2192 [0, \u03C0]" },
  { subject: "maths", chapter: "Inverse Trigonometric Functions", chapterNum: 2, name: "tan\u207B\u00B9 domain", formula: "R \u2192 (-\u03C0/2, \u03C0/2)" },
  { subject: "maths", chapter: "Inverse Trigonometric Functions", chapterNum: 2, name: "Complementary", formula: "sin\u207B\u00B9x + cos\u207B\u00B9x = \u03C0/2" },
  { subject: "maths", chapter: "Inverse Trigonometric Functions", chapterNum: 2, name: "tan\u207B\u00B9 addition", formula: "tan\u207B\u00B9x + tan\u207B\u00B9y = tan\u207B\u00B9((x+y)/(1-xy))" },
  { subject: "maths", chapter: "Inverse Trigonometric Functions", chapterNum: 2, name: "2tan\u207B\u00B9x", formula: "= sin\u207B\u00B9(2x/(1+x\u00B2)) = cos\u207B\u00B9((1-x\u00B2)/(1+x\u00B2))" },

  // Physics Ch.3 — Current Electricity (Week 3)
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Current", formula: "I = dQ/dt = nAev\u1D05", unit: "A" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Drift Velocity", formula: "v\u1D05 = eE\u03C4/m", unit: "m/s" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Ohm's Law", formula: "V = IR" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Resistance", formula: "R = \u03C1L/A", unit: "\u03A9" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Resistivity with T", formula: "\u03C1\u209C = \u03C1\u2080(1 + \u03B1\u0394T)" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Series Combination", formula: "R_eq = R\u2081 + R\u2082 + ..." },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Parallel Combination", formula: "1/R_eq = 1/R\u2081 + 1/R\u2082 + ..." },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Two in Parallel", formula: "R_eq = R\u2081R\u2082/(R\u2081+R\u2082)" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Terminal Voltage", formula: "V = \u03B5 - Ir", unit: "V" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Cells in Series", formula: "\u03B5_eq = \u03B5\u2081+\u03B5\u2082, r_eq = r\u2081+r\u2082" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Identical Cells in Parallel", formula: "\u03B5_eq = \u03B5, r_eq = r/n" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Power", formula: "P = VI = I\u00B2R = V\u00B2/R", unit: "W" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Joule Heating", formula: "U = Pt = I\u00B2Rt", unit: "J" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Kirchhoff's 1st (KCL)", formula: "\u03A3I_in = \u03A3I_out (at a junction)" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Kirchhoff's 2nd (KVL)", formula: "\u03A3\u03B5 = \u03A3IR (around a closed loop)" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Wheatstone Balance", formula: "P/Q = R/S (I_G = 0)" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, name: "Meter Bridge", formula: "R = S\u00B7l\u2081/(100-l\u2081)" },

  // Chemistry Ch.3 — Chemical Kinetics (Week 3)
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, name: "Rate (general)", formula: "Rate = -(1/a)d[A]/dt = +(1/c)d[C]/dt", unit: "mol L\u207B\u00B9 s\u207B\u00B9" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, name: "Rate Law", formula: "Rate = k[A]^m[B]^n (m,n from experiment)" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, name: "Zero-Order Integrated", formula: "[A]\u209C = [A]\u2080 - kt" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, name: "Zero-Order Half-life", formula: "t\u00BD = [A]\u2080/(2k)" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, name: "First-Order (ln)", formula: "ln([A]\u2080/[A]\u209C) = kt" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, name: "First-Order (NCERT log)", formula: "k = (2.303/t) log([A]\u2080/[A]\u209C)" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, name: "First-Order Exponential", formula: "[A]\u209C = [A]\u2080 \u00B7 e^(-kt)" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, name: "First-Order Half-life", formula: "t\u00BD = 0.693/k (independent of [A]\u2080)" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, name: "Second-Order Integrated", formula: "1/[A]\u209C - 1/[A]\u2080 = kt" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, name: "Arrhenius", formula: "k = A\u00B7e^(-E\u2090/RT)" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, name: "Arrhenius (ln)", formula: "ln k = ln A - E\u2090/(RT)" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, name: "Two-Temp Arrhenius", formula: "ln(k\u2082/k\u2081) = (E\u2090/R)(1/T\u2081 - 1/T\u2082)" },

  // Maths Ch.3 — Matrices (Week 3)
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Order", formula: "m \u00D7 n (m rows, n columns)" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Addition", formula: "(A+B)\u1D62\u2C7C = a\u1D62\u2C7C + b\u1D62\u2C7C (same order)" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Scalar Multiplication", formula: "(kA)\u1D62\u2C7C = k\u00B7a\u1D62\u2C7C" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Matrix Multiplication", formula: "(AB)\u1D62\u2C7C = \u03A3\u2096 a\u1D62\u2096\u00B7b\u2096\u2C7C" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Size Rule", formula: "A(m\u00D7p) \u00B7 B(p\u00D7n) = C(m\u00D7n)" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Transpose Self-Inverse", formula: "(A\u1D40)\u1D40 = A" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Transpose of Sum", formula: "(A+B)\u1D40 = A\u1D40 + B\u1D40" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Transpose of Product", formula: "(AB)\u1D40 = B\u1D40A\u1D40 (order REVERSES!)" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Symmetric", formula: "A\u1D40 = A (a\u1D62\u2C7C = a\u2C7C\u1D62)" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Skew-Symmetric", formula: "A\u1D40 = -A (diagonal = 0)" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Identity Property", formula: "AI = IA = A" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Inverse", formula: "AA\u207B\u00B9 = A\u207B\u00B9A = I (only if det(A) \u2260 0)" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Inverse of Product", formula: "(AB)\u207B\u00B9 = B\u207B\u00B9A\u207B\u00B9 (order REVERSES!)" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, name: "Symmetric+Skew Decomposition", formula: "A = \u00BD(A+A\u1D40) + \u00BD(A-A\u1D40)" },
];

// ---- PYQ Priority Data ----
export interface PYQPriority {
  subject: Subject;
  chapter: string;
  chapterNum: number;
  topic: string;
  yearsAppeared: string;
  marks: string;
  priority: Priority;
}

export const PYQ_PRIORITIES: PYQPriority[] = [
  // Physics Ch.1
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, topic: "Coulomb's Law & Superposition", yearsAppeared: "2020-2024", marks: "2-5", priority: "VERY HIGH" },
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, topic: "Electric Field (dipole)", yearsAppeared: "2020-2023", marks: "3-5", priority: "VERY HIGH" },
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, topic: "Gauss's Law Applications", yearsAppeared: "2021-2024", marks: "3-5", priority: "HIGH" },
  { subject: "physics", chapter: "Electric Charges and Fields", chapterNum: 1, topic: "Field Lines Properties", yearsAppeared: "2020,2022", marks: "1-2", priority: "MEDIUM" },
  // Physics Ch.2
  { subject: "physics", chapter: "Electrostatic Potential & Capacitance", chapterNum: 2, topic: "Capacitor Combinations", yearsAppeared: "2020-2024", marks: "3-5", priority: "VERY HIGH" },
  { subject: "physics", chapter: "Electrostatic Potential & Capacitance", chapterNum: 2, topic: "Energy Stored in Capacitor", yearsAppeared: "2021-2024", marks: "2-3", priority: "HIGH" },
  { subject: "physics", chapter: "Electrostatic Potential & Capacitance", chapterNum: 2, topic: "Equipotential Surfaces", yearsAppeared: "2020,2023", marks: "1-2", priority: "MEDIUM" },
  // Chemistry Ch.1
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, topic: "Colligative Properties", yearsAppeared: "2020-2024", marks: "3-5", priority: "VERY HIGH" },
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, topic: "Raoult's Law & Deviations", yearsAppeared: "2020-2023", marks: "2-5", priority: "VERY HIGH" },
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, topic: "van't Hoff Factor", yearsAppeared: "2021-2024", marks: "2-3", priority: "HIGH" },
  { subject: "chemistry", chapter: "Solutions", chapterNum: 1, topic: "Osmotic Pressure", yearsAppeared: "2020,2022,2024", marks: "2-3", priority: "HIGH" },
  // Chemistry Ch.2
  { subject: "chemistry", chapter: "Electrochemistry", chapterNum: 2, topic: "Nernst Equation", yearsAppeared: "2020-2024", marks: "3-5", priority: "VERY HIGH" },
  { subject: "chemistry", chapter: "Electrochemistry", chapterNum: 2, topic: "Conductance & Kohlrausch", yearsAppeared: "2020-2023", marks: "2-3", priority: "HIGH" },
  { subject: "chemistry", chapter: "Electrochemistry", chapterNum: 2, topic: "Faraday's Laws", yearsAppeared: "2021,2023,2024", marks: "2-3", priority: "HIGH" },
  // Maths Ch.1
  { subject: "maths", chapter: "Relations and Functions", chapterNum: 1, topic: "Equivalence Relations", yearsAppeared: "2020-2024", marks: "4-5", priority: "VERY HIGH" },
  { subject: "maths", chapter: "Relations and Functions", chapterNum: 1, topic: "One-one & Onto Functions", yearsAppeared: "2020-2023", marks: "2-4", priority: "HIGH" },
  { subject: "maths", chapter: "Relations and Functions", chapterNum: 1, topic: "Composition & Inverse", yearsAppeared: "2021,2023", marks: "2-3", priority: "MEDIUM" },
  // Maths Ch.2
  { subject: "maths", chapter: "Inverse Trigonometric Functions", chapterNum: 2, topic: "Simplification Problems", yearsAppeared: "2020-2024", marks: "2-4", priority: "VERY HIGH" },
  { subject: "maths", chapter: "Inverse Trigonometric Functions", chapterNum: 2, topic: "Domain & Range", yearsAppeared: "2020,2022,2024", marks: "1-2", priority: "HIGH" },
  { subject: "maths", chapter: "Inverse Trigonometric Functions", chapterNum: 2, topic: "Addition Formulas", yearsAppeared: "2021-2023", marks: "2-3", priority: "HIGH" },
  // Physics Ch.3
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, topic: "Ohm's Law & Circuit Analysis", yearsAppeared: "2020-2024", marks: "2-5", priority: "VERY HIGH" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, topic: "Kirchhoff's Laws & Wheatstone Bridge", yearsAppeared: "2020-2024", marks: "3-5", priority: "VERY HIGH" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, topic: "EMF & Internal Resistance", yearsAppeared: "2021-2024", marks: "2-3", priority: "HIGH" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, topic: "Drift Velocity Derivation", yearsAppeared: "2020,2022,2023", marks: "2-3", priority: "HIGH" },
  { subject: "physics", chapter: "Current Electricity", chapterNum: 3, topic: "Power Dissipation", yearsAppeared: "2021,2023", marks: "2-3", priority: "MEDIUM" },
  // Chemistry Ch.3
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, topic: "First-Order Integrated Rate Law", yearsAppeared: "2020-2024", marks: "3-5", priority: "VERY HIGH" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, topic: "Arrhenius & Activation Energy", yearsAppeared: "2020-2024", marks: "3-5", priority: "VERY HIGH" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, topic: "Order vs Molecularity", yearsAppeared: "2020-2023", marks: "2-3", priority: "HIGH" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, topic: "Half-life Calculations", yearsAppeared: "2021,2023,2024", marks: "2-3", priority: "HIGH" },
  { subject: "chemistry", chapter: "Chemical Kinetics", chapterNum: 3, topic: "Effect of Catalyst & Temperature", yearsAppeared: "2020,2022", marks: "1-2", priority: "MEDIUM" },
  // Maths Ch.3
  { subject: "maths", chapter: "Matrices", chapterNum: 3, topic: "Matrix Multiplication & Operations", yearsAppeared: "2020-2024", marks: "1-3", priority: "VERY HIGH" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, topic: "Symmetric + Skew-Symmetric Decomposition", yearsAppeared: "2020-2024", marks: "2-3", priority: "VERY HIGH" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, topic: "Prove polynomial identity (A\u00B2-4A-5I=0 type)", yearsAppeared: "2021-2024", marks: "5", priority: "HIGH" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, topic: "System of Equations via Matrix Inverse", yearsAppeared: "2020-2024", marks: "5", priority: "VERY HIGH" },
  { subject: "maths", chapter: "Matrices", chapterNum: 3, topic: "Transpose Rules (AB)\u1D40 = B\u1D40A\u1D40", yearsAppeared: "2020-2023", marks: "1-2", priority: "HIGH" },
];

// ---- Test Papers & Marking Rubrics ----
export interface TestQuestion {
  num: number;
  marks: number;
  topic: string;
  rubric: string[];
}

export interface TestSection {
  name: string;
  marksPerQ: number;
  questions: TestQuestion[];
}

export interface TestPaper {
  week: number;
  subject: Subject;
  totalMarks: number;
  duration: string;
  sections: TestSection[];
}

export const TEST_PAPERS: TestPaper[] = [
  // Week 1 — Physics
  { week: 1, subject: "physics", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "Charge quantization (electrons transferred)", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Electric field at midpoint of two charges", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "Assertion-Reason: field lines & conservative field", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "SI unit of electric flux", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "Coulomb's Law — distance halved, force?", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Superposition principle of electric forces", rubric: ["1 mark for statement", "1 mark for vector addition formula"] },
      { num: 7, marks: 2, topic: "Electric dipole moment — definition, SI unit, scalar/vector?", rubric: ["1 mark for definition + unit", "1 mark for scalar/vector with reason"] },
      { num: 8, marks: 2, topic: "Flux through one face of cube (charge at centre)", rubric: ["1 mark for Gauss's Law total flux", "1 mark for dividing by 6 faces"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "Where is E=0 between +2uC and +4uC 30cm apart?", rubric: ["1 mark for setup", "1 mark for equation", "1 mark for answer"] },
      { num: 10, marks: 3, topic: "Derive E on axial line of electric dipole", rubric: ["1 mark for diagram", "1 mark for derivation setup", "1 mark for final expression"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "Gauss's Law — derive E for infinite plane sheet", rubric: ["1 for symmetry argument", "1 for Gaussian surface choice", "1 for flux calculation", "1 for field expression", "1 for diagram"] },
      { num: 12, marks: 5, topic: "Net force on -1uC from two +2uC charges", rubric: ["1 for diagram", "1 for F1 calculation", "1 for F2 calculation", "1 for vector resolution", "1 for resultant magnitude + direction"] },
    ]},
  ]},
  // Week 1 — Chemistry
  { week: 1, subject: "chemistry", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "Temperature-independent concentration unit", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Raoult's Law — partial VP proportionality", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "Positive deviation example", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "Osmotic pressure formula", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "van't Hoff factor for Ba(NO₃)₂", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Henry's Law — definition + application", rubric: ["1 mark for statement", "1 mark for application example"] },
      { num: 7, marks: 2, topic: "Molality calculation (20g NaOH in 500g water)", rubric: ["1 mark for formula", "1 mark for answer"] },
      { num: 8, marks: 2, topic: "Colligative properties — definition + name all four", rubric: ["1 mark for definition", "1 mark for listing all four"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "BP elevation numerical (glucose in water, Kb=0.512)", rubric: ["1 for formula", "1 for molality calculation", "1 for answer"] },
      { num: 10, marks: 3, topic: "Why does +ve deviation give higher VP? Example", rubric: ["1 for weak A-B forces explanation", "1 for higher VP reasoning", "1 for example"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "Raoult's Law — derive relative lowering of VP", rubric: ["1 for Raoult's Law statement", "1 for non-volatile solute case", "1 for RLVP derivation", "1 for formula", "1 for significance"] },
      { num: 12, marks: 5, topic: "Isotonic solutions — find molar mass of unknown", rubric: ["1 for isotonic condition", "1 for cane sugar osmotic pressure", "1 for unknown setup", "1 for calculation", "1 for answer with units"] },
    ]},
  ]},
  // Week 1 — Maths
  { week: 1, subject: "maths", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "Relation type identification (reflexive/symmetric/equivalence)", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "f(x)=x² from R to R — one-one/onto?", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "Composition gof numerical", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "Count of bijections from {1,2,3} to {1,2,3}", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "Find f⁻¹(x) for f(x)=3x-5", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Show divisibility-by-3 relation is equivalence", rubric: ["1 mark for reflexive+symmetric", "1 mark for transitive"] },
      { num: 7, marks: 2, topic: "Show given function is bijective", rubric: ["1 mark for one-one", "1 mark for onto"] },
      { num: 8, marks: 2, topic: "Find fog and gof — are they equal?", rubric: ["1 mark for each composition"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "Show f(x)=x³ is one-one and onto, find f⁻¹", rubric: ["1 for one-one proof", "1 for onto proof", "1 for inverse formula"] },
      { num: 10, marks: 3, topic: "Equivalence relation on AxA, find equivalence class [(2,5)]", rubric: ["1 for equivalence proof", "1 for finding class", "1 for listing elements"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "f(x)=9x²+6x-5 on R⁺ — show bijective, find f⁻¹", rubric: ["1 for one-one proof", "1 for onto proof", "1 for range verification", "1 for inverse derivation", "1 for final formula"] },
      { num: 12, marks: 5, topic: "f(n)=(n+1)/2 if odd, n/2 if even — onto but not one-one", rubric: ["1 for function definition", "1 for onto proof", "1 for not one-one proof (counterexample)", "1 for showing f(1)=f(2)", "1 for complete reasoning"] },
    ]},
  ]},
  // Week 2 — Physics
  { week: 2, subject: "physics", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "Work done moving charge along equipotential", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Potential when distance doubled", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "3uF and 6uF in series — equivalent C", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "Energy stored in capacitor formula", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "Dielectric constant K is always?", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Define equipotential surface — why no work done?", rubric: ["1 for definition", "1 for no-work explanation"] },
      { num: 7, marks: 2, topic: "Energy stored in 10uF capacitor at 100V", rubric: ["1 for formula", "1 for calculation"] },
      { num: 8, marks: 2, topic: "E-V relation — meaning of negative sign", rubric: ["1 for relation E=-dV/dr", "1 for physical meaning"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "Capacitor combination: 2uF, 3uF, 6uF parallel then series with 4uF", rubric: ["1 for parallel calculation", "1 for series calculation", "1 for answer"] },
      { num: 10, marks: 3, topic: "Derive potential due to electric dipole at a point", rubric: ["1 for setup + diagram", "1 for derivation", "1 for final expression"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "Derive C for parallel plate capacitor + effect of dielectric K", rubric: ["1 for setup", "1 for field calculation", "1 for potential difference", "1 for C formula", "1 for dielectric modification"] },
      { num: 12, marks: 5, topic: "Capacitor with battery disconnected + dielectric inserted", rubric: ["1 for initial Q, C, V", "1 for new C with dielectric", "1 for charge conservation", "1 for new voltage", "1 for energy comparison"] },
    ]},
  ]},
  // Week 2 — Chemistry
  { week: 2, subject: "chemistry", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "Oxidation occurs at anode/cathode?", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Standard hydrogen electrode potential", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "Molar conductivity on dilution", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "Spontaneous cell: E° and ΔG signs", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "Nernst equation constant at 25°C", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Molar conductivity — definition + dilution effect on weak electrolytes", rubric: ["1 for definition", "1 for dilution effect explanation"] },
      { num: 7, marks: 2, topic: "Corrosion — definition + two prevention methods", rubric: ["1 for definition", "1 for two methods"] },
      { num: 8, marks: 2, topic: "Kohlrausch's Law — statement + application", rubric: ["1 for statement", "1 for application example"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "E°cell and ΔG° for Cu-Zn cell", rubric: ["1 for E°cell calculation", "1 for ΔG° formula", "1 for answer with units"] },
      { num: 10, marks: 3, topic: "Nernst equation numerical — Zn-Cu cell with concentrations", rubric: ["1 for Nernst equation setup", "1 for log Q calculation", "1 for final E"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "Lead-acid battery — discharge and recharge reactions", rubric: ["1 for construction", "1 for discharge anode reaction", "1 for discharge cathode reaction", "1 for recharge reactions", "1 for overall + applications"] },
      { num: 12, marks: 5, topic: "Standard hydrogen electrode — construction and working", rubric: ["1 for construction/diagram", "1 for half-cell reaction", "1 for E°=0V convention", "1 for use in measuring E°", "1 for limitations"] },
    ]},
  ]},
  // Week 2 — Maths
  { week: 2, subject: "maths", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "sin⁻¹(-1/2) principal value", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Range of cos⁻¹(x)", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "sin⁻¹(x) + cos⁻¹(x) = ?", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "tan⁻¹(1) + tan⁻¹(2) + tan⁻¹(3) = ?", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "cos⁻¹(-1) = ?", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Principal value of tan⁻¹(-√3)", rubric: ["1 for identifying range", "1 for correct value"] },
      { num: 7, marks: 2, topic: "Prove: sin⁻¹(3/5) + cos⁻¹(12/13) = sin⁻¹(56/65)", rubric: ["1 for applying identity", "1 for simplification"] },
      { num: 8, marks: 2, topic: "Simplify: tan⁻¹(cosx/(1+sinx))", rubric: ["1 for LHS simplification", "1 for final answer"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "Prove: 2tan⁻¹(1/3) + tan⁻¹(1/7) = π/4", rubric: ["1 for first addition", "1 for second addition", "1 for conclusion"] },
      { num: 10, marks: 3, topic: "Solve: tan⁻¹(2x) + tan⁻¹(3x) = π/4", rubric: ["1 for applying addition formula", "1 for solving quadratic", "1 for checking validity"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "Prove: tan⁻¹((√(1+x²)-1)/x) = ½tan⁻¹(x)", rubric: ["1 for substitution x=tanθ", "1 for simplifying secθ-1", "1 for converting to tan(θ/2)", "1 for applying tan⁻¹", "1 for final result"] },
      { num: 12, marks: 5, topic: "Prove: cos⁻¹(12/13) + sin⁻¹(3/5) = sin⁻¹(56/65), find cos of sum", rubric: ["1 for setting up angles", "1 for sin/cos values", "1 for addition formula", "1 for proving identity", "1 for cos of sum"] },
    ]},
  ]},
  // Week 3 — Physics (Current Electricity)
  { week: 3, subject: "physics", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "SI unit of resistivity (Ω·m)", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Order of magnitude of drift velocity (10⁻⁴ m/s)", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "Two 6Ω in parallel, then series with 2Ω → total R", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "Kirchhoff's Junction Rule — conservation law", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "Balanced Wheatstone bridge condition", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Define drift velocity; relation I = nAevᴅ", rubric: ["1 for definition", "1 for formula with terms explained"] },
      { num: 7, marks: 2, topic: "State Ohm's Law; distinguish ohmic vs non-ohmic with examples", rubric: ["1 for statement", "1 for distinction with examples"] },
      { num: 8, marks: 2, topic: "R for wire: L=2m, A=10⁻⁶ m², ρ=5×10⁻⁸ Ω·m", rubric: ["1 for formula R=ρL/A", "1 for answer 0.1 Ω with unit"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "Derive I = nAevᴅ from first principles", rubric: ["1 for total charge nALe", "1 for time L/vᴅ", "1 for final formula"] },
      { num: 10, marks: 3, topic: "Two cells (2V, r=1Ω; 3V, r=2Ω) in series with 3Ω — find I", rubric: ["1 for EMF sum (5V)", "1 for total R (6Ω)", "1 for I = 5/6 A with unit"] },
      { num: 13, marks: 3, topic: "State Kirchhoff's laws; find I through 5V cell (parallel 5V+10V, 3Ω ext)", rubric: ["1 for stating both laws", "1 for KVL/KCL equations", "1 for solving (I₁ = −10/7 A, reverse dir)"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "Derive Wheatstone bridge balance using Kirchhoff's laws", rubric: ["1 for diagram", "1 for I_G=0 setup", "1.5 for loop ABDA (I₁P=I₂R)", "1.5 for loop BCDB (I₁Q=I₂S)", "1 for P/Q=R/S"] },
      { num: 12, marks: 5, topic: "12V battery (r=2Ω), parallel 6Ω‖3Ω — I, I per resistor, P in 3Ω", rubric: ["1 for parallel R = 2Ω", "1.5 for I from battery (3A)", "1 for V across parallel (6V)", "1 for I per resistor (1A, 2A)", "0.5 for P = 12W"] },
    ]},
  ]},
  // Week 3 — Chemistry (Chemical Kinetics)
  { week: 3, subject: "chemistry", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "Unit of rate constant for first-order reaction (s⁻¹)", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Half-life of first-order reaction (independent of [A]₀)", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "Catalyst changes — Eₐ / ΔH / equilibrium?", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "Rate doubles when [A] doubles → order w.r.t. A", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "Molecularity of elementary reaction — allowed values", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Order vs Molecularity — any two differences", rubric: ["1 per valid distinction (max 2)"] },
      { num: 7, marks: 2, topic: "First-order: t½ = 10 min → rate constant k", rubric: ["1 for t½ = 0.693/k", "1 for k = 0.0693 min⁻¹"] },
      { num: 8, marks: 2, topic: "Define activation energy; effect of catalyst", rubric: ["1 for Eₐ definition", "1 for catalyst lowers Eₐ via alternate path"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "Rate = k[A][B]; both doubled — factor increase (4×)", rubric: ["1 for original rate", "1 for new rate", "1 for factor + note on order vs stoichiometry"] },
      { num: 10, marks: 3, topic: "Arrhenius: k₁=0.0025, k₂=0.005 at 300K, 310K — find Eₐ", rubric: ["1 for two-temp formula", "1 for substitution", "1 for Eₐ ≈ 53.6 kJ/mol"] },
      { num: 13, marks: 3, topic: "First-order 40% complete in 50 min — find k and t for 80%", rubric: ["1 for k = (2.303/t) log([A]₀/[A]ₜ)", "1 for k = 0.0102 min⁻¹", "1 for t ≈ 158 min"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "Derive integrated rate equation for first-order; show t½ = 0.693/k", rubric: ["1 for -d[A]/dt = k[A]", "1.5 for ln([A]₀/[A]ₜ)=kt", "1.5 for t½ derivation", "1 for independence from [A]₀"] },
      { num: 12, marks: 5, topic: "Arrhenius equation; plot ln k vs 1/T; find Eₐ from graph", rubric: ["1 for k=A·e^(-Eₐ/RT)", "1.5 for defining each term", "1.5 for ln k = ln A - Eₐ/(RT)", "1 for slope = -Eₐ/R on graph"] },
    ]},
  ]},
  // Week 3 — Maths (Matrices)
  { week: 3, subject: "maths", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "Size of AB when A is 2×3, B is 3×4", rubric: ["1 mark for correct option (2×4)"] },
      { num: 2, marks: 1, topic: "Condition for matrix A to be symmetric", rubric: ["1 mark for correct option (Aᵀ = A)"] },
      { num: 3, marks: 1, topic: "Number of elements in a 3×4 matrix", rubric: ["1 mark for correct option (12)"] },
      { num: 4, marks: 1, topic: "(AB)ᵀ for square A, B of same order", rubric: ["1 mark for correct option (BᵀAᵀ)"] },
      { num: 5, marks: 1, topic: "Diagonal elements of a skew-symmetric matrix", rubric: ["1 mark for correct option (all 0)"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "A=[[2,3],[-1,4]], B=[[1,0],[2,-1]] — find 2A − 3B", rubric: ["1 for 2A and 3B", "1 for 2A − 3B = [[1,6],[-8,11]]"] },
      { num: 7, marks: 2, topic: "A=[[1,2],[3,4]], B=[[2,0],[1,2]] — find AB; is AB = BA?", rubric: ["1 for AB = [[4,4],[10,8]]", "1 for BA and AB ≠ BA conclusion"] },
      { num: 8, marks: 2, topic: "A=[[1,2,3],[4,5,6]] — find Aᵀ; verify (Aᵀ)ᵀ = A", rubric: ["1 for Aᵀ (3×2)", "1 for verification"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "Decompose A=[[3,-2],[4,5]] into symmetric + skew-symmetric", rubric: ["1 for decomposition formula", "1 for P = [[3,1],[1,5]]", "1 for Q = [[0,-3],[3,0]] + verification"] },
      { num: 10, marks: 3, topic: "A=[[0,1],[-1,0]] — find A², A³, A⁴; pattern", rubric: ["1 for A² = -I", "1 for A³ = -A, A⁴ = I", "1 for period-4 pattern (like powers of i)"] },
      { num: 13, marks: 3, topic: "Find x making A = [[3,x,1],[2,1,4],[1,2,5]] singular", rubric: ["1 for det(A) expansion", "1 for simplification to −6−6x", "1 for x = −1"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "A=[[1,2,2],[2,1,2],[2,2,1]] — prove A² − 4A − 5I = 0", rubric: ["2 for A² = [[9,8,8],[8,9,8],[8,8,9]]", "1 for 4A", "0.5 for 5I", "1.5 for element-wise A²−4A−5I = 0"] },
      { num: 12, marks: 5, topic: "A=[[1,-1,0],[2,3,4],[0,1,2]], B=[[2,2,-4],[-4,2,-4],[2,-1,5]] — AB; solve system", rubric: ["2 for AB = 6I ⇒ A⁻¹ = B/6", "1 for matrix form AX = C", "2 for X = (1/6)BC = [2,−1,4]ᵀ"] },
    ]},
  ]},
];

// ---- Tag Colors ----
export const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  OFFICIAL: { bg: "bg-emerald-50", text: "text-emerald-700" },
  KEY: { bg: "bg-amber-50", text: "text-amber-700" },
  "2025": { bg: "bg-blue-50", text: "text-blue-700" },
  "2024": { bg: "bg-violet-50", text: "text-violet-700" },
  BEST: { bg: "bg-rose-50", text: "text-rose-700" },
  FREE: { bg: "bg-teal-50", text: "text-teal-700" },
  "MUST DO": { bg: "bg-orange-50", text: "text-orange-700" },
  "VERY HIGH": { bg: "bg-red-50", text: "text-red-700" },
  HIGH: { bg: "bg-amber-50", text: "text-amber-700" },
  MEDIUM: { bg: "bg-blue-50", text: "text-blue-700" },
};
