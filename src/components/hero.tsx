"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  BotMessageSquare,
  Cpu,
  Download,
  FileText,
  Pause,
  Play,
  Workflow,
  Volume2,
  VolumeX,
} from "lucide-react";
import { PROFILE } from "@/lib/profile";
import CvModal, { CV_PDF_NAME, CV_PDF_PATH } from "@/components/cv-modal";

type HeroProps = {
  /** True once the HELLO intro starts exiting — triggers the reveal. */
  revealed: boolean;
};

/** Deterministic floating particles (no hydration drift). Kept to three
 *  subtle motes — atmosphere without a particle-show feel. */
const MOTES = [
  { left: "12%", top: "30%", size: 3, dur: 13, delay: 0 },
  { left: "52%", top: "18%", size: 3, dur: 14, delay: 2.4 },
  { left: "80%", top: "64%", size: 4, dur: 12.5, delay: 1.2 },
];

/** The three focus cards under the hero — AI direction first. */
const CAPABILITIES = [
  {
    icon: Bot,
    title: "AI Agents",
    desc: "Exploring how autonomous assistants reason, plan and act.",
  },
  {
    icon: BotMessageSquare,
    title: "AI Chatbots",
    desc: "Learning how conversational AI understands and responds.",
  },
  {
    icon: Workflow,
    title: "Intelligent Automation",
    desc: "Experimenting with n8n workflows that save real time.",
  },
];

