# Etap 1 – analiza stron referencyjnych i grafik

Stan na 2026-11-05. Strony oglądane w Chromium (1440 px i iPhone 13).

| Strona | Stan analizy |
|---|---|
| clicktrans.pl | ✅ pełna (desktop + mobile, struktura, typografia, kolory) |
| tanibusik.eu | ⚠️ częściowa: strona wczytała się bez arkuszy stylów i zdjęć (serwer `site-assets.cdnmns.com` niedostępny w środowisku), więc oceniam strukturę, treść, SEO i kolory z kodu, nie wygląd |
| furgix.pl | ❌ niedostępna – domena nie rozwiązuje się w DNS. Nie analizowano |
| yourmove.pl | ❌ niedostępna – domena nie rozwiązuje się w DNS. Nie analizowano |

---

## Clicktrans

Giełda transportowa (łączy klientów z przewoźnikami), więc model biznesowy jest inny niż u nas,
ale rozwiązania interfejsu są dopracowane.

**Kompozycja i sekcje (kolejność):**
1. Hero w dużym zaokrąglonym panelu: H1 „Łatwy sposób na trudne przesyłki”, podtytuł z korzyścią,
   zdjęcie osoby z „dymkami” trasy (Skąd: Warszawa → Dokąd: Gdańsk).
2. Formularz w hero: „Co chcesz przewieźć? / Skąd? / Dokąd?” + przycisk – klient działa od pierwszej sekundy.
3. Pasek zaufania tuż pod hero: ocena Google z liczbą opinii, „0 zł za wystawienie”, ubezpieczenie.
4. Siatka kategorii (masonry) ze zdjęciami wyciętych przedmiotów: meble, paczki, przeprowadzki…
5. Liczby firmy (wartość transportów, lata na rynku).
6. Karuzela „Ostatnio przewiezione”: zdjęcie, trasa Skąd/Dokąd z pinezkami, cena.
7. Mapa Europy z narysowaną trasą między dwoma pinezkami.
8. Opinie na kolorowym tle: treść + etykieta „Pozytywny” + **kontekst zlecenia** (co i na jakiej trasie).
9. „Jak to działa?” – 3 numerowane kroki + makieta telefonu.
10. FAQ jako akordeon na pastelowym tle, ciemna stopka.

**Typografia:** nagłówki ABC Gravity 900 (wąski, bardzo gruby krój, H1 80 px), tekst Manrope 400–700.
Mocny kontrast skali – nagłówek natychmiast komunikuje, o co chodzi.

**Kolory:** granat `#0A1833` (tekst, ciemne sekcje), pomarańcz `#FA5519` (CTA, całe sekcje),
żółty `#FFC433`, ciepła szarość `#F0EDEC` (tła kart).

**Mobile:** hamburger, H1 nadal bardzo duży. Baner cookies zasłania prawie cały pierwszy ekran –
na telefonie użytkownik nie widzi ani oferty, ani formularza.

**Bierzemy:** formularz „Skąd / Dokąd / Co” w hero, pasek zaufania pod hero, trasa z pinezkami jako
motyw graficzny, opinie powiązane z rodzajem zlecenia, kroki „jak to działa”, FAQ w akordeonie,
wyraźna skala typograficzna.

**Unikamy:** dużych zaokrągleń (ok. 24 px), agresywnego pomarańczu na całych sekcjach, wielu karuzel
(chowają treść, słabe na mobile i dla dostępności), banera cookies zasłaniającego ekran.

---

## Tani Busik

Lokalna firma z Warszawy (wynajem busa z kierowcą).

**Struktura:** górny pasek z trzema numerami telefonu, menu 8 pozycji (Strona główna, O firmie, Oferta,
Busy, FAQ, Galeria, Kontakt, Blog), hero ze zdjęciami prawdziwej floty, długie bloki tekstu
(„Nowoczesna flota i doświadczeni kierowcy”, „Transport na terenie całego kraju z bazy w Warszawie”),
sekcja „Dlaczego warto zaufać naszej firmie?” na tle zdjęcia, prosty formularz (imię, e-mail, wiadomość),
stopka z adresem i NIP.

**Typografia i kolory (z kodu):** Montserrat 400/700; brązy `#40241A`, `#6D4C41`, `#9C786C`, tekst `#252525`.

**SEO:** title z frazami lokalnymi („Wynajem busa, przewóz osób Warszawa…”), dane strukturalne
`LocalBusiness` z adresem. Błąd: H1 pojawia się dopiero po dwóch H2.

**Bierzemy:** telefon widoczny w nagłówku od razu, prawdziwe zdjęcia floty, dane strukturalne
`LocalBusiness`, frazy lokalne w tytułach, adres i NIP w stopce.

**Unikamy:** ścian tekstu, formularza bez wyboru usługi (klient musi wszystko opisywać sam),
złej kolejności nagłówków.

---

## Grafiki klienta

Szczegóły i odczytane kolory: [`grafiki/README.md`](grafiki/README.md).

- Kolory marki: granat logo `#103E61`, głęboki granat lasu `#072D4B`, mglisty błękit gór `#A8B9CE`,
  ciepły kolor kartonu `#AE825B`, białe i jasnoszare tła.
- Najmocniejszy motyw: góry i las – nadaje się na przejścia między sekcjami i mały znak graficzny.
- Grafiki mają ok. 1000 px szerokości (za mało na hero), drobne napisy na kartonach są nieczytelne.

---

## Wnioski do koncepcji

1. **Pierwszy ekran = działanie.** H1, dwa przyciski (Bezpłatna wycena / Zadzwoń) i krótki formularz
   „Skąd / Dokąd / Rodzaj usługi”, który przenosi dane do pełnego formularza wyceny.
2. **Pasek zaufania tylko z prawdziwych faktów:** cała Polska, ceny brutto, bezpłatna wycena.
   Ocena Google pojawi się dopiero po podłączeniu profilu – bez wymyślonych liczb.
3. **Własny motyw graficzny z grafik klienta:** warstwy gór jako przejścia między sekcjami
   oraz linia trasy z pinezkami łącząca etapy „jak to działa” i mapę Polski.
4. **Bez karuzel dla kluczowych treści.** Usługi jako lista z rozwijaniem, opinie w siatce.
5. **Telefon zawsze pod ręką:** w nagłówku na desktopie, stały przycisk „Zadzwoń” na telefonie.
6. **SEO lokalne od początku:** `MovingCompany` / `LocalBusiness`, `areaServed` = Polska, poprawna kolejność nagłówków.
