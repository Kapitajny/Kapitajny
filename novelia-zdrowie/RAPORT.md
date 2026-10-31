# Raport z prac – NOVELIA ZDROWIE

Data: 31 października 2026

## 1. Co zostało zrobione

### Sklep internetowy (`novelia-zdrowie/`)

Nowa, samodzielna aplikacja Next.js 16 w podkatalogu repozytorium. Istniejąca strona NOIR COFFEE w katalogu
głównym **nie została zmieniona**. Z poprzedniego projektu przeniesiono i przebudowano sprawdzone elementy
(integracja Stripe z webhookiem, baza SQLite, idempotencja zamówień, limity żądań).

**Strona główna – 9 sekcji:** Hero (nagłówek, korzyści, cena 39,99 zł, KUP TERAZ, informacja o formacie PDF,
okładka na tablecie i strony na telefonie), Poznaj e-booka (opis, korzyści, dla kogo, 6 przykładowych stron
z powiększeniem, przycisk „Kup e-book za 39,99 zł”), Co znajdziesz w środku (7 rozdziałów na podstawie
rzeczywistej treści e-booka), Dlaczego NOVELIA ZDROWIE (4 filary), Sklep (4 produkty), Jak to działa (3 kroki),
FAQ (7 pytań, w tym 5 wymaganych), końcowe CTA, stopka z kontaktem i 7 dokumentami.

**Podstrony (19):** `/sklep`, 4 karty produktów `/sklep/[slug]`, `/koszyk`, `/zamowienie/sukces`,
`/zamowienie/anulowano`, `/pobieranie`, `/kontakt`, `/regulamin`, `/regulamin-tresci-cyfrowych`,
`/polityka-prywatnosci`, `/polityka-cookies`, `/platnosci`, `/dostawa`, `/reklamacje-i-zwroty`, strona 404.

**System sprzedaży:**
- koszyk (dodawanie, usuwanie, suma, zapis w przeglądarce, panel boczny i strona koszyka),
- formularz zamówienia: e-mail z potwierdzeniem, opcjonalne imię i nazwisko, akceptacja regulaminów,
  zgoda na dostarczenie treści cyfrowej przed upływem terminu odstąpienia (zapisywana z datą w zamówieniu
  i potwierdzana e-mailem),
- płatność Stripe Checkout (karta / BLIK / Przelewy24 – według ustawień konta), ceny liczone na serwerze,
  webhook z weryfikacją podpisu i kwoty jako jedyne źródło statusu „opłacone”,
- automatyczne udostępnienie plików po płatności: przyciski na stronie potwierdzenia + e-mail,
- bezpieczne linki: podpis HMAC-SHA256, ważność 72 h, limit 10 pobrań na publikację, sprawdzanie statusu
  zamówienia przy każdym pobraniu, pliki czytane z `private/ebooks/` (poza `public/`),
- ponowne pobranie: formularz e-mail + numer zamówienia → nowe linki tylko na adres z zamówienia,
- e-maile: potwierdzenie z linkami, nowe linki, powiadomienie dla sklepu, formularz kontaktowy
  (Resend lub SMTP),
- produkt jest sprzedawany tylko wtedy, gdy jego plik PDF istnieje – dzięki temu trzy publikacje
  w przygotowaniu nie mogą zostać kupione „na pusto”.

**SEO i wydajność:** metadane i Open Graph na każdej stronie, adresy kanoniczne, dane strukturalne
`Product` i `FAQPage` (bez ocen i opinii), `sitemap.xml`, `robots.txt` (indeksowanie wyłączone do czasu
uzupełnienia danych – `NEXT_PUBLIC_ALLOW_INDEXING`), statyczne generowanie wszystkich stron, obrazy przez
`next/image` (AVIF/WebP, rozmiary responsywne, leniwe ładowanie), czcionki samohostowane przez `next/font`.

**Bezpieczeństwo:** nagłówki bezpieczeństwa (HSTS, nosniff, X-Frame-Options, Permissions-Policy),
`no-store` i `noindex` dla API, limity żądań, ochrona przed path traversal, brak ujawniania istnienia
zamówień, odporność na podwójne kliknięcie i ponowne dostarczenie webhooka.

