# RIFT Studio – plan projektowy i techniczny

Dokument powstał **przed implementacją** i jest źródłem decyzji dla kodu. Zmiany w projekcie zaczynamy od tego pliku.

## 1. Koncepcja kreatywna

**Nazwa:** RIFT Studio – „Studio rapu i hip-hopu”, Pruszków, od 2013 r.
Nazwa pochodzi z logo dostarczonego przez właściciela. *Rift* to szczelina, rozdarcie: moment, w którym głos
przecina ciszę. Z tego bierze się główny motyw marki.

**Idea przewodnia: „Sygnał i ziarno”.** Strona prowadzi przez tor sygnału studia: od czystego, cyfrowego sygnału
(Hero, Usługi, Realizacje, Cennik, Rezerwacja) do surowego ziarna kultury ulicznej (O nas). Te dwa światy łączy
**szczelina**, czyli pozioma linia fali, która rozcina typografię i interfejsy. Pojawia się w logo, w Hero
(rozcięty nagłówek), w separatorach i w stopce.

**Jedna rzecz do zapamiętania:** nagłówek Hero „Przetnij ciszę.” rozcięty na dwie połówki żywą falą dźwiękową,
która reaguje na kursor. Reszta strony jest spokojna i zdyscyplinowana.

## 2. Architektura strony

```
/            (PL, domyślny)   /en            (EN)
├─ #start        Hero – FUTURISTIC AUDIO
├─ #brzmienia    Wybór brzmienia – 6 kierunków (presety)
├─ #o-nas        O nas – UNDERGROUND CULTURE
├─ #uslugi       Usługi – DIGITAL AUDIO INTERFACE
├─ #realizacje   Realizacje – DIGITAL SHOWCASE + odtwarzacz
├─ #cennik       Cennik – FUTURISTIC PRICING
├─ #rezerwacja   Kontakt i rezerwacja – FUTURISTIC CONTACT + BOOKING
├─ #faq          FAQ
└─ stopka        DIGITAL INTERFACE (panel rack 19")

/rezerwacja/[token]   zarządzanie rezerwacją (anulowanie, zmiana terminu) – link z e-maila
/admin                panel studia (logowanie hasłem)
/polityka-prywatnosci /polityka-cookies /regulamin /regulamin-rezerwacji  (+ wersje EN)
```

Identyfikatory sekcji (kotwice) są wspólne dla obu języków (`#rezerwacja` itd.), dzięki czemu przełącznik PL/EN
zachowuje pozycję na stronie.

## 3. System projektowy

### Kolor (tokeny w `src/styles/tokens.css`)

| Token | Hex | Rola |
|---|---|---|
| `--void` | `#030407` | tło bazowe: głęboka czerń |
| `--graphite` | `#14171C` | powierzchnie, panele interfejsu |
| `--graphite-2` | `#1F232A` | obramowania, rowki, tory faderów |
| `--signal` | `#3BE8FF` | cyjan: sygnał, aktywność, fokus |
| `--volt` | `#3D6BFF` | elektryczny błękit: CTA, cennik |
| `--ultra` | `#8A63FF` | subtelny fiolet: poświata, gradienty fal |
| `--paper` | `#ECEAE4` | biel „ksero” w sekcji Underground |
| `--stamp` | `#E3261C` | czerwień pieczątki: akcenty Underground |
| `--text` / `--muted` | `#E9EDF3` / `#8C95A5` | tekst / tekst drugorzędny (kontrast ≥ 4.5:1 na `--void`) |

Każda sekcja dostaje własną „temperaturę” kolorystyczną, a wspólne pozostają czerń, typografia i linia szczeliny.

### Typografia

Jedna rodzina, dwa głosy: **Archivo** (zmienna: grubość 100–900, szerokość 62–125, pełne polskie znaki).

