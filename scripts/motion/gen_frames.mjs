/**
 * Generate greeting-gesture keyframes from the EXACT clean hero photo.
 * The source image is sent as a base64 data URL; results are raw AI
 * re-renders that will later be regionally composited so only the
 * hand/arm region ever differs from the original photograph.
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";

const SRC = "public/images/hero-base.png";

const BASE =
  "Photorealistic photo of a young woman wearing a black niqab (face veil) and a white floral pink hijab, sitting at a dark wooden desk with an open silver laptop, a black mug, sticky notes pinned on a dark blue wall behind her, warm window light from the left.";

const KEEP =
  " Keep absolutely everything else exactly identical: her face, eyes, niqab, floral hijab pattern, black abaya with gold embroidery, left arm resting on the desk, the silver laptop, black mug, desk surface, wall, sticky notes, lighting, colors and composition must stay the same. Photorealistic, natural skin, elegant, modest, no text anywhere.";

const JOBS = [
  {
    out: "scripts/motion/f1_raw.png",
    prompt:
      BASE +
      " ONLY change: her right hand — the hand that rests on the laptop keyboard — is lifted a few centimeters above the keyboard, hovering, fingers relaxed and gently curved, beginning a small greeting gesture." +
      KEEP,
  },
  {
    out: "scripts/motion/f2_raw.png",
    prompt:
      BASE +
      " ONLY change: her right hand is raised in front of her chest in a small, modest greeting wave — hand lifted to chest height, palm facing slightly outward to her right, fingers together and relaxed, wrist straight, elbow resting near the desk." +
      KEEP,
  },
  {
    out: "scripts/motion/f3_raw.png",
    prompt:
      BASE +
      " ONLY change: her right hand is raised in front of her chest in a small, modest greeting wave — hand lifted to chest height, palm facing slightly outward to her left, fingers together and relaxed, wrist straight, elbow resting near the desk." +
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
