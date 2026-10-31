# NOVELIA ZDROWIE – sklep z e-bookami

Sklep internetowy marki NOVELIA ZDROWIE nastawiony na sprzedaż głównego e-booka **„Zdrowiej każdego dnia”
(39,99 zł)** oraz trzech kolejnych publikacji (29,99 zł). Pliki PDF są wydawane wyłącznie po potwierdzeniu
płatności, przez podpisane linki o ograniczonej ważności.

> Raport z prac i lista elementów do konfiguracji: [`RAPORT.md`](RAPORT.md).

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**, **Tailwind CSS 4**
- **Stripe Checkout** (karta, BLIK, Przelewy24 – zależnie od ustawień konta) + webhook
- **SQLite** wbudowany w Node.js (`node:sqlite`) – zamówienia i historia pobrań
- E-maile: **Resend** (API) lub dowolny **SMTP** (nodemailer)
- **Vitest** – testy walidacji, linków, zamówień, webhooka, e-maili

Wymagany **Node.js 22.13+**.

## Uruchomienie

Najprościej: dwuklik w `URUCHOM-NOVELIA-WINDOWS.bat` / `URUCHOM-NOVELIA-MAC.command` (w katalogu głównym repozytorium).

W terminalu:

```bash
cd novelia-zdrowie
npm install
cp .env.example .env.local        # uzupełnij według potrzeb
npm run dev                       # http://localhost:3000
```

Kontrole jakości: `npm run lint && npm run typecheck && npm test && npm run build`

### ⚠️ Plik PDF e-booka nie jest w repozytorium

Repozytorium jest publiczne, dlatego pełne pliki PDF i źródła e-booka są wykluczone z gita (`private/` w `.gitignore`).
Skopiuj plik `zdrowiej-kazdego-dnia.pdf` do **`novelia-zdrowie/private/ebooks/`** (lokalnie i na serwerze).
Bez niego produkt wyświetla się jako „w przygotowaniu” i nie da się go kupić. Szczegóły: [`private/README.md`](private/README.md).

## Jak działa sprzedaż

1. Klient dodaje e-book do koszyka (lub klika **KUP TERAZ**), podaje e-mail, akceptuje regulaminy i składa
   oświadczenie o dostarczeniu treści cyfrowej przed upływem terminu odstąpienia (art. 38 ust. 1 pkt 13 UPK).
2. `POST /api/checkout` waliduje dane, **przelicza cenę z katalogu na serwerze**, sprawdza, czy plik PDF istnieje,
   tworzy zamówienie `pending` i sesję Stripe Checkout (ochrona przed podwójnym zamówieniem – klucz idempotencji).
3. Stripe wysyła zdarzenie na `/api/stripe/webhook` → weryfikacja podpisu i kwoty → status `paid` (jedyne miejsce,
   które może oznaczyć zamówienie jako opłacone). Zdarzenia są przetwarzane dokładnie raz.
4. Po opłaceniu: e-mail z linkami (z potwierdzeniem złożonych oświadczeń) + linki na stronie `/zamowienie/sukces`.
5. `/api/pobierz/<token>` – token HMAC-SHA256 (zamówienie + produkt + data wygaśnięcia); serwer sprawdza podpis,
   ważność, status `paid` i limit pobrań, a plik czyta z katalogu prywatnego (nigdy z `public/`).
6. `/pobieranie` – klient podaje e-mail i numer zamówienia (NZ-XXXXXX) → nowe linki na adres z zamówienia
   (odpowiedź zawsze taka sama – brak ujawniania, czy zamówienie istnieje).

Bez kluczy Stripe sklep działa w całości, ale przy próbie płatności uczciwie informuje, że płatności nie są
skonfigurowane – zamówienie nie zostaje opłacone ani „udawane”.

## Konfiguracja

Wszystkie zmienne opisuje [`.env.example`](.env.example). Najważniejsze:

