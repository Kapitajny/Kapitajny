/**
 * CENTRALNA MAPA ZDJĘĆ
 *
 * Wszystkie zdjęcia strony leżą w katalogu `public/images/coffee/`.
 * Aby podmienić grafikę, wystarczy wgrać plik o nazwie z pola `file`
 * (albo zmienić nazwę pliku tutaj). Brakujące zdjęcie nie psuje strony –
 * zamiast niego wyświetla się elegancki placeholder (patrz `components/ui/Photo.tsx`).
 *
 * Zalecenia: JPG/WebP, min. 1600 px po dłuższym boku (hero: 2000 px+),
 * proporcje zbliżone do `aspect` – zdjęcie jest kadrowane przez `object-fit: cover`.
 *
 * Po dodaniu nowych plików w trybie produkcyjnym przebuduj projekt (`npm run build`),
 * bo lista dostępnych zdjęć jest ustalana podczas renderowania na serwerze.
 */

export const IMAGE_DIR = "/images/coffee";

export interface ImageDefinition {
  file: string;
  alt: string;
  /** Sugerowane proporcje zdjęcia (szerokość / wysokość) – tylko informacyjnie. */
  aspect: string;
}

export const IMAGES = {
  // Strona główna
  hero: { file: "hero-coffee.jpg", alt: "Cappuccino z sercem z latte art na drewnianym stole, obok ziarna kawy", aspect: "4:5" },
  aboutMain: { file: "barista.jpg", alt: "Barista wlewający mleko i tworzący latte art w filiżance", aspect: "4:5" },
  aboutDetail: { file: "coffee-beans.jpg", alt: "Filiżanka kawy otoczona świeżo palonymi ziarnami", aspect: "16:9" },

  // Produkty (menu)
  espresso: { file: "espresso.jpg", alt: "Espresso spływające z ekspresu do czarnej filiżanki", aspect: "4:5" },
  americano: { file: "americano.jpg", alt: "Americano w białej filiżance, obok rogalik i ziarna kawy", aspect: "4:5" },
  cappuccino: { file: "cappuccino.jpg", alt: "Cappuccino posypane kakao w białej filiżance, obok ziarna kawy", aspect: "4:5" },
  caffeLatte: { file: "caffe-latte.jpg", alt: "Mleko wlewane do filiżanki kawy", aspect: "4:5" },
  flatWhite: { file: "flat-white.jpg", alt: "Flat white z latte art w niskiej szklance na drewnianym spodku", aspect: "4:5" },
  mocha: { file: "mocha.jpg", alt: "Mocha z puszystą pianką posypaną kakao", aspect: "4:5" },
  espressoMacchiato: { file: "espresso-macchiato.jpg", alt: "Espresso macchiato w małej szklance z mleczną pianką", aspect: "4:5" },
  icedLatte: { file: "iced-latte.jpg", alt: "Iced latte w wysokiej szklance z lodem i słomką", aspect: "4:5" },
  coldBrew: { file: "cold-brew.jpg", alt: "Cold brew z kostkami lodu w szklance", aspect: "4:5" },
  caramelLatte: { file: "caramel-latte.jpg", alt: "Caramel latte z bitą śmietaną i sosem karmelowym", aspect: "4:5" },

  // Galeria „Zobacz. Poczuj. Zamów.”
  galleryEspresso: { file: "gallery-espresso.jpg", alt: "Espresso z gęstą cremą w białej filiżance wśród ziaren kawy", aspect: "3:4" },
  galleryLatteArt: { file: "gallery-latte-art.jpg", alt: "Kubek kawy z latte art w kształcie liścia trzymany w dłoniach", aspect: "1:1" },
  galleryLatteGlass: { file: "gallery-latte-glass.jpg", alt: "Latte macchiato w wysokiej szklance z warstwami mleka i kawy", aspect: "3:4" },
  galleryColdBrew: { file: "gallery-cold-brew.jpg", alt: "Mleko wlewane do szklanki kawy z lodem na stoliku w ogródku", aspect: "4:5" },
  galleryGroundCoffee: { file: "gallery-ground-coffee.jpg", alt: "Ziarna kawy i świeżo zmielona kawa na drewnianym blacie", aspect: "16:10" },
  galleryBarista: { file: "gallery-barista.jpg", alt: "Filiżanka espresso na marmurowym barze, w tle rogaliki", aspect: "3:4" },
  galleryCoffeeCake: { file: "gallery-coffee-cake.jpg", alt: "Filiżanka czarnej kawy i rogalik na stoliku", aspect: "4:3" },
  galleryInterior: { file: "cafe-interior.jpg", alt: "Wnętrze kawiarni z barem, drewnianymi stolikami i obrazami na ścianie", aspect: "16:10" },

  // Sekcja „Dlaczego NOIR COFFEE?”
  whyBeans: { file: "why-beans.jpg", alt: "Ziarna kawy przesypywane w dłoniach", aspect: "4:5" },
  whyPrecision: { file: "why-precision.jpg", alt: "Barista precyzyjnie wlewający mleko i tworzący latte art", aspect: "4:5" },
  whyPickup: { file: "why-pickup.jpg", alt: "Espresso nalewane z ekspresu do kubka na wynos", aspect: "4:5" },
} satisfies Record<string, ImageDefinition>;

export type ImageKey = keyof typeof IMAGES;

/** Obraz po sprawdzeniu, czy plik istnieje w `public/`. */
export interface ResolvedImage {
  key: ImageKey;
  /** `null`, gdy pliku nie ma – wtedy renderowany jest placeholder. */
  src: string | null;
  /** Oczekiwana ścieżka pliku (dla developera, gdy zdjęcia brakuje). */
  expectedPath: string;
  alt: string;
}

export type ImageManifest = Record<ImageKey, ResolvedImage>;
