---
name: Usługi Busem
description: Strona firmowa przeprowadzek i transportu busem w całej Polsce (statyczna strona w strona/)
colors:
  znak: "#1F55E0"
  znak-mocny: "#1745C2"
  znak-gleboki: "#1640B5"
  asfalt: "#111316"
  grafit: "#1B1F24"
  grafit-2: "#272C33"
  lakier: "#F3F4F1"
  bialy: "#FFFFFF"
  tekst: "#15181C"
  tekst-2: "#49515B"
  jasny-2: "#B3BAC3"
  linia: "#D8DBD5"
  linia-ciemna: "rgba(255, 255, 255, .14)"
  blad: "#B42318"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "172px (SVG, skalowane do szerokości kontenera)"
    fontWeight: 800
    lineHeight: 1
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "clamp(2.4rem, 1.6rem + 3.4vw, 4.6rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "clamp(1.45rem, 1.2rem + .9vw, 1.9rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "0.005em"
  price:
    fontFamily: "Barlow Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "clamp(2rem, 1.5rem + 2vw, 3.2rem)"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "tnum"
  plate:
    fontFamily: "Barlow Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.01em"
  body:
    fontFamily: "Barlow, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Barlow, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
rounded:
  focus: "4px"
  sm: "8px"
  md: "10px"
  lg: "12px"
  route: "14px"
  photo: "16px"
  form: "18px"
spacing:
  gut: "clamp(20px, 4vw, 56px)"
  sek: "clamp(84px, 11vw, 168px)"
  max: "1320px"
  top-h: "76px"
components:
  plate:
    backgroundColor: "{colors.znak}"
    textColor: "{colors.bialy}"
    typography: "{typography.plate}"
    rounded: "{rounded.md}"
    padding: "0 26px"
    height: "54px"
  plate-hover:
    backgroundColor: "{colors.znak-mocny}"
  plate-sm:
    backgroundColor: "{colors.znak}"
    textColor: "{colors.bialy}"
    rounded: "{rounded.sm}"
    padding: "0 18px"
    height: "44px"
  plate-lg:
    backgroundColor: "{colors.znak}"
    textColor: "{colors.bialy}"
    rounded: "{rounded.md}"
    padding: "0 34px"
    height: "60px"
  plate-inv:
    backgroundColor: "{colors.bialy}"
    textColor: "{colors.znak-gleboki}"
    typography: "{typography.plate}"
    rounded: "{rounded.md}"
    padding: "0 26px"
    height: "54px"
  route-panel:
    backgroundColor: "{colors.znak}"
    textColor: "{colors.bialy}"
    rounded: "{rounded.route}"
    padding: "22px"
  route-input:
    backgroundColor: "{colors.bialy}"
    textColor: "{colors.tekst}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "52px"
  field-input:
    backgroundColor: "{colors.bialy}"
    textColor: "{colors.tekst}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
    height: "52px"
  quote-form:
    backgroundColor: "{colors.lakier}"
    textColor: "{colors.tekst}"
    rounded: "{rounded.form}"
    padding: "clamp(24px, 3.4vw, 48px)"
  stop-number:
    backgroundColor: "{colors.znak}"
    textColor: "{colors.bialy}"
    rounded: "{rounded.lg}"
    size: "58px"
  city-button:
    textColor: "{colors.bialy}"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
    height: "44px"
  city-button-pressed:
    backgroundColor: "{colors.bialy}"
    textColor: "{colors.znak-gleboki}"
---

<!-- Zakres: ten plik opisuje WYŁĄCZNIE system wizualny strony Usługi Busem w katalogu strona/ (index.html, regulamin.html, assets/css/style.css). Nie dotyczy aplikacji Next.js „noir-coffee”, która leży w pozostałej części repozytorium. -->

# Design System: Usługi Busem

> **Zakres:** system wizualny strony Usługi Busem w `strona/`. Aplikacja Next.js „noir-coffee” w tym samym repozytorium to osobny projekt i nie podlega temu dokumentowi.

## Overview

**Creative North Star: "Trasa"**

Strona jest drogą: zaczyna się na asfalcie (ciemne hero z ogromnym słowem PRZEPROWADZKI i busem wjeżdżającym przed nie), prowadzi przez niebieską tablicę drogową z mapą Polski, a kończy na mecie, czyli ciemnej sekcji kontaktu z telefonem i formularzem. Język wizualny pochodzi z oznakowania drogowego: kondensowany, ciężki krój jak na drogowskazie, niebieski znaku wydawany na całe pola, biała wewnętrzna ramka wokół każdego niebieskiego elementu, przerywana linia środkowa jezdni łącząca sekcje.

Sekcje naprzemiennie siedzą na asfalcie (ciemne) i lakierze (jasne, ciepła biel busa), z jednym pełnym polem w kolorze znaku (obszar działania). Gęstość jest umiarkowana: duże nagłówki, wiersze rozdzielone cienkimi liniami zamiast kart, układ dwukolumnowy 5/7 lub 4/7 na desktopie, jedna kolumna na telefonie. Ruch jest oszczędny: jeden moment wejścia w hero i rysowanie trasy na mapie.

Odrzucony jest kartowy szablon firmy usługowej (siatki kafelków z ikonami) i układ „nagłówek po lewej, zdjęcie po prawej” jako ogólny wzorzec.

**Key Characteristics:**
- Niebieski znaku jako całe pola i tabliczki, nie jako drobne akcenty.
- Tabliczka z białą wewnętrzną ramką (podwójny `inset` box-shadow) jako sygnatura przycisków, panelu trasy i numerów przystanków.
- Przerywana linia drogi (kreska 34px, przerwa 22px) łącząca sekcje i przystanki.
- Treść w wierszach z liniami podziału zamiast kart.
- Ceny i telefony w Barlow Condensed 800 z cyframi tabelarycznymi.

## Colors

Paleta drogi nocą: asfalt i grafit, jeden nasycony niebieski znaku drogowego i biel lakieru busa.

### Primary
- **Niebieski znaku** (`znak`): całe pola (sekcja obszaru działania, panel trasy w hero), tabliczki akcji, numery przystanków, słowo PRZEPROWADZKI, pierścień fokusu, zaznaczenie tekstu, kursor. Biały tekst na nim ma kontrast ok. 6:1.
- **Mocny znak** (`znak-mocny`): stan hover tabliczek.
- **Głęboki znak** (`znak-gleboki`): niebieski na jasnym tle tam, gdzie musi nieść tekst: ceny w usługach i cenniku, linki „Wyceń…”, tekst tabliczki odwróconej, wybrane miasto na liście.

### Neutral
- **Asfalt** (`asfalt`): tło hero, przebiegu, kontaktu, otwartego menu mobilnego i paska telefonu; także `theme-color`.
- **Grafit** (`grafit`): podkład pod zdjęciami, zanim się wczytają.
- **Grafit 2** (`grafit-2`): tylko kolor paska przewijania.
- **Lakier** (`lakier`): domyślne jasne tło strony (o nas, usługi, cennik, regulamin) i tło formularza wyceny na asfalcie.
- **Biały** (`bialy`): tekst na ciemnym i niebieskim, tło pól formularza, sekcje opinii, realizacji i pytań, wewnętrzna ramka tabliczek (z kryciem .92).
- **Tekst** (`tekst`): podstawowy tekst na jasnym tle; górna kreska 2px nad zobowiązaniami i opiniami.
- **Tekst 2** (`tekst-2`): opisy, odpowiedzi, notki pod formularzem.
- **Jasny 2** (`jasny-2`): tekst drugorzędny na asfalcie (lead w hero, opisy przystanków, stopka).
- **Linia** (`linia`): linie podziału wierszy usług, cennika i pytań na jasnym tle.
- **Linia ciemna** (`linia-ciemna`): linie podziału na asfalcie (nagłówek, menu, stopka).
- **Błąd** (`blad`): gwiazdka pola wymaganego, komunikaty błędów, ramka pola z `aria-invalid`.

### Named Rules
**The Whole Field Rule.** Niebieski znaku wydaje się na całe powierzchnie: tabliczkę, panel, sekcję. Nie ma niebieskich kresek, obwódek kart ani kolorowanych ikon jako dekoracji akcentowej; na jasnym tle niebieski pojawia się w tekście tylko jako `znak-gleboki`.

**The Cardboard-In-Photos Rule.** Ciepły kartonowy brąz istnieje wyłącznie w fotografiach (kartony, rozładunek). Nie ma go w CSS i nie jest kolorem interfejsu.

## Typography

**Display Font:** Barlow Condensed 700/800 (z Arial Narrow, Roboto Condensed)
**Body Font:** Barlow 400/500/600 (z Segoe UI, Roboto, Arial)

**Character:** Barlow Condensed wywodzi się z oznakowania drogowego i daje tabliczkowy, ciężki głos nagłówkom, cenom i etykietom tras; Barlow w tekście ciągłym jest tej samej rodziny, więc całość brzmi jednym głosem. Fonty są hostowane lokalnie (woff2, podzbiory latin i latin-ext dla polskich znaków).

### Hierarchy
- **Display** (800, SVG `textLength` rozciągnięte na całą szerokość do 1480px): wyłącznie słowo PRZEPROWADZKI w hero (niebieskie wypełnienie) i jego obrysowany odpowiednik w stopce (kontur białym .22).
- **Headline** (800, `clamp(2.4rem, 1.6rem + 3.4vw, 4.6rem)`, 0.98): nagłówki sekcji h2, z `text-wrap: balance` i wąskim `max-width` 10–16ch.
- **Hero h1** (700, `clamp(1.45rem, 1rem + 1.6vw, 2.35rem)`, 1.12): rzeczowa linia SEO nad słowem display, celowo mniejsza od niego.
- **Title** (700, `clamp(1.45rem, 1.2rem + .9vw, 1.9rem)`, 1.08): h3 usług i przystanków; pytania FAQ w tej samej rodzinie, 1.25–1.5rem.
- **Price** (800, do 3.2rem w cenniku, 1.9rem w usługach, cyfry tabelaryczne): ceny w `znak-gleboki`; prefiks „od” jako `small` 0.5em w `tekst-2`.
- **Telefon** (800, `clamp(2.6rem, 1.8rem + 3vw, 4.4rem)` w kontakcie; 700, 1.3rem w nagłówku): numer zawsze w kroju szyldowym z cyframi tabelarycznymi.
- **Body** (400, 1.0625rem, 1.6; 1rem na telefonie): tekst ciągły, szerokość 44–62ch. Wariant powiększony 1.1875–1.375rem, 1.55 do akapitu wprowadzającego.
- **Label** (600, 0.9375rem): etykiety formularza w Barlow; etykiety panelu trasy w Barlow Condensed 700, 1.125rem.

### Named Rules
**The Sign Voice Rule.** Wszystko, co jest „napisem na tablicy” (nagłówki, ceny, telefony, przyciski, nazwy miast, etykiety trasy), idzie w Barlow Condensed 700/800. Zdania do czytania idą w Barlow. Nie ma trzeciego kroju ani wersalikowych mikroetykiet.

**The Tabular Numbers Rule.** Ceny i numery telefonów zawsze z `font-variant-numeric: tabular-nums`.

## Layout

Kontener `.wrap` ma szerokość `min(100% - 2 * gut, max)`; nagłówek, słowo display i stopka sięgają do 1480px. Sekcje mają pionowy rytm `sek`. Na desktopie treść układa się w asymetrycznych dwóch kolumnach (5/7, 4/7, 6/5) z dużą przerwą `clamp(36px, 6vw, 104px)`; lewa kolumna (zdjęcie usług, mapa, dane kontaktu) jest `position: sticky` pod nagłówkiem. Nagłówek jest stały (`top-h` 76px, 68px poniżej 980px), przezroczysty na hero i pełny asfalt (.97) po przewinięciu.

Hero: nagłówek h1, słowo display na całą szerokość, pod nim siatka 5/7 z panelem trasy po lewej i busem po prawej, wychodzącym poza kontener i zachodzącym na słowo (ujemny margines). Na niskich laptopach (min 981px, max-height 840px) hero się kompresuje, by panel trasy zmieścił się w pierwszym widoku.

Punkty łamania: 1180px (telefon w nagłówku zwija się do ikony 44px), 980px (menu pełnoekranowe, jedna kolumna, przystanki pionowo wzdłuż linii, pasek telefonu i wyceny przyklejony u dołu), 600px (formularz i panel trasy w jednej kolumnie, formularz prawie do krawędzi ekranu).

### Named Rules
**The Center Line Rule.** Przejścia między sekcjami asfaltu i znaku zaznacza pionowa przerywana linia środkowa jezdni (4px, kreska 34px, przerwa 22px, biel .55–.7) wychodząca od krawędzi sekcji. Ten sam wzór, poziomo, łączy przystanki przebiegu; na telefonie biegnie pionowo przez numery.

**The Rows Not Cards Rule.** Usługi, cennik, pytania, zobowiązania i opinie to wiersze rozdzielone liniami (1px `linia` lub 2px `tekst` u góry), nie karty z tłem i cieniem. Cennik ma kropkowany wypełniacz między nazwą a ceną jak w taryfie.

## Elevation & Depth

System jest płaski; głębię daje zmiana nawierzchni (asfalt, lakier, pole znaku), a nie cienie. Cienie zewnętrzne pojawiają się tylko pod obiektami, które „stoją” na drodze: tabliczkami, panelem trasy i busem.

### Shadow Vocabulary
- **Ramka tabliczki** (`box-shadow: inset 0 0 0 4px var(--pl), inset 0 0 0 6px rgba(255, 255, 255, .92)`): biała wewnętrzna linia drogowskazu; w panelu trasy 6px/8px, w małej tabliczce 3px/5px.
- **Cień tabliczki** (`0 1px 2px rgba(0, 0, 0, .18), 0 10px 24px -14px rgba(0, 0, 0, .55)`): miękki cień pod tabliczką.
- **Cień panelu trasy** (`0 18px 40px -22px rgba(0, 0, 0, .8)`): panel na asfalcie hero.
- **Cień busa** (`filter: drop-shadow(0 28px 22px rgba(0, 0, 0, .55))` plus radialny cień kontaktowy pod kołami): osadza wycięte zdjęcie na asfalcie.
- **Krawędź nagłówka** (`0 1px 0 var(--linia-ciemna)`): jedyna separacja stałego nagłówka.

### Named Rules
**The Standing Objects Rule.** Cień zewnętrzny dostaje tylko to, co stoi na drodze (tabliczka, panel, bus). Wiersze, sekcje, zdjęcia i formularz są płaskie.

## Shapes

Narożniki są łagodne i rosną z rozmiarem obiektu, jak zaokrąglone rogi tablic drogowych: 8px (małe tabliczki, pola trasy, miniatury, przyciski miast), 10px (tabliczki, pola formularza), 12px (numery przystanków, strefa zdjęć, galeria, notka regulaminu), 14px (panel trasy, formularz na telefonie), 16px (zdjęcie usług), 18px (formularz wyceny). Sekcja obszaru ma wewnętrzną białą ramkę 2px z promieniem `clamp(14px, 2vw, 28px)`, cała sekcja jest więc jedną tablicą. Jedyne koło to przycisk usuwania miniatury. Strefa upuszczania zdjęć ma przerywaną ramkę 1.5px.

## Components

### Tabliczka (przycisk)
Drogowskaz, który da się kliknąć.
- **Shape:** łagodny narożnik (10px; 8px w wersji małej), wysokość 54px (44px mała, 60px duża).
- **Primary:** tło `znak`, biały tekst Barlow Condensed 700, biała wewnętrzna ramka i cień tabliczki.
- **Hover / Focus:** tło przechodzi w `znak-mocny` (.2s); `:active` przesuwa o 1px w dół; fokus to biały kontur 3px z odstępem i asfaltowa obwódka 6px.
- **Odwrócona:** białe tło, tekst `znak-gleboki`, wewnętrzna ramka w kolorze `znak`; używana na niebieskim polu (przycisk „Wyceń trasę”). Hover tło #E9EEFC.
- **Disabled:** krycie .6, kursor `progress` (w trakcie wysyłki).

### Panel trasy
Sygnatura: działająca tablica „Skąd → Dokąd → Wyceń trasę” w hero. Pole `znak` z ramką drogowskazu 14px, dwa białe pola Barlow Condensed 700 1.25rem rozdzielone strzałką SVG, pod nimi odwrócona tabliczka na całą szerokość. Fokus pola: podwójny pierścień (3px znak, 6px biały). Wpisana trasa rysuje się linią na mapie i trafia do formularza; tekst tabliczki zmienia się na „Wyceń trasę A – B”.

### Mapa i lista miast
Mapa województw na polu `znak`: regiony białe .06 z obrysem .62, miasta jako białe kropki z halo; wybrane miasto ma kropkę asfaltową z białym obrysem. Trasa to biała linia 4px, przerywana 2/10 z zaokrąglonymi końcami, rysowana animacją .9s. Lista miast obok: przyciski 44px bez tła, hover biel .12, wybrany (`aria-pressed`) to biała tabliczka z tekstem `znak-gleboki`.

### Przystanki
Kwadratowy numer 58px w stylu tabliczki (12px, ramka drogowskazu, asfaltowa obwódka 8px przerywająca linię drogi), pod nim tytuł i opis w `jasny-2`.

### Inputs / Fields
- **Style:** białe tło, obrys 1px #B9BEC6, narożnik 10px, min. wysokość 52px; select z własną strzałką SVG.
- **Hover:** obrys #8A929C.
- **Focus:** obrys `znak` i poświata `0 0 0 3px rgba(31, 85, 224, .22)`.
- **Error:** obrys `blad`, komunikat pod polem w `blad` 0.9375rem/500.
- **Strefa zdjęć:** przerywana ramka 1.5px #9AA1AB, narożnik 12px, ikona aparatu w `znak`; hover i przeciąganie: ramka `znak`, tło #EEF2FD. Miniatury 76px, 8px.
- **Zgoda:** natywny checkbox 26px z `accent-color: znak`.

### Navigation
Stały pasek na asfalcie: logo, linki Barlow 500 1rem biel .86, hover i bieżąca sekcja białe z niebieską kreską 2px rozwijaną od lewej (.3s). Po prawej telefon w kroju szyldowym z ikoną #8DB0FF i mała tabliczka „Wycena”. Poniżej 980px menu pełnoekranowe na asfalcie z linkami Barlow Condensed 700 1.9rem rozdzielonymi liniami, dużym telefonem i tabliczką na całą szerokość. Na telefonie u dołu wysuwa się pasek: obrysowany przycisk telefonu i tabliczka wyceny.

### Wiersze usług i taryfa
Usługa: tytuł i cena w jednym rzędzie, opis i link „Wyceń…” (podkreślenie `znak-gleboki` .35, pełne na hover) pod spodem. Taryfa: nazwa, kropkowany wypełniacz, duża cena; link pod spodem.

### FAQ
Natywne `details` z liniami podziału; pytanie w Barlow Condensed, ikona plusa SVG w `znak` obraca się o 45° po otwarciu.

## Do's and Don'ts

### Do:
- **Do** wydawać `znak` na całe pola i tabliczki z białą wewnętrzną ramką (`inset 0 0 0 4px`, `inset 0 0 0 6px rgba(255, 255, 255, .92)`).
- **Do** łączyć sekcje i kroki przerywaną linią drogi (4px, kreska 34px, przerwa 22px).
- **Do** pisać nagłówki, ceny, telefony i przyciski w Barlow Condensed 700/800, a zdania w Barlow.
- **Do** używać `znak-gleboki` dla niebieskiego tekstu i linków na jasnym tle.
- **Do** utrzymywać cele dotykowe min. 44px i widoczny fokus 3px w `znak` (biały na niebieskim polu).
- **Do** ograniczać ruch do wejścia hero i rysowania trasy, z wyłączeniem przy `prefers-reduced-motion`.
- **Do** układać listy treści jako wiersze z liniami podziału.

### Don't:
- **Don't** budować siatek kart z cieniem i ikoną dla usług, cen czy zalet.
- **Don't** używać niebieskiego jako cienkich akcentów (obwódek kart, kolorowych kresek nad nagłówkami).
- **Don't** dodawać nadtytułów, wersalikowych etykiet nad nagłówkami ani ikon ze znaków tekstowych; ikony są inline SVG z jednego zestawu (obrys 1.8–2.2).
- **Don't** wprowadzać kartonowego brązu do interfejsu; zostaje w zdjęciach.
- **Don't** dawać cieni zewnętrznych wierszom, sekcjom ani zdjęciom; cień mają tylko tabliczki, panel trasy i bus.
- **Don't** pokazywać sekcji opinii i realizacji bez materiałów od właściciela (są ukryte, gdy puste).
