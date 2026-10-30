/**
 * Ustawienia marki NOIR STUDIO.
 * Studio jest fikcyjne – to projekt demonstracyjny agencji ComputerIT.
 * Dane kontaktowe uzupełnia się zmiennymi środowiskowymi (patrz `.env.example`).
 */

export const siteConfig = {
  name: "NOIR STUDIO",
  description:
    "NOIR STUDIO is a Warsaw photography studio for weddings, portraits, fashion, commercial work and personal stories – quiet, considered photographs made to outlast the day they were taken.",
  /** Adres strony bez końcowego ukośnika. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3100",
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  city: "Warszawa",
  country: "Polska",
  email: process.env.NEXT_PUBLIC_STUDIO_EMAIL?.trim() || null,
  agency: { name: "ComputerIT" },
};

export const navigation = [
  { href: "#top", label: "Home", image: "heroDusk" },
  { href: "#portfolio", label: "Portfolio", image: "cameraMountains" },
  { href: "#services", label: "Services", image: "cameraSunset" },
  { href: "#about", label: "About", image: "aboutPortrait" },
  { href: "#contact", label: "Contact", image: "cameraSunset" },
] as const;