- **Głos sygnału** (szerokość 125, grubość 500–800): geometryczne, rozciągnięte nagłówki Hero, Usług, Cennika.
- **Głos ulicy** (szerokość 62, grubość 900): ściśnięte, plakatowe nagłówki w sekcji O nas i na okładkach.
- Tekst: Archivo, szerokość 100, 400/500, 17 px / 1.6, maks. ~65 znaków w linii.
- Parametry techniczne: Archivo z cyframi tabelarycznymi (`font-variant-numeric: tabular-nums`). Bez
  osobnego kroju monospace, bo jedna rodzina utrzymuje spójność.

Skala (klasyczna, wg *The Elements of Typographic Style*): 12 · 14 · 17 · 21 · 26 · 34 · 46 · 64 · 96 · 144 px
(zmienne `--fs-*`, płynnie skalowane przez `clamp()`).

### Odstępy i kompozycja

- Jednostka bazowa 4 px; skala `--s-1 … --s-10` (4, 8, 12, 16, 24, 32, 48, 64, 96, 144).
- Siatka 12 kolumn, maks. 1320 px, margines boczny `clamp(16px, 4vw, 48px)`.
- Pionowy rytm sekcji `clamp(96px, 12vw, 176px)`; sekcje O nas i Stopka łamią siatkę celowo.
- Wyrównanie do lewej (czytelność), centrowanie tylko w krótkich komunikatach.

### Ikony

Własny zestaw SVG na siatce 24 px, kontur 1.5 px, ścięte zakończenia; kolor `currentColor`. Ikona zawsze ma
etykietę tekstową albo `aria-label`. Żadnych ikon dekoracyjnych przy nagłówkach.

### Fotografia

Niski klucz: ciemne kadry z praktycznym światłem. Hero: duotone cyjan–fiolet (CSS), w sekcji Underground
czerń i biel o wysokim kontraście z ziarnem, w Usługach desaturacja z chłodnym tonem. Zdjęcia: Pexels (licencja
Pexels, użycie komercyjne) oraz zdjęcie studia przekazane przez właściciela. Okładki realizacji są generowane
w SVG, więc nie ma na nich cudzych okładek ani wizerunków artystów.

### Ruch

- Czasy: 120 ms (mikro), 240 ms (UI), 480 ms (wejścia). Krzywa „signal ease” `cubic-bezier(.2,.7,.1,1)`.
- **Jeden** zaaranżowany moment: wejście Hero (fala rysuje się i rozcina nagłówek).
- Pozostały ruch to reakcje na działanie użytkownika: rozwijanie presetu, start odtwarzacza, wybór terminu,
  rozwinięcie FAQ.
- Bez animacji „fade-up” na każdej sekcji.
- `prefers-reduced-motion`: fala statyczna, brak przejść długich, canvas zatrzymany.
- Canvasy pracują tylko wtedy, gdy są widoczne (IntersectionObserver).

## 4. Style sekcji (zgodnie z briefem, bez zmian kierunku)

```
HERO – FUTURISTIC AUDIO
┌──────────────────────────────────────────────────────────────┐
│ [RIFT]  Start Brzmienia O nas Usługi Realizacje Cennik  PL/EN [Zarezerwuj]│
│▔▔▔▔▔▔▔▔▔▔▔▔ oś czasu: znaczniki sekcji + głowica ▔▔▔▔▔▔▔▔▔▔▔▔│
│  PRZETNIJ                                  ░ zdjęcie mikrofonu   │
│ ~~~~~~~~~~~~~~ żywa fala (szczelina) ~~~~~~~~~~ duotone cyjan│
│  CISZĘ.                                                       │
│  Studio nagrań rapu i hip-hopu w Pruszkowie. Od 2013.        │
│  [Zarezerwuj sesję] [Poznaj studio]   ┌ najbliższy wolny termin ┐│
│                                       └ czw 21.11, 14:00 (z API)┘│
└──────────────────────────────────────────────────────────────┘
```

