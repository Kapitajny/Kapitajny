# VITALIS MED – strona prywatnego pogotowia ratunkowego

Kompletna strona internetowa prywatnego pogotowia ratunkowego: ratownictwo medyczne, transport sanitarny i medyczny,
usługi komercyjne i świadczenia w ramach NFZ. Strona główna z wszystkimi sekcjami, 6 podstron tematycznych,
5 dokumentów prawnych, formularz zapytania z walidacją i serwerowym API.

> **Projekt demonstracyjny.** Liczby (20 ambulansów, ok. 200 pracowników), ceny, adres, telefon, e-mail, zakres umowy
> z NFZ i dokumenty prawne są **przykładowe**. Dane rejestrowe (NIP, REGON, KRS, RPWDL) są celowo puste i na stronie
> wyświetlają się jako „[do uzupełnienia]”. Dokumenty prawne to projekty wymagające weryfikacji prawnej.

## Uruchomienie

**Bez terminala:** zainstaluj [Node.js LTS](https://nodejs.org), a następnie kliknij dwukrotnie
`URUCHOM-WINDOWS.bat` (Windows) lub `URUCHOM-MAC.command` (Mac – za pierwszym razem: prawy przycisk → Otwórz).
Strona otworzy się pod adresem http://localhost:3000.

**Terminal:**

```bash
cd vitalis-med
npm install
cp .env.example .env.local   # opcjonalnie – konfiguracja formularza i mapy
npm run dev                  # http://localhost:3000
```

Kontrole jakości: `npm run lint && npm run typecheck && npm test && npm run build`

Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, Vitest. Wymagany Node.js 22.13+.

Wygląd: koncepcja oparta na analizie serwisów CMP, AMEDS i LUX MED (zrzuty i pomiary z przeglądarki): duży panel hero
z wyciętym z tła ambulansem i paskiem akcji, prezentacja floty z zakładkami T/S/P, usługi z ceną orientacyjną, pasek
„Dla pacjentów / Dla firm” z ustawieniami dostępności (powiększenie tekstu, wysoki kontrast), przycisk szybkiego kontaktu.
Typografia: Albert Sans (nagłówki 700, tekst 300/400). Zdjęcia powiększone 4× modelem Real-ESRGAN, pojazdy wycięte z tła
(rembg) – skrypty nie są częścią projektu.

## Struktura stron

| Adres | Zawartość |
| --- | --- |
| `/` | Hero, O nas + statystyki, Flota, Usługi, NFZ, Cennik, Zespół, Dlaczego my, Kontakt z formularzem i mapą |
| `/o-nas` | Opis firmy, statystyki, wartości, standardy, zespół, dlaczego my |
| `/uslugi` | 8 usług z opisami (kotwice `/uslugi#<slug>`), proces zamawiania |
| `/flota` | Ambulanse typu T (4), S (5), P (11) z wyposażeniem i składem zespołu, galeria, standardy floty |
| `/cennik` | Cennik usług komercyjnych, czynniki wyceny, formy płatności |
| `/nfz` | Zakres umowy, zasady, porównanie NFZ / usługi prywatne, krok po kroku, FAQ |
| `/kontakt` | Dane kontaktowe, formularz, mapa, dane rejestrowe |
| `/regulamin`, `/polityka-prywatnosci`, `/polityka-cookies`, `/klauzula-rodo`, `/prawa-pacjenta` | Projekty dokumentów |

## Gdzie edytować treści (★)

| Plik | Co zawiera |
| --- | --- |
| `src/config/site.ts` | Nazwa, telefon, e-mail, adres, godziny, **statystyki**, dane rejestrowe, menu |
| `src/data/fleet.ts` | Kategorie ambulansów, **liczby pojazdów**, wyposażenie, zdjęcia, galeria |
| `src/data/services.ts` | Usługi (tytuły, opisy, ikony, czy wymagają trasy w formularzu) |
| `src/data/pricing.ts` | **Cennik** (`priceFrom: null` = wycena indywidualna) i czynniki wyceny |
| `src/data/nfz.ts` | Zakres umowy z NFZ, oddział, okres, zasady, FAQ |
| `src/data/team.ts` | Stanowiska w zespole i powody „Dlaczego my?” |
| `src/app/<dokument>/page.tsx` | Treść dokumentów prawnych (pola do uzupełnienia oznaczone `<Fill>`) |

Polska typografia: pojedyncze spójniki i przyimki (w, z, i, o, a, u) są łączone z następnym wyrazem twardą spacją,
aby nie zostawały na końcu wiersza. Dopisując tekst, możesz użyć ` ` lub zwykłej spacji.

## Formularz kontaktowy

Walidacja działa w przeglądarce i na serwerze (`src/lib/contact.ts`). Formularz nie wymaga diagnozy ani danych
o stanie zdrowia. Zapytania trafiają do `POST /api/kontakt` (limit 5 zapytań / 10 min na adres IP, pole-pułapka na boty).

Ustaw **jeden** sposób dostarczania w `.env.local` lub w panelu hostingu (szczegóły w `.env.example`):

- `CONTACT_WEBHOOK_URL` (+ opcjonalnie `CONTACT_WEBHOOK_SECRET`) – JSON do Make / Zapier / n8n / własnego systemu,
- albo `RESEND_API_KEY` + `CONTACT_EMAIL_TO` + `CONTACT_EMAIL_FROM` – e-mail przez [Resend](https://resend.com).

**Bez konfiguracji formularz niczego nie udaje:** nad formularzem widać informację o wersji demonstracyjnej, a po
wysłaniu użytkownik dostaje komunikat, że zapytanie NIE zostało wysłane, z numerem telefonu. Po zmianie zmiennych
przebuduj stronę (`npm run build`), aby zniknęła informacja o wersji demonstracyjnej.

## Zdjęcia i logo

- Zdjęcia: `public/images/flota/*.webp` – wyłącznie prawdziwe fotografie dostarczone przez klienta, przekonwertowane
  do WebP (Next.js dodatkowo serwuje AVIF/WebP w rozmiarach dopasowanych do ekranu). Z Forda (typ T) usunięto widoczną
  tablicę rejestracyjną. Grafika wygenerowana przez AI została usunięta ze strony.
- **Przed publikacją** zastąp zdjęcia fotografiami własnej floty – część dostarczonych zdjęć pokazuje oznakowanie innych
  podmiotów (np. „Sopot”, oznaczenia szpitali) i może być chroniona prawem autorskim.
- **Zdjęcie zespołu:** wgraj `public/images/zespol/zespol.webp` (poziome, min. 1600×900 px) – pojawi się automatycznie
  w sekcji „Nasz zespół”. Do tego czasu sekcja jest zaprojektowana bez zdjęcia.
- Logo: `src/components/brand/` – wektorowy obrys dostarczonego logo (wersja jasna i ciemna, z hasłem i bez),
  favicon `src/app/icon.svg`, ikona Apple `src/app/apple-icon.png`.

## SEO i dostępność

- Unikalne tytuły, opisy i adresy kanoniczne każdej podstrony, Open Graph, `sitemap.xml`, dane strukturalne
  (MedicalOrganization, BreadcrumbList), jeden H1 na stronę i hierarchia H2–H3.
- Indeksowanie jest **wyłączone**, dopóki nie ustawisz `NEXT_PUBLIC_ALLOW_INDEXING=true` (dane są przykładowe).
- WCAG 2.1 AA: kontrast tekstów, widoczny fokus, link „Przejdź do treści”, etykiety i komunikaty błędów powiązane
  z polami (`aria-describedby`, `aria-invalid`), podsumowanie błędów, menu mobilne na `<dialog>` (Escape, pułapka
  fokusu), animacje wyłączane przy `prefers-reduced-motion`. Audyt axe-core: brak naruszeń na wszystkich podstronach.
- Mapa Google ładuje się dopiero po kliknięciu (zgoda na pliki cookie Google), zgodę można cofnąć w Polityce cookies.

## Przed publikacją – lista kontrolna

- [ ] Prawdziwe dane: nazwa i forma prawna, adres (`addressVerified: true`), telefon, e-mail, NIP/REGON/KRS/RPWDL
- [ ] Liczby floty i pracowników, cennik, formy płatności
- [ ] Zakres umowy z NFZ (oddział, okres, rodzaje świadczeń) – albo usunięcie sekcji
- [ ] Weryfikacja prawna regulaminu, polityki prywatności, klauzuli RODO i informacji o prawach pacjenta
- [ ] Własne zdjęcia floty i zespołu
- [ ] Konfiguracja formularza (webhook lub Resend) i test wysyłki
- [ ] `NEXT_PUBLIC_SITE_URL` i `NEXT_PUBLIC_ALLOW_INDEXING=true`
