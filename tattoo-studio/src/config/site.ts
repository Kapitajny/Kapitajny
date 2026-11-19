/**
 * DANE STUDIA — jedno miejsce do uzupełnienia przed publikacją.
 *
 * Puste pola (`""`) nie są nigdzie renderowane jako linki ani przyciski —
 * w ich miejscu strona pokazuje dyskretną informację „do uzupełnienia”.
 * Teksty interfejsu są w słownikach `src/i18n/dictionaries/`.
 */

export const siteConfig = {
  /**
   * ROBOCZA NAZWA. Brief podaje nazwę jako [NAZWA STUDIA] — „SUMI” (墨, jap. tusz)
   * to nazwa robocza. Zmień ją tutaj, a zmieni się w całym serwisie (w obu językach).
   */
  name: "SUMI",
  /** Znak w pieczęci (hanko). Dopasuj do nazwy studia albo zostaw 墨 (tusz). */
  seal: "墨",
  /**
   * Hasło marki — element identyfikacji, celowo w tej samej (angielskiej) formie w obu wersjach językowych,
   * oznaczone atrybutem lang="en". Aby używać polskiego hasła w wersji polskiej, zmień `taglineByLocale.pl`.
   */
  tagline: "JAPANESE TATTOO ART — WARSAW, POLAND.",
  taglineByLocale: { pl: "", en: "" } as Record<"pl" | "en", string>,
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
    /** Godziny pracy w obu językach, np. pl: „Wt–Sob, 11:00–19:00”, en: „Tue–Sat, 11:00–19:00” */
    hours: { pl: "", en: "" } as Record<"pl" | "en", string>,
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

/** Sekcje strony głównej w kolejności nawigacji (etykiety w słownikach: `nav.items`). */
export const NAV_ITEMS = [
  { id: "top", icon: "torii" },
  { id: "gallery", icon: "frames" },
  { id: "about", icon: "enso" },
  { id: "specialties", icon: "brush" },
  { id: "reviews", icon: "voice" },
  { id: "pricing", icon: "ruler" },
  { id: "faq", icon: "question" },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"];
export type NavIcon = (typeof NAV_ITEMS)[number]["icon"];
