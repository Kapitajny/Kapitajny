# REHABILITIS – strona gabinetu rehabilitacji i fizjoterapii

Strona gabinetu z podstronami: strona główna (z wyborem dolegliwości według okolic ciała), usługi, o gabinecie,
cennik, FAQ i kontakt
z formularzem prośby o kontakt, mapą dojazdu wczytywaną po zgodzie oraz dokumentami: regulaminem strony,
polityką prywatności i informacją o plikach cookies.

> **Wersja robocza.** Strona nie zawiera wymyślonych danych: telefon, e-mail, adres, godziny, ceny, dane
> fizjoterapeuty i część odpowiedzi w FAQ są oznaczone „do uzupełnienia”. Dopóki brakuje danych kontaktowych,
> na górze strony widnieje pasek „Wersja robocza strony”.

## Stack

- **Next.js 16** (App Router, Turbopack, Cache Components), **React 19**, **TypeScript**
- **Tailwind CSS 4** – tokeny kolorów i typografii w `src/app/globals.css`
- Krój: **Instrument Sans** (jedna rodzina; nagłówki zwężone osią szerokości), ładowany przez `next/font`
- Design system: `DESIGN-SYSTEM.md` (kolory, typografia, odstępy, komponenty, zasady zdjęć)

### Kierunek wizualny

„Zakres ruchu”: stały jasnozielony panel nawigacji po lewej (na telefonie pasek z przyciskiem „Menu”), ciepła
biel jako tło, duże zwężone nagłówki i zdjęcia z łagodnie zaokrąglonymi rogami. Hero to nagłówek na całą
szerokość, fakty o pierwszej wizycie i mozaika trzech zdjęć. Jedyny motyw graficzny – łuk zakresu ruchu
(skala 0–180°) – pokazuje kolejne kroki pierwszej wizyty. Każda podstrona ma własny układ: stykówka zdjęć
jako spis usług, cennik z kropkami prowadzącymi do ceny, FAQ z przyklejoną kolumną, formularz na białym arkuszu.
Brakujące dane kontaktowe są ukrywane, a o wersji roboczej informuje jeden pasek nad treścią.

## Uruchomienie

Bez terminala: dwuklik `URUCHOM-WINDOWS.bat` (Windows) albo `URUCHOM-MAC.command` (Mac) w tym katalogu.

Z terminala:

```bash
cd rehabilitis
npm install
cp .env.example .env.local     # opcjonalnie: podłączenie formularza, kalendarza, map
npm run dev                    # http://localhost:3000
```

Kontrole jakości:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Gdzie co edytować (★ = pliki dla właściciela)

```
src/config/site.ts        ★ nazwa marki, telefon, e-mail, adres, godziny, dane firmy, link do rezerwacji
src/config/images.ts      ★ zdjęcia: plik → miejsce na stronie, teksty alternatywne, oznaczenie „poglądowe”
src/data/conditions.ts    ★ „Z czym możesz przyjść?” – dolegliwości według okolic ciała
src/data/services.ts      ★ usługi (opis, zakres, zdjęcie, potwierdzenie przez gabinet)
src/data/pricing.ts       ★ cennik (PRZYKŁADOWE ceny – PRICES_ARE_EXAMPLES), czas trwania, formy płatności
src/data/faq.ts           ★ pytania i odpowiedzi ([[tekst]] = oznaczenie „do uzupełnienia”)
src/data/team.ts          ★ fizjoterapeuta: imię i nazwisko, wykształcenie, kwalifikacje, doświadczenie
src/data/testimonials.ts  ★ prawdziwe opinie pacjentów (pusta lista = spokojny pusty stan)
src/data/values.ts          zasady pracy gabinetu (strona główna i „O gabinecie”)
src/app/                  podstrony: /, /uslugi, /o-gabinecie, /cennik, /faq, /kontakt, dokumenty (regulamin, prywatność, cookies), sitemap, robots, OG, API
  api/contact             przyjmuje formularz i przekazuje go do gabinetu (e-mail lub webhook)
src/components/home/      hero strony głównej, opinie
src/components/sections/  sekcje wspólne (dolegliwości, karta usług, kroki wizyty, FAQ, formularz, mapa, zakończenie strony)
src/components/layout/    panel nawigacji / pasek mobilny, stopka, pasek akcji na telefonach, pasek wersji roboczej
src/lib/contact.ts        pola i walidacja formularza (wspólna dla przeglądarki i serwera)
src/lib/server/           wysyłka zgłoszeń, limit żądań
tests/                    testy Vitest
public/images/rehab/      zdjęcia (lista w README.md w tym katalogu)
```

Nazwę marki zmienisz w jednym miejscu: `siteConfig.name` w `src/config/site.ts` (logo, tytuły, stopka, OG).

## Formularz kontaktowy

Formularz zbiera: imię, preferowany sposób kontaktu, telefon **albo** e-mail, preferowany dzień i porę dnia,
opcjonalnie usługę i krótką wiadomość. Nie prosi o informacje o stanie zdrowia. Przycisk „Zapytaj o wizytę”
przy usłudze przewija do formularza i podstawia tę usługę.

Komunikat o sukcesie pojawia się **tylko**, gdy serwer przekaże zgłoszenie dalej. Do wyboru (można oba):

1. **E-mail przez [Resend](https://resend.com)** – ustaw `RESEND_API_KEY`, `CONTACT_EMAIL_TO` (skrzynka
   gabinetu) i `CONTACT_EMAIL_FROM` (nadawca w domenie zweryfikowanej w Resend). Odpowiedź na e-mail trafi
   do pacjenta, jeśli wybrał kontakt mailowy.