- **Brzmienia** – „przeglądarka presetów”: 6 pionowych pasów (akordeon poziomy). Wybrany pas rozszerza się
  i pokazuje własną estetykę: Futuristic (szeroki krój, cyjan), Underground (ściśnięty, czerwień, ziarno),
  Luxury (cienki, szeroki, szampańskie złoto), Analog (ciepły pomarańcz, taśma), Minimal (jasne tło, dużo
  powietrza), Cinematic (kadr 2.39:1, pasy letterbox). Każdy preset ma tempo, charakter i łańcuch sprzętu,
  przycisk „Posłuchaj demo” (gra w odtwarzaczu Realizacji) oraz „Wybierz to brzmienie”, który wpisuje
  kierunek do formularza rezerwacji. Na telefonie pasy układają się pionowo.
- **O nas** – tylna strona okładki mixtape'u: ściśnięty plakatowy nagłówek, czarno-białe zdjęcia z ziarnem
  i taśmą, czerwona pieczątka „Pruszków 2013”, oś historii 2013 → dziś (prawdziwa sekwencja), lista zasad
  w formie tracklisty kasety (A1–A4, B1–B3 to język kasety, nie dekoracja).
- **Usługi** – cztery moduły w stylu wtyczek DAW. Każdy ma pasek tytułowy z diodą, **własną wizualizację**
  (wokal: fala z obwiednią; produkcja: siatka sekwencera; mix & mastering: krzywa EQ i miernik LUFS;
  podcast: dwie ścieżki dialogu), tabelę parametrów, zakres usługi, „dla kogo” i przyciski
  „Zarezerwuj” (z wybraną usługą) oraz „Zapytaj”.
- **Realizacje** – panel odtwarzacza (spektrum z Web Audio API, play/pause, poprzedni/następny, pasek postępu
  z falą, czas, głośność) i siatka 6 kart z okładkami SVG, typem produkcji, BPM, tonacją i czasem. Wszystkie
  utwory są **demonstracyjne** (syntetyzowane przez skrypt w repozytorium) i tak oznaczone.
- **Cennik** – ciemne tło, błękitne akcenty, moduły z zakresem, czasem, ceną i dopłatami. Jedna karta
  wyróżniona (blok 4 h). Wartości z `src/data/pricing.ts` z flagą `demo`, która wyświetla oznaczenie
  „ceny przykładowe”.
- **Rezerwacja** – interfejs w 4 krokach (usługa i długość → dzień → godzina → dane i zgody) z podsumowaniem
  i szacunkową ceną. Obok: kontakt, adres z oznaczeniem „adres demonstracyjny”, mapa ładowana dopiero po
  zgodzie, media społecznościowe.
- **FAQ** – natywne `<details>`, styl paneli interfejsu.
- **Stopka** – panel rack 19": śruby montażowe, linia sygnału, dioda „ON AIR”, kolumny: nawigacja, usługi,
  kontakt, dokumenty.

### Nawigacja: „Transport bar” z osią czasu

Górny pasek jak transport w DAW. Pod linkami biegnie cienka **oś czasu** ze znacznikami sekcji i głowicą
odtwarzania, która pokazuje postęp przewijania. Aktywna sekcja świeci w menu (`aria-current`). Przycisk
„Zarezerwuj sesję” jest zawsze widoczny. Na telefonie zostają logo, „Rezerwuj” i „Menu”. Menu otwiera pełny
panel z listą sekcji, pułapką fokusu i zamknięciem klawiszem Esc. Pasek ma 64 px i nie zasłania treści
(`scroll-margin-top` na sekcjach).

## 5. Plan techniczny

- **Next.js 16** (App Router, `proxy.ts`), **React 19**, **TypeScript**, CSS Modules i tokeny CSS. Bez
  Tailwinda i bibliotek UI, bo projekt jest w pełni autorski.
- **i18n:** segment `app/[lang]`, słowniki TS (`pl` jest źródłem typu, `en` musi mieć identyczny kształt, co
  sprawdza kompilator i test). `proxy.ts` przepisuje adresy bez prefiksu na `pl` (`/` → PL, `/en` → EN)
  i przekierowuje `/pl/...` na adres bez prefiksu.
