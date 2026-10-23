/**
 * ★ USTAWIENIA GABINETU – jedno miejsce na nazwę marki i dane kontaktowe.
 *
 * Pola z wartością `null` są do uzupełnienia przed publikacją. Do tego czasu strona
 * pokazuje w ich miejscu oznaczenie „do uzupełnienia” i nie wymyśla żadnych danych.
 */

export interface OpeningHours {
  /** Np. "Poniedziałek–piątek". */
  days: string;
  /** Np. "8:00–20:00" albo "nieczynne". `null` = do uzupełnienia. */
  hours: string | null;
}

export const siteConfig = {
  /** Nazwa marki – zmiana tutaj aktualizuje logo, tytuły stron, stopkę i metadane. */
  name: "REHABILITIS",
  /** Krótki opis pod logo. */
  descriptor: "Fizjoterapia i rehabilitacja",
  /** Miasto do lokalnego SEO i nagłówków, np. "Gdańsk". `null` = nie pokazujemy. */
  city: null as string | null,
  description:
    "Gabinet rehabilitacji i fizjoterapii. Indywidualnie dopasowana fizjoterapia, rehabilitacja ortopedyczna, rehabilitacja po urazach i pooperacyjna oraz masaż leczniczy.",
  /** Adres strony bez końcowego ukośnika – ustaw NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000",
  /** Indeksowanie w wyszukiwarkach włącz dopiero po uzupełnieniu prawdziwych danych. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",

  contact: {
    /** Numer w formacie do wyświetlenia, np. "+48 600 000 000". */
    phone: null as string | null,
    email: null as string | null,
  },

  address: {
    street: null as string | null,
    postalCode: null as string | null,
    city: null as string | null,
    /** Dodatkowa wskazówka dojazdu, np. "II piętro, wejście od podwórza". */
    note: null as string | null,
  },

  openingHours: [
    { days: "Poniedziałek–piątek", hours: null },
    { days: "Sobota", hours: null },
    { days: "Niedziela", hours: null },
  ] as OpeningHours[],

  /**
   * System rezerwacji online (np. kalendarz w zewnętrznym serwisie).
   * Ustaw NEXT_PUBLIC_BOOKING_URL – przyciski „Umów wizytę” zaczną prowadzić do kalendarza.
   * Bez niego prowadzą do formularza kontaktowego (prośba o kontakt, a nie rezerwacja).
   */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || null,

  /** Dane administratora strony i danych osobowych (stopka, polityka prywatności). */
  company: {
    legalName: null as string | null,
    nip: null as string | null,
    regon: null as string | null,
  },
};

export const mainNav = [
  { href: "/", label: "Strona główna" },
  { href: "/uslugi", label: "Usługi" },
  { href: "/o-gabinecie", label: "O gabinecie" },
  { href: "/cennik", label: "Cennik" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const legalNav = [
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  { href: "/cookies", label: "Pliki cookies" },
] as const;

/** Pełny adres w jednej linii albo `null`, jeśli brakuje którejś części. */
export function formatAddress(): string | null {
  const { street, postalCode, city } = siteConfig.address;
  if (!street || !postalCode || !city) return null;
  return `${street}, ${postalCode} ${city}`;
}

/** Numer telefonu w formacie do linku `tel:`. */
export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Czy brakuje danych niezbędnych do publikacji (pokazujemy wtedy pasek „wersja robocza”). */
export function isDraft(): boolean {
  return !siteConfig.contact.phone || !siteConfig.contact.email || !formatAddress() || siteConfig.openingHours.some((h) => h.hours === null);
}
