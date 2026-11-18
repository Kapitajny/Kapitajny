# PULSO – strona agencji reklamowej

Strona **PULSO Digital Advertising Agency** („Your growth. Our strategy.”): kampanie Meta Ads, Google Ads, YouTube Ads
i TikTok Ads. Next.js 16 (App Router) eksportowany statycznie, TypeScript, Tailwind CSS 4.

> **Wersja robocza.** Portfolio i raporty zawierają wyraźnie oznaczone **dane demonstracyjne**. Opinie są pustym
> stanem, statystyki są ukryte, dane firmy i kontaktowe to puste pola, a dokumenty prawne to projekty z polami
> `[do uzupełnienia]`. Dopóki `site.url` jest pusty, strona blokuje indeksowanie w wyszukiwarkach.

## Uruchomienie

Wymagany Node.js 22.13+.

```bash
npm install
npm run dev          # http://localhost:3000
```

Kontrole jakości:

```bash
npm run lint && npm run typecheck && npm test && npm run build   # build → folder out/
```

Testy w przeglądarce (Playwright, na zbudowanej stronie):

```bash
npx serve out -l 4310 &
node tests/e2e/deeplink.mjs      # głębokie linki (#kontakt) i przypięty proces
node tests/e2e/stable-cta.mjs    # przycisk w portfolio da się kliknąć
AXE_CORE=/ścieżka/do/axe.min.js node tests/e2e/axe.mjs   # dostępność (axe-core)
```

## Co uzupełnić przed publikacją (★ = jeden plik)

| Co | Gdzie |
|---|---|
| ★ Adres strony (włącza indeksowanie i mapę strony), e-mail, telefon, dane firmy, profile społecznościowe | `src/config/site.ts` → `site` |
| ★ Wysyłka formularza (Formspree, Web3Forms lub webhook) | `src/config/site.ts` → `contactForm.endpoint` lub zmienna `NEXT_PUBLIC_CONTACT_ENDPOINT` |
| ★ Ceny i zakres pakietów (robocze) | `src/config/pricing.ts` |
| ★ Statystyki agencji (sekcja ukryta, dopóki `enabled: false`) | `src/config/site.ts` → `agencyStats` |
| ★ Opinie klientów (pusta lista = uczciwy pusty stan) | `src/data/content.ts` → `testimonials` |
| ★ Realizacje i raporty (zamień dane demo, ustaw `isDemo: false`) | `src/data/demo.ts` |
| Treści usług, misji, procesu, FAQ | `src/data/services.ts`, `src/data/content.ts` |
| Polityka prywatności, informacje prawne (projekty do weryfikacji przez prawnika) | `src/app/polityka-prywatnosci`, `src/app/informacje-prawne` |

Dopóki `contactForm.endpoint` jest pusty, formularz działa w całości, ale **niczego nie wysyła** i mówi to wprost
(oferuje skopiowanie podsumowania). Po ustawieniu endpointu pokazuje potwierdzenie tylko po udanej wysyłce.

## Publikacja

Strona to statyczne pliki w `out/`. Publikacja w podkatalogu (np. GitHub Pages jako `demo/pulso`):

```bash
PAGES_BASE_PATH=/demo/pulso npm run build
```

## Struktura

```
src/
  app/                 layout (fonty, metadane), strona główna, podstrony prawne, robots, sitemap
  components/sections  sekcje strony (Hero + plan, Misja, Usługi, Portfolio, Raporty, Proces, Opinie, Cennik, FAQ, Kontakt)
  components/form      wieloetapowy formularz kontaktowy
  config/              ★ marka, kontakt, formularz, statystyki, cennik
  data/                treści, usługi, dane demonstracyjne
  lib/                 nawigacja do formularza (openContact), logika formularza, kolory kanałów
tests/                 testy jednostkowe i DOM (vitest), tests/e2e – testy w przeglądarce
plans/                 plany z audytu (skill improve) i ich status
PRODUCT.md             kontekst produktu (skill impeccable)
```

Wszystkie przyciski kontaktowe korzystają z jednej funkcji `openContact()` (`src/lib/contact-intent.ts`) i jednego
formularza `#kontakt`. Wybór pakietu lub usługi jest przekazywany do formularza.

## System wizualny

Kierunek „Media plan”: papier planu, siatka tygodni, tusz i cztery kolory kanałów. Pełny pasek oznacza pozycję
zarezerwowaną, przerywany kontur pozycję wstępną. Font: Archivo (zmienny: grubość i szerokość, przycięty do znaków
używanych po polsku). Tokeny są w `src/app/globals.css`, opis systemu w `DESIGN.md`.
