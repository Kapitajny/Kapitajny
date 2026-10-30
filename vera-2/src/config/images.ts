/**
 * Biblioteka zdjęć – każde zdjęcie na stronie jest tu wpisane raz, z tekstem alternatywnym.
 *
 * `source` mówi, skąd pochodzi plik:
 * - "client": dostarczone przez klienta,
 * - "generated": wygenerowane dla konceptu (Figma AI). Pliki z `preview` są powiększone
 *   z podglądu w niskiej rozdzielczości; wyeksportuj pełną ramkę z pliku Figma (identyfikator
 *   w `figmaNode`) pod tą samą nazwą pliku, aby je wyostrzyć.
 */

export const IMAGE_DIR = "/images/vera";

export interface ImageEntry {
  file: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position – kadrowanie zdjęcia. */
  focus?: string;
  source: "client" | "generated";
  preview?: boolean;
  figmaNode?: string;
}

export const IMAGES = {
  heroPortrait: {
    file: "hero-portrait.jpg",
    alt: "Kobieta w burgundowej satynowej sukience opiera się o ciepłą, tynkowaną ścianę w miękkim świetle z okna",
    width: 1024,
    height: 1280,
    focus: "62% 30%",
    source: "generated",
    figmaNode: "1:2",
  },
  profile: {
    file: "profile-burgundy.jpg",
    alt: "Profil twarzy i szyi kobiety w miękkim świetle na tle głębokiej burgundowej ściany",
    width: 577,
    height: 720,
    focus: "40% 40%",
    source: "generated",
    preview: true,
    figmaNode: "2:2",
  },
  serum: {
    file: "serum-still.jpg",
    alt: "Bursztynowa butelka serum z pipetą na bloku trawertynu, w tle burgundowa tkanina",
    width: 720,
    height: 577,
    focus: "70% 50%",
    source: "generated",
    preview: true,
    figmaNode: "2:3",
  },
  assessment: {
    file: "assessment.jpg",
    alt: "Specjalistka w czarnych rękawiczkach delikatnie ocenia linię żuchwy klientki podczas konsultacji",
    width: 577,
    height: 720,
    focus: "50% 40%",
    source: "generated",
    preview: true,
    figmaNode: "2:4",
  },
  cream: {
    file: "cream-texture.jpg",
    alt: "Smuga kremu w kolorze kości słoniowej i mosiężna szpatułka na burgundowej satynie",
    width: 720,
    height: 720,
    source: "generated",
    preview: true,
    figmaNode: "2:5",
  },
  specialistPhysician: {
    file: "specialist-physician.jpg",
    alt: "Portret Heleny Mróz w czarnej tunice na tle jasnej ściany",
    width: 577,
    height: 720,
    focus: "50% 25%",
    source: "generated",
    preview: true,
    figmaNode: "2:6",
  },
  specialistCosmetologist: {
    file: "specialist-cosmetologist.jpg",
    alt: "Portret Julii Sowy w pudrowobeżowej tunice na burgundowym tle",
    width: 577,
    height: 720,
    focus: "45% 25%",
    source: "generated",
    preview: true,
    figmaNode: "2:7",
  },
  specialistSkin: {
    file: "specialist-skin.jpg",
    alt: "Portret Adama Lisa w czarnej tunice, siedzącego na drewnianym stołku",
    width: 577,
    height: 720,
    focus: "50% 22%",
    source: "generated",
    preview: true,
    figmaNode: "2:8",
  },
  facialMask: {
    file: "facial-mask.jpg",
    alt: "Kosmetolożka nakłada pędzlem jasnoróżową maskę z glinki na policzek zrelaksowanej klientki",
    width: 720,
    height: 577,
    focus: "45% 40%",
    source: "generated",
    preview: true,
    figmaNode: "2:9",
  },
  consultation: {
    file: "consultation.jpg",
    alt: "Specjalistka robi odręczne notatki przy trawertynowym stoliku naprzeciw klientki, między nimi lusterko",
    width: 720,
    height: 577,
    source: "generated",
    preview: true,
    figmaNode: "2:10",
  },
  reception: {
    file: "reception.jpg",
    alt: "Recepcja studia z zaokrągloną burgundową aksamitną sofą i wapiennymi ścianami",
    width: 720,
    height: 481,
    focus: "30% 60%",
    source: "generated",
    preview: true,
    figmaNode: "2:11",
  },
  spf: {
    file: "spf-winter.jpg",
    alt: "Tubka kremu z filtrem bez etykiety na złożonym wełnianym swetrze przy zaśnieżonym oknie",
    width: 720,
    height: 577,
    source: "generated",
    preview: true,
    figmaNode: "2:12",
  },
  hydration: {
    file: "hydration.jpg",
    alt: "Krople wody i pasmo przezroczystego żelu na pudrowobeżowej powierzchni w bocznym świetle",
    width: 577,
    height: 720,
    source: "generated",
    preview: true,
    figmaNode: "2:13",
  },
  portraitPlatinum: {
    file: "portrait-platinum.jpg",
    alt: "Kobieta z krótkimi platynowymi włosami w czarnym golfie opiera brodę na dłoni na tle burgundowej ściany",
    width: 577,
    height: 720,
    focus: "50% 30%",
    source: "generated",
    preview: true,
    figmaNode: "2:14",
  },
  treatmentRoom: {
    file: "studio-treatment-room.jpg",
    alt: "Gabinet zabiegowy z jasnym fotelem zabiegowym, ryflowanymi szafkami i brązowymi aksamitnymi zasłonami",
    width: 2048,
    height: 1376,
    focus: "60% 60%",
    source: "client",
  },
  facialRitual: {
    file: "facial-ritual.jpg",
    alt: "Klientka z ręcznikiem na włosach podczas masażu twarzy z kremem",
    width: 610,
    height: 610,
    focus: "55% 45%",
    source: "client",
  },
  nailsBurgundy: {
    file: "nails-burgundy.jpg",
    alt: "Dłoń z krótkimi, lśniącymi paznokciami w głębokiej czerwieni na tle szarej zasłony",
    width: 480,
    height: 600,
    source: "client",
  },
  nailsNude: {
    file: "nails-nude.jpg",
    alt: "Dłoń z lśniącymi paznokciami w kolorze nude i cienkim złotym pierścionkiem na kremowym rękawie swetra",
    width: 447,
    height: 447,
    source: "client",
  },
} as const satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof IMAGES;

export function imageSrc(key: ImageKey) {
  return `${IMAGE_DIR}/${IMAGES[key].file}`;
}

/** CSS object-position kadru zdjęcia. */
export function imageFocus(key: ImageKey): string {
  const entry: ImageEntry = IMAGES[key];
  return entry.focus ?? "50% 50%";
}
