/**
 * All portfolio content in one place — sourced strictly from
 * Ahnab Rashid's CV, internship certificate and SJARVIS EDU source
 * material. Nothing here is exaggerated or invented.
 *
 * Positioning: Ahnab is a Computer Science student EXPLORING artificial
 * intelligence, AI agents, AI chatbots, intelligent automation and
 * Python through learning and projects — never presented as a software
 * developer, engineer or expert, and never as actively seeking an
 * internship.
 *
 * Company spelling: the internship certificate reads "SIBRS TECHNOLOGY"
 * (verified against the actual certificate images) — SIBRS everywhere.
 */

export const PROFILE = {
  firstName: "Ahnab",
  lastName: "Rashid",
  fullName: "Ahnab Rashid",
  eyebrow: "Hello, I’m",
  intro:
    "Computer Science student exploring Artificial Intelligence, AI Agents, AI Chatbots, intelligent automation and Python through learning and projects.",
  subFacts: ["BSCS · AUST", "AI & Python", "6th Semester"],
  email: "nabi41538@gmail.com",
  linkedin: "https://www.linkedin.com/in/ahnab-rashid",
  github: "https://github.com/Ahnab-Qureshii",
  location: "Havelian, Abbottabad, KPK, Pakistan",
} as const;

/**
 * Central social/contact configuration — VERIFIED links only.
 * Instagram / Facebook were removed: no verified profile URLs existed,
 * and empty or invented social links are never shown.
 */
export type SocialLink = {
  id: "linkedin" | "github" | "email";
  label: string;
  href: string;
  external: boolean;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ahnab-rashid",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Ahnab-Qureshii",
    external: true,
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:nabi41538@gmail.com",
    external: false,
  },
];

export const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#focus", label: "Focus" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Journey" },
  { href: "#certificates", label: "Certificates" },
  { href: "#contact", label: "Contact" },
] as const;

export const ABOUT_PARAGRAPHS = [
  "I’m Ahnab Rashid, a Computer Science student at Abbottabad University of Science and Technology, currently in my 6th semester with a 3.76 GPA.",
  "I became interested in technology through curiosity and practical learning. I especially enjoy exploring Artificial Intelligence, understanding how chatbots and agents work, and turning what I learn into projects that actually work.",
  "During my AI and Python internship at SIBRS Technology, I worked on the Classroom Management phase of SJARVIS EDU, a learning platform project. I worked with FastAPI and SQLite while learning how a real development workflow works.",
  "I also enjoy working with Python, backend development and problem solving. I like learning by building things, testing ideas and figuring out why something does not work.",
] as const;

export const ABOUT_FACTS = [
  { key: "degree", label: "Degree", value: "BS Computer Science" },
  {
    key: "university",
    label: "University",
    value: "Abbottabad University of Science and Technology",
  },
  { key: "semester", label: "Semester", value: "6th" },
  { key: "gpa", label: "GPA", value: "3.76" },
  { key: "focus", label: "Focus", value: "AI Agents, AI Chatbots & Automation" },
  { key: "location", label: "Based in", value: "Havelian, Abbottabad" },
] as const;

export const FOCUS_GROUPS = [
  {
    label: "Main focus",
    items: ["AI Agents", "AI Chatbots", "Intelligent Automation", "Artificial Intelligence"],
  },
  {
    label: "Supporting tools",
    items: [
      "Python",
      "FastAPI",
      "SQLite",
      "n8n Workflow Automation",
      "Git & GitHub",
      "SQL (basic)",
      "VS Code",
    ],
  },
] as const;

export const PROJECTS = [
  {
    index: "01",
    title: "SJARVIS EDU — Phase 6: Classroom Management",
    context: "Internship project · SIBRS Technology",
    description:
      "A classroom-management backend for a multi-phase educational platform — classes, enrollment, schedules, attendance, materials, assignments and announcements. Built as an independent FastAPI service on SQLAlchemy ORM and SQLite, verified with an automated test suite.",
    tech: ["Python", "FastAPI", "SQLAlchemy", "SQLite", "pytest"],
    stats: "69 endpoints · 13 routers · 16 tables · 118 automated tests",
  },
  {
    index: "02",
    title: "City Route Finder Using Graph Traversal",
    context: "Course project",
    description:
      "A route-finding application that applies graph traversal algorithms to determine efficient paths between locations — a project that strengthened my algorithmic thinking and problem-solving skills.",
    tech: ["Graph Traversal", "Algorithms"],
    stats: null,
  },
  {
    index: "03",
    title: "Access Control List (ACL) Implementation",
    context: "Computer Networks project",
    description:
      "Implemented an ACL configuration as part of a Computer Networks project to understand traffic filtering, network security concepts and access management.",
    tech: ["Networking", "ACL", "Security Basics"],
    stats: null,
  },
  {
    index: "04",
    title: "OS Command Toolkit",
    context: "Operating Systems lab project",
    description:
      "A menu-driven C++ console program that performs file and folder operations — create, copy, move, delete, list and navigate — showing how programs rely on operating-system system calls behind the scenes.",
    tech: ["C++", "System Calls", "Console App"],
    stats: null,
  },
] as const;

/**
 * Skill hierarchy — AI interests come first, technologies second,
 * everyday tools third. SJARVIS-only technologies (e.g. SQLAlchemy) stay
 * inside the SJARVIS project entry instead of being presented as broad
 * personal expertise. Portfolio-building technologies are not listed.
 */
export const SKILL_GROUPS = [
  {
    label: "AI & Interests",
    items: [
      "Artificial Intelligence",
      "AI Agents",
      "AI Chatbots",
      "Automation",
    ],
  },
  {
    label: "Technical",
    items: [
      "Python",
      "FastAPI",
      "SQL (basic)",
      "SQLite",
    ],
  },
  {
    label: "Tools",
    items: [
      "Git & GitHub",
      "VS Code",
      "n8n",
      "Canva",
      "Figma (basic)",
      "MS Office",
    ],
  },
  {
    label: "Soft skills",
    items: [
      "Effective Communication",
      "Problem Solving",
      "Critical Thinking",
      "Teamwork",
      "Leadership",
      "Time Management",
      "Quick Learner",
    ],
  },
  {
    label: "Languages",
    items: ["Urdu (native)", "Hindko (native)", "English"],
  },
] as const;

export const TIMELINE = [
  {
    title: "AI & Python Internship",
    org: "SIBRS Technology",
    period: "SJARVIS EDU · Phase 6",
    description:
      "Trained in Python and OOP, then contributed Phase 6 (Classroom Management) of SJARVIS EDU — an independent FastAPI backend with SQLAlchemy and SQLite, checked by an automated test suite. Also introduced to Git, GitHub and n8n workflow automation, and delivered several technical presentations.",
  },
  {
    title: "BS Computer Science",
    org: "Abbottabad University of Science and Technology (AUST)",
    period: "2024 – Present",
    description:
      "Currently in the 6th semester with a 3.76 GPA, focusing coursework and self-study around Artificial Intelligence and backend development.",
  },
  {
    title: "Intermediate (Computer Science)",
    org: "Girls Degree College, Havelian",
    period: "2023",
    description: "Completed with 572 / 1100 marks.",
  },
  {
    title: "Matric (Science)",
    org: "New Century Secondary Public School, Havelian",
    period: "2021",
    description: "Completed with 630 / 1100 marks.",
  },
  {
    title: "Digital Marketer (short-term)",
    org: "Freelance / short-term work",
    period: "Earlier experience",
    description:
      "Supported content promotion and social-media tasks, and designed posts with Canva and Figma — an early exercise in visual communication.",
  },
] as const;
