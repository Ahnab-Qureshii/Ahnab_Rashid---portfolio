"""Generate a heavily blurred derivative of the hero photo used ONLY as a
soft wall-wash UI layer (text backdrop). The original hero-character.png
asset remains byte-for-byte untouched."""
from PIL import Image, ImageFilter, ImageEnhance

SRC = '/home/z/my-project/public/images/hero-character.png'
OUT = '/home/z/my-project/public/images/hero-wall-blur.jpg'

img = Image.open(SRC).convert('RGB')
blurred = img.filter(ImageFilter.GaussianBlur(radius=36))
blurred = ImageEnhance.Brightness(blurred).enhance(1.05)
blurred.save(OUT, 'JPEG', quality=90, optimize=True)
print('saved', OUT, blurred.size)
