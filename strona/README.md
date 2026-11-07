# Usługi Busem – strona demonstracyjna (wersja 6)

Strona sprzedażowa firmy przeprowadzkowej, przygotowana jako demo przez ComputerIT.
Jedna strona z podstroną regulaminu. Formularz wyceny obsługuje `wycena.php`.
Działa na każdym hostingu z PHP 8 (np. Hostinger), bez bazy danych i wtyczek.
Poprzednie wersje: `materialy/kopie/` (v2–v5).

## Sekcje i menu

Menu: O nas, Usługi, Cennik, Formularz, Kontakt (wyróżniony przycisk). Menu jest przyklejone u góry,
na telefonie rozwija się na cały ekran i zamyka po wybraniu pozycji.

1. Hero: nagłówek sprzedażowy, „Wyceń przeprowadzkę”, „Zadzwoń do nas”, ceny startowe, zdjęcie ekipy w busie.
2. O nas: podejście, bezpieczeństwo rzeczy, terminowość, indywidualna wycena, obsługa.
3. Usługi: mieszkania, domy, biura, transport mebli, rzeczy wielkogabarytowe, transport busem w kraju,
   pomoc przy załadunku, demontaż i montaż, opróżnianie i wywóz. Każdy przycisk ustawia usługę w formularzu.
4. Jak wygląda przeprowadzka (4 kroki).
5. Cennik w formie „banknotów” (własna ramka giloszowa rysowana w przeglądarce, waluta złoty).
6. Dlaczego warto (6 argumentów).
7. Formularz wyceny: dane klienta, adresy i piętra, winda, termin, rodzaj i wielkość przeprowadzki,
   pomoc przy załadunku, usługi dodatkowe, opis, zdjęcia, zgoda RODO.
8. Kontakt z mapą Polski (16 województw).

## Przed publikacją

1. `assets/js/config.js`: prawdziwy `phone` (obecnie przykładowy 500 999 777), `email`, `hours`,
   `companyLegal` (nazwa, adres, NIP – pojawią się w stopce i w informacji RODO pod formularzem).
   Ten sam numer jest w `index.html` (`href="tel:+48500999777"` i dane strukturalne) – podmień go wyszukiwaniem.
2. `wycena.php`: wpisz `RECIPIENT` (adres na zapytania) i `SENDER` (skrzynka w Twojej domenie).
   Dopóki są puste, formularz odpowiada, że wysyłka nie jest skonfigurowana.
3. `regulamin.html`: uzupełnij dane firmy i daj tekst do sprawdzenia prawnikowi.
4. **Zdjęcia:** to zdjęcia stockowe z Pexels. Dla prawdziwej firmy podmień je na własne (ten sam kadr,
   te same nazwy plików w `assets/img/foto/`). Osoby na zdjęciach nie są pracownikami firmy,
   więc na stronie produkcyjnej nie powinny być przedstawiane jako „nasza ekipa”.

## Formularz – zabezpieczenia

- Walidacja w przeglądarce i ponownie w PHP (listy dozwolonych wartości, 9-cyfrowy telefon, e-mail).
- Ukryte pole na boty, minimalny czas wypełnienia (3 s), limit 5 zapytań na godzinę z jednego adresu IP.
- Zdjęcia: do 6 plików, do 8 MB każde, 20 MB razem, sprawdzanie typu pliku po zawartości.
- Odpowiedź do klienta przez Reply-To, nadawca z Twojej domeny (mniej spamu).

## Zdjęcia (licencja Pexels)

Licencja Pexels pozwala na darmowe użycie, także komercyjne, bez obowiązku podpisu autora
(https://www.pexels.com/license/). Pliki są przycięte i lekko wyrównane kolorystycznie.

| Plik | Autor | Źródło | Oryginał |
|---|---|---|---|
| `ekipa-w-busie` | RDNE Stock project | https://www.pexels.com/photo/7464655/ | 2400×1600 |
| `zaladunek-sofy` | RDNE Stock project | https://www.pexels.com/photo/7464689/ | 2400×3600 |
| `sofa-w-mieszkaniu` | RDNE Stock project | https://www.pexels.com/photo/7464662/ | 2400×1600 |
| `wnoszenie-do-domu` | RDNE Stock project | https://www.pexels.com/photo/7464406/ | 2400×1600 |
| `przeprowadzka-biura` | autor podany na stronie zdjęcia | https://www.pexels.com/photo/7217856/ | 2400×2520 (kadr) |
| `duzy-mebel` | RDNE Stock project | https://www.pexels.com/photo/7464712/ | 2400×1600 |
| `bus-w-miescie` | autor podany na stronie zdjęcia | https://www.pexels.com/photo/6699418/ | 2400×3600 |
| `pomoc-przy-zaladunku` | RDNE Stock project | https://www.pexels.com/photo/7464683/ | 2400×1600 |
| `montaz-mebli` | autor podany na stronie zdjęcia | https://www.pexels.com/photo/5805487/ | 2400×1600 |
| `oproznianie` | Ketut Subiyanto | https://www.pexels.com/photo/4246119/ | 2400×1600 |
| `ekipa` | RDNE Stock project | https://www.pexels.com/photo/7464727/ | 2400×3600 |
| `ostroznie-szklo` | RDNE Stock project | https://www.pexels.com/photo/7464700/ | 2400×1600 |

## Pliki

| Plik | Do czego służy |
|---|---|
| `index.html` | Strona główna |
| `regulamin.html` | Projekt regulaminu z miejscami do uzupełnienia |
| `wycena.php` | Odbiór formularza i wysyłka e-maila ze zdjęciami |
| `.htaccess` | Kompresja i pamięć podręczna na serwerze |
| `assets/js/config.js` | Dane firmy |
| `assets/js/main.js` | Menu, przewijanie, cennik-banknot, formularz |
| `assets/css/style.css` | Wszystkie style |
| `assets/fonts/` | Bricolage Grotesque i Cinzel (licencja OFL) |
| `assets/img/foto/` | Zdjęcia WebP w kilku rozmiarach |
| `assets/img/logo-*.svg` | Logo w kolorach strony (grafit, jasne) |

## Wdrożenie na Hostingerze

1. W hPanelu utwórz skrzynkę e-mail dla adresu `SENDER`.
2. Menedżer plików, katalog `public_html`: wgraj zawartość folderu `strona/` (razem z ukrytym `.htaccess`).
3. Wyślij testowe zapytanie ze zdjęciem i sprawdź skrzynkę `RECIPIENT` (także spam).
4. Jeśli wiadomości trafiają do spamu, włącz w hPanelu rekordy SPF i DKIM.