### E-book „Zdrowiej każdego dnia” (50 stron, A4)

Napisany od podstaw, zgodnie z planem stron z briefu:

| Strony | Zawartość |
| --- | --- |
| 1 | okładka dostarczona przez właściciela (bez zmian; po bokach rozmyte tło, bo proporcje okładki są węższe niż A4) |
| 2 | strona tytułowa, informacje wydawnicze, metodologia wartości odżywczych, zastrzeżenie edukacyjne |
| 3 | spis treści z numerami stron |
| 4–10 | wprowadzenie, świadome odżywianie, zbilansowany talerz, grupy produktów, planowanie, gotowanie na kilka dni, lista produktów |
| 11–20 | 10 śniadań |
| 21–32 | 12 obiadów (kurczak, ryby, dania wegetariańskie, kasze i ryż, warzywa, jednogarnkowe) |
| 33–38 | 6 kolacji |
| 39–42 | 4 przekąski |
| 43–45 | plan na 3 dni, lista zakupów (zsumowana automatycznie z przepisów planu), organizacja kuchni |
| 46–48 | etykiety, urozmaicone posiłki, ograniczanie marnowania żywności |
| 49 | podsumowanie |
| 50 | strona końcowa z brandingiem i kontaktem |

Każdy przepis: nazwa, ilustracja, składniki z ilościami, kroki, czas, porcje, wskazówka oraz orientacyjna
kaloryczność i makroskładniki **obliczone automatycznie z gramatur** (tabela wartości na 100 g na podstawie
ogólnodostępnych tabel składu żywności, m.in. USDA FoodData Central; oznaczone jako orientacyjne).
Każdy rozdział ma własny układ stron (śniadania – duża ilustracja u góry; obiady – zielona kolumna boczna
naprzemiennie z lewej i prawej; kolacje – okrągła ilustracja na oliwkowym pasie; przekąski – beżowa karta).
Bez obietnic odchudzania i właściwości leczniczych; zastrzeżenie o charakterze edukacyjnym na s. 2, 4 i 50.

### Trzy dodatkowe publikacje

„Zdrowe śniadania”, „Zdrowe obiady”, „Zdrowe nawyki” (29,99 zł): opis, korzyści, grupa docelowa, spis treści,
oryginalna okładka w stylistyce marki, 2 strony fragmentu (przykładowy przepis / rozdział z dziennikiem
nawyków), karta produktu w sklepie. Pełne PDF-y tych publikacji nie powstały (brief wymagał przykładowej
zawartości), dlatego w sklepie są oznaczone „W przygotowaniu” i nie można ich kupić, dopóki nie zostanie
dodany plik PDF.

## 2. Testy

| Rodzaj | Wynik |
| --- | --- |
| `npm run lint` (ESLint) | 0 błędów, 0 ostrzeżeń |
| `npm run typecheck` (TypeScript) | bez błędów |
| `npm test` (Vitest) | 20/20 – walidacja, podpisy linków, zamówienia, webhook, limit pobrań, e-mail, pliki |
| `npm run build` | bez ostrzeżeń, 29 stron wygenerowanych statycznie |
| Test end-to-end przez HTTP | 17/17 – walidacja, blokada produktu bez PDF, zamówienie, webhook bez podpisu / ze złym podpisem / poprawny / duplikat, linki dopiero po opłaceniu, pobranie PDF, limit pobrań, zmodyfikowany link, ponowne linki, formularz kontaktowy |
| Test interfejsu (Chromium) | 19/19 – menu mobilne, koszyk (dodaj/usuń/suma), KUP TERAZ, walidacja formularza i zgód, komunikat bez kluczy Stripe, strona sukcesu z pobraniem, anulowanie, galeria stron, FAQ, 15 linków wewnętrznych, brak błędów JS |
| Wszystkie podstrony | 200 OK (404 dla nieistniejących i dla prób pobrania PDF z publicznych ścieżek) |
| Responsywność | 390 px, 820 px, 1440 px – brak poziomego przewijania, wszystkie obrazy się ładują |
| E-book | dokładnie 50 stron A4, polskie znaki poprawne, brak pustych stron i elementów poza obszarem strony, numery w spisie treści zgodne ze stronami |

