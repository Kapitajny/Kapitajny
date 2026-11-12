# MOLO Jet Club – wypożyczalnia skuterów wodnych w Sopocie

Strona wypożyczalni skuterów wodnych w kierunku wizualnym **„Kilwater”**: pełnoekranowe hero, flota, sekcja
„bez patentu”, interaktywny cennik, proces wynajmu, galeria, lokalizacja, opinie Google, FAQ, kontakt.
Do tego **rezerwacja online z kontrolą dostępności** i **panel administratora**.

> **Projekt demonstracyjny.** Adres przystani (ul. Przystań Kapitańska 7, 81-701 Sopot) jest **fikcyjny**.
> Dane firmy, ceny, kaucje, parametry skuterów i dokumenty prawne trzeba uzupełnić przed startem.
> Strona nigdzie nie wymyśla tych danych: puste pola pokazuje jako „—” albo „wkrótce”.

## Najprostsze uruchomienie (bez terminala)

1. Zainstaluj **Node.js LTS** (22.13 lub nowszy) ze strony https://nodejs.org.
2. Pobierz paczkę ZIP ze stroną (GitHub: **Code → Download ZIP**) i rozpakuj.
3. Kliknij dwukrotnie **`URUCHOM-WINDOWS.bat`** (Windows) albo **`URUCHOM-MAC.command`** (Mac: prawy przycisk → Otwórz).
4. Strona otworzy się pod adresem http://localhost:3000. W oknie skryptu zobaczysz **hasło do panelu** (http://localhost:3000/panel).
   Hasło jest zapisane w pliku `.env.local` – możesz je tam zmienić.

## Uruchomienie z terminala

```bash
npm install
cp .env.example .env.local      # ustaw ADMIN_PASSWORD i ADMIN_SESSION_SECRET
npm run dev                     # http://localhost:3000
```

Kontrole jakości: `npm run lint && npm run typecheck && npm test && npm run build`

## Pierwsze kroki w panelu (/panel)

Pulpit pokazuje listę rzeczy do uzupełnienia. Zalecana kolejność:

1. **Flota** – potwierdź modele. Startowa baza zawiera 4 modele rozpoznane na dostarczonych zdjęciach
   (Yamaha GP1800R, FX, VX, Sea-Doo Spark) z oznaczeniem „Dane do potwierdzenia”. Wpisz moc, liczbę miejsc,
   opis i **wymagane uprawnienia**. Usuń modele, których nie ma we flocie, albo dodaj nowe (ze zdjęciem).
2. **Ceny i kaucje** – cena dla każdego z 8 czasów (30 min … 24 h) i kaucja. Bez ceny dany wariant nie jest dostępny online.
3. **Godziny otwarcia** – domyślnie przykładowe 10:00–20:00 codziennie.
4. **Ustawienia** – telefon, e-mail, parking, teksty o kaucji i opłatach, zasady rezerwacji (bufor przygotowania,
   minimalne wyprzedzenie, krok godzin, horyzont, bezpłatne anulowanie) i tryb sekcji „Bez patentu”.
5. **Dokumenty** – regulamin, zasady wynajmu, polityka prywatności (`src/app/(site)/…`) mają oznaczone pola
   `[do uzupełnienia]` i wymagają weryfikacji przez prawnika.

### Sekcja „Bez patentu” – ważne

Strona nie przesądza, które skutery można prowadzić bez patentu. Administrator wybiera tryb:

- **Informacja bez modeli** (domyślnie) – wyjaśnienie zasad i zaproszenie do kontaktu,
- **Modele bez patentu** – pokazuje skutery oznaczone we flocie jako „Bez patentu”; dla nich trzeba wpisać
  warunki i podstawę prawną (klient widzi je przy modelu i w rezerwacji),
- **Pierwszy raz z instruktorem** – skuter prowadzi instruktor z uprawnieniami.

Przed włączeniem trybu „Modele bez patentu” zweryfikuj aktualne przepisy (m.in. ustawa o sporcie, rozporządzenie
w sprawie uprawiania turystyki wodnej – tekst jednolity Dz.U. 2026 poz. 604) oraz lokalne przepisy dla wód
Zatoki Gdańskiej.

## Jak działa rezerwacja

- Klient wybiera **skuter → czas → datę → godzinę** i podaje dane. Kalendarz pokazuje tylko dni z wolnymi terminami.
- Dostępność liczy **serwer** (strefa Europe/Warsaw): godziny otwarcia, minimalne wyprzedzenie, horyzont,
  inne rezerwacje z **buforem przygotowania**, blokady terminów (dla skutera lub całej floty).
