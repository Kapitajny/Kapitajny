/**
 * IMAGE MAP (shot list)
 *
 * Every photo slot on the site is listed here with its file name, alt text, aspect ratio and
 * a brief for the photographer. Files live in `public/images/vera/`. To fill a slot, upload a
 * file with the name from `file` – no code changes needed. Until then the slot shows a layout
 * plate with crop marks in the brand palette.
 *
 * Campaign direction for the whole set:
 * – editorial, fashion-magazine portraits: strong single light source, deep shadows, one subject;
 * – wardrobe and set in burgundy, black, powder and ivory; skin left natural, visible texture;
 * – close crops and unexpected framing (a shoulder, a jawline, hands), never "spa stock" smiles;
 * – interiors photographed like still lifes: few objects, hard daylight, graphic shadows.
 *
 * Technical: JPG/WebP, min. 2400 px on the long edge (hero 3200 px), aspect as in `aspect`.
 * Rebuild after adding files in production (`npm run build`).
 */

export const IMAGE_DIR = "/images/vera";

export type PlateTone = "burgundy" | "rose" | "powder" | "black";

export interface ImageDefinition {
  file: string;
  alt: string;
  aspect: string;
  /** Short slot name printed on the placeholder plate. */
  caption: string;
  brief: string;
  tone: PlateTone;
}

