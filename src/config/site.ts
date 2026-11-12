/**
 * Marka, adres i stałe treści strony.
 * Adres jest FIKCYJNY (projekt demonstracyjny) – przed startem wpisz prawdziwe dane.
 * Telefon, e-mail, parking i zasady wynajmu ustawia administrator w panelu (/panel → Ustawienia).
 */
export const site = {
  name: "MOLO Jet Club",
  shortName: "MOLO/JET",
  city: "Sopot",
  description:
    "Wynajem skuterów wodnych w Sopocie – od 30 minut do pełnej doby. Rezerwacja online, instruktaż przed startem i wypłynięcie prosto na Zatokę Gdańską.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000",
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  address: {
    street: "ul. Przystań Kapitańska 7",
    postal: "81-701",
    city: "Sopot",
    /** Adres jest fikcyjny – mapa pokazuje ogólny widok wybrzeża Sopotu, bez pinezki. */
    fictional: true,
    mapQuery: "Sopot molo",
  },
  coordinates: "54°26′N 18°34′E",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || null,
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || null,
    googleReviews: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || null,
  },
} as const;

export const mainNav = [
  { href: "/#flota", label: "Flota" },
  { href: "/#bez-patentu", label: "Bez patentu" },
  { href: "/#cennik", label: "Cennik" },
  { href: "/#jak-to-dziala", label: "Jak to działa" },
  { href: "/#lokalizacja", label: "Lokalizacja" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const legalNav = [
  { href: "/regulamin", label: "Regulamin" },
  { href: "/zasady-wynajmu", label: "Zasady wynajmu" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  { href: "/cookies", label: "Pliki cookies" },
] as const;
