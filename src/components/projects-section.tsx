"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Braces,
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Database,
  Filter,
  Flag,
  FolderOpen,
  LayoutGrid,
  Lightbulb,
  ListChecks,
  Lock,
  Network,
  Search,
  Server,
  Terminal,
  User,
  X,
  Zap,
} from "lucide-react";
import { PROJECT_LIST, type ProjectInfo } from "@/lib/projects-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ============================================================
   Project glyphs: hand drawn gradient SVG icons, one per
   project, each with its own accent color.
   ============================================================ */

function RouteGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pjGRoute" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#59e0ff" />
          <stop offset="1" stopColor="#3f7dff" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#pjGRoute)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.2a4.6 4.6 0 0 1 4.6 4.6c0 3.4-4.6 8-4.6 8s-4.6-4.6-4.6-8A4.6 4.6 0 0 1 12 3.2z" />
        <circle cx="12" cy="7.7" r="1.6" />
        <path d="M4.5 20.6h5.2a2.5 2.5 0 0 0 0-5h-1.4" strokeDasharray="2.4 2.2" />
      </g>
    </svg>
  );
}

function ShieldGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pjGShield" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6ea8ff" />
          <stop offset="1" stopColor="#2f5cff" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#pjGShield)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l6.6 2.4v5.3c0 4.5-2.9 7.6-6.6 9.4-3.7-1.8-6.6-4.9-6.6-9.4V5.4L12 3z" />
        <path d="m9.1 11.7 2 2 3.8-4" />
      </g>
    </svg>
  );
}

function CapGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pjGCap" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3FD8FF" />
          <stop offset="0.55" stopColor="#6EA0FF" />
          <stop offset="1" stopColor="#3F7DFF" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#pjGCap)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4.4 2.6 8.5l9.4 4.1 9.4-4.1L12 4.4z" />
        <path d="M6.3 10.6v4.5c0 1.5 2.6 2.8 5.7 2.8s5.7-1.3 5.7-2.8v-4.5" />
        <path d="M21.4 8.5v5.3" />
      </g>
    </svg>
  );
}

function TerminalGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pjGTerm" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EA0FF" />
          <stop offset="1" stopColor="#3F7DFF" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#pjGTerm)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4.4" width="18" height="15.2" rx="3" />
        <path d="m6.9 9.6 2.7 2.4-2.7 2.4" />
        <path d="M12.6 14.6h4.4" />
      </g>
    </svg>
  );
}

function PeopleGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pjGPeople" x1="3" y1="5" x2="21" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3FD8FF" />
          <stop offset="1" stopColor="#3F7DFF" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#pjGPeople)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8.3" r="2.7" />
        <path d="M3.6 19.2c.5-3.1 2.8-4.8 5.4-4.8s4.9 1.7 5.4 4.8" />
        <circle cx="17" cy="9.2" r="2.1" />
        <path d="M15.8 14.7c2.4.1 4.2 1.6 4.7 4.3" />
      </g>
    </svg>
  );
}

const PROJECT_GLYPHS: Record<string, React.ReactNode> = {
  route: <RouteGlyph />,
  shield: <ShieldGlyph />,
  cap: <CapGlyph />,
  terminal: <TerminalGlyph />,
  people: <PeopleGlyph />,
};

/* ============================================================
   Small helper icons for the highlight rows.
   ============================================================ */

const HIGHLIGHT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  backend: Server,
  database: Database,
  api: Braces,
  console: Terminal,
  syscalls: Cpu,
  files: FolderOpen,
  graph: Network,
  search: Search,
  solve: Lightbulb,
  rules: ListChecks,
  filter: Filter,
  access: Lock,
};

/* ============================================================
   Illustration visuals. These are original design visuals,
   clearly captioned as illustrations, never passed off as
   application screenshots.
   ============================================================ */

function VisualArchitecture() {
  const layers = [
    { label: "Client / Frontend", note: "Sends requests" },
    { label: "FastAPI Routers", note: "13 routers · 69 endpoints" },
    { label: "Business Logic", note: "Ownership and enrollment checks" },
    { label: "SQLAlchemy ORM", note: "16 tables" },
    { label: "SQLite Database", note: "Persistent storage" },
  ];
  return (
    <div className="pj-arch">
      {layers.map((layer, i) => (
        <div key={layer.label} className="pj-arch-item">
          <div className="pj-arch-box">
            <span className="pj-arch-dot" />
            <span className="pj-arch-text">
              <span className="pj-arch-label">{layer.label}</span>
              <span className="pj-arch-note">{layer.note}</span>
            </span>
          </div>
          {i < layers.length - 1 ? <span className="pj-arch-link" /> : null}
        </div>
      ))}
    </div>
  );
}

