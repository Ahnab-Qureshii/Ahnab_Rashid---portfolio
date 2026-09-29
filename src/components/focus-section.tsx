"use client";

import { motion } from "framer-motion";
import { FOCUS_GROUPS } from "@/lib/profile";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- real SVG icons, each with its own color ---------- */

function PythonLogo() {
  return (
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
  );
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fcGradBrain" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3FD8FF" />
          <stop offset="0.55" stopColor="#6EA0FF" />
          <stop offset="1" stopColor="#3F7DFF" />
        </linearGradient>
      </defs>
      <g
        stroke="url(#fcGradBrain)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M9.6 3.6a2.9 2.9 0 0 0-2.9 2.95C4.7 6.9 3.3 8.5 3.3 10.4c0 .9.3 1.7.8 2.4a4 4 0 0 0-.7 2.3 4.1 4.1 0 0 0 4.2 4c.5.8 1.4 1.3 2.5 1.3 1.6 0 2.4-1 2.4-2.6V6.3c0-1.5-1.3-2.7-2.9-2.7z" />
        <path d="M14.4 3.6a2.9 2.9 0 0 1 2.9 2.95c1.9.35 3.3 1.95 3.3 3.85 0 .9-.3 1.7-.8 2.4a4 4 0 0 1 .7 2.3 4.1 4.1 0 0 1-4.2 4c-.5.8-1.4 1.3-2.5 1.3-1.6 0-2.4-1-2.4-2.6V6.3c0-1.5 1.3-2.7 3-2.7z" />
        <path d="M7.1 9.4h2.4M7 12.9h2.5M16.9 9.4h-2.4M17 12.9h-2.5" />
      </g>
    </svg>
  );
}

function RobotIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fcGradBot" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#57d4ff" />
          <stop offset="1" stopColor="#7a9bff" />
        </linearGradient>
      </defs>
      <g
        stroke="url(#fcGradBot)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <rect x="4.5" y="8" width="15" height="10.5" rx="3" />
        <path d="M12 8V4.9" />
        <circle cx="12" cy="3.7" r="1.1" />
        <path d="M4.5 12.6H3M21 12.6h-1.5" />
        <circle cx="9.2" cy="12.7" r="1.15" fill="url(#fcGradBot)" stroke="none" />
        <circle cx="14.8" cy="12.7" r="1.15" fill="url(#fcGradBot)" stroke="none" />
        <path d="M9.8 15.7h4.4" />
      </g>
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fcGradCode" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#59e0ff" />
          <stop offset="1" stopColor="#3f7dff" />
        </linearGradient>
      </defs>
      <g
        stroke="url(#fcGradCode)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <path d="m9.6 9.4-2.9 2.6 2.9 2.6" />
        <path d="m14.4 9.4 2.9 2.6-2.9 2.6" />
        <path d="m12.9 8.4-1.8 7.2" />
      </g>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fcGradChat" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#57e0ff" />
          <stop offset="1" stopColor="#6ea0ff" />
        </linearGradient>
      </defs>
      <g
        stroke="url(#fcGradChat)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M20 11.6a7.6 7.6 0 0 1-7.6 7.6H9l-4.4 2.3.9-3.8A7.6 7.6 0 1 1 20 11.6z" />
        <circle cx="9" cy="11.6" r="1" fill="url(#fcGradChat)" stroke="none" />
        <circle cx="12.4" cy="11.6" r="1" fill="url(#fcGradChat)" stroke="none" />
        <circle cx="15.8" cy="11.6" r="1" fill="url(#fcGradChat)" stroke="none" />
      </g>
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fcGradGear" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EA0FF" />
          <stop offset="1" stopColor="#3F7DFF" />
        </linearGradient>
      </defs>
      <g
        stroke="url(#fcGradGear)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="7.3" />
        <path d="M12 2.7v2.7M12 18.6v2.7M2.7 12h2.7M18.6 12h2.7M5.4 5.4l1.9 1.9M16.7 16.7l1.9 1.9M18.6 5.4l-1.9 1.9M7.3 16.7l-1.9 1.9" />
      </g>
    </svg>
  );
}

/* ---------- 3D block cluster ---------- */

type BlockDef = {
  key: string;
  label: string;
  icon: ReactNode;
  posClass: string;
  tintClass: string;
  icoClass: string;
  floatDelay: string;
  riseDelay: number;
};

