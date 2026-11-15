# CLIMARO – strona firmy HVAC

Strona internetowa fikcyjnej firmy CLIMARO (klimatyzacja, pompy ciepła, rekuperacja, serwis HVAC) – projekt portfolio.
Dane kontaktowe i ceny są demonstracyjne.

## Uruchomienie

Wymagany Node.js 22.13 lub nowszy.

```bash
cd climaro
npm install
npm run dev        # http://localhost:3000
```

Wersja produkcyjna:

```bash
npm run build
npm run start
```

Kontrola jakości: `npm run typecheck` i `npm run lint`.

## Struktura

| Ścieżka | Zawartość |
| --- | --- |
| `src/app/` | Strony: `/`, `/o-nas`, `/uslugi`, `/kontakt`, `/polityka-prywatnosci`, strona 404, `sitemap.xml`, `robots.txt`, favicon |
| `src/components/` | Nagłówek z menu mobilnym, stopka, hero z oznaczeniami, formularz kontaktowy, logo, ikony |
| `src/data/site.ts` | Dane firmy (telefon, e-mail, lokalizacja) i nawigacja |
| `src/data/services.ts` | Usługi, zakres prac, ceny i czynniki wpływające na koszt |
| `src/app/globals.css` | Tokeny (kolory, typografia, odstępy, krzywe ruchu) i style bazowe |
| `public/brand/` | Logo w SVG: wersja na ciemne i jasne tło, sam znak, znak jednobarwny, ikona aplikacji |
| `public/images/` | Zdjęcia (pochodzenie i licencja: `public/images/CREDITS.md`) |
| `brand/make_logo.py` | Generator plików logo (kontury liter z kroju Archivo) |
| `PRODUCT.md`, `DESIGN.md` | Założenia produktu i opis systemu wizualnego |

## Zmiana treści

- **Ceny i opisy usług** – `src/data/services.ts`. Kwoty formatują się automatycznie („12 900 zł”).
- **Telefon, e-mail, lokalizacja** – `src/data/site.ts`.
- **Punkty na zdjęciu w hero** – tablica `annotations` w `src/components/Hero.tsx` (pozycje jako ułamek szerokości i wysokości zdjęcia).
  Po wymianie zdjęcia hero trzeba je ustawić na nowo.

## Przed publikacją z prawdziwymi danymi

1. **Formularz nie wysyła wiadomości.** Sprawdza dane i uczciwie informuje, że zapytanie nie zostało wysłane,
   proponując gotową wiadomość e-mail lub telefon. Aby wysyłał, podłącz go do usługi (np. Server Action z dostawcą
   poczty transakcyjnej) w `src/components/ContactForm.tsx` – w funkcji `onSubmit`, w miejscu `setSubmitted(true)`.
2. **Indeksowanie jest wyłączone** (`allowIndexing: false` w `src/data/site.ts`), bo numer telefonu jest przykładowy
   i może należeć do kogoś innego. Po podstawieniu prawdziwych danych ustaw `true` – włączy to indeksowanie i mapę strony
   w `robots.txt`.
3. **Polityka prywatności** to wzór – treść musi przygotować lub zatwierdzić prawnik.
4. **Zdjęcia** pochodzą z Pexels i pokazują urządzenia z logo producentów. Najlepiej zastąpić je zdjęciami z własnych montaży.
5. Ustaw prawdziwy adres w `site.url` (używany w metadanych, kanonicznych adresach i danych strukturalnych).

## Logo

Pliki w `public/brand/` są gotowe do użycia. Aby je wygenerować ponownie (np. po zmianie proporcji znaku):

```bash
pip install fonttools
# pobierz pliki TTF kroju Archivo (Google Fonts, licencja OFL) jako brand/wordmark.ttf (wdth 125, wght 700)
# i brand/tagline.ttf (wdth 112,5, wght 600), a następnie:
python3 brand/make_logo.py public/brand
```

Skrypt zapisuje też `brand/paths.txt` z konturami liter – ich zawartość trzeba przenieść do `src/components/logo-paths.ts`.
