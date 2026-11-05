# ComputerIT – Concept 02

Druga, niezależna wersja strony ComputerIT. Pierwsza wersja (`../computerit/`) pozostaje bez zmian i działa
osobno – oba katalogi mają własne zależności, konfigurację i własne kopie wersji demonstracyjnych.

Kierunek wizualny „Obwód”: czerń, grafit, biel i szarości z logo, jeden akcent – złota linia obwodu.
Znak monitora z logo (z kwadracikiem w rogu ekranu) wraca jako znacznik list, kroków i etykiet. W hero na ekranie
monitora na zmianę „składa się” szkic strony internetowej i sklepu.

## Uruchomienie

Bez terminala: dwuklik w `URUCHOM-WINDOWS.bat` (Windows) albo `URUCHOM-MAC.command` (macOS – za pierwszym razem
prawy przycisk → **Otwórz**). Strona otworzy się pod adresem **http://localhost:3001**.

W terminalu (wymagany Node.js 22.13+):

```bash
cd computerit-02
npm install
cp .env.example .env.local     # dane kontaktowe i konfiguracja formularza
npm run dev                    # http://localhost:3001
```

Concept 02 używa portu **3001**, więc może działać jednocześnie z pierwszą wersją (port 3000).

Kontrole jakości:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Powrót do poprzedniej strony

Pierwsza wersja nie została zmieniona. Aby z niej korzystać, uruchom ją jak dotąd z katalogu `computerit/`
(`URUCHOM-WINDOWS.bat`, `URUCHOM-MAC.command` albo `npm run dev`). Aby całkowicie zrezygnować z Concept 02,
wystarczy usunąć katalog `computerit-02/` (oraz wpisy `computerit-02` w `tsconfig.json` i `eslint.config.mjs`
w katalogu głównym repozytorium).

## Podstrony

| Adres                   | Zawartość                                                                  |
| ----------------------- | -------------------------------------------------------------------------- |
| `/`                     | hero, usługi, Dlaczego ComputerIT, realizacje z filtrem, proces, cennik, CTA |
| `/uslugi`               | obie usługi, standard każdego projektu, co ustalamy indywidualnie, FAQ     |
| `/strony-internetowe`   | rodzaje stron, korzyści, zakres, cennik (promocja + od 1 300 zł netto)      |
| `/sklepy-internetowe`   | funkcje sklepu, integracje bez obietnic, cena od 2 000 zł netto            |
| `/realizacje`           | wszystkie koncepcje demonstracyjne z filtrem Strony / Sklepy               |
| `/o-nas`                | podejście i zasady współpracy                                              |
| `/kontakt`              | formularz (z wyborem usługi i projektu z adresu `?usluga=…&projekt=…`)     |
| `/regulamin-uslug`      | projekt regulaminu usług – do weryfikacji prawnej                          |
| `/regulamin-platnosci`  | projekt regulaminu płatności – wyłącznie przelew bankowy                   |
| `/polityka-prywatnosci` | projekt polityki prywatności                                               |

Fragmenty dokumentów oznaczone na stronie jako **[do uzupełnienia]** wymagają danych i decyzji ComputerIT.

## Formularz kontaktowy

`POST /api/contact` waliduje dane tymi samymi regułami co przeglądarka (`src/lib/contact.ts`), ogranicza liczbę
zapytań z jednego adresu IP, odrzuca boty polem-pułapką i blokuje podwójne wysłanie. Zapytanie trafia do
skonfigurowanych kanałów (zmienne środowiskowe serwera – nic z tego nie trafia do kodu w przeglądarce):

| Kanał          | Zmienne                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------ |
| SMTP           | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` |
| Webhook / API  | `CONTACT_WEBHOOK_URL`, opcjonalnie `CONTACT_WEBHOOK_SECRET` (nagłówek `Authorization: Bearer`)    |

**Bez żadnego kanału formularz nie udaje wysyłki** – API zwraca 503, a użytkownik widzi komunikat, że wiadomość
nie została wysłana. Limit zapytań działa w pamięci procesu; przy kilku instancjach serwera zastąp go współdzielonym.

## Wersje demonstracyjne

Dwanaście koncepcji w `public/demo/<slug>/`, każda pod własnym adresem `/demo/<slug>`. Na każdej stronie dema jest
pasek ComputerIT: etykieta „Wersja demonstracyjna”, „Portfolio” (powrót) i „Chcę podobną stronę” / „Chcę podobny
sklep” (formularz z wybraną usługą i projektem). Pasek unosi się nad dolnymi paskami dem i można go zwinąć.

- `npm run demo:bar` – wstawia/odświeża pasek we wszystkich demach (po dodaniu nowego dema dopisz jego rodzaj
  w `scripts/add-demo-bar.mjs` i dane w `src/data/projects.ts`).
- `npm run demo:noir` – przebudowuje NOIR COFFEE z kodu w katalogu nadrzędnym (wymaga `npm install` tam).
  Zamówienie kończy się podsumowaniem „zamówienie demo” – bez płatności i bez wysyłki danych.
- `node scripts/patch-novelia-demo.mjs` – podpina w NOVELIA ZDROWIE działający koszyk demo (`assets/demo-cart.js`).

Sklepy demo zapisują koszyk tylko w pamięci przeglądarki odwiedzającego (localStorage) – nie wpływają na innych
użytkowników i nie przyjmują prawdziwych zamówień ani płatności.

## Struktura

```
src/
  app/                  podstrony, API formularza, SEO (sitemap, robots, Open Graph, ikona), 404
  components/brand/     logo (znak monitora + wordmark)
  components/layout/    nagłówek z menu mobilnym (<dialog>), stopka
  components/sections/  hero, usługi, powody, realizacje, proces, cennik, CTA
  components/contact/   formularz kontaktowy
  components/legal/     układ dokumentów prawnych
  config/site.ts        nazwa, nawigacja, dane kontaktowe (z env)
  data/                 oferta, ceny, FAQ, realizacje
  lib/                  walidacja formularza, wysyłka (SMTP / webhook), limit zapytań
scripts/                pasek dem, budowanie NOIR, koszyk NOVELIA
tests/                  testy Vitest
```

## Ruch i dostępność

- Animacje są krótkie i subtelne (pojawianie się sekcji, impulsy na ścieżkach obwodu, ekran monitora).
  Przy `prefers-reduced-motion` są wyłączone – widać statyczny szkic strony.
- Menu mobilne to modalny `<dialog>`: Esc zamyka, fokus wraca na przycisk.
- Formularz: etykiety, komunikaty błędów powiązane z polami, podsumowanie błędów z linkami do pól,
  komunikaty statusu dla czytników ekranu.
