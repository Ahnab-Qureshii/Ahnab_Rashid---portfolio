#!/usr/bin/env python3
"""
Task 6 v2 — living-portrait layers with LOCAL face alignment.

v1 showed ghost brows: the AI renders drift a few px non-uniformly, so a
global affine lines up the wall/desk but not the facial features.

Fix: after the global align, estimate a SECOND, local scale/shift from an
ANCHOR region of the face that the render did NOT change
  blink/gaze -> lower face (nose, lips, chin)   (mouth kept identical)
  mouth      -> upper face (brows, eyes)        (gaze kept identical)
warp the whole render by that local affine, THEN diff-extract the changed
region. Features line up, Poisson blending has no ghosts to hide.
"""
import numpy as np
import cv2
from PIL import Image

import align_frames
from align_frames import align, load_orig, OUT_SIZE, warp
from composite_hands import poisson_clone

align_frames.STATIC = [
    (40, 80, 520, 560),
    (560, 40, 960, 170),
    (60, 920, 560, 1050),
    (1250, 900, 1430, 1040),
]

# raw -> (anchor box, diff box, output name)
FRAMES = {
    "n_blink_raw":  ((720, 445, 925, 565), (705, 345, 910, 450), "n-blink"),
    "n_gaze_raw":   ((720, 445, 925, 565), (700, 340, 915, 450), "n-gaze"),
    "n_mouthB_raw": ((705, 340, 910, 445), (725, 435, 905, 535), "n-mouth"),
}

DIFF_T = 17
CLOSE_K = 9
MIN_BLOB = 120
DILATE_K = 7
FEATHER_SIGMA = 3.2


def local_align(frame_img, orig_img, anchor):
    """Refine scale/dx/dy so the ANCHOR region matches the original.

    Fast: each candidate warps ONLY the anchor ROI via cv2 (the PIL affine
    'output->input' convention becomes cv2.WARP_INVERSE_MAP), coarse then
    fine. Returns the PIL-warp params for the best candidate.
    """
    ax0, ay0, ax1, ay1 = anchor
    o_crop = np.asarray(orig_img)[ay0:ay1, ax0:ax1].astype(np.int16)
    f_np = np.asarray(frame_img)
    W, H = frame_img.size

    def pil_coeffs(scale, dx, dy):
        return (1 / scale, 0, -(scale - 1) * W / (2 * scale) - dx / scale,
                0, 1 / scale, -(scale - 1) * H / (2 * scale) - dy / scale)

    def crop_err(scale, dx, dy):
        a, b, c, d, e, f = pil_coeffs(scale, dx, dy)
        # output full-image pixel (ax0+i, ay0+j) samples input at
        # (a*(ax0+i)+c, d*(ay0+j)+f) -> crop-local M with WARP_INVERSE_MAP
        cx = a * ax0 + b * ay0 + c
        cy = d * ax0 + e * ay0 + f
        M = np.float32([[a, b, cx], [d, e, cy]])
        w = cv2.warpAffine(f_np, M, (ax1 - ax0, ay1 - ay0),
                           flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP)
        return float(np.median(np.abs(w.astype(np.int16) - o_crop)))

    best = (1.0, 0.0, 0.0, 1e18)
    # coarse
    for scale in np.arange(0.98, 1.0201, 0.004):
        for dx in np.arange(-8, 8.1, 2):
            for dy in np.arange(-8, 8.1, 2):
                s = crop_err(float(scale), float(dx), float(dy))
                if s < best[3]:
                    best = (float(scale), float(dx), float(dy), s)
    s0, dx0, dy0, _ = best
    # fine
    for scale in np.arange(s0 - 0.003, s0 + 0.0031, 0.001):
        for dx in np.arange(dx0 - 2, dx0 + 2.1, 1):
            for dy in np.arange(dy0 - 2, dy0 + 2.1, 1):
                s = crop_err(float(scale), float(dx), float(dy))
                if s < best[3]:
                    best = (float(scale), float(dx), float(dy), s)
    scale, dx, dy, s = best
    warped = warp(frame_img, scale, dx, dy)
    return scale, dx, dy, s, warped


def keep_blobs(mask, min_area):
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

    for raw_name, (anchor, box, out_name) in FRAMES.items():
        raw = Image.open(f"scripts/motion/{raw_name}.png").convert("RGB")
        up = raw.resize(OUT_SIZE, Image.LANCZOS)
        gscale, gdx, gdy, gwarped, gscore = align(up, orig)
        lscale, ldx, ldy, ls, warped = local_align(gwarped, orig, anchor)
        print(f"{raw_name}: global(scale={gscale:.4f} dx={gdx:.0f} dy={gdy:.0f} err={gscore:.2f}) "
              f"local(scale={lscale:.4f} dx={ldx:.0f} dy={ldy:.0f} anchorMedian={ls:.2f})")
        warped.save(f"scripts/motion/{raw_name}_aligned2.png")

        frame_np = np.asarray(warped)
        frame_bgr = cv2.cvtColor(frame_np, cv2.COLOR_RGB2BGR)

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
