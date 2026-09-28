# Worklog

---
Task ID: 2
Agent: Super Z (main agent)
Task: Fix ONLY two problems on the existing portfolio (no redesign): (1) the niqabi presenter felt like a completely static photograph — give HER subtle human movement while the photo/environment stays perfectly still; (2) the Home page was missing clickable social/contact icons.

Work Log:
- User attached a NEW clean plate of the same scene (upload/pasted_image_1789955026193.png → public/images/hero-base.png, md5 7084940c664178cc1fe719312d3a4d27, never edited): identical woman/pose, but without the baked-in template text the old patch layers were dissolving. Removed patch-layer + Ken Burns (kb-anim) entirely — the base photo is now 100% still, as required.
- Generated greeting-pose keyframes from the SAME photo via z-ai image-edit (scripts/motion/gen_frames.mjs, 1152x864): f1 = shoulder-height open-palm hello wave, f2 = chest-height greeting palm, f3 = graceful hand-to-heart settle. Keyboard hand stays put in all renders, so no laptop-edge compositing was needed.
- Aligned each re-render to the original with a coarse-to-fine scale/shift search on static regions (scripts/motion/align_frames.py), then extracted ONLY the changed hand region (adaptive diff mask: threshold → morph close → largest component → fill holes → dilate → feather) and Poisson-blended (cv2.seamlessClone NORMAL) it into the original photo (scripts/motion/composite_hands.py) → public/images/f{1,2,3}-layer.png (full-frame RGBA, transparent outside the hand).
- Built the breathing layer (scripts/motion/make_idle_layer.py): presenter-idle.png = the same photo masked to her head/hijab/torso silhouette (hand-traced polygon, inset 12px, feathered; deliberately excludes laptop, mug, keyboard hand, desk sleeve, chair) so ONLY she breathes (±2px chest rise, 5.8s) and micro-sways (0.12°, 9.6s).
- Rewrote src/components/hero.tsx: static base image + nested breathe/sway presenter layers + 3 gesture keyframe layers driven by a deterministic JS timeline (GESTURE_FULL ≈2.5s: rise f2 → hello f1 → hold → wave pulses f2↔f1 → heart settle f3 → return; GESTURE_SHORT chest version). First hello fires ~1.1s after reveal; a short gesture syncs with voice play; idle repeats every 15s alternating sequences, skipped while audio plays or tab hidden. Hydration-safe (initial frame "none", timers only in effects, no Math.random/Date.now), reduced-motion disables all presenter/gesture animation. Added loading="eager" to gesture frames (LCP warning fix).
- Social icons: central SOCIAL_LINKS in src/lib/profile.ts (LinkedIn https://www.linkedin.com/in/ahnab-rashid + Email mailto:nabi41538@gmail.com real; GitHub/Instagram/Facebook empty = hidden until real URLs are filled in). Minimal monochrome 40px circular buttons under the CTAs: hover -translate-y-0.5 + border/bg shift + tiny uppercase tooltip (CSS .social-tip, keyboard-focus visible), aria-labels, target=_blank rel=noopener.
- Verified via agent-browser: LinkedIn icon click navigates to the real LinkedIn profile (authwall redirect observed = live link); tooltips render; 40px tap targets on mobile; desktop 1440x900 / tablet 820x1180 / mobile 390x844 all frame her correctly with legible text; gesture captured mid-flight at all three poses and looks natural; zero page errors, zero hydration errors, clean console; ESLint clean on changed files.
- NOTE for future sessions: the sandbox kills background processes between Bash calls — run the dev server and browser checks inside ONE bash call (see scripts/verify_site*.sh pattern).

Stage Summary:
- Deliverable: the same working design with (1) a living presenter — still photo base + her cutout breathing/swaying + a real "Hello" hand gesture built from the exact uploaded woman (no face reveal, no talking-head, no environment motion), and (2) clickable minimal social icons on Home with a central config for future links.
- Key artifacts: public/images/{hero-base,presenter-idle,f1-layer,f2-layer,f3-layer}.png, src/components/hero.tsx, src/lib/profile.ts (SOCIAL_LINKS), src/app/globals.css (presenter/gesture/social-tip styles), scripts/motion/* (asset pipeline).
- Old assets hero-character.png / hero-wall-blur.jpg remain on disk unreferenced (kept as backup).

---
Task ID: 1
Agent: Super Z (main agent)
Task: Rebuild/modify Ahnab Rashid's portfolio website focusing on (1) cinematic HELLO opening, (2) Home/Hero with the EXACT uploaded niqabi character image, (3) voice/speaking character experience, plus rough placeholder sections for the rest of the site.

Work Log:
- Read previous context: workspace was empty (prior session lost), so project was scaffolded fresh via fullstack-dev init script (Next.js 16 + Tailwind 4 + shadcn/ui).
- Read CV image + internship report + SJARVIS EDU Phase 6 report + OS Command Toolkit report to ground all copy in real facts (BSCS @ AUST, 6th sem, GPA 3.76, Sibrisi Technology internship, FastAPI/SQLAlchemy/SQLite, 66 endpoints/13 routers/16 tables/118 tests, City Route Finder, ACL, OS Command Toolkit).
- Copied the EXACT uploaded image (upload/pasted_image_1789952048796.png) to public/images/hero-character.png — MD5 verified identical (b308e309e9aca121ec57879f9561390e). Image file never edited.
- Generated professional warm female TTS voice intro via z-ai CLI (voice: tongtong, speed 0.95, WAV 24kHz, 17.1s) → public/audio/intro.wav.
- Sampled wall tones from the photo (scripts/sample_colors.py) to ground the palette (warm ivory paper, ink charcoal, dusty rose accent).
- Built components:
  - src/components/hello-intro.tsx — cinematic dark HELLO opening: per-letter blur/rise stagger, tracking tighten animation, hairline rule, "Ahnab Rashid" small caps, "click anywhere to step inside" hint, auto-exit at 5.6s, click/Escape/Enter/Space skip, isomorphic layout effect for reduced-motion pre-paint skip, 1s crossfade into hero.
  - src/components/hero.tsx — hero section: EXACT photo in a pixel-accurate cover-emulation stage (hero-stage CSS, aspect 1448/1086, viewport-bias transform so she stays framed on mobile), Ken Burns drift (kb-anim), two masked wash layers (patch-layer) that dissolve the baked-in template text of the original stock photo into the wall using a blurred derivative of the SAME photo (public/images/hero-wall-blur.jpg, generated by scripts/make_wall_blur.py; original asset untouched), hero content ("HELLO, I'M / Ahnab Rashid", intro line, facts, CTAs, voice chip), live captions (aria-live) driven by audio timeupdate cues, voice chip with deterministic CSS equalizer bars + invite pulse, scroll cue, audio element with play/pause/ended handlers.
  - src/components/site-header.tsx — fixed header, frosted pill nav over photo, scrolled state, mobile logo + Contact.
  - src/components/sections.tsx — rough but real sections: About, AI & Technology Focus, Featured Projects, Skills, Experience & Education timeline, Contact.
  - src/components/site-footer.tsx — dark sticky footer.
  - src/components/portfolio-shell.tsx — orchestrates intro phases (intro → reveal → done), scroll lock, gesture-based voice unlock, scroll restoration.
  - src/lib/profile.ts — all real portfolio data + caption cue timings.
  - src/app/layout.tsx — Playfair Display + Manrope + Geist Mono, real metadata, AR favicon.
  - src/app/globals.css — design tokens, keyframes (helloLetter, kenburns, eq, invite), stage geometry, patch masks, vignette, reduced-motion guards.
- Bug fixing during browser verification:
  - Replaced backdrop-filter patches (Chromium does not feather backdrop-filter with mask-image → hard rectangle) with masked blurred-photo layers — seamless photographic blend.
  - Widened left mask (36%/42% at 19% 33%, core 60%) to kill a faint "HE" ghost at the left edge.
  - Removed stray "she says hello" label; added images.qualities [75,92] to next.config.ts.
- Verified via agent-browser at 1440×900, 1280×1024, 390×844: intro renders, click-to-enter unlocks and auto-plays voice (confirmed audio.currentTime advancing), captions sync, chip toggles play/pause, anchor nav scrolls, sections render, footer sticks, zero console/hydration errors, lint clean.

Stage Summary:
- Deliverable: cinematic HELLO → Home/Hero experience with the EXACT uploaded image (unmodified), female niqabi character "speaking" via real TTS voice + equalizer + synced captions, plus rough real-data sections and footer; production-quality Next.js 16 code, no new dependencies beyond existing stack, hydration-safe and reduced-motion-aware.
- Key artifacts: public/images/hero-character.png (original, MD5-verified), public/images/hero-wall-blur.jpg (aux blurred wash layer), public/audio/intro.wav (TTS voice), src/components/{hello-intro,hero,site-header,sections,site-footer,portfolio-shell}.tsx, src/lib/profile.ts.
- Next steps (user agreed): polish each remaining section one by one (About, Focus, Projects, Skills, Experience, Contact), possibly add real GitHub link, contact form, and refined mobile nav.

---
Task ID: 4
Agent: Super Z (main agent)
Task: ROLLBACK the Home/Hero "Welcome to my portfolio" implementation (Task 3) — restore Home to the exact pre-welcome state; keep the HELLO intro exactly as approved. No redesign, nothing else touched.

Work Log:
- Identified git commit 6c43ddb (2026-09-21 02:32) as the exact pre-welcome state: hero.tsx has presenter gesture layers (f1-layer) and zero welcome markers; verified via git diff that 6c43ddb..HEAD touched ONLY the 3 welcome-related files (hero.tsx, globals.css, layout.tsx — +379/-15 lines, all from Task 3).
- Restored all 3 files byte-accurate: git checkout 6c43ddb -- src/components/hero.tsx src/app/globals.css src/app/layout.tsx.
- Removed by the rollback: welcome block JSX, welcome-light/glow/mote CSS, Great_Vibes + Cormorant_Garamond fonts, welcome retimings (rv delays back to 350-980ms, first hello back to 1100ms, autoVoice back to immediate).
- Untouched (as ordered): HELLO intro (never modified in Task 3), presenter breathing/wave animation (previously approved Task 2 feature), social icons, niqabi photo, all other sections.
- Browser-verified (scripts/verify_rollback.sh, 1440x900): .welcome/.welcome-light/.welcome-glow/.mote/.font-script all absent; 3 gesture layers present; 2 social icons; voice chip present; h1 back to 84.8px (original clamp cap); h1 transitionDelay 0.48s (original). Screenshots rb_1_hello.png (HELLO intact) + rb_2_home.png (original Home).
- Runtime error hooks (window.onerror + unhandledrejection) captured zero errors across the HELLO -> click -> Home flow. (Two empty-string entries in agent-browser's error collector also occur on pristine code — collector artifact, not a runtime error.)

Stage Summary:
- Home/Hero is byte-identical to the pre-welcome version; HELLO intro untouched; rollback verified in browser.
- The welcome moment code remains recoverable from git commit 31fa858 (and scripts/verify_welcome.sh) if ever wanted again.

---
Task ID: 5
Agent: Super Z (main agent)
Task: Re-architect the presentation from an autonomous entrance into a SPEECH-DRIVEN introduction: her real voice drives gestures, welcome typography, light and content reveals; correct Urdu name pronunciation "اعناب راشد"; remove the old wave gesture. Design unchanged otherwise.

Work Log:
- AUDIO: rebuilt the voice from 5 separately generated sentence clips (tongtong, 0.97x) so pauses are exact and cue times deterministic: "Assalam-o-Alaikum..." / "Welcome to my portfolio." / "I'm... <name>." / "I'm a Computer Science student..." / "Let me show you a little about my work." concatenated with 0.5-0.75s gaps → public/audio/intro.wav (23.47s) + scripts/audio/cues.json.
- NAME PRONUNCIATION: tested 9 TTS spellings against ASR. Urdu script was skipped by the engine; "Ra-sheed"/"Rasheed" rejected; winner = "Ah-naab Raashid" (vA) — ASR confirms no y-glide, "Rashid" not "Rasheed"; hidden guide only, visible text stays "Ahnab Rashid".
- GESTURES: removed the wave engine (GESTURE_FULL/SHORT, idle 15s repeater, first-hello timer). Generated 3 new speech poses from the SAME photo via image-edit + align + Poisson hand-region composite (scripts/motion/gen_speech_frames.mjs, build_speech_layers.py): gesture-hello (small acknowledging lift), gesture-welcome (low open presenting hand — reused for the "show my work" line; the first show render ghosted and was discarded), gesture-name (= f3 hand-to-heart). Keyboard hand untouched, niqab/face untouched.
- CHOREOGRAPHY (hero.tsx rewrite): audio timeupdate → cue index → advanceStage (monotonic content reveals: eyebrow@salam, welcome block@welcome, name@name, intro+facts@intro, CTAs+socials+chip@show) + gesture per cue (salam→hello, welcome/show→open hand, name→heart, intro→STILLNESS). autoplay: click → play() after 700ms; on rejection or click-less auto-exit a silent fallback timeline reveals content (never pre-empts the voice path); ended → hand returns to rest.
- WELCOME MOMENT (speech-synced): Great Vibes "Welcome" + Cormorant caps + soft champagne light cone + glow + dust motes, fired by the welcome cue, not a timer. Desktop in-flow over the bright wall; mobile absolute top-right over the dark wall (face stays clear — verified welcomeRect [221,86,371,162] vs face at left).
- SPEAKING INDICATOR: tiny "● Speaking" beside "HELLO, I'M" while her voice plays; captions + eq chip kept.
- VERIFY: headless media clock stalls (no audio sink) so natural timeupdate can't be observed; drove handleTimeUpdate via dispatched timeupdate at seeks — gestures gOn: salam=0, name=2, show=1, intro=-1 (stillness), content stages all fire in order; screenshots g_salam/g_name/g_show confirm each pose; real click→play() works (playErr:null after trusted click, proving the real-user flow). ESLint 0 errors, tsc src/ clean, no stale layer references.

Stage Summary:
- The visitor now hears a warm female voice greet them ("Assalam-o-Alaikum… Welcome to my portfolio. I'm Ahnab Rashid…"), her name spoken Urdu-style (اعناب راشد approximated), while SHE gestures in sync, the welcome typography surfaces exactly as she says it, soft light falls from above, and content appears in step with her sentences — stillness between gestures, niqab intact, no wave, no avatar look.
- Key artifacts: public/audio/intro.wav + scripts/audio/*, public/images/gesture-{hello,welcome,name}.png, src/components/hero.tsx (cue engine), src/lib/profile.ts (VOICE_INTRO cues), globals.css (welcome + speaking-ind), layout.tsx (fonts).

---
Task ID: 6
Agent: Super Z (main agent)
Task: Swap the Home/Hero base visual to the NEW uploaded image (semi-illustrated woman in a floral hijab, face visible, typing at her laptop) and make HER personally present the portfolio — gaze at the visitor, natural blinking, lip movement with her speech, head nods, breathing — while keeping the full original composition (no crop/zoom), the approved HELLO intro, and the Task 5 voice choreography intact.

Work Log:
- BASE SWAP: upload/pasted_image_1789963019326.png -> public/images/hero-base.png (md5 09b2657b9d53a0d6196faaaef2614d3c verified identical, file never edited). Same 1448x1086 dimensions as before, so the align/diff/Poisson pipeline carried over.
- KEYFRAMES (scripts/motion/n_gen_frames.mjs, z-ai image-edit): generated blink (eyes closed), gaze (eyes lifted to viewer, closed-mouth smile preserved after one re-render), mouthB (natural mid-speech open mouth). mouthA and both hand-gesture renders were REJECTED (broken mouth artifact; generator refused to lift the typing hand) — per the user's own priority rule the human feel is carried by face+eyes+blink+head+shoulders; her hands stay naturally on the keyboard.
- LAYERS (n_build_layers_v2.py + v3): global align (scale/shift on static wall/desk regions) + NEW second-stage LOCAL face alignment anchored on unchanged face regions (lower face for blink/gaze, eyes for mouth) — fixed ghost brows (v2 bug found: affine row mixup cy=d*ay0+f, corrected to d*ax0+e*ay0+f). Gaze/mouth masks switched from free diff blobs to hand-seeded ellipses (eyes+brows / lips) after slate-gray wall tones smeared into the hijab edge. Final layers: n-blink.png, n-gaze.png, n-mouth.png + n-presenter-idle.png (hand-traced head/torso silhouette excluding laptop, typing forearm, mug, chair, desk).
- HERO REWRITE (src/components/hero.tsx): full-composition contain stage (.hero-stage + .hero-ambient blurred letterbox fill + .hero-frame exactly 1448:1086, right-biased 0.42 of leftover on desktop, full-width strip on top for mobile) — the COMPLETE scene (laptop, mug, notes, plants, chair) always visible, no crop/zoom/cover. Living stack nested inside breathe/sway wrappers: presenter-idle + gaze layer (opacity crossfade 640ms, cue-driven: salam/welcome/name/show -> viewer, intro -> laptop, ended -> back to laptop after 1.8s) + mouth layer (deterministic 32-step MOUTH_PATTERN at 150ms steps driven by audio.currentTime via rAF, gated to speech spans so lips rest in pauses) + blink layer (pure CSS 6.4s rhythm). Small head nods on salam/name/show via alternating animation classes (restart without remount).
- ROBUSTNESS: added a 4s stalled-play watchdog (play() resolved but clock at 0 -> silent fallback reveal instead of an empty page); chip replay restarts from 0 when ended; hydration-safe (no Math.random/Date.now, initial states neutral), reduced-motion disables nod/blink/breathe and speeds gaze/mouth transitions.
- TYPOGRAPHY: desktop text flipped from ink to cream/champagne over the new dark slate wall (hero-text shadows kept at all sizes, speaking-ind + welcome-rule recolored), welcome moment stays champagne script + soft light cone; socials still LinkedIn + Email only; mobile welcome overlay moved to the clean upper-LEFT wall (away from her face and the pinned notes).
- FIXES DURING VERIFY: stale Turbopack CSS cache served an intermediate globals.css (blink/nod/hero-content rules missing -> gaze always visible) — cleared .next and re-verified from scratch; 720p overflow (chip 726>720) fixed by short-screen h1 clamp (84.8px -> 44.6px, chip 622<720).
- VERIFY (scripts/verify_task6.sh + diag + verify_fallback.sh, headless has no media clock so cue engine driven by currentTime seeks + dispatched timeupdate): cue seeks land gaze viewer/laptop/viewer correctly, caption + content stages fire in order, ended returns gaze to her work; frame ratio 1.3333 exact at 1440x900/1280x720/390x844 with full height covered (no crop); blink animation live; 720p + mobile chip fits; fallback reveal completes; zero console/hydration errors; ESLint clean.

Stage Summary:
- The new uploaded image is the untouched base visual shown in its complete original composition; the woman now presents the portfolio herself: she lifts her eyes from her laptop to the visitor as she says "Assalam-o-Alaikum…", holds eye contact through the welcome moment (champagne light + Great Vibes "Welcome"), glances back down at her work while describing her studies, looks up again for "Let me show you…", blinks naturally, breathes, nods on greeting/name/invite, and her lips move in rhythm with her voice — with the hidden Urdu pronunciation of her name unchanged in the audio.
- Key artifacts: public/images/hero-base.png (md5-verified upload), public/images/n-{blink,gaze,mouth,presenter-idle}.png, src/components/hero.tsx, src/app/globals.css, scripts/motion/n_*.py|msj, scripts/verify_task6.sh.
- Dropped intentionally: hand-gesture keyframe layers (renders unusable) — face/head/eyes/blink/posture carry the presentation instead.

---
Task ID: video-playback-1
Agent: main
Task: Fix hero video playback only — play once with sound, stop at end, manual replay, no restarts.

Work Log:
- hero.tsx only (no design/other changes): removed autoPlay + loop attrs; initial playing state false.
- New playback effect keyed on [revealed]: video starts exactly once when the HELLO intro hands over — attempt sound-on play() first; on policy rejection continue muted from the SAME position and unmute on first interaction (pure volume change, no resume/restart); if even muted is refused, first interaction starts it once with sound.
- Removed the old "first click anywhere unmutes+resumes" global handler (could resume/restart on unrelated clicks).
- togglePlay: ended → currentTime=0 then play (manual replay always from start); paused mid → resume from position; else pause.
- toggleSound: sound only — removed el.play() call (unmuting an ended video must never replay it).
- onEnded handler added → button flips to Play; video freezes on final frame (no loop).
- Verified tsc clean + production build OK; prod server port 3000.
- Browser-verified (headless, strict autoplay policy): pre-reveal video paused at t=0 (no half-start behind intro); trusted intro click → autoplay from t=0.x with muted=false/volume=1, button "Sound on"; played once to t=8.00/ended, still ended 3.5s later (no loop/replay); nav click + scroll to 4725px and back → still ended at 8.00; Play button → replay from t≈0 with sound; pause at 2.17 → page click leaves it paused at 2.17; Play resumes from 2.26 (not 0); unmute on ended video → no restart; zero console/page errors. Auto-exit (no gesture) path observed: starts muted at t=0, no restart.

Stage Summary:
- Video behavior final: autoplay once with sound from the beginning at portfolio open; stops at end; manual replay via existing controls; zero restarts on clicks/scroll/section changes/re-renders; design untouched. download/ahnab-portfolio-production.zip updated in place (hero.tsx + worklog entries only).

---
Task ID: features-4cv
Agent: main
Task: Add 4 features only — Interactive CV, Open to Opportunities badge, Quick Contact, Share Portfolio.

Work Log:
- Generated public/Ahnab-Rashid-CV.pdf via reportlab (pdf skill, resume brief, palette.cascade accent #398bb4): 1 page A4, 94% fill, pdf_qa PASS. Content rendered strictly from existing src/lib/profile.ts CV data — zero invented facts. No CV PDF file existed in project/uploads, so the document is a faithful rendering of the site's CV data; swap path = replace public/Ahnab-Rashid-CV.pdf.
- NEW src/lib/clipboard.ts: copyText() with navigator.clipboard + execCommand fallback.
- NEW src/components/cv-modal.tsx: Radix Dialog (focus trap, Escape, a11y roles) styled in site dark glass; toolbar = Download PDF (anchor download) + close; scrollable white CV paper rendered from PROFILE/PROJECTS imports.
- hero.tsx: added quiet action row under CTAs (rv delay 520): Open to Opportunities badge (emerald dot pulse, anchor #contact smooth-scroll), View CV (opens modal), Download CV (direct PDF download). Modal mounted in fragment.
- contact-section.tsx: Quick actions row under contact cards — Email (mailto), LinkedIn (_blank), Copy Email (clipboard + "Email copied ✓" 2.2s, aria-live, green ct-copied state).
- site-footer.tsx: Share Portfolio button before Back to Top — navigator.share({title, text, url: location.href}) with AbortError no-op; fallback copyText + "Link copied ✓" 2.2s; .ft-copied state; Back to Top stays last.
- globals.css: appended ~380 lines additive (hv-status/hv-cv-btn, cv-modal + cv-paper, ct-quick*, ft-topwrap gap + ft-copied, focus-visible rings, 640px tweaks, prefers-reduced-motion). No existing rules modified.
- Verified: tsc clean, production build OK, prod server 3000; browser tests — modal opens/traps focus/Escape closes/reopens, Download PDF href + download attr, badge smooth-scrolls to #contact (top 72px), quick actions hrefs correct (mailto/linkedin _blank), Copy Email → "Email copied ✓" → reverts, Share Portfolio → "Link copied ✓" fallback (navigator.share undefined on desktop headless) → reverts, zero console errors; mobile 390px — modal fits 374x828, quick row wraps, no new horizontal overflow (pre-existing 535px decorative overflow unchanged with features hidden).
- ZIP download/ahnab-portfolio-production.zip updated in place (3 modified + 3 new files + inner worklog; 150 files).

Stage Summary:
- All 4 features live and verified on desktop + mobile; design/content/other sections untouched; single source of truth for CV content remains profile.ts.

---
Task ID: audit-refine-1
Agent: main
Task: Implement portfolio audit refinements — palette tokens, brand icons, 5-color rotation, 3-font system, theme toggle removal, smoother intro->hero, CTA glow, contrast, contact mail note, dead-code cleanup. No redesign, no content/date changes, no new links.

Work Log:
- PALETTE: globals.css :root now defines consolidated tokens (#050816 bg-0, #0A1128 bg-1, #E9EDFF text-hi, #8B93B8 text-mid, #4F8BFF blue, #8B5CF6 violet, #F472B6 pink sparingly, #3FD8FF cyan, #4ADE80 success, glass rgba(255,255,255,0.08)); body/shell/scrollbar/selection migrated from warm cream/rose to navy tokens; viewport themeColor #050816.
- WARM PALETTE REMOVED: --ink/--paper/--cream/--rose/--rose-soft/--dark vars + all usages migrated (body, scrollbar thumb/track #263052, selection rgba(79,139,255,0.32)); hello-rule gradient and social/speaking warm colors deleted with their dead blocks.
- DEAD CODE: ~727 lines removed (6697->5970) — old photo-hero CSS confirmed unused in every tsx: hero-stage/ambient/frame, presenter layers (breathe/sway/nod/blink/gaze/mouth), vignette, settle, old rv stagger, hero-text, voice equalizer, chip-invite, social tooltip, speaking indicator, entire welcome-moment block + mote + hero-content; reduced-motion block trimmed to alive rules (hello-* + animate-bounce).
- BRAND ICONS: NEW src/components/brand-icons.tsx — accurate Simple Icons (CC0) paths inline (zero deps): FastAPI #009688, SQLite, GitHub octocat, n8n #EA4B71, C++ #00599C, VS Code #007ACC (v12), MS Office #D83B01 (v9), Canva #00C4CC; replaced inaccurate customs (C++ text hexagon, VS Code approximation, Office rounded square, Canva letter circle) and generic lucide tints (Zap/Feather/Github/Workflow). Python/Figma kept (already accurate).
- 5-COLOR ROTATION: generic/conceptual icons now use only ROT {blue #4F8BFF, violet #8B5CF6, cyan #3FD8FF, green #4ADE80, pink #F472B6} — soft skills, languages, SQLAlchemy/SQL Database glyphs; sk-t-* floating-card tints normalized to blue/cyan/violet/neutral (no more one-off teal/orange/pink hexes); brand logos keep official colors.
- 3 FONTS: layout.tsx drops Great_Vibes + Cormorant_Garamond (font-editorial was referenced nowhere); .font-script class redefined to Playfair Display italic (keeps skills note, about hand note, contact script lines elegant) — final system: Manrope body, Playfair Display display+italic voice, Geist Mono.
- THEME TOGGLE: non-functional Moon/Sun button (state only flipped the icon) removed from site-header; hd-theme-ic + hd-pop CSS removed; search button untouched.
- INTRO->HERO: hello screen bg #0d0a08 warm -> #050816 navy + blue/violet glow, letters #E9EDFF, subline #8B93B8 — exit now dissolves within one continuous navy world; exit timing 1s->1.1s with gentler curve, letters drift -2.5vh scale 1.04.
- HERO CTAs: primary glow 0.65->0.4 alpha, hover 0.8->0.5 (no more glow competition with video frame); contrast bumps: AI-Python-Backend line slate-400/75->300/75, scroll hint slate-400->300, capability card text slate-400->300/85.
- CONTACT: added .ct-mail-note under Send ("This opens your own email app with the message prefilled — nothing is stored on this site."); footer muted text variants (#8fa0c4/#93a5c9/#7e8db0/#7e8cad) consolidated to --text-mid #8B93B8.
- HOUSEKEEPING: site-header search effect setState moved into timeout (fixes pre-existing react-hooks/set-state-in-effect lint error).
- UNCHANGED BY DESIGN: Experience/Education dates, all content/skills (profile.ts untouched), section structure, glassmorphism, animations, custom project glyphs, CV PDF, no new social links (footer GitHub remains a static non-link placeholder).
- VERIFY: tsc clean, ESLint clean on all touched files, production build OK, server 3000; browser (1440x900): intro->hero seamless navy dissolve, header = search+burger only (no toggle), skills brand icons render (FastAPI/SQLite/GitHub/n8n/C++/VSCode/Office/Canva verified in screenshots), floating-card tints in rotation, contact form note visible after flip, CV modal opens with unchanged dates, footer/share intact; anchors: 0 broken; externals: only real mailto/linkedin/maps; mobile 390x844: hero + skills clean, no NEW horizontal overflow (pre-existing 535px decorative pj-carousel overflow unchanged); zero console errors.

Stage Summary:
- Audit implemented as a refinement, not a redesign: identity, layout, glass cards, animations, content and dates untouched; scattered colors consolidated to the shared token palette, real brand logos in place, 5-color icon rotation, 3-font system, theme toggle and ~727 lines of dead CSS removed, smoother intro handoff, calmer CTA glow, better contrast, honest email-app note. ZIP updated in place.

---
Task ID: github-link-1
Agent: main
Task: Add user's real GitHub profile link (https://github.com/Ahnab-Qureshii) — user-provided, replaces the intentional placeholder.

Work Log:
- src/lib/profile.ts: PROFILE.github added; SOCIAL_LINKS github href filled (was "" placeholder by design, awaiting real URL).
- src/components/site-footer.tsx: static non-clickable GitHub icon span -> real anchor (target=_blank, rel=noopener noreferrer, aria-label, title); comment updated.
- src/components/cv-modal.tsx: contact line now email · linkedin · github.com/Ahnab-Qureshii · location (GITHUB_SHORT derived from PROFILE).
- public/Ahnab-Rashid-CV.pdf intentionally NOT regenerated (user's CV document; offered as follow-up).
- Verified: URL resolves HTTP 200; tsc clean; ESLint clean; build OK; server 3000; live checks — footer GitHub anchor present with _blank, CV modal contact line shows github.com/Ahnab-Qureshii; zero console errors.
- ZIP updated in place with the 3 changed files + this log.

Stage Summary:
- Real GitHub profile (github.com/Ahnab-Qureshii) live in footer socials + CV preview; source of truth updated; no other changes.

---
Task ID: fonts-3sys
Agent: main
Task: Typography-only refinement — lock the 3-font system (Playfair Display / Manrope / Geist Mono), preserve HELLO intro identity, no color/icon/layout/content/animation changes.

Work Log:
- AUDIT: layout.tsx loads exactly 3 Google faces (Playfair Display normal+italic, Manrope, Geist Mono); no @font-face/local fonts/geist package anywhere; no Great_Vibes/Cormorant remnants in src.
- FIX: @theme phantom token `--font-sans: var(--font-geist-sans)` (Geist Sans never loaded — shadcn template leftover, a latent 4th-font leak) -> `--font-sans: var(--font-body)` + comment. Tailwind font-sans utility now resolves to Manrope (verified at runtime via temp element).
- All font-family decls in CSS verified to reference only --font-body / --font-display / --font-geist-mono (+ system fallbacks); .font-script = Playfair italic (by design); usage classes .font-display/.font-script/.font-mono-num mapped across sections (hero, hello, about, skills, projects, experience, focus, contact).
- Incident found during verify: stale next-server from prior session survived pkill -> served old HTML referencing removed CSS hash (HTTP 500) -> page fell back to Times New Roman. Killed PID on :3000, fresh `bun run start`, re-verified. NOT a code regression.
- VERIFY: tsc clean; production build OK; built CSS contains exactly 3 @font-face families (Manrope, Playfair Display, Geist Mono + next/font fallbacks). Runtime (1440x900): fontsLoaded=[Playfair Display, Manrope, Geist Mono]; body=Manrope; .pj-title/.sk-title=Playfair Display; .sk-note=Playfair italic; .ee-num=Geist Mono; .hello-word=Playfair Display (screenshot: cinematic HELLO unchanged); font-sans->Manrope. Mobile 390x844: HELLO intro + hero fonts correct, 3 fonts only; 535px decorative carousel overflow pre-existing, unchanged; zero console errors.
- ZIP updated in place (globals.css + inner worklog only).

Stage Summary:
- Typography system locked to 3 fonts with a complete token chain (sans->Manrope, mono->Geist Mono, display/script->Playfair Display); HELLO intro identity preserved; zero visual or content changes elsewhere. ZIP in sync.

---
Task ID: unify-1
Agent: main
Task: Whole-portfolio art direction pass — ONE visual language (dark navy + blue light + white typography) per user's detailed brief. No rebuild, no content/identity/data changes, all functionality preserved.

Work Log:
- PALETTE: :root tokens set to user's exact values (#070B16 bg, #0D1428 surface, #3F7DFF primary, #6EA0FF highlight, #F5F7FF text, #9AA7C2 muted; cyan #3FD8FF as supporting technical shade; green kept ONLY for functional feedback). Violet/pink removed from every decorative role; accent NAMES in projects-data.ts kept and mapped to blue shades in CSS (.pj-a-*).
- HERO: "Let's Connect" removed; primary row = View My Work + View CV, secondary = Open to Opportunities + Download CV; identity line "AI • Python • Technology"; motes 12→6; violet ambient/blob/chip/dot → blue-cyan; CTA gradient #3F7DFF→#6EA0FF.
- ABOUT: leaves/books/desk/hand-note/phone/card-edge fully removed (TSX+CSS); Quick Facts card + tiles recolored to blue family; section now a premium digital identity card; ALL paragraphs/facts intact.
- FOCUS: purple+pink glows deleted; 2 orbits → 1 calm ring; pillars/tints calmed; Brain/Gear icon gradients → blue; blocks got a controlled hover response (border+glow, no transform conflict).
- PROJECTS: purple nebula + ring-b + waterline-c removed; stars/horizon/water dimmed (~50% noise cut); glyph gradients (Cap/Terminal/People) → blue; per-card accents → blue family; FEATURED kicker on active card + stronger side-card dimming = featured-vs-supporting hierarchy; viewbtn/thumb/status(partial)/webwin/allcard/switchbtn recolored.
- SKILLS: 5-color icon rotation → 3-shade blue family (blue/cyan/hi); panels unified (sk-p-blue/cyan/hi); 2 orbits → 1; script note → clean mono uppercase label; brand logos untouched.
- JOURNEY: ACCENTS → blue pairs; spine/end-cap → blue; NEW scroll-progress fill (.ee-progress, scaleY via --ee-progress, rAF scroll handler) + .ee-row-live active milestone highlight (node+card+num glow); dates/content untouched.
- CONTACT: flip-card FRONT pastel/cream/pink → same navy glass as back; botanical doodle removed; robot doodles kept (blue, AI theme); pink script note → quiet muted line; GitHub added to quick actions (real PROFILE.github); eyebrow/label/tap in mono voice.
- NAVBAR/FOOTER: logo gradients → #3F7DFF→#6EA0FF; footer pillars "Computer Science • AI • Python"; rule/dot/buttons blue.
- TYPE SYSTEM: eyebrows across ALL sections normalized to Geist Mono 11.5px / 0.28em / #6EA0FF (one label voice); float animations slowed (6→8s) + amplitude 7→5px; 3-font system unchanged.
- MOBILE FIX: html/body overflow-x clip — horizontal pan eliminated (scrollWidth reported 535 was decorative mountain-SVG overflow; canPan now false).
- VERIFY: tsc clean; ESLint clean; build OK; server 3000. Browser 1440x900: HELLO intro unchanged (Playfair on #070B16); hero hierarchy correct; zero decorations missing content; featured kicker follows active card; carousel step + detail panel + visuals + back OK; CV modal + download + github line OK; journey progress 0.38 + live row; flip card front/back navy; copy email "Email copied ✓" + share "Link copied ✓" via trusted clicks; search opens; fonts = exactly 3; mobile 390x844: all sections clean, no pan possible; zero console errors. Data files (profile.ts, projects-data.ts, api, prisma) byte-unchanged (git diff empty).
- ZIP updated in place with 12 changed files + this log.

Stage Summary:
- The portfolio now reads as ONE art-directed product: one palette (navy+blue+white), one card language, one label voice, one motion feel; featured project hierarchy, scroll-driven timeline, calmer decoration everywhere; identity/content/functionality 100% preserved.

---
Task ID: certificates-1
Agent: main
Task: Add ONE unified "Certificates" section (internship + webinar certificates together — no tabs, no filters, no separate subsections) with premium cards, click-to-open fullscreen viewer, nav entry. Existing design/content/identity untouched. Use the user's EXACT uploaded certificate images.

Work Log:
- NEW src/lib/certificates-data.ts: typed Certificate records (id, type INTERNSHIP|WEBINAR as identification label only, title/org/date ONLY as printed on the certificate, src, real width/height, alt). Ships with a documented template; placeholders/AI-generated certificates are never used (authenticity rule).
- NEW src/components/certificates-section.tsx: ONE grid for ALL certificates (3 cols ≥1100px / 2 ≥720px / 1 mobile); cards = image preview (object-contain, original aspect preserved, never cropped) + type chip + title + org + date + "View Certificate"; framer-motion rise() stagger identical to other sections; viewer = Radix Dialog (same accessible foundation as the CV modal): focus trap, ESC, outside-click close, background scroll lock, fade+scale(0.96→1) open ~300ms, smooth fade out, image at quality 92, object-contain, never stretched/cropped; aria labels, visible focus rings, prefers-reduced-motion guards.
- src/app/globals.css: appended ~470-line cert- block (prefix collision-free) reusing the site language: navy section gradients, mono eyebrow, Playfair title with blue gradient word, glass cards with gradient-border hover (translateY -6px + brighter border + soft blue glow), image zoom 1.03, zoom chip, viewer chrome matching cv-modal.
- NAV: profile.ts NAV_LINKS + site-header NAV_ICONS (Award) + SEARCH_INDEX + portfolio-shell render order …Journey → Certificates → Contact; header/footer hide the Certificates link automatically whenever the data array is empty (never a dead link).
- AUTHENTICITY INCIDENT: the 3 certificate image files the user attached did NOT arrive on the server (upload bridge only holds 2026-09-21 files; searched filesystem, tmpfs/ossfs stacked mounts, poll ~30 min). Per the user's own rule no replacement/generated certificates were made; QA ran with a clearly-marked neutral gray placeholder (md5 tracked, deleted after tests, never zipped). Data file ships EMPTY + template; section + nav auto-appear when real files are dropped into public/images/certificates/ and one entry is added.
- VERIFY (with 3 QA placeholder cards): tsc clean, ESLint clean, build OK; agent-browser 1440x900 — grid 3 cols, scroll-spy lights Certificates, real mouse click opens viewer, REAL outside click closes, ESC closes (also mobile), Tab order preview→View Certificate, Enter opens, focus visible, body scroll locked while open, image ratio preserved exactly (1.415 = source), search index contains Certificates; 820x1180 — 2 cols, docW=820 (no overflow); 390x844 — 1 col, docW=390, modal 374x776 fits, ESC closes; regression — video present, CV modal opens+closes, section order home→about→focus→projects→skills→experience→(certificates)→contact, footer links fine, zero console errors at every size.
- VERIFY (shipping empty state): section hidden, nav/footer 7 links (no dead Certificates link), nav clicks scroll, zero console errors. lint clean.

Stage Summary:
- Feature complete and verified in both states; when the real certificate images arrive (re-attach), activation = drop files in public/images/certificates/ + fill one object per certificate in src/lib/certificates-data.ts (title/org/date copied from what is printed on each paper). Nothing else changes.
- Changed files: 2 new (certificates-section.tsx, certificates-data.ts) + 6 edited (globals.css, profile.ts, site-header.tsx, site-footer.tsx, portfolio-shell.tsx, sections.tsx) + this log.

---
Task ID: certificates-2
Agent: main
Task: Activate certificates with the 3 user re-attached images (WhatsApp 2026-09-25). BLOCKED: images never arrived on any upload mount (checked all 3 mirrors + 35 min polling + snapshot manifests). No image = no data entry (authenticity rule). Feature stays verified-dormant; ZIP (170 files) unchanged and current. Next session: files in public/images/certificates/ + one object each in certificates-data.ts → build → QA → zip.

## 2026-09-28 — restore-1 (Super Z)
- ENVIRONMENT ROLLBACK RECOVERY. At session start the whole workspace (work/, download/, worklogs, node_modules, .next) had been reverted to a Sep-26 ~07:22 snapshot — losing the ATS CV, hero-clean-1, cert-dc-1 (DepthCarousel) and perf-opt-1. The pre-rollback mirror /tmp/my-project/work/main-portfolio-extract preserved: real certificate JPGs, assets-source archives (20 files). Yesterday's src changes were re-applied exactly from session records; byte-deterministic assets were regenerated and verified byte-identical.
- Restored from mirror (md5-verified): 3 real certificate JPGs, assets-source/ (16 dead presenter PNGs + hero-wall-blur.jpg, 3 original JPGs, original hero video).
- Re-applied from records: hero.tsx (removed Open-to-Opportunities badge .hv-status, AI Agent chip .hv-float, BrainCircuit import; kept exactly View My Work / View CV / Download CV + Python chip); certificates-data.ts (3 real entries, WebP paths, unchanged text/alt/dimensions); certificates-section.tsx (DepthCarousel rewrite: circular offset front=0 sides ±1, translateX 54%/level, translateZ -170px/level, rotateY 14deg/level, scale -0.17/level, opacity -0.42/level, blur 1.4px/level, perspective 1300; drag 48px threshold + 0.35 live follow + movedRef click suppression + touch-action pan-y; horizontal-wheel-only with 700ms lock; arrows/dots/01-03 counter/keyboard ArrowLeft-Right/side-click-to-front/front-click-to-viewer; aria-live position announcements; autoplay OFF; Radix viewer unchanged, unoptimized original bytes); globals.css (.cert-grid/.cert-card/.cert-preview/.cert-body/.cert-img -> .cert-dc/.cert-dc-stage/.cert-dc-track(data-snap)/.cert-dc-card/.cert-dc-face/.cert-dc-img/.cert-dc-info/.cert-dc-controls/.cert-dc-nav/.cert-dc-arrow/.cert-dc-dots/.cert-dc-dot/.cert-dc-count; 640px --certdc-w min(72vw,252px) + counter hidden; reduced-motion updated).
- Regenerated (byte-identical to yesterday): certificate WebPs q92 method 6 (81812/135220/62932B, SSIM 0.9951/0.9974/0.9973); hero video x264 CRF 23 slow faststart (649744B, SSIM 0.991691, 8.000s, streams identical). ATS CV regenerated via pdf skill resume brief (FreeSerif, single page, searchable, pdf_qa PASS, all 18 content checks pass, 2869 chars); pre-ATS CV archived in assets-source/cv/. Dead assets re-moved out of served public/ (19MB -> 2.1MB) after md5-verifying archives identical.
- QA desktop 1440x900 (agent-browser, trusted input): hero 3 buttons exact; video sound-on autoplay -> advancing -> ended t=8 hard stop -> no loop -> replay t=0.78 -> mute/unmute uninterrupted; nav 9 links all targets exist; search "python" -> SJARVIS/Python results; CV modal opens (Ahnab content) + ESC closes + Download href=/Ahnab-Rashid-CV.pdf download attr; certificates 3 cards/1 front, all webp, lazy x3, front no-filter, side blur(1.4px)+matrix transform, arrow 01->02, info panel syncs, dot3->03, drag 03->01 wrap, ArrowRight->02, prev->01, wheel dx120->02, viewer opens certificate-2.webp + ESC closes; contact Copy Email -> "Email copied ✓" state + auto-reset (verified via clipboard stub; real browsers use native writeText), Email/LinkedIn/Location/GitHub/Flip-form/Send present; footer Share Portfolio (navigator.share + copy fallback) + all links; ZERO console/page errors. Tablet 768x1024: no h-scroll (768=768), all sections, carousel+viewer OK. Mobile 390x844: muted autoplay -> trusted tap unlocks sound with no restart -> single play -> no loop; hamburger menu opens, 8 links, nav-to-certificates works; swipe left/right 01<->02/03 wrap; side-tap-to-front; front-tap opens viewer webp; docW=390=scrollW.
- Screenshots: scripts/fqa/r-d-{hero,about,projects,skills,journey,certs,contact}.png, r-m-{hero,certs,contact}.png — visually identical to the finalized design (navy/blue glass, official skill logos, DepthCarousel depth deck).
- Delivered: /home/z/my-project/download/ahnab-portfolio-production.zip (162 files, 18.9MB, unprefixed=0, integrity OK, workspace==ZIP 162/162 identical md5).

## 2026-09-28 — font-1 (Super Z)
- FONT CHANGE ONLY. 3-font system (Playfair Display · Manrope · Geist Mono) -> ONE family: Inter (variable 100–900 + true italics), loaded in layout.tsx as --font-inter. Role classes (.font-display/.font-mono-num/.font-script) kept as hierarchy hooks, all resolving to Inter; @theme inline --font-sans/--font-mono both -> var(--font-inter) so Tailwind utilities cannot leak a second family; all 29 globals.css font-family decls unified to var(--font-inter) with sans fallback stack (all Georgia/serif/mono fallbacks removed); contact-section.tsx inline SVG text updated. Size/weight/tracking/color hierarchy untouched; logos/icons (pure SVG paths) untouched.
- VERIFY: tsc clean, build OK (had to kill stale PID 2893 next-server serving the deleted standalone dir). Built CSS: only Inter @font-faces, 30 var refs, 0 old vars. Desktop 1440x900: HELLO intro, hero H1 70.4px w600, nav, about title 73.6px, cert counter 12.5px — all Inter; video sound autoplay/hard-stop t=8/replay; carousel 3 webp + arrows/dots/viewer/ESC; CV modal + download; Copy Email ✓; flip-card "Let's Talk!" Inter italic; search SJARVIS; share; docW=1440; only 4 Inter woff2 on the wire. Mobile 390x844: muted autoplay -> hard stop; replay + first-tap unmute without restart + tap=pause per design; hamburger 8 links; carousel counter hidden; viewer; Copy Email via stub; docW=390. Errors: only the 4 pre-existing synthetic setPointerCapture entries (no accumulation under trusted input).
- Delivered: download/ahnab-portfolio-production.zip (184 entries, integrity OK, workspace==ZIP md5-identical).

## 2026-09-28 — review-1 (Super Z)
- 20-POINT REVIEW (no rebuild). Content: SIBRS spelling verified from actual certificate images and applied everywhere (was "Sibrisi"); SJARVIS 69 endpoints/13 routers/16 tables/118 tests; Phase 1 authentication integrated with Classroom Management (SJARVIS + Classroom entries); positioning = CS student exploring AI/AI Agents/AI Chatbots/automation/Python (no developer wording, no internship-seeking).
- Focus: AI Agents/AI Chatbots/AI/Automation cluster (Web Dev block removed, Python supporting), uniform subtle-filled icon chips, pillars removed, glows softened, Main-focus chips highlighted. Hero: AI-first capability cards + exact user wording + strip label; motes 6→3. Skills: AI & Interests panel first (sk-p-ai), Technical/Tools/Soft/Languages after; SQLAlchemy stays SJARVIS-only.
- Engineering: ignoreBuildErrors removed (TS runs in build; caught a real error during rebuild); 55 unused packages + 43 shadcn ui files + prisma + db.ts + "Hello, world!" api + tailwind.config + use-mobile removed after import verification; package.json → ahnab-portfolio 1.0.0. SEO: metadataBase/canonical/OG/Twitter + Person JSON-LD + sitemap + robots(with sitemap) + generated 1200×630 og-image.png; site URL via NEXT_PUBLIC_SITE_URL.
- Intro: Skip Intro button + sessionStorage skip (returning visitors go straight in, no scroll lock) + voice audio wired to enter gesture only (never blocks); intro.wav 1.1MB → intro.mp3 282KB (original in assets-source/audio/). Video preload=metadata. Dead CSS purged (hv-status family, hv-float, ct-botanical, ft-static, pj-platformring-b). Empty Instagram/Facebook links removed.
- QA: desktop 1440×900 + mobile 390×844 all sections/functionality pass, docW==viewport, console clean, tsc+eslint+build clean. Delivered ZIP 133 entries (workspace==ZIP md5-identical).

## 2026-09-28 — voice-1 (Super Z)
- Removed the separate spoken intro voice per user request. hello-intro.tsx no longer plays any audio on enter (VOICE_INTRO import/audioRef/playback block removed; beginExit/onComplete simplified — entered flag + autoVoice chain were voice-only and are gone from shell/hero); VOICE_INTRO export removed from profile.ts. Deleted public/audio/intro.mp3, assets-source/audio/intro.wav (source recording) and scripts/audio/ (TTS generation tooling).
- Hero video + its natural background audio untouched by design: public/videos/ahnab-hero.mp4 md5 df518c71fb09ee55bfaf3129ed6642b2 before==after. HELLO intro visuals, Skip Intro, sessionStorage skip, hero sound unlock/toggle/replay all unchanged and re-verified.
- tsc + build clean; fresh isolated browser QA (session vq2): intro -> Enter -> video plays (own audio path), no audio network requests at all, console clean, returning visitor skips intro. ZIP re-delivered (113 entries, workspace==ZIP md5-identical).

## 2026-09-28 — seo-2 (Super Z)
- SEO polish only (no redesign): SITE_DESCRIPTION tightened 182→156 chars (full line visible in Google, incl. Python); OG/Twitter descriptions unified to SITE_DESCRIPTION; robots.googleBot directives (max-image-preview:large etc.); Person JSON-LD + image field + schema-correct plain email. Heading audit confirmed correct H1→H2→H3 (1/7/19; motion.h2 was missed by naive grep); carousel alt="" confirmed correct (button aria-labels carry names; viewer image has full alt); static prerender confirmed crawlable (all section content in SSR HTML).
- Runtime verification scripts/seo-2-verify.sh: 0 failures (title, description, canonical, 6 og + 4 twitter tags, robots+googleBot, robots.txt→sitemap, sitemap.xml, 8 JSON-LD checks, headings, alts, SSR content, og-image 200). Build + tsc clean. ZIP re-delivered (113 entries, workspace==ZIP identical).

## 2026-09-28 — audio-1 (Super Z)
- Removed the continuous "aaaa" drone from the hero video's own audio track via steady-state spectral subtraction (time-p90 estimate, α=3.5 in 60-3200Hz, β=0.05, coherent OLA, peak-normalized to 0.48). Drone band uniformly -19.6dB across all 8s; typing clicks + room tone preserved; sub-bass rumble kept; video stream bit-identical (stream-md5 verified); duration/frames unchanged. public/videos/ahnab-hero.mp4 replaced (md5 55bf6220d1c9adebce1f5785e2de5d55, 715,500B). Build + browser QA clean (video plays unmuted, 8.00s, zero errors). ZIP re-delivered.

## 2026-09-28 — ui-1 (Super Z)
- Certificate cards enlarged: --certdc-w clamp(248px,26vw,330px)→clamp(280px,30vw,384px); mobile min(72vw,252px)→min(74vw,280px); image sizes attr synced. Design/DepthCarousel/controls/viewer untouched; verified centered ±2px @1440 and @390.
- Skills: "C++ (basics)" removed from SKILL_GROUPS Technical + FOCUS_GROUPS supporting tools; CppLogo + its floating stage card removed; VS Code card added in that stage slot (sk-pos-vscode/sk-t-vscode, same coords/tint family) keeping the 8-card composition; Python remains first Technical pill + first stage card. CppLogo deleted from brand-icons.tsx. Project C++ tech (OS Command Toolkit) untouched.
- Skills timing: rise() 0.7s→0.55s, amount 0.25→0.15; panel delays 0.12-0.44→0.04-0.2; card riseDelays 0.4-1.1→0-0.35; stagebox 0.9→0.6; note 0.3→0.12. Measured full entrance 1279ms (was ~2000ms+).
- Content: Journey BS CS "2021 – present"→"2024 – Present" (was the lone wrong year); cv-modal + profile TIMELINE aligned "2024 – Present"; Phase-1 status now exactly "Phase 1 is integrated with Classroom Management." (3 spots in projects-data.ts); SJARVIS 69/13/16/118 verified everywhere.
- CV PDF regenerated (scripts/generate_cv_pdf.py, pdf_qa PASS, 1 page): 66→69 endpoints, Sibrisi→SIBRS ×2, skills line without C++, education "2024 – Present". C++ kept only in OS project facts. 12/12 text checks pass.
- Build: tsc clean, next build OK. QA 32/32 PASS (desktop 1440×900 + mobile 390×844): video md5/bytes unchanged (55bf6220…, 715500B), docW 1440/390, console clean, no C++ anywhere in skills/focus/CV-skills, cert widths + centering, journey date, SJARVIS detail figures + Phase 1 wording, CV modal fields. Screenshots scripts/fqa/ui-1-*.png.
