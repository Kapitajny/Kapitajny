# Rygiel – serwis firmy IT i cyberbezpieczeństwa (projekt demonstracyjny)

Serwis marki **Rygiel**: obsługa IT, cyberbezpieczeństwo, chmura i kopie zapasowe dla małych i średnich firm.
Projekt przygotowany przez **ComputerIT** jako realizacja portfolio.

> **Projekt demonstracyjny.** Marka, realizacje i profile firm są fikcyjne i tak oznaczone w serwisie. Dane rejestrowe,
> adres e-mail i dokumenty prawne są wersjami roboczymi z wyraźnymi znacznikami „do uzupełnienia”. Przed publikacją
> pod prawdziwą marką trzeba je uzupełnić i zweryfikować prawnie. Dostępności domeny ani znaku towarowego „Rygiel” nie
> sprawdzaliśmy.

Decyzje projektowe, system wizualny i plan testów opisuje [`PROJECT_PLAN.md`](./PROJECT_PLAN.md).

## Stack

| Obszar | Technologia |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict) |
| Style | CSS Modules + zmienne CSS (tokeny w `src/app/globals.css`), bez bibliotek UI |
| Fonty | Archivo przez `next/font` – serwowane z własnej domeny, bez zapytań do Google w przeglądarce |
| Formularz | Server Action + `useActionState`, własna walidacja współdzielona przez klienta i serwer |
| Testy | Vitest (logika), Playwright + axe-core (E2E i dostępność) |

Brak zależności runtime poza `next`, `react`, `react-dom` i `server-only`.

## Wymagania

- Node.js 22 LTS (lub nowszy) i npm 10+
- Do testów E2E: przeglądarka Chromium dla Playwright (`npx playwright install chromium`, jeśli nie jest zainstalowana)

## Najprostsze uruchomienie (bez terminala)

1. Zainstaluj **Node.js LTS** (wersja 22 lub nowsza) ze strony https://nodejs.org – jednorazowo.
2. Pobierz repozytorium (na GitHubie: **Code → Download ZIP**) i rozpakuj je.
3. Otwórz folder `rygiel` i kliknij dwukrotnie:
   - **Windows:** `URUCHOM-WINDOWS.bat`
   - **Mac:** `URUCHOM-MAC.command` (za pierwszym razem: prawy przycisk → **Otwórz** → **Otwórz**)
4. Strona otworzy się w przeglądarce pod adresem http://localhost:3001. Aby ją wyłączyć, zamknij okno skryptu.

Pierwsze uruchomienie trwa kilka minut (instalacja pakietów i build), kolejne – kilkadziesiąt sekund. Port 3001 pozwala
uruchomić równolegle stronę kawiarni z katalogu głównego (port 3000).

## Instalacja i uruchomienie

```bash
cd rygiel
npm install
cp .env.example .env.local     # opcjonalnie – bez zmian formularz działa w trybie demonstracyjnym
npm run dev                    # http://localhost:3000
```

### Build produkcyjny

```bash
npm run build
npm run start                  # http://localhost:3000
```

Wszystkie strony są generowane statycznie (27 adresów, w tym `sitemap.xml`, `robots.txt` i obraz Open Graph).
Dynamicznie działa tylko Server Action formularza kontaktowego.

## Testy i kontrola jakości

```bash
npm run lint          # ESLint (konfiguracja eslint-config-next)
npm run typecheck     # tsc --noEmit
npm test              # Vitest – 45 testów logiki i spójności treści
npm run build && npm run test:e2e   # Playwright – 88 testów na buildzie produkcyjnym
```

Co sprawdzają testy:

- **Vitest** (`tests/`): walidacja i czyszczenie danych formularza, pole-pułapka i pułapka czasowa, limit żądań,
  wysyłka (Resend, webhook z podpisem HMAC, tryb demo, brak danych osobowych w logach), escapowanie HTML i JSON-LD,
  parser formatowania treści, typografia, unikalność slugów, poprawność linków wewnętrznych w artykułach, brak
  wymyślonych wyników procentowych, logika filtrów.
- **Playwright** (`e2e/`): każda trasa (status 200, jedno H1, tytuł, opis, adres kanoniczny, Open Graph), unikalność
  tytułów i opisów, wszystkie linki wewnętrzne i kotwice, sitemap i robots, strona 404, nagłówki bezpieczeństwa, brak
  cookies i danych w pamięci przeglądarki, brak błędów konsoli, nawigacja i skip link, menu mobilne (Esc, `inert`,
  powrót fokusu), akordeon z klawiatury, przekrój infrastruktury, filtry realizacji (w tym stan pusty) i bazy
  wiedzy, formularz (walidacja, tryb demo, pułapka czasowa, pole-pułapka, wstępny wybór usługi), brak przewijania w
  poziomie na telefonie oraz **axe-core** (WCAG 2.0/2.1/2.2 A i AA) na 12 kluczowych stronach i na formularzu z błędami.

