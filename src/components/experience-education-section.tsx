"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Bot,
  Building2,
  Calendar,
  CodeXml,
  GraduationCap,
  Megaphone,
  School,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ============================================================
   EXPERIENCE & EDUCATION — dark futuristic neon timeline.

   Content below is provided verbatim by Ahnab and must not be
   altered or extended:

   - Strict order: 01 Matric → 02 Intermediate → 03 BS Computer
     Science → 04 Digital Marketing → 05 AI & Python Internship
     → 06 NAVTTC (AI for Everyone).
   - No marks / academic results are shown for Matric or
     Intermediate (explicitly requested).
   - Titles, organisations, dates and descriptions are exactly
     as supplied. The only dash characters anywhere in this
     section are inside the user supplied strings themselves:
     "2024 – Present", "2022 – 2023", "(short-term)" and the
     em dash inside the internship description.
   ============================================================ */

type Entry = {
  num: string;
  title: string;
  /** lighter continuation of the title, e.g. "(Science)" */
  soft?: string;
  /** glowing continuation of the title, e.g. "Internship" */
  tint?: string;
  org: string;
  date: string;
  desc?: string;
  icon: LucideIcon;
  accent: 0 | 1 | 2;
};

const ACCENTS: ReadonlyArray<readonly [string, string]> = [
  ["#3FD8FF", "#3F7DFF"], // cyan → primary blue
  ["#6EA0FF", "#3F7DFF"], // highlight → primary blue
  ["#8FB8FF", "#3FD8FF"], // soft blue → cyan
];

const ENTRIES: Entry[] = [
  {
    num: "01",
    title: "Matric",
    soft: "(Science)",
    org: "New Century Secondary Public School, Havelian",
    date: "2018",
    icon: BookOpen,
    accent: 0,
  },
  {
    num: "02",
    title: "Intermediate",
    soft: "(Computer Science)",
    org: "Girls Degree College, Havelian",
    date: "2020",
    icon: School,
    accent: 1,
  },
  {
    num: "03",
    title: "BS Computer Science",
    org: "Abbottabad University of Science and Technology (AUST)",
    date: "2024 – Present",
    desc: "Currently in the 6th semester with a 3.76 GPA, focusing coursework and self-study around Artificial Intelligence and backend development.",
    icon: GraduationCap,
    accent: 2,
  },
  {
    num: "04",
    title: "Digital Marketer",
    soft: "(short-term)",
    org: "Freelance / short-term work",
    date: "2022 – 2023",
    desc: "Worked on various digital marketing tasks and projects on a freelance basis.",
    icon: Megaphone,
    accent: 0,
  },
  {
    num: "05",
    title: "AI & Python",
    tint: "Internship",
    org: "SIBRS Technology",
    date: "Summer 2026 · Phase 6",
    desc: "Trained in Python and OOP, then contributed Phase 6 (Classroom Management) of SJARVIS EDU — an independent FastAPI backend with SQLAlchemy and SQLite, checked by an automated test suite. Also introduced to Git, GitHub and n8n workflow automation, and delivered several technical presentations.",
    icon: CodeXml,
    accent: 1,
  },
  {
    num: "06",
    title: "AI for Everyone",
    org: "NAVTTC Course",
    date: "Currently pursuing",
    icon: Bot,
    accent: 2,
  },
];

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, delay, ease: EASE },
});

/**
 * One smooth curve per row, from the card edge to the glowing node
 * on the central spine. The SVG stretches vertically with the row;
 * `vector-effect: non-scaling-stroke` keeps the line weight crisp.
 * All six curves + the central spine + the nodes together form ONE
 * continuous glowing path that travels 01 → 06.
 */
function Connector() {
  return (
    <svg
      className="ee-link"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="ee-linkhalo" d="M 0 64 C 38 64 58 50 100 50" />
      <path className="ee-linkline" d="M 0 64 C 38 64 58 50 100 50" />
    </svg>
  );
}

