# RYGIEL — plan projektu

Demonstracyjny serwis firmy IT i cyberbezpieczeństwa, przygotowany przez ComputerIT jako realizacja portfolio.
Dokument opisuje decyzje produktowe, projektowe i techniczne oraz kryteria ukończenia poszczególnych etapów.

---

## 0. Audyt repozytorium (stan wyjściowy)

**Co już istnieje.** Repozytorium `Kapitajny` zawiera działający serwis kawiarni NOIR COFFEE (Next.js 16.4, React 19.3,
TypeScript, Tailwind 4, Stripe, SQLite, Vitest) wraz ze zdjęciami dostarczonymi przez właściciela i skryptami
uruchomieniowymi dla Windows/macOS.

**Decyzja.** Serwis kawiarni jest kompletny i nie ma związku z nową marką, więc go nie usuwamy ani nie modyfikujemy.
Nowy serwis powstaje jako samodzielna aplikacja w katalogu `rygiel/` z własnym `package.json`. Z istniejącego projektu
przejmujemy sprawdzone wzorce: wersje Next.js/React, konfigurację ESLint (flat config), ustawienia TypeScript, Vitest,
nagłówki bezpieczeństwa w `next.config.ts` oraz konwencję oznaczania danych „do uzupełnienia”.

**Co wymaga stworzenia.** Cały serwis: system projektowy, 11 typów stron (ok. 25 adresów URL), treści po polsku,
formularz z backendem, filtry, akordeony, SEO, dokumenty, testy jednostkowe i E2E, README.

**Wybrane technologie.**

| Obszar | Wybór | Uzasadnienie |
| --- | --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack), React 19.3 | Statyczne generowanie stron + Server Actions dla formularza; ta sama wersja co w repozytorium. |
| Język | TypeScript (strict) | Typowane treści (usługi, realizacje, artykuły) wychwytują błędy w linkach i strukturze. |
| Style | CSS Modules + zmienne CSS (bez Tailwinda) | Autorski system wizualny, zero dodatkowych zależności, pełna kontrola specyficzności. |
| Fonty | `next/font/google` — Archivo (zmienna szerokość 62–125 i grubość) | Jedna rodzina w trzech szerokościach; fonty serwowane z własnej domeny (CSP `font-src 'self'`). |
| Grafika | Inline SVG pisane ręcznie | Diagramy są treścią, skalują się bez strat, nie wymagają zdjęć stockowych. |
| Animacje | CSS (stroke-dashoffset, transitions) | Bez bibliotek; `prefers-reduced-motion` wyłącza ruch. |
| Formularz | Server Action + `useActionState`, własna walidacja współdzielona klient/serwer | Brak potrzeby Zod przy 7 polach; wbudowana ochrona CSRF Server Actions (porównanie Origin/Host). |
| Wysyłka | Resend REST API (`fetch`) lub dowolny webhook — opcjonalnie | Bez SDK; bez konfiguracji formularz działa w jawnym trybie demonstracyjnym. |
| Testy | Vitest (logika), Playwright + axe-core (E2E, dostępność) | Chromium jest dostępny w środowisku; axe automatyzuje część kontroli WCAG. |

**Główne ryzyka techniczne.**

1. *CSP a statyczne strony.* Nonce wymaga renderowania dynamicznego każdej strony. Wybieramy statyczny CSP z
   `script-src 'self' 'unsafe-inline'` (rekomendacja dokumentacji Next.js dla stron bez nonce). Ryzyko XSS ogranicza
   brak `dangerouslySetInnerHTML` dla treści użytkownika i brak skryptów zewnętrznych. Kompromis opisany w README.
2. *Limitowanie żądań w pamięci* działa per instancja serwera. Na platformach serverless jest tylko pierwszą linią
   obrony — README opisuje zamianę na magazyn współdzielony (np. Redis/KV).
3. *Ilość treści.* Serwis wymaga dużo tekstu merytorycznego; treści trzymamy w typowanych modułach, nie w komponentach.
4. *Interaktywny diagram w hero* musi być czytelny na telefonie i przy wyłączonym JS — wersja bazowa renderuje się na
   serwerze, a interakcja jest warstwą dodatkową.

**Kontrola jakości.** `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`
(nawigacja, menu mobilne, formularz, filtry, akordeony, 404, axe), zrzuty ekranu w Chromium dla 375/768/1440 px,
pomiar Lighthouse na buildzie produkcyjnym.