Domyślnie Playwright uruchamia `next start` na porcie 3200. Aby testować inny adres: `E2E_BASE_URL=https://… npm run test:e2e`.
Jeśli projekt ma używać innej wersji Chromium niż dołączona do Playwright, wskaż ją w `playwright.config.ts`
(`launchOptions.executablePath`).

### Wyniki pomiarów (build produkcyjny, Lighthouse 12, październik 2026)

| Strona | Performance (mobile / desktop) | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| `/` | 92–93 / 100 | 100 | 100 | 100* |
| `/kontakt` | 94 / 100 | 100 | 100 | 100* |
| `/baza-wiedzy/kopie-zapasowe-3-2-1-w-praktyce` | 91 / 100 | 100 | 100 | 100* |
| `/realizacje/modernizacja-sklepu-internetowego` | 95 / – | 100 | 100 | 100* |

\* SEO 100 przy `NEXT_PUBLIC_ALLOW_INDEXING=true`. W domyślnej konfiguracji serwis ma `noindex` (dane są robocze), więc
Lighthouse obniża ocenę SEO do 66 – to zamierzone. Wyniki zależą od maszyny i sieci; traktuj je jako orientacyjne.

Automatyczne testy dostępności nie zastępują audytu z czytnikiem ekranu. Serwis projektowano pod WCAG 2.2 AA, ale
pełnej zgodności nie deklarujemy bez takiego audytu.

## Zmienne środowiskowe

| Zmienna | Gdzie | Opis |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | build | Adres serwisu bez końcowego `/` – adresy kanoniczne, sitemap, Open Graph |
| `NEXT_PUBLIC_ALLOW_INDEXING` | build | `true` włącza indeksowanie (robots.txt i meta robots). Domyślnie wyłączone |
| `NEXT_PUBLIC_CONTACT_EMAIL` | build | Adres kontaktowy w stopce i na stronie kontaktu. Bez niego widać znacznik „do uzupełnienia” |
| `RESEND_API_KEY` | serwer | Klucz API Resend (wariant A wysyłki) |
| `CONTACT_TO_EMAIL` | serwer | Odbiorca/odbiorcy zapytań, rozdzieleni przecinkami |
| `CONTACT_FROM_EMAIL` | serwer | Nadawca w domenie zweryfikowanej w Resend |
| `CONTACT_WEBHOOK_URL` | serwer | Adres webhooka (wariant B wysyłki) |
| `CONTACT_WEBHOOK_SECRET` | serwer | Sekret do podpisu HMAC-SHA256 żądań webhooka |

Zmienne `NEXT_PUBLIC_*` są wbudowywane w kod podczas buildu – po ich zmianie trzeba przebudować serwis. Zmienne
serwerowe są odczytywane tylko po stronie serwera (moduł `server-only`) i nigdy nie trafiają do przeglądarki.
Pliki `.env*` (poza `.env.example`) są ignorowane przez git.

## Formularz kontaktowy

### Tryb demonstracyjny (domyślny)

Bez skonfigurowanej wysyłki formularz przechodzi pełną walidację po stronie klienta i serwera, ale **niczego nie
wysyła ani nie zapisuje**. Informuje o tym przed wysłaniem (baner „Tryb demonstracyjny”) i po wysłaniu (komunikat
„Wiadomość nie została wysłana – tryb demonstracyjny”).

### Wariant A: e-mail przez Resend

