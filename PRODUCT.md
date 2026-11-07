# Product

<!-- impeccable:product-schema 1 -->

Dotyczy strony firmowej w katalogu `strona/` (Usługi Busem). Pozostałe pliki repozytorium (aplikacja Next.js „noir-coffee”) to osobny projekt.

Strona jest **demonstracyjna**: przygotowuje ją agencja ComputerIT jako przykład dla klientów z branży przeprowadzkowej. Marka „Usługi Busem” i dane kontaktowe są przykładowe.

## Platform

web

## Stack

Statyczny HTML, CSS i JavaScript bez frameworka; formularz wyceny obsługuje `strona/wycena.php` (PHP 8, `mail()`), dane kontaktowe w `strona/assets/js/config.js`. Docelowy hosting: Hostinger. Bez publikacji na produkcji bez zgody właściciela.

## Users

Osoby prywatne, które się przeprowadzają, kupiły mebel lub sprzęt do przewiezienia albo muszą opróżnić mieszkanie, dom, piwnicę czy garaż (np. po remoncie, sprzedaży lub spadku). Także firmy przenoszące biuro. Szukają zwykle w telefonie, w stresie i pod presją terminu; chcą szybko sprawdzić, czy firma obsłuży ich trasę, ile to mniej więcej kosztuje i jak najprościej zamówić wycenę.

## Product Purpose

Pozyskiwanie zleceń: odwiedzający ma zadzwonić albo wysłać formularz wyceny (z opisem i zdjęciami). Sukces to zapytanie od klienta, a nie czas spędzony na stronie.

## Positioning

Jedna firma z busem do przeprowadzek, transportu mebli i opróżniania mieszkań na terenie całej Polski, z jawnymi cenami startowymi brutto i bezpłatną wyceną, także ze zdjęć.

## Operating Context

Klient opisuje zlecenie: co przewozi, skąd, dokąd, piętro, winda, termin; dołącza zdjęcia. Firma odpowiada wyceną telefonicznie. Realizacja: przyjazd busem, załadunek, transport, rozładunek; przy meblach demontaż i montaż; przy opróżnianiu wywóz gabarytów.

## Capabilities and Constraints

- Usługi: przeprowadzki mieszkań, domów, biur i firm (w mieście i między miastami); transport mebli, AGD/RTV i innych przedmiotów; opróżnianie mieszkań, domów, piwnic, garaży i strychów z wywozem gabarytów; demontaż i montaż mebli.
- Ceny (brutto): przeprowadzki od 1000 zł; transport mebli i innych przedmiotów od 150 zł; opróżnianie mieszkań i domów – wycena indywidualna. Cena końcowa zależy od zakresu zlecenia i szczegółów transportu. Wycena bezpłatna.
- Obszar: cała Polska, 16 województw; mapa z największym miastem każdego województwa (element do zachowania).
- Formularz: imię, telefon, e-mail (opcjonalnie), usługa, skąd, dokąd, opis, do 6 zdjęć, zgoda; honeypot i limit czasu.
- Otwarte decyzje (do uzupełnienia przez właściciela): prawdziwy numer telefonu (obecnie przykładowy 500 999 777), e-mail, dane firmy (NIP, adres), domena, adresy RECIPIENT/SENDER w `wycena.php`.

## Brand Commitments

- Nazwa: Usługi Busem. Logo: sylwetka busa z liniami ruchu i napisem „USŁUGI BUSEM” (oryginał czarno-niebieski: `strona/assets/img/nowe-*.svg`, `materialy/grafiki/logo-uslugi-busem-bus.png`). Na stronie v6 używane są wersje w kolorach palety: `logo-grafit.svg` (grafit i szałwia) oraz `logo-jasne.svg` – sam znak bez zmian.
- Grafika „Rozładunek busa” (`materialy/grafiki/rozladunek-busa.png`) i grafika busa w barwach firmy (`materialy/grafiki/bus-hero-2x.png`).
- Ton: konkretny, rzeczowy, po polsku, na „Ty”.
- Paleta wskazana przez właściciela: szałwiowa zieleń, ciepły beż, złamana biel, grafit, czerń. Cennik w motywie banknotu (bez imitacji prawdziwej waluty). Menu: O nas, Usługi, Cennik, Formularz, Kontakt.

## Evidence on Hand

- Zdjęcia: stockowe z Pexels (licencja Pexels), spis w `strona/README.md`. Osoby na zdjęciach nie są pracownikami firmy – w wersji produkcyjnej zdjęcia trzeba zastąpić własnymi.
- Starsze grafiki (bus z Canvy, rozładunek, wnętrze busa) zostały w `materialy/grafiki/`, na stronie v6 nie są używane.
- Brak: opinii klientów, zdjęć z prawdziwych realizacji, liczby zleceń, lat działania, certyfikatów, ubezpieczeń, danych rejestrowych. Nie wolno ich wymyślać. Sekcja opinii i realizacji może pokazywać tylko materiały dostarczone przez właściciela.
- Numer 694 796 560 należy do innej firmy – nie używać.

## Product Principles

1. Najpierw kontakt: telefon i wycena osiągalne z każdego miejsca strony.
2. Konkret zamiast obietnic: ceny, zakres, obszar i przebieg zlecenia podane wprost.
3. Prawda ponad efekt: żadnych zmyślonych opinii, liczb ani deklaracji.
4. Telefon w ręku: każdy układ projektowany osobno dla małego ekranu.

## Accessibility & Inclusion

WCAG 2.1 AA: kontrasty, fokus z klawiatury, etykiety formularza, `prefers-reduced-motion`, cele dotykowe min. 44 px.
