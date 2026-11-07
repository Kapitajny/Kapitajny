# Raport: przebudowa strony do wersji 3

Stan na 2026-11-06. Kopia poprzedniej wersji: `materialy/kopie/strona-v2-przed-przebudowa.zip` (oraz commit `670aaa4`).

## Audyt wersji 2

| Problem | Decyzja w wersji 3 |
|---|---|
| Dziewięć pozycji w menu, za dużo sekcji (usługi w trzech układach, proces 5 kroków, mapa, opinie, FAQ) | Menu z czterema pozycjami, cztery sekcje. Usunięte: mapa, opinie, FAQ, osobny cennik w HERO |
| Identyfikacja oparta na starym logo z górami (granat, karton) | Nowa identyfikacja z nowego logo: czerń, biel, błękit pasów prędkości |
| Zdjęcie busa w prostokątnej ramce, rozdzielczość 976 px | Duża grafika busa wycięta z tła, wychodząca poza HERO, 1416 px |
| Szeroki krój Archivo, zaokrąglone narożniki 2–4 px | Wąski krój Anton jak w logo i grafice „Rozładunek busa”, ostre narożniki, ukośne przyciski |
| Formularz z 12 polami w trzech grupach | 9 pól w jednej kolumnie (na telefonie) |
| Polityka prywatności jako osobna strona | Regulamin w stopce, dane osobowe jako § 8 regulaminu |

## Koncepcja

- **Kolory:** czerń `#0B0D10` i błękit `#0B5FEF` z logo, tło `#F1F3F6` jak w grafice „Rozładunek busa”.
  Biały tekst na błękicie 5,4:1, błękit na jasnym tle 4,9:1, wszystkie połączenia tekstu spełniają WCAG AA.
- **Typografia:** Anton (nagłówki wielkimi literami, jak napis na logo i grafice), Figtree (tekst).
- **Język graficzny:** ukośne cięcia i pasy jak na oklejeniu busa: błękitny pas za busem, ukośne tła przycisków,
  krótkie pasy przy usługach.
- **Ruch:** jedno zdarzenie: bus wjeżdża do HERO przy ładowaniu strony. Wyłączane przy ustawieniu „ogranicz ruch”.

## Grafika busa

1. Do Canvy wysłane trzy grafiki firmy (zdjęcie busa, nowe logo, „Rozładunek busa”).
2. Pierwsza próba ze starym zdjęciem dała dawne oklejenie z górami, więc wzorem zostały tylko nowe materiały.
3. Wybrana wersja: bus w perspektywie 3/4 od przodu z logo „USŁUGI BUSEM” na boku i masce.
4. Tło usunięte w Canvie. Przezroczystość (z miękkimi krawędziami) wyliczona z dwóch eksportów, na białym i czarnym tle,
   bo Canva eksportowała tło strony zamiast przezroczystości.
5. Pliki WebP: 1416 px (148 KB), 900 px (80 KB), 600 px (40 KB). Cień pod kołami dodany w CSS.

Projekt roboczy w Canvie („Pusta tapeta pulpitu 1920 × 1080 px”) został zapisany za Twoją zgodą tylko na potrzeby eksportu.
Możesz go usunąć.

## Testy

| Test | Wynik |
|---|---|
| Szerokości 360, 390, 768, 1024, 1440, 1920 px | Brak przewijania w bok, brak błędów w konsoli i błędów 404 |
| Menu | Dokładnie 4 pozycje, podświetlanie aktywnej sekcji, menu na telefonie zamyka się po wyborze i klawiszem Esc |
| Przyciski usług | Wybierają usługę w formularzu i przewijają do kontaktu |
| Formularz | Błędy przy pustych polach, wysyłka ze zdjęciem przez PHP zakończona e-mailem z załącznikiem |
| Regulamin | Otwiera się ze stopki, 13 miejsc do uzupełnienia |
| Lighthouse, strona główna | Komputer 100/100/100/100, telefon 99/100/100/100 (LCP 2,0 s, waga 289 KB) |
| Lighthouse, regulamin | Wydajność i dostępność 100; SEO niższe celowo (blokada indeksowania wersji roboczej) |

## Do uzupełnienia

- Telefon i e-mail (`strona/assets/js/config.js`).
- Adres odbiorcy i nadawcy formularza (`strona/wycena.php`).
- Dane firmy i zapisy regulaminu, weryfikacja prawna.
- Docelowa domena.
