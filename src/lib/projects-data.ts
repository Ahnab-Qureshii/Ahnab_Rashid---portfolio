/**
 * Projects section content for the dark futuristic "My Projects" section.
 *
 * Sources, in priority order:
 *   1. profile.ts (sourced from the CV, internship report and SJARVIS EDU
 *      Phase 6 report)
 *   2. The SJARVIS EDU Phase 6 report facts already verified in this project
 *   3. The Operating Systems report (OS Command Toolkit, C++ console)
 *   4. The Computer Networks project notes (ACL)
 *
 * Rules honoured here:
 *   - Nothing is invented. Where documentation is thin, the text stays general.
 *   - SJARVIS EDU is presented as an internship project, kept portfolio-
 *     oriented rather than reading like a technical report (no route
 *     inventories, schemas, credentials or internal details).
 *   - Phase 1 is integrated with Classroom Management; the status notes
 *     state this exactly.
 *   - Company spelling follows the internship certificate: SIBRS Technology.
 *   - Every visible string avoids hyphens and dashes of any kind.
 */

export type ProjectAccent = "cyan" | "blue" | "purple" | "violet" | "pink";

export type ProjectStatusTone = "done" | "partial" | "progress";

export type ProjectStat = { value: string; label: string };

export type ProjectHighlight = {
  icon: string;
  label: string;
  sub: string;
};

export type ProjectVisualKind =
  | "architecture"
  | "statsGrid"
  | "moduleMap"
  | "terminal"
  | "syscallFlow"
  | "network"
  | "ruleTable"
  | "routeGraph"
  | "webWindow";

export type ProjectInfo = {
  slug: string;
  name: string;
  cardName: string;
  subtitle: string;
  tagline: string;
  badge: string;
  category: string;
  accent: ProjectAccent;
  icon: string;
  company?: string;
  tech: string[];
  overview: string[];
  highlights?: ProjectHighlight[];
  built?: string[];
  features: string[];
  concepts?: string[];
  role?: string;
  outcome?: string;
  status: { tone: ProjectStatusTone; label: string; note: string };
  stats?: ProjectStat[];
  visuals: { kind: ProjectVisualKind; caption: string }[];
};