---

## 1. Koncepcja produktu

**Marka:** **Rygiel** — obsługa IT i cyberbezpieczeństwo dla firm.

*Rygiel* ma w polszczyźnie dwa znaczenia i oba pracują na markę:

- zasuwa zamka — zamknięcie, kontrola dostępu, bezpieczeństwo;
- w budownictwie: poziomy element nośny konstrukcji szkieletowej — usztywnia całą ramę i przenosi obciążenia.

To dokładnie obietnica firmy: utrzymać konstrukcję IT w pionie i zamknąć ją przed niepowołanym dostępem. Nazwa jest
krótka, polska, łatwa do wymówienia i nie przypomina nazw znanych firm technologicznych. **Nie sprawdzaliśmy
dostępności domeny ani znaku towarowego** — przed użyciem komercyjnym wymaga to weryfikacji.

**Kierunek artystyczny „Engineered Confidence”.** Język rysunku technicznego: przekroje, linie wymiarowe, kreskowanie,
tabliczki rysunkowe i protokoły odbioru. Firma pokazuje swoją pracę tak, jak inżynier pokazuje projekt — z rysunkiem,
zakresem i kryteriami odbioru. Wygląd wynika z materii branży (dokumentacja, schematy), a nie z ozdobników „cyber”
(brak neonów, kłódek, kodu binarnego, ludzi w kapturach).

**Główne zadanie strony:** przekonać właściciela firmy i osobę odpowiedzialną za IT, że to zespół, który działa
metodycznie i jawnie — i doprowadzić do zapytania przez formularz konsultacji.

## 2. Profil klienta

| Persona | Kim jest | Czego szuka | Co go przekona |
| --- | --- | --- | --- |
| Właściciel / zarząd MŚP (10–150 osób) | Biuro rachunkowe, kancelaria, firma usługowa, sklep internetowy | Spokoju: działa poczta, dane są bezpieczne, jest kogo zapytać | Jasny zakres, przewidywalna współpraca, język bez żargonu |
| Osoba odpowiedzialna za IT | Jednoosobowy dział IT albo „ktoś, kto się zna” | Wsparcia, drugiej pary oczu, audytu, standardów | Konkret techniczny: metodyka, hardening, kopie 3-2-1, procedury |
| Firma przetwarzająca dane klientów | E-commerce, gabinety, HR | Ograniczenia ryzyka incydentu i wymagań RODO | Analiza ryzyka, zarządzanie dostępami, odtwarzanie danych |

## 3. Architektura informacji

```
/                                   Strona główna
/uslugi                             Przegląd trzech filarów + usługi dodatkowe
  /uslugi/obsluga-it                IT Managed Services
  /uslugi/cyberbezpieczenstwo       Cybersecurity
  /uslugi/chmura-i-infrastruktura   Cloud & Infrastructure
/realizacje                         Realizacje demonstracyjne + filtry
  /realizacje/[slug]                4 studia przypadku (statyczne parametry)
/o-nas                              Model działania, zasady, komunikacja
/kontakt                            Formularz zapytania
/baza-wiedzy                        Indeks artykułów + filtr kategorii
  /baza-wiedzy/[slug]               5 artykułów
/polityka-prywatnosci               Dokument roboczy
/polityka-cookies                   Dokument roboczy
/regulamin                          Regulamin serwisu i formularza (świadczenie usługi drogą elektroniczną)
404                                 not-found
sitemap.xml, robots.txt, opengraph-image, icon.svg
```

Nawigacja główna: Usługi, Realizacje, Baza wiedzy, O nas + CTA „Umów konsultację” (→ `/kontakt`).
Stopka: wszystkie usługi, strony serwisu, dokumenty, kontakt, informacja o charakterze demonstracyjnym.

## 4. System projektowy

### Kolory

| Token | Wartość | Rola |
| --- | --- | --- |
| `--c-graphite` | `#16181C` | Główne tło — bardzo ciemny grafit o chłodnym odcieniu |
| `--c-graphite-2` | `#1E2126` | Podniesione powierzchnie, pola formularzy |
| `--c-graphite-3` | `#272A30` | Oddzielenie sekcji, hover |
| `--c-line` | `#3A3E46` | Linie rysunku, obramowania |
| `--c-paper` | `#EEEBE3` | Tekst główny (złamana biel), 14,9:1 na tle |
| `--c-paper-2` | `#A3A7AE` | Tekst pomocniczy, 7,4:1 |
| `--c-paper-3` | `#878C94` | Metadane (tylko na tle głównym, ≥ 4,5:1) |
| `--c-cobalt` | `#3050FF` | Akcent: płaszczyzny, przyciski główne, aktywne warstwy rysunku |
| `--c-cobalt-ink` | `#9AACFF` | Akcent jako tekst/linia na ciemnym tle (8,2:1), pierścień fokusu |

