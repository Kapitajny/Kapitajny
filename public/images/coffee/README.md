# Zdjęcia NOIR COFFEE

Wgraj tutaj pliki o poniższych nazwach. Mapowanie zdjęć na sekcje i produkty jest w `src/config/images.ts`
(tam też zmienisz nazwę pliku albo tekst alternatywny). Brakujące zdjęcie zastępuje elegancki placeholder.

Zalecenia: JPG lub WebP, min. 1600 px po dłuższym boku (hero: 2000 px+), kadr zbliżony do podanych proporcji –
zdjęcie jest przycinane przez `object-fit: cover`. Po dodaniu plików w produkcji uruchom ponownie `npm run build`.

| Plik | Gdzie | Proporcje |
| --- | --- | --- |
| `hero-coffee.jpg` | sekcja otwierająca | 4:5 |
| `barista.jpg` | O nas – duże zdjęcie | 4:5 |
| `coffee-beans.jpg` | O nas – małe zdjęcie | 16:10 |
| `espresso.jpg`, `americano.jpg`, `cappuccino.jpg`, `caffe-latte.jpg`, `flat-white.jpg`, `mocha.jpg`, `espresso-macchiato.jpg`, `iced-latte.jpg`, `cold-brew.jpg`, `caramel-latte.jpg` | produkty w menu, klasykach i koszyku | 4:5 |
| `gallery-espresso.jpg` | galeria – espresso w filiżance | 3:4 |
| `gallery-latte-art.jpg` | galeria – cappuccino z latte art | 1:1 |
| `gallery-latte-glass.jpg` | galeria – latte w szklance | 3:4 |
| `gallery-cold-brew.jpg` | galeria – cold brew z lodem | 4:5 |
| `gallery-ground-coffee.jpg` | galeria – świeżo mielone ziarna | 16:10 |
| `gallery-barista.jpg` | galeria – barista przy pracy | 3:4 |
| `gallery-coffee-cake.jpg` | galeria – kawa i ciasto | 4:3 |
| `cafe-interior.jpg` | galeria – wnętrze kawiarni | 16:10 |
| `why-beans.jpg`, `why-precision.jpg`, `why-pickup.jpg` | sekcja „Dlaczego NOIR COFFEE?” | 4:5 |

Obecnie w katalogu są 3 zdjęcia przekazane przez właściciela (`hero-coffee.jpg`, `coffee-beans.jpg`,
`caffe-latte.jpg`) – mają ok. 590 px szerokości, więc przed startem warto podmienić je na wersje w wyższej
rozdzielczości i potwierdzić prawa do ich użycia.