1. Załóż konto w [Resend](https://resend.com) i zweryfikuj domenę nadawcy (rekordy DNS SPF i DKIM).
2. Ustaw `RESEND_API_KEY`, `CONTACT_TO_EMAIL` i `CONTACT_FROM_EMAIL`.
3. Wiadomość trafia do odbiorcy z polem `Reply-To` ustawionym na adres osoby, która wysłała formularz.

### Wariant B: webhook

Ustaw `CONTACT_WEBHOOK_URL` (np. scenariusz Make/n8n, własny endpoint, system zgłoszeń). Serwer wysyła `POST` z treścią:

```json
{ "type": "contact", "submittedAt": "2026-10-22T10:00:00.000Z", "data": { "name": "…", "email": "…", "company": null, "service": "obsluga-it", "scope": null, "message": "…" } }
```

Przy ustawionym `CONTACT_WEBHOOK_SECRET` żądanie ma nagłówek `X-Signature-SHA256` z podpisem HMAC-SHA256 surowej treści.
Odbiorca powinien go zweryfikować, np. w Node.js:

```js
const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
const valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
```

### Zabezpieczenia formularza

- walidacja i normalizacja po stronie serwera (długości, lista dozwolonych wartości, usuwanie znaków sterujących),
- pole-pułapka niewidoczne dla ludzi i czytników ekranu, pułapka czasowa (min. 3 s, maks. 24 h),
- limit 5 zgłoszeń na 10 minut z jednego adresu IP,
- wbudowana ochrona CSRF Server Actions (porównanie nagłówków Origin i Host), limit rozmiaru żądania 64 kB,
- escapowanie HTML w treści e-maila, logi bez danych osobowych (tylko tryb wysyłki i kod błędu).

**Ograniczenie:** limit żądań działa w pamięci jednej instancji serwera. Przy wielu instancjach lub w środowisku
serverless zastąp `src/lib/contact/rate-limit.ts` magazynem współdzielonym (np. Redis, Upstash, Vercel KV).
Formularz wymaga JavaScriptu w przeglądarce (pułapka czasowa jest ustawiana po stronie klienta); bez niego wyświetla
odpowiedni komunikat.

## Wdrożenie

### Vercel

1. Zaimportuj repozytorium i ustaw **Root Directory** na `rygiel`.
2. Ustaw zmienne środowiskowe (co najmniej `NEXT_PUBLIC_SITE_URL`).
3. Build: `npm run build`, wersja Node.js: 22.

### Własny serwer / kontener

```bash
npm ci && npm run build && npm run start -- --port 3000
```

- Uruchom za reverse proxy z HTTPS (nagłówek HSTS jest wysyłany w produkcji).
- Przy wielu instancjach ustaw wspólny `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` i zastąp limit żądań magazynem współdzielonym.
- Jeśli proxy zmienia nagłówek `Host`, dodaj domenę do `experimental.serverActions.allowedOrigins` w `next.config.ts`.

## Bezpieczeństwo i prywatność

Nagłówki ustawiane w `next.config.ts`: `Content-Security-Policy`, `Strict-Transport-Security` (produkcja),
`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`,
`Cross-Origin-Opener-Policy`; nagłówek `X-Powered-By` jest wyłączony.

**Kompromis CSP:** strony są statyczne, więc CSP nie używa nonce (wymagałby renderowania każdej strony na żądanie).
`script-src` zawiera `'unsafe-inline'`, bo Next.js wstrzykuje skrypty inline z danymi RSC – zgodnie z dokumentacją
Next.js dla CSP bez nonce. Ryzyko ogranicza brak skryptów i zasobów zewnętrznych (`default-src 'self'`), brak
renderowania HTML z danych użytkownika i bezpieczny parser treści (`src/lib/inline-markup.ts`). Jeśli wymagany jest
ścisły CSP, można przejść na nonce w `src/proxy.ts` kosztem renderowania dynamicznego.

Serwis nie używa cookies, `localStorage` ani skryptów analitycznych, dlatego nie ma banera zgody. Po dodaniu
analityki trzeba wdrożyć mechanizm zgody i zaktualizować politykę cookies.

## Co wymaga uzupełnienia przed publikacją

Znaczniki „do uzupełnienia” (komponent `Pending`) są widoczne w serwisie i opisują brakujące dane:

- dane rejestrowe firmy (stopka, kontakt, polityka prywatności, regulamin),
- adres kontaktowy (`NEXT_PUBLIC_CONTACT_EMAIL`),
- okres przechowywania danych, dostawcy hostingu i poczty, podstawa transferu danych poza EOG,
- adres serwisu, termin reklamacji i data wejścia w życie regulaminu,
- weryfikacja prawna polityki prywatności, polityki cookies i regulaminu.

Usługi zewnętrzne: hosting (dowolny z obsługą Next.js) oraz – opcjonalnie – Resend lub webhook do wysyłki formularza.
Podczas buildu `next/font` pobiera fonty z Google Fonts (w przeglądarce są serwowane z domeny serwisu).

## Struktura

```
rygiel/
  src/app/                 trasy, metadane, sitemap, robots, obraz OG, 404, Server Action formularza (kontakt/actions.ts)
  src/components/
    layout/                nagłówek, menu mobilne, stopka, logo, skip link
    ui/                    przyciski, akordeon, nagłówki stron i sekcji, tabliczka rysunkowa, breadcrumbs, JSON-LD
    diagrams/              przekrój infrastruktury (hero), schematy przepływu
    home/ services/ cases/ knowledge/ contact/ legal/   sekcje i układy poszczególnych stron
  src/content/             treści: usługi, realizacje, artykuły, proces i zasady, konfiguracja serwisu
  src/lib/                 SEO, typografia, parser treści, JSON-LD, lista tras, logika formularza (lib/contact)
  tests/                   testy Vitest
  e2e/                     testy Playwright
  assets/fonts/            fonty do obrazu Open Graph (Archivo, licencja SIL OFL 1.1 – OFL.txt)
```

Formatowanie: Prettier z `printWidth: 160` (`.prettierrc`).