**Dlaczego kobalt, a nie limonka.** Limonka na czerni to estetyka terminala i „hakerska” — kojarzy się z ofensywą i
grami, a nie z dojrzałym partnerem B2B. Kobalt odwołuje się do błękitu planów technicznych (cyjanotypii), więc
spina się z językiem rysunku technicznego. Jako płaska powierzchnia niesie jasny tekst z kontrastem 4,7:1 (AA), a
w jaśniejszym odcieniu `#9AACFF` działa jako tekst i fokus. Kobalt pojawia się oszczędnie: przycisk główny, aktywne
elementy rysunków, jedna pełna płaszczyzna na stronie (wyróżniona realizacja / CTA). Bez gradientów i poświat.

### Typografia

Jedna rodzina — **Archivo** (zmienna oś szerokości `wdth` 62–125) — w trzech rolach:

- **Nagłówki ekspozycyjne:** `wdth 118–125`, `wght 650–760`, ciasny interlinia 0,98–1,05, lekki ujemny tracking.
- **Treść:** `wdth 100`, `wght 400`, 17–18 px, interlinia 1,6, długość wiersza ≤ 68 znaków.
- **Etykiety techniczne i metadane:** `wdth 72–78` (wąski krój), `wght 500`, cyfry tabelaryczne, zapis zdaniowy
  (bez wersalików i rozstrzelenia).

Fragmenty konfiguracji w artykułach (rekordy DNS) — systemowy krój o stałej szerokości, bez ładowania kolejnej rodziny.

Skala (płynna, `clamp`): 13 / 15 / 17 / 20 / 25 / 32 / 44 / 60 / 84 px. Duży kontrast wielkości tylko w hero,
w nagłówku wyróżnionej realizacji i w końcowym CTA; pozostałe sekcje mają nagłówki 32–44 px.

### Przestrzeń, siatka, kształt

- Odstępy: skala 4 px (`--s-1` … `--s-12`: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160).
- Kontener: `--w-max` 1320 px, marginesy boczne `clamp(16px, 4vw, 48px)`; tekst czytelniczy `--w-prose` 68ch.
- Siatka 12 kolumn na desktopie, 6 na tablecie, 4 na telefonie; układy asymetryczne (5/7, 4/8, 3/9).
- Promienie: `--r-control` 3 px (przyciski, pola), `--r-panel` 6 px (panele), 0 dla płaszczyzn i rysunków.
- Bez cieni pod kartami; separacja przez linię 1 px i zmianę tonu tła. Jedyny cień: menu mobilne.

### Komponenty bazowe

`LinkButton`/`Button` (primary — kobalt, secondary — obrys, ghost — tekstowy), `Field` (input/select/textarea z
etykietą, opisem, błędem), `Checkbox`, `Accordion`, `FilterGroup` (przyciski `aria-pressed`), `TitleBlock`
(tabliczka rysunkowa), `SpecTable`, `Breadcrumbs`, `PageHeader`, `Pending` (znacznik danych do uzupełnienia),
`Prose` (typografia artykułów), `Section`.

Stany: hover (zmiana tła/podkreślenia), `:focus-visible` (pierścień 2 px `--c-cobalt-ink` z odstępem 3 px),
active (przesunięcie 1 px), disabled (40% krycia + `cursor: not-allowed`), błąd (obrys + ikona + tekst, nie tylko kolor).

### Motywy graficzne (strategiczne miejsca)

1. **Przekrój infrastruktury** (hero): rysunek warstw firmy — ludzie i konta, urządzenia i poczta, sieć i serwery,
   dane i kopie — z kreskowaniem i liniami wymiarowymi. Przełącznik trzech filarów podświetla warstwy, za które
   odpowiada dany filar. Jedyny „głośny” moment ruchu: rysowanie linii przy wejściu na stronę.
