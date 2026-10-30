/**
 * Ustawienia marki NOIR STUDIO.
 * Studio jest fikcyjne – to projekt demonstracyjny agencji ComputerIT.
 * Dane kontaktowe uzupełnia się zmiennymi środowiskowymi (patrz `.env.example`), teksty – w `src/i18n/`.
 */

export const siteConfig = {
  name: "NOIR STUDIO",
  /** Adres strony bez końcowego ukośnika. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3100",
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  email: process.env.NEXT_PUBLIC_STUDIO_EMAIL?.trim() || null,
  agency: { name: "ComputerIT" },
};

/** Sekcje strony. Nazwy w menu pochodzą ze słowników (`nav.items`). */
export const navigation = [
  { id: "top", image: "heroDusk" },
  { id: "portfolio", image: "cameraMountains" },
  { id: "services", image: "cameraSunset" },
  { id: "about", image: "aboutPortrait" },
  { id: "contact", image: "cameraSunset" },
] as const;

export type SectionId = (typeof navigation)[number]["id"];
