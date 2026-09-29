#!/usr/bin/env python3
"""
Task 6 — build the living-portrait layers from the NEW hero image.

For each raw AI re-render:
  1. resize 1152x864 -> 1448x1086
  2. align to the base photo (coarse-to-fine scale/shift on static regions)
  3. diff inside a hand-chosen box, keep all meaningful blobs
  4. Poisson-blend the region into the base photo
  5. emit a full-frame RGBA layer for the browser + preview composites

Outputs: public/images/n-{blink,gaze,mouth}.png
The base photo itself is NEVER modified.
"""
import numpy as np
import cv2
from PIL import Image

import align_frames
from align_frames import align, load_orig, OUT_SIZE
from composite_hands import poisson_clone

# static reference regions for THIS image (wall / desk, far from her,
# the laptop, the notes, the plants and the mug)
align_frames.STATIC = [
    (40, 80, 520, 560),      # left wall
    (560, 40, 960, 170),     # top wall between head and notes
    (60, 920, 560, 1050),    # front desk, bottom-left
    (1250, 900, 1430, 1040), # desk, bottom-right of the mug
]

# raw -> (diff search box, output name)
FRAMES = {
    "n_blink_raw":  ((700, 335, 915, 455), "n-blink"),
    "n_gaze_raw":   ((695, 330, 920, 460), "n-gaze"),
    "n_mouthB_raw": ((725, 435, 905, 535), "n-mouth"),
    "n_greet_raw":  ((590, 730, 1030, 910), "n-greet"),
}

DIFF_T = 14
CLOSE_K = 11
MIN_BLOB = 140        # keep every blob at least this area (eyes are 2 blobs)
DILATE_K = 9
FEATHER_SIGMA = 4.0


def keep_blobs(mask, min_area):
    """Keep all connected blobs >= min_area (both eyes, brows, hand+keys)."""
    n, labels, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
    out = np.zeros_like(mask)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] >= min_area:
            out[labels == i] = 255
    return out


def build_mask(diff, box):
    x0, y0, x1, y1 = box
    m = np.zeros(diff.shape, np.uint8)
    region = (diff[y0:y1, x0:x1] > DIFF_T).astype(np.uint8) * 255
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (CLOSE_K, CLOSE_K))
    region = cv2.morphologyEx(region, cv2.MORPH_CLOSE, k)
    region = keep_blobs(region, MIN_BLOB)
    region = cv2.dilate(region, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (DILATE_K, DILATE_K)))
    m[y0:y1, x0:x1] = region
    return cv2.GaussianBlur(m, (0, 0), FEATHER_SIGMA)


def main():
    orig = load_orig()
    orig_np = np.asarray(orig)
    orig_bgr = cv2.cvtColor(orig_np, cv2.COLOR_RGB2BGR)

    for raw_name, (box, out_name) in FRAMES.items():
        try:
            raw = Image.open(f"scripts/motion/{raw_name}.png").convert("RGB")
        except FileNotFoundError:
            print(f"skip {raw_name} (missing)")
            continue
        up = raw.resize(OUT_SIZE, Image.LANCZOS)
        scale, dx, dy, warped, score = align(up, orig)
        warped.save(f"scripts/motion/{raw_name}_aligned.png")
        print(f"{raw_name}: scale={scale:.4f} dx={dx:.1f} dy={dy:.1f} staticErr={score:.2f}")

        frame_np = np.asarray(warped)
        frame_bgr = cv2.cvtColor(frame_np, cv2.COLOR_RGB2BGR)

        diff = np.abs(frame_np.astype(np.int16) - orig_np.astype(np.int16)).max(axis=2)
        mask = build_mask(diff.astype(np.uint8), box)
        cov = (mask > 127).mean() * 100
        print(f"  mask coverage {cov:.2f}%")

        if cov < 0.02:
            print(f"  !! {raw_name}: change region almost empty — render likely identical, SKIPPED")
            continue

        cloned = poisson_clone(orig_bgr, frame_bgr, (mask > 127).astype(np.uint8) * 255)
        alpha = mask.astype(np.float32) / 255.0
        out = np.dstack([cloned[:, :, ::-1], (alpha * 255).astype(np.uint8)])
        Image.fromarray(out, "RGBA").save(f"public/images/{out_name}.png")

        # preview composite + zoom of the changed region
        base = orig_np.copy().astype(np.float32)
        a3 = alpha[..., None]
        comp = (out[:, :, :3].astype(np.float32) * a3 + base * (1 - a3)).astype(np.uint8)
        Image.fromarray(comp).save(f"scripts/motion/{out_name}-comp.png")
        x0, y0, x1, y1 = box
        pad = 60
        zx0, zy0 = max(0, x0 - pad), max(0, y0 - pad)
        zx1, zy1 = min(1448, x1 + pad), min(1086, y1 + pad)
        side = Image.new("RGB", ((zx1 - zx0) * 2 + 8, zy1 - zy0), (15, 15, 15))
        side.paste(orig.crop((zx0, zy0, zx1, zy1)), (0, 0))
        side.paste(Image.fromarray(comp).crop((zx0, zy0, zx1, zy1)), (zx1 - zx0 + 8, 0))
        side.save(f"scripts/motion/{out_name}-zoom.png")
        print(f"  -> public/images/{out_name}.png + zoom preview")


if __name__ == "__main__":
    main()
