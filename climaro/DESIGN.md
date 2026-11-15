# CLIMARO – system wizualny

Kierunek: **Industrial Engineering**, wariant „Architektura z adnotacjami” (połączenie koncepcji A i C).

## Teza

Strona to „architektura z adnotacjami”. Najmocniejszy element to hero: prawdziwe zdjęcie nowoczesnego domu z pompą
ciepła, na którym cienkie linie – jak opisy na rysunku technicznym – wskazują miejsca pracy instalacji i podają cenę
montażu. Ten sam język ciągnie się przez całą stronę: zdjęcia usług mają numerowane oznaczenia z legendą, historia
firmy stoi na osi z kreskami jak na rysunku, a ceny wyglądają jak karta parametrów. Wokół tego – spokojna, ciemna,
fotograficzna kompozycja z jasnymi sekcjami do czytania.

## Elementy charakterystyczne

| Element | Gdzie | Zasada |
| --- | --- | --- |
| Oznaczenia w hero | Strona główna | Cztery usługi. Pełny znacznik i ciągła linia = urządzenie widoczne na zdjęciu; pusty znacznik i linia przerywana = instalacja wewnątrz budynku. Legenda na ciemnych podkładkach pod przyciskami. Tylko na ekranach ≥ 1200 × 736 px; mniejsze ekrany nie dublują listy cen, która jest zaraz pod hero. |
| Zdjęcie z oznaczeniami (`AnnotatedPhoto`) | Usługi | Ramka w proporcjach pliku, numerowane znaczniki (pomarańczowy krążek, biała obwódka) i legenda 1–3. Punkty wskazują wyłącznie rzeczy widoczne na zdjęciu. |
| Indeks usług (`ServiceIndex`) | Strona główna | Lista z cenami; duże zdjęcie (3:2) przenika się do usługi wskazanej myszą lub klawiaturą (przenikanie z rozmyciem 4 px) i ma te same numerowane oznaczenia co strona usług. Na telefonie każdy wiersz ma własne zdjęcie. |
| Oś czasu | O nas | Pozioma oś z ukośnymi kreskami jak na rysunku technicznym; roczniki, tytuły i opisy na wspólnych liniach (subgrid); „Dziś” w kolorze marki. |
| Pas fotograficzny | Zachęta do kontaktu, nagłówek „O nas” | Zdjęcie na całą szerokość z funkcjonalnym przyciemnieniem pod tekstem; na każdej stronie inne zdjęcie z instalacji. |
| Protokół uruchomienia (`CommissioningReport`) | Strona główna | Przykładowy dokument z pomiarami (oznaczony jako dane demonstracyjne); numerowane znaczniki 1–4 przy grupach pomiarów odpowiadają legendzie argumentów obok. |
| Pasek akcji (`MobileActionBar`) | Telefony, wszystkie strony poza kontaktem | „Zadzwoń” i „Bezpłatna wycena” pod kciukiem; pojawia się po przewinięciu pierwszego ekranu (280 ms, ease-out). |

## Kolor

| Token | Wartość | Rola |
| --- | --- | --- |
| `--c-black` | `#080909` | Tło hero, nagłówka, stopki |
| `--c-graphite` | `#111315` | Sekcje ciemne drugiego planu, tekst na jasnym tle |
| `--c-steel` | `#92989D` | Tekst pomocniczy na ciemnym tle (6,4–6,8:1) |
| `--c-steel-dark` | `#4A5056` | Tekst pomocniczy na jasnym tle (8,3:1) |
| `--c-white` | `#F5F5F5` | Tło sekcji do czytania, tekst na ciemnym |
| `--c-orange` | `#FF7900` | Wyłącznie: przyciski główne, znaczniki w hero, aktywna pozycja menu, kreski list, ikony, fokus na ciemnym tle |

Zasady:

