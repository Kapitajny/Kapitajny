# FORMA ATELIER — strona pracowni architektury wnętrz

Projekt demonstracyjny agencji **ComputerIT**: strona fikcyjnej warszawskiej pracowni architektury wnętrz w segmencie
premium. Ma pełnoekranowy film w hero, redakcyjną galerię sześciu realizacji z podstronami, ofertę, proces, formularz
zapytania i przejścia między stronami.

> Dane kontaktowe, opinie klientów i realizacje są **przykładowe**. Opinie są wyraźnie oznaczone na stronie jako
> demonstracyjne.

## Stack
- **Next.js 16.4** (App Router, Turbopack, statyczne generowanie), **React 19.3** (`<ViewTransition>`), **TypeScript**
- **Tailwind CSS 4** — tokeny marki w `src/app/globals.css`
- **Motion 14** (`motion/react`) — odsłanianie zdjęć, menu, oś procesu, paralaksa
- **Lucide** — ikony interfejsu
- `next/font` (Cormorant Garamond + Manrope), `next/image` (AVIF/WebP, blur placeholder)
- QA: **Playwright** + **axe-core**

## Uruchomienie
```bash
cd forma-atelier
npm install
npm run dev          # http://localhost:3000
```
Kontrole jakości:
```bash
npm run lint && npm run typecheck && npm run build
```
Testy przeglądarkowe (na uruchomionym serwerze):
```bash
node qa/interactions.cjs http://localhost:3000   # menu, formularz, galeria, film, reduced motion, linki
node qa/screens.cjs http://localhost:3000        # zrzuty desktop/mobile + błędy konsoli -> qa/screens/
node qa/a11y-perf.cjs http://localhost:3000      # axe (WCAG 2.1 AA) + LCP/CLS — najlepiej na `npm start`
```

## Wdrożenie
Aplikacja żyje w podkatalogu `forma-atelier/` repozytorium. Na Vercel ustaw **Root Directory = `forma-atelier`**. Na
innych platformach uruchom `npm run build && npm start` w tym katalogu (Node 20.9+).

Zmienne środowiskowe opisuje `.env.example`:
- `NEXT_PUBLIC_SITE_URL` — docelowy adres (canonical, sitemap, Open Graph).
- `CONTACT_WEBHOOK_URL` — patrz niżej.

## Formularz kontaktowy — co trzeba podłączyć
Frontend jest kompletny: walidacja na żywo i przy wysyłce, komunikaty przy polach, fokus na pierwszym błędnym polu,
pole-pułapka na boty i wstępne zaznaczenie zakresu z linków „Zapytaj o wycenę” (`/kontakt?zakres=…`).

Endpoint `POST /api/contact` waliduje dane ponownie na serwerze (`src/lib/contact.ts`, ta sama logika co w
przeglądarce):
- **bez `CONTACT_WEBHOOK_URL`** odpowiada `503 not_configured`. Formularz pokazuje wtedy, że wiadomość **nie została
  wysłana**, i proponuje otwarcie gotowego e-maila. Niczego nie udaje.
- **z `CONTACT_WEBHOOK_URL`** przekazuje JSON (imię, e-mail, telefon, rodzaj nieruchomości, metraż, zakres, opis) metodą
  POST, np. do Make, Zapier, n8n, Formspree albo własnej funkcji wysyłającej e-mail (Resend, Postmark, SMTP).

Przed publikacją: uzupełnij dane administratora w `src/app/polityka-prywatnosci/page.tsx` i `src/data/site.ts`,
a politykę prywatności daj do weryfikacji prawnej.

## Film i fotografie
Wszystkie obrazy i film to **autorskie rendery 3D** (Blender/Cycles) przygotowane dla tego projektu. Szczegóły,
scenopis, parametry plików i prompt do ewentualnego wariantu z generatora AI: [`docs/FILM.md`](docs/FILM.md).
Skrypty scen: [`production/3d/`](production/3d/).

Podmiana zdjęć na prawdziwe fotografie realizacji: zastąp pliki w `src/assets/photos/` (te same nazwy) i popraw
teksty alternatywne w `src/data/projects.ts`.

## Struktura
```
src/
  app/                    strony: /, /o-pracowni, /realizacje, /realizacje/[slug], /oferta, /proces, /kontakt,
                          /polityka-prywatnosci, api/contact, sitemap, robots, ikona
  components/
    home/                 HeroVideo, About, Portfolio, Offer, Process, Values, Testimonials, CtaBand
    layout/               SiteHeader, MenuOverlay, SiteFooter
    projects/             ProjectCard (morph do hero), ProjectGallery, Lightbox
    contact/ContactForm   formularz z walidacją
    ui/                   Reveal/RevealImage, PageTransition, PageIntro
  data/                   site.ts (kontakt, menu), projects.ts (realizacje), content.ts (oferta, proces, wartości, opinie)
  lib/contact.ts          wspólna walidacja formularza
  assets/                 zdjęcia (import statyczny -> wymiary i blur placeholder)
public/video/             film hero: 1080p WebM/MP4, 720p MP4/WebM
docs/                     KONCEPCJA.md (research i koncepcja), FILM.md
production/3d/            skrypty Blendera do odtworzenia filmu i zdjęć
qa/                       skrypty Playwright
```
