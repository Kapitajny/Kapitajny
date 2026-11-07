---
name: Luxury Moving
description: Strona firmowa przeprowadzek i transportu busem w całej Polsce (statyczna strona w strona/), wersja 6 „Black & Sand”
colors:
  black: "#171615"
  graphite: "#24211F"
  sand: "#C6B69C"
  cream: "#F2EEE6"
  taupe: "#81796D"
  offwhite: "#E8E3DA"
  on-dark-2: "#ADA497"
  on-light-2: "#5F584E"
  ink: "#2A2520"
  error-on-dark: "#F0B4A3"
typography:
  display:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "min(clamp(2.35rem, .9rem + 4.9vw, 5.5rem), 9.6svh)"
    fontWeight: 450
    lineHeight: 1.13
    letterSpacing: "-0.015em"
    textTransform: uppercase
  headline:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "clamp(2.1rem, 1.4rem + 2.8vw, 4.1rem)"
    fontWeight: 400
    lineHeight: 1.08
  title:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.2rem + 1.8vw, 2.85rem)"
    fontWeight: 400
    lineHeight: 1.08
  body:
    fontFamily: "Jost, Futura, Century Gothic, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Jost, Futura, Century Gothic, system-ui, sans-serif"
    fontSize: ".875rem"
    fontWeight: 500
    letterSpacing: "0.14em"
    textTransform: uppercase
rounded:
  none: "0"
  button: "2px"
  note: "1.2cqi"
spacing:
  gutter: "clamp(16px, 4.2vw, 56px)"
  section: "clamp(88px, 11vw, 168px)"
  max: "1320px"
---

# Luxury Moving – system wizualny „Black & Sand”

Zakres: tylko strona w `strona/`. Aplikacja Next.js w tym repozytorium to osobny projekt.

## Charakter

Usługa przeprowadzki opowiedziana językiem marki premium: dużo czerni i powietrza, piaskowy beż jako jedyny akcent,
typografia o kontraście jak na banknotach i papierach wartościowych. Bez klasycznego menu: strona jest jedną opowieścią
czytaną przewijaniem. Jeden element jest głośny w każdej części strony (bus, banknoty, trasa), reszta jest cicha.

## Kolory

| Token | Hex | Rola |
|---|---|---|
| black | #171615 | tło hero, cennika, formularza, stopki |
| graphite | #24211F | sekcja mapy, panel formularza |
| sand | #C6B69C | akcent: przyciski główne, aktywne stany, finał, papier banknotów |
| cream | #F2EEE6 | tekst na ciemnym, tło manifestu i usług, pola formularza |
| taupe | #81796D | linie i elementy dekoracyjne (nie tekst – za mały kontrast) |
| offwhite | #E8E3DA | sekcja przebiegu współpracy |
| on-dark-2 | #ADA497 | tekst drugorzędny na czerni i grafitie (≥ 6:1) |
| on-light-2 | #5F584E | tekst drugorzędny na kremie (≥ 5:1) |
| ink | #2A2520 | tusz banknotów |

Zasady: bez przypadkowych gradientów (dozwolone: miękkie światło za busem, papier banknotu), bez złota, zaokrąglenia
najwyżej 2px poza banknotami.

## Typografia

- **Bodoni Moda** (zmienna, self-hosted, OFL) – nagłówki, liczby, banknoty. Oś optyczna ustawiona na `opsz 26`
  w `body`, żeby kreski włoskowe (np. w „ł”, „Ż”) były widoczne w dużych rozmiarach. Nie używać skrótu `font:`
  (resetuje oś) – w CSS są wyłącznie właściwości szczegółowe.
- **Jost** (zmienna, self-hosted, OFL) – tekst, etykiety, przyciski.
- Wersaliki tylko tam, gdzie wymaga ich brief lub świat banknotu: hook hero, finał, przyciski, pola banknotu.

## Komponenty

- **Przycisk**: prostokąt 2px, wersaliki z rozstrzałem .14em, wypełnienie przesuwane od lewej przy najechaniu.
  Warianty: `btn-sand` (główny), `btn-line` (obrys), `btn-dark` (na piasku), `btn-ghost` (Wstecz).
- **Banknot** (`.note`): kontener z `container-type: inline-size`; poziomy (2.25:1) powyżej 520px szerokości
  kontenera, pionowy poniżej. Pola: USŁUGA, CENA OD / CENA, ZAKRES USŁUGI, LUXURY MOVING, numer seryjny, nominały
  w rogach. Gilosze (rozeta, fale) generuje `main.js` jako symbole SVG. Treść z `config.js → pricing`.
- **Indeks usług**: lista z cienkimi liniami; na komputerze przyklejona ramka zdjęcia przenika do usługi w centrum
  ekranu; na tablecie dwie kolumny, na telefonie zdjęcie nad tekstem.
- **Trasa współpracy**: pięć przystanków na falistej linii, która rysuje się z przewijaniem; na telefonie pionowo.
- **Mapa Polski**: SVG z v5 (16 województw, 16 miast) w kolorach grafitu i piasku; wybór dwóch miast rysuje trasę.
- **Formularz**: cztery kroki (Kontakt, Usługa, Trasa i termin, Szczegóły), jasne pola na grafitowym panelu,
  wybór usługi i ilości jako kafelki radiowe.

## Ruch

Jedna wyreżyserowana sekwencja wejścia w hero (logo, linie nagłówka, wjazd busa). Dalej ruch powiązany z przewijaniem:
pasek postępu, paralaksa busa, rozświetlanie słów manifestu, przenikanie zdjęć usług, rysowanie trasy, wejście
banknotów z połyskiem i pochylenie za kursorem. `prefers-reduced-motion` wyłącza animacje i pokazuje wszystko od razu.
