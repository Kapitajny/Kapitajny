export interface NavLink {
  href: string;
  label: string;
  description?: string;
}

export interface NavItem extends NavLink {
  children?: NavLink[];
}

export const mainNav: NavItem[] = [
  {
    href: "/o-firmie",
    label: "O firmie",
    children: [
      { href: "/o-firmie", label: "Kim jesteśmy", description: "Rodzinna firma z Płud, od 1991 roku" },
      { href: "/o-firmie/historia", label: "Historia", description: "Od Wierzejek do zakładu w Płudach" },
      { href: "/siec-sprzedazy", label: "Sieć sprzedaży", description: "Hurtownie i sklepy firmowe" },
    ],
  },
  {
    href: "/produkty",
    label: "Produkty",
    children: [
      { href: "/produkty/mieso", label: "Mięso", description: "Wieprzowina i wołowina" },
      { href: "/produkty/wedliny", label: "Wędliny", description: "Wędzonki, kiełbasy, wyroby blokowe" },
      { href: "/produkty/wyroby-garmazeryjne", label: "Wyroby garmażeryjne", description: "Pierogi, krokiety, naleśniki" },
      { href: "/produkty", label: "Cały asortyment", description: "Przeglądaj i filtruj grupy produktów" },
    ],
  },
  { href: "/dla-biznesu", label: "Oferta dla biznesu" },
  { href: "/jakosc-i-produkcja", label: "Nasza jakość" },
  { href: "/kariera", label: "Kariera" },
  { href: "/kontakt", label: "Kontakt" },
];

export const footerNav = {
  oferta: [
    { href: "/produkty/mieso", label: "Mięso" },
    { href: "/produkty/wedliny", label: "Wędliny" },
    { href: "/produkty/wyroby-garmazeryjne", label: "Wyroby garmażeryjne" },
    { href: "/produkty", label: "Cały asortyment" },
  ],
  biznes: [
    { href: "/dla-biznesu", label: "Oferta dla biznesu" },
    { href: "/dla-biznesu#zapytanie", label: "Zapytanie handlowe" },
    { href: "/siec-sprzedazy", label: "Hurtownie" },
    { href: "/dla-biznesu#hodowcy", label: "Dla hodowców" },
  ],
  firma: [
    { href: "/o-firmie", label: "O firmie" },
    { href: "/o-firmie/historia", label: "Historia" },
    { href: "/jakosc-i-produkcja", label: "Jakość i produkcja" },
    { href: "/kariera", label: "Kariera" },
  ],
  dokumenty: [
    { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
    { href: "/kontakt", label: "Dane firmy i kontakt" },
  ],
} satisfies Record<string, NavLink[]>;
