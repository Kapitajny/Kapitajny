/**
 * DANE STUDIA — jedno miejsce do uzupełnienia przed publikacją.
 *
 * Puste pola (`""`) nie są nigdzie renderowane jako linki ani przyciski —
 * w ich miejscu strona pokazuje dyskretną informację „do uzupełnienia”.
 */

export const siteConfig = {
  /**
   * ROBOCZA NAZWA. Brief podaje nazwę jako [NAZWA STUDIA] — „SUMI” (墨, jap. tusz)
   * to tylko nazwa robocza na czas projektowania. Zmień ją tutaj, a zmieni się w całym serwisie.
   */
  name: "SUMI",
  /** Znak w pieczęci (hanko) i pionowy znak w hero. Dopasuj do nazwy studia albo zostaw 墨 (tusz). */
  seal: "墨",
  tagline: "JAPANESE TATTOO ART — WARSAW, POLAND.",
  description:
    "Studio tatuażu w Warszawie inspirowane japońską sztuką. Autorskie projekty, indywidualne konsultacje i dopracowana kompozycja — od pierwszej rozmowy po pielęgnację.",
  city: "Warszawa",

  /** Adres strony bez końcowego „/”. W produkcji ustaw NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  /** Włącz indeksowanie dopiero po uzupełnieniu prawdziwych danych. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",

  contact: {
    /** np. „ul. Przykładowa 1/2, 00-001 Warszawa” */
    address: "",
    /** np. „kontakt@twojastudio.pl” */
    email: "",
    /** np. „+48 600 000 000” */
    phone: "",
    /** np. „Wt–Sob, 11:00–19:00 (wyłącznie po umówieniu)” */
    hours: "",
    /** Link do mapy (np. Google Maps) — opcjonalnie. */
    mapUrl: "",
  },

  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },

  /** Link do miejsca, gdzie klienci mogą wystawić opinię (np. profil Google). */
  reviewsUrl: "",

  /** Dane administratora/właściciela do dokumentów prawnych. */
  legal: {
    companyName: "",
    companyAddress: "",
    nip: "",
    regon: "",
    /** Data ostatniej aktualizacji dokumentów (RRRR-MM-DD). */
    documentsUpdated: "",
  },
};

export const NAV_ITEMS = [
  { id: "top", label: "Start", href: "/#top", icon: "torii" },
  { id: "gallery", label: "Gallery", href: "/#gallery", icon: "frames" },
  { id: "about", label: "About Us", href: "/#about", icon: "enso" },
  { id: "specialties", label: "Specialties", href: "/#specialties", icon: "brush" },
  { id: "reviews", label: "Reviews", href: "/#reviews", icon: "voice" },
  { id: "pricing", label: "Pricing", href: "/#pricing", icon: "ruler" },
  { id: "faq", label: "FAQ", href: "/#faq", icon: "question" },
] as const;

export type NavIcon = (typeof NAV_ITEMS)[number]["icon"] | "book";

export const LEGAL_LINKS = [
  { label: "Regulamin", href: "/regulamin" },
  { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
] as const;
