#!/usr/bin/env python3
"""
Task 6 — n-presenter-idle.png for the NEW hero image.

Full-frame 1448x1086 RGBA copy of the clean photo where alpha is 1 inside
the woman's head/hijab/torso silhouette (inset + feathered) and 0 outside.
The browser animates ONLY this layer (breathing / micro-sway / nod) while
the base photograph underneath stays perfectly still.

Boundaries deliberately EXCLUDE: the laptop (edge followed up the lid's
right side), the typing forearm + keyboard hand, the mug (cut passes just
above its rim), the chair and the desk.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ORIG = "public/images/hero-base.png"
OUT = "public/images/n-presenter-idle.png"
PREVIEW = "scripts/motion/n_idle_mask_preview.png"

# Closed outer silhouette, clockwise, traced on the 1448x1086 photo.
OUTER = [
    # head top, left -> right
    (772, 208), (806, 204), (838, 214), (862, 236), (884, 268),
    # right hijab edge, down
    (902, 306), (918, 348), (936, 388), (956, 424), (978, 458),
    (1002, 490), (1026, 518), (1050, 546), (1070, 576), (1086, 608),
    # right drape / upper arm, down toward the mug
    (1100, 640), (1110, 672), (1118, 706), (1126, 738), (1136, 768),
    # cut west just above the mug rim (mug excluded)
    (1100, 774), (1064, 776), (1036, 778),
    # chest-bottom cut, right of the laptop, above the desk
    (996, 780), (948, 782), (916, 780),
    # above the typing forearm / keyboard hand
    (880, 775), (840, 770), (800, 768), (760, 766), (724, 764),
    # up the laptop lid right edge (laptop excluded)
    (712, 750), (706, 715), (700, 678), (696, 645), (694, 622),
    # across the shoulder-tip corner against the wall
    (688, 604), (676, 590), (662, 580), (652, 574),
    # shoulder top line back toward the neck
    (660, 558), (674, 542), (692, 528), (704, 518),
    # left hijab edge, up to the head
    (706, 500), (700, 460), (698, 420), (702, 380), (710, 340),
    (722, 300), (738, 262), (752, 232),
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
            toward_in = (mid - c) @ nrm > 0
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
    Image.fromarray(prev).save(PREVIEW)
    print("saved", OUT, "coverage", round((mask_np > 127).mean() * 100, 2), "%")


if __name__ == "__main__":
    main()
