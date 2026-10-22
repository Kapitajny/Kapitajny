"""
Przygotowanie zdjęć do strony (jednorazowo, po dodaniu nowych materiałów).

Oryginały leżą w `assets-source/` i nie są modyfikowane. Skrypt:
1. przesuwa fioletowo-niebieskie światło z sesji w stronę zgaszonego różu z palety marki
   (tylko barwy 195–335°, skóra, drewno i biel pozostają bez zmian),
2. zapisuje zdjęcia w `src/assets/photos/` jako JPG,
3. wycina portrety instruktorów ze zdjęcia zespołu (współrzędne w CROPS).

Uruchomienie: python3 scripts/grade-photos.py   (wymaga: pillow, numpy)
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-source"
OUT = ROOT / "src" / "assets" / "photos"

PHOTOS = ["team-motion", "studio-hall", "class-joy"]

# Portrety instruktorów (proporcje 3:4) wycięte ze zdjęcia zespołu: (lewo, góra, prawo, dół).
CROPS = {
    "instructor-hana": ("team-motion", (410, 340, 800, 860)),
    "instructor-daniel": ("team-motion", (900, 250, 1264, 735)),
    "instructor-kai": ("team-motion", (40, 80, 460, 640)),
    "instructor-lena": ("team-motion", (40, 600, 520, 1240)),
}


def grade(im: Image.Image, target=352.0, lo=195.0, hi=335.0, sat_mul=0.48) -> Image.Image:
    hsv = np.asarray(im.convert("HSV")).astype(np.float32)
    h = hsv[..., 0] * 360 / 255
    s = hsv[..., 1] / 255
    v = hsv[..., 2] / 255
    weight = np.clip((h - lo) / 25, 0, 1) * np.clip((hi - h) / 20, 0, 1) * np.clip(s / 0.18, 0, 1)
    new_h = h + weight * (target - h)
    new_s = s * (1 - weight * (1 - sat_mul))
    out = np.stack([(new_h % 360) * 255 / 360, new_s * 255, v * 255], -1).clip(0, 255).astype(np.uint8)
    rgb = np.asarray(Image.fromarray(out, "HSV").convert("RGB")).astype(np.float32)
    rgb[..., 0] *= 1.02  # delikatnie cieplejsza tonacja
    rgb[..., 2] *= 0.97
    return Image.fromarray(rgb.clip(0, 255).astype(np.uint8))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    graded = {}
    for name in PHOTOS:
        graded[name] = grade(Image.open(SRC / f"{name}.png").convert("RGB"))
        graded[name].save(OUT / f"{name}.jpg", quality=90, optimize=True, progressive=True)
    for name, (source, box) in CROPS.items():
        graded[source].crop(box).save(OUT / f"{name}.jpg", quality=92, optimize=True, progressive=True)
    print("Gotowe:", ", ".join(sorted(p.name for p in OUT.glob("*.jpg"))))


if __name__ == "__main__":
    main()
