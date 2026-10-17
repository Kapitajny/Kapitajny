/**
 * Ustawienia marki i dane kontaktowe.
 * Pola oznaczone `null` są do uzupełnienia przed uruchomieniem produkcyjnym –
 * do tego czasu strona pokazuje w ich miejscu informację „do uzupełnienia”.
 */

export const siteConfig = {
  name: "NOIR COFFEE",
  city: "Gdańsk",
  tagline: "Kawa specialty w Gdańsku",
  description:
    "NOIR COFFEE – kawiarnia w Gdańsku. Starannie wyselekcjonowane ziarna, perfekcyjnie przygotowane espresso i zamówienia online z odbiorem w wybranym lokalu.",
  /** Adres strony bez końcowego ukośnika, np. https://noircoffee.pl */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000",
  /** Link do profilu na Instagramie – ustaw NEXT_PUBLIC_INSTAGRAM_URL. */
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  /** Indeksowanie w wyszukiwarkach włącz dopiero po uzupełnieniu prawdziwych danych. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  contact: {
    email: null as string | null,
    phone: null as string | null,
  },
};

export const mainNav = [
  { href: "/", label: "Strona główna" },
  { href: "/#menu", label: "Nasza kawa" },
  { href: "/#o-nas", label: "O nas" },
  { href: "/#lokale", label: "Nasze lokale" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;

export const legalNav = [
  { href: "/regulamin", label: "Regulamin zamawiania kawy online" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  { href: "/cookies", label: "Polityka plików cookies" },
  { href: "/platnosci-i-zwroty", label: "Informacje o płatnościach i zwrotach" },
  { href: "/kontakt", label: "Kontakt i dane sprzedawcy" },
] as const;
