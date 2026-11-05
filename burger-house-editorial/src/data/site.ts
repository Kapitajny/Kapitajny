/**
 * Koncepcja 02 „Editorial” – te same dane marki co w koncepcji 01
 * (marka fikcyjna, dane przykładowe).
 */
export const SITE = {
  name: "BUŁA burger house",
  slogan: "Dobry burger bez kompromisów.",
  description:
    "BUŁA burger house – burgery smażone na zamówienie z wołowiny mielonej każdego ranka. Warszawa, ul. Marszałkowska 25 i Grodzisk Mazowiecki, ul. 11 Listopada 12. Zamówienia: +48 22 555 12 34.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3003",
  phone: { display: "+48 22 555 12 34", href: "tel:+48225551234" },
  founded: 2019,
} as const;

/** Adresy pozostałych koncepcji – do porównania w stopce. */
export const VERSIONS = [
  { label: "Koncepcja 01", href: process.env.NEXT_PUBLIC_CONCEPT_1_URL ?? "http://localhost:3001" },
  { label: "Wariant 02A", href: process.env.NEXT_PUBLIC_CONCEPT_2A_URL ?? "http://localhost:3002" },
] as const;

export const NAV = [
  { href: "/#menu", label: "Menu" },
  { href: "/#o-nas", label: "O nas" },
  { href: "/#lokale", label: "Nasze lokale" },
  { href: "/#promocje", label: "Promocje" },
] as const;

export const LEGAL_LINKS = [
  { href: "/regulamin", label: "Regulamin" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
] as const;

export const PROMOS = {
  fire: { title: "Zestaw Fire", price: 4499, regular: 4999, when: "Poniedziałek–czwartek, cały dzień" },
  lunch: { title: "Lunch w tygodniu", price: 3299, regular: 3699, when: "Poniedziałek–piątek, 12:00–15:00" },
} as const;
