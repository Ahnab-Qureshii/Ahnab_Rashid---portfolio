#!/usr/bin/env python3
"""Review sheets for the 6 new raw keyframes (full frame + face zoom)."""
from PIL import Image, ImageDraw

ORIG = "public/images/hero-base.png"
RAWS = [
    "n_blink_raw", "n_gaze_raw", "n_mouthA_raw",
    "n_mouthB_raw", "n_greet_raw", "n_present_raw",
]
FACE = (640, 200, 1000, 560)   # face + drape zoom box
HAND = (560, 700, 1060, 920)   # keyboard hand zoom box

orig = Image.open(ORIG).convert("RGB")

# ---- full-frame contact sheet (2 cols x 3 rows, orig first) ----
tw, th = 480, 360
sheet = Image.new("RGB", (tw * 2, th * 4), (20, 20, 20))
d = ImageDraw.Draw(sheet)
OUT = (1448, 1086)
tiles = [("ORIG", orig)] + [
    (n, Image.open(f"scripts/motion/{n}.png").convert("RGB").resize(OUT, Image.LANCZOS))
    for n in RAWS
]
for i, (name, im) in enumerate(tiles):
    t = im.resize((tw, th), Image.LANCZOS)
    x, y = (i % 2) * tw, (i // 2) * th
    sheet.paste(t, (x, y))
    d.rectangle([x, y, x + 130, y + 22], fill=(0, 0, 0))
    d.text((x + 6, y + 5), name, fill=(255, 220, 130))
sheet.save("scripts/motion/n_sheet_full.png")
print("sheet:", sheet.size)

# ---- face zoom strips: orig on top, then each raw ----
zw, zh = 720, 720  # face box is 360x360 -> 2x zoom
fstrip = Image.new("RGB", (zw * 2, zh * 2), (20, 20, 20))
d2 = ImageDraw.Draw(fstrip)
for i, (name, im) in enumerate([t for t in tiles if t[0] in ("ORIG", "n_blink_raw", "n_gaze_raw", "n_mouthA_raw")]):
    c = im.crop(FACE).resize((zw, zh), Image.LANCZOS)
    x, y = (i % 2) * zw, (i // 2) * zh
    fstrip.paste(c, (x, y))
    d2.rectangle([x, y, x + 150, y + 24], fill=(0, 0, 0))
    d2.text((x + 6, y + 6), name, fill=(255, 220, 130))
fstrip.save("scripts/motion/n_sheet_face1.png")

fstrip2 = Image.new("RGB", (zw * 2, zh * 2), (20, 20, 20))
d3 = ImageDraw.Draw(fstrip2)
for i, (name, im) in enumerate([t for t in tiles if t[0] in ("n_mouthB_raw", "n_greet_raw", "n_present_raw")]):
    c = im.crop(FACE).resize((zw, zh), Image.LANCZOS)
    x, y = (i % 2) * zw, (i // 2) * zh
    fstrip2.paste(c, (x, y))
    d3.rectangle([x, y, x + 150, y + 24], fill=(0, 0, 0))
    d3.text((x + 6, y + 6), name, fill=(255, 220, 130))
fstrip2.save("scripts/motion/n_sheet_face2.png")

# ---- hand zoom strip: orig vs greet vs present ----
hw, hh = 830, 364  # hand box 500x220 -> ~1.66x
hstrip = Image.new("RGB", (hw, hh * 3 + 8), (20, 20, 20))
for i, (name, im) in enumerate([t for t in tiles if t[0] in ("ORIG", "n_greet_raw", "n_present_raw")]):
    c = im.crop(HAND).resize((hw, hh), Image.LANCZOS)
    hstrip.paste(c, (0, i * (hh + 4)))
hstrip.save("scripts/motion/n_sheet_hands.png")
print("done")
