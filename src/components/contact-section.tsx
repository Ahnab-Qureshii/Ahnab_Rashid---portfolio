"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  RotateCcw,
  Send,
  User,
} from "lucide-react";
import { PROFILE } from "@/lib/profile";
import { copyText } from "@/lib/clipboard";

/**
 * The final Contact page of the portfolio, in the same dark navy neon
 * language as the rest of the site. Left: the eyebrow, the serif
 * headline, the invitation paragraph with a little AI robot doodle,
 * three glowing glass contact cards and a handwritten note. Right: ONE
 * physical 3D flip card — a soft pastel front that flips 180 degrees
 * around the Y axis into the same navy glass message form.
 */

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Havelian, Abbottabad, KPK");

const CHANNELS = [
  {
    key: "email",
    label: "Email",
    value: "nabi41538@gmail.com",
    href: `mailto:${PROFILE.email}`,
    external: false,
    Icon: Mail,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/ahnab-rashid",
    href: PROFILE.linkedin,
    external: true,
    Icon: Linkedin,
  },
  {
    key: "location",
    label: "Location",
    value: "Havelian, Abbottabad, KPK",
    href: MAPS_URL,
    external: true,
    Icon: MapPin,
  },
] as const;

/* ---------- little line art doodles (pure decoration) ---------- */

function RobotDoodle() {
  return (
    <svg
      viewBox="0 0 180 130"
      className="ct-robot"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="ctRobotStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e4f1ff" />
          <stop offset="1" stopColor="#9ec9ff" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#ctRobotStroke)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* speech bubble with AI */}
        <rect x="112" y="8" width="56" height="40" rx="11" />
        <path d="M126 48 l-7 11 16 -11" />
        {/* antenna */}
        <path d="M78 44 V 30" />
        <circle cx="78" cy="23" r="5.5" stroke="#8fd8ff" />
        {/* ears */}
        <rect x="33" y="62" width="11" height="20" rx="4.5" />
        <rect x="112" y="62" width="11" height="20" rx="4.5" />
        {/* head */}
        <rect x="44" y="44" width="68" height="54" rx="15" />
        {/* smile */}
        <path d="M69 83 Q78 90 87 83" stroke="#8fd8ff" />
      </g>
      <circle cx="63" cy="68" r="4.6" fill="#cfe8ff" />
      <circle cx="93" cy="68" r="4.6" fill="#cfe8ff" />
      <text
        x="140"
        y="34"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        fill="#bfe3ff"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        AI
      </text>
      {/* sparkles */}
      <g fill="#8fd8ff" opacity="0.9">
        <path d="M22 26 l2.4 6.2 6.2 2.4 -6.2 2.4 -2.4 6.2 -2.4 -6.2 -6.2 -2.4 6.2 -2.4 Z" />
        <path d="M150 78 l1.9 4.9 4.9 1.9 -4.9 1.9 -1.9 4.9 -1.9 -4.9 -4.9 -1.9 4.9 -1.9 Z" />
        <path d="M28 96 l1.6 4.1 4.1 1.6 -4.1 1.6 -1.6 4.1 -1.6 -4.1 -4.1 -1.6 4.1 -1.6 Z" />
      </g>
    </svg>
  );
}

function RobotMini() {
  return (
    <svg
      viewBox="0 0 64 66"
      className="ct-robot-mini"
      aria-hidden
      focusable="false"
    >
      <g
        fill="none"
        stroke="#9fd9ff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M32 20 V 12" />
        <circle cx="32" cy="8" r="3.4" />
        <rect x="6" y="26" width="7" height="14" rx="3" />
        <rect x="51" y="26" width="7" height="14" rx="3" />
        <rect x="13" y="20" width="38" height="32" rx="10" />
        <path d="M25 40 Q32 46 39 40" />
      </g>
      <circle cx="25" cy="32" r="3" fill="#cfeaff" />
      <circle cx="39" cy="32" r="3" fill="#cfeaff" />
      <path
        d="M52 44 l1.7 4.4 4.4 1.7 -4.4 1.7 -1.7 4.4 -1.7 -4.4 -4.4 -1.7 4.4 -1.7 Z"
        fill="#8fd8ff"
      />
    </svg>
  );
}

/* ---------- the section ---------- */

