# Wierzejki – koncepcja redesignu witryny

**Polska tradycja. Nowoczesna produkcja.** Niezależna koncepcja nowej strony internetowej Zakładu Mięsnego Wierzejki
(J.M. Zdanowscy Sp.j., Płudy) przygotowana przez **ComputerIT** jako propozycja dla firmy.

> **Ważne – status projektu**
>
> - To **niezamówiona propozycja**. Firma Wierzejki jej nie zamawiała ani nie zatwierdzała, a ComputerIT nie jest
>   oficjalnym wykonawcą strony firmy.
> - Nazwa, dane firmy, zdjęcia i katalogi należą do Zakładu Mięsnego Wierzejki. **Publikacja strony, użycie logo,
>   zdjęć i materiałów wymaga zgody firmy lub odpowiedniej licencji.** Nie publikuj koncepcji pod domeną firmy ani
>   w sposób sugerujący, że to oficjalna strona.
> - Znak słowny „Wierzejki” w nagłówku jest **tymczasowy** – to nie jest oficjalne logo.
> - W trybie demonstracyjnym strona jest oznaczona („Koncepcja ComputerIT”) i zablokowana dla wyszukiwarek.

## Uruchomienie

Wymagany **Node.js 22.13+** (wersja LTS z https://nodejs.org).

**Bez terminala:** kliknij dwukrotnie `URUCHOM-WINDOWS.bat` (Windows) albo `URUCHOM-MAC.command` (macOS – za pierwszym
razem prawy przycisk → Otwórz). Skrypt zainstaluje pakiety, zbuduje stronę i otworzy http://localhost:3000.

**W terminalu:**

```bash
cd wierzejki
npm install
npm run dev            # tryb deweloperski: http://localhost:3000
# albo wersja produkcyjna (szybsza, do prezentacji):
npm run build && npm start
```

Kontrole jakości:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

### Prezentacja dla klienta

1. `npm run build && npm start` na laptopie (bez internetu działa wszystko poza mapą Google i linkami do katalogów PDF).
2. Zacznij od strony głównej (pierwszy ekran, ścieżki „Na skróty”), potem: Produkty → Wędliny, Oferta dla biznesu
   (formularz B2B), Sieć sprzedaży (wyszukiwarka i mapa), Kariera, Kontakt.
3. Strona **/o-koncepcji** zbiera źródła danych, status zdjęć i listę rzeczy do potwierdzenia przez firmę – dobra
   podstawa rozmowy.
4. Pokaz online: wdroż na prywatny podgląd (np. Vercel – projekt z katalogu `wierzejki/`, z zabezpieczeniem hasłem)
   z `NEXT_PUBLIC_DEMO_MODE=true` i `NEXT_PUBLIC_ALLOW_INDEXING=false`.

## Co zawiera

**Podstrony (25 adresów generowanych statycznie):**

| Adres | Zawartość |
| --- | --- |
| `/` | hero, ścieżki dla 4 grup odbiorców, o firmie, kategorie, oferta B2B, proces produkcji, historia, sieć sprzedaży, kariera |
| `/o-firmie`, `/o-firmie/historia` | profil firmy i dane rejestrowe; oś czasu 1991–2008 ze źródłami i wyróżnienia |
| `/produkty` | kategorie + przeglądarka asortymentu z filtrami (kategoria, odbiorca, wyszukiwanie) |
| `/produkty/mieso`, `/wedliny`, `/wyroby-garmazeryjne` | grupy asortymentowe, linki do katalogów PDF, blok właściwy dla kategorii |
| `/dla-biznesu` | segmenty odbiorców, etapy współpracy, hurtownie, sekcja dla hodowców, formularz zapytania B2B |
| `/jakosc-i-produkcja` | etapy ubój → rozbiór → przetwórstwo → sprzedaż, wyróżnienia, miejsce na systemy jakości |
| `/siec-sprzedazy`, `/siec-sprzedazy/[punkt]` | wyszukiwarka punktów z filtrami i mapą; strony 4 hurtowni |
| `/kariera`, `/kariera/[oferta]`, `/kariera/wzor-ogloszenia` | obszary pracy, ogłoszenia (puste – brak potwierdzonych), podgląd szablonu (tylko demo) |
| `/kontakt` | działy z klikalnymi numerami, formularz z wyborem tematu, siedziba z mapą |
| `/polityka-prywatnosci` | projekt dokumentu do weryfikacji prawnej |
| `/o-koncepcji` | informacja o koncepcji, źródła, status zdjęć (tylko demo) |
| 404 | własna strona błędu z linkami |

**Funkcje:** rozwijane menu (mysz i klawiatura, Esc), menu mobilne (natywny `<dialog>`), okruszki z danymi
strukturalnymi, formularz z walidacją po obu stronach (NIP z sumą kontrolną, pułapka na boty, limit żądań), osobny
wariant B2B, filtrowanie asortymentu, wyszukiwarka punktów (bez polskich znaków też działa), mapa Google wczytywana
dopiero po zgodzie, przekierowania 301 ze starych adresów (`/?kontakt=` → `/kontakt` itd.), `sitemap.xml`,
`robots.txt`, adresy kanoniczne, Open Graph, JSON-LD (Organization, BreadcrumbList, JobPosting dla ogłoszeń).

## Edycja treści

Wszystkie dane są w `src/content/` – komponenty nie wymagają zmian:

| Plik | Co zawiera |
| --- | --- |
| `company.ts` | nazwa, adres, KRS, NIP, działy z telefonami i e-mailami |
| `products.ts` | kategorie, grupy asortymentowe, linki do katalogów |
| `history.ts` | kronika i wyróżnienia (z polem `source`) |
| `locations.ts` | hurtownie; `retailStores` – miejsce na listę sklepów firmowych |
| `careers.ts` | obszary pracy; `jobOffers` – aktualne ogłoszenia (każde dostaje podstronę) |
| `media.ts` | mapa zdjęć: plik, tekst alternatywny, opis kadru, licencja |
| `navigation.ts`, `production.ts`, `sources.ts` | menu, etapy produkcji, źródła i stare adresy URL |

## Zdjęcia

Pliki trafiają do `public/images/wierzejki/` pod nazwami z `src/content/media.ts`; po dodaniu przebuduj projekt.
Brakujące zdjęcie zastępuje plansza z opisem kadru (w trybie demo) – gotowa specyfikacja dla fotografa.

| Plik | Status |
| --- | --- |
| `zaklad-pludy.jpg` | zdjęcie lotnicze zakładu przekazane przez ComputerIT (500×375 px) – **źródło i prawa do publikacji do potwierdzenia**, docelowo wersja min. 2000 px |
| `sklep-firmowy.jpg` | zdjęcie stoiska patronackiego Wierzejki przekazane przez ComputerIT (547×365 px) – **do potwierdzenia** |
| `katalog-mies-okladka.jpg` | okładka katalogu mięs (materiał firmy, widoczne na niej oficjalne logo) – **użycie wymaga zgody** |
| pozostałe (8) | brak – w środowisku, w którym powstała koncepcja, banki zdjęć były niedostępne |

Zasady: zdjęcia oznaczone `mustBeAuthentic` (zakład, ludzie, sklep) muszą pochodzić od firmy. Zdjęcia poglądowe
(np. stockowe) wolno użyć tylko dla produktów i nigdy z podpisem sugerującym, że przedstawiają zakład Wierzejki.
Pochodzenie i licencję wpisz w polu `credit`.

## Formularz kontaktowy

Bez konfiguracji formularz **nie udaje wysyłki**: waliduje dane, pokazuje informację o trybie demonstracyjnym, a po
próbie wysłania – numery telefonów działu. API zwraca wtedy `503 CONTACT_NOT_CONFIGURED`.

Aby włączyć wysyłkę, ustaw na serwerze (patrz `.env.example`) **jeden** z wariantów:

- **E-mail przez Resend:** `RESEND_API_KEY`, `CONTACT_EMAIL_TO` (można kilka, po przecinku), `CONTACT_EMAIL_FROM`
  (adres w zweryfikowanej domenie). Odpowiedź trafia do nadawcy (`reply_to`).
- **Webhook:** `CONTACT_WEBHOOK_URL` (+ opcjonalnie `CONTACT_WEBHOOK_SECRET`, wysyłany jako `Authorization: Bearer`).
  Endpoint dostaje JSON z polami formularza, tematem, docelowym działem, treścią zgody i datą.

Sekrety są używane wyłącznie w `src/lib/server/delivery.ts` (kod serwerowy). Informacja „tryb demonstracyjny” na
stronach statycznych jest ustalana podczas budowania – po zmianie zmiennych przebuduj projekt.

## Zmienne środowiskowe

| Zmienna | Domyślnie | Znaczenie |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | adres strony (kanoniczne URL, sitemap, OG) |
| `NEXT_PUBLIC_DEMO_MODE` | włączony | oznaczenia koncepcji, notatki o danych, `/o-koncepcji`, szablon ogłoszenia; `false` wyłącza wszystko naraz |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` | `true` tylko w wersji opublikowanej przez firmę |
| `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM` | – | wysyłka formularza e-mailem |
| `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_SECRET` | – | wysyłka formularza webhookiem |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` | – | oficjalne Maps Embed API zamiast publicznego embedu |

## Źródła danych i ograniczenia

Bezpośredni dostęp do wierzejki.pl był zablokowany w środowisku pracy, dlatego treść dotychczasowej strony odczytano
pośrednio – z indeksu wyszukiwarki (zakładki Kontakt, Historia, Hurtowy, Sklepy, Praca, Katalogi) – oraz z KRS.
Lista źródeł: `src/content/sources.ts` i strona `/o-koncepcji`.

**Celowo nie ma na stronie:** cen, gramatur, składów, certyfikatów, parametrów produkcji, opinii klientów, liczby
sklepów i pracowników, adresów sklepów firmowych z nieaktualnych katalogów ani nazwisk pracowników.

**Przed publikacją firma musi potwierdzić lub dostarczyć:**

- [ ] wszystkie numery telefonów, e-maile i adresy hurtowni (oraz ich godziny i telefony),
- [ ] aktualną listę sklepów firmowych (`retailStores`),
- [ ] oficjalny znak w wersji wektorowej,
- [ ] zdjęcia z prawami do publikacji (w tym lepszą wersję zdjęcia zakładu),
- [ ] ewentualne informacje o systemach jakości i certyfikatach,
- [ ] treść wpisu z kroniki z 11.09.2012 i lata wyróżnień,
- [ ] aktualne ogłoszenia o pracę i kontakt do działu kadr,
- [ ] weryfikację polityki prywatności przez prawnika / IOD,
- [ ] konfigurację formularza (Resend lub webhook).

Po zatwierdzeniu: `NEXT_PUBLIC_DEMO_MODE=false`, `NEXT_PUBLIC_ALLOW_INDEXING=true`, właściwy `NEXT_PUBLIC_SITE_URL`.

## Wdrożenie

Projekt to standardowa aplikacja Next.js 16 (App Router, Turbopack, React 19, TypeScript, Tailwind CSS 4, Vitest).
Strony są generowane statycznie; serwer jest potrzebny tylko dla `/api/kontakt` i przekierowań starych adresów
(`src/proxy.ts`).

- **Vercel:** nowy projekt z katalogiem głównym `wierzejki/`, zmienne z tabeli powyżej.
- **Własny serwer / VPS:** `npm ci && npm run build && npm start` (port przez `PORT` lub `-p`), za reverse proxy z HTTPS.
  Limit żądań formularza działa w pamięci procesu – przy kilku instancjach zastąp go współdzielonym (np. Redis).

## Struktura

```
src/
  app/                 strony (App Router), api/kontakt, sitemap, robots, 404
  components/
    layout/            nagłówek z menu, stopka, okruszki, nagłówki podstron, znacznik koncepcji
    home/              sekcje strony głównej
    forms/             formularz kontaktowy (wariant ogólny i B2B)
    locations/         wyszukiwarka punktów, mapa z zgodą
    products/          przeglądarka asortymentu
    careers/           widok ogłoszenia
    ui/                zdjęcie z planszą zastępczą, ikony, pieczęć, notatki demo
  content/             ★ wszystkie dane strony
  lib/                 walidacja formularza, wyszukiwanie, formatowanie, metadane; lib/server – wysyłka
  proxy.ts             przekierowania 301 starych adresów
tests/                 testy Vitest (walidacja, NIP, wyszukiwarki, przekierowania)
```
