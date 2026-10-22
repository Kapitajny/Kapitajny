/**
 * Podstawowe dane serwisu. Studio „Swoboda” jest marką fikcyjną (projekt do portfolio):
 * adres, telefon i e-mail są celowo demonstracyjne – podmień je na prawdziwe przed publikacją.
 */

export interface SocialLink {
  label: string;
  href: string;
}

export const siteConfig = {
  name: "Swoboda",
  fullName: "Swoboda – studio tańca",
  tagline: "Tańcz po swojemu",
  description:
    "Swoboda to kameralne studio tańca dla dorosłych, którzy chcą zacząć bez presji: taniec współczesny, hip-hop, balet, high heels i zajęcia od zera. Umów lekcję próbną.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Indeksowanie w wyszukiwarkach włączamy dopiero po uzupełnieniu prawdziwych danych. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",

  contact: {
    // Dane demonstracyjne – numer i domena celowo nie należą do nikogo (domena .example jest zarezerwowana).
    phoneDisplay: "+48 000 000 000",
    phoneHref: "tel:+48000000000",
    email: "kontakt@swoboda-studio.example",
    street: "ul. Przykładowa 12",
    city: "00-000 Kraków",
    hours: [
      { days: "Poniedziałek – piątek", time: "10:00 – 21:00" },
      { days: "Sobota", time: "9:00 – 14:00" },
    ],
  },

  /** Profile społecznościowe – uzupełnij, gdy powstaną. Puste linki nie są wyświetlane. */
  social: [] as SocialLink[],

  nav: [
    { href: "/#zajecia", label: "Zajęcia" },
    { href: "/#grafik", label: "Grafik" },
    { href: "/#instruktorzy", label: "Instruktorzy" },
    { href: "/#cennik", label: "Cennik" },
    { href: "/#studio", label: "Studio" },
    { href: "/#faq", label: "FAQ" },
    { href: "/#kontakt", label: "Kontakt" },
  ],

  legal: [
    { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
    { href: "/regulamin", label: "Regulamin" },
  ],
} as const;
