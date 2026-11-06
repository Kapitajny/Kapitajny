# Raport z przebudowy strony Usługi Busem

Stan na 2026-11-06. Nowa strona: folder `strona/`. Poprzednia wersja zostaje w `materialy/strona-uslugi-busem.html`
(commit `6341679`) jako kopia zapasowa. Szczegółowy audyt i analiza konkurencji: `materialy/audyt-i-analiza.md`.

## 1. Największe problemy poprzedniej strony

1. HERO jak z szablonu, bez jednego mocnego punktu i bez dowodów zaufania. Na telefonie miało ok. 1250 px.
2. Ceny, najmocniejszy prawdziwy argument, schowane w trzech identycznych kartach cennika.
3. Dziesięć usług jako dziesięć identycznych wierszy akordeonu.
4. Warstwy gór powtórzone trzy razy, szałwia z granatem dawała brudny ton.
5. Sekcje wyglądające na niedokończone: szare „szkielety” opinii, ramka „miejsce na historię firmy”.
6. Zdjęcie z napisem „BUS SERVICES” przy marce „Usługi Busem”.
7. Brak sekcji „Jak działamy” i brak prawdziwej wysyłki formularza.

## 2. Wnioski ze stron referencyjnych

Strony: yourmove.com.pl, przeprowadzkiwarszawa.net (ALFA), adexim.pl.

- Żadna nie pokazuje cen na stronie głównej. U nas ceny są w HERO.
- ALFA trzyma telefon w nagłówku. Przejęliśmy to razem ze stałym paskiem na telefonie.
- YourMove ma najlepszy formularz (piętro, winda, elastyczny termin, zdjęcia). Przejęliśmy te pytania.
- Adexim buduje zaufanie faktami (lata, OC, referencje). Tych danych nie mamy, więc zaufanie budują
  przejrzyste ceny, jasny proces, prawdziwe zdjęcie busa z logo i komplet danych firmy po uzupełnieniu.
- Wszystkie trzy mają ściany tekstu SEO, zdjęcia stockowe, a YourMove nawet dane z szablonu
  w sekcji kontaktowej. Tego unikamy.

## 3. Koncepcja wizualna

**Kolory**

| Rola | Kolor | Uzasadnienie |
|---|---|---|
| Granat marki | `#133F63` | Kolor logo i oklejenia busa. Klient widzi na stronie ten sam bus, który podjedzie pod dom |
| Głęboki granat | `#0C2A44` | Ciemne sekcje, stopka, tekst na przyciskach |
| Karton | `#DDA56B` | Kolor kartonu przeprowadzkowego. Główny przycisk „Bezpłatna wycena”. Cieplejszy i spokojniejszy niż pomarańcz czy żółć konkurencji |
| Papier etykiety | `#F3E7D7` | Tło etykiety z cenami |
| Mgła | `#E8EEF3` | Tła naprzemiennych sekcji, z koloru gór na oklejeniu busa |
| Tekst | `#17222D` / `#4A5765` | Główny i pomocniczy |

Kontrast tekstu: granat na bieli 10,9:1, tekst pomocniczy na mgle 6,3:1, granatowy tekst na kartonie 6,8:1.
Wszystko spełnia WCAG AA. Szałwia z poprzedniej wersji została usunięta, bo kłóciła się z granatem i kartonem.

**Typografia:** Archivo z osią szerokości. Nagłówki poszerzone (112%) i grube, jak napisy na samochodach
dostawczych: czytelne z daleka i stabilne. Tekst w normalnej szerokości. Jedna rodzina, różne szerokości,
więc całość jest spójna. Font przycięty do polskich znaków (53 KB zamiast 176 KB), ładowany z własnego serwera.

**Skala:** nagłówek HERO 40–74 px, H2 32–50 px, H3 21–26 px, tekst 17 px. Odstępy w skali 4 px
(4, 8, 12, 16, 24, 32, 48, 64, 96).

**Znak rozpoznawczy:** etykieta przeprowadzkowa z cenami (papier kraft z granatowym paskiem) w HERO
i w cenniku oraz linia trasy z pinezkami w „Jak działamy” i na mapie. Góry z logo zostały tylko w stopce.

