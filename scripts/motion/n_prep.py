#!/usr/bin/env python3
"""
Prepare the NEW hero image (Task 6):
1. Copy the untouched upload into public/images/hero-base.png (md5 verified).
2. Emit zoomed grid crops (face / hands / silhouette) so the extraction
   boxes and the idle-cutout polygon can be designed from evidence.
"""
import hashlib
import shutil

import numpy as np
from PIL import Image, ImageDraw

SRC = "upload/pasted_image_1789963019326.png"
DST = "public/images/hero-base.png"

md5 = hashlib.md5(open(SRC, "rb").read()).hexdigest()
shutil.copyfile(SRC, DST)
md5_after = hashlib.md5(open(DST, "rb").read()).hexdigest()
print(f"copied {SRC} -> {DST}\nmd5 src={md5}\nmd5 dst={md5_after} match={md5 == md5_after}")

img = Image.open(DST).convert("RGB")
W, H = img.size
print("size:", img.size)


def grid_crop(box, out, zoom=2, step=50):
    x0, y0, x1, y1 = box
    c = img.crop(box).resize(((x1 - x0) * zoom, (y1 - y0) * zoom), Image.LANCZOS)
    d = ImageDraw.Draw(c)
    for gx in range(x0 - x0 % step, x1 + 1, step):
        px = (gx - x0) * zoom
        d.line([(px, 0), (px, c.size[1])], fill=(255, 80, 80) if gx % 100 == 0 else (120, 60, 60), width=2 if gx % 100 == 0 else 1)
        d.text((px + 2, 2), str(gx), fill=(255, 200, 120))
    for gy in range(y0 - y0 % step, y1 + 1, step):
        py = (gy - y0) * zoom
        d.line([(0, py), (c.size[0], py)], fill=(255, 80, 80) if gy % 100 == 0 else (120, 60, 60), width=2 if gy % 100 == 0 else 1)
        d.text((2, py + 2), str(gy), fill=(255, 200, 120))
    c.save(out)
    print("saved", out, c.size)


# face region (estimate from preview: face approx x 700-900, y 250-500)
grid_crop((660, 220, 960, 520), "scripts/motion/n_grid_face.png", zoom=2, step=25)
# hands / keyboard region
grid_crop((600, 700, 1010, 910), "scripts/motion/n_grid_hands.png", zoom=2, step=25)
# full-image coarse grid for the silhouette trace
grid_crop((0, 0, W, H), "scripts/motion/n_grid_full.png", zoom=1, step=100)

# wall color samples for the ambient backdrop sanity check
a = np.asarray(img)
for name, (x, y) in {
    "wall_left": (300, 300),
    "wall_top": (600, 100),
    "desk_left": (300, 1000),
    "wall_right_low": (950, 620),
}.items():
    print(name, a[y, x])
