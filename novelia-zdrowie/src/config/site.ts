/**
 * Podstawowa konfiguracja sklepu NOVELIA ZDROWIE.
 * Dane sprzedawcy pochodzą ze zmiennych środowiskowych – puste pola są oznaczane jako „do uzupełnienia”.
 */

function env(value: string | undefined): string {
  return value?.trim() ?? "";
}

export const siteConfig = {
  name: "NOVELIA ZDROWIE",
  url: (env(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000").replace(/\/+$/, ""),
  description:
    "NOVELIA ZDROWIE – wydawnictwo cyfrowe o zdrowym odżywianiu. E-book „Zdrowiej każdego dnia”: 32 proste przepisy, plan posiłków na 3 dni i praktyczny poradnik. PDF do pobrania od razu po płatności.",
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
};

/** Dane sprzedawcy – do uzupełnienia w zmiennych środowiskowych (patrz .env.example). */
export const seller = {
  name: env(process.env.NEXT_PUBLIC_SELLER_NAME),
  address: env(process.env.NEXT_PUBLIC_SELLER_ADDRESS),
  nip: env(process.env.NEXT_PUBLIC_SELLER_NIP),
  regon: env(process.env.NEXT_PUBLIC_SELLER_REGON),
  email: env(process.env.NEXT_PUBLIC_SELLER_EMAIL),
  phone: env(process.env.NEXT_PUBLIC_SELLER_PHONE),
};

export const mainNav = [
  { href: "/#ebook", label: "E-book" },
  { href: "/#w-srodku", label: "Co w środku" },
  { href: "/sklep", label: "Sklep" },
  { href: "/#jak-to-dziala", label: "Jak to działa" },
  { href: "/#faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const legalNav = [
  { href: "/regulamin", label: "Regulamin sklepu" },
  { href: "/regulamin-tresci-cyfrowych", label: "Regulamin sprzedaży treści cyfrowych" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  { href: "/polityka-cookies", label: "Polityka plików cookies" },
  { href: "/platnosci", label: "Płatności" },
  { href: "/dostawa", label: "Dostawa produktów cyfrowych" },
  { href: "/reklamacje-i-zwroty", label: "Prawa konsumenta i reklamacje" },
] as const;