2. **Tabliczka rysunkowa:** metryczka realizacji (obszar, branża, rewizja, status „projekt demonstracyjny”) —
   uczciwe oznaczenie demonstracyjności wpisane w język marki.
3. **Schematy przepływu danych:** diagramy architektury w realizacjach i na stronie chmury (kopie 3-2-1,
   replikacja) z kontrolowaną animacją przepływu (wyłączaną przy `prefers-reduced-motion`).
4. **Protokół odbioru:** tabela „rezultat — jak to sprawdzisz” zamiast wymyślonych liczb.

### Zasady kompozycji (czego unikamy)

- Brak identycznych kart w siatce: usługi jako tabela specyfikacji, proces jako oś, realizacje jako tabliczki,
  artykuły jako spis treści dokumentacji.
- Numeracja tylko tam, gdzie treść jest sekwencją (proces współpracy, etapy audytu, kroki procedur).
- Brak etykiet wersalikami nad każdym nagłówkiem, brak strzałek doklejanych do każdego linku.
- Akcent w nagłówku nie wyróżnia pojedynczego słowa kolorem.

## 5. Architektura komponentów i katalogów

```
rygiel/
  src/app/                       trasy (page.tsx, layout.tsx, metadata, sitemap, robots, not-found)
    kontakt/actions.ts           Server Action formularza
  src/components/
    layout/                      SiteHeader, MobileNav, SiteFooter, Logo, SkipLink
    ui/                          LinkButton, Accordion, TitleBlock, PageHeader, Breadcrumbs, Pending, Prose ...
    diagrams/                    InfrastructureSection (hero), BackupFlow, CaseDiagram ...
    home/                        sekcje strony głównej
    services/                    układy podstron usług
    cases/                       CaseFilter, CaseIndex
    knowledge/                   ArticleBody, ArticleIndex
    contact/                     ContactForm
  src/content/                   typowane treści: site, services, cases, articles, faq
  src/lib/
    contact/schema.ts            walidacja (wspólna klient/serwer)
    contact/spam.ts              honeypot, pułapka czasowa
    contact/rate-limit.ts        limit żądań w pamięci
    contact/delivery.ts          wysyłka (server-only): Resend / webhook / tryb demo
    seo.ts                       pomocnicze metadane
  tests/                         Vitest (logika i spójność treści)
  e2e/                           Playwright
```

Treści oddzielone od prezentacji; strony są cienkie i składają sekcje.

## 6. Plan funkcjonalności

| Funkcja | Zachowanie | Weryfikacja |
| --- | --- | --- |
| Nawigacja | Aktywna pozycja (`aria-current`), skip link, fokus widoczny | E2E: każdy link prowadzi do 200 |
| Menu mobilne | Przycisk z `aria-expanded`, zamykanie Esc / kliknięciem linku / zmianą trasy, blokada przewijania, fokus wraca do przycisku | E2E |
| Diagram hero | Przełącznik filarów (`aria-pressed`), opis w regionie `aria-live`, link do filaru; bez JS widać pełny rysunek | E2E |
| Formularz | Walidacja klienta (na blur + submit) i serwera, komunikaty przy polach + podsumowanie, stan ładowania, honeypot, pułapka czasowa, limit żądań, limit rozmiaru, tryb demonstracyjny z jasnym komunikatem | Vitest + E2E |
| Filtry realizacji | Dwa wymiary (obszar, branża), licznik wyników w `aria-live`, stan pustych wyników z resetem | Vitest (logika) + E2E |
| Baza wiedzy | Filtr kategorii, spis treści artykułu, poprzedni/następny, powiązane artykuły | E2E |
| FAQ | Akordeon: przycisk w nagłówku, `aria-expanded`/`aria-controls`, Enter/Spacja; treść w DOM (SEO) | E2E |
| 404 | Własna strona z linkami powrotnymi | E2E |

Bez logowania, panelu ani płatności — model biznesowy ich nie wymaga.

## 7. Responsywność i dostępność

Punkty kontrolne: 360, 390, 768, 1024, 1280, 1440, 1920 px.

- Hero: na telefonie uproszczony przekrój (mniej opisów, pionowy układ przełącznika), nagłówek przed rysunkiem.
- Tabele specyfikacji i protokół odbioru przechodzą w listy definicji poniżej 768 px.
- Oś procesu: pozioma od 1024 px, pionowa poniżej.
- Obszary klikalne ≥ 44×44 px (WCAG 2.5.8 wymaga 24 px — przyjmujemy wyższy próg).
- Brak przewijania w poziomie (test E2E sprawdza `scrollWidth`).