const BLOCKS: BlockDef[] = [
  {
    key: "agents",
    label: "AI Agents",
    icon: <RobotIcon />,
    posClass: "fc-pos-agents",
    tintClass: "fc-b-agents",
    icoClass: "fc-ico-bot",
    floatDelay: "0s",
    riseDelay: 0.42,
  },
  {
    key: "chat",
    label: "AI Chatbots",
    icon: <ChatIcon />,
    posClass: "fc-pos-web",
    tintClass: "fc-b-chat",
    icoClass: "fc-ico-chat",
    floatDelay: "1.8s",
    riseDelay: 0.62,
  },
  {
    key: "ai",
    label: "Artificial Intelligence",
    icon: <BrainIcon />,
    posClass: "fc-pos-ai",
    tintClass: "fc-b-ai",
    icoClass: "fc-ico-brain",
    floatDelay: "0.6s",
    riseDelay: 0.3,
  },
  {
    key: "auto",
    label: "Automation",
    icon: <GearIcon />,
    posClass: "fc-pos-auto",
    tintClass: "fc-b-auto",
    icoClass: "fc-ico-gear",
    floatDelay: "2.4s",
    riseDelay: 0.72,
  },
  {
    key: "python",
    label: "Python",
    icon: <PythonLogo />,
    posClass: "fc-pos-python",
    tintClass: "fc-b-python",
    icoClass: "fc-ico-python",
    floatDelay: "1.2s",
    riseDelay: 0.52,
  },
];

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 26, scale: 0.92 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, delay, ease: EASE },
});

export default function FocusSection() {
  return (
    <section id="focus" className="fc-section" aria-labelledby="focus-title">
      {/* atmosphere */}
      <div className="fc-bg" aria-hidden="true">
        <div className="fc-glow fc-glow-blue" />
        <div className="fc-floor" />
      </div>

      <div className="fc-inner">
        {/* LEFT */}
        <div className="fc-left">
          <motion.p className="fc-eyebrow" {...rise(0)}>
            <span>AI &amp; Technology</span>
            <i />
          </motion.p>

          <motion.h2
            id="focus-title"
            className="fc-title font-display"
            {...rise(0.08)}
          >
            My <span className="fc-grad">Focus</span>
          </motion.h2>

          <motion.div className="fc-copy" {...rise(0.16)}>
            <p>
              My internship was in Artificial Intelligence, which further
              developed my interest in the field. I’m especially interested
              in AI agents, AI chatbots and intelligent automation, and I
              enjoy learning how these systems reason, converse and take
              work off people’s hands. Most of my practice has been with
              Python and backend tools like FastAPI, and I’ve recently been
              exploring intelligent automation with n8n. My current focus
              is on AI agents, AI chatbots and intelligent automation.
            </p>
          </motion.div>

          <div className="fc-groups">
            {FOCUS_GROUPS.map((group, groupIndex) => (
              <motion.div
                key={group.label}
                className="fc-group"
                {...rise(0.24 + groupIndex * 0.08)}
              >
                <h3 className="fc-group-label">{group.label}</h3>
                <ul className="fc-chips">
                  {group.items.map((item, itemIndex) => (
                    <li
                      key={item}
                      className={`fc-chip${
                        groupIndex === 0 ? " fc-chip-hl" : ""
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT: glowing 3D block cluster */}
        <motion.div
          className="fc-stage-box"
          aria-label="Illustration of my main focus areas"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="fc-stage" aria-hidden="true">
            {/* one calm orbit — part of the site's blue light language */}
            <div className="fc-orbit fc-orbit-back">
              <span className="fc-orbit-dot fc-orbit-dot-blue" />
            </div>

            {/* glowing platform */}
            <div className="fc-platform" />
            <div className="fc-platform-core" />

            {/* blocks */}
            {BLOCKS.map((block) => (
              <div key={block.key} className={`fc-pos ${block.posClass}`}>
                <motion.div {...rise(block.riseDelay)} className="fc-rise">
                  <div
                    className={`fc-block ${block.tintClass}`}
                    style={{ animationDelay: block.floatDelay }}
                  >
                    <span className={`fc-ico ${block.icoClass}`}>{block.icon}</span>
                    <span className="fc-label">{block.label}</span>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
