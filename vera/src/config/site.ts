/**
 * Brand settings, contact details and navigation.
 *
 * DEMO CONCEPT: the address, phone number, e-mail and Instagram handle are placeholders.
 * Replace them here before launch – the header menu, footer, contact page, structured data
 * and privacy policy all read from this file.
 */

export const site = {
  name: "VÉRA",
  fullName: "VÉRA Aesthetic Studio",
  tagline: "Your beauty. Your identity.",
  description:
    "VÉRA Aesthetic Studio in Kraków – aesthetic medicine and professional skin care, planned around your features and your skin. Book a consultation.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000",
  /** Keep search engines out until real studio details are in place. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  /** External booking system (e.g. Booksy, Versum). When set, /book links to its calendar. */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || null,
  agency: "ComputerIT",
  contact: {
    phone: "+48 12 000 00 00",
    phoneHref: "tel:+48120000000",
    email: "studio@vera.example",
    instagramHandle: "@vera.studio",
    instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/",
    street: "ul. Józefa 00",
    postalCode: "31-000",
    city: "Kraków",
    district: "Kazimierz",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kazimierz%2C%20Krak%C3%B3w",
  },
  hours: [
    { label: "Monday – Friday", time: "10:00 – 20:00", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "20:00" },
    { label: "Saturday", time: "10:00 – 16:00", days: ["Saturday"], opens: "10:00", closes: "16:00" },
  ],
  /** Data controller – required in the privacy policy. */
  controller: { companyName: null as string | null, nip: null as string | null },
};

export interface NavItem {
  href: string;
  label: string;
  /** Shown beside the menu when the item is hovered or focused. */
  note: string;
}

export const menu: NavItem[] = [
  { href: "/", label: "Home", note: "The studio at a glance – philosophy, treatments and the people behind them." },
  { href: "/about", label: "About us", note: "Why VÉRA exists, how we work and what we will never do." },
  { href: "/treatments", label: "Treatments", note: "Aesthetic medicine, skin treatments, cosmetology and skin consultations." },
  { href: "/specialists", label: "Our specialists", note: "A physician, cosmetologists and a skin therapist – one shared plan." },
  { href: "/journal", label: "Journal", note: "Notes on skin, treatments and preparing for your first visit." },
  { href: "/contact", label: "Contact", note: "Find the studio in Kazimierz, call us or send a message." },
];

export const bookHref = "/book";
