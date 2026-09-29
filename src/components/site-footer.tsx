"use client";

import { useState } from "react";
import { ArrowUp, Check, Github, Linkedin, Mail, Share2 } from "lucide-react";
import { NAV_LINKS, PROFILE } from "@/lib/profile";
import { CERTIFICATES } from "@/lib/certificates-data";
import { copyText } from "@/lib/clipboard";

/**
 * The final footer of the portfolio in the dark navy neon language:
 * brand row (AR logo + name + tagline, the three pillars and the social
 * icons), a glowing divider, quick section links, a copyright line and
 * a Back to Top control as the very last element of the page.
 * Social icons are real links only (GitHub profile added when provided
 * by Ahnab — no fake links).
 */
export default function SiteFooter() {
  const [linkCopied, setLinkCopied] = useState(false);

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Share Portfolio — uses the operating system's native share sheet
  // where the browser supports it; everywhere else it copies the exact
  // current URL of the portfolio and confirms with a short message.
  const sharePortfolio = async () => {
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: `${PROFILE.fullName} — Portfolio`,
          url,
        });
        return; // the visitor completed (or cancelled) the native share
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return; // share sheet closed — nothing to do
        }
        // any other failure falls through to the copy fallback
      }
    }
    const ok = await copyText(url);
    if (!ok) return;
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 2200);
  };

  return (
    <footer className="ft-footer" aria-label="Footer">
      <div className="ft-glow" aria-hidden />

      <div className="ft-inner">
        <div className="ft-brand">
          <span className="ft-logo" aria-hidden>
            AR
          </span>
          <div>
            <p className="ft-name">{PROFILE.fullName}</p>
            <p className="ft-tag">Building ideas with code.</p>
          </div>
        </div>

        <p className="ft-mid">Computer Science • AI • Python</p>

        <div className="ft-social">
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${PROFILE.fullName} on LinkedIn`}
            title="LinkedIn"
          >
            <Linkedin className="ft-ic" aria-hidden />
          </a>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${PROFILE.fullName} on GitHub`}
            title="GitHub"
          >
            <Github className="ft-ic" aria-hidden />
          </a>
          <a
            href={`mailto:${PROFILE.email}`}
            aria-label={`Email ${PROFILE.fullName}`}
            title="Email"
          >
            <Mail className="ft-ic" aria-hidden />
          </a>
        </div>
      </div>

      <div className="ft-rule" aria-hidden>
        <span className="ft-rule-dot" />
      </div>

      <nav className="ft-nav" aria-label="Footer quick links">
        {/* same guard as the header: the Certificates link only exists
            while real certificates are on the page */}
        {NAV_LINKS.filter(
          (link) => link.href !== "#certificates" || CERTIFICATES.length > 0
        ).map((link) => (
          <a key={link.href} href={link.href} className="ft-nav-link">
            {link.label}
          </a>
        ))}
      </nav>

      <p className="ft-copy" suppressHydrationWarning>
        © {new Date().getFullYear()} {PROFILE.fullName}. All rights reserved.
      </p>

      <div className="ft-topwrap">
        <button
          type="button"
          className={`ft-top ${linkCopied ? "ft-copied" : ""}`}
          onClick={sharePortfolio}
        >
          {linkCopied ? (
            <Check className="ft-top-ic" aria-hidden />
          ) : (
            <Share2 className="ft-top-ic" aria-hidden />
          )}
          <span aria-live="polite">
            {linkCopied ? "Link copied ✓" : "Share Portfolio"}
          </span>
        </button>
        <button type="button" className="ft-top" onClick={backToTop}>
          <ArrowUp className="ft-top-ic" aria-hidden />
          Back to Top
        </button>
      </div>
    </footer>
  );
}