| Zmienna | Opis |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL`, `SITE_URL` | adres sklepu (wymagany w produkcji) |
| `NEXT_PUBLIC_SELLER_*` | dane sprzedawcy w stopce, kontakcie i dokumentach |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | płatności |
| `DOWNLOAD_SECRET` | sekret podpisywania linków (min. 32 znaki, wymagany w produkcji) |
| `DOWNLOAD_LINK_TTL_HOURS`, `DOWNLOAD_MAX_PER_ITEM` | ważność linku (72 h) i limit pobrań (10) |
| `EMAIL_PROVIDER`, `EMAIL_FROM`, `RESEND_API_KEY` / `SMTP_*` | wysyłka e-maili |
| `SHOP_NOTIFICATIONS_EMAIL` | kopie zamówień i wiadomości z formularza kontaktowego |
| `ORDERS_DB_PATH` | plik bazy SQLite (trwały wolumen na serwerze) |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` dopiero po uzupełnieniu danych i dokumentów |

### Stripe – tryb testowy

1. Dashboard Stripe w trybie testowym → skopiuj `sk_test_…` do `STRIPE_SECRET_KEY`.
2. `stripe listen --forward-to localhost:3000/api/stripe/webhook` → sekret `whsec_…` do `STRIPE_WEBHOOK_SECRET`.
3. Zapłać kartą testową `4242 4242 4242 4242`.

Produkcja: klucz `sk_live_…`, webhook `https://twoja-domena.pl/api/stripe/webhook` ze zdarzeniami
`checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`,
`checkout.session.expired`; w Settings → Payment methods włącz BLIK i Przelewy24 dla PLN.

### E-maile

`EMAIL_PROVIDER=resend` + `RESEND_API_KEY` (domena nadawcy zweryfikowana w Resend) **albo**
`EMAIL_PROVIDER=smtp` + `SMTP_HOST/PORT/USER/PASS`. Bez konfiguracji e-maile nie są wysyłane; w trybie
deweloperskim podgląd trafia do `data/outbox/`. Klient zawsze może pobrać plik ze strony potwierdzenia.

## Struktura

```
src/
  app/                       strony: /, /sklep, /sklep/[slug], /koszyk, /zamowienie/*, /pobieranie, /kontakt, 7 dokumentów
    api/checkout             zamówienie + sesja Stripe
    api/stripe/webhook       potwierdzenie płatności, wysyłka e-maila
    api/orders/status        status (+ linki tylko z identyfikatorem sesji płatności)
    api/orders/cancel        anulowanie nieopłaconego zamówienia
    api/pobierz/[token]      wydawanie PDF z katalogu prywatnego
    api/downloads/resend     nowe linki e-mailem
    api/contact              formularz kontaktowy
  data/products.ts           ★ katalog: opisy, ceny (grosze), spisy treści, podglądy, nazwy plików PDF
  data/faq.ts                ★ pytania FAQ
  config/site.ts             nawigacja, dane sprzedawcy (z env)
  lib/server/                Stripe, baza, zamówienia, linki, pliki, e-maile
  components/                layout, sekcje strony głównej, produkt, koszyk, zamówienie, dokumenty
public/images/               okładki, podglądy stron, ilustracje (publiczne – bez pełnych PDF)
private/                     ★ poza gitem: ebooks/*.pdf oraz ebook-source/ (źródła e-booka)
tests/                       testy Vitest
```

## Dodanie nowej publikacji / uruchomienie sprzedaży „w przygotowaniu”

1. Wgraj gotowy PDF do `private/ebooks/` pod nazwą z pola `file` w `src/data/products.ts`
   (np. `zdrowe-sniadania.pdf`).
2. Uzupełnij opis/spis treści w `products.ts` (usuń `comingSoonNote`, jeśli nie jest potrzebne).
3. `npm run build` i restart – produkt automatycznie stanie się dostępny do zakupu.

## Wdrożenie

Wymagany serwer Node.js z trwałym dyskiem (VPS, kontener z wolumenem) – ze względu na SQLite i pliki PDF
na dysku. Na platformach serverless (np. Vercel) należy przenieść zamówienia do zewnętrznej bazy (np. Postgres),
a pliki do prywatnego magazynu (np. S3 z podpisanymi URL-ami), zachowując interfejsy z `src/lib/server/`.
