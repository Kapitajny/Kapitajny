/**
 * Koncepcja 02 – te same dane marki co w koncepcji 01 (marka fikcyjna, dane przykładowe).
 */
export const SITE = {
  name: "BUŁA burger house",
  slogan: "Robione teraz. Nie wcześniej.",
  description:
    "BUŁA burger house – burgery smażone na zamówienie z wołowiny mielonej każdego ranka. Warszawa, ul. Marszałkowska 25 i Grodzisk Mazowiecki, ul. 11 Listopada 12. Zamówienia: +48 22 555 12 34.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002",
  phone: { display: "+48 22 555 12 34", href: "tel:+48225551234" },
  founded: 2019,
  /** Adres koncepcji 01 – do przełącznika koncepcji. */
  concept1Url: process.env.NEXT_PUBLIC_CONCEPT_1_URL ?? "http://localhost:3001",
} as const;

export const NAV = [
  { href: "/#menu", label: "Menu" },
  { href: "/#promocje", label: "Promocje" },
  { href: "/#o-nas", label: "O nas" },
  { href: "/#lokale", label: "Lokale" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;

export const LEGAL_LINKS = [
  { href: "/regulamin", label: "Regulamin" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
] as const;

/** Kampanie promocyjne koncepcji 02. Ceny w groszach. */
export const CAMPAIGNS = [
  {
    id: "zestaw-fire",
    title: "Zestaw Fire",
    when: "Poniedziałek–czwartek, cały dzień",
    text: "Fire Burger, frytki z przyprawą chili i lemoniada domowa.",
    price: 4499,
    regular: 4999,
    image: "/images/c2-promo-fire.jpg",
    alt: "Fire Burger z jalapeño na talerzu, frytki z chili i lemoniada z limonką na musztardowym tle",
    tone: "mustard",
  },
  {
    id: "lunch",
    title: "Lunch w tygodniu",
    when: "Poniedziałek–piątek, 12:00–15:00",
    text: "Zestaw Classic: Classic Burger, frytki klasyczne i napój 0,4 l.",
    price: 3299,
    regular: 3699,
    image: "/images/c2-promo-lunch.jpg",
    alt: "Cheeseburger, frytki w papierowym rożku i cola na zielonym tle; dłoń sięga po frytkę",
    tone: "pickle",
  },
] as const;
