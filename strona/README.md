# Usługi Busem – strona internetowa (wersja 3)

Jedna strona (one-page) z czterema sekcjami w menu: Strona główna, O nas, Cennik, Kontakt.
Regulamin to osobna podstrona dostępna tylko ze stopki. Formularz wyceny obsługuje `wycena.php`.
Działa na każdym hostingu z PHP 8 (np. Hostinger), bez bazy danych i wtyczek.

## Pliki

| Plik | Do czego służy |
|---|---|
| `index.html` | Strona główna ze wszystkimi sekcjami |
| `regulamin.html` | Projekt regulaminu z miejscami do uzupełnienia (żółte) i weryfikacji (niebieskie) |
| `wycena.php` | Odbiera formularz, sprawdza dane, wysyła e-mail ze zdjęciami w załącznikach |
| `assets/js/config.js` | **Dane firmy**: telefon, e-mail, nazwa i NIP |
| `assets/js/main.js` | Menu, podświetlanie sekcji, walidacja i wysyłka formularza |
| `assets/css/style.css` | Wszystkie style |
| `assets/fonts/` | Anton i Figtree (licencja OFL), przycięte do polskich znaków |
| `assets/img/bus-uslugi-busem*.webp` | Grafika busa w HERO (wygenerowana w Canvie na podstawie materiałów firmy), 3 rozmiary |
| `assets/img/rozladunek.webp` | Zdjęcie z grafiki „Rozładunek busa” bez napisu |
| `assets/img/nowe-*.svg` | Logo odtworzone wektorowo z pliku firmy |

## Przed publikacją

1. `assets/js/config.js`: wpisz `phone` i `email`. Bez numeru przyciski „Zadzwoń” prowadzą do sekcji Kontakt.
2. `wycena.php`: wpisz `RECIPIENT` (adres na zapytania) i `SENDER` (skrzynka w Twojej domenie).
   Dopóki są puste, formularz odpowiada, że wysyłka nie jest skonfigurowana.
3. `regulamin.html`: uzupełnij dane firmy i daj tekst do sprawdzenia prawnikowi.

## Wdrożenie na Hostingerze

1. W hPanelu utwórz skrzynkę e-mail dla adresu `SENDER`.
2. Menedżer plików, katalog `public_html`: wgraj zawartość folderu `strona/`.
3. Wyślij testowe zapytanie ze zdjęciem i sprawdź skrzynkę `RECIPIENT` (także spam).
4. Jeśli wiadomości trafiają do spamu, włącz w hPanelu rekordy SPF i DKIM.
