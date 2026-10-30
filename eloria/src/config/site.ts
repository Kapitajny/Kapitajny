/**
 * Ustawienia marki, dane kontaktowe i nawigacja.
 *
 * PROJEKT DEMONSTRACYJNY: adres, telefon, e-mail, godziny otwarcia i dane administratora
 * są przykładowe. Przed uruchomieniem dla prawdziwych pacjentów podmień je tutaj –
 * cała strona (stopka, kontakt, dane strukturalne, polityka prywatności) korzysta z tego pliku.
 */

export const siteConfig = {
  name: "ÉLORIA",
  fullName: "ÉLORIA Aesthetic Medical Clinic",
  tagline: "Piękno w harmonii z Tobą.",
  description:
    "ÉLORIA Aesthetic Medical Clinic w Warszawie – medycyna estetyczna, kosmetologia i terapie skóry. Indywidualne konsultacje i zabiegi ukierunkowane na naturalny wygląd.",
  /** Adres strony bez końcowego ukośnika – ustaw NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000",
  /** Indeksowanie w wyszukiwarkach włącz dopiero po wpisaniu prawdziwych danych kliniki. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  /**
   * Zewnętrzny system rezerwacji (np. Booksy, Versum, Medfile, ZnanyLekarz).
   * Gdy adres jest ustawiony, strona rezerwacji pokazuje przycisk do kalendarza wizyt.
   */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || null,
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  demo: true,
  agency: { name: "ComputerIT" },
  contact: {
    phoneDisplay: "+48 22 000 00 00",
    phoneHref: "tel:+48220000000",
    email: "recepcja@eloria.example",
    street: "ul. Mokotowska 00",
    postalCode: "00-000",
    city: "Warszawa",
    district: "Śródmieście",
    /** Link do wyznaczenia trasy – wyszukiwanie po tekście, bez osadzania mapy (bez plików cookie Google). */
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mokotowska%2C%20Warszawa",
  },
  hours: [
    { days: "Poniedziałek – piątek", short: "Pn–Pt", time: "9:00 – 20:00", opens: "09:00", closes: "20:00", dayCodes: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { days: "Sobota", short: "Sb", time: "9:00 – 15:00", opens: "09:00", closes: "15:00", dayCodes: ["Saturday"] },
  ],
  /** Administrator danych osobowych – do uzupełnienia w polityce prywatności. */
  controller: {
    companyName: null as string | null,
    nip: null as string | null,
    regon: null as string | null,
  },
};

export const mainNav = [
  { href: "/o-klinice", label: "O klinice" },
  { href: "/zabiegi", label: "Zabiegi" },
  { href: "/zespol", label: "Zespół" },
  { href: "/galeria", label: "Galeria" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const bookingHref = "/rezerwacja";
