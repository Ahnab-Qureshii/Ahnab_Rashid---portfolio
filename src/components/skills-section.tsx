"use client";

import { motion } from "framer-motion";
import {
  Bot,
  BotMessageSquare,
  Brain,
  Clock,
  Crown,
  Database,
  Globe,
  Lightbulb,
  MessagesSquare,
  Mountain,
  Rocket,
  Users,
  Workflow,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { SKILL_GROUPS } from "@/lib/profile";
import {
  CanvaLogo,
  FastAPILogo,
  GitHubLogo,
  N8NLogo,
  OfficeLogo,
  SQLiteLogo,
  VSCodeLogo,
} from "@/components/brand-icons";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ============================================================
   Official style logos and icons for the CV skills only.
   ============================================================ */

function PythonLogo() {
  return (
    <svg viewBox="0 0 256 255" className="sk-svg" aria-hidden="true" focusable="false">
      <path
        fill="#3776AB"
        d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"
      />
      <path
        fill="#FFD43B"
        d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"
      />
    </svg>
  );
}

function FigmaLogo() {
  return (
    <svg viewBox="0 0 24 24" className="sk-svg" aria-hidden="true" focusable="false">
      <path fill="#F24E1E" d="M12 3H9.2a3 3 0 0 0 0 6H12V3z" />
      <circle cx="15" cy="6" r="3" fill="#FF7262" />
      <path fill="#A259FF" d="M12 9H9.2a3 3 0 0 0 0 6H12V9z" />
      <circle cx="15" cy="12" r="3" fill="#1ABCFE" />
      <path fill="#0ACF83" d="M12 15H9.2a3 3 0 1 0 2.8 3v-3z" />
    </svg>
  );
}

function PakistanFlag() {
  return (
    <svg viewBox="0 0 24 24" className="sk-svg" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="skClipPk">
          <circle cx="12" cy="12" r="9.6" />
        </clipPath>
      </defs>
      <g clipPath="url(#skClipPk)">
        <rect width="24" height="24" fill="#01411C" />
        <rect width="6.6" height="24" fill="#ffffff" />
        <circle cx="14.1" cy="12.2" r="4.9" fill="#ffffff" />
        <circle cx="15.8" cy="10.9" r="4.3" fill="#01411C" />
        <path
          fill="#ffffff"
          d="m17.7 8.2.5 1.45 1.55.05-1.25.95.45 1.45-1.25-.85-1.25.85.45-1.45-1.25-.95 1.55-.05z"
        />
      </g>
      <circle cx="12" cy="12" r="9.6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
    </svg>
  );
}

/* tinted lucide icons */
const TINT = (Icon: ComponentType<{ className?: string; style?: React.CSSProperties }>, color: string) => (
  <Icon className="sk-svg" style={{ color }} aria-hidden />
);

/* ---- the ONLY icon tint palette on the site: one blue light family
   (primary blue → highlight blue → cyan). Real brand logos keep their
   official colors; every generic/conceptual glyph picks from these
   three shades so the whole section reads as one system. ---- */
const ROT = {
  blue: "#3F7DFF",
  cyan: "#3FD8FF",
  hi: "#6EA0FF",
} as const;

/* ---------- icon maps keyed by the exact skill names ----------
   AI interests come first and use the same one-blue-family tints; real
   brand logos keep their official colors. */

const AI_ICONS: Record<string, ReactNode> = {
  "Artificial Intelligence": TINT(Brain, ROT.hi),
  "AI Agents": TINT(Bot, ROT.blue),
  "AI Chatbots": TINT(BotMessageSquare, ROT.cyan),
  "Automation": TINT(Workflow, ROT.blue),
};

const TECH_ICONS: Record<string, ReactNode> = {
  "Python": <PythonLogo />,
  "FastAPI": <FastAPILogo />,
  "SQLite": <SQLiteLogo />,
  "Git & GitHub": <GitHubLogo />,
  "n8n": <N8NLogo />,
  "SQL (basic)": TINT(Database, ROT.cyan),
  "VS Code": <VSCodeLogo />,
  "MS Office": <OfficeLogo />,
  "Canva": <CanvaLogo />,
  "Figma (basic)": <FigmaLogo />,
};

const SOFT_ICONS: Record<string, ReactNode> = {
  "Effective Communication": TINT(MessagesSquare, ROT.blue),
  "Problem Solving": TINT(Lightbulb, ROT.hi),
  "Critical Thinking": TINT(Brain, ROT.cyan),
  "Teamwork": TINT(Users, ROT.blue),
  "Leadership": TINT(Crown, ROT.cyan),
  "Time Management": TINT(Clock, ROT.hi),
  "Quick Learner": TINT(Rocket, ROT.blue),
};

const LANG_ICONS: Record<string, ReactNode> = {
  "Urdu (native)": <PakistanFlag />,
  "Hindko (native)": TINT(Mountain, ROT.cyan),
  "English": TINT(Globe, ROT.blue),
};

/* ============================================================
   Floating stage cards around the central orb. CV skills only.
   ============================================================ */

type FloatCard = {
  key: string;
  name: string;
  cat: string;
  icon: ReactNode;
  posClass: string;
  tintClass: string;
  floatDelay: string;
  riseDelay: number;
};

const FLOAT_CARDS: FloatCard[] = [
  {
    key: "python",
    name: "Python",
    cat: "Programming",
    icon: <PythonLogo />,
    posClass: "sk-pos-python",
    tintClass: "sk-t-python",
    floatDelay: "0s",
    riseDelay: 0,
  },
  {
    key: "sql",
    name: "SQL (basic)",
    cat: "Database",
    icon: TINT(Database, ROT.cyan),
    posClass: "sk-pos-sql",
    tintClass: "sk-t-sql",
    floatDelay: "0.9s",
    riseDelay: 0.05,
  },
  {
    key: "figma",
    name: "Figma (basic)",
    cat: "Design",
    icon: <FigmaLogo />,
    posClass: "sk-pos-figma",
    tintClass: "sk-t-figma",
    floatDelay: "1.8s",
    riseDelay: 0.1,
  },
  {
    key: "github",
    name: "Git & GitHub",
    cat: "Version Control",
    icon: <GitHubLogo />,
    posClass: "sk-pos-github",
    tintClass: "sk-t-github",
    floatDelay: "2.7s",
    riseDelay: 0.15,
  },
  {
    key: "fastapi",
    name: "FastAPI",
    cat: "Backend",
    icon: <FastAPILogo />,
    posClass: "sk-pos-fastapi",
    tintClass: "sk-t-fastapi",
    floatDelay: "1.2s",
    riseDelay: 0.2,
  },
  {
    key: "canva",
    name: "Canva",
    cat: "Design",
    icon: <CanvaLogo />,
    posClass: "sk-pos-canva",
    tintClass: "sk-t-canva",
    floatDelay: "2.1s",
    riseDelay: 0.25,
  },
  {
    key: "office",
    name: "MS Office",
    cat: "Productivity",
    icon: <OfficeLogo />,
    posClass: "sk-pos-office",
    tintClass: "sk-t-office",
    floatDelay: "3s",
    riseDelay: 0.3,
  },
  {
    key: "vscode",
    name: "VS Code",
    cat: "Editor",
    icon: <VSCodeLogo />,
    posClass: "sk-pos-vscode",
    tintClass: "sk-t-vscode",
    floatDelay: "0.5s",
    riseDelay: 0.35,
  },
];

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 26, scale: 0.94 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, delay, ease: EASE },
});

