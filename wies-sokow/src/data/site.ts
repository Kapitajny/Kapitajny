const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const site = {
  name: "Wieś Soków",
  url: rawUrl && /^https?:\/\//.test(rawUrl) ? rawUrl.replace(/\/$/, "") : "http://localhost:3200",
  description:
    "Wieś Soków tłoczy soki z jabłek i gruszek i sprzedaje je bezpośrednio, w opakowaniach 3 i 5 litrów z kranikiem.",
  /** Projekt demonstracyjny: indeksowanie włącza się świadomie zmienną środowiskową. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  /** Adres i dane kontaktowe są fikcyjne. Nie renderujemy ich jako linków tel:/mailto:. */
  contact: {
    /* Adres wymyślony na potrzeby demonstracji (prawdziwy jest tylko kod pocztowy Grójca). */
    street: "ul. Tłoczniowa 7",
    postalCode: "05-600",
    city: "Grójec",
    phone: "+48 500 600 700",
    email: "kontakt@wies-sokow.example",
  },
  nav: [
    { href: "/", label: "Strona główna" },
    { href: "/o-nas", label: "O nas" },
    { href: "/produkcja", label: "Nasza produkcja" },
    { href: "/sklep", label: "Sklep" },
    { href: "/kontakt", label: "Kontakt" },
  ],
  legal: [
    { href: "/regulamin", label: "Regulamin sklepu" },
    { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
    { href: "/dostawa-i-platnosci", label: "Regulamin dostawy i płatności" },
  ],
} as const;
