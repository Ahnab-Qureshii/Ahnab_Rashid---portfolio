"use client";

import { motion, MotionConfig } from "framer-motion";
import {
  BrainCircuit,
  Building2,
  CalendarDays,
  Code2,
  GraduationCap,
  Heart,
  MapPin,
  Star,
  Target,
  type LucideIcon,
} from "lucide-react";
import { ABOUT_FACTS, ABOUT_PARAGRAPHS } from "@/lib/profile";

const FACT_ICONS: Record<(typeof ABOUT_FACTS)[number]["key"], LucideIcon> = {
  degree: GraduationCap,
  university: Building2,
  semester: CalendarDays,
  gpa: Star,
  focus: Target,
  location: MapPin,
};

const HIGHLIGHTS: { label: string; Icon: LucideIcon; tone: "blue" | "cyan" }[] =
  [
    { label: "CS Student", Icon: GraduationCap, tone: "blue" },
    { label: "AI Enthusiast", Icon: BrainCircuit, tone: "cyan" },
    { label: "Problem Solver", Icon: Code2, tone: "blue" },
    { label: "Lifelong Learner", Icon: Heart, tone: "cyan" },
  ];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutSection() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="about" className="ab-section" aria-labelledby="about-title">
        {/* atmosphere — one calm blue world, same as the hero */}
        <div className="ab-bg" aria-hidden="true">
          <div className="ab-glow ab-glow-blue" />
          <div className="ab-glow ab-glow-left" />
        </div>

        <div className="ab-inner">
          {/* LEFT */}
          <div className="ab-left">
            <motion.p
              className="ab-eyebrow"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span>02. About me</span>
              <i />
            </motion.p>

            <motion.h2
              id="about-title"
              className="ab-title font-display"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            >
              Who is <span className="ab-grad">Ahnab?</span>
            </motion.h2>

            <motion.div
              className="ab-copy"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
            >
              {ABOUT_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </motion.div>

            <motion.ul
              className="ab-highlights"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
            >
              {HIGHLIGHTS.map(({ label, Icon, tone }) => (
                <li key={label} className="ab-highlight">
                  <span className={`ab-tile ab-tile-${tone}`}>
                    <Icon strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="ab-highlight-label">{label}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* RIGHT */}
          <motion.aside
            className="ab-card-wrap"
            aria-label="Quick facts"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          >
            <div className="ab-card">
              <span className="ab-card-sheen" aria-hidden="true" />

              <h3 className="ab-card-head">
                <span>Quick facts</span>
                <i />
              </h3>

              <dl className="ab-facts">
                {ABOUT_FACTS.map((fact) => {
                  const Icon = FACT_ICONS[fact.key];
                  return (
                    <div key={fact.key} className="ab-fact">
                      <span className="ab-tile ab-tile-lg">
                        <Icon strokeWidth={1.6} aria-hidden="true" />
                      </span>
                      <div className="ab-fact-text">
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>
          </motion.aside>
        </div>
      </section>
    </MotionConfig>
  );
}