- Wynajem krótszy niż 12 h kończy się przed zamknięciem; 12 h i 24 h muszą mieć zwrot w godzinach otwarcia.
- **Brak podwójnej rezerwacji:** zapis odbywa się w transakcji SQLite `BEGIN IMMEDIATE` z ponownym sprawdzeniem
  kolizji. Podwójne kliknięcie nie tworzy dwóch rezerwacji (klucz idempotencji).
- Cena i kaucja są brane z cennika na serwerze i zapamiętywane w rezerwacji.
- Rezerwacja ma status **wstępna** – obsługa potwierdza ją w panelu. Klient dostaje stronę z numerem i linkiem
  (z tajnym tokenem), pod którym sprawdzi status i **anuluje** rezerwację do X godzin przed startem.
- Statusy: wstępna, potwierdzona, zakończona, anulowana, nieobecność. Przywrócenie anulowanej rezerwacji
  sprawdza, czy termin jest wciąż wolny.

### Czego celowo nie ma (wymaga konfiguracji)

- **Płatności online** – płatność i kaucja są na miejscu; strona mówi to wprost. Integrację (np. Stripe z BLIK
  i Przelewy24, preautoryzacja kaucji) można dodać w `src/lib/server/bookings.ts` – status „wstępna” jest na to gotowy.
  Poprzednia wersja repozytorium (kawiarnia) zawiera działający wzorzec Stripe Checkout + webhook w historii git.
- **E-maile z potwierdzeniem** – brak dostawcy poczty. Klient dostaje link do rezerwacji na ekranie.
- **Formularz kontaktowy** wysyła wiadomość na webhook (`CONTACT_WEBHOOK_URL`, np. Make/Zapier/n8n). Bez niego
  formularz informuje, że wysyłka nie jest podłączona.
- **Opinie Google** – wymagają `GOOGLE_PLACES_API_KEY` i `GOOGLE_PLACE_ID`. Bez nich sekcja pokazuje pusty stan.
  Strona nie zawiera żadnych wymyślonych opinii.

## Struktura

```
src/
  app/(site)/            strona: /, /flota/[id], /rezerwacja, /rezerwacja/potwierdzenie, dokumenty
  app/panel/             panel administratora (logowanie hasłem z ADMIN_PASSWORD)
  app/api/               availability, bookings, bookings/cancel, contact, admin/* (chronione sesją)
  app/media/[file]       zdjęcia wgrane w panelu (zapisywane w data/media)
  components/home/       sekcje strony głównej
  components/booking/    proces rezerwacji, potwierdzenie, anulowanie
  components/admin/      widoki panelu
  config/site.ts         nazwa, adres (fikcyjny), nawigacja, media społecznościowe
  config/gallery.ts      zdjęcia galerii i ich układ
  lib/rental.ts          czasy wynajmu, reguły dostępności (wspólne dla serwera, przeglądarki i testów)
  lib/time.ts            strefa Europe/Warsaw
  lib/server/            baza SQLite, repozytorium, rezerwacje, sesja panelu, opinie Google
tests/                   testy Vitest: reguły dostępności, ceny, podwójne rezerwacje, anulowanie
public/images/kilwater/  zdjęcia (opis praw w README.md w tym katalogu)
```

## System wizualny „Kilwater”

- Kolory: Dark Graphite `#151D23`, Pure White, Warm Sand `#F2EEE5`, Deep Navy `#071B2B`, Ocean Turquoise `#00B9C7`
  (tylko kilwater i główna akcja), turkus tekstowy `#00737D` (kontrast AA).
- Kroje: **Big Shoulders** (nagłówki, duże liczby) i **Barlow** (tekst).
- Jedna odważna rzecz: ukośna linia kilwateru – w hero, jako separator, oś procesu i suwak czasu w cenniku.
- Dostępność (WCAG 2.1 AA): kontrasty sprawdzone, widoczny fokus, obsługa klawiaturą (menu, galeria, FAQ, suwak),
  etykiety pól, komunikaty błędów przy polach, `prefers-reduced-motion`.

## Produkcja

- Serwer Node z **trwałym dyskiem** (VPS, kontener z wolumenem): `npm run build && npm start`.
  Ustaw `DB_PATH` (i ewentualnie `MEDIA_DIR`) na trwały wolumen. Na serverless (np. Vercel) SQLite nie zadziała –
  trzeba podmienić warstwę danych na bazę zewnętrzną.
- Ustaw `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, a po uzupełnieniu danych
  `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- Rób kopie zapasowe pliku bazy (`data/kilwater.sqlite`) i katalogu `data/media`.
