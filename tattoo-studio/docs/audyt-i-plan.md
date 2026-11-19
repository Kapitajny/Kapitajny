# Audyt strony i plan przebudowy

Data audytu: 2026-11-19. Wersja audytowana: commit `b33c5a8` (gałąź `ccr-10dbb7bd-a6twwv`).

## 1. Narzędzia

| Narzędzie | Status | Użycie |
| --- | --- | --- |
| Skill `frontend-design` | dostępny | kierunek wizualny, system tokenów, autokrytyka |
| Skille Design: `design-critique`, `accessibility-review`, `ux-copy` | dostępne | struktura audytu, dostępność, teksty interfejsu |
| Playwright + Chromium (lokalnie) | dostępny | testy przeglądarkowe, zrzuty ekranu, automatyczne sprawdzanie języka |
| Lighthouse 12, axe-core 4.10 | zainstalowane tymczasowo (poza projektem) | wydajność, dostępność WCAG, SEO |
| Impeccable, UI/UX Pro Max, agent-browser | **niedostępne** w katalogu | — |
| Superdesign, i18n-sync, Browser Use | dostępne w katalogu, **niewłączone** | wymagają zgody na instalację zewnętrznych usług — nie instalowano |

Nie dodano żadnej biblioteki UI ani animacji: obecne potrzeby pokrywa React + CSS. Jedyna nowa zależność narzędziowa
to skrypt podzbioru fontów (fonttools, uruchamiany ręcznie — nie trafia do aplikacji).

## 2. Wyniki pomiarów (stan przed przebudową)

| Strona | Wydajność | Dostępność | Dobre praktyki | SEO | LCP | Waga |
| --- | --- | --- | --- | --- | --- | --- |
| Strona główna — telefon | 53 | 100 | 100 | 66* | **96,4 s** | **15,1 MB** |
| Strona główna — komputer | 73 | 97 | 100 | 66* | 16,5 s | 15,1 MB |
| Formularz — telefon | 69 | 100 | 100 | 66* | 48,1 s | 14,7 MB |

\* SEO 66 wynika wyłącznie z celowego `noindex` do czasu uzupełnienia danych studia.

**Przyczyna wagi 15 MB:** fonty japońskie. Strona używa ok. 40 znaków kanji, a Google Fonts dzieli fonty CJK na ok. 120
plików na każdą grubość. Znaki rozrzucone po wielu plikach powodują pobranie dziesiątek fragmentów fontów dla każdej
z 7 grubości. To najpoważniejszy problem techniczny strony.

axe-core (WCAG 2.2 AA): 1 naruszenie — kontrast małych opisów sekcji (4,4:1 zamiast 4,5:1).
Lighthouse: niezgodność `aria-label` z widocznym tekstem (np. miniatury galerii, przycisk doku).

## 3. Krytyka projektu

### Pierwsze wrażenie
Hero z wielką nazwą i zwojami kakejiku buduje charakter marki — to warto zachować. Mieszanie języków osłabia jednak
wrażenie profesjonalizmu już na pierwszym ekranie („Book your tattoo”, „See the work” obok polskiego tekstu).

### Użyteczność

| Problem | Waga | Rekomendacja |
| --- | --- | --- |
| Ok. 40 angielskich napisów w polskiej wersji (menu, nagłówki, cały formularz, komunikaty błędów) | 🔴 krytyczny | Centralny system tłumaczeń PL/EN, polski domyślny |
| Brak przełącznika języka | 🔴 krytyczny | Przełącznik PL/EN w doku i nagłówkach podstron, zapamiętywany |
| Dok na telefonie: 8 ikon bez podpisów — trudne do rozpoznania | 🟡 średni | Osobny układ mobilny: „Menu” (arkusz z pełną nawigacją i językiem), 2 skróty, przycisk rezerwacji |
| Galeria masonry: kolejność w lightboxie nie odpowiada kolejności wizualnej (kolumny czytane z góry na dół) | 🟡 średni | Układ wierszowy (justified rows) — kolejność od lewej do prawej, zachowane proporcje |
| Sekcja opinii: 6 pustych kart zajmuje dużo miejsca i wygląda jak niedokończona strona | 🟡 średni | Zwarty, zaprojektowany stan pusty + karuzela dla prawdziwych opinii |
| Specjalizacje: obraz tylko w panelu bocznym, brak połączenia z galerią | 🟢 drobny | Odsłanianie obrazu przy kursorze + link „Zobacz prace w tym stylu” filtrujący galerię |
| Formularz: brak podglądu dotychczasowych wyborów podczas wypełniania | 🟢 drobny | Panel „Twój projekt” aktualizowany na żywo |

