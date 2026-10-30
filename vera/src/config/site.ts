/**
 * Studio details – one place to change name, contact data and navigation.
 * Phone, e-mail, address and Instagram are placeholders for this ComputerIT concept.
 */

const url = (process.env.NEXT_PUBLIC_SITE_URL || "https://vera-studio.example").replace(/\/$/, "");

export const siteConfig = {
  name: "VÉRA",
  fullName: "VÉRA Aesthetic Studio",
  tagline: "Your beauty. Your identity.",
  description:
    "VÉRA Aesthetic Studio is a modern studio for aesthetic medicine and professional skin care. Every treatment starts with an honest consultation and a plan built around your features.",
  url,
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  agency: "ComputerIT",

  contact: {
    phone: "+48 000 000 000",
    phoneHref: "tel:+48000000000",
    email: "hello@vera-studio.example",
    instagramHandle: "@vera.studio",
    instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/",
  },

  address: {
    street: "ul. Przykładowa 12",
    postalCode: "00-000",
    city: "Warszawa",
    country: "PL",
    note: "Ground floor, entrance from the courtyard",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Warszawa",
  },

  hours: [
    { days: "Monday – Friday", time: "9:00 – 20:00", schema: "Mo-Fr 09:00-20:00" },
    { days: "Saturday", time: "9:00 – 15:00", schema: "Sa 09:00-15:00" },
    { days: "Sunday", time: "Closed", schema: null },
  ],

  /** External booking system (e.g. Booksy, Versum). When set, the booking page shows a calendar link. */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "",
} as const;

export interface NavItem {
  href: string;
  label: string;
  /** Short line shown next to the preview photo in the navigation panel. */
  blurb: string;
  image: import("./images").ImageKey;
}

export const mainNav: NavItem[] = [
  { href: "/", label: "Home", blurb: "The studio, in one page.", image: "heroPortrait" },
  { href: "/about", label: "About us", blurb: "Why we start with a conversation.", image: "reception" },
  { href: "/treatments", label: "Treatments", blurb: "Four areas, one approach.", image: "facialRitual" },
  { href: "/specialists", label: "Our specialists", blurb: "The people you will meet.", image: "specialistPhysician" },
  { href: "/journal", label: "Journal", blurb: "Notes on skin, care and restraint.", image: "hydration" },
  { href: "/contact", label: "Contact", blurb: "Find us, call us, write to us.", image: "treatmentRoom" },
];

export const legalNav = [{ href: "/privacy-policy", label: "Privacy policy" }];

export const bookingHref = "/book";
