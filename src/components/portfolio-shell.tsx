"use client";

import { useCallback, useEffect, useState } from "react";
import HelloIntro from "@/components/hello-intro";
import SiteHeader from "@/components/site-header";
import Hero from "@/components/hero";
import SiteFooter from "@/components/site-footer";
import {
  AboutSection,
  CertificatesSection,
  ContactSection,
  ExperienceSection,
  FocusSection,
  ProjectsSection,
  SkillsSection,
} from "@/components/sections";

type Phase = "intro" | "reveal" | "done";

/** Returning visitors skip the HELLO intro entirely (per browser session). */
const INTRO_SEEN_KEY = "hello-intro-done";

export default function PortfolioShell() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [introReady, setIntroReady] = useState(false);

  // One-time check: if this visitor has already seen the intro in this
  // session, go straight to the portfolio — fully usable, no scroll
  // lock, no repeated intro. First-time visitors get the intro.
  // Deferred one tick so session storage never causes a hydration
  // mismatch (server always paints the navy shell first).
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch {
      // Storage can be unavailable (privacy modes) — show the intro.
    }
    const t = window.setTimeout(() => {
      if (seen) setPhase("done");
      else setIntroReady(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  // Lock scrolling while the HELLO experience is on screen. Returning
  // visitors land on phase "done", so the page is never locked for them.
  useEffect(() => {
    document.documentElement.style.overflow =
      phase === "done" ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [phase]);

  // The cinematic opening always starts from the very top of the page.
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const handleExiting = useCallback(() => {
    setPhase((prev) => (prev === "intro" ? "reveal" : prev));
  }, []);

  const handleComplete = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // Ignore — the intro simply plays again next visit.
    }
    setPhase("done");
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#070B16] text-[#F5F7FF]">
      {introReady && phase !== "done" ? (
        <HelloIntro onExiting={handleExiting} onComplete={handleComplete} />
      ) : null}

      <SiteHeader />

      <main className="flex-1">
        <Hero revealed={phase !== "intro"} />
        <AboutSection />
        <FocusSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <CertificatesSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