function VisualStatsGrid() {
  const tiles = [
    { value: "69", label: "Endpoints" },
    { value: "13", label: "Routers" },
    { value: "16", label: "Tables" },
    { value: "118", label: "Automated tests" },
  ];
  return (
    <div className="pj-statgrid">
      {tiles.map((tile) => (
        <div key={tile.label} className="pj-stattile">
          <span className="pj-statval font-display">{tile.value}</span>
          <span className="pj-statlab">{tile.label}</span>
        </div>
      ))}
    </div>
  );
}

function VisualModuleMap() {
  const modules = [
    "Classes",
    "Students",
    "Teachers",
    "Schedules",
    "Attendance",
    "Materials",
    "Assignments",
    "Quizzes",
    "Q&A",
    "Announcements",
    "Notifications",
    "Analytics",
  ];
  return (
    <div className="pj-modmap">
      {modules.map((mod) => (
        <span key={mod} className="pj-modchip">
          {mod}
        </span>
      ))}
    </div>
  );
}

function VisualTerminal() {
  const menu = [
    "Create file",
    "Display file content",
    "Delete file",
    "Copy file",
    "Move file",
    "Create folder",
    "Delete folder",
    "Directory navigation",
    "Directory listing",
    "Clear screen",
  ];
  return (
    <div className="pj-term">
      <div className="pj-termbar">
        <span className="pj-termdot pj-termdot-r" />
        <span className="pj-termdot pj-termdot-y" />
        <span className="pj-termdot pj-termdot-g" />
        <span className="pj-termtitle">console</span>
      </div>
      <div className="pj-termbody">
        <p className="pj-termhead">OS COMMAND TOOLKIT</p>
        <p className="pj-termsub">Main menu</p>
        <div className="pj-termmenu">
          {menu.map((item, i) => (
            <p key={item} className="pj-termitem">
              <span className="pj-termnum">{i + 1}</span>
              {item}
            </p>
          ))}
          <p className="pj-termitem">
            <span className="pj-termnum">0</span>
            Exit program
          </p>
        </div>
        <p className="pj-termprompt">
          Enter your choice: <span className="pj-termcursor" />
        </p>
      </div>
    </div>
  );
}

function VisualSyscallFlow() {
  const steps = ["Console input", "C++ program", "System calls", "File system"];
  return (
    <div className="pj-flow">
      {steps.map((step, i) => (
        <div key={step} className="pj-flow-item">
          <span className="pj-flow-box">{step}</span>
          {i < steps.length - 1 ? <span className="pj-flow-arrow">→</span> : null}
        </div>
      ))}
    </div>
  );
}

