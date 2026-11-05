export interface OpeningHours {
  /** Etykieta dni widoczna na stronie, np. „Pon.–czw.” */
  label: string;
  /** Dni w formacie schema.org */
  days: string[];
  opens: string;
  closes: string;
}

export interface Location {
  slug: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  phone: { display: string; href: string };
  hours: OpeningHours[];
  image: { src: string; alt: string };
  /** Krótki opis lokalu na podstronę. */
  intro: string;
  features: string[];
  mapQuery: string;
}

const MON_THU = ["Monday", "Tuesday", "Wednesday", "Thursday"];
const FRI_SAT = ["Friday", "Saturday"];

export const LOCATIONS: Location[] = [
  {
    slug: "warszawa",
    city: "Warszawa",
    district: "Śródmieście",
    street: "ul. Marszałkowska 25",
    postalCode: "00-628 Warszawa",
    phone: { display: "+48 22 555 12 35", href: "tel:+48225551235" },
    hours: [
      { label: "Pon.–czw.", days: MON_THU, opens: "11:00", closes: "22:00" },
      { label: "Pt.–sob.", days: FRI_SAT, opens: "11:00", closes: "24:00" },
      { label: "Niedziela", days: ["Sunday"], opens: "12:00", closes: "22:00" },
    ],
    image: {
      src: "/images/warszawa.jpg",
      alt: "Wnętrze lokalu BUŁA przy Marszałkowskiej: musztardowa lada z kafli, otwarta kuchnia z blachą i drewniane hokery",
    },
    intro: "Nasz pierwszy stały adres. Otwarta kuchnia z dwiema blachami do smashowania, sala na 48 osób i okno odbioru zamówień na wynos od strony ulicy.",
    features: ["48 miejsc przy stolikach", "Okno odbioru na wynos", "Sezonowy ogródek", "Płatność kartą i BLIK"],
    mapQuery: "ul. Marszałkowska 25, 00-628 Warszawa",
  },
  {
    slug: "grodzisk-mazowiecki",
    city: "Grodzisk Mazowiecki",
    district: "Centrum",
    street: "ul. 11 Listopada 12",
    postalCode: "05-825 Grodzisk Mazowiecki",
    phone: { display: "+48 22 555 12 36", href: "tel:+48225551236" },
    hours: [
      { label: "Pon.–czw.", days: MON_THU, opens: "11:00", closes: "21:00" },
      { label: "Pt.–sob.", days: FRI_SAT, opens: "11:00", closes: "22:00" },
      { label: "Niedziela", days: ["Sunday"], opens: "12:00", closes: "21:00" },
    ],
    image: {
      src: "/images/grodzisk.jpg",
      alt: "Bar przy oknie w lokalu BUŁA w Grodzisku: wysokie hokery i blacha świeżo upieczonych bułek ziemniaczanych",
    },
    intro: "Mniejszy, sąsiedzki lokal kilka kroków od centrum. Tutaj pieczemy bułki dla obu restauracji i testujemy nowe pozycje, zanim trafią do karty.",
    features: ["28 miejsc, w tym bar przy oknie", "Własna piekarnia bułek", "Parking przy ulicy", "Płatność kartą i BLIK"],
    mapQuery: "ul. 11 Listopada 12, 05-825 Grodzisk Mazowiecki",
  },
];

export function getLocation(slug: string) {
  return LOCATIONS.find((l) => l.slug === slug);
}

export function mapsDirectionsUrl(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