export const IMAGES = {
  // ── Home ────────────────────────────────────────────────────────────────
  heroCampaign: {
    file: "campaign-hero.jpg",
    alt: "Campaign portrait of a woman in a burgundy silk top, side light across her cheekbone",
    aspect: "3:4",
    caption: "Campaign portrait",
    brief: "Woman 30–45, burgundy silk, hair pulled back. Hard side light, black background, gaze past the lens. Crop from collarbone up, face slightly off-centre.",
    tone: "burgundy",
  },
  philosophy: {
    file: "philosophy-hands.jpg",
    alt: "Close-up of hands resting on a bare shoulder against a dark background",
    aspect: "4:5",
    caption: "Hands and shoulder, close crop",
    brief: "Macro of a hand resting on a shoulder, natural nails, skin texture visible. Black background, single soft key light.",
    tone: "black",
  },

  // ── Treatment categories ────────────────────────────────────────────────
  catAesthetic: {
    file: "category-aesthetic-medicine.jpg",
    alt: "Profile of a woman's jawline and neck in hard daylight",
    aspect: "4:5",
    caption: "Jawline, profile",
    brief: "Strict profile, jawline and neck, hard window light making a graphic shadow on an ivory wall.",
    tone: "powder",
  },
  catSkin: {
    file: "category-skin-treatments.jpg",
    alt: "Macro detail of skin on a cheek with fine natural texture",
    aspect: "4:5",
    caption: "Skin texture, macro",
    brief: "Macro of a cheek with visible pores and peach fuzz, warm light, no retouching of texture.",
    tone: "rose",
  },
  catCosmetology: {
    file: "category-cosmetology.jpg",
    alt: "A cosmetologist's gloved hands applying a cream mask with a flat brush",
    aspect: "4:5",
    caption: "Treatment, brush and mask",
    brief: "Top-down, gloved hands and a flat brush applying a cream mask. Burgundy towel framing the face.",
    tone: "burgundy",
  },
  catConsultation: {
    file: "category-consultation.jpg",
    alt: "Specialist and client talking across a black table, notebook between them",
    aspect: "4:5",
    caption: "Consultation table",
    brief: "Two people at a black table, shot from behind the client's shoulder, notebook and glass of water. Calm, focused.",
    tone: "black",
  },

  // ── Specialists ─────────────────────────────────────────────────────────
  specHelena: {
    file: "specialist-helena.jpg",
    alt: "Portrait of Dr Helena Wójcik in a black blazer",
    aspect: "4:5",
    caption: "Portrait, physician",
    brief: "Waist-up portrait, black blazer, same burgundy backdrop and light for the whole series.",
    tone: "burgundy",
  },
  specAlicja: {
    file: "specialist-alicja.jpg",
    alt: "Portrait of cosmetologist Alicja Nowicka",
    aspect: "4:5",
    caption: "Portrait, cosmetologist",
    brief: "Waist-up portrait, same backdrop and light as the series.",
    tone: "rose",
  },
  specZofia: {
    file: "specialist-zofia.jpg",
    alt: "Portrait of skin therapist Zofia Mazur",
    aspect: "4:5",
    caption: "Portrait, skin therapist",
    brief: "Waist-up portrait, same backdrop and light as the series.",
    tone: "black",
  },
  specNatalia: {
    file: "specialist-natalia.jpg",
    alt: "Portrait of client experience lead Natalia Król",
    aspect: "4:5",
    caption: "Portrait, client experience",
    brief: "Waist-up portrait, same backdrop and light as the series.",
    tone: "burgundy",
  },

  // ── Editorial gallery ───────────────────────────────────────────────────
  editorialSilk: {
    file: "editorial-silk.jpg",
    alt: "Burgundy silk draped over a shoulder",
    aspect: "3:4",
    caption: "Silk, shoulder",
    brief: "Burgundy silk slipping off a shoulder, folds catching hard light.",
    tone: "burgundy",
  },
  editorialMirror: {
    file: "editorial-mirror.jpg",
    alt: "Reflection of a woman in a round mirror in the treatment room",
    aspect: "4:5",
    caption: "Mirror reflection",
    brief: "Round mirror on a powder wall, partial reflection of a face – the rest of the frame empty.",
    tone: "powder",
  },
  editorialStill: {
    file: "editorial-still-life.jpg",
    alt: "Still life of unlabelled glass bottles on black stone",
    aspect: "1:1",
    caption: "Still life, glass on stone",
    brief: "Three unlabelled glass bottles on black stone, single hard light, long shadows. No brand logos.",
    tone: "black",
  },
  editorialRoom: {
    file: "editorial-treatment-room.jpg",
    alt: "Treatment room with a black chair and a burgundy curtain",
    aspect: "3:2",
    caption: "Treatment room",
    brief: "Wide shot of the treatment room: black chair, burgundy floor-length curtain, a stripe of daylight.",
    tone: "rose",
  },
  editorialLips: {
    file: "editorial-lips.jpg",
    alt: "Close-up of lips and chin with natural skin",
    aspect: "4:5",
    caption: "Lips, close crop",
    brief: "Tight crop of lips and chin, natural colour, no gloss. Warm, soft light.",
    tone: "rose",
  },
  editorialDoor: {
    file: "editorial-entrance.jpg",
    alt: "Studio entrance in a Kazimierz tenement with a brass door handle",
    aspect: "2:3",
    caption: "Entrance, Kazimierz",
    brief: "Studio door in a tenement courtyard, brass handle, VÉRA plaque out of focus.",
    tone: "powder",
  },

  // ── Journal ─────────────────────────────────────────────────────────────
  journalDaylight: {
    file: "journal-daylight.jpg",
    alt: "Blue sky with white cumulus clouds",
    aspect: "4:3",
    caption: "Daylight",
    brief: "Supplied by the client (259 × 194 px). Replace with a larger version for full-width use.",
    tone: "powder",
  },
  journalFirstVisit: {
    file: "journal-first-visit.jpg",
    alt: "Notebook and pen on the consultation table",
    aspect: "4:5",
    caption: "First visit",
    brief: "Open notebook on black table, pen, glass of water, morning light.",
    tone: "black",
  },
  journalBarrier: {
    file: "journal-skin-barrier.jpg",
    alt: "A drop of facial oil on the back of a hand",
    aspect: "4:5",
    caption: "Skin barrier",
    brief: "Back of a hand with a single drop of oil, macro, warm light.",
    tone: "rose",
  },
  journalCalendar: {
    file: "journal-planning.jpg",
    alt: "Paper calendar and a cup of coffee on a windowsill",
    aspect: "4:5",
    caption: "Planning",
    brief: "Paper planner open on a windowsill, hard daylight, graphic shadow of the window frame.",
    tone: "powder",
  },

  // ── About / contact ─────────────────────────────────────────────────────
  aboutStudio: {
    file: "about-studio.jpg",
    alt: "The VÉRA studio lounge with a black sofa and burgundy walls",
    aspect: "16:9",
    caption: "Studio lounge",
    brief: "Wide interior: black sofa, burgundy walls, one sculptural lamp. Shot like an architecture magazine.",
    tone: "burgundy",
  },
  aboutPortrait: {
    file: "about-portrait.jpg",
    alt: "Portrait of a woman with her eyes closed in soft light",
    aspect: "3:4",
    caption: "Portrait, eyes closed",
    brief: "Portrait with eyes closed, calm, powder background, soft light from above.",
    tone: "rose",
  },
  contactStudio: {
    file: "contact-courtyard.jpg",
    alt: "Tenement courtyard in Kazimierz in the afternoon",
    aspect: "4:5",
    caption: "Courtyard, Kazimierz",
    brief: "Courtyard of the tenement, afternoon light, ivy on the wall.",
    tone: "rose",
  },

  // ── Treatments (one per treatment) ──────────────────────────────────────
  txConsultation: { file: "treatment-physician-consultation.jpg", alt: "Physician examining a client's face in daylight", aspect: "4:5", caption: "Physician consultation", brief: "Physician gently assessing the client's face by the window.", tone: "powder" },
  txFacial: { file: "treatment-facial-aesthetics.jpg", alt: "Woman's face in three-quarter view with soft shadow", aspect: "4:5", caption: "Face, three-quarter", brief: "Three-quarter portrait, soft shadow under the cheekbone, natural skin.", tone: "burgundy" },
  txRevitalisation: { file: "treatment-revitalisation.jpg", alt: "Neck and décolletage in warm light", aspect: "4:5", caption: "Neck and décolletage", brief: "Neck and décolletage, warm light, black top.", tone: "rose" },
  txPeel: { file: "treatment-chemical-peel.jpg", alt: "Peel solution being applied with a fan brush", aspect: "4:5", caption: "Peel, fan brush", brief: "Fan brush applying a clear solution, macro, gloved hand.", tone: "powder" },
  txMicroneedling: { file: "treatment-microneedling.jpg", alt: "Specialist preparing a microneedling device", aspect: "4:5", caption: "Device preparation", brief: "Hands preparing a sterile device on a black tray. No brand visible.", tone: "black" },
  txLed: { file: "treatment-led.jpg", alt: "Client relaxing under a red LED light panel", aspect: "4:5", caption: "LED panel", brief: "Client lying under a red LED panel, eyes protected, red light filling the frame.", tone: "burgundy" },
  txSignatureFacial: { file: "treatment-signature-facial.jpg", alt: "Facial massage with both hands along the jawline", aspect: "4:5", caption: "Facial massage", brief: "Two hands sculpting along the jawline, client's eyes closed.", tone: "rose" },
  txCleansing: { file: "treatment-deep-cleansing.jpg", alt: "Warm towel being placed on a client's face", aspect: "4:5", caption: "Warm towel", brief: "Warm steaming towel being folded over the face.", tone: "burgundy" },
  txSkinAnalysis: { file: "treatment-skin-analysis.jpg", alt: "Skin therapist looking at skin through a magnifying lamp", aspect: "4:5", caption: "Skin analysis", brief: "Therapist with a magnifying lamp, light ring reflected in the lens.", tone: "black" },
  txSkincarePlan: { file: "treatment-skincare-plan.jpg", alt: "Handwritten skincare plan beside three unlabelled bottles", aspect: "4:5", caption: "Skincare plan", brief: "Handwritten plan card next to three unlabelled bottles on powder linen.", tone: "rose" },
} satisfies Record<string, ImageDefinition>;

export type ImageKey = keyof typeof IMAGES;

export interface ResolvedImage {
  key: ImageKey;
  src: string | null;
  expectedPath: string;
  alt: string;
  caption: string;
  tone: PlateTone;
}
