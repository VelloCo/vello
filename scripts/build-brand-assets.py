"""Gera os arquivos da marca a partir de design/brand/vello-logo-original.png.

Remove só o fundo branco externo (conectado às bordas), preservando os
vincos brancos internos do símbolo, e exporta logo, favicon e ícones.
Uso: python scripts/build-brand-assets.py
"""
import numpy as np
from PIL import Image
from scipy import ndimage

src = Image.open('design/brand/vello-logo-original.png').convert('RGB')
a = np.asarray(src).astype(np.float32)
dist = 255 - a.min(axis=2)

labels, _ = ndimage.label(dist < 40)
border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
bg = np.isin(labels, border[border > 0])
edge = ndimage.binary_dilation(bg, iterations=3)

alpha = np.where(edge, np.clip((dist - 6) / (60 - 6), 0, 1), 1.0)
alpha[bg & (dist < 6)] = 0
rgb = np.where(alpha[..., None] > 0, (a - 255 * (1 - alpha[..., None])) / np.maximum(alpha[..., None], 1e-3), 255)
img = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8), 'RGBA')
mark = img.crop(img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())
w, h = mark.size
side = max(w, h)


def square(pad, size, background=None):
    s = int(side * (1 + 2 * pad))
    canvas = Image.new('RGBA', (s, s), background or (0, 0, 0, 0))
    canvas.alpha_composite(mark, ((s - w) // 2, (s - h) // 2))
    return canvas.resize((size, size), Image.LANCZOS)


square(0.04, 512).save('public/vello-logo.png', optimize=True)
square(0.06, 64).save('public/favicon.png', optimize=True)
square(0.18, 180, (255, 255, 255, 255)).convert('RGB').save('public/apple-touch-icon.png', optimize=True)
square(0.18, 512, (255, 255, 255, 255)).convert('RGB').save('public/icon-512.png', optimize=True)
print('ok', mark.size)