/* ============================================================
   Section
   ============================================================ */

const [aiGroup, techGroup, toolsGroup, softGroup, langGroup] = SKILL_GROUPS;

function Panel({
  title,
  icon,
  items,
  icons,
  accent,
  delay,
}: {
  title: string;
  icon: ReactNode;
  items: readonly string[];
  icons: Record<string, ReactNode>;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div className={`sk-panel sk-p-${accent}`} {...rise(delay)}>
      <div className="sk-ph">
        <span className="sk-phico">{icon}</span>
        <h3 className="sk-phtitle">{title}</h3>
        <i className="sk-phline" />
      </div>
      <ul className="sk-pills">
        {items.map((item) => (
          <li key={item} className="sk-pill">
            <span className="sk-pillico">{icons[item] ?? null}</span>
            <span className="sk-pillname">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="sk-section" aria-labelledby="skills-title">
      {/* atmosphere */}
      <div className="sk-bg" aria-hidden="true">
        <div className="sk-glow sk-glow-blue" />
        <div className="sk-stars" />
        <div className="sk-floor" />
      </div>

      <div className="sk-inner">
        <div className="sk-grid">
          {/* ---------------- LEFT ---------------- */}
          <div className="sk-left">
            <motion.p className="sk-eyebrow" {...rise(0)}>
              <span>My Skills</span>
              <i />
            </motion.p>

            <motion.h2
              id="skills-title"
              className="sk-title font-display"
              {...rise(0.08)}
            >
              Tools <span className="sk-tint">&amp; Technologies</span>
              <br />
              I Work <span className="sk-grad">With</span>
            </motion.h2>

            <motion.div className="sk-copy" {...rise(0.1)}>
              <p>
                The AI areas I’m exploring and the tools I’m learning to use
                as I build projects and grow as a problem solver.
              </p>
            </motion.div>

            {/* 3D stage: orb + floating cards + podium */}
            <motion.div
              className="sk-stagebox"
              aria-label="Illustration of my main tools orbiting my skill set"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="sk-stage" aria-hidden="true">
                {/* one calm orbit — same blue light language as the focus stage */}
                <div className="sk-orbit sk-orbit-back">
                  <span className="sk-orbitdot sk-orbitdot-cyan" />
                </div>

                {/* central glowing orb */}
                <div className="sk-orb">
                  <span className="sk-orbmono">AR</span>
                  <span className="sk-orblabel">Skill Set</span>
                </div>

                {/* floating cards */}
                {FLOAT_CARDS.map((card) => (
                  <div key={card.key} className={`sk-pos ${card.posClass}`}>
                    <motion.div {...rise(card.riseDelay)} className="sk-rise">
                      <div
                        className={`sk-card ${card.tintClass}`}
                        style={{ animationDelay: card.floatDelay }}
                      >
                        <span className="sk-cardico">{card.icon}</span>
                        <span className="sk-cardname">{card.name}</span>
                        <span className="sk-cardcat">{card.cat}</span>
                      </div>
                    </motion.div>
                  </div>
                ))}

                {/* glowing podium */}
                <div className="sk-podium" />
                <div className="sk-podiumring" />
                <div className="sk-podiumbase" />
              </div>
            </motion.div>

            <motion.p className="sk-note" {...rise(0.12)}>
              Small steps build big results
            </motion.p>
          </div>

          {/* ---------------- RIGHT ---------------- */}
          <div className="sk-right">
            <Panel
              title="AI & Interests"
              icon={TINT_CLASS_ICON.hi}
              items={aiGroup.items}
              icons={AI_ICONS}
              accent="ai"
              delay={0.04}
            />
            <Panel
              title="Technical"
              icon={TINT_CLASS_ICON.blue}
              items={techGroup.items}
              icons={TECH_ICONS}
              accent="blue"
              delay={0.08}
            />
            <Panel
              title="Tools"
              icon={TINT_CLASS_ICON.cyan}
              items={toolsGroup.items}
              icons={TECH_ICONS}
              accent="cyan"
              delay={0.12}
            />
            <Panel
              title="Soft Skills"
              icon={TINT_CLASS_ICON.blue}
              items={softGroup.items}
              icons={SOFT_ICONS}
              accent="blue"
              delay={0.16}
            />
            <Panel
              title="Languages"
              icon={TINT_CLASS_ICON.hi}
              items={langGroup.items}
              icons={LANG_ICONS}
              accent="hi"
              delay={0.2}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* small helper: header icons for the three panels */
const CodeGlyph = () => (
  <svg viewBox="0 0 24 24" className="sk-svg" aria-hidden="true" focusable="false">
    <g
      stroke="url(#skGradCode)"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <path d="m8.4 7.4-4.2 4.6 4.2 4.6" />
      <path d="m15.6 7.4 4.2 4.6-4.2 4.6" />
      <path d="m13.1 5.6-2.2 12.8" />
    </g>
    <defs>
      <linearGradient id="skGradCode" x1="4" y1="5" x2="20" y2="19" gradientUnits="userSpaceOnUse">
        <stop stopColor="#57d4ff" />
        <stop offset="1" stopColor="#6e9bff" />
      </linearGradient>
    </defs>
  </svg>
);

const UsersGlyph = () => (
  <svg viewBox="0 0 24 24" className="sk-svg" aria-hidden="true" focusable="false">
    <g stroke="url(#skGradUsers)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="9" cy="8.4" r="2.7" />
      <path d="M3.6 19.2c.5-3.1 2.8-4.8 5.4-4.8s4.9 1.7 5.4 4.8" />
      <circle cx="17" cy="9.2" r="2.1" />
      <path d="M15.8 14.7c2.4.1 4.2 1.6 4.7 4.3" />
    </g>
    <defs>
      <linearGradient id="skGradUsers" x1="3" y1="5" x2="21" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6EA0FF" />
        <stop offset="1" stopColor="#3F7DFF" />
      </linearGradient>
    </defs>
  </svg>
);

const GlobeGlyph = () => (
  <svg viewBox="0 0 24 24" className="sk-svg" aria-hidden="true" focusable="false">
    <g stroke="url(#skGradGlobe)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.4 12h17.2" />
      <path d="M12 3.4c2.3 2.3 3.5 5.3 3.5 8.6s-1.2 6.3-3.5 8.6c-2.3-2.3-3.5-5.3-3.5-8.6s1.2-6.3 3.5-8.6z" />
    </g>
    <defs>
      <linearGradient id="skGradGlobe" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3FD8FF" />
        <stop offset="1" stopColor="#3F7DFF" />
      </linearGradient>
    </defs>
  </svg>
);

const TINT_CLASS_ICON: Record<string, ReactNode> = {
  blue: <CodeGlyph />,
  cyan: <UsersGlyph />,
  hi: <GlobeGlyph />,
};
