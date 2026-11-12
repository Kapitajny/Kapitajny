# Wieś Soków – strona producenta soków ze sklepem

Strona fikcyjnej firmy Wieś Soków: prezentacja marki, podstrony „O nas” i „Nasza produkcja”, sklep z filtrowaniem i
sortowaniem, karta produktu, koszyk oraz demonstracyjny proces zamówienia.

> **Projekt demonstracyjny agencji ComputerIT.** Firma, produkty, ceny, opinie, dane kontaktowe i warunki dostawy są
> przykładowe. Formularz kontaktowy i zamówienie niczego nie wysyłają, a płatności nie są podłączone.

## Uruchomienie

Bez terminala: dwuklik na `URUCHOM-WINDOWS.bat` (Windows) albo `URUCHOM-MAC.command` (Mac). Wymagany Node.js 22.13+.

W terminalu:

```bash
npm install
npm run dev        # http://localhost:3200
```

Kontrole jakości:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- Style: zwykły CSS z tokenami w `src/app/globals.css` i CSS Modules przy komponentach (bez frameworka CSS)
- Czcionki Cormorant Garamond i Inter przez `next/font` (hostowane lokalnie)
- Zdjęcia przez `next/image` (AVIF/WebP, rozmiary responsywne, placeholdery)
- **Vitest** – testy logiki koszyka, dostawy i formatowania kwot

## Struktura

```
src/
  app/                       strony: /, /o-nas, /produkcja, /sklep, /sklep/[slug], /koszyk,
                             /zamowienie, /zamowienie/potwierdzenie, /kontakt, dokumenty, 404, robots, sitemap
  assets/packshots/          zdjęcia opakowań (wycięte z tła, WebP z przezroczystością)
  assets/photos/             fotografie sadu, owoców, produkcji i lifestyle
  components/home/           sekcje strony głównej (hero + 8 sekcji)
  components/shop/           lista produktów, filtry, karta produktu
  components/cart/           magazyn koszyka (localStorage), wysuwany panel, pozycje
  components/checkout/       koszyk, formularz zamówienia, potwierdzenie
  components/layout/         nagłówek, stopka, logo, nagłówek podstrony
  data/products.ts           ★ smaki, produkty, ceny (w groszach), opisy, składy
  data/site.ts               ★ nazwa, nawigacja, dane kontaktowe, linki do dokumentów
  data/testimonials.ts       opinie przykładowe
  lib/order.ts               ★ dostawa, płatności, próg darmowej wysyłki, wyliczenia
  lib/money.ts               formatowanie kwot i odmiana liczebników
tests/                       testy Vitest
```

Pliki oznaczone ★ wystarczą do zmiany oferty, cen i warunków dostawy.

## Co jest demonstracyjne

| Element | Jak działa teraz | Co podłączyć w prawdziwym sklepie |
| --- | --- | --- |
| Koszyk | `localStorage` przeglądarki | bez zmian albo koszyk po stronie serwera |
| Zamówienie | walidacja w przeglądarce, zapis w `sessionStorage`, strona potwierdzenia | API zamówień, e-mail z potwierdzeniem |
| Płatności | wybór „przelew” / „przy odbiorze”, bez płatności online | operator płatności (np. Przelewy24, Stripe) |
| Formularz kontaktowy | walidacja i komunikat o trybie demonstracyjnym | skrzynka e-mail lub API |
| Dokumenty prawne | strony z konspektem i oznaczeniem „Treść do uzupełnienia” | treść przygotowana przez prawnika |
| Telefon i e-mail | zwykły tekst, celowo bez linków `tel:` / `mailto:` | prawdziwe dane i linki |

Strona jest domyślnie wyłączona z indeksowania (`robots`, meta `noindex`). Dla prawdziwego wdrożenia ustaw
`NEXT_PUBLIC_SITE_URL` i `NEXT_PUBLIC_ALLOW_INDEXING=true` (patrz `.env.example`).

## Zdjęcia i licencje

- **Opakowanie „Wieś Soków”, sad, zbiór i maszyny** (`produkcja-ciagnik`, `produkcja-zbior`, `produkcja-kombajn`,
  `produkcja-pielegnacja`, `sad-drabina`, `sad-rzad`, `jablka-galaz`, packshoty): materiały dostarczone do projektu.
  **Przed publikacją w portfolio trzeba potwierdzić prawa do każdego z tych zdjęć.**
- **Pozostałe fotografie** pochodzą z serwisu Pexels (licencja Pexels, bezpłatne użycie komercyjne). Numer w nawiasie
  to identyfikator zdjęcia: `pexels.com/photo/<id>`.
  hero-sad-jablonie (35155442), hero-grusze (8245622), hero-jablka-galaz (635705), historia-aleja-sadu (5529017),
  smak-jablka (30875359), smak-gruszki-stol (7250025), dom-sniadanie (7653307), dom-rodzinny-stol (5638745),
  dom-spotkanie (5638620), dom-kuchnia (6099159), produkcja-skrzynki (2949140), sad-kwitnacy (12029646),
  gruszki-siatka (4856568), gruszki w packshotach (7636158).
- Packshoty soku gruszkowego i jabłkowo-gruszkowego to fotomontaże: opakowanie z dostarczonego zdjęcia z dodanymi
  gruszkami. Mają charakter poglądowy.
- Dwa dostarczone zdjęcia ze znakami wodnymi banków zdjęć oraz zdjęcie opakowania innej marki nie zostały użyte.
