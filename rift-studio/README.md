# RIFT Studio – strona studia nagrań z systemem rezerwacji

Strona studia nagrań rapu i hip-hopu z Pruszkowa (od 2013 r.). Ma 9 sekcji w dwóch językach (PL domyślnie, EN pod
`/en`), działający odtwarzacz realizacji i system rezerwacji sesji z panelem administracyjnym.

> **Wersja demonstracyjna.** Adres, telefon, e-mail, ceny, godziny pracy, historia studia i utwory w odtwarzaczu są
> przykładowe i są oznaczone na stronie. Przed publikacją uzupełnij je według listy
> [Dane do uzupełnienia](#dane-do-uzupełnienia).

Projekt graficzny, system wizualny i decyzje są opisane w [`docs/DESIGN.md`](docs/DESIGN.md), a zrzuty ekranu
wszystkich sekcji są w [`docs/screenshots`](docs/screenshots).

## Uruchomienie

**Bez terminala:** zainstaluj [Node.js LTS](https://nodejs.org) (22.13+), a potem kliknij dwukrotnie
`URUCHOM-WINDOWS.bat` (Windows) albo `URUCHOM-MAC.command` (macOS: prawy przycisk → Otwórz). Strona otworzy się pod
adresem http://localhost:3001. Port 3001 jest wybrany specjalnie, żeby nie kolidować ze stroną kawiarni z katalogu
głównego repozytorium.

**Terminal:**

```bash
cd rift-studio
npm install
cp .env.example .env.local   # opcjonalnie: e-maile, panel admina, Supabase
npm run dev                  # http://localhost:3000
```

Bez żadnej konfiguracji działa wszystko, co widać na stronie: rezerwacje zapisują się w lokalnym SQLite
(`data/bookings.db`), a e-maile trafiają do logu serwera.

Kontrole jakości:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Stack

- **Next.js 16** (App Router, `proxy.ts`), **React 19**, **TypeScript**, CSS Modules i tokeny w `src/app/globals.css`
- Bez bibliotek UI, animacji i SDK. Zależności produkcyjne to tylko `next`, `react`, `react-dom` i `server-only`.
- Baza: **SQLite** (`node:sqlite`, wbudowany w Node.js) lokalnie albo **Supabase** (Postgres) w produkcji
- E-mail: **Resend** (REST)
- Testy: **Vitest** (32 testy: silnik terminów, zmiana czasu, walidacja, równoległe rezerwacje, API, tłumaczenia)

## Struktura

```
src/
  proxy.ts                    routing językowy: / → PL, /en → EN, /pl/... → przekierowanie na adres bez prefiksu
  app/[lang]/page.tsx         strona główna (9 sekcji) + JSON-LD (LocalBusiness, FAQPage)
  app/[lang]/[doc]            dokumenty prawne (polityka prywatności, cookies, regulaminy) – PL i EN
  app/[lang]/rezerwacja/[token]  zarządzanie rezerwacją z linku w e-mailu (zmiana terminu, anulowanie)
  app/[lang]/admin            panel studia
  app/api/availability        wolne terminy (GET), najbliższy wolny termin (/next)
  app/api/bookings            nowa rezerwacja (POST), zarządzanie przez token (/manage)
  app/api/admin/*             logowanie, lista i statusy rezerwacji, blokady terminów
  components/sections/        sekcje strony (Hero, Sounds, About, Services, Work, Pricing, Booking, Faq)
  components/booking/         formularz, kalendarz, panel kontaktu, mapa (ładowana po zgodzie)
  config/site.ts              ★ nazwa, adres, telefon, e-mail, media społecznościowe
  data/services.ts            ★ usługi, stawki do szacunku ceny, parametry
  data/pricing.ts             ★ cennik (+ flaga PRICING_IS_DEMO)
  data/sounds.ts              kierunki brzmienia (sekcja 2)
  data/tracks.ts              ★ utwory w odtwarzaczu
  lib/booking/rules.ts        ★ godziny pracy, wyprzedzenie, horyzont, limit samoobsługi (24 h)
  lib/booking/slots.ts        silnik terminów (czyste funkcje, strefa Europe/Warsaw)
  lib/server/                 rezerwacje, e-maile, sesja admina, repozytoria SQLite / Supabase
  i18n/dictionaries/          ★ wszystkie teksty interfejsu PL / EN
  content/legal.ts            ★ projekty dokumentów prawnych PL / EN
supabase/migrations/          schemat bazy dla Supabase
scripts/generate-demo-audio.mjs   generator demonstracyjnych podkładów (synteza)
```

## Jak działa system rezerwacji

1. Formularz pobiera wolne godziny z `/api/availability`. Terminy są liczone w strefie Europe/Warsaw z godzin pracy,
   wymaganego wyprzedzenia (12 h), horyzontu (8 tygodni), istniejących rezerwacji i blokad z panelu.
2. Po wysłaniu formularza serwer **ponownie** sprawdza termin i zapisuje rezerwację atomowo:
   - SQLite: transakcja `BEGIN IMMEDIATE` ze sprawdzeniem kolizji;
   - Supabase: ograniczenie `EXCLUDE USING gist` na zakresie czasu, więc dwie nakładające się aktywne rezerwacje są
     niemożliwe na poziomie bazy, nawet przy wielu serwerach.
   Gdy ktoś był szybszy, klient dostaje komunikat „termin został przed chwilą zajęty”, a kalendarz się odświeża.
3. Rezerwacja ma status **„czeka na potwierdzenie”**, a termin jest od razu zablokowany. Klient dostaje e-mail z
   linkiem do zarządzania, a studio dostaje powiadomienie.
4. Link (`/rezerwacja/<token>`) pozwala zmienić termin lub anulować rezerwację do 24 h przed sesją. Token ma 256
   bitów, a w bazie zapisany jest wyłącznie jego skrót SHA-256.
5. W panelu `/admin` studio potwierdza lub anuluje rezerwacje (klient dostaje e-mail) i blokuje terminy (urlop,
   serwis, prywatne sesje).

Ochrona: walidacja po stronie serwera, sprawdzanie `Origin` (CSRF), limit żądań, pole-pułapka i minimalny czas
wypełnienia formularza (boty), nagłówki bezpieczeństwa z CSP oraz ciasteczko admina `HttpOnly` + `SameSite=Strict`
podpisane HMAC.

### Panel administracyjny

W `.env.local` ustaw `ADMIN_PASSWORD` (min. 10 znaków) i `ADMIN_SESSION_SECRET` (min. 32 losowe znaki, np.
`openssl rand -base64 48`), uruchom serwer ponownie i wejdź na `/admin`. Bez tych zmiennych panel jest wyłączony.

### E-maile (Resend)

1. Załóż konto na resend.com i zweryfikuj domenę studia.
2. Ustaw `RESEND_API_KEY`, `MAIL_FROM` (adres z tej domeny) i `STUDIO_NOTIFY_EMAIL` (skrzynka studia).
3. Ustaw `NEXT_PUBLIC_SITE_URL` na publiczny adres strony – z niego budowane są linki w e-mailach.

Bez klucza wiadomości w trybie deweloperskim trafiają do logu serwera. W produkcji log zawiera tylko ostrzeżenie,
bez treści i bez linków.

### Supabase (zalecane w produkcji)

1. Utwórz projekt w Supabase.
2. W **SQL Editor** uruchom `supabase/migrations/0001_bookings.sql`.
3. Ustaw `SUPABASE_URL` i `SUPABASE_SERVICE_ROLE_KEY` (Settings → API). Klucz service_role trzymaj wyłącznie po
   stronie serwera. Tabele mają włączone RLS bez publicznych polityk.
4. Aplikacja przełączy się na Supabase automatycznie. Wymuszenie: `BOOKING_STORE=supabase`.

Adapter Supabase korzysta z REST/RPC przez `fetch`. Przechodzi kontrolę typów, ale **nie był uruchomiony na żywej
bazie** (środowisko, w którym powstał projekt, nie miało dostępu do Supabase). Po konfiguracji przetestuj: rezerwację,
próbę rezerwacji tego samego terminu, zmianę terminu, anulowanie i blokadę z panelu.

### Wdrożenie

- **Serwer z dyskiem (VPS, kontener z wolumenem):** wystarczy SQLite. Uruchom `npm run build && npm start`.
- **Serverless (np. Vercel):** system plików jest ulotny, więc użyj Supabase. Limit żądań działa w pamięci procesu;
  przy wielu instancjach rozważ limit w bazie lub w Redisie.

## Dane do uzupełnienia

| Co | Gdzie | Stan |
|---|---|---|
| Adres (ul. Bolesława Prusa 12, 05-800 Pruszków) i współrzędne mapy | `src/config/site.ts` → `address` | demonstracyjny – ustaw `demo: false` po potwierdzeniu |
| Telefon i e-mail | `src/config/site.ts` → `contact` | przykładowe (+48 22 000 00 00) |
| Linki do mediów społecznościowych | `src/config/site.ts` → `social` | puste – ikony wyświetlają się bez linku |
| Ceny, zakres, dopłaty | `src/data/pricing.ts`, stawki w `src/data/services.ts` | przykładowe – `PRICING_IS_DEMO = false` ukrywa oznaczenie |
| Godziny pracy i zasady rezerwacji | `src/lib/booking/rules.ts` + teksty `contact.hours` w słownikach | przykładowe |
| Historia studia (2013–dziś) i treść „O nas” | `src/i18n/dictionaries/pl.ts` / `en.ts` → `about` | napisane przykładowo – do potwierdzenia faktów |
| Utwory w odtwarzaczu | `public/audio`, `src/data/tracks.ts` | demo (synteza) – prawdziwe realizacje tylko za zgodą artystów |
| Dane administratora w dokumentach prawnych | `src/content/legal.ts` | miejsca w [nawiasach] + weryfikacja prawnika |
| Zdjęcia studia | `public/images` | Pexels + jedno zdjęcie od właściciela (patrz niżej) |
| Domena nadawcy e-maili | `MAIL_FROM` w `.env.local` | do ustawienia |

## Materiały i licencje

- **Logo:** nazwa „RIFT Studio” pochodzi z logo przekazanego przez właściciela. Znak na stronie jest przerysowany
  w SVG (`components/layout/Logo.tsx`) w palecie cyjan/fiolet, zgodnej z briefem sekcji Hero.
- **Zdjęcia (licencja Pexels, użycie komercyjne bez przypisania):** identyfikatory zdjęć na pexels.com:
  hero 10933702, brzmienia 164745 / 16651337 / 682082 / 3916058 / 194985 / 7087648, o nas 2364381 / 32842956.
- **`about-studio-room.jpg`:** zdjęcie reżyserki przekazane przez właściciela (niska rozdzielczość: 588 px). Przed
  publikacją potwierdź prawa i podmień na większą wersję. Najlepiej zastąp wszystkie zdjęcia stockowe fotografiami
  prawdziwego studia.
- **Okładki płyt przekazane w materiałach** (WWO, Linkin Park, Peja, „Cały ten rap” i inne) **nie zostały użyte**.
  Sugerowałyby współpracę z tymi artystami, a prawa do nich należą do wydawców.
- **Audio:** 6 podkładów wygenerowanych skryptem `npm run audio:generate` (czysta synteza, bez sampli). Można je
  swobodnie zastąpić.
