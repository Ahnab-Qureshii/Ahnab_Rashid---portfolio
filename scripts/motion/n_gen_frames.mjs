/**
 * Task 6 — generate LIVING-PORTRAIT keyframes from the NEW hero image
 * (semi-illustrated woman, floral hijab, face visible, typing at laptop).
 *
 * Face (new capability with this image):
 *   n_blink_raw   — eyes gently closed (the blink frame)
 *   n_gaze_raw    — she lifts her gaze to look at the visitor
 *   n_mouthA_raw  — lips softly parted (beginning to speak)
 *   n_mouthB_raw  — mouth open mid-speech (talking)
 * Hands (same proven technique as Task 2/5):
 *   n_greet_raw   — right hand small acknowledging lift off the keyboard
 *   n_present_raw — right hand low open presenting gesture
 *
 * Everything else in each render must stay identical; the build step
 * (n_build_layers.py) extracts ONLY the changed region into RGBA layers.
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";

const SRC = "public/images/hero-base.png";

const BASE =
  "Semi-realistic anime-style digital illustration of a young woman wearing a soft pink floral hijab and a black abaya with gold floral embroidery, sitting at a dark desk typing on an open silver laptop, a dark slate-blue wall behind her with four pinned notes about AI (a robot icon with 'AI Agents', 'Chatbots & Conversational AI', 'Build Smart Agents', a brain icon with 'AI Automation'), a black mug with 'Better Code Bigger Dreams' written on it, green hanging plants on a dark shelf to the right, soft warm cinematic lighting, clean line art, elegant modest illustration.";

const KEEP =
  " Keep absolutely everything else exactly identical: same anime illustration style, same line art and shading, her face proportions, eyebrows, nose, soft closed-mouth smile, pink floral hijab pattern, black abaya with gold embroidery, her left arm, the keyboard and typing position, the silver laptop with its apple logo, the black mug and its text, the four pinned wall notes, the plants, the desk, the chair, the lighting, colors, framing and composition must all stay exactly the same. Same semi-realistic anime illustration style, not photorealistic, no text changes anywhere.";

const JOBS = [
  {
    out: "scripts/motion/n_blink_raw.png",
    prompt:
      BASE +
      " ONLY change: her eyes are gently closed — two soft, relaxed closed eyelids with fine lashes, the natural look of a calm mid-blink moment. Her eyebrows, head position, hijab and expression stay exactly the same." +
      KEEP,
  },
  {
    out: "scripts/motion/n_gaze_raw.png",
    prompt:
      BASE +
      " ONLY change: her eyes and eyebrows — she lifts her gaze from the laptop and looks straight ahead at the viewer with a calm, warm, friendly expression. Her mouth keeps the EXACT same soft closed-mouth smile with her lips touching, no teeth, no bigger smile. The framing, zoom level, camera distance, crop and her head size and position must remain EXACTLY identical to the input image — do not zoom in, do not enlarge her face, do not move the camera." +
      KEEP,
  },
  {
    out: "scripts/motion/n_mouthA_raw.png",
    prompt:
      BASE +
      " ONLY change: her mouth — the lips part by a tiny amount, leaving a small gap between the upper and lower lip as if she is softly beginning to say a word. Absolutely NO teeth visible, NO smile change, the mouth stays small and relaxed. Her eyes, gaze direction, eyebrows and expression stay exactly the same (eyes looking down at the laptop). The framing, zoom level and her head size must remain EXACTLY identical — do not zoom in." +
      KEEP,
  },
  {
    out: "scripts/motion/n_mouthB_raw.png",
    prompt:
      BASE +
      " ONLY change: her mouth is open mid-speech — jaw slightly dropped, lips naturally parted in the middle of saying a word, a natural relaxed talking mouth, NOT exaggerated, no wide smile, no prominent teeth. Everything else identical." +
      KEEP,
  },
  {
    out: "scripts/motion/n_greet_raw.png",
    prompt:
      BASE +
      " ONLY change: her right hand — the hand resting on the laptop keyboard — is lifted a few centimeters above the keyboard in a small graceful acknowledging greeting motion, forearm slightly raised, fingers relaxed and gently curved, palm angled inward, the subtle one-hand greeting of a modest person, nothing exaggerated. The keyboard, the laptop and her left arm stay exactly where they are." +
      KEEP,
  },
  {
    out: "scripts/motion/n_present_raw.png",
    prompt:
      BASE +
      " ONLY change: her right hand — the hand resting on the laptop keyboard — is raised a few centimeters above the keyboard, open and relaxed in a low welcoming presenting gesture, palm angled gently upward, fingers together and soft, as if warmly presenting her work on the screen. The keyboard, the laptop and her left arm stay exactly where they are." +
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
