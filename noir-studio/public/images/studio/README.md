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
| `camera-sunset.jpg` | menu (Usługi) | oryginał 547 × 365 px, powiększony do 1800 px |
| `photographer-field.jpg` | Kontakt, menu (Kontakt) | oryginał 650 × 431 px, powiększony 2,5× |
| `camera-mountains.jpg` | menu (Portfolio) | oryginał 547 × 365 px, powiększony do 1800 px |
| `wedding-vows.jpg` | portfolio – Śluby, usługa „Fotografia ślubna” | 1130 × 977 px |
| `portrait-window.jpg` | portfolio – Portrety, usługa „Fotografia portretowa” | 1334 × 2000 px |
| `fashion-street.jpg` | portfolio – Moda, usługa „Fotografia modowa” | oryginał 678 × 452 px, powiększony 2× |
| `story-morning.jpg` | portfolio – Historie osobiste, usługa „Sesje osobiste” | **oryginał 193 × 261 px**, powiększony 3× |
| `commercial-product.jpg` | portfolio – Dla firm (reprodukcja obrazu), usługa „Fotografia komercyjna” | **oryginał 181 × 278 px**, powiększony 3× |
| `commercial-camera.jpg` | portfolio – Dla firm (aparat pod słońce) | 1600 × 1067 px |
| `fashion-summer.jpg` | portfolio – Moda (trzy kobiety w okularach) | **oryginał 197 × 148 px**, powiększony 3× |
| `portrait-retro.jpg` | portfolio – Portrety (kobieta w kapeluszu z kociakiem) | **oryginał 299 × 168 px**, powiększony 3× |
| `fashion-gown.jpg` | portfolio – Moda (czarna suknia) | oryginał 600 × 901 px, powiększony 1,6× |
| `fashion-jewelry.jpg` | portfolio – Moda (biżuteria, dwa kadry) | oryginał 588 × 333 px, powiększony 2,5× |
| `commercial-tools.jpg` | portfolio – Dla firm (przecinaki kaletnicze) | oryginał 400 × 400 px, powiększony 2,5× |
| `commercial-painting.jpg` | portfolio – Dla firm (reprodukcja obrazu) | oryginał 399 × 501 px, powiększony 2,5× |
| `commercial-food.jpg` | portfolio – Dla firm (fotografia kulinarna) | oryginał 588 × 408 px, powiększony 2,5× |
| `story-sea.jpg` | portfolio – Historie osobiste (Bałtyk zimą) | oryginał 588 × 390 px, powiększony 2,5× |

Usługi używają tych samych plików co pierwsze zdjęcie danej kategorii w portfolio (`src/config/images.ts`).
Pliki oznaczone pogrubieniem to miniatury – na stronie są wyraźnie miękkie. Przed prezentacją warto podmienić je
(i powiększone zdjęcia z pierwszych czterech wierszy) na oryginały w pełnej rozdzielczości, pod tymi samymi nazwami.

## Do uzupełnienia – portfolio (7 kadrów)

| Kategoria | Pliki (proporcje) |
| --- | --- |
| Śluby | `wedding-first-dance.jpg` (3:2), `wedding-details.jpg` (2:3), `wedding-walk.jpg` (16:9) |
| Portrety | `portrait-studio.jpg` (4:5), `portrait-hands.jpg` (1:1) |
| Historie osobiste | `story-kitchen.jpg` (3:2), `story-letters.jpg` (1:1) |

Kategorie Moda i Dla firm są już kompletne.

Tytuły i miejsca pod zdjęciami są w słownikach (`portfolio.items`), lata – w `src/data/portfolio.ts`.
Po wgraniu zdjęcia zmień też jego tytuł, miejsce i `alt` w `src/i18n/pl.ts` oraz `src/i18n/en.ts`.
