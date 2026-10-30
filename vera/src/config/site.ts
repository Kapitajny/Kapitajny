/**
 * Dane studia – jedno miejsce na nazwę, kontakt i nawigację.
 * Telefon, e-mail, adres i Instagram są placeholderami konceptu ComputerIT.
 */

const url = (process.env.NEXT_PUBLIC_SITE_URL || "https://vera-studio.example").replace(/\/$/, "");

export const siteConfig = {
  name: "VÉRA",
  fullName: "VÉRA Aesthetic Studio",
  tagline: "Twoje piękno. Twoja tożsamość.",
  description:
    "VÉRA Aesthetic Studio to nowoczesne studio medycyny estetycznej i profesjonalnej pielęgnacji skóry. Każdy zabieg zaczynamy od rzetelnej konsultacji i planu dopasowanego do Twoich rysów.",
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
    note: "Parter, wejście od dziedzińca",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Warszawa",
  },

  hours: [
    { days: "Poniedziałek – piątek", time: "9:00 – 20:00", schema: "Mo-Fr 09:00-20:00" },
    { days: "Sobota", time: "9:00 – 15:00", schema: "Sa 09:00-15:00" },
    { days: "Niedziela", time: "Nieczynne", schema: null },
  ],

  /** Zewnętrzny system rezerwacji (np. Booksy, Versum). Gdy jest ustawiony, strona konsultacji pokazuje link do kalendarza. */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "",
} as const;

export interface NavItem {
  href: string;
  label: string;
  /** Krótka linijka przy zdjęciu podglądu w panelu nawigacji. */
  blurb: string;
  image: import("./images").ImageKey;
}

export const mainNav: NavItem[] = [
  { href: "/", label: "Strona główna", blurb: "Całe studio na jednej stronie.", image: "heroPortrait" },
  { href: "/o-nas", label: "O nas", blurb: "Dlaczego zaczynamy od rozmowy.", image: "reception" },
  { href: "/zabiegi", label: "Zabiegi", blurb: "Cztery obszary, jedno podejście.", image: "facialRitual" },
  { href: "/specjalisci", label: "Nasi specjaliści", blurb: "Osoby, które poznasz.", image: "specialistPhysician" },
  { href: "/magazyn", label: "Magazyn", blurb: "O skórze, pielęgnacji i umiarze.", image: "hydration" },
  { href: "/kontakt", label: "Kontakt", blurb: "Odwiedź nas, zadzwoń, napisz.", image: "treatmentRoom" },
];

export const legalNav = [{ href: "/polityka-prywatnosci", label: "Polityka prywatności" }];

export const bookingHref = "/konsultacja";
