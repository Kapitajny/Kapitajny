# FORMA ATELIER — research i koncepcja artystyczna

Dokument wewnętrzny zespołu projektowego (ComputerIT). Opisuje, z czego wyszliśmy, co świadomie przejęliśmy z
poziomu najlepszych pracowni i czego unikaliśmy.

## 1. Research — stan faktyczny

Brief zakładał analizę czterech stron: normcph.com (Norm Architects), studio-mcgee.com, studioysg.com i alwill.com.au.

**Żadna z tych stron nie była dostępna ze środowiska, w którym powstał projekt.** Polityka sieci sesji blokowała
połączenia z tymi domenami (błąd DNS / odmowa proxy). Przeglądarka Playwright działała tylko lokalnie. Próbowaliśmy też
źródeł alternatywnych (galerie inspiracji, artykuły branżowe), ale one również były zablokowane. Wyszukiwarka zwracała
same tytuły wyników, bez opisu wyglądu stron.

Dlatego **nie twierdzimy, że przeanalizowaliśmy te strony wizualnie**. Poniższe obserwacje to wiedza ogólna o języku
wizualnym tych pracowni i ich realizacji (publikacje prasowe, np. Dezeen o YSG, materiały o Norm Architects). Nie była
weryfikowana na żywych stronach i należy ją traktować jako hipotezę do sprawdzenia:

| Pracownia | Co jest wartościowe (hipoteza) | Czego nie powielamy |
| --- | --- | --- |
| Norm Architects | skandynawska powściągliwość, dużo pustej przestrzeni, fotografia w naturalnym świetle, stonowana paleta | rozbudowanej, wielopoziomowej nawigacji (architektura / design / kreatywne) — FORMA ma jedną usługę |
| Studio McGee | ciepło i „domowość” wnętrz, czytelna oferta, silna marka lifestyle'owa | elementów sklepu i treści e-commerce — rozpraszają przekaz pracowni premium |
| YSG | odwaga materiałowa i kolorystyczna, rzeźbiarskie formy, mocna narracja projektów | intensywnych kolorów — brief FORMY wymaga spokoju i bieli łamanej |
| Alwill | redakcyjny sposób opowiadania o projektach, wnętrza „z charakterem” | — (do weryfikacji po odblokowaniu strony) |

**Rekomendacja:** po dodaniu domen do dozwolonych w ustawieniach sieci środowiska warto powtórzyć analizę
(Playwright: zrzuty desktop/mobile, nagrania przewijania, inspekcja typografii) i skonfrontować ją z tym dokumentem.

## 2. Pomysł: magazyn architektoniczny w ruchu

Strona ma działać jak numer magazynu o architekturze, który otwiera się filmem. Najpierw nastrój (film, światło,
materiał), potem rozmowa (filozofia), dalej rozkładówki (realizacje), a na końcu konkret (oferta, proces, kontakt).

**Jedna odważna rzecz:** pełnoekranowy, autorski film z wnętrza. Wszystko wokół jest ciche i zdyscyplinowane.

## 3. System wizualny

### Kolor (z briefu)
| Token | Hex | Rola |
| --- | --- | --- |
| paper | `#F7F5F0` | tło stron |
| beige | `#E9E4DB` | sekcje oferty, procesu, nawigacja „następna realizacja” |
| graphite | `#292720` | tekst, sekcje ciemne, stopka, menu |
| olive | `#777765` | akcenty: numeracja etapów, znaczniki list, hover |
| sand | `#B8A995` | akcenty na grafitowym tle |
| stone* | `#5C5A50` | tekst drugorzędny na jasnym tle (kontrast 6.4:1, WCAG AA) |
| mist* | `#D7D0C4` | tekst drugorzędny na grafitowym tle |

\* tokeny pomocnicze dodane ze względu na dostępność — oliwka na off-white ma za niski kontrast dla małego tekstu.

