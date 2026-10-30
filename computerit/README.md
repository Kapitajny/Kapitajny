# ComputerIT – strona studia

Strona studia projektowania stron internetowych i sklepów online ComputerIT: wejście z animowanym napisem
COMPUTERIT na tle nieba renderowanego w WebGL, oferta z cennikiem, pakiet promocyjny, portfolio koncepcji
demonstracyjnych z podstronami projektów oraz formularz kontaktowy z prawdziwą wysyłką (SMTP lub webhook).

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- **Tailwind CSS 4** – tokeny kolorów i typografii w `src/app/globals.css`
- **Mona Sans** (oś szerokości buduje hierarchię) i **Instrument Serif** (tylko okładki projektów) – fonty
  serwowane lokalnie przez `next/font`, bez zapytań do Google
- **nodemailer** – wysyłka zapytań przez SMTP
- **Vitest** – testy walidacji i API formularza

Wymagany **Node.js 22.13+**.

## Uruchomienie

Bez terminala: dwuklik w `URUCHOM-WINDOWS.bat` (Windows) albo `URUCHOM-MAC.command` (macOS – za pierwszym
razem prawy przycisk → **Otwórz**). Strona otworzy się pod adresem http://localhost:3000.

W terminalu:

```bash
npm install
cp .env.example .env.local     # dane kontaktowe i konfiguracja formularza
npm run dev                    # http://localhost:3000
```

Kontrole jakości:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Formularz kontaktowy

`POST /api/contact` waliduje dane (te same reguły co w przeglądarce – `src/lib/contact.ts`), ogranicza liczbę
zapytań z jednego adresu IP i odrzuca boty polem-pułapką. Zapytanie trafia do skonfigurowanych kanałów:

| Kanał   | Zmienne                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------- |
| SMTP    | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` |
| Webhook | `CONTACT_WEBHOOK_URL`, opcjonalnie `CONTACT_WEBHOOK_SECRET` (nagłówek `Authorization: Bearer`)   |

Wiadomość e-mail ma ustawione `Reply-To` na adres klienta, więc wystarczy kliknąć „Odpowiedz”. Webhook dostaje
JSON z polami formularza, etykietami rodzaju projektu i budżetu, treścią zgody i datą.

**Bez żadnego kanału formularz nie udaje wysyłki** – API zwraca 503, a użytkownik widzi komunikat, że
wiadomość nie została wysłana (oraz adres e-mail, jeśli ustawiono `NEXT_PUBLIC_CONTACT_EMAIL`).

Limit zapytań działa w pamięci procesu; przy kilku instancjach serwera zastąp go współdzielonym (np. Redis).

## Treści do uzupełnienia

- **Dane kontaktowe** – `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`. Puste pola pokazują w stopce
  „do uzupełnienia”.
- **Polityka prywatności** – `src/app/polityka-prywatnosci/page.tsx`: dane administratora, dostawcy usług
  i okres przechowywania (fragmenty oznaczone na stronie). Treść warto skonsultować z prawnikiem.
- **Adres strony** – `NEXT_PUBLIC_SITE_URL` (linki kanoniczne, mapa strony, Open Graph).

## Oferta i portfolio

- Ceny, zakresy usług, opcje formularza – `src/data/offer.ts`
- Projekty – `src/data/projects.ts`; zrzuty ekranu w `public/portfolio/<slug>/`. Projekt bez zrzutów
  (`shots: []`) dostaje okładkę typograficzną z własnych haseł – po dodaniu plików wystarczy uzupełnić `shots`.
  `liveUrl` dodaje na podstronie projektu przycisk do opublikowanej wersji demonstracyjnej.

Wszystkie projekty są oznaczone jako koncepcje demonstracyjne. Zrzuty NOIR COFFEE, VANTOR Automotive,
Sklepu KAPITAJNY i InterPodatki wykonano z działających wersji tych stron.

## Struktura

```
src/
  app/                    strona główna, /portfolio/[slug], /polityka-prywatnosci, API, SEO (robots, sitemap, OG)
  components/hero/        niebo WebGL (SkyCanvas), szkic strony (Blueprint), napis COMPUTERIT (Wordmark)
  components/layout/      nagłówek z menu (<dialog>), stopka
  components/sections/    O mnie, Usługi i cennik, Portfolio, Pakiet promocyjny, Kontakt
  components/portfolio/   ramki zrzutów, okładki projektów
  config/site.ts          nazwa, nawigacja, dane kontaktowe
  data/                   oferta i projekty
  lib/                    walidacja formularza, wysyłka (SMTP / webhook), limity żądań
tests/                    testy Vitest
```

## Animacje i dostępność

- Wejście COMPUTERIT to czyste CSS (działa przed załadowaniem JavaScriptu, nie blokuje strony – treść jest
  dostępna od razu). Przy kolejnych odwiedzinach wejście jest krótsze (`localStorage`, klucz `cit-intro`).
- Niebo renderuje się w połowie rozdzielczości, maks. ~30 kl./s, i zatrzymuje poza ekranem oraz w ukrytej karcie.
- `prefers-reduced-motion`: bez ruchu tła i animacji przewijania, napis pojawia się prostym przenikaniem.
- Menu to modalny `<dialog>`: Esc i kliknięcie w przyciemnione tło zamykają je, fokus wraca na przycisk.
