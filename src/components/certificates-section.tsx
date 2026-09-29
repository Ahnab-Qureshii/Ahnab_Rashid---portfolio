"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import Image from "next/image";
import { CERTIFICATES, type Certificate } from "@/lib/certificates-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ============================================================
   CERTIFICATES — ONE unified section.

   Every real certificate (internship + webinars) lives together
   in ONE React Bits–style DepthCarousel — no tabs, no filters,
   no separate subsections. The type chip (INTERNSHIP / WEBINAR)
   is identification only.

   Depth deck: a front card plus gently receding side cards
   (subtle 14deg tilt, -170px depth per level, low 1.4px blur,
   smooth transitions). The deck never moves on its own —
   autoplay is intentionally OFF; the visitor drives everything
   through drag, horizontal wheel, arrows, dots, keyboard or a
   click on a side card.

   The certificate IMAGES are the source of truth: they are shown
   exactly as provided — never recolored, cropped or redesigned
   (object-contain everywhere; the fullscreen viewer serves the
   unoptimized original bytes).

   The viewer is built on Radix Dialog like the CV modal, so focus
   trapping, Escape, outside-click close and background scroll
   locking come from the same accessible foundation the site
   already uses.
   ============================================================ */

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, delay, ease: EASE },
});

/* depth-deck geometry — moderate depth, subtle tilt, low blur */
const X_STEP = 54; /* % of card width per level */
const Z_STEP = -170; /* px per level */
const TILT = 14; /* deg per level */
const SCALE_STEP = -0.17; /* per level */
const OPACITY_STEP = -0.42; /* per level */
const BLUR_STEP = 1.4; /* px per level */
const DRAG_THRESHOLD = 48; /* px before a drag counts as a turn */
const DRAG_FOLLOW = 0.35; /* live track follow while dragging */
const WHEEL_LOCK_MS = 700;