### Typografia
- **Cormorant Garamond 400/500** — nagłówki, cytaty, liczby etapów. Duże stopnie, ciasna interlinia (1.02–1.18),
  bez kursywnych „akcentów” w środku zdań.
- **Manrope** — tekst, menu, przyciski, metadane. 16 px / 1.75, kolor stone.
- Skala oparta na klasycznych stopniach: 13 · 16 · 21 · 28 · 36 · 48 · 64 · 92 px (płynnie przez `clamp`).
- Wersaliki tylko tam, gdzie wymaga ich brief (hero: „ARCHITEKTURA WNĘTRZ | WARSZAWA”, „ODKRYJ NASZE REALIZACJE”,
  „SCROLL TO EXPLORE”) oraz w logotypie.

### Motyw łuku
Sygnet to łuk: najprostszy element architektury, powracający w realizacjach (Sandstone House). Używamy go oszczędnie:
logo, zdjęcie w sekcji „O pracowni” przycięte łukiem, znaczniki wartości.

### Siatka i rytm
12 kolumn, maks. 1472 px, marginesy `clamp(20px, 4vw, 56px)`, odstęp sekcji `clamp(96px, 12vw, 176px)`.
Treść wyrównana do lewej. Wyśrodkowane są tylko hero i CTA, czyli dwie „okładki”.

## 4. Układ (szkic)

```
HERO 100svh  ─ film, overlay, wyśrodkowany claim, na dole: opis | scroll | kontakt + pauza
INTRO        ─ zdanie-manifest przesunięte o 1 kolumnę
O PRACOWNI   ─ [zdjęcie w łuku 5 kol.]   [nagłówek, tekst, zasady, przycisk]
REALIZACJE   ─ [8 kol. 3:2][4 kol. 4:5 ↓] / [5 kol. 4:5][6 kol. 3:2 ↓] / [12 kol. 21:9] / [notka][7 kol. 16:10]
OFERTA       ─ [lepki opis 4 kol.] [akordeon 8 kol.]          (tło beżowe)
PROCES       ─ oś pozioma z linią wypełnianą przewijaniem (pionowa na telefonie)
DLACZEGO     ─ wartości schodkowo, jak kolejne stopnie        (tło grafitowe) + zdjęcie próbek
OPINIE       ─ jedna duża opinia naraz, sterowanie strzałkami, wyraźnie oznaczone jako przykładowe
CTA          ─ pełnoekranowe zdjęcie o zmierzchu, wyśrodkowany nagłówek
STOPKA       ─ grafit, logo, menu, dane, Instagram, polityka prywatności
```

## 5. Ruch
- Jedno zaaranżowane wejście: logo → claim → linia → przycisk (hero).
- Zdjęcia odsłaniane „kurtyną” od dołu z oddechem skali 1.12 → 1, przy niektórych subtelna paralaksa.
- Menu: kurtyna z góry, staggered linki, podgląd zdjęcia zmieniany przy najechaniu.
- Przejścia stron: React `<ViewTransition>` (przenikanie + przesunięcie 12–18 px). Okładka realizacji „przelatuje”
  z siatki do hero podstrony (shared element).
- Wszystko respektuje `prefers-reduced-motion` (film nie startuje, animacje pozycji wyłączone).

## 6. Rewizja planu (self-check)
- Paleta kremowa z szeryfem to dziś częsty szablon. Tu wynika jednak wprost z briefu, więc ją zachowujemy.
  Odróżniamy się kompozycją (asymetria, schodki, łuk), filmem i fotografią, a nie kolorem.
- Zrezygnowaliśmy z etykiet wersalikami nad każdym nagłówkiem, kropek w metadanych i strzałek „→” w przyciskach.
- Numeracja 01–05 tylko w procesie, bo to faktyczna sekwencja.
- Karty realizacji nie są identyczne: każda ma inną skalę, proporcję i pozycję w siatce.