export const PROJECT_LIST: ProjectInfo[] = [
  {
    slug: "city-route-finder",
    name: "City Route Finder",
    cardName: "City Route Finder",
    subtitle: "Graph Traversal Course Project",
    tagline: "Graph traversal based route finding system.",
    badge: "Academic Project",
    category: "Course Project · Graphs",
    accent: "cyan",
    icon: "route",
    tech: ["Graph Traversal", "Algorithms"],
    overview: [
      "A course project that models cities and the roads between them as a graph, then applies graph traversal to determine efficient paths between locations.",
      "Working on it strengthened my algorithmic thinking and my problem solving skills, especially the habit of turning a real world question into a structure a computer can search.",
    ],
    highlights: [
      { icon: "graph", label: "Graph Modeling", sub: "Cities as nodes, roads as edges" },
      { icon: "search", label: "Route Search", sub: "Traversal across the network" },
      { icon: "solve", label: "Problem Solving", sub: "From map to searchable structure" },
    ],
    features: [
      "Cities modeled as graph nodes",
      "Roads modeled as edges between them",
      "Traversal based route search",
      "Efficient path selection between locations",
    ],
    concepts: ["Graphs", "Graph traversal", "Algorithms", "Problem solving"],
    role: "Individual course project, designed and implemented by me.",
    outcome:
      "A working route finder and a much stronger intuition for thinking about real world problems as graphs.",
    status: {
      tone: "done",
      label: "Completed",
      note: "Finished as a course project.",
    },
    visuals: [
      { kind: "routeGraph", caption: "Route graph illustration" },
    ],
  },
  {
    slug: "acl-implementation",
    name: "Access Control List Implementation",
    cardName: "Access Control List",
    subtitle: "Computer Networks · Security",
    tagline: "Network security implementation (Access Control List).",
    badge: "Academic Project",
    category: "Computer Networks Project",
    accent: "blue",
    icon: "shield",
    tech: ["ACL", "Networking", "Security Basics"],
    overview: [
      "An academic implementation of Access Control List concepts, built as part of a Computer Networks project to understand traffic filtering, network security concepts and access management.",
      "The project applies an ordered set of rules to network traffic so that allowed sources pass through while unauthorised access attempts are stopped, making the security decisions of a network visible and testable.",
    ],
    highlights: [
      { icon: "rules", label: "Rule Configuration", sub: "Ordered permit and deny entries" },
      { icon: "filter", label: "Traffic Filtering", sub: "Evaluation against the rule set" },
      { icon: "access", label: "Access Management", sub: "Who may pass, who is stopped" },
    ],
    features: [
      "Configured Access Control List rules for a network",
      "Evaluated traffic against permit and deny rules",
      "Practiced traffic filtering in a controlled setting",
      "Studied how rule order changes the outcome",
    ],
    concepts: [
      "Access Control Lists",
      "Traffic filtering",
      "Network security",
      "Access management",
    ],
    role: "Individual work for the Computer Networks course.",
    outcome:
      "A clear, practical picture of how a simple ordered rule set decides which traffic moves through a network and which traffic is stopped.",
    status: {
      tone: "done",
      label: "Completed",
      note: "Finished as a Computer Networks project.",
    },
    visuals: [
      { kind: "network", caption: "Network filtering illustration" },
      { kind: "ruleTable", caption: "Rule table illustration" },
    ],
  },
  {
    slug: "sjarvis-edu",
    name: "SJARVIS EDU",
    cardName: "SJARVIS EDU",
    subtitle: "Learning Management System (Backend)",
    tagline: "Learning Management System (Backend).",
    badge: "Internship Project",
    category: "Internship Project · SIBRS Technology",
    accent: "purple",
    icon: "cap",
    company: "SIBRS Technology",
    tech: ["Python", "FastAPI", "SQLAlchemy", "SQLite", "pytest"],
    overview: [
      "SJARVIS EDU is the backend of an online learning platform I worked on during my AI and Python internship at SIBRS Technology. The platform manages the full classroom workflow: classes, students, teachers, attendance, materials, assignments, quizzes and more.",
      "I contributed Phase 6 of the platform, the Classroom Management phase, delivered as an independent FastAPI service built on SQLAlchemy ORM and SQLite, and I verified the work with an automated test suite.",
    ],
    highlights: [
      { icon: "backend", label: "Backend Development", sub: "FastAPI service, 13 routers" },
      { icon: "database", label: "Database Management", sub: "SQLAlchemy ORM on SQLite" },
      { icon: "api", label: "API Testing", sub: "Swagger docs, pytest suite" },
    ],
    built: [
      "Delivered the Classroom Management phase as an independent FastAPI service with 13 routers covering 69 endpoints.",
      "Modeled the data layer with SQLAlchemy ORM across 16 SQLite tables.",
      "Covered the classroom workflow: classes, enrollment, schedules, attendance, materials, assignments, quizzes, Q&A, announcements, notifications and analytics.",
      "Added ownership and enrollment checks so records stay consistent between classes, students and teachers.",
      "Wrote an automated test suite of 118 tests with pytest.",
    ],
    features: [
      "Class creation and management",
      "Student enrollment",
      "Teacher and class management",
      "Class schedules",
      "Attendance",
      "Materials",
      "Assignments",
      "Quizzes",
      "Q&A",
      "Teacher dashboard",
      "Progress and analytics",
      "Announcements",
      "Notifications and preferences",
      "Activities and history",
    ],
    concepts: [
      "REST API design",
      "ORM data modeling",
      "Relational schema",
      "Input validation",
      "Business rules",
      "Automated testing",
    ],
    role: "Backend development intern. Phase 6 was my contribution to the platform.",
    outcome:
      "The Phase 6 backend passed its full automated test suite and covers the classroom workflow from class creation through progress analytics.",
    status: {
      tone: "partial",
      label: "Classroom Management Phase Completed",
      note: "Phase 1 is integrated with Classroom Management.",
    },
    stats: [
      { value: "69", label: "Endpoints" },
      { value: "13", label: "Routers" },
      { value: "16", label: "Tables" },
      { value: "118", label: "Automated tests" },
    ],
    visuals: [
      { kind: "architecture", caption: "Architecture overview illustration" },
      { kind: "statsGrid", caption: "Report figures illustration" },
      { kind: "moduleMap", caption: "Module overview illustration" },
    ],
  },
  {
    slug: "os-command-toolkit",
    name: "OS Command Toolkit",
    cardName: "OS Command Toolkit",
    subtitle: "Operating Systems · C++ Console Project",
    tagline: "Menu driven C++ console for file and folder operations.",
    badge: "Academic Project",
    category: "Operating Systems Lab Project",
    accent: "violet",
    icon: "terminal",
    tech: ["C++", "Windows", "Dev C++"],
    overview: [
      "A console based Operating Systems project, written in C++, that demonstrates how programs manage files and directories through the operating system.",
      "The program runs in a Windows console and offers a numbered menu, so every operation can be tried step by step without leaving the interface. Behind each menu choice the program relies on operating system services, which is exactly what the lab set out to show.",
    ],
    highlights: [
      { icon: "console", label: "Console Interface", sub: "Menu driven, one number per action" },
      { icon: "syscalls", label: "System Calls", sub: "OS services behind each command" },
      { icon: "files", label: "File Operations", sub: "Create, read, copy, move, delete" },
    ],
    built: [
      "A menu driven console interface that keeps every operation one number away.",
      "File commands: create a file, display its content, delete it, copy it and move it.",
      "Folder commands: create folders, delete folders, navigate between directories and list directory contents.",
      "A clear screen action and a clean exit path for the program.",
    ],
    features: [
      "Create file",
      "Display file content",
      "Delete file",
      "Copy file",
      "Move file",
      "Folder creation",
      "Folder deletion",
      "Directory navigation",
      "Directory listing",
      "Clear screen",
    ],
    concepts: [
      "File management",
      "Directory management",
      "System calls",
      "Process management",
      "Console input and output",
    ],
    role: "Individual lab project for the Operating Systems course.",
    outcome:
      "A single C++ console program that shows in practice how everyday file operations rely on operating system services behind the scenes.",
    status: {
      tone: "done",
      label: "Completed",
      note: "Built as part of the Operating Systems lab.",
    },
    visuals: [
      { kind: "terminal", caption: "Console menu illustration" },
      { kind: "syscallFlow", caption: "System call path illustration" },
    ],
  },
  {
    slug: "classroom-management-system",
    name: "Classroom Management System",
    cardName: "Classroom Management",
    subtitle: "Web Based Academic System",
    tagline: "Web based system (for academic use).",
    badge: "Academic Project",
    category: "Web Based · Academic Use",
    accent: "pink",
    icon: "people",
    tech: ["Web based"],
    overview: [
      "A web based classroom management system built for academic use. The project looks at the everyday problem of keeping classroom related work organised in one place instead of scattered across manual records.",
      "Phase 1 is integrated with Classroom Management. This summary stays intentionally high level because the project has not been published yet; a fuller walkthrough will appear here once it is released.",
    ],
    features: [],
    status: {
      tone: "progress",
      label: "In Progress",
      note: "Phase 1 is integrated with Classroom Management.",
    },
    visuals: [
      { kind: "webWindow", caption: "Abstract illustration" },
    ],
  },
];

export const PROJECT_ORDER = PROJECT_LIST; // SJARVIS EDU sits at the center index (2)