export default function ContactSection() {
  const [flipped, setFlipped] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  // Escape returns the card to its front.
  useEffect(() => {
    if (!flipped) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFlipped(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped]);

  // Copy Email — copies the existing address and shows a short,
  // honest confirmation. Nothing else about the contact changes.
  const copyEmail = async () => {
    const ok = await copyText(PROFILE.email);
    if (!ok) return;
    setEmailCopied(true);
    window.setTimeout(() => setEmailCopied(false), 2200);
  };

  // No backend here: hand the message to the visitor's own mail app,
  // prefilled with everything she typed. Real behavior, nothing faked.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) return;
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(
      `${message}\n\nFrom: ${name}\nReply to: ${email}`
    );
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    setSent(true);
    window.setTimeout(() => setSent(false), 7000);
  };

  return (
    <section id="contact" className="ct-section" aria-label="Contact">
      {/* atmosphere — one calm blue world */}
      <div className="ct-bg" aria-hidden>
        <div className="ct-gridlines" />
        <div className="ct-stars" />
        <div className="ct-orb ct-orb-blue" />
        <div className="ct-haze" />
      </div>

      <div className="ct-inner">
        <div className="ct-columns">
          {/* ============ LEFT ============ */}
          <div className="ct-left">
            <p className="ct-eyebrow">
              <span>06. — LET’S CONNECT</span>
              <span className="ct-eyebrow-line" aria-hidden />
            </p>

            <h2 className="ct-headline">
              Let’s Build Something{" "}
              <span className="ct-headline-glow">
                Intelligent.
                <svg
                  viewBox="0 0 220 14"
                  className="ct-swash"
                  aria-hidden
                  focusable="false"
                >
                  <defs>
                    <linearGradient id="ctSwash" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#67d6ff" />
                      <stop offset="1" stopColor="#3F7DFF" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M4 10 C 62 3 152 2 216 8"
                    fill="none"
                    stroke="url(#ctSwash)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                </svg>
              </span>
            </h2>

            <div className="ct-intro-row">
              <p className="ct-intro">
                I’m always open to discussing AI agents, conversational AI,
                automation, Python, and backend systems. Whether you have a
                project, an idea, or just want to say hi — I’d love to
                connect!
              </p>
              <RobotDoodle />
            </div>

            <div className="ct-cards">
              {CHANNELS.map(({ key, label, value, href, external, Icon }) => (
                <a
                  key={key}
                  className="ct-card"
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-label={
                    key === "email"
                      ? `Email ${PROFILE.fullName}`
                      : key === "linkedin"
                        ? `${PROFILE.fullName} on LinkedIn`
                        : "Havelian, Abbottabad, KPK on the map"
                  }
                >
                  <span className="ct-card-tile" aria-hidden>
                    <Icon className="ct-card-ic" />
                  </span>
                  <span className="ct-card-text">
                    <span className="ct-card-label">{label}</span>
                    <span className="ct-card-value">{value}</span>
                  </span>
                  <ArrowRight className="ct-card-arrow" aria-hidden />
                </a>
              ))}
            </div>

            {/* quick contact actions — one tap to email, LinkedIn or copy */}
            <div className="ct-quick">
              <p className="ct-quick-label" id="ct-quick-label">
                Quick actions
              </p>
              <div
                className="ct-quick-row"
                role="group"
                aria-labelledby="ct-quick-label"
              >
                <a
                  className="ct-quick-btn"
                  href={`mailto:${PROFILE.email}`}
                >
                  <Mail className="ct-quick-ic" aria-hidden />
                  Email
                </a>
                <a
                  className="ct-quick-btn"
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="ct-quick-ic" aria-hidden />
                  LinkedIn
                </a>
                <button
                  type="button"
                  className={`ct-quick-btn ${emailCopied ? "ct-copied" : ""}`}
                  onClick={copyEmail}
                >
                  {emailCopied ? (
                    <Check className="ct-quick-ic" aria-hidden />
                  ) : (
                    <Copy className="ct-quick-ic" aria-hidden />
                  )}
                  <span aria-live="polite">
                    {emailCopied ? "Email copied ✓" : "Copy Email"}
                  </span>
                </button>
                <a
                  className="ct-quick-btn"
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="ct-quick-ic" aria-hidden />
                  GitHub
                </a>
              </div>
            </div>

            <p className="ct-script-note">
              <span className="ct-script-text">Feel free to reach out!</span>
            </p>
          </div>

          {/* ============ RIGHT — ONE physical 3D flip card ============ */}
          <div className="ct-right">
            <div className="ct-flip-glow" aria-hidden />
            <div
              className={`ct-flip-scene ${flipped ? "ct-is-flipped" : ""}`}
            >
              <div className="ct-flip-inner">
                {/* -------- FRONT (soft pastel) -------- */}
                <div
                  className="ct-face ct-front"
                  role="button"
                  tabIndex={0}
                  aria-label="Flip the card to write a message"
                  onClick={() => setFlipped(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setFlipped(true);
                    }
                  }}
                >
                  <span className="ct-front-sheen" aria-hidden />
                  <span className="ct-front-tile" aria-hidden>
                    <Send className="ct-front-tile-ic" />
                  </span>
                  <p className="ct-front-label">GET IN TOUCH</p>
                  <h3 className="ct-front-title">Send a message</h3>
                  <p className="ct-front-text">
                    Have a question, a project idea, or just want to talk
                    about AI, Python, or backend systems? I’d love to hear
                    from you.
                  </p>
                  <span className="ct-front-btn">
                    Flip to write
                    <ArrowRight className="ct-front-btn-ic" aria-hidden />
                  </span>
                  <p className="ct-front-tap">TAP TO FLIP</p>
                </div>

                {/* -------- BACK (the same navy glass family) -------- */}
                <div className="ct-face ct-back">
                  <button
                    type="button"
                    className="ct-flip-back"
                    onClick={() => setFlipped(false)}
                    aria-label="Flip back to the front"
                  >
                    <RotateCcw className="size-[15px]" aria-hidden />
                  </button>

                  <div className="ct-back-head">
                    <RobotMini />
                    <p className="ct-back-script font-script">Let’s Talk!</p>
                  </div>

                  <form className="ct-form" onSubmit={handleSubmit}>
                    <label className="ct-field">
                      <User className="ct-field-ic" aria-hidden />
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="Your Name"
                        aria-label="Your Name"
                        autoComplete="name"
                      />
                    </label>
                    <label className="ct-field">
                      <Mail className="ct-field-ic" aria-hidden />
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="Your Email"
                        aria-label="Your Email"
                        autoComplete="email"
                      />
                    </label>
                    <label className="ct-field ct-field-area">
                      <MessageSquare className="ct-field-ic" aria-hidden />
                      <textarea
                        name="message"
                        required
                        rows={4}
                        placeholder="Your Message"
                        aria-label="Your Message"
                      />
                    </label>
                    <button type="submit" className="ct-send">
                      Send Message
                      <ArrowRight className="ct-send-ic" aria-hidden />
                    </button>
                    <p className="ct-mail-note">
                      This opens your own email app with the message prefilled —
                      nothing is stored on this site.
                    </p>
                    <p className="ct-sent" role="status">
                      {sent ? "Opening your email app…" : "\u00A0"}
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
