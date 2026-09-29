#!/usr/bin/env python3
"""
Task 6 v3 — gaze & mouth layers with SEEDED ELLIPSE masks.

v2's free-form diff masks caught hijab-edge shading differences and
Poisson pulled slate-gray wall tones into the fabric (smudges). The eye
and lip regions are anatomically predictable, so v3 unions hand-placed
ellipses (eyes+brows for gaze, lips for mouth) instead of trusting the
diff blob finder. Blink keeps its (already clean) diff mask.
"""
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter

import align_frames
from align_frames import align, load_orig, OUT_SIZE, warp
from composite_hands import poisson_clone
from n_build_layers_v2 import local_align, build_mask

align_frames.STATIC = [
    (40, 80, 520, 560),
    (560, 40, 960, 170),
    (60, 920, 560, 1050),
    (1250, 900, 1430, 1040),
]

# raw -> (anchor box, diff box, output name, ellipses or None)
FRAMES = {
    "n_blink_raw":  ((720, 445, 925, 565), (705, 345, 910, 450), "n-blink", None),
    "n_gaze_raw":   ((720, 445, 925, 565), (700, 335, 915, 460), "n-gaze",
                     [(770, 396, 42, 40), (846, 383, 44, 40)]),
    "n_mouthB_raw": ((705, 340, 910, 445), (725, 435, 905, 540), "n-mouth",
                     [(810, 483, 58, 34)]),
}

FEATHER_SIGMA = 3.2


def ellipse_mask(shape, ellipses, box):
    """Union of filled ellipses (cx, cy, rx, ry), feathered, clipped to box."""
    x0, y0, x1, y1 = box
    m = Image.new("L", (shape[1], shape[0]), 0)
    d = ImageDraw.Draw(m)
    for cx, cy, rx, ry in ellipses:
        d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(1.2))
    m_np = np.asarray(m).copy()
    clip = np.zeros(shape, np.uint8)
    clip[y0:y1, x0:x1] = 255
    m_np = np.minimum(m_np, clip)
    return cv2.GaussianBlur(m_np, (0, 0), FEATHER_SIGMA)


def main():
    orig = load_orig()
    orig_np = np.asarray(orig)
    orig_bgr = cv2.cvtColor(orig_np, cv2.COLOR_RGB2BGR)

    for raw_name, (anchor, box, out_name, ellipses) in FRAMES.items():
        raw = Image.open(f"scripts/motion/{raw_name}.png").convert("RGB")
        up = raw.resize(OUT_SIZE, Image.LANCZOS)
        gscale, gdx, gdy, gwarped, gscore = align(up, orig)
        lscale, ldx, ldy, ls, warped = local_align(gwarped, orig, anchor)
        print(f"{raw_name}: global err={gscore:.2f}  local(scale={lscale:.4f} "
              f"dx={ldx:.0f} dy={ldy:.0f} anchorMedian={ls:.2f})")

        frame_np = np.asarray(warped)
        frame_bgr = cv2.cvtColor(frame_np, cv2.COLOR_RGB2BGR)

        if ellipses:
            mask = ellipse_mask(orig_np.shape[:2], ellipses, box)
        else:
            diff = np.abs(frame_np.astype(np.int16) - orig_np.astype(np.int16)).max(axis=2)
            mask = build_mask(diff.astype(np.uint8), box)
        cov = (mask > 127).mean() * 100
        print(f"  mask coverage {cov:.2f}%")

        cloned = poisson_clone(orig_bgr, frame_bgr, (mask > 127).astype(np.uint8) * 255)
        alpha = mask.astype(np.float32) / 255.0
        out = np.dstack([cloned[:, :, ::-1], (alpha * 255).astype(np.uint8)])
        Image.fromarray(out).save(f"public/images/{out_name}.png")

        base = orig_np.copy().astype(np.float32)
        a3 = alpha[..., None]
        comp = (out[:, :, :3].astype(np.float32) * a3 + base * (1 - a3)).astype(np.uint8)
        Image.fromarray(comp).save(f"scripts/motion/{out_name}-comp.png")

        x0, y0, x1, y1 = box
        pad = 70
        zx0, zy0 = max(0, x0 - pad), max(0, y0 - pad)
        zx1, zy1 = min(1448, x1 + pad), min(1086, y1 + pad)
        z = 2 if (zx1 - zx0) < 400 else 1
        side = Image.new("RGB", ((zx1 - zx0) * 2 * z + 8, (zy1 - zy0) * z), (15, 15, 15))
        side.paste(orig.crop((zx0, zy0, zx1, zy1)).resize(((zx1 - zx0) * z, (zy1 - zy0) * z), Image.LANCZOS), (0, 0))
        side.paste(Image.fromarray(comp).crop((zx0, zy0, zx1, zy1)).resize(((zx1 - zx0) * z, (zy1 - zy0) * z), Image.LANCZOS), ((zx1 - zx0) * z + 8, 0))
        side.save(f"scripts/motion/{out_name}-zoom.png")
        print(f"  -> public/images/{out_name}.png + zoom preview")


if __name__ == "__main__":
    main()