**Zasady:** narożniki 2–4 px zamiast mocnych zaokrągleń, bez cieni na kartach, bez gradientów,
ikony liniowe 1,6 px tylko przy usługach, zdjęcia wyłącznie z materiałów firmy.

## 4. Zmiany w projekcie

- Nowy folder `strona/`: `index.html`, `polityka-prywatnosci.html`, `wycena.php`, style, skrypty,
  zdjęcia WebP w dwóch rozmiarach, logo SVG, favicon, `robots.txt`, `README.md` z instrukcją wdrożenia.
- Wszystkie dane firmy w jednym pliku `assets/js/config.js`.
- `materialy/audyt-i-analiza.md`, `materialy/raport-przebudowy.md`, zrzuty ekranu w `materialy/zrzuty/`.

## 5. Wykorzystane skille i narzędzia

| Narzędzie | Do czego |
|---|---|
| Skill `frontend-design:frontend-design` (plugin Frontend Design od Anthropic) | Kierunek wizualny, typografia, kompozycja |
| agent-browser 0.41.2 (vercel-labs, z npm) | Odczyt pełnej treści trzech stron referencyjnych |
| Playwright + Chromium | Zrzuty stron referencyjnych i nowej strony, testy funkcjonalne |
| Lighthouse 12.6.1 | Wydajność, dostępność (axe-core), dobre praktyki, SEO |
| PHP 8.3 (lokalny serwer) | Test prawdziwej wysyłki formularza z przechwyceniem e-maila |
| fontTools | Przycięcie fontu do polskich znaków |
| Dane GUGiK (PRG) | Granice województw na mapie |

Skille WordPress są zainstalowane w repozytorium, ale w tym etapie nie były potrzebne: strona jest
statyczna i gotowa do przeniesienia do motywu.

## 6. Wyniki testów

| Test | Wynik |
|---|---|
| Lighthouse, komputer | Wydajność 100, dostępność 100, dobre praktyki 100, SEO 100 (LCP 0,8 s, CLS 0) |
| Lighthouse, telefon (symulowane wolne 4G) | Wydajność 96, dostępność 100, dobre praktyki 100, SEO 100 (LCP 2,9 s, CLS 0) |
| Szerokości 390, 768, 1024, 1440 px | Brak przewijania w bok, brak błędów w konsoli, brak błędów 404 |
| Kotwice w menu i przyciskach | Wszystkie prowadzą do istniejących sekcji |
| Klawiatura | Link „Przejdź do treści”, lista województw, FAQ i formularz obsługiwane z klawiatury |

## 7. Funkcjonalności, które rzeczywiście działają

- Formularz wyceny: walidacja w przeglądarce i na serwerze, komunikaty błędów przy polach,
  zdjęcia (do 6, każde do 8 MB, łącznie 20 MB) z podglądem i usuwaniem, zgoda RODO,
  ochrona przed botami (ukryte pole, minimalny czas wypełnienia), sprawdzanie typu pliku na serwerze,
  wysyłka e-maila z załącznikami i adresem zwrotnym klienta. Przetestowane lokalnie: e-mail powstał poprawnie.
- Przyciski „Zapytaj o wycenę” przy usługach wybierają usługę w formularzu.
- Mapa: wybór województwa, rysowanie trasy między miastami wojewódzkimi, przeniesienie trasy do formularza.
- Opinie: wyświetlą się automatycznie po wpisaniu prawdziwych opinii w `config.js`.
- Menu na telefonie (zamykanie klawiszem Esc), stały pasek „Zadzwoń / Wycena”.

## 8. Wymaga Twoich danych lub konfiguracji

- Numer telefonu i e-mail (`config.js`). Do tego czasu przyciski „Zadzwoń” prowadzą do sekcji Kontakt.
- Adres odbiorcy i nadawcy formularza (`wycena.php`).
- Nazwa firmy, NIP, adres (stopka, klauzula RODO, polityka prywatności).
- Link do wizytówki Google i prawdziwe opinie.
- Zdjęcia w większej rozdzielczości (min. 2400 px szerokości) i najlepiej zdjęcie Waszej ekipy.
- Docelowa domena (adresy w danych strukturalnych i mapie strony).
