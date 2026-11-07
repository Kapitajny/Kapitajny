# Usługi Busem – strona internetowa (wersja 5 „Trasa”)

Jedna strona (one-page) z podstroną regulaminu dostępną ze stopki i z formularza.
Formularz wyceny obsługuje `wycena.php`. Działa na każdym hostingu z PHP 8 (np. Hostinger), bez bazy danych i wtyczek.
Poprzednie wersje są w `materialy/kopie/` (v2, v3, v4).

## Sekcje

1. Hero z busem w barwach firmy i tablicą trasy „Skąd → Dokąd”: wpisana trasa trafia do formularza.
2. O firmie i „na co możesz liczyć”.
3. Usługi z cenami startowymi i przyciskami wyceny, które ustawiają usługę w formularzu.
4. Zdjęcie przy pracy.
5. Obszar działania: mapa Polski z wersji 4 (16 województw, największe miasta). Wybór dwóch miast rysuje trasę.
6. Przebieg zlecenia w czterech krokach.
7. Cennik (taryfa brutto).
8. Opinie klientów i zdjęcia z realizacji: **pokazują się dopiero po wpisaniu prawdziwych danych w `config.js`**.
9. Pytania i odpowiedzi.
10. Kontakt z telefonem i formularzem wyceny (zdjęcia w załącznikach).

## Pliki

| Plik | Do czego służy |
|---|---|
| `index.html` | Strona główna |
| `regulamin.html` | Projekt regulaminu z miejscami do uzupełnienia (żółte) i weryfikacji (niebieskie) |
| `wycena.php` | Odbiera formularz, sprawdza dane, wysyła e-mail ze zdjęciami w załącznikach |
| `.htaccess` | Kompresja i pamięć podręczna na serwerze (Hostinger) |
| `assets/js/config.js` | **Dane firmy**: telefon, e-mail, nazwa i NIP, opinie, zdjęcia realizacji |
| `assets/js/main.js` | Menu, przewijanie, tablica trasy, mapa, opinie, walidacja i wysyłka formularza |
| `assets/css/style.css` | Wszystkie style |
| `assets/fonts/` | Barlow i Barlow Condensed (licencja OFL, `OFL-Barlow.txt`) |
| `assets/img/bus-*.webp` | Bus w barwach firmy (hero), 5 rozmiarów |
| `assets/img/rozladunek-*.webp` | Kadr z grafiki „Rozładunek busa” bez napisu |
| `assets/img/wnetrze-*.webp` | Wnętrze busa z kartonami, bez żółtej ramki |
| `assets/img/nowe-*.svg` | Logo odtworzone wektorowo z pliku firmy |

## Przed publikacją

1. `assets/js/config.js`: wpisz prawdziwy `phone` (obecnie przykładowy 500 999 777) i `email`.
   Ten sam numer jest też w `index.html` (atrybuty `href="tel:+48500999777"` i dane strukturalne) – podmień go wyszukiwaniem.
2. `wycena.php`: wpisz `RECIPIENT` (adres na zapytania) i `SENDER` (skrzynka w Twojej domenie).
   Dopóki są puste, formularz odpowiada, że wysyłka nie jest skonfigurowana.
3. `regulamin.html`: uzupełnij dane firmy i daj tekst do sprawdzenia prawnikowi.
4. Opinie (`reviews`) i zdjęcia realizacji (`gallery`) w `config.js` wpisuj tylko prawdziwe – sekcje same się pokażą.
5. Najlepiej podmienić zdjęcia na własne, w większej rozdzielczości (min. 1600 px szerokości).

## Wdrożenie na Hostingerze

1. W hPanelu utwórz skrzynkę e-mail dla adresu `SENDER`.
2. Menedżer plików, katalog `public_html`: wgraj zawartość folderu `strona/` (razem z ukrytym plikiem `.htaccess`).
3. Wyślij testowe zapytanie ze zdjęciem i sprawdź skrzynkę `RECIPIENT` (także spam).
4. Jeśli wiadomości trafiają do spamu, włącz w hPanelu rekordy SPF i DKIM.
