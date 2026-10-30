import type { ImageKey } from "@/config/images";

/**
 * SPECIALISTS – FICTIONAL PEOPLE (demo concept).
 * Replace with the real team before launch. No licence numbers or certificates are invented;
 * add the physician's licence number (PWZ) once real details are available.
 */
export interface Specialist {
  slug: string;
  name: string;
  role: string;
  discipline: "Medicine" | "Cosmetology" | "Skin therapy" | "Client care";
  image: ImageKey;
  quote: string;
  bio: string[];
  focus: string[];
}

export const specialists: Specialist[] = [
  {
    slug: "helena-wojcik",
    name: "Dr Helena Wójcik",
    role: "Aesthetic medicine physician",
    discipline: "Medicine",
    image: "specHelena",
    quote: "My job is to find the smallest change that makes the biggest difference to how you feel.",
    bio: [
      "Helena leads all physician consultations and medical treatments at VÉRA. She is known for long consultations and short treatment plans.",
      "She also sets the studio's medical protocols – qualification, consent and documentation – and reviews every combined treatment plan.",
    ],
    focus: ["Physician consultations", "Facial aesthetic treatments", "Skin revitalisation"],
  },
  {
    slug: "alicja-nowicka",
    name: "Alicja Nowicka",
    role: "Cosmetologist",
    discipline: "Cosmetology",
    image: "specAlicja",
    quote: "A good facial is quiet, precise and leaves the skin calmer than it found it.",
    bio: [
      "Alicja creates and performs the VÉRA Facial and leads our cleansing treatments. She adapts every session to how the skin looks on the day.",
      "Clients come to her for routines they can actually keep up at home.",
    ],
    focus: ["The VÉRA Facial", "Deep cleansing", "LED therapy"],
  },
  {
    slug: "zofia-mazur",
    name: "Zofia Mazur",
    role: "Skin therapist",
    discipline: "Skin therapy",
    image: "specZofia",
    quote: "Skin changes slowly. A plan you can follow for three months beats a perfect one you drop after a week.",
    bio: [
      "Zofia runs skin analyses and personal skincare plans, and delivers peels and microneedling courses.",
      "When skin needs a medical opinion she works directly with Dr Wójcik, so you never have to repeat your story.",
    ],
    focus: ["Skin analysis", "Chemical peels", "Microneedling"],
  },
  {
    slug: "natalia-krol",
    name: "Natalia Król",
    role: "Client experience lead",
    discipline: "Client care",
    image: "specNatalia",
    quote: "If you're not sure which appointment to book, call me – that's exactly what I'm here for.",
    bio: [
      "Natalia is your first contact at VÉRA – from the first call and choosing the right consultation to reminders before your visit.",
      "She also coordinates aftercare questions between you and the specialists.",
    ],
    focus: ["Booking and planning visits", "Preparation for treatments", "Aftercare contact"],
  },
];
