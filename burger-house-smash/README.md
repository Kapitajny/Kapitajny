# BUŁA smash burger – koncepcja 03 „Smash”

Trzecia, osobna koncepcja strony fikcyjnej burgerowni BUŁA (Warszawa, ul. Marszałkowska 25 oraz Grodzisk Mazowiecki,
ul. 11 Listopada 12). Kierunek: street food z blachy, inspirowany ogólną energią marek smash-burgerowych –
bez kopiowania logo, tekstów ani grafik żadnej z nich. Koncepcje 01 (`burger-house/`, port 3001), 02A
(`burger-house-concept-2/`, 3002) i 02 Editorial (`burger-house-editorial/`, 3003) zostały nietknięte.

> **Projekt demonstracyjny.** Marka, numery telefonów, profile społecznościowe, godziny i dokumenty prawne są
> przykładowe. Formularz kontaktowy nie ma backendu – pokazuje potwierdzenie, ale niczego nie wysyła (jest to
> oznaczone na stronie).

## Uruchomienie

Bez terminala: zainstaluj Node.js LTS i kliknij dwukrotnie `URUCHOM-WINDOWS.bat` lub `URUCHOM-MAC.command`.
Strona otworzy się pod adresem http://localhost:3004.

```bash
cd burger-house-smash
npm install
npm run dev                    # http://localhost:3004
npm run build && npm start     # wersja produkcyjna
npm run lint && npm run typecheck
```

## System wizualny (nic nie pochodzi z poprzednich koncepcji)

| Element | Decyzja |
|---|---|
| Znak | Napis BUŁA wpisany w nieregularny kontur rozgniecionego kotleta (`components/Logo.tsx`) – ten sam kontur wraca tylko jako naklejka ceny w hero |
| Kolory | musztarda `#FCC103` (próbka tła zdjęć produktowych), węgiel blachy `#24170E`, kiszony ogórek `#2E5E37`, biel, jasna stal `#EFEDE7` |
| Kroje | **Unbounded** (szeroki, ciężki – „rozpłaszczony” jak kotlet po docisku) do nagłówków, przycisków i cen; **Onest** do tekstu |
| Przyciski | pigułki z twardym cieniem; po kliknięciu „dociskają się” (przesunięcie + spłaszczenie), jak kotlet pod prasą |
| Ruch | jedna sekwencja przy wejściu (tytuł, burger spada i „siada”, naklejka), nagłówki sekcji lądują ze spłaszczeniem, kroki filozofii odsłaniają się od dołu; `prefers-reduced-motion` wyłącza wszystko |

## Sekcje

- **Hero** – tytuł, w którym każda linia wypełnia szerokość kolumny (rozmiar ograniczony też wysokością ekranu,
  więc mieści się na laptopie), zdjęcie wychodzące za krawędź ekranu, „Zamów teraz” (tel:) i **wybór lokalu**
  jako dodatkowa nawigacja: status otwarcia na żywo (czas w Polsce), adres, dzisiejsze godziny, telefon, trasa, podstrona.
- **Menu** – 6 kategorii jako zakładki ARIA (strzałki, Home/End), 22 pozycje, duże zdjęcia, ceny, skala ostrości,
  promocja z przekreśloną ceną, przycisk „Zamów” przy każdej pozycji. Adres `/#fire-burger` otwiera właściwą kategorię.
- **Nasza filozofia** – trzy kroki procesu (kula, docisk, ser i bułka) i pochodzenie składników.
- **Galeria** – własna mozaika na 12 kolumnach, podpisy wysuwane po najechaniu, powiększenie w `<dialog>`
  (strzałki, Esc, powrót fokusu). Na telefonie pasek do przesuwania palcem z licznikiem.
- **Lokale i kontakt** – oba lokale (status, adres, godziny, telefon, mapa Google ładowana dopiero po kliknięciu),
  blok zamówień telefonicznych i formularz demonstracyjny z walidacją.
- **Stopka** – nawigacja, lokale z godzinami, social media (Instagram, TikTok, Facebook), informacje praktyczne, linki do innych koncepcji.
- Podstrony: `/lokale/warszawa`, `/lokale/grodzisk-mazowiecki`, `/regulamin`, `/polityka-prywatnosci`, strona 404.

Na telefonie: osobna kompozycja hero (tytuł → zdjęcie → opis → przyciski), pozycje menu jako wiersze ze zdjęciem
z boku, kroki filozofii jako lista, menu pełnoekranowe z pułapką fokusu, dolny pasek „Zadzwoń i zamów” po zjechaniu
poniżej hero. Brak poziomego przewijania strony (sprawdzone od 320 do 1920 px).

## Grafiki

Wszystkie 27 zdjęć wygenerowano w **Canvie** w jednej stylistyce: produkty na musztardowym tle z twardym fleszem,
kuchnia i lokale w reportażowym świetle. Projekt Canva **„BUŁA smash – baner kampanii i zdjęcia strony”**:
strona 1 to baner kampanii (obraz Open Graph `og-baner.jpg`), strony 2–28 to zdjęcia w natywnej rozdzielczości.

## Struktura

```
src/app/            strona główna (+ JSON-LD Restaurant ×2 z menu), lokale/[slug], regulamin, polityka, sitemap, robots, 404
src/components/     Header (menu mobilne, dolny pasek), Footer, Logo, Icons, OpenStatus, MapEmbed, Hours, Reveal, LegalPage
src/components/home Hero, PlacePicker, Menu, Philosophy, Gallery, Contact, ContactForm
src/data/           menu.ts (ceny w groszach), locations.ts, site.ts (telefon, nawigacja, social media)
```

Przed wdrożeniem ustaw `NEXT_PUBLIC_SITE_URL` na docelowy adres.
