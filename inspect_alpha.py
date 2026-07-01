from PIL import Image
import os

p = 'public/3/badge_A.png'
if os.path.exists(p):
    im = Image.open(p)
    print(f'Mode: {im.mode}')
    # Get corner pixel values
    w, h = im.size
    corners = [
        im.getpixel((0, 0)),
        im.getpixel((w - 1, 0)),
        im.getpixel((0, h - 1)),
        im.getpixel((w - 1, h - 1))
    ]
    print(f'Corners: {corners}')
    
    # Check if there is already transparency
    if im.mode == 'RGBA':
        # Let's count transparent pixels
        pixels = list(im.getdata())
        transparent_count = sum(1 for pix in pixels if pix[3] < 128)
        print(f'Transparent pixels: {transparent_count} out of {len(pixels)} ({transparent_count/len(pixels)*100:.2f}%)')
    else:
        print('No alpha channel!')