- **Rezerwacje:**
  - silnik slotów: czysta funkcja, strefa `Europe/Warsaw`, godziny otwarcia, bufor, wyprzedzenie, horyzont;
  - repozytorium `BookingStore` z dwiema implementacjami:
    - **SQLite** (`node:sqlite`): domyślna lokalnie, transakcja `BEGIN IMMEDIATE` i kontrola nakładania;
    - **Supabase** (Postgres przez REST/RPC, bez SDK): ograniczenie `EXCLUDE USING gist` na zakresie
      `tstzrange` gwarantuje brak podwójnych rezerwacji nawet przy wielu instancjach;
  - token zarządzania: 32 bajty losowe, w bazie tylko hash SHA-256;
  - e-mail: Resend przez `fetch`; bez klucza wiadomości trafiają do logu serwera (tryb deweloperski);
  - panel admina: hasło z ENV, sesja w podpisanym HMAC ciasteczku HttpOnly, potwierdzanie i anulowanie
    rezerwacji, blokady terminów;
  - ochrona: walidacja po stronie serwera, limit żądań, pole-pułapka, nagłówki bezpieczeństwa.
- **SEO:** metadane per język, `hreflang`, canonical, JSON-LD (`LocalBusiness` i `FAQPage`), sitemap,
  robots, obraz OG generowany przez `ImageResponse`.
- **Dostępność (WCAG 2.1 AA):** semantyczne landmarki, link „Przejdź do treści”, widoczny fokus,
  kontrast ≥ 4.5:1, etykiety formularzy i komunikaty błędów powiązane `aria-describedby`, `aria-live`
  dla statusu odtwarzacza i rezerwacji, obsługa klawiatury w kalendarzu i akordeonie.
- **Wydajność:** `next/image` (AVIF/WebP), `next/font`, statyczne renderowanie stron, mało JS po stronie
  klienta (tylko interaktywne wyspy), canvas wstrzymywany poza ekranem.

## 6. Przegląd planu pod kątem generyczności (przed kodowaniem)

| Pierwszy odruch | Dlaczego generyczny | Decyzja |
|---|---|---|
| Hero: wielka liczba „10+ lat” i gradient | domyślny układ każdego landingu | nagłówek rozcięty żywą falą, a jako „dowód” prawdziwy najbliższy wolny termin z API |
| Nagłówki z etykietą CAPS nad każdą sekcją | znak rozpoznawczy szablonu | brak „eyebrow”; sekcje rozpoznaje się po własnym języku wizualnym |
| Font mono do małych etykiet | domyślny wybór „tech” | Archivo z cyframi tabelarycznymi i wąską szerokością |
| 4 identyczne karty usług | „SaaS card kit” | każdy moduł ma inną wizualizację i strukturę parametrów |
| Numeracja 01/02/03 sekcji | dekoracja bez sekwencji | numerujemy tylko prawdziwe sekwencje: kroki rezerwacji, oś historii, tracklista kasety |
| Okładki realnych płyt z materiałów | sugerowałyby współpracę z artystami | okładki generowane w SVG, utwory jawnie demonstracyjne |
| Złoto z logo jako kolor wiodący | kłóci się z briefem Hero (błękit/cyjan/fiolet) | znak RIFT narysowany na nowo w systemie cyjan/fiolet; złoto tylko jako cecha presetu „Luxury” |

## 7. Wykorzystane Skills i narzędzia

| Narzędzie | Do czego |
|---|---|
| Skill `frontend-design` | proces plan → przegląd → budowa → krytyka; zasady typografii, ruchu i treści |
| Skill `design:design-critique` | audyt wizualny sekcji na zrzutach ekranu |
| Skill `design:accessibility-review` | audyt WCAG 2.1 AA |
| Skill `design:ux-copy` | przegląd mikrocopy formularza, błędów i CTA |
| Skill `code-review`, `simplify`, `security-review` | przegląd jakości, uproszczenia i bezpieczeństwa kodu |
| Playwright + Chromium (preinstalowane w środowisku) | zrzuty ekranu desktop/mobile, testy interakcji, błędy konsoli |
| Dokumentacja Next.js z `node_modules/next/dist/docs` | zamiast Context7 (plugin niezainstalowany) |
| Vitest | testy silnika slotów, repozytorium, walidacji i API |
