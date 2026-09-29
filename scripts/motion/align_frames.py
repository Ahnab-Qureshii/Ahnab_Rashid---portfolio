#!/usr/bin/env python3
"""
Align AI-generated gesture frames to the original hero photograph.

The AI re-renders the whole scene at 1152x864 with a small global
scale/translation drift. We estimate an affine (uniform scale + shift)
that makes the STATIC parts (wall, window, desk) line up with the
original 1448x1086 photo, warp the frame accordingly, and report the
residual difference map so polygons for regional compositing can be
designed from evidence instead of guesswork.
"""
import numpy as np
from PIL import Image, ImageChops

ORIG = "public/images/hero-base.png"
RAWS = ["f1_raw", "f2_raw", "f3_raw"]
OUT_SIZE = (1448, 1086)

# static reference regions (x0,y0,x1,y1) far from the woman / laptop:
# left window light, right wall, bottom-left desk, top-right wall
STATIC = [
    (60, 80, 560, 620),
    (1180, 60, 1420, 700),
    (80, 940, 700, 1070),
]


def load_orig():
    return Image.open(ORIG).convert("RGB")


def warp(img, scale, dx, dy):
    """Scale around the image centre then translate (dx, dy)."""
    w, h = img.size
    img = img.transform(
        (w, h), Image.AFFINE,
        (1 / scale, 0, -(scale - 1) * w / (2 * scale) - dx / scale,
         0, 1 / scale, -(scale - 1) * h / (2 * scale) - dy / scale),
        resample=Image.BICUBIC,
    )
    return img


def static_score(a_np, b_np):
    tot = 0.0
    for x0, y0, x1, y1 in STATIC:
        d = np.abs(
            a_np[y0:y1, x0:x1].astype(np.int16)
            - b_np[y0:y1, x0:x1].astype(np.int16)
        )
        tot += d.mean()
    return tot / len(STATIC)


DS = 4  # downsample factor for the coarse search


def down(img):
    w, h = img.size
    return img.resize((w // DS, h // DS), Image.BILINEAR)


def align(frame_img, orig_img):
    """Coarse search at 1/4 resolution, then refine at full resolution."""
    f_small, o_small = down(frame_img), down(orig_img)
    o_small_np = np.asarray(o_small)
    static_small = [(x0 // DS, y0 // DS, x1 // DS, y1 // DS) for x0, y0, x1, y1 in STATIC]

    def score_small(a_np):
        tot = 0.0
        for x0, y0, x1, y1 in static_small:
            tot += np.abs(
                a_np[y0:y1, x0:x1].astype(np.int16)
                - o_small_np[y0:y1, x0:x1].astype(np.int16)
            ).mean()
        return tot / len(static_small)

    best = (1.0, 0.0, 0.0, 1e9)
    for scale in [0.97, 0.975, 0.98, 0.985, 0.99, 0.995, 1.0, 1.005, 1.01, 1.015, 1.02, 1.025, 1.03]:
        for dx in range(-40, 41, 4):
            for dy in range(-40, 41, 4):
                s = score_small(np.asarray(warp(f_small, scale, dx * DS, dy * DS)))
                if s < best[3]:
                    best = (scale, float(dx * DS), float(dy * DS), s)
    s0, dx0, dy0, _ = best

    # refine at full resolution
    orig_np = np.asarray(orig_img)
    best_full = (s0, dx0, dy0, 1e9)
    for scale in np.arange(s0 - 0.004, s0 + 0.0041, 0.002):
        for dx in np.arange(dx0 - 6, dx0 + 6.1, 2):
            for dy in np.arange(dy0 - 6, dy0 + 6.1, 2):
                w_np = np.asarray(warp(frame_img, float(scale), float(dx), float(dy)))
                s = static_score(w_np, orig_np)
                if s < best_full[3]:
                    best_full = (float(scale), float(dx), float(dy), s)
    scale, dx, dy, s = best_full
    warped = warp(frame_img, scale, dx, dy)
    return scale, dx, dy, warped, s


def main():
    orig = load_orig()
    orig_np = np.asarray(orig)
    for name in RAWS:
        raw = Image.open(f"scripts/motion/{name}.png").convert("RGB")
        up = raw.resize(OUT_SIZE, Image.LANCZOS)
        scale, dx, dy, warped, score = align(up, orig)
        print(f"{name}: scale={scale:.4f} dx={dx:.1f} dy={dy:.1f} staticErr={score:.2f}")

        # baseline error of the untouched original vs itself = 0;
        # compare against unwarped upscale to show improvement
        base_err = static_score(np.asarray(up), orig_np)
        print(f"   before alignment: {base_err:.2f}  after: {score:.2f}")

        warped.save(f"scripts/motion/{name}_aligned.png")

        # difference heatmap (where does the aligned frame actually change?)
        diff = np.abs(
            np.asarray(warped).astype(np.int16) - orig_np.astype(np.int16)
        ).max(axis=2).astype(np.uint8)
        Image.fromarray(diff).save(f"scripts/motion/{name}_diff.png")
        # block summary 8x12
        H, W = diff.shape
        bh, bw = H // 8, W // 12
        rows = []
        for gy in range(8):
            row = ""
            for gx in range(12):
                blk = diff[gy*bh:(gy+1)*bh, gx*bw:(gx+1)*bw]
                row += " X" if (blk > 14).mean() > 0.12 else (" x" if (blk > 14).mean() > 0.04 else " .")
            rows.append(row)
        print("\n".join(rows))


if __name__ == "__main__":
    main()
