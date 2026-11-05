# BUŁA burger house – koncepcja 02 „Editorial”

Druga koncepcja wizualna strony burgerowni w kierunku editorial brutalism: jasny papier, czarna typografia
wypełniająca ekran, dużo powietrza, jedna czerwień jako akcent. Ta sama marka, dane, ceny, adresy i telefony
co w [koncepcji 01](../burger-house/README.md), która pozostaje bez zmian. Wcześniejszy wariant 02A
(musztarda i grafit) leży w [`../burger-house-concept-2`](../burger-house-concept-2/README.md).

> **Projekt demonstracyjny.** Marka jest fikcyjna, dane i dokumenty prawne są przykładowe, formularz kontaktowy
> nie ma backendu (oznaczone na stronie).

## Uruchomienie

```bash
cd burger-house-editorial
npm install
npm run dev               # http://localhost:3003
npm run build && npm start
```

Albo dwuklik: `URUCHOM-WINDOWS.bat` / `URUCHOM-MAC.command`. Porównanie: koncepcja 01 działa na porcie 3001,
wariant 02A na 3002 – linki do nich są w stopce.

## System projektowy

| | |
|---|---|
| Kolory | papier `#EEEBE5`, czerń `#000`, szarość `#6B665F`, linie `#CFCAC1`, czerwień `#C41D0E` (cena promocji, status „otwarte”, kreska Ł w logo) |
| Nagłówki | Schibsted Grotesk 900, wersaliki, światło −0,065 em, interlinia 0,77 |
| Tekst | Newsreader (szeryf) do opisów i cytatów; Schibsted 600–800 do etykiet, cen i przycisków |
| Siatka | 12 kolumn na pełnej szerokości ekranu, margines 16–44 px; każda sekcja ma własny układ kolumn |
| Przyciski | pigułka: czarna z białym napisem lub obrys; jedyne zaokrąglone elementy na stronie |
| Ruch | jedno wejście nagłówka hero, odsłanianie zdjęć przy przewijaniu, `prefers-reduced-motion` respektowane |

Gigantyczne słowa hero („DOBRY / BURGER / bez kompromisów.”) mają rozmiar w jednostkach kontenera (`cqw`), więc
na każdej szerokości wypełniają kolumnę; „BURGER” celowo ucieka za prawą krawędź.

## Sekcje

Hero typograficzne → zdjęcie na pełną szerokość → trzy bestsellery w asymetrycznej rozkładówce → O nas (tekst,
dwa zdjęcia, duży cytat, kadr z kuchni, oś 2019–2023) → Menu (spis kategorii przyklejony u góry, każda kategoria
ma ogromną nazwę i inny układ: zdjęcie po prawej/lewej, panorama, dwie kolumny) → Promocje („OGIEŃ / 44,99” i
lunch „12–15”) → Nasze lokale (Warszawa i Grodzisk w odbitych kompozycjach, podstrony z mapą) → „Zadzwoń.” z
numerem na pełną szerokość → formularz → czarna stopka ze znakiem BUŁA.

## Zdjęcia

18 grafik przygotowano w **Canvie**: 17 zdjęć wygenerowanych w jednej stylistyce (jasne tło, światło dzienne,
minimalne kompozycje) i plakat „Ogień 44,99 zł” złożony w projekcie Canva
„BUŁA – koncepcja editorial: plakat i zdjęcia”. Pliki w `public/images` to eksport z Canvy w pełnej
rozdzielczości (1024–1680 px).
