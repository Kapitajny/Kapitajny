# Zdjęcia strony REHABILITIS

Mapa plików → miejsc na stronie: `src/config/images.ts`.

| Plik | Gdzie | Status |
| --- | --- | --- |
| `terapia-biodra-gabinet.jpg` | Hero strony głównej, obraz Open Graph, „O gabinecie” (do czasu własnego zdjęcia wnętrza) | zdjęcie poglądowe od właściciela |
| `fizjoterapeuta-z-pacjentem.jpg` | Usługa: Fizjoterapia indywidualna | zdjęcie poglądowe od właściciela |
| `terapia-kolana.jpg` | Usługa: Rehabilitacja ortopedyczna | zdjęcie poglądowe od właściciela |
| `cwiczenia-na-pilce.jpg` | Usługa: Terapia bólu pleców i karku | zdjęcie poglądowe od właściciela |
| `terapia-manualna-bark.jpg` | Usługa: Masaż leczniczy; sekcja „Jak pracujemy” | zdjęcie poglądowe od właściciela |
| `cwiczenia-z-tasma.jpg` | Usługa: Rehabilitacja pooperacyjna | zdjęcie poglądowe od właściciela |
| `cwiczenia-stabilizacyjne.jpg` | Usługa: Ćwiczenia usprawniające | zdjęcie poglądowe od właściciela |
| `fizjoterapeuta-portret.jpg` | „O gabinecie” – portret fizjoterapeuty | **brak – do wgrania** |
| `gabinet-wnetrze.jpg` | „O gabinecie” – wnętrze gabinetu | **brak – do wgrania** |

Każde zdjęcie pojawia się też jako miniatura w indeksie usług na stronie głównej. Punkt kadrowania
(`position`) ustawisz w `src/config/images.ts`.

Obecne zdjęcia mają ok. 550–680 px szerokości, więc na ekranach o wysokiej gęstości pikseli mogą wyglądać
miękko. Przed publikacją podmień je na wersje min. 1600 px (hero: 2000 px+) i potwierdź prawa do ich użycia.
Zdjęcia osób, które nie są pracownikami gabinetu, pozostaw oznaczone jako poglądowe (`illustrative: true`).

## Logo (`public/images/brand/`)

| Plik | Gdzie |
| --- | --- |
| `logo-oryginal.png` | oryginał od właściciela (białe tło) |
| `logo-znak.png` | nagłówek i menu – znak na przezroczystym tle |
| `logo-znak-bialy.png` | stopka i obraz udostępniania – biały znak na zielone tło |

Ikony karty przeglądarki (`src/app/icon.png`, `src/app/apple-icon.png`) są wygenerowane z tego samego znaku.
Przy zmianie logo podmień te pliki (najlepiej wersją wektorową SVG od projektanta).
