# NOIR STUDIO – strona studia fotograficznego

Demonstracyjny projekt agencji **ComputerIT**: strona fikcyjnego studia fotograficznego premium z Warszawy.
Jedna strona z pełnoekranowym menu, asymetryczną galerią z filtrami i lightboksem, sekcją o studiu, ofertą
pięciu usług i formularzem zapytania – **po polsku (domyślnie) i po angielsku**.

> **Projekt demonstracyjny.** Studio, fotografka, opisy sesji i podpisy zdjęć są fikcyjne. Strona nie zawiera
> referencji, nagród ani certyfikatów. Formularz nie wysyła wiadomości, dopóki nie podłączysz skrzynki (niżej).

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript** – ta sama wersja co NOIR COFFEE w katalogu nadrzędnym
- **CSS Modules** + tokeny w `src/app/globals.css` – bez dodatkowych bibliotek UI i animacji
- `next/font` (Playfair Display + Inter, hostowane lokalnie), `next/image` (AVIF/WebP, lazy loading)

Wymagany **Node.js 22.13+**.

## Uruchomienie

Bez terminala: dwuklik na `URUCHOM-WINDOWS.bat` albo `URUCHOM-MAC.command` w tym katalogu.

W terminalu:

```bash
cd noir-studio
npm install
npm run dev          # http://localhost:3100
```

Kontrole jakości: `npm run lint && npm run typecheck && npm run build`.

Port 3100 nie koliduje z NOIR COFFEE (3000), więc obie strony mogą działać jednocześnie.

## Konfiguracja (`.env.local`, wzór w `.env.example`)

| Zmienna | Znaczenie |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | publiczny adres strony (metadane, sitemap, robots.txt) |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` włącza indeksowanie – domyślnie wyłączone |
| `NEXT_PUBLIC_STUDIO_EMAIL` | adres e-mail pokazywany w kontakcie i menu |
| `INQUIRY_WEBHOOK_URL` | adres, na który formularz przekazuje zapytania (JSON, POST), np. Make/Zapier |
| `INQUIRY_WEBHOOK_SECRET` | opcjonalny token wysyłany jako `Authorization: Bearer …` |

Zmienne ustaw **przed** `npm run build` – strona jest generowana statycznie, więc informacja, czy formularz jest
podłączony, zapisuje się w niej podczas budowania.

Bez `INQUIRY_WEBHOOK_URL` formularz waliduje dane, ale **nie wysyła ich** – pod przyciskiem widać informację
o wersji demonstracyjnej, a po kliknięciu „Send inquiry” komunikat, że zapytanie nie zostało wysłane.

## Wersje językowe

| Adres | Język |
| --- | --- |
| `/` | polski (domyślny) |
| `/en` | angielski |

`/pl` przekierowuje na `/`. Przełącznik z flagami (Polska, Wielka Brytania) jest w nagłówku i w menu
pełnoekranowym; zachowuje sekcję, na której jest odwiedzający (np. `/#services` → `/en#services`). Obie wersje
są generowane statycznie, mają własne `<html lang>`, tytuły, opisy, `hreflang` i wpisy w `sitemap.xml`.
Komunikaty formularza i API (`/api/inquiry`) też są w języku strony.

Wszystkie teksty są w `src/i18n/pl.ts` i `src/i18n/en.ts` (także teksty alternatywne zdjęć). Typ `Dictionary`
pilnuje, żeby wersja angielska miała dokładnie te same klucze co polska – brak tłumaczenia zatrzyma build.

## Struktura

```
src/
  app/[lang]/           layout (fonty, metadane, nagłówek) i strona główna dla /pl (= /) i /en
  app/global-not-found  dwujęzyczna strona 404
  app/api/inquiry       odbiór zapytania: walidacja + przekazanie na INQUIRY_WEBHOOK_URL
  i18n/                 ★ słowniki pl.ts / en.ts, konfiguracja języków, odmiana liczebników
  config/site.ts        nazwa, adres, nawigacja
  config/images.ts      ★ mapa zdjęć: plik → sekcja, proporcje, punkt ostrości
  data/portfolio.ts     kolejność kadrów galerii, kategorie, lata (tytuły i miejsca – w słownikach)
  data/services.ts      lista usług i rodzajów sesji (opisy – w słownikach)
  lib/inquiry.ts        walidacja formularza (wspólna dla przeglądarki i serwera)
  components/           Hero, SiteHeader + MenuOverlay + LanguageSwitch, Portfolio + Gallery + Lightbox, About, Services, Contact
public/images/studio/   ★ zdjęcia – lista plików w README.md w tym katalogu
```

## Zdjęcia

Obecnie strona ma 9 zdjęć od klienta: hero, portret, dwa kadry w menu i kontakcie oraz po jednym zdjęciu
w każdej kategorii portfolio (te same zdjęcia ilustrują usługi). Pozostałe 15 miejsc w portfolio pokazuje passe-partout „Zdjęcie zostanie dodane” / „Photograph to be added” w barwach marki. Wystarczy wgrać pliki pod
nazwami z `public/images/studio/README.md` – układ, proporcje i podpisy są gotowe.

## Dostępność i zachowanie

- Menu i lightbox na natywnym `<dialog>`: pułapka fokusu, Esc, powrót fokusu do przycisku.
- Lightbox: strzałki ← →, przyciski Prev/Next, przesunięcie palcem na telefonie.
- Link „Skip to content”, widoczny fokus, `prefers-reduced-motion` wyłącza animacje.
- Kontrast: tekst drugoplanowy na jasnym tle jest czarny (szary #77736D tylko w dużych elementach i liniach),
  na ciemnym – beżowy #C6B69F (9:1).
