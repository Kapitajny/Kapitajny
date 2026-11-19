# Studio tatuażu w stylu japońskim — Warszawa

Strona studia tatuażu inspirowanego japońską sztuką: galeria prac, rozbudowana sekcja „O nas”, specjalizacje,
opinie, kalkulator ceny, FAQ, pełnoekranowa stopka oraz wieloetapowy formularz **Book your tattoo**
(Tattoo Project Builder) z prawdziwą wysyłką zgłoszeń i załączników.

> **Wersja robocza.** Nazwa „SUMI” jest nazwą roboczą (brief: `[NAZWA STUDIA]`). Dane kontaktowe, cennik,
> odpowiedzi FAQ, opinie i dokumenty prawne są oznaczone na stronie jako „do uzupełnienia”. Zdjęcia prac są
> poglądowe — patrz sekcja **Zdjęcia** poniżej.

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- **Tailwind CSS 4** — tokeny kolorów i typografii w `src/app/globals.css`
- Fonty: **Shippori Mincho** (nagłówki, tekst do czytania, znaki japońskie) i **Zen Kaku Gothic New** (interfejs)
- **Nodemailer** (wysyłka zgłoszeń przez SMTP), **Vitest** (testy)

Wymagany **Node.js 22.13+**.

## Uruchomienie

Bez terminala: dwuklik na `URUCHOM-WINDOWS.bat` (Windows) albo `URUCHOM-MAC.command` (Mac — za pierwszym razem
prawy przycisk → **Otwórz**). Strona otworzy się pod adresem http://localhost:3000.

W terminalu:

```bash
cd tattoo-studio
npm install
cp .env.example .env.local     # opcjonalnie: konfiguracja odbioru zgłoszeń
npm run dev                    # http://localhost:3000
```

Kontrole jakości:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Co gdzie uzupełnić

| Plik | Zawartość |
| --- | --- |
| `src/config/site.ts` | ★ nazwa studia, znak pieczęci, adres, e-mail, telefon, godziny, media społecznościowe, dane firmy |
| `src/config/work.ts` | ★ zdjęcia prac (galeria, hero), flaga `PORTFOLIO_IS_SAMPLE` |
| `src/config/specialties.ts` | specjalizacje, opisy i przypisane zdjęcia |
| `src/config/pricing.ts` | ★ wartości kalkulatora ceny, flaga `PRICING_CONFIRMED` |
| `src/config/faq.ts` | ★ pytania i odpowiedzi; fragmenty `[[…]]` są widoczne jako „do uzupełnienia” |
| `src/config/reviews.ts` | prawdziwe opinie klientów (pusta lista = oznaczone miejsca na opinie) |
| `src/config/booking.ts` | opcje formularza (style, miejsca, rozmiary, budżety) i limity załączników |
| `src/app/regulamin`, `src/app/polityka-prywatnosci` | dokumenty prawne (wersje robocze) |

Puste pola kontaktowe nigdy nie są renderowane jako linki ani przyciski — strona pokazuje wtedy wyraźne
oznaczenie „do uzupełnienia”.

## Zdjęcia

Pliki leżą w `public/images/work/`, opisy (alt, podpis, miejsce na ciele, styl) w `src/config/work.ts`.

Dostarczone zdjęcia **nie są realizacjami studia**: trzy mają znaki wodne innych studiów (Aggie Tattoo,
Genrava / Zajawa Gdańsk, Gans Tattoo — podpisane w galerii), a żadne nie przedstawia pracy w stylu japońskim.
Dlatego `PORTFOLIO_IS_SAMPLE = true` oznacza je na stronie jako poglądowe, a specjalizacje *Japanese
Traditional* i *Japanese Neo-Traditional* pokazują panel „miejsce na zdjęcie pracy w tym stylu”.

Przed publikacją: podmień zdjęcia na własne prace studia (najlepiej min. 1600 px po dłuższym boku — obecne mają
ok. 200–740 px), usuń wpisy z `credit`, przypisz zdjęcia specjalizacjom i ustaw `PORTFOLIO_IS_SAMPLE = false`.

## Formularz „Book your tattoo”

Sześć kroków: dane kontaktowe → koncepcja → styl i miejsce → rozmiar i budżet → zdjęcia inspiracji → podsumowanie
z przyciskami **Edit** i dwiema wymaganymi zgodami (nigdy nie są zaznaczone domyślnie).

- Walidacja jest wspólna dla przeglądarki i serwera (`src/lib/booking/schema.ts`).
- Odpowiedzi zapisują się w pamięci sesji przeglądarki — nie znikają przy odświeżeniu; szkic jest czyszczony po wysłaniu.
- Kalkulator ceny przekazuje wybrane parametry do formularza (`/rezerwacja?size=…&placement=…&style=…`).
- Zdjęcia są w przeglądarce zmniejszane do 2000 px i zapisywane jako JPEG — usuwa to metadane EXIF (w tym GPS)
  i utrzymuje całe zgłoszenie w limitach typowych hostingów. Limit: 5 zdjęć (JPG, JPEG, PNG, WEBP), do 20 MB każde
  przed kompresją.
