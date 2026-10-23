/**
 * Ustawienia marki, pasek ogłoszeń, dane kontaktowe i nawigacja.
 * Dane sprzedawcy i kontaktu są `null`, dopóki właściciel ich nie poda (zmienne NEXT_PUBLIC_*) –
 * strona pokazuje wtedy wyraźne „do uzupełnienia” zamiast wymyślonych wartości.
 */

// Zmienne NEXT_PUBLIC_* muszą być odczytywane wprost (process.env.NAZWA), żeby trafiły do kodu przeglądarki.
const env = (value: string | undefined) => value?.trim() || null;

export const siteConfig = {
  /** Nazwa sklepu (robocza – zmień w NEXT_PUBLIC_BRAND_NAME). Znakiem marki jest logo z butem. */
  name: process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "KAPITAJNY",
  description: "Sklep z bluzami i spodniami streetwear: hoodie, zipy, cargo, baggy jeans i dresy w szerokich krojach. Płatność online i wysyłka w Polsce.",
  /** Adres strony bez końcowego ukośnika. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000",
  /** Indeksowanie w wyszukiwarkach włącz dopiero po uzupełnieniu prawdziwych danych. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  /** Pasek ogłoszeń nad nawigacją. Ustaw `enabled: false`, żeby go ukryć. */
  announcement: {
    enabled: true,
    text: "New drop – odkryj kolekcję",
    href: "/nowosci",
  },
  contact: {
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  },
  /** Dane sprzedawcy wymagane w regulaminie i na stronie kontaktu. */
  seller: {
    company: env(process.env.NEXT_PUBLIC_SELLER_NAME),
    address: env(process.env.NEXT_PUBLIC_SELLER_ADDRESS),
    nip: env(process.env.NEXT_PUBLIC_SELLER_NIP),
    returnsAddress: env(process.env.NEXT_PUBLIC_RETURNS_ADDRESS),
  },
  social: {
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    tiktok: env(process.env.NEXT_PUBLIC_TIKTOK_URL),
  },
};

export const mainNav = [
  { href: "/kategoria/bluzy", label: "Bluzy" },
  { href: "/kategoria/spodnie", label: "Spodnie" },
  { href: "/nowosci", label: "Nowości" },
  { href: "/kolekcje", label: "Kolekcje" },
] as const;

export const helpNav = [
  { href: "/dostawa-i-zwroty", label: "Dostawa i zwroty" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/konto", label: "Konto" },
  { href: "/ulubione", label: "Ulubione" },
] as const;

export const legalNav = [
  { href: "/regulamin", label: "Regulamin sklepu" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  { href: "/dostawa-i-zwroty", label: "Dostawa i zwroty" },
  { href: "/kontakt", label: "Kontakt i dane sprzedawcy" },
] as const;
