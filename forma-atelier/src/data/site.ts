export const site = {
  name: "FORMA ATELIER",
  claim: "Przestrzeń, która ma znaczenie.",
  subclaim: "Projektujemy wnętrza, które opowiadają historię ich mieszkańców.",
  description:
    "FORMA ATELIER — pracownia architektury wnętrz z Warszawy. Projektujemy ponadczasowe apartamenty i domy: od pierwszej koncepcji po nadzór nad realizacją.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://forma-atelier.example").replace(/\/$/, ""),
  locale: "pl_PL",
  // Dane demonstracyjne: projekt pokazowy agencji ComputerIT.
  contact: {
    email: "studio@forma-atelier.example",
    phone: "+48 22 000 00 00",
    phoneHref: "+48220000000",
    street: "ul. Mokotowska 00",
    city: "00-000 Warszawa",
    hours: "pon.–pt. 9:00–17:00, spotkania po wcześniejszym umówieniu",
  },
  instagram: "https://www.instagram.com/",
  agency: { name: "ComputerIT", note: "Projekt demonstracyjny" },
} as const;

export const nav = [
  { href: "/", label: "Strona główna" },
  { href: "/o-pracowni", label: "O pracowni" },
  { href: "/realizacje", label: "Realizacje" },
  { href: "/oferta", label: "Oferta" },
  { href: "/proces", label: "Proces projektowy" },
  { href: "/kontakt", label: "Kontakt" },
] as const;
