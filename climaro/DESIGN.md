# CLIMARO – system wizualny

Kierunek: **Industrial Engineering**, wariant „Architektura z adnotacjami” (połączenie koncepcji A i C).

## Teza

Jedyny mocny element strony to hero: prawdziwe zdjęcie nowoczesnego domu z pompą ciepła, na którym cienkie linie
– jak opisy na rysunku technicznym – wskazują miejsca pracy instalacji i podają cenę montażu. Reszta strony jest
spokojna i zdyscyplinowana: siatka, rytm ciemnych i jasnych sekcji, cienkie linie, ceny w kolumnach.

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
- Pomarańczowego nie używamy jako koloru tekstu na jasnym tle (2,6:1).
- Ciemne lub jasne tło wynika z sytuacji użycia: ciemne do prezentacji (hero, nawigacja, stopka), jasne do czytania cen i formularzy.
- Motywy sekcji: klasy `.theme-dark`, `.theme-graphite`, `.theme-light` ustawiają `--bg`, `--fg`, `--muted`, `--line`, `--focus`, `--error`.

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
- Przyciski: `scale(0.97)` przy wciśnięciu, 160 ms. Efekty najechania tylko dla `(hover: hover) and (pointer: fine)`.
- Menu mobilne (`<dialog>`): otwarcie 320 ms, zamknięcie 200 ms.
- `prefers-reduced-motion`: zostaje tylko zanikanie przezroczystości, bez przesunięć.

## Elementy przeglądarki

Zaznaczenie tekstu pomarańczowe z czarnym tekstem, kursor tekstowy pomarańczowy, pasek przewijania grafitowy,
fokus 2 px z odstępem 3 px (pomarańczowy na ciemnym, grafitowy na jasnym tle), podkreślenia linków z odsunięciem 0,22–0,3em.

## Responsywność

- ≥ 1200 px: oznaczenia na zdjęciu hero. Pozycje liczone w jednostkach kontenera (`cqw`/`cqh`) tą samą formułą co kadr `object-fit: cover`.
- < 1200 px: oznaczenia stają się listą cen pod przyciskami.
- ≥ 1100 px: pełna nawigacja; poniżej przycisk „Menu”. ≥ 576 px: przycisk „Bezpłatna wycena” w nagłówku.
- Testowane szerokości: 375, 768, 1024, 1200, 1440.