export default function Hero({ revealed }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);

  // PLAYBACK — the video plays exactly ONCE, from the very beginning,
  // starting the moment the portfolio actually opens (the HELLO intro
  // handing over to the hero). It never loops and never restarts: it
  // freezes on its final frame and only an explicit action from the
  // visitor (Play button / tapping the video) replays it.
  //
  // Browsers only allow sound autoplay after a user interaction. When the
  // visitor steps in through the intro (click / key) the sound-on start
  // succeeds. If the intro auto-advanced with no gesture yet, the browser
  // refuses the sound attempt: playback then continues MUTED from the
  // same position (never restarted) and the visitor's first interaction
  // anywhere unlocks the sound — a pure volume change, nothing resumes or
  // replays. If even muted autoplay is refused, the first interaction
  // starts it, once, with sound. In every path the video starts at most
  // once and is never restarted by page clicks, scrolling or re-renders.
  useEffect(() => {
    if (!revealed) return;
    const el = videoRef.current;
    if (!el) return;

    let cancelled = false;
    const off: Array<() => void> = [];
    const teardown = () => {
      while (off.length) off.pop()?.();
    };
    const isControl = (event: Event) =>
      event.target instanceof Element &&
      event.target.closest("[data-video-controls]") !== null; // buttons handle themselves

    const startWithSound = () => {
      el.muted = false;
      el.volume = 1;
      el.play()
        .then(() => {
          if (!cancelled) setSoundOn(true);
        })
        .catch(() => {
          if (cancelled) return;
          // Sound autoplay refused → continue muted from the SAME position.
          el.muted = true;
          el.play()
            .then(() => {
              // First interaction anywhere unmutes — without restarting or
              // resuming anything (a pure volume change).
              const unlock = (event: Event) => {
                if (isControl(event)) return;
                el.muted = false;
                el.volume = 1;
                setSoundOn(true);
                teardown();
              };
              window.addEventListener("pointerdown", unlock);
              window.addEventListener("keydown", unlock);
              off.push(() => window.removeEventListener("pointerdown", unlock));
              off.push(() => window.removeEventListener("keydown", unlock));
            })
            .catch(() => {
              // Even muted autoplay refused → start exactly once, on the
              // visitor's first interaction, with sound on.
              const start = (event: Event) => {
                if (isControl(event)) return;
                el.muted = false;
                el.volume = 1;
                el.play().catch(() => undefined);
                setSoundOn(true);
                teardown();
              };
              window.addEventListener("pointerdown", start);
              window.addEventListener("keydown", start);
              off.push(() => window.removeEventListener("pointerdown", start));
              off.push(() => window.removeEventListener("keydown", start));
            });
        });
    };

    startWithSound();

    return () => {
      cancelled = true;
      teardown();
    };
  }, [revealed]);

  const toggleSound = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.muted) {
      // Sound only — toggling audio never starts, resumes or replays video.
      el.muted = false;
      el.volume = 1;
      setSoundOn(true);
    } else {
      el.muted = true;
      setSoundOn(false);
    }
  };

  // Pause / resume. Once the video has finished, the same controls replay
  // it from the beginning — replaying is always an explicit visitor action
  // and always starts from the start, never mid-way.
  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.ended) {
      el.currentTime = 0; // manual replay → always from the beginning
      el.play().catch(() => undefined);
    } else if (el.paused) {
      el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  };

  const rv = (cls: string, delay = 0) => ({
    className: `hv-rv ${revealed ? "hv-rv-in" : ""} ${cls}`,
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <>
      {/* ================= VIDEO HERO ================= */}
      <section
        id="home"
        aria-label="Introduction"
        className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-[#070B16]"
      >
        {/* ------- ambient background: gradients + particles ------- */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(1100px_600px_at_18%_-8%,rgba(63,125,255,0.16),transparent_62%),radial-gradient(900px_560px_at_88%_18%,rgba(63,125,255,0.09),transparent_60%),radial-gradient(760px_520px_at_72%_108%,rgba(63,216,255,0.07),transparent_62%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(122,150,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(122,150,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(75%_65%_at_50%_40%,black,transparent)]" />
          {MOTES.map((m, i) => (
            <span
              key={i}
              className="hv-mote"
              style={{
                left: m.left,
                top: m.top,
                width: m.size,
                height: m.size,
                animationDuration: `${m.dur}s`,
                animationDelay: `${m.delay}s`,
                opacity: 0,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-24 pt-32 sm:px-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:pb-16 lg:pt-28">
          {/* ================= LEFT — content ================= */}
          <div className="max-w-xl">
            <div {...rv("flex items-center gap-3", 60)}>
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-sky-400" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.34em] text-sky-300/90">
                {PROFILE.fullName}
              </span>
            </div>

            <div {...rv("mt-5 space-y-1", 140)}>
              <p className="text-[12.5px] font-medium uppercase tracking-[0.26em] text-slate-300/85">
                Computer Science Student
              </p>
              <p className="text-[12.5px] font-medium uppercase tracking-[0.26em] text-slate-300/75">
                AI • Python • Technology
              </p>
            </div>

            <h1
              aria-label="Building Intelligent Ideas Into Reality."
              {...rv(
                "font-display mt-6 text-[clamp(2.5rem,6.2vw,4.4rem)] font-semibold leading-[1.04] text-white",
                220
              )}
            >
              Building{" "}
              <span className="hv-accent bg-gradient-to-r from-[#6EA0FF] to-[#3F7DFF] bg-clip-text text-transparent">
                Intelligent
              </span>
              <br />
              Ideas Into Reality.
            </h1>

            <p
              {...rv(
                "mt-6 max-w-md text-[15px] leading-relaxed text-slate-300/90 lg:text-base",
                320
              )}
            >
              Computer Science student exploring AI, AI Agents, AI Chatbots,
              automation and Python through hands-on learning and projects.
            </p>

            {/* primary actions: projects + CV */}
            <div {...rv("mt-9 flex flex-wrap items-center gap-4", 420)}>
              <a
                href="#projects"
                className="hv-cta group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#3F7DFF] to-[#6EA0FF] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(63,125,255,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_-10px_rgba(110,160,255,0.5)]"
              >
                View My Work
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-500/40 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-slate-100 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400/60 hover:bg-sky-400/10 hover:text-white"
                onClick={() => setCvOpen(true)}
              >
                <FileText className="size-4 text-sky-300" aria-hidden />
                View CV
              </button>
            </div>

            {/* secondary: direct CV download */}
            <div
              {...rv("mt-5 flex flex-wrap items-center gap-3", 520)}
            >
              <a
                className="hv-cv-btn"
                href={CV_PDF_PATH}
                download={CV_PDF_NAME}
              >
                <Download className="size-4" aria-hidden />
                Download CV
              </a>
            </div>
          </div>

          {/* ================= RIGHT — THE EXACT VIDEO ================= */}
          <div {...rv("relative mx-auto w-full max-w-[400px] sm:max-w-[440px]", 260)}>
            {/* glow blobs behind the container */}
            <div
              className="hv-blob -left-10 -top-10 size-56 bg-[#3F7DFF]/30"
              aria-hidden
            />
            <div
              className="hv-blob -bottom-12 -right-8 size-60 bg-[#3FD8FF]/16"
              aria-hidden
            />

            {/* floating decorative AI elements — around the frame only */}
            <div
              className="hv-float-2 absolute -right-4 bottom-14 z-20 hidden items-center gap-2 rounded-2xl border border-cyan-400/30 bg-[#0A1128]/80 px-3.5 py-2 text-[11px] font-semibold text-cyan-200 shadow-[0_0_24px_rgba(63,216,255,0.22)] backdrop-blur-md sm:flex"
              aria-hidden
            >
              <Cpu className="size-4" />
              Python
            </div>
            <span
              className="hv-glow-dot -top-3 right-16"
              aria-hidden
            />
            <span
              className="hv-glow-dot bottom-6 -left-3"
              style={{ background: "#6EA0FF", boxShadow: "0 0 12px #6EA0FF" }}
              aria-hidden
            />

            {/* premium glass container around the untouched video */}
            <div className="hv-video-frame">
              <div className="hv-video-shell aspect-[478/850]">
                <video
                  ref={videoRef}
                  src="/videos/ahnab-hero.mp4"
                  muted={true}
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  controls={false}
                  onClick={togglePlay}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
                  aria-label="Ahnab Rashid working at her desk"
                  className="cursor-pointer"
                />
              </div>

              {/* video controls — pause/play + sound, on the glass frame */}
              <div
                data-video-controls
                className="absolute bottom-5 right-5 z-30 flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? "Pause the video" : "Play the video"}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 ${
                    playing
                      ? "border-slate-500/50 bg-[#0a1122]/80 text-slate-200 hover:border-sky-400/60 hover:text-sky-200"
                      : "border-sky-400/60 bg-sky-400/15 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                  }`}
                >
                  {playing ? (
                    <Pause className="size-4" aria-hidden />
                  ) : (
                    <Play className="size-4" aria-hidden />
                  )}
                  {playing ? "Pause" : "Play"}
                </button>

                <button
                  type="button"
                  onClick={toggleSound}
                  aria-label={soundOn ? "Mute the video" : "Unmute the video"}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 ${
                    soundOn
                      ? "border-sky-400/60 bg-sky-400/15 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                      : "border-slate-500/50 bg-[#0a1122]/80 text-slate-200 hover:border-sky-400/60 hover:text-sky-200"
                  }`}
                >
                  {soundOn ? (
                    <Volume2 className="size-4" aria-hidden />
                  ) : (
                    <VolumeX className="size-4" aria-hidden />
                  )}
                  {soundOn ? "Sound on" : "Tap for sound"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* soft bottom fade into the next section */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#05080F]"
          aria-hidden
        />
      </section>

      {/* interactive CV preview modal */}
      <CvModal open={cvOpen} onOpenChange={setCvOpen} />

      {/* ================= AI • PYTHON • BACKEND strip ================= */}
      <section
        aria-label="Focus areas"
        className="relative overflow-hidden bg-[#05080F] py-16"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_320px_at_50%_0%,rgba(63,125,255,0.10),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.4em] text-sky-300/80">
            AI • AI AGENTS • AI CHATBOTS • AUTOMATION
          </p>
          <div className="mt-9 grid gap-5 sm:grid-cols-3">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="group rounded-3xl border border-slate-700/50 bg-white/[0.035] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400/40 hover:shadow-[0_18px_50px_-16px_rgba(56,116,255,0.45)]"
                >
                  <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3F7DFF]/20 to-[#3FD8FF]/15 text-sky-300 ring-1 ring-sky-400/30 transition-colors group-hover:text-sky-200">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold text-white">
                    {cap.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300/85">
                    {cap.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* scroll indicator */}
          <a
            href="#about"
            className="group mx-auto mt-14 flex w-fit flex-col items-center gap-2.5 text-[10.5px] font-semibold uppercase tracking-[0.32em] text-slate-300 transition-colors hover:text-sky-300"
          >
            Scroll to Explore ↓
            <ArrowDown className="size-4 animate-bounce" aria-hidden />
          </a>
        </div>
      </section>
    </>
  );
}
