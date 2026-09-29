"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// Runs useLayoutEffect in the browser (pre-paint) and falls back to
// useEffect during SSR — avoids the SSR warning while preventing flash.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type HelloIntroProps = {
  /** Fired the moment the exit transition begins (hero should start fading in). */
  onExiting: () => void;
  /** Fired once the intro has fully faded out. */
  onComplete: () => void;
};

const WORD = ["H", "E", "L", "L", "O"];
const AUTO_EXIT_MS = 5600;
const EXIT_DURATION_MS = 1000;

export default function HelloIntro({ onExiting, onComplete }: HelloIntroProps) {
  const [exiting, setExiting] = useState(false);
  const exitingRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const beginExit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);
    onExiting();

    const t = window.setTimeout(() => onComplete(), EXIT_DURATION_MS);
    timersRef.current.push(t);
  }, [onExiting, onComplete]);

  // Clear any pending timers on unmount (StrictMode-safe).
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // Auto-advance the sequence with fixed, deterministic timings.
  useEffect(() => {
    const t = window.setTimeout(() => beginExit(), AUTO_EXIT_MS);
    return () => window.clearTimeout(t);
  }, [beginExit]);

  // Key press steps inside early. Click works through the overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        beginExit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beginExit]);

  // Reduced motion: dissolve the intro immediately (pre-paint, no flash).
  useIsoLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      beginExit();
    }
  }, [beginExit]);

  return (
    <div
      onClick={() => beginExit()}
      className={`hello-screen fixed inset-0 z-[90] cursor-pointer select-none bg-[#070B16] outline-none ${
        exiting ? "hello-screen-out" : ""
      }`}
    >
      {/* soft vignette + cool navy glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 36% at 50% 46%, rgba(63,125,255,0.10), transparent 70%), radial-gradient(60% 44% at 62% 58%, rgba(63,216,255,0.04), transparent 72%)",
        }}
      />

      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="hello-word flex items-baseline font-display text-[clamp(3.4rem,13vw,8.5rem)] leading-none text-[#F5F7FF]">
          {WORD.map((letter, i) => (
            <span
              key={`${letter}-${i}`}
              className="hello-letter"
              style={{ ["--d" as string]: `${i * 95}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div className="hello-rule mt-8" />

        <p className="hello-fade mt-7 text-[11px] font-medium uppercase tracking-[0.5em] text-[#9AA7C2]">
          Ahnab Rashid
        </p>
      </div>

      <p className="hello-hint absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10.5px] uppercase tracking-[0.34em] text-[#F5F7FF]/45">
        click anywhere to step inside
      </p>

      {/* Clearly accessible skip control — keyboard focusable, real button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          beginExit();
        }}
        className="hello-skip"
        aria-label="Skip the introduction and open the portfolio"
      >
        Skip Intro
      </button>
    </div>
  );
}