function VisualNetwork() {
  return (
    <svg viewBox="0 0 460 290" className="pj-netsvg" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pjNetBox" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="rgba(110,160,255,0.22)" />
          <stop offset="1" stopColor="rgba(40,70,180,0.12)" />
        </linearGradient>
      </defs>
      {/* source */}
      <rect x="18" y="98" width="104" height="94" rx="14" fill="url(#pjNetBox)" stroke="rgba(150,190,255,0.5)" />
      <text x="70" y="138" textAnchor="middle" fill="#dce8ff" fontSize="13" fontWeight="600">Source</text>
      <text x="70" y="156" textAnchor="middle" fill="#dce8ff" fontSize="13" fontWeight="600">network</text>
      {/* router */}
      <rect x="182" y="60" width="118" height="170" rx="16" fill="url(#pjNetBox)" stroke="rgba(170,200,255,0.65)" />
      <text x="241" y="88" textAnchor="middle" fill="#eaf1ff" fontSize="13" fontWeight="700">Router</text>
      <text x="241" y="104" textAnchor="middle" fill="#8fd2ff" fontSize="10" letterSpacing="2">ACL</text>
      <rect x="196" y="118" width="90" height="22" rx="7" fill="rgba(52,199,123,0.16)" stroke="rgba(80,220,150,0.55)" />
      <circle cx="208" cy="129" r="3.4" fill="#4ade80" />
      <text x="248" y="133" textAnchor="middle" fill="#b9f4d2" fontSize="10">Permit</text>
      <rect x="196" y="148" width="90" height="22" rx="7" fill="rgba(255,92,122,0.14)" stroke="rgba(255,120,150,0.5)" />
      <circle cx="208" cy="159" r="3.4" fill="#ff5c7a" />
      <text x="248" y="163" textAnchor="middle" fill="#ffc4d0" fontSize="10">Deny</text>
      <rect x="196" y="178" width="90" height="22" rx="7" fill="rgba(80,150,255,0.14)" stroke="rgba(120,180,255,0.5)" />
      <circle cx="208" cy="189" r="3.4" fill="#5ca0ff" />
      <text x="248" y="193" textAnchor="middle" fill="#c4dcff" fontSize="10">Permit</text>
      <text x="241" y="218" textAnchor="middle" fill="#9fb8e8" fontSize="9">Rules top to bottom</text>
      {/* destination */}
      <rect x="360" y="98" width="86" height="94" rx="14" fill="url(#pjNetBox)" stroke="rgba(150,190,255,0.5)" />
      <text x="403" y="138" textAnchor="middle" fill="#dce8ff" fontSize="13" fontWeight="600">Trusted</text>
      <text x="403" y="156" textAnchor="middle" fill="#dce8ff" fontSize="13" fontWeight="600">hosts</text>
      {/* permitted path */}
      <path d="M122 132 H178" stroke="#4ade80" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
      <path d="M172 127 l8 5 -8 5" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M300 132 H354" stroke="#4ade80" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
      <path d="M348 127 l8 5 -8 5" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="327" y="120" textAnchor="middle" fill="#9df0c5" fontSize="10">allowed</text>
      {/* denied path */}
      <path d="M70 196 C 120 258, 200 258, 238 234" stroke="#ff5c7a" strokeWidth="2" strokeDasharray="5 4" fill="none" strokeLinecap="round" />
      <circle cx="241" cy="232" r="4" fill="#ff5c7a" />
      <text x="150" y="262" textAnchor="middle" fill="#ffb3c2" fontSize="10">unauthorised traffic stopped</text>
    </svg>
  );
}

function VisualRuleTable() {
  const rows = [
    { tone: "ok", word: "Permit", rest: "Trusted sources" },
    { tone: "no", word: "Deny", rest: "Unauthorised traffic" },
    { tone: "mid", word: "Evaluate", rest: "Rules top to bottom" },
  ];
  return (
    <div className="pj-ruletab">
      {rows.map((row) => (
        <div key={row.word} className="pj-rulerow">
          <span className={`pj-ruledot pj-ruledot-${row.tone}`} />
          <span className={`pj-ruleword pj-ruleword-${row.tone}`}>{row.word}</span>
          <span className="pj-rulerest">{row.rest}</span>
        </div>
      ))}
    </div>
  );
}

function VisualRouteGraph() {
  const nodes = [
    { name: "Havelian", x: 62, y: 196 },
    { name: "Abbottabad", x: 158, y: 118 },
    { name: "Haripur", x: 160, y: 238 },
    { name: "Mansehra", x: 282, y: 62 },
    { name: "Taxila", x: 288, y: 216 },
    { name: "Islamabad", x: 396, y: 140 },
    { name: "Murree", x: 396, y: 44 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 3],
    [2, 4],
    [4, 5],
    [3, 6],
    [6, 5],
  ];
  const route = [0, 1, 2, 4, 5];
  return (
    <svg viewBox="0 0 460 290" className="pj-netsvg" aria-hidden="true" focusable="false">
      {edges.map(([a, b]) => {
        const na = nodes[a];
        const nb = nodes[b];
        return (
          <line
            key={`${a}-${b}`}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke="rgba(140,180,255,0.3)"
            strokeWidth="1.6"
          />
        );
      })}
      <polyline
        points={route.map((i) => `${nodes[i].x},${nodes[i].y}`).join(" ")}
        fill="none"
        stroke="#59e0ff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeDasharray="7 6"
        className="pj-route-line"
      />
      {nodes.map((node, i) => (
        <g key={node.name}>
          {i === 0 ? <circle cx={node.x} cy={node.y} r="11" fill="none" stroke="#4ade80" strokeWidth="1.4" opacity="0.8" /> : null}
          {i === 5 ? <circle cx={node.x} cy={node.y} r="11" fill="none" stroke="#6EA0FF" strokeWidth="1.4" opacity="0.8" /> : null}
          <circle cx={node.x} cy={node.y} r="5" fill="#0b1b46" stroke="#9fc4ff" strokeWidth="1.8" />
          <text x={node.x} y={node.y + 22} textAnchor="middle" fill="#c9d9ff" fontSize="10.5">
            {node.name}
          </text>
        </g>
      ))}
      <text x="230" y="278" textAnchor="middle" fill="#8fa9dd" fontSize="10">
        Start and goal rings show a searched route between two cities
      </text>
    </svg>
  );
}

