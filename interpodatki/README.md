# InterPodatki – serwis demonstracyjny biura rachunkowego

Kompletny serwis demonstracyjny fikcyjnej marki **InterPodatki** (księgowość, obsługa podatkowa, kadry i płace)
przygotowany przez ComputerIT jako przykład realizacji premium.

> **Projekt demonstracyjny.** Marka, ceny, dane kontaktowe i dokumenty są fikcyjne lub przykładowe. Serwis nie
> świadczy usług, nie wysyła e-maili, nie łączy się z operatorem płatności i nie pobiera środków.

## Stack

- **Next.js 16.4** (App Router, Turbopack), **React 19.3**, **TypeScript** (strict)
- **Tailwind CSS 4** – tokeny kolorów, typografii i cieni w `src/app/globals.css`
- Czcionki **Newsreader** (nagłówki) i **Geist** (interfejs, cyfry tabelaryczne) przez `next/font` – hostowane lokalnie
- **Vitest** – testy jednostkowe logiki cen, walidacji i zamówień
- **Playwright + node:test** – testy end-to-end, **axe-core** – automatyczne testy WCAG 2.2

Bez bazy danych i bez CMS – demonstracyjne zgłoszenia i zamówienia trzymane są w pamięci serwera.

## Uruchomienie

Wymagany Node.js 22.13+.

```bash
cd interpodatki
npm install
cp .env.example .env.local      # opcjonalnie – domyślne wartości działają lokalnie
npm run dev                     # http://localhost:3100
```

Wersja produkcyjna lokalnie:

```bash
npm run build
npm start                       # http://localhost:3100
```

### Kontrole jakości

```bash
npm run lint          # ESLint (next/core-web-vitals + typescript)
npm run typecheck     # tsc --noEmit
npm test              # Vitest – 33 testy jednostkowe
```

### Testy end-to-end

Testy wymagają działającego serwera i Playwrighta z przeglądarką Chromium:

```bash
npm i -D playwright && npx playwright install chromium   # jednorazowo, jeśli Playwright nie jest zainstalowany
npm run build && npm start &                              # najlepiej świeżo uruchomiony serwer produkcyjny
BASE_URL=http://localhost:3100 npm run test:e2e
```

Pakiet obejmuje 33 scenariusze: wszystkie podstrony i linki, SEO (meta, sitemap, robots, Open Graph, JSON-LD), skan
axe-core (WCAG 2.0/2.1/2.2 A i AA), kalkulator (JDG, spółka, dokumenty, pracownicy, usługi, reset, parametry
nieprawidłowe), przejście kalkulator → wycena → zamówienie, walidację formularzy, checkout demo (sukces, odmowa, błąd
operatora, powrót do zamówienia), menu na komputerze i telefonie, brak poziomego przewijania (320–1440 px), obszary
dotykowe, nawigację klawiaturą, `prefers-reduced-motion` oraz testy bezpieczeństwa API.

> Limity żądań API działają w pamięci procesu – uruchamiaj e2e na świeżo wystartowanym serwerze, inaczej kolejne
> przebiegi w ciągu 10 minut mogą dostać odpowiedź 429.

## Struktura

```
src/
  app/                          strony (App Router) – 14 podstron z briefu + panel demo, baza wiedzy, dokumenty, 404
    api/demo/inquiries          zapis zgłoszeń z formularza wyceny i kontaktu (walidacja serwerowa, antyspam)
    api/demo/orders             tworzenie zamówienia testowego (kwoty liczone wyłącznie na serwerze)
    api/demo/orders/[id]        odczyt zamówienia – tylko w sesji, która je utworzyła
    api/demo/orders/[id]/payment  symulacja płatności przez operatora demo
  lib/pricing/config.ts         ★ wszystkie stawki kalkulatora (jedno źródło prawdy)
  lib/pricing/packages.ts       ★ pakiety Start / Biznes / Pro / Premium / Enterprise
  lib/pricing/calculator.ts     czysta funkcja wyceny (wspólna dla przeglądarki i serwera)
  lib/pricing/params.ts         zapis konfiguracji kalkulatora w adresie URL (bez danych osobowych)
  lib/order-quote.ts            wycena zamówienia (opłata miesięczna, jednorazowa, do zapłaty teraz)
  lib/validation/               reguły walidacji z komunikatami po polsku (przeglądarka + API)
  lib/server/                   magazyn demo w pamięci, sesja (cookie httpOnly), limity żądań, zamówienia
  lib/server/payments/          interfejs PaymentProvider + implementacja demo
  data/                         treści: usługi, artykuły bazy wiedzy, FAQ
  components/                   layout, UI, kalkulator, formularze, zamówienie, panel, baza wiedzy
tests/unit/                     Vitest
tests/e2e/                      Playwright + node:test + axe-core
```

