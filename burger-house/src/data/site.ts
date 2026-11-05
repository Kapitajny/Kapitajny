/**
 * Dane marki. Marka BUŁA burger house jest fikcyjna – wszystkie dane kontaktowe,
 * adresy i godziny są przykładowe i wymagają weryfikacji przed uruchomieniem działalności.
 */
export const SITE = {
  name: "BUŁA burger house",
  shortName: "BUŁA",
  slogan: "Robione teraz. Nie wcześniej.",
  description:
    "BUŁA burger house – burgery smażone na zamówienie z wołowiny mielonej każdego ranka. Dwa lokale: Warszawa, ul. Marszałkowska 25 i Grodzisk Mazowiecki, ul. 11 Listopada 12. Zamówienia: +48 22 555 12 34.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: {
    display: "+48 22 555 12 34",
    href: "tel:+48225551234",
  },
  founded: 2019,
} as const;

export const NAV = [
  { href: "/#menu", label: "Menu" },
  { href: "/#bestsellery", label: "Bestsellery" },
  { href: "/#o-nas", label: "O nas" },
  { href: "/#lokale", label: "Lokale" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;

export const LEGAL_LINKS = [
  { href: "/regulamin", label: "Regulamin" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
] as const;