function VisualWebWindow() {
  return (
    <div className="pj-webwin">
      <div className="pj-webwinbar">
        <span className="pj-termdot pj-termdot-r" />
        <span className="pj-termdot pj-termdot-y" />
        <span className="pj-termdot pj-termdot-g" />
      </div>
      <div className="pj-webwinbody">
        <span className="pj-webwin-hero" />
        <span className="pj-webwin-line pj-webwin-line-a" />
        <span className="pj-webwin-line pj-webwin-line-b" />
        <div className="pj-webwin-row">
          <span className="pj-webwin-cell" />
          <span className="pj-webwin-cell" />
          <span className="pj-webwin-cell" />
        </div>
      </div>
    </div>
  );
}

function ProjectVisual({ kind }: { kind: string }) {
  if (kind === "architecture") return <VisualArchitecture />;
  if (kind === "statsGrid") return <VisualStatsGrid />;
  if (kind === "moduleMap") return <VisualModuleMap />;
  if (kind === "terminal") return <VisualTerminal />;
  if (kind === "syscallFlow") return <VisualSyscallFlow />;
  if (kind === "network") return <VisualNetwork />;
  if (kind === "ruleTable") return <VisualRuleTable />;
  if (kind === "routeGraph") return <VisualRouteGraph />;
  return <VisualWebWindow />;
}

/* ============================================================
   Main section
   ============================================================ */

function offsetClass(index: number, active: number) {
  const n = PROJECT_LIST.length;
  const half = Math.floor(n / 2);
  let o = index - active;
  if (o > half) o -= n; // wrap far right to far left
  if (o < -half) o += n; // wrap far left to far right
  const map: Record<number, string> = {
    "0": "pj-c0",
    "1": "pj-cp1",
    "-1": "pj-cm1",
    "2": "pj-cp2",
    "-2": "pj-cm2",
  };
  return map[String(o)] ?? "pj-cx";
}

