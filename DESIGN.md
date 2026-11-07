---
name: Usługi Busem
description: Strona firmowa przeprowadzek i transportu busem w całej Polsce (statyczna strona w strona/, wersja v6)
colors:
  sage-deep: "#4E6452"
  sage: "#8C9D85"
  sage-soft: "#C9D3C3"
  beige: "#E2D5BF"
  paper: "#F1F2EC"
  paper-2: "#E7E8DF"
  card: "#FBFBF8"
  graphite: "#2A2F2C"
  ink: "#121412"
  muted: "#565C57"
  line: "#D6CEBF"
  field: "#B9B1A2"
  err: "#A32A1E"
  note-paper: "#EFE9DC"
  note-ink: "#17211A"
  note-label: "#3B4C3F"
  on-dark-muted: "#C4C2BA"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(2.4rem, 1.4rem + 3.2vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(2rem, 1.35rem + 2.3vw, 3.35rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.35rem, 1.15rem + .65vw, 1.7rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  title-sm:
    fontFamily: "Bricolage Grotesque, Segoe UI, Arial, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Bricolage Grotesque, Segoe UI, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Bricolage Grotesque, Segoe UI, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
  numeral:
    fontFamily: "Bricolage Grotesque, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(2.6rem, 2rem + 2vw, 3.8rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontFeature: "tnum"
  note-caps:
    fontFamily: "Cinzel, Georgia, serif"
    fontSize: "3.6cqw"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0.16em"
rounded:
  xs: "3px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  full: "50%"
spacing:
  gut: "clamp(20px, 4vw, 48px)"
  sek: "clamp(80px, 10vw, 152px)"
  max: "1280px"
  top-h: "72px"
  gap-sm: "12px"
  gap-md: "22px"
components:
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "52px"
  button-dark-hover:
    backgroundColor: "{colors.sage-deep}"
    textColor: "{colors.paper}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "52px"
  button-line-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "52px"
  button-light-hover:
    backgroundColor: "{colors.sage-soft}"
  button-lg:
    padding: "0 30px"
    height: "58px"
  nav-cta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  input:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
    height: "52px"
  pill:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "44px"
  pill-checked:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  form-card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.lg}"
    padding: "clamp(22px, 3.6vw, 48px)"
  price-note:
    backgroundColor: "{colors.note-paper}"
    textColor: "{colors.note-ink}"
    rounded: "{rounded.xs}"
---

# Design System: Usługi Busem

> **Zakres:** ten dokument opisuje wyłącznie stronę Usługi Busem w katalogu `strona/` (`index.html`, `regulamin.html`, `assets/css/style.css`, `assets/js/main.js`). Nie dotyczy aplikacji Next.js („noir-coffee”) w katalogu głównym repozytorium. Zastępuje w całości poprzedni system v5 (Barlow, asfalt i niebieski znaków drogowych), który został porzucony.
>
> Strona jest demonstracją przygotowaną przez agencję ComputerIT; numer telefonu, e-mail i dane firmy są przykładowe.

## Overview

**Creative North Star: "Ekipa w jasnym mieszkaniu"**

Świat v6 jest prowadzony fotografią: ekipa w strojach roboczych, biały bus z otwartymi drzwiami, zielona kanapa niesiona przez jasny salon. Zdjęcia zajmują dużą, nieprzyciętą powierzchnię (7/12 kolumny w hero i w głównych usługach), a tekst stoi obok nich spokojnie, na złamanej bieli. Paleta jest stonowana i domowa: szałwia, ciepły beż, złamana biel, grafit, czerń. Nie ma tu żadnego krzyku „transportowego”; konkret niosą ceny, numer telefonu i jasny przebieg zlecenia.

Sekcje zmieniają tło pełną szerokością, tworząc rytm materiałów: papier (hero, O nas, Formularz), jaśniejszy szary papier (Usługi), szałwia (Realizacja), czerń (Cennik), beż (Dlaczego my), grafit (Kontakt), czerń (stopka). Jedynym ornamentem w całym świecie jest cennik w formie banknotu: własna ramka gilosz rysowana na kanwie, mikrodruk i rozeta, podpisy kapitalikami Cinzel, kwoty w PLN. To świadomie jedyne miejsce, w którym pojawia się drugi krój i dekoracja.

Gęstość jest umiarkowana: szerokie odstępy między sekcjami (`sek`), gęste, rzeczowe listy z liniami podziału zamiast kart. Ruch jest krótki i miękki (jedna krzywa `cubic-bezier(.16, 1, .3, 1)`), wyłączany przy `prefers-reduced-motion`.

**Key Characteristics:**
- Fotografia w roli głównej, zdjęcia przycięte do stałych proporcji (3/2, 4/5) z zaokrągleniem 4px.
- Jeden krój (Bricolage Grotesque, 400–800) dla całej strony; Cinzel wyłącznie w cenniku-banknocie.
- Pełnoszerokie pasy tła w kolorach palety jako podział sekcji.
- Listy i wartości oddzielone cienkimi liniami (`line`, 1px) lub grafitowymi kreskami 1.5px, bez kart.
- Czarne przyciski główne, które na hover przechodzą w ciemną szałwię.
- Cyfry tabelaryczne we wszystkich cenach i numerach telefonu.

## Colors

Spokojna, ziemista paleta: szałwia jako jedyny akcent, beż i złamana biel jako materiał, grafit i czerń jako tekst i ciemne pasy.

### Primary
- **Ciemna szałwia** (`sage-deep`): kolor akcji i stanu. Hover przycisków czarnych, ceny w usługach, ikony „korzyści”, numery kroków formularza (koło), fokus pól, `accent-color` checkboxów, zaznaczenie tekstu, tusz ramki banknotu na kanwie.
- **Szałwia** (`sage`): tło pasa Realizacja (z czarnym tekstem), podkreślenie linków tekstowych, wypełnienie województw i poświata punktów na mapie kontaktu.
- **Jasna szałwia** (`sage-soft`): wyłącznie hover jasnego przycisku na ciemnym tle.

### Secondary
- **Ciepły beż** (`beige`): tło pasa Dlaczego my, panelu szerokiej usługi i tło zastępcze zdjęć w usługach.

### Neutral
- **Złamana biel** (`paper`): tło główne strony, nagłówka, menu mobilnego i paska połączeń; tekst na ciemnych pasach.
- **Szary papier** (`paper-2`): tło pasa Usługi i tło zastępcze zdjęć.
- **Karta** (`card`): tło karty formularza i ramki „notice” w regulaminie.
- **Grafit** (`graphite`): tło pasa Kontakt, kolor pozycji menu w spoczynku, tekst większych akapitów.
- **Czerń** (`ink`): tekst podstawowy, przyciski główne, tło pasa Cennik i stopki, kreski nad krokami i listą Dlaczego my.
- **Szary tekst** (`muted`): akapity pomocnicze, opisy pod faktami, podpowiedzi.
- **Linia** (`line`): cienkie podziały list, obramowanie nagłówka po przewinięciu, krawędź karty formularza.
- **Obrys pola** (`field`): obramowanie pól, „pigułek” i strefy upuszczania zdjęć.
- **Błąd** (`err`): gwiazdka wymaganego pola, komunikaty błędów, obramowanie pola z błędem.
- **Papier banknotu / tusz banknotu / podpis banknotu** (`note-paper`, `note-ink`, `note-label`): tylko wewnątrz cennika-banknotu.
- **Szary na ciemnym** (`on-dark-muted`): akapity na czarnym pasie Cennika.

### Named Rules
**The One Accent Rule.** Szałwia jest jedynym akcentem. Nie dodawaj niebieskiego, pomarańczowego ani żółtego jako koloru interfejsu; jedyne wyjątki to robocze wyróżnienia w regulaminie (`.fill` żółte, `.verify` szałwiowe), które są znacznikami redakcyjnymi, nie kolorem marki.

**The Band Rule.** Sekcje różnicuje kolor tła na pełną szerokość, nie karty ani cienie. Sąsiednie sekcje nie mają tego samego tła, z wyjątkiem hero i O nas, które są jednym papierem.

## Typography

**Display Font:** Bricolage Grotesque (z Segoe UI, Arial, sans-serif)
**Body Font:** Bricolage Grotesque
**Label/Mono Font:** Cinzel (z Georgia, serif), wyłącznie w cenniku-banknocie

**Character:** Jeden ciepły grotesk o lekko nieregularnym rysunku dźwiga całą stronę, od 800 w cyfrach po 400 w tekście; ciasny tracking nagłówków nadaje mu zwartość. Cinzel z szerokim odstępem liter pojawia się tylko tam, gdzie świat odwołuje się do druku papierów wartościowych.

### Hierarchy
- **Display** (700, clamp do 4.25rem w hero, interlinia .98, -.035em): tylko H1 hero (bazowy H1 ma clamp do 4.75rem; regulamin do 4rem). Szerokość do 15ch, `text-wrap: balance`.
- **Headline** (700, clamp 2–3.35rem, 1.02, -.03em): H2 każdej sekcji, szerokość 12–18ch.
- **Title** (600, clamp 1.35–1.7rem, 1.12): H3 usług i kroków.
- **Title small** (600, 1.15rem, 1.25): H4 usług dodatkowych; wariant 1.25rem w liście Dlaczego my, 1.3rem w legendach formularza.
- **Body** (400, 1.0625rem / 1rem poniżej 600px, 1.65): akapity, długość 38–60ch; większy wariant `.big` 1.125–1.3rem w O nas.
- **Label** (600, .95rem): etykiety pól, menu (500, .98rem), przyciski (600, 1rem).
- **Numeral** (800, clamp 2.6–3.8rem, -.04em, tnum): numery kroków; ta sama rodzina 700 w faktach hero, cenach usług (1.5rem), telefonie kontaktu (do 4.4rem) i stopki (1.6rem).
- **Note caps** (Cinzel 600, wielkości w `cqw`, +.16em, wersaliki): nazwa usługi i liczby narożne na banknocie; kwota na banknocie to Bricolage 800 w 12.5–15cqw.

### Named Rules
**The Single Family Rule.** Cała strona używa Bricolage Grotesque. Cinzel istnieje tylko w obrębie `.note` (i mikrodruku na kanwie); nigdy w nagłówkach, menu ani przyciskach.

**The Tabular Price Rule.** Każda kwota i każdy numer telefonu ma `font-variant-numeric: tabular-nums`.

## Layout

Kontener `max` (1280px) z marginesem `gut`; nagłówek ma szerszy kontener 1360px. Hero wychodzi do krawędzi okna: kolumna tekstu (5fr) wyrównana do linii kontenera przez `--edge`, zdjęcie (7fr) do prawej krawędzi ekranu, wysokość do `100svh - top-h`, maks. 860px. Pionowy rytm sekcji to `sek`.

Układ opiera się na asymetrycznych podziałach 12-kolumnowych: 5/7 (hero, O nas, szeroka usługa), 7/5 (główna usługa, nagłówek sekcji; wariant `flip` odwraca), 4/8 (Cennik, Formularz; lewa kolumna jest `sticky` pod nagłówkiem), 6/6 (Kontakt). Usługi łączą trzy rytmy: duży obraz z tekstem, trójkę kolumn 4/5 oraz szeroki beżowy panel. Kroki to 4 kolumny, Dlaczego my 3 kolumny.

Responsywność: przy 1100px kroki i Dlaczego my przechodzą na 2 kolumny; przy 980px wszystko schodzi do jednej kolumny, nagłówek ma 64px, menu staje się pełnoekranową listą, zdjęcie hero idzie nad tekst (16/10), zdjęcia 4/5 zmieniają się na 4/3, a na dole pojawia się wysuwany pasek połączeń (telefon + wycena). Przy 600px przyciski akcji rozciągają się na całą szerokość, banknoty układają się w jedną kolumnę, karta formularza wychodzi niemal do krawędzi ekranu.

## Elevation & Depth

System jest płaski. Głębię daje kolejność pasów tła i fotografia, nie cienie. Cień pojawia się tylko w trzech miejscach, zawsze miękki i rozproszony, nigdy twardy.

### Shadow Vocabulary
- **Krawędź nagłówka** (`box-shadow: 0 1px 0 var(--line)`): po przewinięciu strony; analogicznie `0 -1px 0 var(--line)` nad paskiem połączeń.
- **Uniesienie formularza** (`box-shadow: 0 0 0 1px var(--line), 0 24px 50px -36px rgba(30, 36, 30, .45)`): karta formularza na papierze.
- **Banknot na czerni** (`box-shadow: 0 1px 0 rgba(255, 255, 255, .06), 0 18px 34px -24px rgba(0, 0, 0, .9)`): banknoty w cenniku.
- **Obrys jako cień** (`box-shadow: inset 0 0 0 1.5px var(--ink)`): obramowanie przycisków konturowych, bez wpływu na wymiar.

### Named Rules
**The Paper-Flat Rule.** Powierzchnie leżą płasko. Nie dodawaj cieni kartom, zdjęciom ani przyciskom; jedyne uniesione obiekty to karta formularza i banknoty.

## Shapes

Łagodne, drobne zaokrąglenia, które nie zmiękczają fotografii: 3px (`xs`) dla banknotów i małych miniatur, 4px (`sm`) dla wszystkich zdjęć i beżowego panelu, 6px (`md`) dla przycisków, pól, pigułek i strefy zdjęć, 8px (`lg`) tylko dla karty formularza. Koło (`full`) wyłącznie dla numerów w legendach formularza, przycisku usuwania miniatury i ikony potwierdzenia. Podziały to linie 1px (`line`) lub 1.5px czerni nad krokami i punktami Dlaczego my. Strefa upuszczania zdjęć ma przerywaną ramkę 1.5px.

## Components

### Buttons
Czarne, pewne, prostokątne z niewielkim zaokrągleniem.
- **Shape:** zaokrąglenie 6px (`md`), wysokość 52px, wariant duży 58px.
- **Primary (ciemny):** czerń z tekstem w złamanej bieli; hover przechodzi w ciemną szałwię.
- **Konturowy:** przezroczysty z obrysem 1.5px czerni; hover wypełnia się czernią.
- **Jasny (na ciemnych pasach):** złamana biel z czarnym tekstem; hover w jasną szałwię.
- **Ghost (na grafitowym pasie):** obrys 1.5px półprzezroczystej bieli, na hover pełny obrys.
- **Stany:** `:active` przesuwa o 1px w dół; fokus to obrys 2px czerni z odsunięciem 3px (biały na ciemnych pasach); `disabled` przy wysyłce ma przezroczystość .6.
- **Link tekstowy:** pogrubiony, podkreślenie 1.5px w szałwii, na hover w czerni.

### Chips (pigułki wyboru usługi)
- **Style:** białe tło, obrys `field` 1px, 6px, min. 44px wysokości.
- **State:** hover zmienia obrys na czerń; zaznaczona pigułka jest czarna z białym tekstem.

### Cards / Containers
- **Karta formularza:** tło `card`, 8px, cień „uniesienie formularza”, padding clamp 22–48px. To jedyna karta w świecie.
- **Szeroka usługa:** beżowy panel 4px bez cienia, zdjęcie 4/5 wewnątrz.
- **Listy wartości i usług dodatkowych:** wiersze rozdzielone liniami 1px zamiast kart.

### Inputs / Fields
- **Style:** białe tło, obrys 1px `field`, 6px, wysokość 52px, padding 12px 14px; select z własną strzałką SVG.
- **Focus:** obrys w ciemnej szałwii plus poświata `0 0 0 3px rgba(78, 100, 82, .25)`; hover obrysu `#8E8778`.
- **Error:** obrys w kolorze `err`, komunikat pod polem .92rem.
- **Legendy:** numer kroku w kole 30px (ciemna szałwia, biała cyfra) przed tytułem grupy.

### Navigation
- **Desktop:** nagłówek sticky 72px na papierze; logo grafitowe po lewej, menu O nas / Usługi / Cennik / Formularz po prawej (500, grafit), Kontakt jako czarny przycisk 44px. Hover i bieżąca pozycja: kreska 1.5px rozwijana od lewej.
- **Mobile (≤980px):** przycisk menu 48px; pełnoekranowa lista na papierze, pozycje 1.6rem / 600 z liniami podziału; pod listą przycisk wyceny i duży numer telefonu. Do tego dolny pasek połączeń wysuwany po przewinięciu.

### Cennik-banknot (komponent sygnaturowy)
Banknot w proporcji 2.25/1, papier `note-paper`, zaokrąglenie 3px. Ramka rysowana na kanwie przez `main.js` tuszem `#4E6452`: pięć przesuniętych w fazie sinusoid gilosza na każdej krawędzi, podwójna wewnętrzna ramka, mikrodruk Cinzel „USŁUGI BUSEM · PRZEPROWADZKI · TRANSPORT BUSEM” i rozeta po prawej (pomijana przy wycenie indywidualnej). Treść skaluje się w jednostkach kontenera (`cqw`): nazwa usługi Cinzel w wersalikach, kwota Bricolage 800 z „od” i „zł” w mniejszym stopniu, drobny opis, liczby narożne Cinzel. Główny banknot (przeprowadzka) zajmuje pełną szerokość, dwa mniejsze stoją obok siebie. Kanwa jest przerysowywana po załadowaniu fontów i przy zmianie rozmiaru.

### Mapa zasięgu
SVG 16 województw na grafitowym pasie: województwa w półprzezroczystej szałwii z jasnym obrysem, punkty miast w bieli z poświatą szałwii, podpisy Bricolage 600 z obrysem `paint-order: stroke` w grafit.

## Do's and Don'ts

### Do:
- **Do** prowadź każdą nową sekcję zdjęciem ekipy, busa lub mebli w stałej proporcji (3/2, 4/5, 4/3 na mobile) z zaokrągleniem 4px.
- **Do** dziel sekcje pełnoszerokim kolorem tła z palety (`paper`, `paper-2`, `sage`, `beige`, `graphite`, `ink`).
- **Do** używaj czarnego przycisku z hoverem w ciemnej szałwii jako jedynej głównej akcji w danym miejscu.
- **Do** zapisuj ceny jako „od 150 zł” / PLN brutto, cyframi tabelarycznymi.
- **Do** rysuj ramki banknotów własnym giloszem na kanwie, w tuszu ciemnej szałwii.
- **Do** utrzymuj cele dotykowe min. 44px i fokus 2px czerni z odsunięciem.

### Don't:
- **Don't** wracaj do świata v5: Barlow, asfalt, niebieski znaków drogowych.
- **Don't** używaj Cinzel ani ornamentu gilosz poza cennikiem.
- **Don't** naśladuj prawdziwych banknotów (wizerunki, godła, nominały i układ NBP); banknot jest własną formą cennika.
- **Don't** zamieniaj list z liniami podziału na siatki kart z cieniem.
- **Don't** stosuj twardych cieni z przesunięciem ani nowych akcentów kolorystycznych.
