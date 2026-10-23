# KAPITAJNY – sklep z bluzami i spodniami

Sklep internetowy streetwear z dwiema kategoriami: **bluzy** i **spodnie**. Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, TypeScript, SQLite (`node:sqlite`), płatności Stripe Checkout.

## Uruchomienie

Wymagany Node.js **22.13+**.

```bash
npm install
npm run dev          # http://localhost:3000
```

Bez instalowania czegokolwiek ręcznie: dwuklik w `URUCHOM-MAC.command` (macOS/Linux) albo `URUCHOM-WINDOWS.bat` (Windows). Skrypty budują wersję produkcyjną i włączają zamówienia demonstracyjne.

| Polecenie | Co robi |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript bez emisji |
| `npm test` | testy Vitest (`tests/`) |
| `npm run build` / `npm start` | wersja produkcyjna |

Konfiguracja: skopiuj `.env.example` do `.env.local` i uzupełnij potrzebne wartości.

## Co działa

- **Katalog** – 31 produktów (17 bluz, 14 par spodni), każdy kolor ma własne zdjęcie i zdjęcie detalu. Kategorie `/kategoria/bluzy`, `/kategoria/spodnie`, podkategorie (np. `/kategoria/spodnie/cargo`), `/sklep`, `/nowosci` (najnowszy drop), `/kolekcje`.
- **Filtry** zapisywane w adresie (można skopiować link): rozmiar, kolor, krój, cena, rodzaj, dostępność; sortowanie, wyszukiwanie, licznik wyników, „Pokaż więcej”, pusty stan, czyszczenie filtrów.
- **Karta produktu** – galeria, wybór koloru (`?kolor=`), rozmiaru i ilości, aktualna dostępność z serwera, blokada niedostępnych rozmiarów, tabela rozmiarów (wymiary przykładowe), dostawa i zwroty, produkty powiązane, ulubione.
- **Koszyk** – zapamiętywany w przeglądarce (także po odświeżeniu i między kartami), zmiana ilości, koloru i rozmiaru, usuwanie, sprawdzanie dostępności na serwerze.
- **Zamówienie** – dane, adres, dostawa (kurier / punkt odbioru), płatność. Serwer ponownie wylicza ceny z katalogu, sprawdza i rezerwuje stan magazynowy (bez nadsprzedaży) i tworzy sesję Stripe. Opłacenie zapisuje wyłącznie webhook Stripe (z kontrolą kwoty i duplikatów zdarzeń).
- **Zamówienia demonstracyjne** – do testów bez Stripe: zapisywane z numerem `DEMO-…`, wyraźnie opisane jako niezrealizowane, bez płatności i bez wpływu na stany. Domyślnie włączone poza produkcją (`DEMO_ORDERS`).
- **Konta** – rejestracja, logowanie, wylogowanie, historia zamówień, reset hasła (hasła scrypt, sesje w bazie, ciasteczko httpOnly).
- **Newsletter i formularz kontaktowy** – przekazywane przez webhook; bez konfiguracji formularz mówi wprost, że nic nie zostało wysłane.
- **SEO** – tytuły i opisy, Open Graph, `sitemap.xml`, `robots.txt`, dane strukturalne (sklep, ścieżka, produkt z ceną – bez ocen, recenzji i deklaracji dostępności).

## Co wymaga konfiguracji przed sprzedażą

| Co | Gdzie |
| --- | --- |
| Adres sklepu | `NEXT_PUBLIC_SITE_URL` (wymagany w produkcji do płatności Stripe) |
| Płatności | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`; webhook na `/api/stripe/webhook` ze zdarzeniami `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired` |
| Dane sprzedawcy, kontakt, social media | zmienne `NEXT_PUBLIC_SELLER_*`, `NEXT_PUBLIC_CONTACT_*`, `NEXT_PUBLIC_*_URL` – do tego czasu strona pokazuje „do uzupełnienia” |
| Newsletter, kontakt, e-maile resetu hasła | `NEWSLETTER_WEBHOOK_URL`, `CONTACT_WEBHOOK_URL`, `MAIL_WEBHOOK_URL` |
| Regulamin i polityka prywatności | wersje robocze – do weryfikacji przez prawnika |
| Ceny dostawy | `src/data/shipping.ts` (przykładowe) |
| Produkty, stany, tabele rozmiarów | `src/data/catalog.ts` (dane demonstracyjne, wymiary przykładowe) |
| Pasek ogłoszeń | `src/config/site.ts` → `announcement` |
| Indeksowanie | `NEXT_PUBLIC_ALLOW_INDEXING=true` dopiero po uzupełnieniu danych |
| Baza | `DATABASE_PATH` na trwałym dysku; na hostingu serverless trzeba podmienić SQLite na zewnętrzną bazę |

## Zdjęcia

`public/images/products/` – zdjęcia produktów na jasnym tle studyjnym: cztery zdjęcia dostarczone przez właściciela (biała bluza, czarna bluza boxy, białe i czarne szerokie spodnie), sześć zdjęć wygenerowanych AI (Figma) oraz warianty kolorystyczne i wersje z nadrukiem logo przygotowane z nich programowo. To zdjęcia poglądowe – przed startem zastąp je zdjęciami rzeczywistych produktów (te same nazwy plików, format 4:5). Logo: `public/images/brand/` (wersja na ciemne tło ma odwrócone kolory, tak jak nadruk na czarnych bluzach).

## Struktura

```
src/data/catalog.ts        produkty, kategorie, kolory, kroje, dropy, kolekcje, tabele rozmiarów
src/data/shipping.ts       metody i ceny dostawy
src/lib/catalog.ts         wyszukiwanie, filtry, sortowanie, filtry ↔ adres
src/lib/pricing.ts         wycena koszyka (wspólna dla przeglądarki i serwera)
src/lib/validation.ts      walidacja formularzy
src/lib/server/            baza, zamówienia, stany, płatności, konta, webhooki
src/app/                   strony i API
src/components/            UI
tests/                     testy
```
