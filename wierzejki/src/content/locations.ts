/**
 * SIEĆ SPRZEDAŻY
 *
 * Hurtownie: adresy z zakładki „Hurtowy” dotychczasowej witryny wierzejki.pl.
 * Sklepy firmowe: lista pusta (patrz `retailStores`) – adres najbliższego sklepu podaje sekretariat.
 * Godzin otwarcia i telefonów punktów nie podajemy, dopóki nie potwierdzi ich firma.
 */

export type LocationType = "hurtownia" | "sklep";
export type Region = "mazowieckie" | "lubelskie" | "łódzkie";
export type Verification = "firma";

export interface SalesLocation {
  slug: string;
  type: LocationType;
  name: string;
  city: string;
  /** Miejscownik do zdań typu „hurtownia w Siedlcach”. */
  cityLocative?: string;
  street: string;
  postalCode?: string;
  /** Numer sklepu firmowego, jeśli podaje go źródło (np. „nr 45”). */
  storeNumber?: string;
  region: Region;
  /** Zakres działalności punktu – wyłącznie, jeśli wynika ze źródła. */
  services: string[];
  phone?: string;
  hours?: { label: string; value: string }[];
  /** Fraza wyszukiwania w Mapach Google (bez współrzędnych – nie mamy ich zweryfikowanych). */
  mapsQuery: string;
  verification: Verification;
  source: string;
  sourceUrl?: string;
}

export const verificationLabels: Record<Verification, { short: string; long: string }> = {
  firma: { short: "Dane firmy", long: "Adres pochodzi z dotychczasowej strony firmy i wymaga potwierdzenia przed publikacją." },
};

const LEGACY_WHOLESALE = "Zakładka „Hurtowy” na dotychczasowej stronie firmy";

export const wholesalePoints: SalesLocation[] = [
  {
    slug: "hurtownia-siedlce",
    type: "hurtownia",
    name: "Hurtownia Siedlce",
    city: "Siedlce",
    cityLocative: "Siedlcach",
    street: "ul. Młynarska 15",
    region: "mazowieckie",
    services: ["Rozbiór i porcjowanie mięsa", "Sprzedaż hurtowa mięsa i wędlin"],
    mapsQuery: "Młynarska 15, Siedlce",
    verification: "firma",
    source: LEGACY_WHOLESALE,
  },
  {
    slug: "hurtownia-lukow",
    type: "hurtownia",
    name: "Hurtownia Łuków",
    city: "Łuków",
    cityLocative: "Łukowie",
    street: "ul. Piłsudskiego 20",
    region: "lubelskie",
    services: ["Sprzedaż hurtowa"],
    mapsQuery: "Piłsudskiego 20, Łuków",
    verification: "firma",
    source: LEGACY_WHOLESALE,
  },
  {
    slug: "hurtownia-otwock",
    type: "hurtownia",
    name: "Hurtownia Otwock",
    city: "Otwock",
    cityLocative: "Otwocku",
    street: "ul. Majowa 77",
    region: "mazowieckie",
    services: ["Sprzedaż hurtowa"],
    mapsQuery: "Majowa 77, Otwock",
    verification: "firma",
    source: LEGACY_WHOLESALE,
  },
  {
    slug: "hurtownia-warszawa",
    type: "hurtownia",
    name: "Hurtownia Warszawa",
    city: "Warszawa",
    cityLocative: "Warszawie",
    street: "ul. Cynamonowa 2a",
    region: "mazowieckie",
    services: ["Sprzedaż hurtowa"],
    mapsQuery: "Cynamonowa 2a, Warszawa",
    verification: "firma",
    source: LEGACY_WHOLESALE,
  },
];

/**
 * Sklepy firmowe – celowo puste. Firma nie publikuje dziś listy sklepów, a adresy z katalogów internetowych
 * bywają nieaktualne, więc strona odsyła po adres najbliższego sklepu do sekretariatu.
 * Po otrzymaniu listy od firmy dodaj tu obiekty `SalesLocation` z `type: "sklep"` i `verification: "firma"`.
 */
export const retailStores: SalesLocation[] = [];

export const allLocations: SalesLocation[] = [...wholesalePoints, ...retailStores];

export const locationTypeLabels: Record<LocationType, string> = {
  hurtownia: "Hurtownia",
  sklep: "Sklep firmowy",
};

export const regionLabels: Record<Region, string> = {
  mazowieckie: "Mazowieckie",
  lubelskie: "Lubelskie",
  łódzkie: "Łódzkie",
};

export function getLocation(slug: string): SalesLocation | undefined {
  return allLocations.find((l) => l.slug === slug);
}
