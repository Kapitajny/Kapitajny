# Film do hero — „Villa Natura, popołudnie”

## Jak powstał
Film i wszystkie fotografie na stronie to **autorskie rendery 3D** przygotowane specjalnie dla FORMA ATELIER. Nie są
to materiały stockowe ani generowane przez AI.

- Narzędzie: Blender 5.2 (moduł `bpy` z PyPI) + silnik Cycles, renderowanie na CPU.
- Sceny, meble i materiały zbudowaliśmy proceduralnie w Pythonie (`production/3d/`): bielony dąb z deskami,
  trawertyn z porami, tynk wapienny, len, bouclé, papierowe lampiony, ceramika toczona, drzewko oliwne.
- Światło: fizyczne niebo i słońce o 24° nad horyzontem, z południowego zachodu. Portale świetlne w oknach,
  tonemapping AgX (Medium High Contrast).

**Dlaczego nie stock ani AI?** W sesji, w której powstał projekt, Unsplash, Pexels i Pixabay były zablokowane przez
politykę sieci. Generatory wideo (Figma Weave) nie były połączone z kontem, a tworzenia plików i wydawania kredytów AI
na koncie klienta nie wykonywaliśmy bez jego zgody. Zamiast podstawiać zdjęcie z efektem zoomu, wyrenderowaliśmy
prawdziwy przejazd kamery przez wnętrze.

## Scenopis (17,5 s, pętla)
| # | Ujęcie | Ruch kamery |
| --- | --- | --- |
| A | Wejście z tarasu przez przeszklenie do salonu (7 s) | powolny dolly-in, 26–27 mm |
| B | Obok sofy, zbliżenie na trawertyn i dąb (5 s) | boczny przejazd w dół, 34→40 mm, głębia ostrości f/3.2–4 |
| C | Jadalnia z lampionami (5 s) | boczny tracking wzdłuż stołu, 30 mm |
| D | Szerokie ujęcie całej strefy dziennej (5 s) | odjazd z uniesieniem, 25→22 mm |

Między ujęciami są miękkie, jednosekundowe przenikania, bez cięć. Ostatnia sekunda przenika w pierwsze klatki, więc
pętla nie ma widocznego przeskoku.

## Parametry techniczne
| Plik | Format | Rozdzielczość | Zastosowanie |
| --- | --- | --- | --- |
| `public/video/forma-atelier-hero-1080.webm` | VP9, bez dźwięku, 4,0 MB | 1920×1080, 24 kl./s | desktop (Chrome, Firefox, Edge) |
| `public/video/forma-atelier-hero-1080.mp4` | H.264 High, faststart, 8,9 MB | 1920×1080, 24 kl./s | desktop (Safari) |
| `public/video/forma-atelier-hero-720.mp4` | H.264, faststart, 2,9 MB | 1280×720 | telefony i tablety do 820 px |
| `public/video/forma-atelier-hero-720.webm` | VP9, 1,8 MB | 1280×720 | telefony bez kodeka H.264 |
| `src/assets/film/hero-poster.jpg` | JPEG | 1920×1080 | plakat / LCP / fallback |

Wyrenderowano 264 klatki w 1280×720 przy 12 kl./s (ok. 40 s na klatkę na 4 rdzeniach CPU). Do 24 kl./s doprowadziła interpolacja ruchu (`minterpolate`), a do
1080p skalowanie Lanczos. Plakat to pierwsza klatka pętli, wyrenderowana natywnie w 1920×1080.

## Zachowanie na stronie
- Plakat (`next/image`, preload) jest elementem LCP. Film doładowuje się w `requestIdleCallback` i płynnie zastępuje
  plakat po zdarzeniu `playing`.
- `autoplay muted loop playsInline`, `object-fit: cover`, bez dźwięku.
- Przy `prefers-reduced-motion`, `saveData` lub połączeniu 2G/3G film się nie pobiera, zostaje plakat z przyciskiem
  „Odtwórz film w tle”.
- Film pauzuje się poza ekranem (IntersectionObserver). Przycisk pauzy spełnia WCAG 2.2.2.

## Opcjonalnie: prompt do generatora wideo AI
Jeśli w przyszłości pracownia zechce wariant z generatora (np. Veo, Kling, Runway), proponowany prompt:

> Cinematic, photorealistic interior walkthrough of a quiet-luxury open-plan villa living room, 16:9, 24 fps, 20
> seconds, seamless loop, no people, no text. Shot 1: slow steadicam dolly from a limestone terrace through tall
> slim black-steel glazing into a calm living room with bleached oak beams, limewash plaster walls and an olive tree
> in a stone pot. Shot 2: slow lateral glide past a low cream bouclé sofa, gently descending to a close-up of a honed
> travertine coffee table and wide bleached-oak floorboards; shallow depth of field. Shot 3: slow tracking shot along a
> solid oak dining table with linen-upholstered chairs under two rice-paper lantern pendants, warm glow. Shot 4: wide
> establishing shot of the whole space with the garden visible through floor-to-ceiling windows. Warm late-afternoon
> sunlight from the left, soft long shadows, palette of warm beige, off-white, graphite and muted olive, natural
> materials (stone, oak, linen, architectural concrete). Smooth, slow camera moves, gentle 1-second cross dissolves,
> no fast cuts, no lens flares, no glossy CGI look, filmic contrast, fine grain.

Negatywny prompt: `people, text, logos, fast motion, handheld shake, fisheye, oversaturated colors, plastic CGI look,
flicker, warped furniture`.

## Odtworzenie / modyfikacja
Instrukcja w `production/3d/README.md`.
