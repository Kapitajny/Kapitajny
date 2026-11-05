"""
Tnie eksport projektu Canva „BUŁA burger house promotional web banner” na zdjęcia strony.

1. W Canvie: Udostępnij -> Pobierz -> JPG, wszystkie strony (4 pliki).
2. Zapisz je w jednym katalogu jako p1.jpg (baner), p2.jpg, p3.jpg, p4.jpg (arkusze zdjęć).
3. Uruchom:  python3 scripts/potnij-eksport-canva.py <katalog-z-eksportem> public/images

Wymaga Pillow (pip install pillow). Współrzędne odpowiadają układowi arkuszy w projekcie.
"""
import sys, os
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
S = 1264
def sq(c, r): return (c*1280, r*1280, c*1280+S, r*1280+S)
jobs = {
 "p2.jpg": {"classic-burger": sq(0,0), "double-cheese": sq(1,0), "bbq-bacon": sq(2,0), "fire-burger": sq(3,0),
            "big-house": sq(0,1), "crispy-chicken": sq(1,1), "trufla-parmezan": sq(2,1), "jalapeno-smash": sq(3,1),
            "hot-chicken": sq(0,2), "zestaw-classic": sq(1,2), "zestaw-fire": sq(2,2), "zestaw-duo": sq(3,2)},
 "p3.jpg": {"frytki": sq(0,0), "frytki-ser-bekon": sq(1,0), "krazki-cebulowe": sq(2,0), "cola": sq(3,0),
            "lemoniada": sq(0,1), "shake-waniliowy": sq(1,1), "shake-czekoladowy": sq(2,1)},
 "p4.jpg": {"o-nas-grill": (0,0,1136,1408), "o-nas-skladanie": (1152,0,2288,1408), "hero-burger": (2304,0,3984,944),
            "promo-fire": (2304,960,4080,1856), "o-nas-skladniki": (0,1872,1536,2896),
            "lokal-warszawa": (1552,1872,3088,2896), "lokal-grodzisk": (3104,1872,4640,2896)},
}
for page, items in jobs.items():
    im = Image.open(os.path.join(src, page)).convert("RGB")
    print(page, im.size)
    for name, box in items.items():
        crop = im.crop(box)
        maxw = 1920 if name.startswith(("hero", "promo")) else 1264
        crop.thumbnail((maxw, maxw), Image.LANCZOS)
        p = os.path.join(out, name + ".jpg")
        crop.save(p, quality=85, optimize=True, progressive=True)
        print(" ", name, crop.size, os.path.getsize(p)//1024, "KB")
b = Image.open(os.path.join(src, "p1.jpg")).convert("RGB")
b.save(os.path.join(out, "og-baner.jpg"), quality=86, optimize=True, progressive=True)
print("banner", b.size)
