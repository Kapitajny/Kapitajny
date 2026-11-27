# Maison du Pain — motyw WordPress dla piekarni

Motyw blokowy (Full Site Editing) dla rzemieślniczej piekarni. Ma trzy strefy:

- **Ciemne otwarcie** (espresso): logo, menu, duży nagłówek, przyciski, fotografia pieczywa w łuku i obracająca się pieczęć.
- **Jasny środek** (krem i złamana biel): edytorialny katalog wypieków w czterech rozdziałach. Do tego „O piekarni”, filozofia wypieku, naturalne składniki i galeria.
- **Ciemne zakończenie**: kontakt z adresem, godzinami, telefonem, formularzem i mediami społecznościowymi oraz stopka.

Wymagania: WordPress 6.6+ (testowane na 7.1), PHP 7.4+. Motyw nie wymaga żadnych wtyczek.

## Instalacja

1. Spakuj katalog `maison-du-pain` do ZIP albo użyj gotowej paczki `wordpress/maison-du-pain.zip`.
2. W panelu: **Wygląd → Motywy → Dodaj nowy → Wyślij motyw** i wskaż ZIP, a potem kliknij **Włącz**.
3. Strona główna działa od razu (szablon `front-page.html`).
4. Opcjonalnie: **Wypieki → Przykładowe wypieki → Importuj**. Import dodaje 11 wypieków ze zdjęciami, cenami i kategoriami do katalogu `/oferta/`.
5. **Ustawienia → Ogólne**:
   - „Adres dla formularza piekarni” to skrzynka, na którą trafiają wiadomości z formularza.
   - „Język witryny” ustaw na **Polski**.
6. **Ustawienia → Bezpośrednie odnośniki**: wybierz „Nazwa wpisu”, żeby adres `/oferta/` działał.

> Formularz wysyła e-maile funkcją `wp_mail`. Na wielu serwerach do pewnego dostarczania poczty potrzebna jest wtyczka SMTP (np. WP Mail SMTP).

## Edycja treści

| Co | Gdzie |
| --- | --- |
| Teksty, zdjęcia i ceny na stronie głównej | **Wygląd → Edytor → Szablony → Strona główna**. Każdy tekst i zdjęcie można kliknąć i podmienić. |
| Nagłówek, menu, przycisk „Zamów” | **Wygląd → Edytor → Wzorce → Części szablonu → Nagłówek** |
| Stopka | **Wygląd → Edytor → Części szablonu → Stopka** |
| Kolory, fonty, odstępy | **Wygląd → Edytor → Style** (wartości z `theme.json`) |
| Katalog wypieków `/oferta/` | **Wypieki → Dodaj wypiek**: tytuł, zdjęcie wyróżniające, zajawka, kategoria, a w prawym panelu **„Cena i gramatura”** |
| Gotowe sekcje do innych stron | Wstawiacz bloków → **Wzorce → „Maison du Pain – sekcje / prezentacje wypieków”** |

Style bloków dodane przez motyw:

- **Przycisk**: „Kontur jasny”, „Kontur ciemny”, „Link ze strzałką”.
- **Obraz**: „Łuk”, „Passe-partout”.
- **Separator**: „Ornament”.
- **Akapit**: „Nadtytuł”.

## Struktura

```
maison-du-pain/
  style.css, theme.json         nagłówek motywu, paleta, fonty, style globalne
  functions.php                 rejestracja zasobów, stylów bloków, kategorii wzorców
  inc/helpers.php               funkcje budujące bloki zdjęć i produktów we wzorcach
  inc/products.php              typ treści „Wypieki”, kategorie, pola cena/gramatura, źródło Block Bindings
  inc/contact.php               obsługa formularza (nonce, honeypot, wp_mail)
  inc/demo-content.php          import przykładowych wypieków
  blocks/contact-form/          blok „Formularz kontaktowy piekarni”
  templates/                    front-page, page, single, index, archive, search, 404,
                                archive/single/taxonomy dla wypieków, page-wide
  parts/                        header, footer
  patterns/                     hero, marquee, about, products-*, philosophy, ingredients,
                                gallery, contact, catalog-*, header, footer
  assets/css/theme.css          kompozycja, responsywność, animacje
  assets/js/theme.js            pojawianie się elementów, nagłówek po przewinięciu, pasek, menu mobilne
  assets/js/product-panel.js    panel „Cena i gramatura” w edytorze
  assets/fonts/                 Cormorant Garamond + Jost (hostowane lokalnie, latin + latin-ext)
  assets/images/                zdjęcia
```

## Paleta

`#211813` espresso · `#302019` gorzka czekolada · `#493126` ciepły brąz · `#A66F45` karmel · `#D7C1A2` ciepły beż · `#F1EBDD` krem · `#FAF7F1` jasne tło.

Kontrast: drobny tekst na jasnym tle ma kolor ciepłego brązu. Karmel służy tylko do akcentów i dużych nagłówków. Na ciemnym tle drobny tekst jest w ciepłym beżu.

## Zdjęcia

**Zdjęcia przekazane przez właściciela:**

- `hero-chleb-regaly.jpg`: bochenki na regałach (hero).
- `chleb-w-dloniach.jpg`: bochenek w dłoniach (Pain au levain).
- `witryna-chleby.jpg`: witryna z tabliczkami („O piekarni”).

Oryginały miały małą rozdzielczość (452–1024 px), więc zostały delikatnie powiększone. Przed publikacją warto je podmienić na pełne pliki z aparatu, najlepiej 2000 px+ po dłuższym boku.

**Zdjęcia demonstracyjne** pochodzą z [Pexels](https://www.pexels.com/license/) (darmowe użycie komercyjne, bez wymogu podpisu). Kilka z nich ma ocieploną tonację, żeby pasowały do palety. Numery zdjęć na Pexels:

| Plik | Pexels ID |
| --- | --- |
| chleb-zytni.jpg | 30895274 |
| bagietki.jpg | 1387070 |
| croissant-au-beurre.jpg | 3850330 |
| pain-au-chocolat.jpg | 9242434 |
| viennoiserie-lada.jpg | 2245293 |
| bulki-maslane.jpg | 1287278 |
| bulki-rzemieslnicze.jpg | 30767876 |
| cynamonka.jpg | 19137635 |
| tarta-cytrynowa.jpg | 29961484 |
| tarta-kratka.jpg | 2955816 |
| tort-biszkoptowy.jpg | 2144112 |
| proces-wyrabianie.jpg | 33593100 |
| proces-maka.jpg | 784633 |
| proces-piec.jpg | 36445212 |
| wnetrze-polki.jpg | 30667030 |
| wnetrze-witryna.jpg | 18946615 |
| patisserie-witryna.jpg | 31101247 |
| skladniki-maka.jpg | 10994433 |

`chleb-na-zakwasie.jpg` (Pexels 4881596) jest zdjęciem zapasowym. Nie jest używane na stronie i można go użyć np. dla nowego wypieku.

## Dane przykładowe

Adres (ul. Chlebowa 12, Warszawa), telefon, e-mail, godziny otwarcia, ceny i historia założycieli są fikcyjne. Przed startem zamień je na prawdziwe w edytorze witryny.
