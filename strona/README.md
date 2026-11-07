# LUXURY MOVING – strona internetowa (wersja 6 „Black & Sand”)

Jedna strona (one-page) bez klasycznego menu, z podstroną regulaminu dostępną ze stopki i z formularza.
Formularz wyceny obsługuje `wycena.php`. Działa na każdym hostingu z PHP 8 (np. Hostinger), bez bazy danych i wtyczek.
Poprzednie wersje są w `materialy/kopie/` (v2–v5; v5 „Usługi Busem” w `strona-v5-przed-przebudowa.zip`).

## Sekcje

1. Hero: centralne logo, hook „Przenosimy więcej niż rzeczy. Zapewniamy spokój.”, duży bus częściowo prześwitujący.
2. Manifest i trzy fakty (bezpłatna wycena, ceny brutto, cała Polska).
3. Usługi: sześć usług w układzie edytorialnym ze zmieniającym się zdjęciem; przycisk ustawia usługę w formularzu.
4. Cennik w formie banknotów LUXURY MOVING (dane z `config.js → pricing`).
5. Przebieg współpracy: pięć przystanków na trasie.
6. Opinie i realizacje – **pokazują się dopiero po wpisaniu prawdziwych danych w `config.js`**.
7. Mapa Polski z wersji 4/5 (16 województw, największe miasta). Wybór dwóch miast rysuje trasę i wpisuje ją do formularza.
8. Formularz wyceny w czterech krokach (z opcjonalnymi zdjęciami).
9. Zakończenie „Twoja przeprowadzka zaczyna się tutaj.” i stopka.

## Pliki

| Plik | Do czego służy |
|---|---|
| `index.html` | Strona główna |
| `regulamin.html` | Projekt regulaminu z miejscami do uzupełnienia (żółte) i weryfikacji (niebieskie) |
| `wycena.php` | Odbiera formularz, sprawdza dane, wysyła e-mail ze zdjęciami w załącznikach |
| `.htaccess` | Kompresja i pamięć podręczna na serwerze (Hostinger) |
| `assets/js/config.js` | **Dane firmy i cennik**: telefon, e-mail, nazwa i NIP, ceny na banknotach, opinie, zdjęcia realizacji |
| `assets/js/main.js` | Przewijanie, banknoty i gilosze, mapa, formularz wieloetapowy, animacje |
| `assets/css/style.css` | Wszystkie style (tokeny kolorów na początku pliku) |
| `assets/fonts/` | Bodoni Moda i Jost (licencja OFL, pliki `OFL-*.txt`) |
| `assets/img/van-*.webp` | Bus w barwach marki (hero), 4 rozmiary, z przezroczystym tłem |
| `assets/img/*-NNN.webp` | Zdjęcia usług w tonacji sepii (kadry z grafik klienta) |

## Cennik (banknoty)

W `assets/js/config.js` w tablicy `pricing`:

```js
{ id: "przeprowadzki", name: "Przeprowadzki", price: 1000, scope: "…" }
```

- `price` – liczba w złotych brutto albo `null` (na banknocie pojawi się „Wycena indywidualna”).
- Ceny pochodzą z danych firmy (przeprowadzki od 1000 zł, transport od 150 zł). Te same kwoty są w tekście
  w `index.html` (sekcja faktów i opis meta) – przy zmianie cen podmień je także tam.

## Przed publikacją

1. `assets/js/config.js`: wpisz prawdziwy `phone` (obecnie **przykładowy 500 999 777** z poprzedniej wersji) i `email`.
   Numer jest też w `index.html` (atrybuty `href="tel:+48500999777"` i dane strukturalne) – podmień go wyszukiwaniem.
2. `wycena.php`: wpisz `RECIPIENT` (adres na zapytania) i `SENDER` (skrzynka w Twojej domenie) albo ustaw zmienne
   środowiskowe `WYCENA_RECIPIENT` i `WYCENA_SENDER`. Dopóki są puste, formularz odpowiada, że wysyłka nie jest
   skonfigurowana (przeglądarka zapisuje wtedy w konsoli odpowiedź 503 – to oczekiwane).
3. `regulamin.html`: uzupełnij dane firmy i daj tekst do sprawdzenia prawnikowi.
4. Opinie (`reviews`) i zdjęcia realizacji (`gallery`) w `config.js` wpisuj tylko prawdziwe – sekcje same się pokażą.
5. Zdjęcia usług mają 416–900 px szerokości (tyle miały grafiki źródłowe). Najlepiej podmienić je na własne,
   min. 1600 px, zachowując nazwy plików albo aktualizując `index.html`.
6. Nazwa „Luxury Moving” jest robocza – przy zmianie podmień ją w `index.html`, `regulamin.html`, `wycena.php` i `config.js`.

## Wdrożenie na Hostingerze

1. W hPanelu utwórz skrzynkę e-mail dla adresu `SENDER`.
2. Menedżer plików, katalog `public_html`: wgraj zawartość folderu `strona/` (razem z ukrytym plikiem `.htaccess`).
3. Wyślij testowe zapytanie ze zdjęciem i sprawdź skrzynkę `RECIPIENT` (także spam).
4. Jeśli wiadomości trafiają do spamu, włącz w hPanelu rekordy SPF i DKIM.

## Podgląd lokalny

```bash
cd strona
php -S 127.0.0.1:8080        # http://127.0.0.1:8080
# test wysyłki bez prawdziwej poczty:
WYCENA_RECIPIENT=test@example.com WYCENA_SENDER=formularz@example.com \
  php -d sendmail_path="tee /tmp/mail.eml" -S 127.0.0.1:8080
```
