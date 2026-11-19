/**
 * Dane studia. ★ Pola oznaczone `demo: true` są przykładowe i muszą zostać potwierdzone
 * przez właściciela przed publikacją strony (patrz README.md → „Dane do uzupełnienia”).
 */
export const site = {
  name: "RIFT Studio",
  shortName: "RIFT",
  foundingYear: 2013,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  address: {
    demo: true,
    street: "ul. Bolesława Prusa 12",
    postalCode: "05-800",
    city: "Pruszków",
    region: "mazowieckie",
    country: "PL",
    /** Przybliżone współrzędne centrum Pruszkowa – zaktualizuj po potwierdzeniu adresu. */
    geo: { lat: 52.1705, lng: 20.8118 },
  },

  contact: {
    demo: true,
    phone: "+48 22 000 00 00",
    phoneHref: "tel:+48220000000",
    email: "studio@riftstudio.pl",
  },

  /**
   * Media społecznościowe. Pusty `url` = link jeszcze nie podany: ikona jest widoczna,
   * ale nie prowadzi do cudzego profilu.
   */
  social: [
    { id: "instagram", label: "Instagram", url: "" },
    { id: "youtube", label: "YouTube", url: "" },
    { id: "tiktok", label: "TikTok", url: "" },
    { id: "spotify", label: "Spotify", url: "" },
  ],
} as const;

export type SocialId = (typeof site.social)[number]["id"];
