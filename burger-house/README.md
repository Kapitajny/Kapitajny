# BUŁA burger house – strona burgerowni

Strona fikcyjnej sieci burgerowni z dwoma lokalami (Warszawa, ul. Marszałkowska 25 oraz Grodzisk Mazowiecki,
ul. 11 Listopada 12): hero, bestsellery, promocja, menu w 6 kategoriach (22 pozycje), „O nas”, lokale z
podstronami i mapą, zamawianie telefoniczne, formularz kontaktowy, regulamin i polityka prywatności.

> **Projekt demonstracyjny.** Marka, numery telefonów, godziny otwarcia, dane firmy i dokumenty prawne są
> przykładowe i wymagają weryfikacji przed uruchomieniem prawdziwej działalności. Formularz kontaktowy nie ma
> backendu – pokazuje potwierdzenie, ale niczego nie wysyła (jest to wyraźnie oznaczone na stronie).

## Uruchomienie

Najprościej (bez terminala): zainstaluj Node.js LTS, a potem kliknij dwukrotnie `URUCHOM-WINDOWS.bat`
lub `URUCHOM-MAC.command`. Strona otworzy się pod adresem http://localhost:3001.

W terminalu:

```bash
cd burger-house
npm install
npm run dev          # http://localhost:3001
npm run build && npm start   # wersja produkcyjna
```

Kontrole jakości: `npm run lint && npm run typecheck && npm run build`.

## Identyfikacja marki

| Element   | Decyzja |
|-----------|---------|
| Nazwa     | **BUŁA** burger house – potoczna, polska „buła”, krótka i łatwa do zapamiętania |
| Hasło     | **Robione teraz. Nie wcześniej.** – obietnica smażenia dopiero po zamówieniu |
| Logo      | Znak słowny BUŁA; kreska litery Ł to czerwone, ukośne cięcie |
| Motyw     | To samo cięcie wraca jako ścięty róg przycisków, znaczników cen i etykiet |
| Kolory    | czerwień `#D7141A`, czerń `#000000`, biel `#FFFFFF`, krem bułki `#F6EEDF` (+ `#A80F14` hover, `#FF5A52` czerwony tekst na czarnym) |
| Krój      | Archivo (zmienna szerokość): nagłówki ściśnięte 62,5 % i bardzo grube, tekst w normalnej szerokości |

Czerń zdjęć produktowych jest czysta (`#000`), więc karty i sekcje zlewają się z fotografiami bez ramek.

## Struktura

```
src/
  app/
    page.tsx                  strona główna + dane strukturalne schema.org (Restaurant ×2, Menu)
    lokale/[slug]/page.tsx    podstrony lokali (statyczne): zdjęcie, godziny, telefon, mapa na kliknięcie
    regulamin/                regulamin demonstracyjny
    polityka-prywatnosci/     polityka prywatności demonstracyjna
    sitemap.ts, robots.ts, icon.svg, not-found.tsx
    globals.css               ★ system wizualny: tokeny, typografia, komponenty, responsywność
  components/
    Header.tsx                nagłówek z numerem telefonu, przyciskiem „Zadzwoń i zamów” i menu mobilnym
    Footer.tsx                stopka: logo, linki, oba lokale, telefon, godziny, dokumenty
    home/                     sekcje strony głównej (Hero, Bestsellers, Promo, Menu, About, Locations, Contact)
  data/
    menu.ts                   ★ kategorie, produkty, ceny (w groszach), bestsellery, promocja
    locations.ts              ★ lokale, adresy, godziny, telefony
    site.ts                   ★ nazwa, hasło, numer do zamówień, nawigacja
public/images/                zdjęcia (nazwy plików jak w data/menu.ts i komponentach)
scripts/potnij-eksport-canva.py   tnie eksport z Canvy na pojedyncze zdjęcia
```

## Grafiki

Zdjęcia produktów, hero, baner promocyjny, zdjęcia kuchni, składników i wnętrz lokali zostały wygenerowane
w **Canvie** (narzędzie „generate image”) w jednej stylistyce: czyste czarne tło, ciepłe światło z lewej,
ciemny kamień. Baner promocyjny „Zestaw Fire” złożono w Canvie z tych zdjęć i kolorów marki – służy też jako
obraz Open Graph (`og-baner.jpg`).

W Canvie jest projekt **„BUŁA burger house promotional web banner”**: strona 1 to baner, strony 2–4 to arkusze
ze wszystkimi zdjęciami w natywnej rozdzielczości. Aby odświeżyć zdjęcia: pobierz projekt jako JPG
(4 pliki), nazwij je `p1.jpg`–`p4.jpg` i uruchom `python3 scripts/potnij-eksport-canva.py <katalog> public/images`.

Trzy zdjęcia pochodzą od właściciela projektu: `cheddar-lava.jpg`, `house-smash.jpg`, `zapiekanka.jpg`.

Zdjęcia są serwowane przez `next/image` (AVIF/WebP, rozmiary dopasowane do układu, leniwe ładowanie poza hero).

## Dostępność i SEO

- semantyczne sekcje z nagłówkami, link „Przejdź do treści”, widoczny fokus, kontrast WCAG AA,
- zakładki menu zgodne z wzorcem ARIA (strzałki, Home/End), menu mobilne z pułapką fokusu i obsługą Esc,
- formularz: etykiety, `aria-invalid`, komunikaty błędów powiązane z polami, fokus na pierwszym błędzie,
- `prefers-reduced-motion` wyłącza animacje,
- metadane i Open Graph na każdej stronie, kanoniczne adresy, sitemap, robots, dane strukturalne schema.org.

Ustaw `NEXT_PUBLIC_SITE_URL` na docelowy adres strony przed budowaniem wersji produkcyjnej.
