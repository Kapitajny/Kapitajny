# Projekty demonstracyjne ComputerIT

Repozytorium zawiera niezależne strony w jednej aplikacji Next.js:

| Adres | Projekt | Kod |
| --- | --- | --- |
| `/` (i podstrony) | **NOIR COFFEE** – kawiarnia z zamówieniami online | `src/app/(noir)/`, opis poniżej |
| `/morelowa` | **Morelowa** – rodzinna piekarnia i cukiernia, koncepcja 1 | `src/app/(morelowa)/`, sekcja [Morelowa](#morelowa--rodzinna-piekarnia--cukiernia) |
| `/morelowa-2` | **Morelowa** – koncepcja 2 (ten sam brief, inny kierunek wizualny) | `src/app/(morelowa-2)/`, sekcja [Koncepcja 2](#morelowa--koncepcja-2-łuk-pieca) |

Każda strona ma własny layout główny (grupy tras `(noir)`, `(morelowa)` i `(morelowa-2)`): osobne fonty, kolory, arkusz stylów,
favicon i metadane. Przejście między nimi przeładowuje stronę. Adresy spoza obu stron obsługuje wspólna strona 404
`src/app/global-not-found.tsx` (włączona flagą `experimental.globalNotFound` w `next.config.ts`).

## Morelowa – rodzinna piekarnia & cukiernia

Jednostronicowa witryna fikcyjnej rodzinnej piekarni i cukierni z Grodziska Mazowieckiego (od 1991) i Warszawy
(od 2010). **Marka, historia, osoby i adresy są fikcyjne** – strona jest projektem demonstracyjnym portfolio
ComputerIT. Po uruchomieniu: http://localhost:3000/morelowa

Sekcje: nagłówek z menu mobilnym → hero → filozofia → pieczywo → cukiernia → historia (oś czasu) → lokale →
kontakt → stopka. Wszystkie odnośniki prowadzą do kotwic na tej samej stronie.

```
src/app/(morelowa)/
  layout.tsx              layout główny: fonty Cormorant Garamond + Manrope, metadane, viewport
  morelowa.css            tokeny kolorów, typografia, przyciski, pola formularza, animacje przewijania
  icon.png, apple-icon.png  favicon z emblematu marki
  morelowa/page.tsx       strona /morelowa (+ opengraph-image.jpg)
src/components/morelowa/  Header (menu mobilne, podświetlanie sekcji), Hero, Philosophy, Breads, Patisserie,
                          Timeline, Locations + LocationEntry („Zobacz lokal”), Contact + ContactForm, Footer, Logo
src/components/morelowa/images.ts  ★ pięć głównych zdjęć: plik → sekcja, teksty alternatywne
src/data/morelowa.ts      ★ treści: nawigacja, filary, wypieki, oś czasu, lokale
src/assets/morelowa/      ★ zdjęcia i emblemat (import statyczny → wymiary i rozmyty podgląd z automatu)
```

Zdjęcia (każde użyte raz):

| Sekcja | Plik | Źródło |
| --- | --- | --- |
| 1. Hero | `hero-piekarnia-piec.jpg` | grafika przekazana przez właściciela projektu (odbita poziomo pod układ tekstu) |
| 2. Pieczywo | `pieczywo-krojenie-chleba.jpg` | grafika przekazana przez właściciela projektu |
| 3. Cukiernia | `cukiernia-torty-i-tarty.jpg` | wygenerowana w Canva AI – **obecnie miniatura 199 px, do podmiany** |
| 4. Historia | `historia-piekarz-przy-stole.jpg` | grafika przekazana przez właściciela projektu |
| 5. Lokale | `lokal-lada.jpg` | grafika przekazana przez właściciela projektu (kadr 4:5 bez anglojęzycznej tabliczki z ceną) |
| Logo / favicon | `emblemat.png` | grafika przekazana przez właściciela projektu (wycięte tło) |

Aby podmienić zdjęcie, wgraj plik pod tą samą nazwą do `src/assets/morelowa/` (zalecane min. 1600 px po dłuższym
boku) i przebuduj projekt.

Uczciwe dane demonstracyjne: adresy są oznaczone jako demonstracyjne, godziny otwarcia i telefony – „do
uzupełnienia”, nie ma linków do map ani systemu zamówień. Formularz kontaktowy waliduje pola, ale **niczego nie
wysyła** i mówi o tym wprost. W stopce: „Projekt demonstracyjny — fikcyjna marka stworzona na potrzeby portfolio
ComputerIT” oraz „Website concept by ComputerIT”.

## Morelowa – koncepcja 2 „Łuk pieca”

Druga propozycja tej samej strony (http://localhost:3000/morelowa-2). Treści (`src/data/morelowa.ts`), zdjęcia
(`src/components/morelowa/images.ts`), logika menu (`site-menu.ts`) i walidacja formularza (`contact-validation.ts`)
są wspólne z koncepcją 1 – różni się kierunek wizualny:

| | Koncepcja 1 (`/morelowa`) | Koncepcja 2 (`/morelowa-2`) |
| --- | --- | --- |
| Typografia | Cormorant Garamond + Manrope | Libre Bodoni (wysoki kontrast) + Jost (geometryczny) |
| Nagłówek | logo z lewej, menu w linii | logo pośrodku, menu w drugim rzędzie; mobilnie bordowy panel |
| Hero | zdjęcie na całą szerokość z tekstem na zdjęciu | jasny, podzielony ekran; zdjęcie w łuku (otwór pieca) z pieczęcią „od 1991” |
| Pieczywo | lista kategorii obok zdjęcia | karta wypieków z czasem fermentacji i gramaturą |
| Cukiernia | układ magazynu kulinarnego na beżu | bordowa sekcja, zdjęcie w ramce jak w witrynie |
| Historia | pionowa oś czasu, ciemne tło | szeroki kadr 21:9 i pozioma oś czasu |
| Lokale | lista z rozwijanymi szczegółami | dwie kolumny, szczegóły w oknie (`<dialog>`) |
| Przyciski | prostokątne | zaokrąglone |

Pliki: `src/app/(morelowa-2)/` (layout, `morelowa-2.css`, strona) i `src/components/morelowa-2/`.

---

# NOIR COFFEE – strona kawiarni z zamówieniami online

Strona fikcyjnej kawiarni NOIR COFFEE z Gdańska: menu 10 kaw z personalizacją, koszyk, wybór lokalu i godziny
odbioru, płatności Stripe Checkout potwierdzane webhookiem oraz projekty dokumentów prawnych.

> **Projekt demonstracyjny.** Adresy lokali, godziny otwarcia, dane sprzedawcy i dokumenty prawne są danymi
> przykładowymi / wersjami roboczymi i wymagają uzupełnienia przed przyjmowaniem prawdziwych zamówień.

## Stack

- **Next.js 16** (App Router, Turbopack, Cache Components), **React 19**, **TypeScript**
- **Tailwind CSS 4** – tokeny kolorów i typografii w `src/app/globals.css`
- **Stripe** (`stripe` – SDK serwerowy), **SQLite** wbudowany w Node.js (`node:sqlite`) na zamówienia
- **Vitest** – testy logiki cen, godzin odbioru, walidacji, zamówień i webhooka

Wymagany **Node.js 22.13+** (moduł `node:sqlite`).

## Najprostsze uruchomienie (bez terminala)

1. Zainstaluj **Node.js LTS** ze strony https://nodejs.org (jednorazowo).
2. Rozpakuj paczkę ZIP ze stroną (na GitHubie: zielony przycisk **Code → Download ZIP**).
3. Kliknij dwukrotnie:
   - **Windows:** `URUCHOM-WINDOWS.bat`
   - **Mac:** `URUCHOM-MAC.command` (za pierwszym razem: prawy przycisk → **Otwórz** → **Otwórz**)
4. Strona otworzy się w przeglądarce pod adresem http://localhost:3000. Aby ją wyłączyć, zamknij okno skryptu.

Pierwsze uruchomienie trwa kilka minut (instalacja pakietów), kolejne – kilkadziesiąt sekund.

## Uruchomienie lokalne (terminal)

```bash
npm install
cp .env.example .env.local     # uzupełnij klucze testowe Stripe (opcjonalnie)
npm run dev                    # http://localhost:3000
```

Bez kluczy Stripe strona działa w pełni (menu, koszyk, lokale, formularz zamówienia), a w podsumowaniu
zamówienia wyświetla komunikat, że płatności nie są skonfigurowane – zamówienie nie zostanie złożone.

Kontrole jakości:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Struktura

```
src/
  app/(noir)/               strony (/, /zamowienie, /zamowienie/sukces, /zamowienie/anulowano, dokumenty prawne)
    api/checkout            tworzy zamówienie + sesję Stripe Checkout (ceny liczone na serwerze)
    api/stripe/webhook      jedyne miejsce oznaczające zamówienie jako opłacone
    api/orders/status       status zamówienia (dla stron sukcesu/anulowania)
    api/orders/cancel       anulowanie nieopłaconego zamówienia (wygasza sesję Stripe)
    api/newsletter          zapis do newslettera (wymaga NEWSLETTER_WEBHOOK_URL)
  config/images.ts          ★ mapa zdjęć: plik → sekcja/produkt, teksty alternatywne
  config/site.ts            nazwa, nawigacja, kontakt, Instagram, linki do dokumentów
  data/menu.ts              ★ katalog produktów, ceny, kategorie, opcje każdego napoju
  data/options.ts           biblioteka opcji (rozmiary, mleko, temperatura, lód, ziarno, dodatki)
  data/locations.ts         ★ lokale, adresy, godziny otwarcia
  lib/pricing.ts            wycena i walidacja pozycji (wspólna dla przeglądarki i serwera)
  lib/pickup.ts             godziny odbioru w strefie Europe/Warsaw
  lib/validation.ts         walidacja zamówienia
  lib/server/               Stripe, baza SQLite, zamówienia, webhook, limity żądań
  components/               layout, sekcje strony głównej, koszyk, zamówienie, dokumenty
tests/                      testy Vitest
public/images/coffee/       ★ zdjęcia (lista nazw w README.md w tym katalogu)
```

## Zdjęcia

Wgraj pliki do `public/images/coffee/` pod nazwami z `src/config/images.ts`
(pełna lista: `public/images/coffee/README.md`). Brakujące zdjęcie zastępuje placeholder w stylistyce marki;
w trybie deweloperskim placeholder pokazuje oczekiwaną ścieżkę pliku. Po dodaniu zdjęć w produkcji przebuduj
projekt (`npm run build`).

## Menu i ceny

Wszystko w `src/data/menu.ts` (ceny w groszach, np. `1600` = 16 zł). Każdy napój wskazuje, które opcje są dla
niego dostępne, i może nadpisać etykietę lub dopłatę. Te same dane wykorzystuje serwer do przeliczenia ceny
przed utworzeniem płatności – przeglądarka nie może narzucić ceny.

## Płatności Stripe

### Jak to działa

1. `POST /api/checkout` waliduje koszyk, lokal, godzinę odbioru i dane klienta, przelicza ceny z katalogu,
   zapisuje zamówienie ze statusem `pending` i tworzy sesję **Stripe Checkout** (`locale: pl`, waluta PLN,
   wygaśnięcie po 30 min).
2. Klient płaci na stronie Stripe i wraca na `/zamowienie/sukces?session_id=…`.
3. Stripe wysyła zdarzenie na `/api/stripe/webhook`. Po weryfikacji podpisu i zgodności kwoty zamówienie
   dostaje status `paid`. Strona sukcesu odpytuje serwer i dopiero wtedy pokazuje potwierdzenie.
4. Statusy: `pending` (oczekujące), `paid` (opłacone), `cancelled` (anulowane / sesja wygasła),
   `failed` (płatność odrzucona).

Ochrona przed podwójnym zamówieniem: klucz idempotencji próby płatności (przeglądarka, sessionStorage) jest
unikalny w bazie – ponowne kliknięcie lub powrót ze Stripe wznawia tę samą sesję; przy zmianie treści
zamówienia tworzona jest nowa próba. Zdarzenia webhooka są zapisywane i przetwarzane dokładnie raz.

### Konfiguracja – tryb testowy

1. Załóż konto na [dashboard.stripe.com](https://dashboard.stripe.com) i włącz **tryb testowy**.
2. Skopiuj **Secret key** (`sk_test_…`) do `STRIPE_SECRET_KEY` w `.env.local`.
3. Zainstaluj [Stripe CLI](https://docs.stripe.com/stripe-cli) i przekaż webhooki lokalnie:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Wypisany sekret `whsec_…` wpisz do `STRIPE_WEBHOOK_SECRET` i uruchom ponownie `npm run dev`.
4. Zamów kawę i zapłać kartą testową `4242 4242 4242 4242` (dowolna przyszła data, dowolny CVC).
   Testowe płatności BLIK/Przelewy24 są dostępne, jeśli włączysz te metody w ustawieniach konta.

### Konfiguracja – produkcja

1. Aktywuj konto Stripe (dane firmy, rachunek do wypłat) i przełącz Dashboard na tryb **live**.
2. Ustaw na serwerze `STRIPE_SECRET_KEY=sk_live_…` oraz `NEXT_PUBLIC_SITE_URL=https://twoja-domena.pl`.
3. Dashboard → Developers → **Webhooks** → dodaj endpoint `https://twoja-domena.pl/api/stripe/webhook`
   ze zdarzeniami: `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed`, `checkout.session.expired`. Sekret podpisu wpisz do
   `STRIPE_WEBHOOK_SECRET`.
4. Settings → **Payment methods**: wybierz metody dla PLN (karty, BLIK, Przelewy24). Checkout pokaże je
   automatycznie – nie trzeba zmieniać kodu. Przelewy24 obsługiwane są przez Stripe, bez osobnej integracji.
5. Settings → **Emails**: włącz potwierdzenia płatności (paragony e-mail) dla klientów.
6. Klucze testowe i produkcyjne trzymaj w osobnych środowiskach; strona pokazuje baner „Tryb testowy”, gdy
   używany jest klucz `sk_test_`.

### Baza zamówień

SQLite (`ORDERS_DB_PATH`, domyślnie `data/orders.sqlite`) działa na serwerze z trwałym dyskiem (VPS, kontener z
wolumenem). Na platformach serverless (np. Vercel) system plików jest ulotny – podmień implementację w
`src/lib/server/orders.ts` i `db.ts` na bazę zewnętrzną (np. Postgres), zachowując interfejs funkcji.
Zamówienia można podejrzeć poleceniem `sqlite3 data/orders.sqlite "select number,status,pickup_date,pickup_time from orders"`
– panel dla baristów nie jest częścią projektu.

## Google Maps

Mapa w sekcji „Nasze lokale” wczytuje się dopiero po kliknięciu (zgoda na pliki cookie Google).

- Bez klucza używany jest standardowy, publiczny embed Google Maps.
- Z kluczem `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` – oficjalne **Maps Embed API** (Google Cloud Console → włącz
  „Maps Embed API” → utwórz klucz i ogranicz go do swojej domeny).
- Dopóki lokal ma `verified: false` w `src/data/locations.ts`, mapa pokazuje ogólny widok Gdańska z oznaczeniem
  „mapa demonstracyjna”. Po wpisaniu prawdziwego adresu ustaw `verified: true` – mapa pokaże wtedy adres
  (wyszukiwanie po tekście, bez ręcznych współrzędnych).

## Newsletter

Bez konfiguracji formularz waliduje dane i uczciwie informuje, że adres **nie został zapisany**. Aby zbierać
zapisy, ustaw `NEWSLETTER_WEBHOOK_URL` (opcjonalnie `NEWSLETTER_WEBHOOK_SECRET`, wysyłany jako `Authorization: Bearer`).
Endpoint otrzyma JSON `{ email, consent, consentText, consentAt, source }`. Rekomendowany jest dostawca z
podwójnym potwierdzeniem zapisu (double opt-in).

## Przed uruchomieniem dla prawdziwych klientów

- [ ] Uzupełnić dane sprzedawcy (nazwa, adres, NIP, REGON, CEIDG/KRS, e-mail, telefon) – `src/config/site.ts`
      i wszystkie miejsca oznaczone „do uzupełnienia” w dokumentach (`src/app/regulamin`, `polityka-prywatnosci`,
      `cookies`, `platnosci-i-zwroty`, `kontakt`).
- [ ] Dać dokumenty prawne do weryfikacji prawnikowi; ustalić zasady nieodebranych zamówień, ewentualnego
      anulowania opłaconych zamówień, informacji o alergenach i dokumentowania sprzedaży (kasa fiskalna).
- [ ] Skonfigurować wysyłkę potwierdzenia zawarcia umowy na trwałym nośniku (e-mail z treścią zamówienia).
- [ ] Wpisać prawdziwe adresy i godziny lokali, ustawić `verified: true`.
- [ ] Wgrać zdjęcia w dobrej rozdzielczości i potwierdzić prawa do nich.
- [ ] Aktywować konto Stripe, ustawić klucze live, webhook i metody płatności; wykonać płatność testową na produkcji.
- [ ] Zapewnić trwałą bazę zamówień (wolumen lub Postgres) i sposób przekazywania zamówień do lokali
      (panel/powiadomienia dla baristów).
- [ ] Ustawić `NEXT_PUBLIC_SITE_URL`, HTTPS, `NEXT_PUBLIC_INSTAGRAM_URL`, a po uzupełnieniu danych
      `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- [ ] Podłączyć newsletter (lub usunąć sekcję) i zaktualizować politykę prywatności o dostawców.