### Hierarchia wizualna
- Wszystkie nagłówki sekcji wersalikami tej samej wielkości — sekcje zlewają się w jeden rytm.
- Dwa systemy numeracji obok siebie w „O nas” (01–04 i 一–五).
- Długi tekst w kroju szeryfowym na całej stronie — elegancki, ale męczący przy dłuższej lekturze na telefonie.

### Spójność
| Element | Problem | Rekomendacja |
| --- | --- | --- |
| Teksty | Polskie i angielskie w jednym widoku | Słowniki PL/EN, brak tekstów w komponentach |
| Treść w konfiguracji | Dane (ID, liczby) wymieszane z tekstami | Konfiguracja = dane; teksty = słowniki |
| Akcent kolorystyczny | Brak — paleta poprawna, ale bez warstwy „luksusu” | Grafit jako druga powierzchnia ciemna, złoto płatkowe (kin) jako cienki akcent |

### Dostępność
- Kontrast: tekst podstawowy zgodny (>7:1); małe opisy sekcji 4,4:1 — do poprawy.
- Cele dotykowe: przyciski ≥ 44 px; pole wyszukiwania FAQ — etykieta za mała jako cel, pole w porządku.
- Atrybut `lang` stały (`pl`) również przy angielskich treściach — czytniki ekranu czytają je z polską wymową.

### Co działa dobrze
- Spójna, rozpoznawalna estetyka: tusz, papier washi, wzory Asanoha/Seigaiha/Kumiko, pieczęć hanko.
- Prawdziwie działający formularz z walidacją po obu stronach, testami i uczciwą obsługą braku konfiguracji.
- Dobra dostępność bazowa (fokus, semantyka, dialog, reduced motion).

## 4. Plan przebudowy

### Architektura językowa
- Adresy: polski bez prefiksu (`/`, `/rezerwacja`, `/regulamin`, `/polityka-prywatnosci`),
  angielski z prefiksem (`/en`, `/en/booking`, `/en/terms`, `/en/privacy`). Obie wersje renderowane na serwerze,
  z `hreflang`, kanonicznymi adresami i metadanymi w danym języku.
- Przełączenie języka działa **w miejscu**: zmienia treści, `<html lang>`, tytuł i adres (bez przeładowania),
  więc nie gubi danych formularza ani pozycji przewinięcia.
- Wybór zapamiętywany (cookie + localStorage); powracający użytkownik z wyborem EN jest przekierowywany na `/en`.
- Słowniki `src/i18n/dictionaries/pl.ts` i `en.ts` — TypeScript wymusza identyczny zestaw kluczy;
  test sprawdza brak angielskich słów w polskim słowniku.
- Walidacja i API zwracają **kody** błędów, tłumaczone w interfejsie.

### Wydajność
- Własne podzbiory fontów (`next/font/local`): łacina + polskie znaki + tylko użyte kanji
  (skrypt `scripts/subset-fonts.py` zbiera znaki z kodu). Cel: < 500 KB całej strony bez zdjęć.

### Kierunek wizualny
- Paleta: sumi `#14110E`, grafit `#2A2724`, washi `#EEE9DF`, kinari `#DCCFB8`, złoto płatkowe `#B5945B`
  (wyłącznie linie i drobne akcenty), bengara `#8E3B2A` (pieczęć, błędy).