export default function ProjectsSection() {
  const [active, setActive] = useState(2); // SJARVIS EDU opens centered
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [allOpen, setAllOpen] = useState(false);
  const [visualIdx, setVisualIdx] = useState(0);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const selected = PROJECT_LIST.find((p) => p.slug === selectedSlug) ?? null;
  const selectedIndex = selected
    ? PROJECT_LIST.findIndex((p) => p.slug === selected.slug)
    : -1;
  const prevProject = selected
    ? PROJECT_LIST[(selectedIndex + PROJECT_LIST.length - 1) % PROJECT_LIST.length]
    : null;
  const nextProject = selected
    ? PROJECT_LIST[(selectedIndex + 1) % PROJECT_LIST.length]
    : null;

  useEffect(() => {
    if (!selected) return;
    // Wait for the entering panel to mount (the previous one exits first),
    // then bring the case study into view.
    let tries = 0;
    const poll = setInterval(() => {
      tries += 1;
      if (detailRef.current) {
        clearInterval(poll);
        detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries > 24) {
        clearInterval(poll);
      }
    }, 60);
    return () => clearInterval(poll);
  }, [selected]);

  useEffect(() => {
    if (!allOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAllOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [allOpen]);

  const openDetail = (slug: string) => {
    setSelectedSlug(slug);
    setVisualIdx(0);
  };

  const closeDetail = () => {
    setSelectedSlug(null);
    setTimeout(() => {
      document
        .getElementById("projects")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const step = (direction: 1 | -1) => {
    setActive((prev) => (prev + direction + PROJECT_LIST.length) % PROJECT_LIST.length);
  };

  return (
    <section id="projects" className="pj-section" aria-labelledby="projects-title">
      <div className="pj-hero">
      {/* night sky atmosphere — reduced, calm, one blue world */}
      <div className="pj-sky" aria-hidden="true">
        <div className="pj-nebula pj-nebula-blue" />
        <div className="pj-stars pj-stars-a" />
        <div className="pj-stars pj-stars-b" />
        <div className="pj-horizon" />
        <div className="pj-water">
          <span className="pj-waterline pj-waterline-a" />
          <span className="pj-waterline pj-waterline-b" />
        </div>
        <svg
          className="pj-mounts pj-mounts-far"
          viewBox="0 0 1440 320"
          preserveAspectRatio="xMidYMax slice"
        >
          <path
            fill="#101f4e"
            d="M0 320V210l90-70 70 44 88-88 96 74 60-30 70 52 60-20 80 60 70-34 90 58 66-26 80 50 70-40 90 62 70-30 80 44 60-24 90 56V320z"
          />
        </svg>
        <svg
          className="pj-mounts pj-mounts-near"
          viewBox="0 0 1440 260"
          preserveAspectRatio="xMidYMax slice"
        >
          <path
            fill="#071129"
            d="M0 260V150l110-80 80 52 96-84 110 78 76-38 84 58 74-26 92 64 78-36 96 60 72-30 88 52 82-42 96 60 74-28 90 48 62-22 84 50V260z"
          />
        </svg>
      </div>

      <div className="pj-inner">
        {/* ---------- hero head ---------- */}
        <div className="pj-head" ref={heroRef}>
          <div className="pj-headtext">
            <motion.p
              className="pj-eyebrow"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span>My Projects</span>
              <i />
            </motion.p>
            <motion.h2
              id="projects-title"
              className="pj-title font-display"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            >
              Ideas into
              <br />
              <span className="pj-grad">Real Solutions</span>
            </motion.h2>
            <motion.div
              className="pj-subwrap"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
            >
              <p className="pj-sub">
                A collection of projects I’ve built to learn, solve problems and
                explore new technologies.
              </p>
              <ul className="pj-badges">
                <li className="pj-badge">
                  <svg viewBox="0 0 256 255" aria-hidden="true" focusable="false">
                    <path
                      fill="#3776AB"
                      d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"
                    />
                    <path
                      fill="#FFD43B"
                      d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"
                    />
                  </svg>
                  Python
                </li>
                <li className="pj-badge">
                  <Zap className="pj-badgeico pj-badgeico-fast" aria-hidden />
                  FastAPI
                </li>
                <li className="pj-badge">
                  <Braces className="pj-badgeico pj-badgeico-cpp" aria-hidden />
                  C++
                </li>
                <li className="pj-badge">
                  <Database className="pj-badgeico pj-badgeico-sql" aria-hidden />
                  SQL
                </li>
              </ul>
            </motion.div>
          </div>
          <motion.div
            className="pj-headside"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            <button
              type="button"
              className="pj-allbtn"
              onClick={() => setAllOpen(true)}
            >
              <LayoutGrid className="size-4" aria-hidden />
              All Projects
            </button>
          </motion.div>
        </div>

        {/* ---------- 3D carousel ---------- */}
        <motion.div
          className="pj-stagebox"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: EASE }}
          aria-label="Project showcase carousel"
        >
          <button
            type="button"
            className="pj-arrow pj-arrow-left"
            aria-label="Previous project"
            onClick={() => step(-1)}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>

          <div className="pj-stage">
            {/* glowing platform under the arc */}
            <div className="pj-platform" aria-hidden="true" />
            <div className="pj-platformring pj-platformring-a" aria-hidden="true" />
            <div className="pj-platformcore" aria-hidden="true" />

            {PROJECT_LIST.map((project, index) => {
              const isActive = index === active;
              return (
                <div
                  key={project.slug}
                  className={`pj-cardwrap ${offsetClass(index, active)}`}
                >
                  <div
                    className={`pj-card pj-a-${project.accent}${
                      isActive ? " pj-card-active" : ""
                    }`}
                    onClick={isActive ? () => openDetail(project.slug) : () => setActive(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        if (isActive) openDetail(project.slug);
                        else setActive(index);
                      }
                    }}
                  >
                    {isActive ? (
                      <span className="pj-cardfeat">Featured</span>
                    ) : null}
                    <span className="pj-cardico">{PROJECT_GLYPHS[project.icon]}</span>
                    <span className="pj-cardname">{project.cardName}</span>
                    <span className="pj-cardtag">{project.tagline}</span>
                    {isActive ? (
                      <button
                        type="button"
                        className="pj-viewbtn"
                        onClick={(event) => {
                          event.stopPropagation();
                          openDetail(project.slug);
                        }}
                      >
                        View Details
                        <ArrowRight className="size-3.5" aria-hidden />
                      </button>
                    ) : (
                      <span className="pj-cardgo" aria-hidden="true">
                        <ArrowRight className="size-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="pj-arrow pj-arrow-right"
            aria-label="Next project"
            onClick={() => step(1)}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </motion.div>
      </div>
      </div>

      {/* ---------- detail case study panel ---------- */}
      <div className="pj-detailzone">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.slug}
              ref={detailRef}
              className="pj-detail"
              role="region"
              aria-label={`${selected.name} case study`}
              initial={{ opacity: 0, y: 46 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24, transition: { duration: 0.26, ease: EASE } }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <div className="pj-detailtop">
                <button type="button" className="pj-backbtn" onClick={closeDetail}>
                  <ChevronLeft className="size-4" aria-hidden />
                  Back to Projects
                </button>
                <button
                  type="button"
                  className="pj-closebtn"
                  aria-label="Close case study"
                  onClick={closeDetail}
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>

              <div className="pj-detailgrid">
                {/* left: identity and overview */}
                <aside className="pj-dleft">
                  <div className="pj-didrow">
                    <span className={`pj-dico pj-a-${selected.accent}`}>
                      {PROJECT_GLYPHS[selected.icon]}
                    </span>
                    <div>
                      <h3 className="pj-dname font-display">{selected.name}</h3>
                      <p className="pj-dsubtitle">{selected.subtitle}</p>
                    </div>
                  </div>
                  <div className="pj-dmeta">
                    <span className={`pj-dbadge pj-a-${selected.accent}`}>
                      {selected.badge}
                    </span>
                    {selected.company ? (
                      <span className="pj-dcompany">{selected.company}</span>
                    ) : (
                      <span className="pj-dcompany">{selected.category}</span>
                    )}
                  </div>
                  <ul className="pj-dtech">
                    {selected.tech.map((item) => (
                      <li key={item} className="pj-dtechpill">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="pj-doverview">
                    {selected.overview.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </div>
                  {selected.highlights ? (
                    <div className="pj-dhighlights">
                      {selected.highlights.map((highlight) => {
                        const Icon = HIGHLIGHT_ICONS[highlight.icon] ?? Server;
                        return (
                          <div key={highlight.label} className="pj-dhighlight">
                            <span className="pj-dhico">
                              <Icon className="size-4" aria-hidden />
                            </span>
                            <span className="pj-dhtext">
                              <span className="pj-dhlabel">{highlight.label}</span>
                              <span className="pj-dhsub">{highlight.sub}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </aside>

                {/* center: illustration gallery */}
                <div className="pj-dcenter">
                  <div className={`pj-visual pj-va-${selected.accent}`}>
                    <span className="pj-visflag">Illustration</span>
                    <ProjectVisual kind={selected.visuals[visualIdx].kind} />
                  </div>
                  <p className="pj-viscaption">
                    {selected.visuals[visualIdx].caption}
                  </p>
                  {selected.visuals.length > 1 ? (
                    <div className="pj-visthumbs">
                      {selected.visuals.map((visual, i) => (
                        <button
                          key={visual.caption}
                          type="button"
                          className={`pj-visthumb${i === visualIdx ? " pj-visthumb-on" : ""}`}
                          onClick={() => setVisualIdx(i)}
                          aria-label={`Show ${visual.caption}`}
                        >
                          <ProjectVisual kind={visual.kind} />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* right: features, stack, status */}
                <aside className="pj-dright">
                  {selected.features.length > 0 ? (
                    <div className="pj-dblock">
                      <h4 className="pj-dblocktitle">Key Features</h4>
                      <ul
                        className={`pj-dfeatures${
                          selected.features.length > 8 ? " pj-dfeatures-wide" : ""
                        }`}
                      >
                        {selected.features.map((feature) => (
                          <li key={feature} className="pj-dfeature">
                            <span className="pj-check">
                              <Check className="size-3" aria-hidden />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div className="pj-dblock">
                    <h4 className="pj-dblocktitle">Tech Stack</h4>
                    <ul className="pj-dstack">
                      {selected.tech.map((item) => (
                        <li key={item} className="pj-dstackpill">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {selected.concepts ? (
                    <div className="pj-dblock">
                      <h4 className="pj-dblocktitle">Concepts Demonstrated</h4>
                      <ul className="pj-dstack">
                        {selected.concepts.map((item) => (
                          <li key={item} className="pj-dstackpill pj-dstackpill-dim">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div className="pj-dblock">
                    <h4 className="pj-dblocktitle">Project Status</h4>
                    <span className={`pj-status pj-status-${selected.status.tone}`}>
                      {selected.status.label}
                    </span>
                    <p className="pj-statusnote">{selected.status.note}</p>
                  </div>
                </aside>
              </div>

              {/* what I built */}
              {selected.built ? (
                <div className="pj-built">
                  <h4 className="pj-dblocktitle">What I Built</h4>
                  <ul className="pj-builtlist">
                    {selected.built.map((item) => (
                      <li key={item.slice(0, 24)} className="pj-builtitem">
                        <span className="pj-check pj-check-wide">
                          <Check className="size-3" aria-hidden />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* role, outcome and project switching */}
              <div className="pj-dfoot">
                {selected.role ? (
                  <div className="pj-dfootcell">
                    <span className="pj-dfootlabel">
                      <User className="size-3.5" aria-hidden />
                      My Role
                    </span>
                    <p className="pj-dfoottext">{selected.role}</p>
                  </div>
                ) : null}
                {selected.outcome ? (
                  <div className="pj-dfootcell">
                    <span className="pj-dfootlabel">
                      <Flag className="size-3.5" aria-hidden />
                      Outcome
                    </span>
                    <p className="pj-dfoottext">{selected.outcome}</p>
                  </div>
                ) : null}
                <div className="pj-dswitch">
                  {prevProject ? (
                    <button
                      type="button"
                      className="pj-switchbtn"
                      onClick={() => openDetail(prevProject.slug)}
                    >
                      <ChevronLeft className="size-4" aria-hidden />
                      {prevProject.cardName}
                    </button>
                  ) : null}
                  {nextProject ? (
                    <button
                      type="button"
                      className="pj-switchbtn pj-switchbtn-next"
                      onClick={() => openDetail(nextProject.slug)}
                    >
                      {nextProject.cardName}
                      <ChevronRight className="size-4" aria-hidden />
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ---------- all projects overlay ---------- */}
      <AnimatePresence>
        {allOpen ? (
          <motion.div
            className="pj-veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setAllOpen(false)}
          >
            <motion.div
              className="pj-allpanel"
              role="dialog"
              aria-label="All projects"
              initial={{ opacity: 0, y: 34, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EASE }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pj-allhead">
                <div>
                  <p className="pj-alleyebrow">Collection</p>
                  <h3 className="pj-alltitle font-display">All Projects</h3>
                </div>
                <button
                  type="button"
                  className="pj-closebtn"
                  aria-label="Close all projects view"
                  onClick={() => setAllOpen(false)}
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <div className="pj-allgrid">
                {PROJECT_LIST.map((project: ProjectInfo) => (
                  <button
                    key={project.slug}
                    type="button"
                    className="pj-allcard"
                    onClick={() => {
                      setAllOpen(false);
                      setActive(PROJECT_LIST.findIndex((p) => p.slug === project.slug));
                      openDetail(project.slug);
                    }}
                  >
                    <span className={`pj-allico pj-a-${project.accent}`}>
                      {PROJECT_GLYPHS[project.icon]}
                    </span>
                    <span className="pj-allmeta">
                      <span className="pj-allbadge">{project.badge}</span>
                      <span className="pj-allname">{project.name}</span>
                      <span className="pj-alltag">{project.tagline}</span>
                    </span>
                    <span className="pj-allgo">
                      View Details
                      <ArrowRight className="size-3.5" aria-hidden />
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
