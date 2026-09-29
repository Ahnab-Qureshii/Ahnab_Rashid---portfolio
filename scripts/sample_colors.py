"""Sample average colors from key regions of the hero image for CSS overlay tints."""
from PIL import Image

img = Image.open('/home/z/my-project/public/images/hero-character.png').convert('RGB')
W, H = img.size  # 1448 x 1086
print('size:', W, H)

def avg(box, label):
    region = img.crop(box)
    px = list(region.getdata())
    n = len(px)
    r = sum(p[0] for p in px) // n
    g = sum(p[1] for p in px) // n
    b = sum(p[2] for p in px) // n
    # Wall-only estimate: average of the brightest 45% pixels (excludes dark baked text)
    bright = sorted(px, key=lambda p: p[0] + p[1] + p[2])
    top = bright[int(n * 0.55):]
    m = len(top)
    wr = sum(p[0] for p in top) // m
    wg = sum(p[1] for p in top) // m
    wb = sum(p[2] for p in top) // m
    print(f'{label}: raw rgb({r},{g},{b}) #{r:02x}{g:02x}{b:02x} | wall rgb({wr},{wg},{wb}) #{wr:02x}{wg:02x}{wb:02x}')

# Regions as fractions of the image (x0,y0,x1,y1)
avg((int(0.05*W), int(0.16*H), int(0.36*W), int(0.33*H)), 'left-heading-area  ')
avg((int(0.05*W), int(0.36*H), int(0.36*W), int(0.52*H)), 'left-button-area   ')
avg((int(0.04*W), int(0.03*H), int(0.22*W), int(0.10*H)), 'top-left-logo-area ')
avg((int(0.64*W), int(0.03*H), int(0.92*W), int(0.10*H)), 'top-right-nav-area ')
avg((int(0.42*W), int(0.14*H), int(0.52*W), int(0.50*H)), 'mid-wall-strip     ')
avg((int(0.10*W), int(0.60*H), int(0.35*W), int(0.75*H)), 'lower-left-desk    ')
avg((int(0.60*W), int(0.80*H), int(0.90*W), int(0.95*H)), 'bottom-desk-center ')
avg((int(0.55*W), int(0.20*H), int(0.70*W), int(0.35*H)), 'hijab-floral-area  ')
