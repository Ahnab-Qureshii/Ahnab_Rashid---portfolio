/**
 * Generate SPEECH gesture keyframes from the EXACT clean hero photo.
 * These are not waves: they are the small hand movements a modest woman
 * makes while talking — a brief acknowledging lift, a low welcoming
 * open hand, a soft presenting motion toward her work.
 * Only her LEFT hand (resting on the desk) changes; the keyboard hand
 * stays exactly where it is.
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";

const SRC = "public/images/hero-base.png";

const BASE =
  "Photorealistic photo of a young woman wearing a black niqab (face veil) and a white floral pink hijab, sitting at a dark wooden desk with an open silver laptop, a black mug, sticky notes pinned on a dark blue wall behind her, warm window light from the left.";

const KEEP =
  " Keep absolutely everything else exactly identical: her face, eyes, niqab, floral hijab pattern, black abaya with gold embroidery, the hand resting on the laptop keyboard, the silver laptop, black mug, desk surface, wall, sticky notes, lighting, colors and composition must stay the same. Photorealistic, natural skin, elegant, modest, no text anywhere.";

const JOBS = [
  {
    out: "scripts/motion/g1_raw.png",
    prompt:
      BASE +
      " ONLY change: her left hand — the hand resting on the desk — is lifted a few centimeters above the desk in a small, brief acknowledging motion, forearm slightly raised, fingers relaxed and gently curled inward, palm angled toward herself, the small natural gesture a person makes while saying hello, nothing exaggerated." +
      KEEP,
  },
  {
    out: "scripts/motion/g2_raw.png",
    prompt:
      BASE +
      " ONLY change: her left hand is held open and relaxed a few centimeters above the desk in a low welcoming presenting gesture, palm angled gently upward, fingers together and soft, elbow resting near the desk edge, as if warmly welcoming someone into her space." +
      KEEP,
  },
  {
    out: "scripts/motion/g4_raw.png",
    prompt:
      BASE +
      " ONLY change: her left hand is extended softly above the desk toward the laptop, palm angled gently upward, fingers relaxed and slightly open, a small subtle presenting gesture toward her work on the desk." +
      KEEP,
  },
];

const only = process.argv[2] ?? "";

async function main() {
  const zai = await ZAI.create();
  const b64 = fs.readFileSync(SRC).toString("base64");
  const dataUrl = `data:image/png;base64,${b64}`;

  for (const job of JOBS) {
    if (only && !job.out.includes(only)) continue;
    if (fs.existsSync(job.out)) {
      console.log("skip (exists):", job.out);
      continue;
    }
    process.stdout.write("generating " + job.out + " ... ");
    const res = await zai.images.generations.edit({
      prompt: job.prompt,
      images: [{ url: dataUrl }],
      size: "1152x864",
    });
    const out64 = res?.data?.[0]?.base64;
    if (!out64) throw new Error("no image returned for " + job.out);
    fs.writeFileSync(job.out, Buffer.from(out64, "base64"));
    console.log("ok");
  }
}

main().catch((e) => {
  console.error(e?.message ?? e);
  process.exit(1);
});
