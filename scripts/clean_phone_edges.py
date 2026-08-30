from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "landing" / "vello-phones-real-screens-clean@3x.png"
TARGET = ROOT / "public" / "landing" / "vello-phones-real-screens-cleaned@3x.png"

image = Image.open(SOURCE).convert("RGBA")
rgba = np.asarray(image, dtype=np.float32).copy()
alpha = rgba[..., 3] / 255.0
safe_alpha = np.maximum(alpha, 1.0 / 255.0)

# Remove the light matte stored in semi-transparent edge pixels.
edge = alpha < 0.985
corrected = (rgba[..., :3] - 255.0 * (1.0 - alpha[..., None])) / safe_alpha[..., None]
rgba[..., :3][edge] = np.clip(corrected[edge], 0.0, 255.0)
rgba[alpha < 0.01] = 0

cleaned = Image.fromarray(rgba.astype(np.uint8), "RGBA")

# A two-pixel inward alpha pass at 3x removes isolated white specks without
# changing the visible silhouette at the rendered size.
cleaned.putalpha(cleaned.getchannel("A").filter(ImageFilter.MinFilter(5)))
cleaned.save(TARGET, optimize=True)
