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
