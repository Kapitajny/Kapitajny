# Audyt poprzedniej strony i analiza konkurencji

Stan na 2026-11-06. Narzędzia: agent-browser 0.41.2 (odczyt treści stron), Playwright + Chromium
(zrzuty 1440 px i iPhone 13, pełne strony).

---

## 1. Audyt poprzedniej wersji (`materialy/strona-uslugi-busem.html`, commit `6341679`)

Ocena krytyczna. Kod działał, ale strona nie spełniała poziomu, jakiego oczekuje klient.

### Największe błędy

| # | Problem | Skutek |
|---|---|---|
| 1 | **HERO jak z szablonu**: tekst po lewej, małe zdjęcie po prawej, pod spodem formularz „Skąd/Dokąd” | Pierwszy ekran nie ma jednego mocnego punktu. Na telefonie HERO ma ok. 1250 px, zanim użytkownik zobaczy cokolwiek poza nim |
| 2 | **Brak elementów zaufania w HERO** | Nic nie mówi „możesz nam powierzyć mieszkanie”. Ceny, najmocniejszy prawdziwy argument, były schowane w cenniku |
| 3 | **Usługi jako 10 identycznych wierszy akordeonu** | Monotonia. Najważniejsza usługa (przeprowadzki) wygląda tak samo jak „opróżnianie piwnic”. Lewa kolumna z krótkim tekstem zostawia dużo pustego miejsca |
| 4 | **Cennik z trzech identycznych kart** | Najbardziej szablonowy fragment strony |
| 5 | **Warstwy gór powtórzone trzy razy** (HERO, mapa, stopka) | Ozdobnik przestał coś znaczyć. Szałwia obok granatu dawała brudny, zielonkawo-szary ton |
| 6 | **Opinie jako szare „szkielety”** | Sekcja wyglądała na niedokończoną |
| 7 | **Ramka „Miejsce na historię firmy”** widoczna w O nas | Niedokończona sekcja na produkcyjnym widoku |
| 8 | **Zdjęcie zespołu z napisem „BUS SERVICES”** | Inna nazwa firmy na stronie „Usługi Busem” podważa wiarygodność |
| 9 | **Brak sekcji „Jak działamy”** | Klient nie wie, co się stanie po wysłaniu zapytania |
| 10 | **Formularz bez wysyłki** | Tylko symulacja. Brak backendu |
| 11 | **Mapa ciemna na ciemnym** (granatowe województwa na granatowym tle) | Słaba czytelność granic |
| 12 | **Jeden krój o jednej szerokości** (Barlow) i identyczne nagłówki sekcji | Słaba hierarchia, wszystkie sekcje „brzmią” tak samo |
| 13 | **Przyciski „Zadzwoń” bez numeru** prowadziły do kotwicy | Wymaga numeru telefonu od klienta (nadal brak) |

### Co działało i zostaje

- Granat z logo i oklejenia busa jako kolor marki.
- Interaktywna mapa 16 województw na danych GUGiK z rysowaniem trasy.
- Walidacja formularza, dodawanie zdjęć, stały pasek „Zadzwoń / Wycena” na telefonie.
- FAQ i ceny oparte wyłącznie na potwierdzonych danych.

---

## 2. Strony referencyjne

Linki `share.google` prowadziły do:

| Link | Strona docelowa |
|---|---|
| `share.google/R7F3pvwQQa4dNWCbu` | yourmove.com.pl/przeprowadzki-warszawa,28,pl.html (podstrona YourMove) |
| `share.google/u9BsPkGPHUntXHiQj` | przeprowadzkiwarszawa.net (ALFA Przeprowadzki) |
| `share.google/3aBags7nF41NEXFUf` | adexim.pl |

Zastrzeżenie: w środowisku testowym część zewnętrznych bibliotek była zablokowana
(YourMove: Bootstrap i jQuery ze stackpath/cdnjs; Adexim: część obrazów ładowanych przy przewijaniu).
Ocena wyglądu tych elementów jest więc ostrożna. Treść i struktura zostały odczytane w całości.

### YourMove (yourmove.com.pl)

- **Dobrze:** szybki formularz w stopce, najlepszy z trzech: zakres prac (Basic / Selfpacking / Fullpacking),
  „Termin elastyczny”, piętro, winda, „Mogę przesłać zdjęcia przez WhatsApp”, deklaracja
  „Odpowiadamy mailowo, zwykle w ciągu 24 godzin”. Proces opisany w 4 krokach.
- **Zaufanie:** konkretne realia lokalne (parkowanie, wąskie klatki, dzielnice). Strona podaje proces krok po kroku.
- **Usługi:** rozbite na podstrony SEO (kraje, miejscowości). Na stronie głównej brak przeglądu usług.
- **Cennik:** brak cen, tylko „zależy od…”.
- **Zdjęcia:** prawie brak. Jeden baner tła z kartonem.
- **Nawigacja:** rozbudowane menu z rozwijanymi listami krajów i miast. Na telefonie przyciski rozjeżdżają się po ekranie.
- **Konwersja:** żółty przycisk „Darmowa wycena” stale w nagłówku.
- **Słabe:** w sekcji „Dane kontaktowe” zostały dane z szablonu („NazwaFirmy, ul. Ulica numer 43/1, tel: 56 000 00 00”).
  To najpoważniejszy błąd zaufania ze wszystkich analizowanych stron. Nagłówki wielkimi literami, ściany tekstu SEO.

