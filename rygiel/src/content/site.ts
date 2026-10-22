function readSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "Rygiel",
  legalName: null as string | null, // Pełna nazwa firmy – do uzupełnienia przed publikacją.
  tagline: "Obsługa IT i cyberbezpieczeństwo dla firm",
  description:
    "Rygiel administruje infrastrukturą IT małych i średnich firm, prowadzi audyty bezpieczeństwa oraz projektuje kopie zapasowe i środowiska chmurowe. Projekt demonstracyjny ComputerIT.",
  url: readSiteUrl(),
  locale: "pl_PL",
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
  portfolio: {
    name: "ComputerIT",
    note: "Rygiel to marka demonstracyjna przygotowana przez ComputerIT. Realizacje opisane w serwisie są przykładami, a nie projektami dla rzeczywistych klientów.",
  },
} as const;

export type NavItem = { href: string; label: string };

export const mainNav: NavItem[] = [
  { href: "/uslugi", label: "Usługi" },
  { href: "/realizacje", label: "Realizacje" },
  { href: "/baza-wiedzy", label: "Baza wiedzy" },
  { href: "/o-nas", label: "O nas" },
];

export const primaryCta: NavItem = { href: "/kontakt", label: "Umów konsultację" };

export const legalNav: NavItem[] = [
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  { href: "/polityka-cookies", label: "Polityka cookies" },
  { href: "/regulamin", label: "Regulamin serwisu" },
];
