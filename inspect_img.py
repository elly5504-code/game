from PIL import Image
import os

for x in ['A', 'B', 'C', 'D', 'E']:
    p = f'public/3/badge_{x}.png'
    if os.path.exists(p):
        im = Image.open(p)
        print(f'{x}: size={im.size}, mode={im.mode}')
    else:
        print(f'{x}: not found')
