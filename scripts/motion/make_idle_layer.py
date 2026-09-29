#!/usr/bin/env python3
"""
Build presenter-idle.png — a full-frame 1448x1086 RGBA copy of the clean
hero photo where alpha is 1 inside the woman's upper body (inset + feathered)
and 0 outside. The browser animates THIS layer only (breathing / micro-sway)
while the base photograph underneath stays perfectly still.

Boundaries deliberately EXCLUDE: the laptop (lid right edge is followed),
the keyboard + resting hand, the desk sleeve, the mug (path cuts over its
rim) and the chair. Only her head/hijab/torso/shoulders breathe.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ORIG = "public/images/hero-base.png"
OUT = "public/images/presenter-idle.png"
PREVIEW = "scripts/motion/idle_mask_preview.png"

# Closed outer silhouette, clockwise, traced on the 1448x1086 photo.
OUTER = [
    # head top, left -> right
    (797, 196), (832, 192), (864, 206), (890, 230), (910, 264), (924, 302),
    # right hijab edge, down
    (934, 340), (946, 390), (968, 430), (1000, 468), (1040, 505),
    (1078, 540), (1104, 580), (1122, 625), (1132, 668), (1136, 706),
    # arm behind the mug top
    (1146, 728),
    # cut west over the mug rim (mug excluded)
    (1108, 736), (1072, 742), (1054, 748),
    # chest-bottom cut, just above the keyboard deck / desk sleeve
    (1050, 758), (1000, 760), (940, 762), (880, 764), (820, 766),
    (760, 764), (700, 760), (676, 758),
    # up the laptop lid right edge (laptop excluded)
    (670, 724), (662, 688), (652, 656), (640, 634),
    # up the abaya left edge against the wall
    (628, 612), (640, 588), (664, 552), (682, 528), (700, 500),
    # left hijab edge, up to the head
    (680, 470), (665, 430), (672, 392), (686, 338), (700, 298),
    (720, 264), (746, 228), (772, 204),
]

INSET = 12  # px shrink so the feathered edge stays inside her body


def inset_polygon(pts, inset):
    """Shrink a closed polygon toward its centroid by `inset` px using
    per-vertex edge-normal nudging."""
    c = np.mean(pts, axis=0)
    out = []
    n = len(pts)
    for i in range(n):
        p = np.array(pts[i], float)
        prev = np.array(pts[(i - 1) % n], float)
        nxt = np.array(pts[(i + 1) % n], float)
        for d in (p - prev, nxt - p):
            l = np.hypot(*d)
            if l == 0:
                continue
            nrm = np.array([d[1], -d[0]]) / l  # left normal (clockwise poly)
            mid = p + d / 2
            toward_in = (mid - c) @ nrm > 0  # normal pointing at centroid side
            p = p - nrm * inset if toward_in else p + nrm * inset
        out.append(tuple(p))
    return out


def main():
    img = Image.open(ORIG).convert("RGB")
    W, H = img.size

    poly = inset_polygon(OUTER, INSET)

    mask = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(mask)
    d.polygon(poly, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(6))
    mask_np = np.asarray(mask)

    rgba = np.dstack([np.asarray(img), mask_np])
    Image.fromarray(rgba).save(OUT)

    base = np.asarray(img).astype(np.float32)
    a = (mask_np.astype(np.float32) / 255.0)[..., None]
    prev = (base * a + base * 0.35 * (1 - a)).astype(np.uint8)
    edge = (mask_np > 40) & (mask_np < 220)
    prev[edge] = [255, 0, 0]
    Image.fromarray(prev).resize((1086, 815), Image.LANCZOS).save(PREVIEW)
    print("saved", OUT, "coverage", round((mask_np > 127).mean() * 100, 2), "%")


if __name__ == "__main__":
    main()
