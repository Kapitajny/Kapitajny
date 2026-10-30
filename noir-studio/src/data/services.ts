import type { ImageKey } from "@/config/images";

/** Rodzaje sesji w formularzu kontaktowym. `value` trafia do zapytania. */
export const SESSION_TYPES = [
  { value: "wedding", label: "Wedding photography" },
  { value: "portrait", label: "Portrait photography" },
  { value: "fashion", label: "Fashion photography" },
  { value: "commercial", label: "Commercial photography" },
  { value: "personal", label: "Personal session" },
  { value: "other", label: "Something else" },
] as const;

export type SessionType = (typeof SESSION_TYPES)[number]["value"];

export interface Service {
  id: string;
  name: string;
  session: SessionType;
  image: ImageKey;
  description: string;
  scope: string[];
  cta: string;
}

export const SERVICES: Service[] = [
  {
    id: "weddings",
    name: "Wedding Photography",
    session: "wedding",
    image: "serviceWeddings",
    description:
      "We follow the day as it actually happens: the nerves before, the ceremony, the people who travelled to be there. We work quietly, direct only when it helps, and leave you with an archive your family will still open in thirty years.",
    scope: [
      "Half-day or full-day coverage",
      "Second photographer on request",
      "A short portrait session for the two of you",
      "Online gallery of edited photographs within six weeks",
      "Optional linen-bound album and archival prints",
    ],
    cta: "Inquire about your wedding",
  },
  {
    id: "portraits",
    name: "Portrait Photography",
    session: "portrait",
    image: "servicePortraits",
    description:
      "For people who need a portrait that looks like them on a good day, not like a filter: artists, authors, founders, actors. We talk first, then build the light around your face and the way you hold yourself.",
    scope: [
      "Ninety-minute session in our Warsaw studio or on location",
      "Advice on clothing and setting before the shoot",
      "Choosing the final frames together",
      "Eight to fifteen retouched portraits in full resolution",
      "Usage for press, books and personal brand",
    ],
    cta: "Inquire about a portrait",
  },
  {
    id: "fashion",
    name: "Fashion Photography",
    session: "fashion",
    image: "serviceFashion",
    description:
      "Editorials, lookbooks and campaigns for designers and brands. We start from the garment, its weight, cut and the way it moves, and build the set, the casting and the light around it.",
    scope: [
      "Creative concept and moodboard",
      "Casting, styling, hair and make-up coordination",
      "Studio or location production",
      "Retouching to an agreed standard",
      "Licences for print, web and social media",
    ],
    cta: "Inquire about a fashion project",
  },
  {
    id: "commercial",
    name: "Commercial Photography",
    session: "commercial",
    image: "serviceCommercial",
    description:
      "Products, interiors, architecture and the people behind a business, photographed with the same care as our personal work and delivered in the formats your team actually uses.",
    scope: [
      "Pre-production call and shot list",
      "Product and still life in the studio",
      "Interiors and architecture on location",
      "Team and founder portraits",
      "Files prepared for web, print and marketplaces",
    ],
    cta: "Inquire about a commercial shoot",
  },
  {
    id: "personal",
    name: "Personal Sessions",
    session: "personal",
    image: "servicePersonal",
    description:
      "Unhurried sessions at home or in a place that matters to you: a new baby, a family, a couple, a parent you want to remember exactly as they are. No studio props and very little posing.",
    scope: [
      "Two to three hours at home or a place you choose",
      "Black-and-white and colour edits",
      "Online gallery to share with family",
      "A small set of archival prints",
      "Gift vouchers available",
    ],
    cta: "Inquire about a personal session",
  },
];
