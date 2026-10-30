# Zdjęcia NOIR STUDIO

Wgraj tutaj pliki o poniższych nazwach. Mapowanie zdjęć na sekcje jest w `src/config/images.ts` – tam zmienisz
nazwę pliku, proporcje kadru (`aspect`) i punkt ostrości (`focus`). Teksty alternatywne (`alt`) są w słownikach
`src/i18n/pl.ts` i `src/i18n/en.ts` (klucz `images`). Brakujący plik zastępuje passe-partout w barwach marki
z napisem „Zdjęcie zostanie dodane”.

Zalecenia: JPG lub WebP, **min. 2000 px po dłuższym boku**, kadr w podanych proporcjach (zdjęcie jest przycinane
przez `object-fit: cover`). Po wgraniu zdjęć zaktualizuj `alt` w obu językach, aby opisywał to, co faktycznie jest na zdjęciu,
i przebuduj projekt (`npm run build`).

## Obecne pliki (przekazane przez klienta)

| Plik | Gdzie | Uwagi |
| --- | --- | --- |
| `hero-dusk.jpg` | pierwszy ekran, menu (Start) | oryginał 588 × 390 px, powiększony do 1800 px |
| `about-portrait.jpg` | O nas – portret, menu (O nas) | oryginał 669 × 298 px, powiększony do 1800 px |
| `camera-sunset.jpg` | Kontakt, menu (Usługi, Kontakt) | oryginał 547 × 365 px, powiększony do 1800 px |
| `camera-mountains.jpg` | menu (Portfolio) | oryginał 547 × 365 px, powiększony do 1800 px |
| `wedding-vows.jpg` | portfolio – Śluby, usługa „Fotografia ślubna” | 1130 × 977 px |
| `portrait-window.jpg` | portfolio – Portrety, usługa „Fotografia portretowa” | 1334 × 2000 px |
| `fashion-street.jpg` | portfolio – Moda, usługa „Fotografia modowa” | oryginał 678 × 452 px, powiększony 2× |
| `story-morning.jpg` | portfolio – Historie osobiste, usługa „Sesje osobiste” | **oryginał 193 × 261 px**, powiększony 3× |
| `commercial-product.jpg` | portfolio – Dla firm (reprodukcja obrazu), usługa „Fotografia komercyjna” | **oryginał 181 × 278 px**, powiększony 3× |
| `commercial-camera.jpg` | portfolio – Dla firm (aparat pod słońce) | 1600 × 1067 px |
| `fashion-summer.jpg` | portfolio – Moda (trzy kobiety w okularach) | **oryginał 197 × 148 px**, powiększony 3× |

Usługi używają tych samych plików co pierwsze zdjęcie danej kategorii w portfolio (`src/config/images.ts`).
Pliki oznaczone pogrubieniem to miniatury – na stronie są wyraźnie miękkie. Przed prezentacją warto podmienić je
(i powiększone zdjęcia z pierwszych czterech wierszy) na oryginały w pełnej rozdzielczości, pod tymi samymi nazwami.

## Do uzupełnienia – portfolio (13 kadrów)

| Kategoria | Pliki (proporcje) |
| --- | --- |
| Śluby | `wedding-first-dance.jpg` (3:2), `wedding-details.jpg` (2:3), `wedding-walk.jpg` (16:9) |
| Portrety | `portrait-studio.jpg` (4:5), `portrait-hands.jpg` (1:1), `portrait-artist.jpg` (3:2) |
| Moda | `fashion-motion.jpg` (4:5), `fashion-detail.jpg` (1:1) |
| Dla firm | `commercial-craft.jpg` (2:3), `commercial-architecture.jpg` (16:9) |
| Historie osobiste | `story-kitchen.jpg` (3:2), `story-sea.jpg` (16:9), `story-letters.jpg` (1:1) |

Tytuły i miejsca pod zdjęciami są w słownikach (`portfolio.items`), lata – w `src/data/portfolio.ts`.
Po wgraniu zdjęcia zmień też jego tytuł, miejsce i `alt` w `src/i18n/pl.ts` oraz `src/i18n/en.ts`.
