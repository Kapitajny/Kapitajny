/**
 * CENTRALNA MAPA ZDJĘĆ NOIR STUDIO
 *
 * Wszystkie zdjęcia leżą w `public/images/studio/`. Aby dodać lub podmienić zdjęcie,
 * wgraj plik o nazwie z pola `file` (lista: `public/images/studio/README.md`).
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
  alt: string;
  /** Proporcje kadru (szerokość / wysokość). */
  aspect: `${number}/${number}`;
  /** Punkt ostrości przy kadrowaniu (`object-position`). */
  focus?: string;
}

const portfolio = {
  weddingVows: { file: "wedding-vows.jpg", alt: "A bride and groom exchanging vows in the soft light of a chapel window", aspect: "4/5" },
  weddingDance: { file: "wedding-first-dance.jpg", alt: "A couple's first dance in a dim ballroom lit by candles", aspect: "3/2" },
  weddingDetails: { file: "wedding-details.jpg", alt: "A bride's hands fastening a pearl earring before the ceremony", aspect: "2/3" },
  weddingWalk: { file: "wedding-walk.jpg", alt: "Newlyweds walking away along a tree-lined avenue at dusk", aspect: "16/9" },

  portraitStudio: { file: "portrait-studio.jpg", alt: "A woman photographed against a plain dark backdrop with a single side light", aspect: "4/5" },
  portraitWindow: { file: "portrait-window.jpg", alt: "A man in a wool coat by a tall apartment window, half in shadow", aspect: "2/3" },
  portraitHands: { file: "portrait-hands.jpg", alt: "Close-up of an older pianist's hands resting on the keys", aspect: "1/1" },
  portraitArtist: { file: "portrait-artist.jpg", alt: "A painter in her studio among canvases, looking straight into the lens", aspect: "3/2" },

  fashionCoat: { file: "fashion-coat.jpg", alt: "A model in a long sand-coloured coat on an empty concrete staircase", aspect: "2/3" },
  fashionMotion: { file: "fashion-motion.jpg", alt: "Fabric of a black dress caught mid-turn against a white wall", aspect: "4/5" },
  fashionStreet: { file: "fashion-street.jpg", alt: "A model crossing a wide street in early morning light", aspect: "16/9" },
  fashionDetail: { file: "fashion-detail.jpg", alt: "Detail of a tailored jacket lapel and a silver brooch", aspect: "1/1" },

  commercialInterior: { file: "commercial-interior.jpg", alt: "A minimalist restaurant interior photographed before opening", aspect: "3/2" },
  commercialProduct: { file: "commercial-product.jpg", alt: "A ceramic vase on a stone plinth with a hard shadow", aspect: "4/5" },
  commercialCraft: { file: "commercial-craft.jpg", alt: "A leatherworker's hands stitching a bag at a workbench", aspect: "2/3" },
  commercialArchitecture: { file: "commercial-architecture.jpg", alt: "A modern office facade with repeating windows at blue hour", aspect: "16/9" },

  storyKitchen: { file: "story-kitchen.jpg", alt: "A grandmother and granddaughter baking together in a small kitchen", aspect: "3/2" },
  storyMorning: { file: "story-morning.jpg", alt: "A young family on an unmade bed in early morning light", aspect: "4/5" },
  storySea: { file: "story-sea.jpg", alt: "A father and son standing at the edge of the Baltic Sea in winter", aspect: "16/9" },
  storyLetters: { file: "story-letters.jpg", alt: "Hands sorting old family photographs and letters on a table", aspect: "1/1" },
} satisfies Record<string, ImageDefinition>;

const services = {
  serviceWeddings: { file: "service-weddings.jpg", alt: "A wedding couple framed in a doorway between ceremony and reception", aspect: "4/5" },
  servicePortraits: { file: "service-portraits.jpg", alt: "A portrait session in a daylight studio with a single grey backdrop", aspect: "3/4" },
  serviceFashion: { file: "service-fashion.jpg", alt: "A fashion set with a model, stylist and a large softbox", aspect: "4/5" },
  serviceCommercial: { file: "service-commercial.jpg", alt: "A product still life arranged on a table under studio lights", aspect: "3/2" },
  servicePersonal: { file: "service-personal.jpg", alt: "A couple and their dog photographed at home on a quiet afternoon", aspect: "4/5" },
} satisfies Record<string, ImageDefinition>;

export const IMAGES = {
  // Zdjęcia przekazane przez klienta
  heroDusk: {
    file: "hero-dusk.jpg",
    alt: "A photographer kneeling on a moorland ridge at dusk, a long lens on a tripod pointed across the valley",
    aspect: "3/2",
    focus: "28% 60%",
  },
  aboutPortrait: {
    file: "about-portrait.jpg",
    alt: "The founder of NOIR STUDIO raising her camera, the lens pointed straight at the viewer",
    aspect: "4/5",
    focus: "56% 40%",
  },
  cameraSunset: { file: "camera-sunset.jpg", alt: "A camera on a tripod facing a low sun over a misty valley", aspect: "3/2", focus: "45% 50%" },
  cameraMountains: { file: "camera-mountains.jpg", alt: "A camera with a long lens on a tripod overlooking forested hills and distant mountains", aspect: "3/2", focus: "62% 50%" },

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
}