## Kalkulator – jak zmienić ceny

Wszystkie stawki są w `src/lib/pricing/config.ts`: cena bazowa i liczba dokumentów w cenie dla każdego rodzaju
działalności, dopłaty za formę prawną, malejące stawki za dokumenty ponad limit, ceny usług, mnożniki skali
i złożoności, dopłaty za dodatkowe potrzeby oraz limity pól. Zmiana w tym pliku automatycznie aktualizuje
kalkulator, cennik („Jak liczymy abonament”), przykładowe szacunki na stronach usług, zamówienia i testy.

Zasady: minimum 700 zł miesięcznie, wynik zaokrąglany w górę do 10 zł, przedział cenowy −10% / +15% (+35% przy
indywidualnym zakresie), od 10 000 zł lub przy indywidualnym zakresie – wyłącznie indywidualna wycena.

## Ograniczenia wersji demonstracyjnej

- **Formularze** nie wysyłają e-maili – zgłoszenie trafia do pamięci serwera (imię, zamaskowany e-mail, krótkie
  podsumowanie) i wygasa po 6 godzinach lub po restarcie. Interfejs mówi o tym wprost.
- **Płatności** są symulowane przez `demoPaymentProvider`. Brak połączenia z operatorem, brak pól na dane kart.
  Scenariusze testowe: płatność zaakceptowana, odrzucona, błąd operatora.
- **Panel klienta** nie ma logowania – pokazuje dane z anonimowej sesji (cookie httpOnly) i przykładowe dokumenty
  oznaczone jako DEMO.
- **Magazyn w pamięci** działa w jednym procesie. W środowisku bezserwerowym lub z wieloma instancjami zamówienie
  może „zniknąć” między żądaniami.
- **Ochrona antyspamowa** to pole-pułapka, minimalny czas wypełnienia i limit żądań na IP – bez CAPTCHA.
- **Dokumenty prawne** (polityka prywatności, regulamin, cookies) to struktury do opracowania przez prawnika.
- **Indeksowanie** jest wyłączone (`NEXT_PUBLIC_ALLOW_INDEXING=false` → `robots.txt` blokuje wszystko, `noindex`).

## Przed wdrożeniem produkcyjnym

1. **Dane firmy:** prawdziwa nazwa, adres, dane rejestrowe, kontakt (`src/config/site.ts`), zespół i – dla doradców
   podatkowych – numery wpisu na listę (`/o-nas`). Usunięcie oznaczeń demo (`DemoBar`, komunikaty w formularzach).
2. **Cennik:** zweryfikowane stawki w `src/lib/pricing/config.ts` i `packages.ts`.
3. **Dokumenty prawne:** polityka prywatności, regulamin, informacja o cookies, klauzule zgód – przygotowane przez
   prawnika.
4. **Formularze:** podłączenie usługi e-mail lub CRM po stronie serwera (np. w `src/lib/server/inquiries.ts`),
   weryfikacja CAPTCHA (np. Cloudflare Turnstile) z sekretem tylko w zmiennych serwera.
5. **Baza danych:** zastąpienie `src/lib/server/store.ts` trwałym magazynem z kontrolą dostępu; wspólny limiter żądań
   (np. Redis) przy wielu instancjach.
6. **Płatności:** implementacja `PaymentProvider` dla wybranego operatora w środowisku sandbox:
   - transakcja tworzona na serwerze z kwotą z `buildOrderQuote` (nigdy z przeglądarki),
   - przekierowanie do strony operatora (`redirectUrl`) – dane kart obsługuje wyłącznie operator,
   - endpoint webhooka weryfikujący podpis i dopiero wtedy oznaczający zamówienie jako opłacone,
   - klucze API i sekret webhooka wyłącznie w zmiennych środowiskowych serwera (`PAYMENT_API_KEY`,
     `PAYMENT_WEBHOOK_SECRET`), nigdy z prefiksem `NEXT_PUBLIC_`.
7. **Panel klienta:** uwierzytelnianie (np. Auth.js / dostawca tożsamości), autoryzacja, bezpieczny magazyn plików.
8. **Konfiguracja:** `NEXT_PUBLIC_SITE_URL` (canonical, sitemap, OG), `NEXT_PUBLIC_ALLOW_INDEXING=true`, HTTPS.
   Rozważ CSP z nonce zamiast `'unsafe-inline'` dla skryptów.
9. **Analityka/marketing:** jeśli zostaną dodane – mechanizm zgody na cookies przed ich uruchomieniem.
