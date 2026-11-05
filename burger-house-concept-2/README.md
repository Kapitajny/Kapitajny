# BUŁA burger house – koncepcja 02

Druga, niezależna koncepcja wizualna strony burgerowni BUŁA. Ta sama marka, dane, adresy, ceny i numery telefonów
co w [koncepcji 01](../burger-house/README.md); inny kierunek artystyczny, układ, typografia, zdjęcia i sposób
prezentacji menu. Koncepcja 01 nie została zmieniona.

> **Projekt demonstracyjny.** Marka jest fikcyjna, dane i dokumenty prawne są przykładowe, a formularz kontaktowy
> nie ma backendu (jest to oznaczone na stronie).

## Uruchomienie

```bash
cd burger-house-concept-2
npm install
npm run dev            # http://localhost:3002
npm run build && npm start
```

Albo dwuklik: `URUCHOM-WINDOWS.bat` / `URUCHOM-MAC.command`.

**Przełączanie koncepcji:** uruchom obie (01 na porcie 3001, 02 na 3002). W koncepcji 02 po przewinięciu poza
hero w prawym dolnym rogu pojawia się przełącznik „Koncepcja 01 / Koncepcja 02”. Adres koncepcji 01 ustawisz
zmienną `NEXT_PUBLIC_CONCEPT_1_URL` (domyślnie `http://localhost:3001`).

## Kierunek wizualny

| | Koncepcja 01 | Koncepcja 02 |
|---|---|---|
| Nastrój | nocna kampania, studio, czarne tło | światło dzienne, realne miejsca: papier, stal, drewno |
| Kolory | czerwień `#D7141A`, czerń, krem | musztarda `#F4B400`, grafit `#1C1A17`, kamień `#EFEBE4`, ogórkowa zieleń `#2E5E3E` |
| Typografia | Archivo ściśnięte, wersaliki | Bricolage Grotesque, nagłówki pisane zdaniem, ciasne |
| Logo | BUŁA z czerwoną kreską Ł | „buła” małymi literami z musztardową kropką |
| Hero | zdjęcie na całą szerokość, tekst na nim | podzielony: musztardowa kolumna z tekstem i bloczkiem zamówienia + zdjęcie z dłońmi |
| Bestsellery | kafle produktowe na czarnym | 4 zdjęcia 4:5 z okrągłą naklejką ceny |
| Menu | zakładki i siatka kart | ciemna tablica: spis kategorii (przyklejony), zdjęcie kategorii i lista z kropkowymi prowadnicami nazwa…cena |
| Promocje | jeden baner na zdjęciu | dwie kampanie: plakat z Canvy (musztarda) i karta lunchowa (zieleń) |
| O nas | tekst + zdjęcia kuchni | oś czasu 2019 → 2021 → 2023 ze zdjęciami |
| Lokale | dwa kafle + podstrony z mapą | naprzemienne pasy z żywym statusem „Otwarte do…” (czas w Polsce) |
| Kontakt | sticky numer + formularz w karcie | musztardowy pas z ogromnym numerem + formularz z liniami |

## Grafiki

Wszystkie nowe zdjęcia (hero, 4 ulubione, 6 zdjęć kategorii, 3 do historii, 2 witryny lokali, 2 kampanie)
wygenerowano w **Canvie** w stylistyce światła dziennego. Plakat „Zestaw Fire” to projekt Canva
„BUŁA – koncepcja 02: plakaty i zdjęcia” (strona 1). Miniatury pozycji w tablicy menu (64 px) pochodzą z sesji
zdjęciowej koncepcji 01.

Sieć środowiska, w którym powstał projekt, blokuje pobieranie eksportów z Canvy, więc zdjęcia w `public/images`
pochodzą z podglądów stron projektu (ok. 600 px na dłuższym boku; hero złożone z 6 kafli: 1198 × 1486 px).
Dla wersji produkcyjnej pobierz projekt z Canvy jako JPG i podmień pliki pod tymi samymi nazwami.
