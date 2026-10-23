# REHABILITIS – design system „Zakres ruchu”

Tokeny są zdefiniowane w `src/app/globals.css` (blok `@theme`, Tailwind 4) i dostępne jako klasy
(`bg-mint`, `text-h2`, `py-section`, `rounded-photo` …). W komponentach nie używamy kolorów ani
rozmiarów wpisanych na sztywno.

## Kierunek

Strona lokalnego gabinetu, a nie szablon: stały jasnozielony panel nawigacji po lewej (na telefonie pasek
z przyciskiem „Menu”), duże zwężone nagłówki, zdjęcia z łagodnie zaokrąglonymi rogami, przyciski w kształcie
pigułki. Treść ułożona w listy, cennik z kropkami prowadzącymi do ceny i jasnozielone panele tylko tam,
gdzie coś trzeba wyróżnić. Jedyny motyw graficzny to **łuk zakresu ruchu** (skala goniometru 0–180°,
`RangeArc`) przy krokach pierwszej wizyty – rosnący kąt pokazuje kolejność kroków.

## Kolory

| Token | Wartość | Zastosowanie |
| --- | --- | --- |
| `brand` | `#176B4D` | przyciski główne, linki, aktywne elementy (kolor z logo) |
| `brand-deep` | `#0C3D2B` | nagłówki, pasek wersji roboczej, wyróżniona cena pierwszej wizyty |
| `mint` | `#EEF4F0` | panel nawigacji, panele informacyjne, tło zdjęć przed wczytaniem |
| `mint-strong` | `#DCEBE2` | linie w panelach, nieaktywna część łuku, oznaczenie „do uzupełnienia” |
| `paper` | `#FBFAF6` | tło strony (ciepła biel) |
| `ink` | `#24292A` | tekst (grafit) |
| `muted` | `#5B635F` | tekst pomocniczy |
| `line` | `#E0E4DE` | linie podziału |
| `danger` / `success` | `#A3352A` / `#1F6B47` | błędy i potwierdzenia formularza |

Kontrast (WCAG 2.1 AA): `brand` 6,2:1 i `muted` 5,9:1 na tle `paper`; biały na `brand` 6,5:1, na `brand-deep`
12:1. Obramowanie pól formularza i nieaktywnych pigułek (`#8E978F`) ma 3:1 na białym.
Białe sekcje (`bg-white`) przeplatają się z tłem `paper`, żeby oddzielić duże bloki bez ramek i cieni.

## Typografia

Jedna rodzina: **Instrument Sans** (Google Fonts przez `next/font`, oś szerokości `wdth`). Nagłówki h1–h3
są zwężone (`font-stretch: 78%`, grubość 600, kolor `brand-deep`), tekst ma normalną szerokość.

| Token | Rozmiar | Zastosowanie |
| --- | --- | --- |
| `text-display` | 48–104 px (płynnie) | hero strony głównej, nagłówki „Usługi”, „Cennik”, 404 |
| `text-h2` | 36–60 px | nagłówki sekcji, H1 podstron z dłuższym tytułem |
| `text-h3` | 24–30 px | nazwy usług w cenniku, kroki wizyty, panele |
| `text-h4` | 20 px | pytania FAQ, podtytuły w opisie usług |
| `text-lead` | 22 px | wprowadzenia |
| `text-body` | 18 px | tekst podstawowy (domyślny) |
| `text-small` | 16 px | etykiety, nawigacja, listy pomocnicze |
| `text-caption` | 14 px | podpisy zdjęć, dopiski „cena przykładowa” |

Klasy pomocnicze: `.type-condensed` – krój nagłówka dla elementów, które nie są nagłówkami (ceny, nazwy
w listach definicji); `.type-plain` – nagłówek w kroju tekstu (pytania FAQ, nagłówki w stopce).
Bez kursywy, bez wersalików w etykietach, bez wyróżniania pojedynczych słów kolorem.

## Odstępy i siatka

- Skala Tailwind (4 px). Odstęp sekcji: `py-section` (72–136 px, płynnie).
- Kontener: `.content` – maks. 74rem, margines boczny 20 / 40 / 56 px (telefon / tablet / desktop).
- Od 1024 px: siatka `--spacing-rail` (16,5rem panelu nawigacji) + treść. Panel jest przyklejony (`sticky`).
- Pasek mobilny: `h-bar` (68 px), uwzględniony w `scroll-padding-top`; na telefonach dolny pasek
  „Umów wizytę” jest uwzględniony w `scroll-padding-bottom`.
- Każda podstrona ma własny układ nagłówka: duży tytuł z wprowadzeniem obok (Usługi, Cennik),
  tytuł ze zdaniem o sposobie pracy i zdjęciem (O gabinecie), przyklejona kolumna z tytułem (FAQ),
  formularz na białym arkuszu (Kontakt).

## Komponenty

**Przyciski** (`.btn`, pigułka, min. 52 px): `btn-primary` (jedno główne działanie w widoku), `btn-quiet`
(działanie poboczne, obrys), `btn-sm` (min. 44 px). Stany: hover, focus (obrys 3 px), active (przesunięcie 1 px),
disabled (`opacity: .55`).

**Linki tekstowe** (`.link`): pogrubione, podkreślone. Bez strzałek.

**Formularze** (`.field-label`, `.field-input`, `.field-error`): promień `rounded-field` (12 px), etykieta nad
polem, błąd pod polem powiązany przez `aria-describedby`, pole z błędem ma obramowanie 2 px `danger`.

**Zdjęcia** (`.photo` + `Photo`): promień `rounded-photo` (20 px), proporcje nadaje kontener, kadr ustawia
`position` w `src/config/images.ts`. Bez tekstu na zdjęciach; podpis „Zdjęcie poglądowe” (`PhotoCaption`).
Miniatury w linkach mają pusty alt. Pliki zdjęć i logo nie są zmieniane – tylko kadr i rozmiar w CSS.

**Pigułki wyboru** (zakładki „Z czym możesz przyjść?”, radio w formularzu): aktywna – tło `brand`,
nieaktywna – biała z obrysem `#8E978F`.

**Panele** (`rounded-photo bg-mint`): tylko dla treści, którą trzeba wyróżnić (fakty o pierwszej wizycie,
opis wybranej okolicy ciała, zasady cennika, dane gabinetu, zakończenie strony „Umów pierwszą wizytę”).
Bez cieni i gradientów.

**Cennik** (`.leader`): nazwa, kropki prowadzące, cena; pod spodem opis i czas.

**Ikony**: tylko funkcjonalne (telefon, menu, zamknij, rozwiń, ostrzeżenie), zawsze obok tekstu.

## Ruch

Jedna sekwencja bez udziału użytkownika: dwa mniejsze zdjęcia w hero pojawiają się po kolei (`.mosaic-in`);
duże zdjęcie jest widoczne od razu. Poza tym ruch tylko w odpowiedzi na działanie: rozwijanie FAQ, zmiana
zakładki, menu mobilne. `prefers-reduced-motion` wyłącza animacje i przejścia.