2. **Webhook** – `CONTACT_WEBHOOK_URL` (+ opcjonalnie `CONTACT_WEBHOOK_SECRET`, wysyłany jako
   `Authorization: Bearer …`). Endpoint dostaje JSON
   `{ type: "contact_request", submittedAt, source, request: {...}, summary }`. Nadaje się do Make/Zapier,
   arkusza, CRM albo systemu rezerwacji.

Bez konfiguracji API zwraca `503 CONTACT_NOT_CONFIGURED`, a formularz informuje, że zgłoszenie **nie zostało
wysłane**, i podaje telefon/e-mail gabinetu. Wysyłka jest chroniona limitem 5 zgłoszeń / 10 min na adres IP
(w pamięci procesu – przy wielu instancjach zastąp go np. Redisem) i ukrytym polem-pułapką na boty.

## Rezerwacja online

Strona nie udaje rezerwacji. Bez konfiguracji przyciski „Umów wizytę” prowadzą do formularza prośby o kontakt.
Po ustawieniu `NEXT_PUBLIC_BOOKING_URL` (link do kalendarza w zewnętrznym systemie rezerwacji) wszystkie
przyciski „Umów wizytę” otwierają kalendarz w nowej karcie, a nad formularzem pojawia się kafelek
„Zarezerwuj termin online”. Formularz zostaje jako alternatywa. Głębszą integrację (np. wolne terminy na
stronie) można dodać przez API wybranego systemu – webhook formularza może też tworzyć wstępne zgłoszenia.

## Mapa i lokalne SEO

- Mapa pojawia się automatycznie po uzupełnieniu adresu w `src/config/site.ts`. Wczytuje się dopiero po
  kliknięciu „Wczytaj mapę” (Google zapisuje cookies); zgodę można cofnąć na stronie `/cookies`.
  Z kluczem `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` używane jest oficjalne Maps Embed API.
- Dane strukturalne `schema.org/Physiotherapy` (nazwa, adres, telefon, e-mail) są generowane dopiero, gdy
  adres i telefon są uzupełnione – bez kwalifikacji, ocen ani opinii.
- Po wpisaniu miasta w `siteConfig.city` trafia ono do tytułu strony, nagłówka hero, stopki i obrazu OG.
- Strona ma unikalne tytuły i opisy, kanoniczne adresy, Open Graph (`/opengraph-image`), `sitemap.xml`
  i `robots.txt`. Indeksowanie jest wyłączone do czasu ustawienia `NEXT_PUBLIC_ALLOW_INDEXING=true`.

## Dostępność i zachowanie

Link „Przejdź do treści”, widoczne stany focus, menu mobilne na natywnym `<dialog>` (Esc, pułapka fokusu),
FAQ na natywnych `<details>`, formularz z etykietami, komunikatami błędów powiązanymi z polami i fokusem na
pierwszym błędnym polu, zakładki dolegliwości obsługiwane strzałkami (wzorzec ARIA Tabs). Kontrast kolorów
tekstu ≥ 4.5:1. Poza jednorazowym pojawieniem się dwóch zdjęć w hero ruch odpowiada tylko na działanie (menu, FAQ, zakładki) i wyłącza się przy
`prefers-reduced-motion`. Na telefonach stały pasek z „Zadzwoń” (gdy numer jest uzupełniony) i „Umów wizytę”.

## Przed publikacją

- [ ] `src/config/site.ts`: telefon, e-mail, adres, godziny otwarcia, miasto, dane firmy (nazwa, NIP).
- [ ] `src/data/services.ts`: potwierdzić usługi (`confirmed: true`) lub usunąć te, których gabinet nie świadczy.
- [ ] `src/data/pricing.ts`: wpisać PRAWDZIWE ceny i czasy (obecne są przykładowe), ustawić
      `PRICES_ARE_EXAMPLES = false`, uzupełnić formy płatności; usunąć pakiety, jeśli nie są oferowane.
- [ ] `src/data/team.ts`: imię i nazwisko, potwierdzone wykształcenie, kwalifikacje, doświadczenie;
      wgrać `public/images/rehab/fizjoterapeuta-portret.jpg` i `gabinet-wnetrze.jpg`.
- [ ] `src/data/conditions.ts`: usunąć okolice/dolegliwości, z którymi gabinet nie pracuje.
- [ ] `src/data/faq.ts`: dopasować odpowiedzi do zasad gabinetu (NFZ, czas wizyt, płatności, odwoływanie).
- [ ] Zdjęcia: podmienić na wersje w wyższej rozdzielczości, potwierdzić prawa do użycia; dla zdjęć z
      prawdziwego gabinetu ustawić `illustrative: false` (za zgodą osób na zdjęciach).
- [ ] Podłączyć formularz (Resend lub webhook) i wysłać zgłoszenie testowe na produkcji.
- [ ] Opcjonalnie: `NEXT_PUBLIC_BOOKING_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY`.
- [ ] Polityka prywatności i cookies: uzupełnić dane administratora, dostawców, okres przechowywania –
      i dać do weryfikacji prawnikowi.
- [ ] Regulamin (`src/app/regulamin/page.tsx`): uzupełnić zasady odwoływania wizyt, spóźnień, płatności,
      pakietów, termin rozpatrzenia reklamacji i datę wejścia w życie – i dać do weryfikacji prawnikowi.
- [ ] Opinie: dodać tylko prawdziwe, za zgodą autorów.
- [ ] Ustawić `NEXT_PUBLIC_SITE_URL`, HTTPS, a na końcu `NEXT_PUBLIC_ALLOW_INDEXING=true`.