function EntryCard({ e }: { e: Entry }) {
  const Icon = e.icon;
  return (
    <article className="ee-card">
      <span className="ee-num font-mono-num">{e.num}</span>
      <span className="ee-ico">
        <Icon className="ee-icosvg" aria-hidden />
      </span>
      <div className="ee-body">
        <div className="ee-toprow">
          <h3 className="ee-etitle">
            {e.title}
            {e.soft ? <span className="ee-soft"> {e.soft}</span> : null}
            {e.tint ? <span className="ee-glowword"> {e.tint}</span> : null}
          </h3>
          <span className="ee-date font-mono-num">
            <Calendar className="ee-cal" aria-hidden />
            {e.date}
          </span>
        </div>
        <p className="ee-org">
          <Building2 className="ee-orgico" aria-hidden />
          {e.org}
        </p>
        <span className="ee-orgline" aria-hidden="true" />
        {e.desc ? <p className="ee-desc">{e.desc}</p> : null}
      </div>
    </article>
  );
}

export default function ExperienceEducationSection() {
  const flowRef = useRef<HTMLDivElement | null>(null);
  const [liveIdx, setLiveIdx] = useState(0);

  // The timeline itself is the interaction: a progress fill grows along
  // the central spine as the visitor scrolls, and the milestone the
  // read-line has reached gets a quiet highlight. Scroll-linked, calm,
  // no looping animation added.
  useEffect(() => {
    const el = flowRef.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const line = window.innerHeight * 0.42;
      const progress = Math.min(1, Math.max(0, (line - rect.top) / rect.height));
      el.style.setProperty("--ee-progress", progress.toFixed(4));
      const rows = el.querySelectorAll(".ee-row");
      let idx = 0;
      rows.forEach((row, i) => {
        if (row.getBoundingClientRect().top + 24 < line) idx = i;
      });
      setLiveIdx(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="experience"
      className="ee-section"
      aria-labelledby="experience-title"
    >
      {/* atmosphere: faint blueprint grid + one blue glow (no photos,
          no landscape, no people, no globe) */}
      <div className="ee-bg" aria-hidden="true">
        <div className="ee-gridlines" />
        <div className="ee-stars" />
        <div className="ee-orb ee-orb-cyan" />
        <div className="ee-haze" />
      </div>

      <div className="ee-inner">
        <motion.p className="ee-eyebrow" {...rise(0)}>
          <span>Experience &amp; Education</span>
          <i />
        </motion.p>

        <motion.h2
          id="experience-title"
          className="ee-title font-display"
          {...rise(0.08)}
        >
          From <span className="ee-grad-a">Learning</span> to{" "}
          <span className="ee-grad-b">Building</span>
        </motion.h2>

        <motion.p className="ee-lede" {...rise(0.16)}>
          From school to skills, every step has built the foundation for my
          journey in tech.
        </motion.p>

        <div className="ee-flow" ref={flowRef}>
          <div className="ee-rows">
            {/* the single continuous glowing spine, its scroll progress
                fill and a traveling light pulse */}
            <span className="ee-progress" aria-hidden="true" />
            <span className="ee-spark" aria-hidden="true" />

            {ENTRIES.map((e, i) => {
              const side = i % 2 === 0 ? "right" : "left"; // 01 right, 02 left, …
              const [acc, acc2] = ACCENTS[e.accent];
              return (
                <motion.div
                  key={e.num}
                  className={`ee-row ee-row--${side}${i === liveIdx ? " ee-row-live" : ""}`}
                  style={{ "--acc": acc, "--acc2": acc2 } as CSSProperties}
                  {...rise(i * 0.05)}
                >
                  <Connector />
                  <span className="ee-junction" aria-hidden="true" />
                  <div className="ee-nodebox" aria-hidden="true">
                    <span className="ee-node" />
                  </div>
                  <div className="ee-slot">
                    <EntryCard e={e} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
