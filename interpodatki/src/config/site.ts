const url = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100").replace(/\/$/, "");

export const siteConfig = {
  name: "InterPodatki",
  tagline: "Twoja księgowość. Większa kontrola nad biznesem.",
  altTagline: "Finanse uporządkowane. Biznes gotowy na więcej.",
  description:
    "InterPodatki – demonstracyjny serwis biura rachunkowego: księgowość JDG i spółek, obsługa podatkowa, kadry i płace oraz kalkulator miesięcznego abonamentu.",
  url,
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  /** Dane kontaktowe są wyłącznie demonstracyjne – domena .example jest zarezerwowana i nie przyjmuje poczty. */
  contact: {
    email: "kontakt@interpodatki.example",
    phoneDisplay: "+48 000 000 000",
    hours: "pon.–pt., 9:00–17:00 (przykładowe godziny)",
    city: "Polska – adres zostanie uzupełniony",
  },
  agency: "ComputerIT",
};

export type NavItem = { href: string; label: string; description?: string };

export const serviceNav: NavItem[] = [
  { href: "/ksiegowosc-jdg", label: "Księgowość dla JDG", description: "Jednoosobowe działalności i freelancerzy B2B" },
  { href: "/ksiegowosc-spolki", label: "Księgowość dla spółek", description: "Spółki z o.o., osobowe i akcyjne" },
  { href: "/doradztwo-podatkowe", label: "Obsługa podatkowa", description: "Wsparcie uprawnionego doradcy podatkowego" },
  { href: "/kadry-place", label: "Kadry i płace", description: "Listy płac i dokumentacja pracownicza" },
];

export const mainNav: NavItem[] = [
  { href: "/cennik", label: "Cennik" },
  { href: "/kalkulator", label: "Kalkulator" },
  { href: "/baza-wiedzy", label: "Baza wiedzy" },
  { href: "/o-nas", label: "O firmie" },
  { href: "/kontakt", label: "Kontakt" },
];

export const legalNav: NavItem[] = [
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  { href: "/regulamin", label: "Regulamin (demo)" },
  { href: "/cookies", label: "Pliki cookies" },
];
