from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('/home/claude/homly-pwa/icons', exist_ok=True)

for size in [192, 512]:
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    draw = ImageDraw.Draw(img)
    margin = size // 10
    # Dark background with plum accent
    draw.rounded_rectangle([0, 0, size, size], radius=size//4, fill=(26, 26, 46, 255))
    draw.rounded_rectangle([margin, margin, size-margin, size-margin], radius=size//5, fill=(108, 92, 231, 255))
    # House icon
    font_size = size // 2
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', font_size)
    except:
        font = ImageFont.load_default()
    text = '🏠'
    bbox = draw.textbbox((0,0), text, font=font)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    x = (size - tw) // 2
    y = (size - th) // 2 - size//16
    draw.text((x, y), text, font=font, fill=(255,255,255,255))
    img.save(f'/home/claude/homly-pwa/icons/icon-{size}.png')
    print(f'✅ Icon {size}x{size} Kazaé créée')

