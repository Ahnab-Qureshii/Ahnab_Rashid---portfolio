#!/usr/bin/env python3
"""
Build the SPEECH gesture layers: align each AI re-render to the original
photo, extract ONLY the changed left-hand region, Poisson-blend it into
the original photograph, and emit full-frame RGBA layers for the browser.

Outputs: public/images/gesture-{hello,welcome,show}.png
"""
import numpy as np
import cv2
from PIL import Image

from align_frames import align, load_orig, OUT_SIZE
from composite_hands import build_mask, poisson_clone

# frame -> (search box for the changed region, output name)
FRAMES = {
    "g1_raw": ((660, 440, 1110, 850), "gesture-hello"),
    "g2_raw": ((660, 440, 1110, 850), "gesture-welcome"),
    "g4_raw": ((560, 440, 1110, 850), "gesture-show"),
}


def main():
    orig = load_orig()
    orig_np = np.asarray(orig)
    orig_bgr = cv2.cvtColor(orig_np, cv2.COLOR_RGB2BGR)

    for raw_name, (box, out_name) in FRAMES.items():
        raw = Image.open(f"scripts/motion/{raw_name}.png").convert("RGB")
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

        cloned = poisson_clone(orig_bgr, frame_bgr, (mask > 127).astype(np.uint8) * 255)
        alpha = mask.astype(np.float32) / 255.0
        out = np.dstack([cloned[:, :, ::-1], (alpha * 255).astype(np.uint8)])
        Image.fromarray(out, "RGBA").save(f"public/images/{out_name}.png")

        # preview composite + mask edge check
        base = orig_np.copy().astype(np.float32)
        a3 = alpha[..., None]
        comp = (out[:, :, :3].astype(np.float32) * a3 + base * (1 - a3)).astype(np.uint8)
        Image.fromarray(comp).save(f"scripts/motion/{out_name}-comp.png")
        print(f"  -> public/images/{out_name}.png")


if __name__ == "__main__":
    main()
