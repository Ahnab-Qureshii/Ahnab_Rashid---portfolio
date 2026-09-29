"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Award, Code2, Folder, GraduationCap, House, Mail, Menu, Search, Target, UserRound, X } from "lucide-react";
import { NAV_LINKS, PROFILE } from "@/lib/profile";
import { PROJECT_LIST } from "@/lib/projects-data";
import { CERTIFICATES } from "@/lib/certificates-data";

/**
 * Global navbar in the site's dark navy neon language (matches the
 * reference of the final Contact page): glowing rounded square AR logo,
 * the name, the five journey links with a scroll spy that lights the
 * current section with a glowing underline, and a search action on
 * the far right. Collapses to a glass dropdown menu on small screens.
 */
/** Small modern icon for every navigation item. */
const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home: House,
  About: UserRound,
  Focus: Target,
  Projects: Folder,
  Skills: Code2,
  Journey: GraduationCap,
  Certificates: Award,
  Contact: Mail,
};

/** Searchable index: sections + every real project (name, tagline, tech). */
type SearchItem = { label: string; sub: string; href: string; keys: string };

const SEARCH_INDEX: SearchItem[] = [
  { label: "Home", sub: "Video hero introduction", href: "#home", keys: "home intro hero video welcome" },
  { label: "About", sub: "Who Ahnab is", href: "#about", keys: "about bio profile story" },
  { label: "Focus", sub: "AI and technology focus areas", href: "#focus", keys: "focus ai agents automation technology" },
  { label: "Skills", sub: "Technical skill set", href: "#skills", keys: "skills stack python coding tools" },
  { label: "Journey", sub: "Education and experience timeline", href: "#experience", keys: "journey education experience timeline matric college university internship work" },
  ...(CERTIFICATES.length > 0
    ? [{ label: "Certificates", sub: "Internship and webinar certificates", href: "#certificates", keys: "certificates certificate credential internship webinar sibrs award achievement" }]
    : []),
  { label: "Contact", sub: "Email, LinkedIn, location and message card", href: "#contact", keys: "contact email linkedin message connect say hi" },
  ...PROJECT_LIST.map((p) => ({
    label: p.cardName || p.name,
    sub: p.tagline,
    href: "#projects",
    keys: `${p.name} ${p.cardName} ${p.tagline} ${p.category} ${p.tech.join(" ")}`.toLowerCase(),
  })),
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#home");
  const [scrolled, setScrolled] = useState(false);

  // The Certificates link only exists while the section has real
  // certificates to show — never a dead navigation target.
  const navLinks = NAV_LINKS.filter(
    (link) => link.href !== "#certificates" || CERTIFICATES.length > 0
  );

  // Scroll spy: light the link of the section currently in view.
  // Focus and Skills are not nav targets, so the nearest passed
  // target stays lit (About holds until Work, Work until Journey...).
  useEffect(() => {
    const ids = navLinks.map((link) => link.href.slice(1));
    let raf = 0;
    const measure = () => {
      raf = 0;
      setScrolled(window.scrollY > 28);
      const mark = window.scrollY + window.innerHeight * 0.38;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mark) current = id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) current = ids[ids.length - 1];
      setActive("#" + current);
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
  }, [navLinks]);

  // Close the mobile menu with Escape or as soon as the page scrolls.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onScroll = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  // ---- search ----
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Ctrl/Cmd + K opens, Escape closes.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus the field whenever the search opens.
  useEffect(() => {
    if (!searchOpen) return;
    const t = window.setTimeout(() => {
      setQuery("");
      searchInputRef.current?.focus();
    }, 60);
    return () => window.clearTimeout(t);
  }, [searchOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_INDEX.slice(0, 8);
    return SEARCH_INDEX.filter((item) =>
      `${item.label} ${item.sub} ${item.keys}`.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const goToResult = (href: string) => {
    setSearchOpen(false);
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`hd-header ${scrolled ? "hd-scrolled" : ""}`}>
      <div className="hd-inner">
        <a href="#home" className="hd-brand" aria-label="Ahnab Rashid, home">
          <span className="hd-logo" aria-hidden>
            AR
          </span>
          <span className="hd-name">{PROFILE.fullName}</span>
        </a>

        <nav className="hd-nav" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`hd-link ${active === link.href ? "hd-active" : ""}`}
              aria-current={active === link.href ? "true" : undefined}
            >
              {(() => {
                const Ic = NAV_ICONS[link.label];
                return Ic ? (
                  <Ic className="hd-link-ic size-[13px]" aria-hidden />
                ) : null;
              })()}
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hd-actions">
          <button
            type="button"
            className="hd-theme"
            aria-label="Search"
            title="Search (Ctrl + K)"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-[16px]" aria-hidden />
          </button>

          <button
            type="button"
            className="hd-burger"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="size-[19px]" aria-hidden />
            ) : (
              <Menu className="size-[19px]" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="hd-mobile" aria-label="Mobile">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`hd-mobile-link ${
                active === link.href ? "hd-mobile-active" : ""
              }`}
              aria-current={active === link.href ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {(() => {
                const Ic = NAV_ICONS[link.label];
                return Ic ? (
                  <Ic className="size-[15px]" aria-hidden />
                ) : null;
              })()}
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}

      {searchOpen ? (
        <div
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label="Search the site"
        >
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 w-full cursor-default bg-[#04070f]/70 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative mx-auto mt-24 w-[92%] max-w-lg overflow-hidden rounded-2xl border border-slate-500/40 bg-[#0a1122]/95 shadow-[0_0_60px_rgba(56,116,255,0.25)]">
            <div className="flex items-center gap-3 border-b border-slate-600/40 px-5 py-4">
              <Search className="size-4 shrink-0 text-sky-300" aria-hidden />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects, skills, sections..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="shrink-0 rounded-md border border-slate-600/60 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 transition-colors hover:text-slate-200"
              >
                ESC
              </button>
            </div>
            <ul className="max-h-72 overflow-y-auto p-2">
              {searchResults.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-slate-500">
                  {`No results for "${query}"`}
                </li>
              ) : (
                searchResults.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => goToResult(item.href)}
                      className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors hover:bg-sky-400/10"
                    >
                      <Search className="size-3.5 shrink-0 text-slate-500 group-hover:text-sky-300" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-100">
                          {item.label}
                        </span>
                        <span className="block truncate text-xs text-slate-500">
                          {item.sub}
                        </span>
                      </span>
                      <ArrowRight className="size-3.5 shrink-0 text-slate-600 transition-colors group-hover:text-sky-300" aria-hidden />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </header>
  );
}
