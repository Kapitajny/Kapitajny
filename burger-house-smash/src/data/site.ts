/**
 * Koncepcja 03 „Smash” – te same dane marki co w poprzednich koncepcjach
 * (marka fikcyjna, dane przykładowe).
 */
export const SITE = {
  name: "BUŁA burger house",
  slogan: "Chrupie na brzegach. Cieknie w środku.",
  description:
    "BUŁA – smash burgery dociskane na gorącej blasze, z wołowiny mielonej każdego ranka. Warszawa, ul. Marszałkowska 25 i Grodzisk Mazowiecki, ul. 11 Listopada 12. Zamówienia: +48 22 555 12 34.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3004",
  phone: { display: "+48 22 555 12 34", href: "tel:+48225551234" },
  founded: 2019,
} as const;

/** Adresy pozostałych koncepcji – do porównania w stopce. */
export const VERSIONS = [
  { label: "Koncepcja 01", href: process.env.NEXT_PUBLIC_CONCEPT_1_URL ?? "http://localhost:3001" },
  { label: "Wariant 02A", href: process.env.NEXT_PUBLIC_CONCEPT_2A_URL ?? "http://localhost:3002" },
  { label: "Koncepcja 02 Editorial", href: process.env.NEXT_PUBLIC_CONCEPT_2_URL ?? "http://localhost:3003" },
] as const;

export const NAV = [
  { href: "/#menu", label: "Menu" },
  { href: "/#filozofia", label: "Filozofia" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#lokale", label: "Lokale i kontakt" },
] as const;

/** Profile społecznościowe – adresy przykładowe (marka fikcyjna). */
export const SOCIAL = [
  { id: "instagram", label: "Instagram", handle: "@bula.smash", href: "https://www.instagram.com/" },
  { id: "tiktok", label: "TikTok", handle: "@bula.smash", href: "https://www.tiktok.com/" },
  { id: "facebook", label: "Facebook", handle: "BUŁA smash burger", href: "https://www.facebook.com/" },
] as const;

export const LEGAL_LINKS = [
  { href: "/regulamin", label: "Regulamin" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
] as const;