### ALFA Przeprowadzki (przeprowadzkiwarszawa.net)

- **Dobrze:** numer telefonu w pomarańczowym przycisku w nagłówku i powtórzony po każdej sekcji.
  Zdjęcia ludzi przy pracy (stock), sekcja „Obszar działania” z listą dzielnic jako linkami (lokalne SEO).
- **Zaufanie:** liczby („300 przeprowadzek miesięcznie”, „1100 zadowolonych klientów”), opinie z gwiazdkami,
  dostępność „całodobowo”. Liczb nie da się zweryfikować, a opinie mają tylko imiona.
- **Usługi:** trzy karty (mieszkania i domy, biura i firmy, magazynowanie) plus lista punktowana.
- **Cennik:** sekcja „Cennik” bez żadnej ceny.
- **Zdjęcia:** kolaże dwóch nachodzących na siebie zdjęć. Te same zdjęcia stockowe powtórzone kilka razy.
- **Nawigacja:** krótka (Usługi, Aktualności, Cennik, Kontakt) plus pływający przycisk „Darmowa wycena”.
- **Konwersja:** telefon wszędzie, FAQ z pytaniami o czas i liczbę osób.
- **Słabe:** nadmiar tekstu SEO, nagłówki z frazą „Przeprowadzki Warszawa” w każdym zdaniu, baner cookies zasłania HERO,
  jednolite szare tła, powtarzalne zdjęcia.

### Adexim (adexim.pl)

- **Dobrze:** najmocniejsze argumenty zaufania: działalność od 2000 roku, ubezpieczenie OC przewoźnika,
  plombowane pojemniki na cenne rzeczy, certyfikaty, referencje instytucji, pełne dane (adres, właściciel, telefon, e-mail).
- **Usługi:** dwie główne (domy/mieszkania, firmy/instytucje) opisane szczegółowo plus lista „Inne usługi” w granatowych kafelkach.
- **Cennik:** osobna podstrona, na stronie głównej brak cen.
- **Zdjęcia:** stockowe („para patrząca do kartonu”), część obrazów pojawia się dopiero po przewinięciu.
- **Nawigacja:** pełne menu (O firmie, Usługi, Cennik, Kariera, Referencje, Certyfikaty, Poradnik, Kontakt).
- **Konwersja:** „Skontaktuj się”, telefon w osobnej sekcji, formularz na dole.
- **Słabe:** HERO wyśrodkowane, podtytuł z rozstrzelonymi literami, granatowy tekst na ciemnym zdjęciu (nieczytelny),
  ikony w kartach z cieniem, zielone przyciski niepasujące do granatu, na telefonie długie wyśrodkowane bloki tekstu
  i puste miejsca po niezaładowanych obrazach.

### Porównanie

| Kryterium | YourMove | ALFA | Adexim |
|---|---|---|---|
| Pierwszy ekran | Baner z tytułem podstrony, brak oferty | Długi nagłówek SEO, kolaż zdjęć | Stockowe zdjęcie, wyśrodkowany tytuł |
| Telefon widoczny od razu | Nie (tylko „mail”) | Tak, przycisk w nagłówku | Nie w nagłówku |
| Ceny na stronie głównej | Brak | Brak | Brak |
| Proces współpracy | Tak, 4 kroki | Nie | Nie |
| Formularz wyceny | Bardzo dobry (zakres, piętro, winda, zdjęcia) | Brak na stronie głównej | Prosty, na dole |
| Zdjęcia | Prawie brak | Stock, powtórzenia | Stock |
| Dowody zaufania | Opis procesu | Liczby i opinie (nieweryfikowalne) | Lata, OC, referencje, dane firmy |
| Największy błąd | Dane z szablonu w kontakcie | Ściany tekstu SEO | Nieczytelne HERO, brakujące obrazy |

### Wnioski dla Usługi Busem

1. **Ceny w HERO.** Żadna z trzech firm nie pokazuje cen na stronie głównej. Mamy prawdziwe ceny „od”,
   więc to najmocniejszy wyróżnik i element zaufania.
2. **Telefon w nagłówku i na stałym pasku** (jak ALFA), ale bez powtarzania go w każdej sekcji.
3. **Proces krok po kroku** (jak YourMove), rozszerzony do 5 kroków podanych przez klienta.
4. **Formularz z pytaniami, które naprawdę pomagają wycenić** (jak YourMove): piętro, winda, elastyczny termin, zdjęcia.
5. **Dowody zaufania tylko prawdziwe.** Nie mamy lat, OC ani referencji, więc budujemy zaufanie przejrzystością:
   ceny brutto z góry, jasny proces, prawdziwe zdjęcie busa z logo, pełne dane firmy, gdy klient je poda.
6. **Bez ścian tekstu SEO, bez stocków, bez danych z szablonu** — to błędy wszystkich trzech stron.
