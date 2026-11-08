/**
 * CENTRALNA MAPA ZDJĘĆ NOIR STUDIO
 *
 * Wszystkie zdjęcia leżą w `public/images/studio/`. Aby dodać lub podmienić zdjęcie,
 * wgraj plik o nazwie z pola `file` (lista: `public/images/studio/README.md`).
 * Teksty alternatywne (`alt`) są w słownikach `src/i18n/pl.ts` i `en.ts` (klucz `images`).
 * Brakujący plik nie psuje strony – w jego miejscu pojawia się passe-partout w barwach marki
 * z opisem kadru, który ma się tam znaleźć.
 *
 * Zalecenia: JPG/WebP, min. 2000 px po dłuższym boku, kadr w proporcjach z pola `aspect`
 * (zdjęcie jest dopasowywane przez `object-fit: cover`). Po dodaniu plików w produkcji
 * przebuduj projekt (`npm run build`).
 */

export const IMAGE_DIR = "/images/studio";

export interface ImageDefinition {
  file: string;
  /** Proporcje kadru (szerokość / wysokość). */
  aspect: `${number}/${number}`;
  /** Punkt ostrości przy kadrowaniu (`object-position`). */
  focus?: string;
}

const portfolio = {
  weddingVows: { file: "wedding-vows.jpg", aspect: "7/6", focus: "40% 50%" },
  weddingDance: { file: "wedding-first-dance.jpg", aspect: "8/5" },
  weddingDetails: { file: "wedding-details.jpg", aspect: "5/6" },
  weddingWalk: { file: "wedding-walk.jpg", aspect: "3/2" },

  portraitStudio: { file: "portrait-studio.jpg", aspect: "3/2" },
  portraitWindow: { file: "portrait-window.jpg", aspect: "2/3", focus: "50% 30%" },
  portraitHands: { file: "portrait-hands.jpg", aspect: "16/9", focus: "45% 50%" },
  portraitRetro: { file: "portrait-retro.jpg", aspect: "16/9", focus: "40% 40%" },

  fashionSummer: { file: "fashion-summer.jpg", aspect: "4/3" },
  fashionGown: { file: "fashion-gown.jpg", aspect: "2/3", focus: "50% 30%" },
  fashionStreet: { file: "fashion-street.jpg", aspect: "3/2" },
  fashionJewelry: { file: "fashion-jewelry.jpg", aspect: "16/9" },

  commercialCamera: { file: "commercial-camera.jpg", aspect: "3/2", focus: "45% 50%" },
  commercialProduct: { file: "commercial-product.jpg", aspect: "2/3" },
  commercialTools: { file: "commercial-tools.jpg", aspect: "1/1" },
  commercialPainting: { file: "commercial-painting.jpg", aspect: "4/5" },
  commercialFood: { file: "commercial-food.jpg", aspect: "3/2" },

  storyKitchen: { file: "story-kitchen.jpg", aspect: "4/5" },
  storyMorning: { file: "story-morning.jpg", aspect: "3/4", focus: "50% 40%" },
  storySea: { file: "story-sea.jpg", aspect: "3/2" },
  storyTorun: { file: "story-torun.jpg", aspect: "4/3" },
} satisfies Record<string, ImageDefinition>;

/** Usługi korzystają ze zdjęć z portfolio tej samej kategorii. */
const services = {
  serviceWeddings: { file: "wedding-vows.jpg", aspect: "7/6", focus: "40% 50%" },
  servicePortraits: { file: "portrait-window.jpg", aspect: "4/5", focus: "50% 25%" },
  serviceFashion: { file: "fashion-street.jpg", aspect: "3/2" },
  serviceCommercial: { file: "commercial-product.jpg", aspect: "2/3" },
  servicePersonal: { file: "story-morning.jpg", aspect: "3/4", focus: "50% 40%" },
} satisfies Record<string, ImageDefinition>;

export const IMAGES = {
  // Zdjęcia przekazane przez klienta
  heroDusk: {
    file: "hero-dusk.jpg",
   
    aspect: "3/2",
    focus: "28% 60%",
  },
  aboutPortrait: {
    file: "about-portrait.jpg",
   
    aspect: "4/5",
    focus: "56% 40%",
  },
  cameraSunset: { file: "camera-sunset.jpg", aspect: "3/2", focus: "45% 50%" },
  cameraMountains: { file: "camera-mountains.jpg", aspect: "3/2", focus: "62% 50%" },
  photographerField: { file: "photographer-field.jpg", aspect: "3/2", focus: "35% 50%" },

  ...portfolio,
  ...services,
} satisfies Record<string, ImageDefinition>;

export type ImageKey = keyof typeof IMAGES;

/** Zdjęcie po sprawdzeniu, czy plik istnieje w `public/`. */
export interface ResolvedImage {
  /** `null`, gdy pliku nie ma – wtedy renderowany jest placeholder. */
  src: string | null;
  /** Oczekiwana ścieżka pliku (dla osoby wgrywającej zdjęcia). */
  expectedPath: string;
  alt: string;
  aspect: ImageDefinition["aspect"];
  focus?: string;
  /** Podpis passe-partout, gdy zdjęcia jeszcze nie ma (w języku strony). */
  placeholder: string;
}
