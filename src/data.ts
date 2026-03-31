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
      { num: 1, marks: 1, topic: "Charge quantization", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Coulomb's Law ratio", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "Electric field direction", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "Gauss's Law application", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "Dipole field comparison", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Properties of field lines", rubric: ["1 mark per valid property (any 2)"] },
      { num: 7, marks: 2, topic: "Superposition principle", rubric: ["1 mark for statement", "1 mark for vector addition formula"] },
      { num: 8, marks: 2, topic: "Continuous charge distribution", rubric: ["1 mark for linear/surface definitions", "1 mark for integral form"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "Electric field on dipole axis", rubric: ["1 mark for diagram", "1 mark for derivation setup", "1 mark for final expression"] },
      { num: 10, marks: 3, topic: "Gauss's Law — infinite plane", rubric: ["0.5 for Gaussian surface choice", "1 for flux calculation", "1 for field expression", "0.5 for direction"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "Coulomb to Gauss derivation", rubric: ["1 for Coulomb's law statement", "1 for spherical Gaussian surface", "1 for flux calculation", "1 for connecting to Gauss's law", "1 for generalization"] },
      { num: 12, marks: 5, topic: "Dipole in uniform field", rubric: ["1 for diagram", "1 for torque derivation", "1 for potential energy", "1 for stable/unstable equilibrium", "1 for work done"] },
    ]},
  ]},
  // Week 1 — Chemistry
  { week: 1, subject: "chemistry", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "Types of solutions", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Henry's Law application", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "Raoult's Law", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "Colligative property identification", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "Osmotic pressure calculation", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Ideal vs non-ideal solutions", rubric: ["1 mark for ideal definition", "1 mark for deviation examples"] },
      { num: 7, marks: 2, topic: "Azeotropes", rubric: ["1 mark for definition", "1 mark for min/max boiling examples"] },
      { num: 8, marks: 2, topic: "Molality vs Molarity", rubric: ["1 mark each for definition + why molality preferred"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "Raoult's Law derivation", rubric: ["1 for statement", "1 for mathematical form", "1 for graph/explanation"] },
      { num: 10, marks: 3, topic: "Boiling point elevation", rubric: ["1 for formula", "1 for Kb definition", "1 for numerical"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "All colligative properties", rubric: ["1 each for: RLVP, BP elevation, FP depression, osmotic pressure", "1 for van't Hoff factor connection"] },
      { num: 12, marks: 5, topic: "Osmotic pressure + van't Hoff", rubric: ["1 for osmosis definition", "1 for formula", "1 for van't Hoff factor", "1 for dissociation example", "1 for association example"] },
    ]},
  ]},
  // Week 1 — Maths
  { week: 1, subject: "maths", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "Relation type identification", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Reflexive relation check", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "One-one function", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "Onto function count", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "Composition of functions", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Check symmetric + transitive", rubric: ["1 mark for symmetric check", "1 mark for transitive check"] },
      { num: 7, marks: 2, topic: "Prove injection", rubric: ["1 mark for method", "1 mark for conclusion"] },
      { num: 8, marks: 2, topic: "Find gof and fog", rubric: ["1 mark for each composition"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "Equivalence relation proof", rubric: ["1 for reflexive", "1 for symmetric", "1 for transitive"] },
      { num: 10, marks: 3, topic: "Bijective function + inverse", rubric: ["1 for one-one proof", "1 for onto proof", "1 for inverse formula"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "Equivalence classes", rubric: ["1 for relation definition", "1 for equivalence proof", "1 for finding classes", "1 for listing elements", "1 for partition verification"] },
      { num: 12, marks: 5, topic: "Binary operations", rubric: ["1 for operation definition", "1 for commutativity check", "1 for associativity check", "1 for identity element", "1 for inverse element"] },
    ]},
  ]},
  // Week 2 — Physics
  { week: 2, subject: "physics", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "Equipotential surface property", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Capacitance of parallel plate", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "Dielectric effect", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "Energy stored", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "Series vs parallel capacitor", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "E-V relationship", rubric: ["1 for relation", "1 for physical meaning"] },
      { num: 7, marks: 2, topic: "Equipotential surface properties", rubric: ["1 mark per property (any 2)"] },
      { num: 8, marks: 2, topic: "Dielectric polarization", rubric: ["1 for definition", "1 for effect on capacitance"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "Capacitor combination numerical", rubric: ["1 for circuit analysis", "1 for formula application", "1 for answer"] },
      { num: 10, marks: 3, topic: "Energy stored derivation", rubric: ["1 for setup", "1 for integration", "1 for all three forms"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "Parallel plate capacitor derivation", rubric: ["1 for setup", "1 for field calculation", "1 for potential difference", "1 for C formula", "1 for dielectric modification"] },
      { num: 12, marks: 5, topic: "Van de Graaff generator", rubric: ["1 for diagram", "1 for principle", "1 for working", "1 for charge accumulation", "1 for applications/limitations"] },
    ]},
  ]},
  // Week 2 — Chemistry
  { week: 2, subject: "chemistry", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "Galvanic cell identification", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Standard electrode potential", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "Nernst equation application", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "Conductivity type", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "Faraday's law numerical", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Galvanic vs Electrolytic", rubric: ["1 mark for each type with key difference"] },
      { num: 7, marks: 2, topic: "SHE construction", rubric: ["1 for diagram/description", "1 for E\u00B0 value and use"] },
      { num: 8, marks: 2, topic: "Kohlrausch's Law", rubric: ["1 for statement", "1 for application example"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "Nernst equation derivation", rubric: ["1 for general form", "1 for 25\u00B0C form", "1 for equilibrium connection"] },
      { num: 10, marks: 3, topic: "Electrolysis numerical", rubric: ["1 for Faraday's law setup", "1 for calculation", "1 for answer with units"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "Batteries and fuel cells", rubric: ["1 for primary vs secondary", "1 for lead-acid battery", "1 for fuel cell principle", "1 for advantages", "1 for H\u2082-O\u2082 fuel cell reactions"] },
      { num: 12, marks: 5, topic: "Corrosion mechanism", rubric: ["1 for definition", "1 for electrochemical mechanism", "1 for anode/cathode reactions", "1 for factors affecting", "1 for prevention methods"] },
    ]},
  ]},
  // Week 2 — Maths
  { week: 2, subject: "maths", totalMarks: 30, duration: "1 hour", sections: [
    { name: "Section A — MCQ", marksPerQ: 1, questions: [
      { num: 1, marks: 1, topic: "Domain of sin\u207B\u00B9", rubric: ["1 mark for correct option"] },
      { num: 2, marks: 1, topic: "Range of tan\u207B\u00B9", rubric: ["1 mark for correct option"] },
      { num: 3, marks: 1, topic: "Complementary identity", rubric: ["1 mark for correct option"] },
      { num: 4, marks: 1, topic: "Principal value", rubric: ["1 mark for correct option"] },
      { num: 5, marks: 1, topic: "2tan\u207B\u00B9x identity", rubric: ["1 mark for correct option"] },
    ]},
    { name: "Section B — Short Answer", marksPerQ: 2, questions: [
      { num: 6, marks: 2, topic: "Principal value computation", rubric: ["1 for identifying range", "1 for correct value"] },
      { num: 7, marks: 2, topic: "Simplify expression", rubric: ["1 for applying identity", "1 for simplification"] },
      { num: 8, marks: 2, topic: "Prove identity", rubric: ["1 for LHS simplification", "1 for matching RHS"] },
    ]},
    { name: "Section C — Long Answer", marksPerQ: 3, questions: [
      { num: 9, marks: 3, topic: "tan\u207B\u00B9 addition formula proof", rubric: ["1 for setup", "1 for algebraic manipulation", "1 for conclusion"] },
      { num: 10, marks: 3, topic: "Multi-step simplification", rubric: ["1 per step of simplification (3 steps)"] },
    ]},
    { name: "Section D — Extended", marksPerQ: 5, questions: [
      { num: 11, marks: 5, topic: "Solve inverse trig equation", rubric: ["1 for converting to single function", "1 for applying formula", "1 for solving", "1 for checking domain", "1 for final answer"] },
      { num: 12, marks: 5, topic: "Prove complex identity", rubric: ["1 for LHS expansion", "1 for substitution", "1 for intermediate steps", "1 for simplification", "1 for final proof"] },
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
