/**
 * Ustawienia marki i dane kontaktowe ComputerIT.
 * Dane kontaktowe uzupełnia się zmiennymi środowiskowymi (patrz `.env.example`) –
 * dopóki są puste, strona pokazuje w ich miejscu „do uzupełnienia” zamiast wymyślonych wartości.
 */

const env = (value: string | undefined) => value?.trim() || null;

export const siteConfig = {
  name: "ComputerIT",
  wordmark: "COMPUTERIT",
  description:
    "ComputerIT – niezależne studio projektowania i tworzenia stron internetowych oraz sklepów online. Indywidualny projekt, responsywność i bezpośredni kontakt.",
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
  { id: "o-mnie", label: "O mnie", hint: "Kim jestem i jak pracuję" },
  { id: "uslugi", label: "Usługi i cennik", hint: "Strony od 1300 zł netto, sklepy od 2000 zł netto" },
  { id: "portfolio", label: "Portfolio", hint: "Koncepcje demonstracyjne" },
  { id: "promocja", label: "Pakiet promocyjny", hint: "Strona za 800 zł dla pierwszych pięciu klientów" },
  { id: "kontakt", label: "Kontakt", hint: "Opowiedz o swoim projekcie" },
] as const;
