# Swoboda – strona studia tańca

Jednostronicowy serwis fikcyjnej szkoły tańca dla dorosłych „Swoboda”: oferta pięciu stylów, filtrowany grafik,
instruktorzy, cennik, wydarzenia, FAQ, formularz zapisu na lekcję próbną, kontakt, newsletter i dokumenty prawne.

> **Projekt demonstracyjny (portfolio).** Historia studia, instruktorzy, grafik, ceny, wydarzenia, opinie,
> adres, telefon i e-mail są przykładowe i oznaczone tak na stronie. Formularze nie wysyłają danych.

## Stack

Ten sam co w projekcie NOIR COFFEE w katalogu nadrzędnym: **Next.js 16** (App Router, Turbopack), **React 19**,
**TypeScript**, **Tailwind CSS 4**, **Vitest**. Strona jest w całości statyczna (brak backendu i bazy danych).

## Uruchomienie

```bash
cd szkola-tanca
npm install
npm run dev            # http://localhost:3000
```

Bez terminala: dwuklik na `URUCHOM-WINDOWS.bat` lub `URUCHOM-MAC.command` (wymaga Node.js LTS).

Kontrole jakości:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Wersja statyczna (publikacja jako link)

```bash
npm run export:artifact   # → katalog artifact/
```

Skrypt `scripts/export-artifact.mjs` renderuje te same komponenty do statycznego HTML (z zamiennikami
`next/image`, `next/link` i `next/navigation` z `scripts/artifact/shims`), dołącza skompilowany CSS i skrypt
hydratacji. Wynik działa bez serwera Next.js, ze ścieżkami względnymi – na dowolnym hostingu plików albo
jako artefakt na claude.ai. Wszystkie interakcje (filtry, formularze, okna, galeria) działają tak samo.

## Struktura

```
assets-source/            oryginalne grafiki (bez zmian)
scripts/grade-photos.py   korekta koloru zdjęć do palety + kadry portretów instruktorów
src/
  app/                    strona główna, /polityka-prywatnosci, /regulamin, 404, robots, sitemap, ikona
  app/globals.css         ★ system wizualny: paleta, typografia, przyciski, pola formularzy
  config/site.ts          ★ nazwa, nawigacja, dane kontaktowe, media społecznościowe
  config/photos.ts        ★ mapa zdjęć (plik → opis alternatywny)
  data/                   ★ style, poziomy, grafik, instruktorzy, cennik, wydarzenia, FAQ, opinie
  lib/                    filtrowanie grafiku i walidacja formularzy (z testami w tests/)
  components/sections/    sekcje strony głównej
  components/schedule/    wspólny stan: filtry grafiku i wypełnianie formularza z innych sekcji
```

## System wizualny

Paleta jest zamknięta – w `globals.css` wyłączono domyślne kolory Tailwinda, więc dostępne są tylko klasy
`ivory` (#F7F2EE), `blush` (#E8CFCF), `rose` (#A86F79), `wine` (#743D4B) i `cocoa` (#34272A).
Zgaszony róż służy wyłącznie do detali i dużego tekstu (kontrast 3,6:1 na ciepłej bieli), pudrowy róż – tylko
jako tło. Typografia to jedna rodzina, **Bricolage Grotesque** (serwowana lokalnie przez `next/font`):
zwężone, ciasno składane nagłówki i tekst w pełnej szerokości.

Motywy specyficzne dla tańca: odliczanie „5, 6, 7, 8” w hero (jednorazowe „wybicie” cyfr w rytmie ok. 120 BPM),
znaczniki z taśmy na parkiecie przy zasadach filozofii, karnety z dziurkami (liczba dziurek = liczba wejść)
i grafik jako tygodniowa siatka. Sekcje to zaokrąglone panele (`.band`) zamiast cienkich linii.

## Zdjęcia

Trzy dostarczone grafiki (`assets-source/`) miały fioletowe oświetlenie spoza palety. Skrypt
`scripts/grade-photos.py` przesuwa wyłącznie barwy fioletowo-niebieskie w stronę zgaszonego różu (skóra,
drewno i biel bez zmian) i wycina cztery portrety instruktorów ze zdjęcia zespołu. Oryginały pozostają nietknięte.

| Plik | Gdzie |
| --- | --- |
| `class-joy` | hero, zakładki „Pierwsze kroki” i „Hip-hop” (kadry), galeria |
| `team-motion` | „O nas”, zakładka „Taniec współczesny” (kadr), portrety instruktorów, galeria |
| `studio-hall` | „Nasze studio”, zakładka „Balet” (kadr na drążki), galeria |

Brak zdjęcia z zajęć high heels – w tym miejscu jest oznaczony placeholder (`styles.ts`, `photo: null`).
Nowe zdjęcia: dodaj plik do `assets-source/`, uruchom skrypt (`pip install pillow numpy`) lub wgraj gotowy
plik do `src/assets/photos/` i podłącz go w `src/config/photos.ts`.

## Przed publikacją prawdziwej strony

- [ ] Zastąpić dane demonstracyjne: `config/site.ts` (adres, telefon, e-mail, media społecznościowe), `data/*`
      (grafik, ceny, instruktorzy, wydarzenia), historię w sekcji „O nas”; usunąć oznaczenia „przykładowe”.
- [ ] Zastąpić opinie autentycznymi wypowiedziami (za zgodą autorów).
- [ ] Dodać prawdziwe zdjęcia instruktorów, zajęć high heels i więcej zdjęć do galerii (z prawami do publikacji).
- [ ] Podłączyć formularz zapisu (np. system rezerwacji lub e-mail) i newsletter (dostawca z double opt-in);
      zaktualizować komunikaty sukcesu i politykę prywatności o odbiorców danych.
- [ ] Uzupełnić i zweryfikować z prawnikiem politykę prywatności i regulamin.
- [ ] Zastąpić schematyczną mapę prawdziwą lokalizacją (np. mapa ładowana po zgodzie) i dodać informacje o dostępności.
- [ ] Ustawić `NEXT_PUBLIC_SITE_URL`, a po uzupełnieniu danych `NEXT_PUBLIC_ALLOW_INDEXING=true`.