Cel WCAG 2.2 AA: semantyczne nagłówki (jedno H1), landmarki, etykiety pól, błędy powiązane `aria-describedby`,
`aria-invalid`, kontrast zweryfikowany obliczeniowo, fokus nieprzysłaniany przez przyklejony nagłówek
(`scroll-padding-top`), praca przy powiększeniu 200% i 400% (reflow), `prefers-reduced-motion`. Pełnej zgodności
nie deklarujemy — automaty (axe) i testy ręczne klawiaturą nie zastępują audytu z czytnikami ekranu.

## 8. Plan SEO

- Unikalne `title` (szablon `%s — Rygiel`) i `description` na każdej stronie, kanoniczne adresy (`alternates.canonical`).
- Open Graph + obraz OG generowany przy buildzie (`opengraph-image.tsx`), favicon SVG.
- `sitemap.xml` z wszystkimi trasami (w tym dynamicznymi), `robots.txt`; indeksowanie sterowane
  `NEXT_PUBLIC_ALLOW_INDEXING` (domyślnie wyłączone, bo dokumenty i dane kontaktowe są robocze).
- Dane strukturalne tylko zgodne z treścią: `Organization` (nazwa, adres URL, logo — bez adresu, telefonu, ocen),
  `Article` dla artykułów, `BreadcrumbList` na podstronach zagnieżdżonych.
- Przyjazne URL-e po polsku bez znaków diakrytycznych, linki wewnętrzne między artykułami, usługami i realizacjami.

## 9. Bezpieczeństwo i prywatność

- Nagłówki: CSP, HSTS (produkcja), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `frame-ancestors 'none'` + `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy`.
- Formularz: walidacja i normalizacja po stronie serwera (długości, typy, lista dozwolonych wartości), usuwanie znaków
  sterujących, escapowanie HTML w treści e-maila, limit rozmiaru żądania Server Actions, limit żądań per IP, honeypot,
  pułapka czasowa, ochrona CSRF Server Actions.
- Sekrety tylko po stronie serwera (`server-only`), `.env*` w `.gitignore`, `.env.example` bez wartości.
- Logi bez danych osobowych (tylko kod błędu i typ zdarzenia).
- Brak cookies analitycznych i marketingowych, brak skryptów zewnętrznych — baner zgody nie jest potrzebny;
  polityka cookies to opisuje i wskazuje, co zmienić po dodaniu analityki.

## 10. Plan testowania

1. Statyczne: ESLint, `tsc --noEmit`.
2. Jednostkowe (Vitest): walidacja formularza, spam, limit żądań, escapowanie, logika filtrów, spójność treści
   (unikalne slugi, poprawne linki wewnętrzne w artykułach i realizacjach, brak pustych sekcji).
3. Build produkcyjny.
4. E2E (Playwright, Chromium): wszystkie trasy (200, jeden H1, tytuł, brak błędów konsoli, brak przewijania w
   poziomie na 375 px), menu mobilne, akordeon, formularz (błędy, sukces w trybie demo, honeypot), filtry
   (wyniki i stan pusty), 404, axe-core (WCAG 2.2 A/AA) na kluczowych stronach.
5. Wizualne: zrzuty ekranu 375/768/1440 px stron: główna, usługa, realizacje, realizacja, kontakt, menu mobilne,
   stopka — przegląd i poprawki.
6. Lighthouse (build produkcyjny, Chromium headless).

## 11. Kryteria ukończenia etapów

| Faza | Ukończona, gdy |
| --- | --- |
| 1. Audyt i plan | Ten dokument istnieje; zależności zainstalowane |
| 2. System wizualny | Tokeny, fonty, komponenty bazowe, nagłówek, stopka i hero działają; lint i typecheck czyste |
| 3. Struktura | Wszystkie trasy istnieją i budują się; brak linków do `#` bez funkcji |
| 4. Funkcje | Formularz, filtry, FAQ, menu mobilne przechodzą testy E2E |
| 5. Design | Przegląd zrzutów ekranu na 3 szerokościach bez nachodzenia, ucięć i przewijania w poziomie |
| 6. SEO / a11y / security | Metadane na każdej stronie, sitemap/robots, axe bez naruszeń, nagłówki bezpieczeństwa aktywne |
| 7. QA | Lint, typecheck, Vitest, build i E2E zielone; README kompletne |

