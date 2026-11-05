/**
 * Ustawienia marki i dane kontaktowe ComputerIT (Concept 02).
 * Dane kontaktowe uzupełnia się zmiennymi środowiskowymi (patrz `.env.example`) –
 * dopóki są puste, strona pokazuje w ich miejscu „do uzupełnienia” zamiast wymyślonych wartości.
 */

const env = (value: string | undefined) => value?.trim() || null;

export const siteConfig = {
  name: "ComputerIT",
  description:
    "ComputerIT projektuje i tworzy nowoczesne strony internetowe oraz sklepy online dla firm. Indywidualny projekt, responsywność, przejrzyste ceny i bezpośredni kontakt.",
  /** Adres strony bez końcowego ukośnika, np. https://computerit.pl */
  url: env(process.env.NEXT_PUBLIC_SITE_URL)?.replace(/\/+$/, "") || "http://localhost:3000",
  /** Indeksowanie można wyłączyć (np. na środowisku testowym) ustawiając NEXT_PUBLIC_ALLOW_INDEXING=false. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false",
  contact: {
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  },
};

export const mainNav = [
  { href: "/uslugi", label: "Usługi" },
  { href: "/strony-internetowe", label: "Strony internetowe" },
  { href: "/sklepy-internetowe", label: "Sklepy internetowe" },
  { href: "/realizacje", label: "Realizacje" },
  { href: "/o-nas", label: "O nas" },
] as const;

export const footerNav = [
  { href: "/strony-internetowe", label: "Strony internetowe" },
  { href: "/sklepy-internetowe", label: "Sklepy internetowe" },
  { href: "/realizacje", label: "Realizacje" },
  { href: "/o-nas", label: "O nas" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const legalNav = [
  { href: "/regulamin-uslug", label: "Regulamin usług" },
  { href: "/regulamin-platnosci", label: "Regulamin płatności" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
] as const;
