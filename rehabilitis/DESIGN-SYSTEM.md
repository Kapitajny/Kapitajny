# REHABILITIS – design system

Tokeny są zdefiniowane w `src/app/globals.css` (blok `@theme`, Tailwind 4) i dostępne jako klasy
(`bg-brand`, `text-h2`, `py-section`, `rounded-control` …). W komponentach nie używamy kolorów ani
rozmiarów wpisanych na sztywno.

## Kolory

| Token | Wartość | Zastosowanie |
| --- | --- | --- |
| `brand` | `#176B4D` | przyciski główne, linki, aktywne elementy, akcenty (z logo) |
| `brand-strong` | `#0E3B2C` | nagłówki, stopka, pas „Umów pierwszą wizytę” |
| `brand-soft` | `#E4EFE8` | wyróżnione sekcje (pierwsza wizyta), informacje, zaznaczenia |
| `ivory` | `#FAF7F0` | tło strony |
| `ink` | `#262C29` | tekst |
| `muted` | `#59615D` | tekst pomocniczy |
| `line` | `#D9D4C8` | linie podziału |
| `danger` / `success` | `#A3352A` / `#1F6B47` | błędy i potwierdzenia formularza |

Kontrast (WCAG 2.1 AA): tekst `ink` 13,3:1, `muted` 6,0:1, `brand` 6,1:1 na tle `ivory`; biały na `brand` 6,5:1,
na `brand-strong` 12,5:1. Obramowanie pól formularza (#8F968F) ma 3:1 na białym.

Zasada: zieleń oznacza działanie albo ważną informację. Pełne zielone tło mają tylko pas CTA i stopka.

## Typografia

Jedna rodzina: **Albert Sans** (Google Fonts przez `next/font`, zmienna grubość). Otwarte kształty liter,
klasyczne cyfry (ważne w cenniku), pełne polskie znaki.

| Token | Rozmiar | Zastosowanie |
| --- | --- | --- |
| `text-h1` | 38–68 px (płynnie) | jeden H1 na stronę |
| `text-h2` | 30–44 px | nagłówki sekcji |
| `text-index` | 22–30 px | indeks dolegliwości na stronie głównej |
| `text-h3` | 22 px | nagłówki podsekcji, nazwy usług |
| `text-lead` | 21 px | wprowadzenia |
| `text-body` | 18 px | tekst podstawowy (domyślny) |
| `text-small` | 16 px | etykiety, nawigacja, tabele |
| `text-caption` | 14 px | podpisy zdjęć |

Nagłówki: grubość 650, `letter-spacing: -0.02em`, `text-wrap: balance`. Bez kursywy, bez wersalików,
bez wyróżniania pojedynczych słów kolorem. Długość wiersza tekstu ciągłego: `max-w-prose` (42rem).

## Odstępy i siatka

- Skala Tailwind (4 px). Odstęp między sekcjami: `py-section` (64–120 px, płynnie).
- Kontener: `.page` – maks. 76rem, margines boczny 20 px (telefon) / 32 px (od 768 px).
- Siatka: układy dwukolumnowe o proporcjach dobranych do treści (np. 1 : 2,2 dla indeksu,
  14rem + treść dla podstron z bocznym spisem). Treść wyrównana do lewej; wyśrodkowana tylko strona 404.
- Wysokość nagłówka: `h-header` (72 px), uwzględniona w `scroll-padding-top`.

## Komponenty

**Przyciski** (`.btn`): `btn-primary` (jedno główne działanie w widoku), `btn-outline` (działanie poboczne),
`btn-light` (na ciemnym tle), `btn-sm` (nagłówek). Wysokość min. 48 px (44 px w `btn-sm`), promień 4 px.
Stany: hover (ciemniejsza zieleń / jasne tło), focus (obrys 3 px, biały na ciemnym tle), active (przesunięcie 1 px),
disabled (`opacity: .55`, kursor „not-allowed”).

**Linki tekstowe** (`.link`): pogrubione, podkreślone; hover pogrubia podkreślenie. Bez strzałek w treści.

**Formularze** (`.field-label`, `.field-input`, `.field-error`): etykieta nad polem, podpowiedzi w etykiecie
(„opcjonalnie”), błąd pod polem powiązany przez `aria-describedby`, pole z błędem ma obramowanie 2 px
w kolorze `danger`. Stany: hover, focus (pierścień 3 px), disabled.

**Zdjęcia** (`.media` + `Photo`): proporcje nadaje kontener (3:2, 4:3, 4:5), kadr ustawia `position`
w `src/config/images.ts`. Bez tekstu na zdjęciach; podpis pod zdjęciem (`PhotoCaption`) z informacją
„zdjęcie poglądowe” dla zdjęć, które nie pochodzą z gabinetu. Promień 2 px. Miniatury w linkach mają pusty alt.

**Ikony**: tylko funkcjonalne (telefon, adres, godziny, menu, zamknij, rozwiń), obrys 1,6 px, zawsze obok tekstu.

**Listy i tabele zamiast kart**: usługi na stronie głównej to indeks z linią podziału, cennik to tabele,
zasady pracy to listy definicji. Ramki mają tylko elementy formularza.

## Ruch

Tylko w odpowiedzi na działanie: rozwijanie FAQ, zmiana zakładki, menu mobilne, podkreślenie aktywnej
pozycji nawigacji. Brak animacji przy przewijaniu. `prefers-reduced-motion` wyłącza wszystkie przejścia.