export default function CertificatesSection() {
  const [front, setFront] = useState(0);
  const [active, setActive] = useState<Certificate | null>(null);

  /* drag / wheel bookkeeping — drag lives in state so the deck can
     follow the pointer live; wheel lock is a ref (no re-render churn) */
  const lastPointerX = useRef(0);
  const movedRef = useRef(false);
  const wheelLockUntil = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPx, setDragPx] = useState(0);

  const close = useCallback(() => setActive(null), []);

  const n = CERTIFICATES.length;
  const go = useCallback(
    (dir: 1 | -1) => setFront((f) => (f + dir + n) % n),
    [n],
  );

  // Keep the viewer state reachable from the keyboard: Radix returns
  // focus to the trigger automatically; nothing extra needed here.
  useEffect(() => {
    if (!active) return;
    // Safety net for browsers where ESC is handled by Radix already —
    // this is intentionally redundant and cheap.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  /* circular shortest-path offset for a card relative to the front */
  const offsetFor = (i: number) => {
    let d = (((i - front) % n) + n) % n;
    if (d > n / 2) d -= n;
    return d;
  };

  /* pointer drag — pointer events cover mouse + touch; vertical page
     scroll is never hijacked (touch-action: pan-y in CSS) */
  const onPointerDown = (e: React.PointerEvent) => {
    lastPointerX.current = e.clientX;
    movedRef.current = false;
    setDragPx(0);
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPointerX.current;
    lastPointerX.current = e.clientX;
    if (dx !== 0) {
      setDragPx((p) => p + dx);
      if (Math.abs(dragPx + dx) > 6) movedRef.current = true;
    }
  };
  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragPx <= -DRAG_THRESHOLD) go(1);
    else if (dragPx >= DRAG_THRESHOLD) go(-1);
    setDragPx(0);
    /* movedRef stays true until the click event fires, suppressing
       the click that follows a real drag */
  };
  const onClickCard = (cert: Certificate, d: number) => {
    /* a real drag never opens the viewer or spins the deck */
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    if (d === 0) setActive(cert);
    else setFront(CERTIFICATES.indexOf(cert));
  };

  /* horizontal wheel — only hijacks horizontal intent, never the
     page's vertical scroll */
  const onWheel = (e: React.WheelEvent) => {
    const { deltaX, deltaY } = e;
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return; /* vertical scroll */
    const now = Date.now();
    if (now < wheelLockUntil.current) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    wheelLockUntil.current = now + WHEEL_LOCK_MS;
    go(deltaX > 0 ? 1 : -1);
  };

  const frontCert = CERTIFICATES[front];
  const metaLine = active
    ? [active.org, active.date].filter(Boolean).join(" · ")
    : "";

  // The section only exists when real certificates are present —
  // no placeholder documents are ever shown (authenticity first).
  if (CERTIFICATES.length === 0) return null;

  return (
    <section
      id="certificates"
      className="cert-section"
      aria-labelledby="certificates-title"
    >
      {/* atmosphere — same calm navy family as the other sections */}
      <div className="cert-bg" aria-hidden="true">
        <div className="cert-gridlines" />
        <div className="cert-orb" />
        <div className="cert-haze" />
      </div>

      <div className="cert-inner">
        <motion.p className="cert-eyebrow" {...rise(0)}>
          <span>Certificates</span>
          <i />
        </motion.p>

        <motion.h2
          id="certificates-title"
          className="cert-title font-display"
          {...rise(0.08)}
        >
          Learning, <span className="cert-grad">Certified.</span>
        </motion.h2>

        <motion.p className="cert-lede" {...rise(0.16)}>
          The internship and webinar certificates I have earned — each one
          marks a skill practiced and a lesson carried forward. Open any of
          them to see the original document.
        </motion.p>

        {/* ---------- ONE unified depth deck for ALL certificates ---------- */}
        <motion.div
          className="cert-dc"
          {...rise(0.2)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(-1);
            }
          }}
        >
          <div
            className="cert-dc-stage"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            onWheel={onWheel}
          >
            <div
              className="cert-dc-track"
              data-snap={isDragging ? undefined : "true"}
            >
              {CERTIFICATES.map((cert, i) => {
                const d = offsetFor(i);
                const front_ = d === 0;
                const style = {
                  transform: `translateX(calc(${d * X_STEP}% + ${(isDragging ? dragPx * DRAG_FOLLOW : 0).toFixed(1)}px)) translateZ(${Z_STEP * Math.abs(d)}px) rotateY(${d * TILT}deg) scale(${(1 + SCALE_STEP * Math.abs(d)).toFixed(3)})`,
                  opacity: Math.max(0, 1 + OPACITY_STEP * Math.abs(d)),
                  filter:
                    Math.abs(d) > 0
                      ? `blur(${BLUR_STEP * Math.abs(d)}px)`
                      : undefined,
                  zIndex: 10 - Math.abs(d),
                  pointerEvents: Math.abs(d) > 1 ? "none" : undefined,
                } as React.CSSProperties;
                return (
                  <button
                    key={cert.id}
                    type="button"
                    className="cert-dc-card"
                    style={style}
                    data-front={front_ ? "true" : undefined}
                    aria-current={front_ ? "true" : undefined}
                    aria-label={
                      front_
                        ? `View certificate${cert.title ? `: ${cert.title}` : ""}`
                        : `Bring certificate forward${cert.title ? `: ${cert.title}` : ""}`
                    }
                    onClick={() => onClickCard(cert, d)}
                  >
                    <span className="cert-dc-face">
                      <Image
                        src={cert.src}
                        alt=""
                        width={cert.width}
                        height={cert.height}
                        sizes="(max-width: 719px) 74vw, 384px"
                        className="cert-dc-img"
                        draggable={false}
                      />
                    </span>
                    {front_ ? (
                      <span className="cert-zoom" aria-hidden="true">
                        <Maximize2 className="cert-zoom-ic" />
                        View
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* controls — arrows + dots + counter, no autoplay anywhere */}
          <div className="cert-dc-controls">
            <div className="cert-dc-nav">
              <button
                type="button"
                className="cert-dc-arrow"
                onClick={() => go(-1)}
                aria-label="Previous certificate"
              >
                <ChevronLeft className="cert-dc-arrow-ic" aria-hidden />
              </button>
              <div className="cert-dc-dots" role="tablist" aria-label="Certificates">
                {CERTIFICATES.map((cert, i) => (
                  <button
                    key={cert.id}
                    type="button"
                    role="tab"
                    aria-selected={i === front}
                    className={`cert-dc-dot${i === front ? " is-active" : ""}`}
                    onClick={() => setFront(i)}
                    aria-label={`Go to certificate ${i + 1}${cert.title ? `: ${cert.title}` : ""}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="cert-dc-arrow"
                onClick={() => go(1)}
                aria-label="Next certificate"
              >
                <ChevronRight className="cert-dc-arrow-ic" aria-hidden />
              </button>
            </div>
            <span className="cert-dc-count font-mono-num" aria-hidden="true">
              {String(front + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
          </div>

          {/* front certificate info — reuses the site's card language */}
          <div className="cert-dc-info">
            <span className="cert-type font-mono-num">{frontCert.type}</span>
            {frontCert.title ? (
              <h3 className="cert-name">{frontCert.title}</h3>
            ) : null}
            {frontCert.org ? (
              <p className="cert-org">
                <Building2 className="cert-orgico" aria-hidden />
                {frontCert.org}
              </p>
            ) : null}
            {frontCert.date ? (
              <p className="cert-date font-mono-num">
                <Calendar className="cert-calico" aria-hidden />
                {frontCert.date}
              </p>
            ) : null}
            <button
              type="button"
              className="cert-view"
              onClick={() => setActive(frontCert)}
            >
              View Certificate
              <ArrowUpRight className="cert-view-ic" aria-hidden />
            </button>
          </div>

          {/* position changes announced politely for screen readers */}
          <p className="sr-only" aria-live="polite">
            {`Certificate ${front + 1} of ${n}${frontCert.title ? `: ${frontCert.title}` : ""}`}
          </p>
        </motion.div>
      </div>

      {/* ================= fullscreen certificate viewer ================= */}
      <Dialog.Root
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="cert-overlay" />
          <Dialog.Content
            className="cert-viewer"
            aria-describedby={undefined}
            aria-label={
              active
                ? `Certificate viewer${active.title ? ` — ${active.title}` : ""}`
                : "Certificate viewer"
            }
          >
            {active ? (
              <>
                <div className="cert-viewer-bar">
                  <div className="cert-viewer-heading">
                    <span className="cert-viewer-type font-mono-num">
                      {active.type}
                    </span>
                    {active.title ? (
                      <Dialog.Title className="cert-viewer-title">
                        {active.title}
                      </Dialog.Title>
                    ) : (
                      <Dialog.Title className="cert-viewer-title">
                        Certificate
                      </Dialog.Title>
                    )}
                    {metaLine ? (
                      <p className="cert-viewer-meta">{metaLine}</p>
                    ) : null}
                  </div>
                  <Dialog.Close
                    className="cert-viewer-close"
                    aria-label="Close certificate viewer"
                  >
                    <X className="size-[18px]" aria-hidden />
                  </Dialog.Close>
                </div>

                {/* the certificate itself — original file, contained, never cropped */}
                <div className="cert-viewer-stage">
                  <Image
                    src={active.src}
                    alt={active.alt}
                    width={active.width}
                    height={active.height}
                    sizes="100vw"
                    className="cert-viewer-img"
                    draggable={false}
                    unoptimized
                  />
                </div>
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
