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
| `hero-dusk.jpg` | pierwszy ekran, menu (Home) | oryginał 588 × 390 px, powiększony do 1800 px |
| `about-portrait.jpg` | O studiu – portret, menu (About) | oryginał 669 × 298 px, powiększony do 1800 px |
| `camera-sunset.jpg` | Kontakt, menu (Services, Contact) | oryginał 547 × 365 px, powiększony do 1800 px |
| `camera-mountains.jpg` | menu (Portfolio) | oryginał 547 × 365 px, powiększony do 1800 px |

Oryginały były małe, więc zostały powiększone (Lanczos + wyostrzenie). Na dużych ekranach są wyraźnie miękkie –
przed prezentacją warto podmienić je na pliki w pełnej rozdzielczości (te same nazwy).

## Do uzupełnienia – portfolio (20 kadrów)

| Kategoria | Pliki (proporcje) |
| --- | --- |
| Weddings | `wedding-vows.jpg` (4:5), `wedding-first-dance.jpg` (3:2), `wedding-details.jpg` (2:3), `wedding-walk.jpg` (16:9) |
| Portraits | `portrait-studio.jpg` (4:5), `portrait-window.jpg` (2:3), `portrait-hands.jpg` (1:1), `portrait-artist.jpg` (3:2) |
| Fashion | `fashion-coat.jpg` (2:3), `fashion-motion.jpg` (4:5), `fashion-street.jpg` (16:9), `fashion-detail.jpg` (1:1) |
| Commercial | `commercial-interior.jpg` (3:2), `commercial-product.jpg` (4:5), `commercial-craft.jpg` (2:3), `commercial-architecture.jpg` (16:9) |
| Personal Stories | `story-kitchen.jpg` (3:2), `story-morning.jpg` (4:5), `story-sea.jpg` (16:9), `story-letters.jpg` (1:1) |

Tytuły i miejsca pod zdjęciami są w słownikach (`portfolio.items`), lata – w `src/data/portfolio.ts`.

## Do uzupełnienia – usługi (5 kadrów)

`service-weddings.jpg` (4:5), `service-portraits.jpg` (3:4), `service-fashion.jpg` (4:5),
`service-commercial.jpg` (3:2), `service-personal.jpg` (4:5).
