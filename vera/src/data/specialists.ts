import type { ImageKey } from "@/config/images";
import type { CategorySlug } from "./treatments";

/**
 * The team shown on the site. These are fictional people for the concept –
 * names, roles and biographies must be replaced with the studio's real staff,
 * and any credentials added only from documents the staff provide.
 */

export interface Specialist {
  slug: string;
  name: string;
  role: string;
  image: ImageKey;
  /** Short line used on the home page. */
  short: string;
  bio: string[];
  areas: CategorySlug[];
  /** In their own words – a sentence about how they work. */
  quote: string;
}

export const specialists: Specialist[] = [
  {
    slug: "helena-mroz",
    name: "Helena Mróz",
    role: "Physician, aesthetic medicine",
    image: "specialistPhysician",
    short: "Leads every aesthetic medicine procedure, from the first interview to the follow-up.",
    bio: [
      "Helena performs all aesthetic medicine procedures at VÉRA. She begins every new client relationship with a medical interview and a frank conversation about expectations.",
      "Her approach is incremental: small changes, reviewed together, rather than a single large one.",
    ],
    areas: ["aesthetic-medicine", "skin-consultation"],
    quote: "The best result is one your friends can't name – they just say you look well.",
  },
  {
    slug: "julia-sowa",
    name: "Julia Sowa",
    role: "Cosmetologist",
    image: "specialistCosmetologist",
    short: "Designs our facials and hand rituals, and the home-care plans that go with them.",
    bio: [
      "Julia is responsible for professional cosmetology at the studio: facials, massage and hand care.",
      "She believes that what happens at home between visits matters as much as the visit itself, and keeps her recommendations short enough to follow.",
    ],
    areas: ["professional-cosmetology", "skin-treatments"],
    quote: "Three good products used every day do more than ten used now and then.",
  },
  {
    slug: "adam-lis",
    name: "Adam Lis",
    role: "Skin specialist",
    image: "specialistSkin",
    short: "Runs skin consultations and plans peel and microneedling courses.",
    bio: [
      "Adam meets most new clients first, during the skin consultation. He plans courses of peels and microneedling and adjusts them across the seasons.",
      "He is the one most likely to suggest waiting, or doing less.",
    ],
    areas: ["skin-consultation", "skin-treatments"],
    quote: "A plan is only good if it still makes sense in February and in July.",
  },
];