- Typografia: Shippori Mincho — nagłówki zdaniowe (nowocześniejsze niż wersaliki) i wstępy;
  Zen Kaku Gothic New — tekst główny i interfejs.
- Hero: parawan **byōbu** — 4 panele ze zdjęciami ustawione w zygzak w perspektywie, rozkładane przy wejściu
  i reagujące na ruch kursora (jedyny orkiestrowany moment strony).
- Galeria: wiersze o stałej wysokości z zachowaniem proporcji, lightbox z miniaturami.
- O nas: rozdziały 01–06 z jednolitą numeracją; każdy z inną kompozycją.
- Specjalizacje: obraz odsłaniany przy kursorze (desktop), akordeon ze zdjęciem (dotyk), link do galerii.
- Cennik: suwak rozmiaru z linijką, animowany wynik.
- Formularz: dwie kolumny z panelem „Twój projekt” na żywo.
- Mobile: osobny dok z arkuszem menu, uproszczone układy sekcji, przyciski ≥ 44 px.

### Zdjęcia
Dodano 6 nowych zdjęć (rękaw ze świecą i latarnią, rękaw polinezyjski, dwa tygrysy linework, rękaw z czaszką
i Anubisem, statek — znak wodny Moko Tusz). Nadal żadne nie jest realizacją studia ani pracą w stylu japońskim,
a wszystkie mają 300–740 px szerokości — strona pozostaje oznaczona jako „zdjęcia poglądowe”.

## 5. Wyniki po przebudowie

Pomiary na wersji produkcyjnej (`next build` + `next start`), te same narzędzia co w audycie.

| Strona | Wydajność | Dostępność | Dobre praktyki | SEO* | LCP | Waga fontów |
| --- | --- | --- | --- | --- | --- | --- |
| Strona główna — telefon | 53 → **93** | 100 → **100** | 100 | 66 → 69 | 96,4 s → **2,8 s** | ok. 15 MB → **88 KB** |
| Strona główna — komputer | 73 → **100** | 97 → **100** | 100 | 66 → 69 | 16,5 s → **0,8 s** | |
| Formularz — telefon | 69 → **90** | 100 → **100** | 100 | 66 | 48,1 s → **3,0 s** | |

\* SEO poniżej 100 wyłącznie z powodu celowego `noindex` (do czasu uzupełnienia danych studia).

- **axe-core (WCAG 2.2 AA):** 0 naruszeń na stronie głównej (PL/EN, komputer i telefon), formularzu (PL/EN)
  i polityce prywatności.
- **Języki:** automatyczny skan całego widocznego tekstu i atrybutów (`aria-label`, `placeholder`, `alt`, `title`)
  na wszystkich stronach, we wszystkich krokach formularza (z komunikatami błędów), w podglądzie zdjęć, menu
  mobilnym i wyszukiwarce FAQ: **0 angielskich napisów w wersji polskiej**, 0 polskich napisów interfejsu
  w wersji angielskiej. Wyjątek celowy: hasło marki (oznaczone `lang="en"`).
- **Przełączanie języka (test w przeglądarce):** treść widoczna na ekranie nie przesuwa się; zmieniają się
  `<html lang>`, tytuł i adres; wybór jest zapamiętywany (cookie + localStorage) i działa przekierowanie przy
  kolejnej wizycie; w formularzu zachowane są wpisane dane, dodane zdjęcia i bieżący krok, a komunikaty błędów
  tłumaczą się na żywo.
- **Responsywność:** brak poziomego przewijania na iPhone SE, iPhone 13, Pixel 7, iPad Mini, iPad Pro 11
  i komputerze — na wszystkich 8 stronach w obu językach.
- **Błędy konsoli:** brak.

Błędy wykryte i naprawione w trakcie testów: przepełnienie siatki FAQ na telefonie (przewijane kategorie
rozszerzały kolumnę i powodowały pomniejszenie całej strony), za niski kontrast złotego akcentu na jasnym tle,
nieczytelne podpisy w galerii (obcinane tytuły), etykiety suwaka rozmiaru niewyrównane z pozycjami.