---

## 12. Stan realizacji i wyniki kontroli (22.10.2026)

Wszystkie fazy 1–7 zrealizowane. Wyniki na buildzie produkcyjnym:

| Kontrola | Wynik |
| --- | --- |
| ESLint, `tsc --noEmit` | bez błędów i ostrzeżeń |
| Vitest | 45/45 testów |
| `next build` | 27 tras wygenerowanych statycznie |
| Playwright (Chromium, desktop 1440 px i Pixel 7) | 88/88 testów, w tym axe-core WCAG 2.2 A/AA na 12 stronach |
| Lighthouse (mobile) | Performance 91–95, Accessibility 100, Best Practices 100, SEO 100 przy włączonym indeksowaniu |
| Przegląd wizualny | 375/390, 768, 1280/1440, 1920 px – strona główna, usługi, realizacje, artykuł, kontakt, menu mobilne, stopka, 404 |

Problemy wykryte w trakcie QA i naprawione:

- przewijanie w poziomie na telefonie (długie słowo „Cyberbezpieczeństwo” w szerokim kroju, tabela odpowiedzialności),
- znacznik czasu formularza resetowany przy ponownym renderowaniu (pole ukryte → `useRef`),
- brak `og:image` na podstronach (nadpisanie `openGraph` przez metadane strony),
- kontrast etykiet na płaszczyźnie kobaltowej (4,3:1 → 4,7:1),
- jednoliterowe spójniki na końcach wierszy (typografia polska – `typeset` i niełamliwe spacje),
- treść artykułów trafiająca do JavaScriptu klienta (wydzielenie `content/taxonomy.ts`, odchudzone propsy),
- animacja przepływu na schematach ograniczona do < 5 s (WCAG 2.2.2).

Świadome ograniczenia: CSP z `'unsafe-inline'` dla skryptów (strony statyczne), limit żądań formularza w pamięci jednej
instancji, formularz wymaga JavaScriptu, dokumenty prawne i dane firmy jako wersje robocze – szczegóły w README.

### Aktualizacja: grafika i przegląd dostępności

- Dodana grafika właściciela (`src/assets/ochrona-sieci.jpg`, 662×463 px) – przez `next/image` (AVIF/WebP, rozmycie
  przy ładowaniu), w ramce arkusza z podpisem, w dwóch miejscach dopasowanych do jej rozdzielczości.
- Przegląd projektu: ujednolicony kształt filtrów (ostre narożniki jak pozostałe kontrolki).
- Audyt dostępności: wykryte przewijanie w poziomie przy 320 px na 8 stronach (WCAG 1.4.10) – poprawione mniejszym
  minimalnym rozmiarem nagłówków, węższym krojem na bardzo wąskich ekranach i miękkim dzieleniem „cyber-bezpieczeństwo”.
  Nowy test E2E pilnuje tego na wszystkich trasach.

### Rewizja wizualna: mniej „konceptu”, więcej rzeczowości

Po uwadze, że strona wygląda na wygenerowaną, usunęliśmy elementy, które razem dawały ten efekt:

- **Typografia:** nagłówki w normalnej szerokości kroju (szeroki krój został tylko w logo), mniejsza skala
  i grubość 600. Miękkie dzielenie długich słów działa wyłącznie na ekranach węższych niż 480 px.
- **Hero:** rzeczowy nagłówek („Obsługa IT i cyberbezpieczeństwo dla małych i średnich firm”), grafika właściciela
  zamiast diagramu, trzy konkretne punkty pod przyciskami. Interaktywny przekrój infrastruktury przeniesiony na stronę
  „Usługi” i uspokojony (bez siatki, linijki i kreskowania, aktywna warstwa oznaczona paskiem akcentu).
- **Ozdobniki:** bez podpisów „Rys. N.”, „§”, kolorowych etykiet nad nagłówkami, siatki na schematach i pełnej
  kobaltowej płaszczyzny. Kobalt jest używany wyłącznie na przyciskach głównych i aktywnych elementach.
- **Teksty:** nagłówki wprost, bez konstrukcji „nie X, lecz Y”, pytań retorycznych i dwukropków z „puentą”.
- **Układ sekcji:** nagłówek i wstęp jeden pod drugim zamiast powtarzanego wzorca „tytuł obok opisu”.
