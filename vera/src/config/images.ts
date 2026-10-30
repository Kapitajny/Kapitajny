/**
 * Photo library – every photo on the site is listed here once, with its alt text.
 *
 * `source` records where the file came from:
 * - "client": supplied by the client,
 * - "generated": generated for this concept (Figma AI). Files marked `preview` are
 *   enlarged from a low-resolution preview; export the full-size frame from the Figma
 *   file (node id in `figmaNode`) over the same file name to sharpen them.
 */

export const IMAGE_DIR = "/images/vera";

export interface ImageEntry {
  file: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position for art-directed crops. */
  focus?: string;
  source: "client" | "generated";
  preview?: boolean;
  figmaNode?: string;
}

export const IMAGES = {
  heroPortrait: {
    file: "hero-portrait.jpg",
    alt: "A woman in a burgundy satin dress leaning against a warm plaster wall in soft window light",
    width: 1024,
    height: 1280,
    focus: "62% 30%",
    source: "generated",
    figmaNode: "1:2",
  },
  profile: {
    file: "profile-burgundy.jpg",
    alt: "Side profile of a woman's face and neck lit softly against a deep burgundy wall",
    width: 577,
    height: 720,
    focus: "40% 40%",
    source: "generated",
    preview: true,
    figmaNode: "2:2",
  },
  serum: {
    file: "serum-still.jpg",
    alt: "An amber serum bottle with a dropper on a travertine block, burgundy fabric behind",
    width: 720,
    height: 577,
    focus: "70% 50%",
    source: "generated",
    preview: true,
    figmaNode: "2:3",
  },
  assessment: {
    file: "assessment.jpg",
    alt: "A specialist in black gloves gently assessing a client's jawline during a consultation",
    width: 577,
    height: 720,
    focus: "50% 40%",
    source: "generated",
    preview: true,
    figmaNode: "2:4",
  },
  cream: {
    file: "cream-texture.jpg",
    alt: "A swirl of ivory face cream and a brass spatula on burgundy satin",
    width: 720,
    height: 720,
    source: "generated",
    preview: true,
    figmaNode: "2:5",
  },
  specialistPhysician: {
    file: "specialist-physician.jpg",
    alt: "Portrait of Helena Mróz in a black tunic against an ivory wall",
    width: 577,
    height: 720,
    focus: "50% 25%",
    source: "generated",
    preview: true,
    figmaNode: "2:6",
  },
  specialistCosmetologist: {
    file: "specialist-cosmetologist.jpg",
    alt: "Portrait of Julia Sowa in a powder-beige tunic against a burgundy backdrop",
    width: 577,
    height: 720,
    focus: "45% 25%",
    source: "generated",
    preview: true,
    figmaNode: "2:7",
  },
  specialistSkin: {
    file: "specialist-skin.jpg",
    alt: "Portrait of Adam Lis seated on a wooden stool in a black tunic",
    width: 577,
    height: 720,
    focus: "50% 22%",
    source: "generated",
    preview: true,
    figmaNode: "2:8",
  },
  facialMask: {
    file: "facial-mask.jpg",
    alt: "A cosmetologist brushing a pale pink clay mask onto a relaxed client's cheek",
    width: 720,
    height: 577,
    focus: "45% 40%",
    source: "generated",
    preview: true,
    figmaNode: "2:9",
  },
  consultation: {
    file: "consultation.jpg",
    alt: "A specialist taking handwritten notes across a travertine table from a client, a hand mirror between them",
    width: 720,
    height: 577,
    source: "generated",
    preview: true,
    figmaNode: "2:10",
  },
  reception: {
    file: "reception.jpg",
    alt: "The studio reception with a curved burgundy velvet sofa and limewashed walls",
    width: 720,
    height: 481,
    focus: "30% 60%",
    source: "generated",
    preview: true,
    figmaNode: "2:11",
  },
  spf: {
    file: "spf-winter.jpg",
    alt: "An unbranded sunscreen tube on a folded wool knit beside a snowy window",
    width: 720,
    height: 577,
    source: "generated",
    preview: true,
    figmaNode: "2:12",
  },
  hydration: {
    file: "hydration.jpg",
    alt: "Water droplets and a ribbon of clear gel on a powder-beige surface in raking light",
    width: 577,
    height: 720,
    source: "generated",
    preview: true,
    figmaNode: "2:13",
  },
  portraitPlatinum: {
    file: "portrait-platinum.jpg",
    alt: "A woman with cropped platinum hair in a black knit, resting her chin on her hand against a burgundy wall",
    width: 577,
    height: 720,
    focus: "50% 30%",
    source: "generated",
    preview: true,
    figmaNode: "2:14",
  },
  treatmentRoom: {
    file: "studio-treatment-room.jpg",
    alt: "A treatment room with an ivory treatment chair, fluted cabinetry and brown velvet curtains",
    width: 2048,
    height: 1376,
    focus: "60% 60%",
    source: "client",
  },
  facialRitual: {
    file: "facial-ritual.jpg",
    alt: "A client with a towel wrapped around her hair receiving a cream facial massage",
    width: 610,
    height: 610,
    focus: "55% 45%",
    source: "client",
  },
  nailsBurgundy: {
    file: "nails-burgundy.jpg",
    alt: "A hand with short glossy deep-red nails against a soft grey curtain",
    width: 480,
    height: 600,
    source: "client",
  },
  nailsNude: {
    file: "nails-nude.jpg",
    alt: "A hand with nude glossy nails and a thin gold ring, resting on a cream knit sleeve",
    width: 447,
    height: 447,
    source: "client",
  },
} as const satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof IMAGES;

export function imageSrc(key: ImageKey) {
  return `${IMAGE_DIR}/${IMAGES[key].file}`;
}

/** CSS object-position of a photo's art-directed crop. */
export function imageFocus(key: ImageKey): string {
  const entry: ImageEntry = IMAGES[key];
  return entry.focus ?? "50% 50%";
}