- Na pomarańczowym przycisku tekst jest czarny (7,6:1). Biały tekst na pomarańczu (2,6:1) jest zabroniony.
- Pomarańczowego nie używamy jako koloru tekstu na jasnym tle (2,6:1). Tekst akcentu na jasnym tle: `--accent-text` = `#A34700` (5,2–5,6:1).
- Ciemne lub jasne tło wynika z sytuacji użycia: ciemne do prezentacji (hero, nawigacja, stopka), jasne do czytania cen i formularzy.
- Motywy sekcji: klasy `.theme-dark`, `.theme-graphite`, `.theme-light`, `.theme-paper` (#EBECED) ustawiają `--bg`, `--fg`, `--muted`, `--line`, `--focus`, `--error`.
- Rytm: prezentacja (zdjęcia, usługi, ceny) na ciemnym tle, treści do spokojnego czytania (zasady, argumenty, formularz) na jasnym; dwa jasne tony obok siebie, żeby sekcje się nie zlewały.

## Typografia

Jedna rodzina: **Archivo** (Google Fonts, zmienna oś szerokości `wdth`).

| Rola | Szerokość | Grubość | Rozmiar |
| --- | --- | --- | --- |
| Nagłówek hero | 125 (Expanded) | 700 | `clamp(2.125rem, 1rem + 3.9vw, 4.5rem)`, odstęp liter −0,025em |
| Tytuł podstrony | 125 | 700 | `clamp(2.25rem, …, 4.25rem)` |
| Nagłówek sekcji | 112 | 650 | `--step-3` |
| Tekst | 100 | 400 | 17 px, interlinia 1,6, akapit do ok. 66 znaków |

- Ceny i liczby: `font-variant-numeric: tabular-nums` (klasa `.num`), kwoty z twardymi spacjami („12 900 zł”).
- Bez etykiet wersalikami nad nagłówkami, bez wyróżniania pojedynczych słów kolorem.

## Kształt i struktura

- Zaokrąglenie 2 px (przyciski, pola). Brak cieni dekoracyjnych, brak efektu szkła, brak gradientów ozdobnych
  (jedyny gradient to funkcjonalne przyciemnienie zdjęcia pod tekstem).
- Struktura z linii 1 px; listy i tabele zaczynają się linią 2 px w kolorze tekstu.
- Numeracja tylko tam, gdzie treść jest sekwencją (kroki współpracy, oś czasu).
- Ikony: własne SVG, jedna kreska 1,5 px, zakończenia proste.

## Logo

Znak „Przepływ”: łuk litery C otwarty w prawo (grubość 8 na siatce 48) i trzy poziome strugi powietrza wychodzące z otworu.
Logotyp CLIMARO: Archivo Expanded 700, odstęp liter +0,06em. Podpis: Archivo 600, wyjustowany do szerokości logotypu.
W nagłówku strony logo bez podpisu (podpis jest nieczytelny poniżej ok. 220 px szerokości).

## Ruch

Zasady wg Emila Kowalskiego:

- Krzywe: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`,
  `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`. Nigdy `ease-in`.
- Jeden zaplanowany moment: wejście hero (wiersze nagłówka wznoszą się co 60–70 ms, potem znaczniki, linie i etykiety).
- Ruch w odpowiedzi na działanie: przenikanie zdjęć w indeksie usług (320 ms, z rozmyciem), kreska aktywnego wiersza (250 ms).
- Przyciski: `scale(0.97)` przy wciśnięciu, 160 ms. Efekty najechania tylko dla `(hover: hover) and (pointer: fine)`.
- Menu mobilne (`<dialog>`): otwarcie 320 ms, zamknięcie 200 ms.
- `prefers-reduced-motion`: zostaje tylko zanikanie przezroczystości, bez przesunięć.

## Elementy przeglądarki

Zaznaczenie tekstu pomarańczowe z czarnym tekstem, kursor tekstowy pomarańczowy, pasek przewijania grafitowy,
fokus 2 px z odstępem 3 px (pomarańczowy na ciemnym, grafitowy na jasnym tle), podkreślenia linków z odsunięciem 0,22–0,3em.

## Responsywność

- < 768 px: hero ma zdjęcie jako pas u góry (pionowy kadr, cała pompa widoczna), tekst niżej na czarnym tle.
- ≥ 1200 px: oznaczenia na zdjęciu hero. Pozycje liczone w jednostkach kontenera (`cqw`/`cqh`) tą samą formułą co kadr `object-fit: cover`.
- < 1200 px: oznaczenia stają się listą cen pod przyciskami.
- ≥ 1100 px: pełna nawigacja; poniżej przycisk „Menu”. ≥ 576 px: przycisk „Bezpłatna wycena” w nagłówku.
- Telefon w nagłówku zawsze: z numerem od 1280 px, poniżej jako przycisk z ikoną (44 px). < 360 px: „Menu” jako sama ikona.
- < 768 px: pasek akcji przyklejony do dołu ekranu (z `env(safe-area-inset-bottom)`).
- Nazwy usług skalują się do kolumny (`container-type: inline-size`, `font-size: min(4.75rem, 12.5cqi)`).
- Testowane szerokości: 320, 360, 375, 390, 768, 1024, 1200, 1280, 1366, 1440, 1920, 2560.
