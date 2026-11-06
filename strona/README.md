# Usługi Busem – strona internetowa

Statyczna strona (HTML, CSS, JS) z obsługą formularza wyceny w PHP. Działa na każdym hostingu z PHP 8,
w tym na Hostingerze, bez bazy danych i bez wtyczek.

## Struktura

| Plik | Do czego służy |
|---|---|
| `index.html` | Strona główna |
| `polityka-prywatnosci.html` | Polityka prywatności (wersja robocza, do uzupełnienia danymi firmy) |
| `wycena.php` | Odbiera formularz wyceny i wysyła e-mail ze zdjęciami w załącznikach |
| `assets/js/config.js` | **Dane firmy**: telefon, e-mail, adres, linki do Google, opinie |
| `assets/js/main.js` | Menu, mapa, opinie, walidacja i wysyłka formularza |
| `assets/js/map-data.js` | Granice 16 województw (GUGiK, Państwowy Rejestr Granic) |
| `assets/css/style.css` | Wszystkie style, kolory i typografia |
| `assets/fonts/` | Czcionka Archivo (licencja OFL) przycięta do polskich znaków |
| `assets/img/` | Zdjęcia WebP, logo SVG, favicon |

## Przed publikacją uzupełnij

1. `assets/js/config.js`: `phone`, `email`, opcjonalnie `address`, `companyLegal`,
   `googleReviewUrl`, `googleProfileUrl`. Puste pola są na stronie opisane jako „do uzupełnienia”.
2. `wycena.php`: `RECIPIENT` (adres, na który przychodzą zapytania) i `SENDER`
   (skrzynka w Twojej domenie, np. `formularz@twojadomena.pl`). Dopóki są puste, formularz
   odpowiada komunikatem, że wysyłka nie jest skonfigurowana.
3. `polityka-prywatnosci.html`: fragmenty oznaczone tłem.

## Wdrożenie na Hostingerze

1. W hPanelu utwórz skrzynkę e-mail dla adresu nadawcy (`SENDER`).
2. Menedżer plików, katalog `public_html`: wgraj całą zawartość folderu `strona/`.
3. Otwórz stronę, wyślij testowe zapytanie ze zdjęciem i sprawdź skrzynkę `RECIPIENT`
   (także folder spam).
4. Jeśli wiadomości trafiają do spamu, w hPanelu włącz rekordy SPF i DKIM dla domeny.

## Opinie Google

Prawdziwe opinie wpisz w `config.js` w tablicy `reviews` (autor, ocena, data, treść).
Strona pokaże je automatycznie w miejscu zaproszenia do wystawienia opinii.
Automatyczne pobieranie wymaga klucza Google Places API i identyfikatora wizytówki.
