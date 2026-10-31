# Produkcja 3D — film i fotografie FORMA ATELIER

Wszystko w tym katalogu to kod Pythona dla Blendera 5.2 (`bpy` z PyPI) i silnika Cycles. Sceny, meble, materiały
i światło są proceduralne, więc nie potrzeba żadnych zewnętrznych tekstur ani modeli.

| Plik | Rola |
| --- | --- |
| `lib.py` | biblioteka: materiały (dąb, trawertyn, tynk wapienny, len, bouclé, ceramika…), meble, pokój z otworami i portalami światła, ogród, kamera, ustawienia renderu |
| `scene_villa.py` | Villa Natura — plan filmu hero |
| `scenes.py` | pozostałe wnętrza (Quiet Residence, Sandstone House, Urban Harmony, The Oak Residence, Minimal Living, pracownia) + lista kadrów `SHOTS` |
| `film.py` | render ujęć filmu (12 kl./s, 1280×720), wznawialny |
| `poster.py` | plakat = pierwsza klatka pętli w 1920×1080 |
| `shots.py` | render fotografii (`python shots.py <skala> <próbki> <katalog> [prefiks…]`) |
| `encode_film.sh` | montaż: interpolacja do 24 kl./s, przenikania, pętla, MP4/WebM 1080p i 720p |

## Odtworzenie
```bash
python3.13 -m venv venv && ./venv/bin/pip install bpy==5.2.3
./venv/bin/python film.py preview          # szybki podgląd kadrów
./venv/bin/python film.py render           # klatki -> out/film (ok. 40 s/klatkę na 4 rdzeniach CPU)
./venv/bin/python poster.py
./encode_film.sh out/film out/video
./venv/bin/python shots.py 0.89 32 out/final
```
Zmiana ruchu kamery: słownik `TAKES` w `film.py` (pozycja, cel, ogniskowa, przysłona; klucze rozłożone równo w czasie).