Test webhooka wykonano z podpisem wygenerowanym biblioteką Stripe (sekret testowy). **Prawdziwej płatności
nie wykonano** – w środowisku nie było kluczy Stripe. Błąd znaleziony w testach (menu mobilne niewidoczne
przez efekt rozmycia nagłówka) został naprawiony.

## 3. Elementy wymagające konfiguracji (przed sprzedażą)

- [ ] **Skopiować `zdrowiej-kazdego-dnia.pdf` do `novelia-zdrowie/private/ebooks/`** (lokalnie i na serwerze).
      Plik nie jest w repozytorium, bo repozytorium jest publiczne.
- [ ] Dane sprzedawcy: `NEXT_PUBLIC_SELLER_NAME`, `_ADDRESS`, `_NIP`, `_REGON`, `_EMAIL`, `_PHONE`
      oraz pola „do uzupełnienia” w dokumentach (CEIDG/KRS, status VAT, faktury, hosting, dostawca e-maili,
      data obowiązywania).
- [ ] **Weryfikacja wszystkich dokumentów prawnych przez prawnika** (to wersje robocze).
- [ ] Stripe: konto, `STRIPE_SECRET_KEY`, webhook i `STRIPE_WEBHOOK_SECRET`, włączenie BLIK/Przelewy24,
      płatność testowa kartą 4242…, potem klucze `live`.
- [ ] E-maile: `EMAIL_PROVIDER` (resend/smtp), `EMAIL_FROM` z zweryfikowanej domeny, `SHOP_NOTIFICATIONS_EMAIL`.
- [ ] `DOWNLOAD_SECRET` (np. `openssl rand -hex 32`), `NEXT_PUBLIC_SITE_URL` i `SITE_URL`, HTTPS.
- [ ] Serwer z trwałym dyskiem (SQLite + pliki PDF) albo migracja na Postgres i prywatny magazyn plików.
- [ ] Dane wydawcy w e-booku: `PUBLISHER` w `src/content.mjs` źródeł (e-mail, adres sklepu) i przebudowa PDF.
- [ ] Po uzupełnieniu danych: `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- [ ] Dodatkowe publikacje: przygotować pełne pliki PDF i wgrać je do `private/ebooks/`.

## 4. Decyzje i uwagi

- **Ilustracje zamiast fotografii.** Brief dopuszcza „profesjonalną fotografię lub autorską ilustrację dania”.
  Banki zdjęć były w tym środowisku zablokowane, a generator obrazów zwracał tylko miniatury, dlatego
  wszystkie potrawy otrzymały spójne, autorskie ilustracje wektorowe w palecie marki (generowane z opisu
  sceny – można je zastąpić zdjęciami). Jedyną fotografią jest okładka dostarczona przez właściciela.
- **30 czy 32 przepisy.** Okładka i podtytuł mówią o 30 przepisach, a plan stron z briefu wymaga
  10 + 12 + 6 + 4 = 32 przepisów. Zrealizowano plan stron (32), a w opisach sklepu i na stronie tytułowej
  podano dokładny skład (28 dań + 4 przekąski). Warto rozważyć ujednolicenie podtytułu przy kolejnym wydaniu okładki.
- **Brak fikcyjnych danych.** Nie ma opinii, ocen, liczników sprzedaży, certyfikatów ani danych firmy –
  puste pola są wyraźnie oznaczone „do uzupełnienia”.
- **Wartości odżywcze** są orientacyjne; węglowodany podano jako węglowodany ogółem (z błonnikiem).
- Platforma ODR UE została zamknięta w lipcu 2025 r., dlatego dokumenty wskazują krajowe sposoby
  pozasądowego rozwiązywania sporów.
