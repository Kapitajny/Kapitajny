# CLIMARO – system wizualny

Kierunek: **Industrial Engineering** w wykonaniu korporacyjnym. Hero to jedyny autorski, mocny akcent
(zdjęcie domu z pompą ciepła i oznaczeniami usług). Wszystko poniżej trzyma standard dużych marek
(ORLEN, Viessmann, Daikin): spokojna typografia, jasne sekcje, karty usług, rzeczowe sekcje zaufania.

## Kolor

| Token | Wartość | Rola |
| --- | --- | --- |
| `--c-black` | `#080909` | Hero, nagłówek strony, stopka, pas kontaktowy |
| `--c-graphite` | `#111315` | Tekst na jasnym tle, ramka danych kontaktowych |
| `--c-steel` | `#92989D` | Drobne etykiety na ciemnym tle (nie tekst ciągły) |
| `--c-steel-dark` | `#4A5056` | Etykiety na jasnym tle |
| `--c-white` | `#F5F5F5` | Jasne sekcje (`.theme-light`), tekst na ciemnym |
| `#FFFFFF` | – | Sekcje białe (`.theme-white`), karty |
| `--c-orange` | `#FF7900` | Przyciski główne, aktywne menu, znaczniki w hero, ikony na ciemnym tle |

- Tekst akcentu na jasnym tle: `--accent-text` = `#A34700` (5,2–5,6:1). Pomarańcz `#FF7900` nigdy jako tekst na jasnym tle.
- Na pomarańczowym przycisku tekst czarny (7,6:1).
- Tekst drugiego planu (akapity, opisy): `--fg-2` = `#3B4146` na jasnym, `#C9CDD0` na ciemnym – nie stalowa szarość.
- Motywy sekcji: `.theme-dark`, `.theme-graphite`, `.theme-white`, `.theme-light`, `.theme-paper`.
- Rytm strony głównej: hero (ciemne) → usługi (jasnoszare) → o firmie (białe) → jak pracujemy (jasnoszare)
  → bezpieczeństwo i jakość (białe) → pas kontaktowy (zdjęcie, ciemne) → stopka.

## Typografia

Jedna rodzina: **Archivo** (zmienna oś `wdth`).

| Rola | Klasa | Szerokość | Grubość | Rozmiar |
| --- | --- | --- | --- | --- |
| Nagłówek hero | – | 125 (Expanded) | 700 | `clamp(2.125rem, 1rem + 3.9vw, 4.5rem)` – jedyne miejsce z krojem Expanded |
| Tytuł podstrony | `.h-page` | 100 | 600 | `clamp(2rem, …, 3.25rem)` |
| Nagłówek sekcji | `.h-section` | 100 | 600 | `clamp(1.75rem, …, 2.5rem)` |
| Tytuł karty / punktu | `.h-card` | 100 | 600 | 1,25rem |
| Wprowadzenie | `.lead` | 100 | 400 | 1,125rem, kolor `--fg-2` |
| Tekst | – | 100 | 400 | 17 px, interlinia 1,6 |

- Ceny: `font-variant-numeric: tabular-nums` (klasa `.num`), kwoty z twardymi spacjami („12 900 zł”).
- Opisy i dopiski co najmniej 15 px; brak etykiet wersalikami nad nagłówkami.

## Komponenty

| Komponent | Gdzie | Zasada |
| --- | --- | --- |
| `Hero` | Strona główna | Zdjęcie, nagłówek Expanded, dwa przyciski, cztery oznaczenia usług z cenami (pełny znacznik = urządzenie widoczne, pusty i przerywana linia = instalacja w budynku). Oznaczenia tylko na ekranach ≥ 1200 × 736 px; na telefonie pionowy kadr zdjęcia jako pas u góry. |
| `ServiceCards` | Strona główna | Cztery karty: zdjęcie 4:3, nazwa, krótki opis, cena montażu/przeglądu „od …” z dopiskiem „bez urządzenia”, link „Zakres i cennik”. Cała karta klikalna. |
| `HowWeWork` | Strona główna, O nas | Cztery etapy współpracy (dane w `src/data/process.ts`), linia 2 px nad każdym etapem, pierwszy w kolorze marki. |
| `TrustSection` | Strona główna | Cztery sprawdzalne fakty (F-gaz, OC, protokół, gwarancja) z ikonami SVG 32 px. |
| `PageIntro` | Podstrony | Jasny nagłówek strony; opcjonalnie zdjęcie obok tekstu. |
| `CtaBand` | Strona główna, Usługi, O nas | Pas ze zdjęciem z instalacji (inne na każdej stronie) i dwiema drogami kontaktu. |
| `MobileActionBar` | Telefony (poza kontaktem) | „Zadzwoń” i „Bezpłatna wycena” pod kciukiem po przewinięciu pierwszego ekranu. |
| `ContactForm` | Kontakt | Uprzedza o wersji demonstracyjnej przed wysłaniem; po walidacji prowadzi do „Wyślij e-mailem” / „Zadzwoń”. |

Strona usług: każda usługa w dwóch kolumnach (zdjęcie | nazwa, opis, tabela cen w ramce, „Cena obejmuje…”, przycisk),
pod spodem „Zakres prac” (lista z ikonami) i „Od czego zależy koszt”. Zdjęcia na przemian po lewej i prawej.

## Kształt

- Zaokrąglenie 2 px (przyciski, pola), 4 px (karty, zdjęcia, ramki). Bez cieni.
- Linie 1 px oddzielają wiersze; linia 2 px nad etapami i punktami osi czasu.
- Ikony: własne SVG, kreska 1,5 px.
- Bez numerowanych kółek na zdjęciach, przyklejonych galerii, udawanych dokumentów i gradientów ozdobnych
  (jedyny gradient to przyciemnienie zdjęcia pod tekstem).

## Logo

Znak „Przepływ”: łuk litery C otwarty w prawo i trzy poziome strugi powietrza. Logotyp CLIMARO: Archivo Expanded 700.
W nagłówku logo bez podpisu; pełna wersja z podpisem w stopce. Pliki w `public/brand/`.

## Ruch (wg zasad Emila Kowalskiego)

- Krzywe: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`. Nigdy `ease-in`.
- Jeden zaplanowany moment: wejście hero. Poza nim ruch tylko w odpowiedzi na działanie (menu, pasek akcji, przyciski).
- Przyciski: `scale(0.97)` przy wciśnięciu; efekty najechania tylko dla `(hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion`: bez przesunięć.

## Responsywność

- Telefon w nagłówku zawsze (z numerem od 1280 px, poniżej ikona 44 px); pełne menu od 1100 px.
- Karty usług: 1 kolumna → 2 (≥ 640 px) → 4 (≥ 1200 px).
- Testowane szerokości: 320, 360, 375, 390, 768, 1024, 1200, 1280, 1366, 1440, 1920, 2560.
