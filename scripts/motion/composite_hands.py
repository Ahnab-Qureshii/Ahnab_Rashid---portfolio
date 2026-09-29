#!/usr/bin/env python3
"""
Extract ONLY the changed body part (the raised greeting hand + cuff) from
each AI-aligned gesture frame and blend it seamlessly into the ORIGINAL
photograph using Poisson (gradient-domain) blending.

Output: full-frame 1448x1086 RGBA PNGs whose alpha is zero everywhere
except the hand region -> these become the browser gesture layers.
Everything outside the mask is the untouched original photograph.
"""
import numpy as np
import cv2
from PIL import Image
from scipy import ndimage

ORIG = "public/images/hero-base.png"
OUT_SIZE = (1448, 1086)

# per-frame bounding boxes that contain the changed hand/arm region
BOXES = {
    "f1_raw_aligned": (390, 270, 700, 655),
    "f2_raw_aligned": (720, 495, 1045, 800),
    "f3_raw_aligned": (700, 495, 1045, 800),
}

DIFF_T = 16          # pixel-difference threshold
CLOSE_K = 13         # morphological closing kernel (fill the hand interior)
DILATE_K = 11        # grow to include soft shadow around the hand
FEATHER_SIGMA = 5.0  # gaussian feather of the alpha edge


def largest_component(mask):
    """Keep the biggest connected blob (the hand), drop stray drift."""
    n, labels, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
    if n <= 1:
        return mask
    biggest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    return (labels == biggest).astype(np.uint8) * 255


def build_mask(diff, box):
    x0, y0, x1, y1 = box
    m = np.zeros(diff.shape, np.uint8)
    region = (diff[y0:y1, x0:x1] > DIFF_T).astype(np.uint8) * 255
    # close gaps (fingers), then keep only the main blob
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (CLOSE_K, CLOSE_K))
    region = cv2.morphologyEx(region, cv2.MORPH_CLOSE, k)
    region = largest_component(region)
    # fill interior holes (thumb/finger loops)
    region = ndimage.binary_fill_holes(region > 0).astype(np.uint8) * 255
    # grow to include the soft shadow, then feather
    k2 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (DILATE_K, DILATE_K))
    region = cv2.dilate(region, k2)
    m[y0:y1, x0:x1] = region
    m = cv2.GaussianBlur(m, (0, 0), FEATHER_SIGMA)
    return m


def poisson_clone(orig_bgr, frame_bgr, mask_u8):
    """Blend frame gradients into the original inside the mask."""
    cx = int(round(np.mean(np.nonzero(mask_u8.max(axis=0) > 0)[0])))
    cy = int(round(np.mean(np.nonzero(mask_u8.max(axis=1) > 0)[0])))
    m3 = cv2.merge([mask_u8, mask_u8, mask_u8])
    out = cv2.seamlessClone(frame_bgr, orig_bgr, m3, (cx, cy), cv2.NORMAL_CLONE)
    return out


def main():
    orig = Image.open(ORIG).convert("RGB")
    orig_np = np.asarray(orig)
    orig_bgr = cv2.cvtColor(orig_np, cv2.COLOR_RGB2BGR)

    for name, box in BOXES.items():
        frame = Image.open(f"scripts/motion/{name}.png").convert("RGB")
        frame_np = np.asarray(frame)
        frame_bgr = cv2.cvtColor(frame_np, cv2.COLOR_RGB2BGR)

        diff = np.abs(frame_np.astype(np.int16) - orig_np.astype(np.int16)).max(axis=2)
        mask = build_mask(diff.astype(np.uint8), box)

        cloned = poisson_clone(orig_bgr, frame_bgr, (mask > 127).astype(np.uint8) * 255)

        alpha = mask.astype(np.float32) / 255.0
        # soft-limit: keep alpha mostly binary in the core, feathered at edge
        out = np.dstack([cloned[:, :, ::-1], (alpha * 255).astype(np.uint8)])
        Image.fromarray(out, "RGBA").save(f"public/images/{name.split('_')[0]}-layer.png")

        # previews
        base = orig_np.copy().astype(np.float32)
        a3 = alpha[..., None]
        comp = (out[:, :, :3].astype(np.float32) * a3 + base * (1 - a3)).astype(np.uint8)
        Image.fromarray(comp).save(f"scripts/motion/{name.split('_')[0]}-comp.png")

        # mask overlay preview
        ov = orig_np.copy()
        edge = (mask > 40) & (mask < 220)
        ov[edge] = [255, 0, 0]
        Image.fromarray(ov).save(f"scripts/motion/{name.split('_')[0]}-maskedge.png")

        cov = (mask > 127).mean() * 100
        print(f"{name}: mask coverage {cov:.2f}% -> public/images/{name.split('_')[0]}-layer.png")


if __name__ == "__main__":
    main()