- Ekran „Thank you” pojawia się **wyłącznie** po potwierdzeniu przyjęcia zgłoszenia przez serwer.

### Odbiór zgłoszeń (`POST /api/booking`)

Skonfiguruj co najmniej jeden kanał w `.env.local` / panelu hostingu (szczegóły w `.env.example`):

1. **E-mail (SMTP)** — `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `BOOKING_EMAIL_FROM`, `BOOKING_EMAIL_TO`.
   Studio dostaje czytelne podsumowanie z załącznikami; „Odpowiedz” trafia do klienta.
2. **Webhook** — `BOOKING_WEBHOOK_URL` (+ `BOOKING_WEBHOOK_SECRET`). JSON z danymi, podsumowaniem i załącznikami
   (base64). Podpis: nagłówek `X-Booking-Signature: sha256=<HMAC-SHA256 z "${X-Booking-Timestamp}.${body}">`.
3. **Archiwum na dysku** — `BOOKING_STORAGE_DIR` (np. `data/bookings`, poza `public/`): `RRRR/MM/<numer>/request.json`
   i załączniki z uprawnieniami tylko dla właściciela. Wymaga serwera z trwałym dyskiem (nie serverless).

Zgłoszenie jest przyjęte, gdy dotrze do studia: jeśli skonfigurowano e-mail lub webhook, co najmniej jeden z nich
musi się powieść (samo archiwum wtedy nie wystarcza). W przeciwnym razie klient widzi komunikat błędu, a jego
odpowiedzi pozostają w formularzu.

**Bez konfiguracji** formularz działa w pełni, ale na górze i przy przycisku wysyłania informuje, że wysyłka nie
jest jeszcze aktywna, a przycisk jest zablokowany — nic nie jest symulowane.

### Bezpieczeństwo i ochrona przed spamem

- walidacja wszystkich pól po stronie serwera (tylko znane pola i wartości z list),
- ukryte pole-pułapka (honeypot) i minimalny czas wypełniania,
- limit 5 zgłoszeń / 10 min na adres IP (w pamięci procesu — przy wielu instancjach zastąp np. Redisem),
- opcjonalnie **Cloudflare Turnstile** (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`),
- limity liczby i rozmiaru plików oraz sprawdzanie rzeczywistego formatu po sygnaturze bajtów,
- nazwy plików nadawane przez serwer (`reference-1.jpg`), nigdy z nazwy przesłanej przez użytkownika,
- ochrona przed podwójnym wysłaniem (identyfikator zgłoszenia),
- nagłówki bezpieczeństwa (HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy).

## Struktura

```
src/
  app/                      strony: /, /rezerwacja, /regulamin, /polityka-prywatnosci, 404, robots, sitemap
    api/booking             odbiór zgłoszeń z formularza
  components/
    nav/Dock.tsx            nawigacja w stylu doku macOS
    home/                   Hero, Gallery (lightbox), About, Specialties, Reviews, Pricing, Faq
    booking/                Tattoo Project Builder: kroki, pola, upload zdjęć, sylwetka, Turnstile
    layout/Footer.tsx       pełnoekranowa stopka
    ui/                     wzory Asanoha/Seigaiha/Kumiko (SVG), pieczęć, ikony, animacje
  config/                   ★ treści i dane do uzupełnienia (patrz tabela wyżej)
  lib/booking/              walidacja (wspólna), sygnatury plików, kompresja zdjęć
  lib/server/               konfiguracja, wysyłka (SMTP / webhook / archiwum), limity żądań
tests/                      testy Vitest (walidacja, pliki, kalkulator, API formularza)
```

## Przed publikacją

- [ ] Nazwa studia i znak pieczęci w `src/config/site.ts`.
- [ ] Dane kontaktowe, godziny, media społecznościowe, link do opinii.
- [ ] Własne zdjęcia prac; `PORTFOLIO_IS_SAMPLE = false`; zdjęcia dla specjalizacji japońskich.
- [ ] Cennik w `src/config/pricing.ts`; `PRICING_CONFIRMED = true`.
- [ ] Odpowiedzi FAQ (usuń wszystkie `[[…]]`).
- [ ] Prawdziwe opinie (za zgodą autorów) albo `SHOW_REVIEW_PLACEHOLDERS = false`.
- [ ] Dane firmy i treść dokumentów prawnych — weryfikacja przez prawnika (m.in. okres przechowywania zgłoszeń,
      dostawcy usług, zasady zadatków i odwołań).
- [ ] Kanał odbioru zgłoszeń (SMTP / webhook / archiwum) i wysłanie testowego zgłoszenia na produkcji.
- [ ] `NEXT_PUBLIC_SITE_URL`, HTTPS, a po uzupełnieniu danych `NEXT_PUBLIC_ALLOW_INDEXING=true`.
