/**
 * SIEĆ SPRZEDAŻY
 *
 * Hurtownie: adresy z zakładki „Hurtowy” dotychczasowej witryny wierzejki.pl.
 * Kodów pocztowych, godzin otwarcia i telefonów bezpośrednich nie podajemy – w dostępnych źródłach
 * były niespójne. Do czasu potwierdzenia kontakt prowadzi przez Dział Zbytu.
 *
 * Sklepy firmowe: firma prowadzi sieć sklepów, ale nie udało się pozyskać aktualnej, kompletnej listy
 * (katalogi internetowe zawierają wpisy sprzed lat). Lista jest pusta, a wyszukiwarka pokazuje uczciwy
 * komunikat. Aby ją uzupełnić, dodaj obiekty do `retailStores` – reszta strony zadziała bez zmian.
 */

export type LocationType = "hurtownia" | "sklep";

export interface SalesLocation {
  slug: string;
  type: LocationType;
  name: string;
  city: string;
  /** Miejscownik do zdań typu „hurtownia w Siedlcach”. */
  cityLocative: string;
  street: string;
  postalCode?: string;
  region: "lubelskie" | "mazowieckie";
  /** Zakres działalności punktu – wyłącznie, jeśli wynika ze źródła. */
  services: string[];
  phone?: string;
  hours?: { label: string; value: string }[];
  /** Fraza wyszukiwania w Mapach Google (bez współrzędnych – nie mamy ich zweryfikowanych). */
  mapsQuery: string;
  source: string;
}

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
    source: LEGACY_WHOLESALE,
  },
];

/** Uzupełnij po otrzymaniu aktualnej listy sklepów od firmy. */
export const retailStores: SalesLocation[] = [];

export const allLocations: SalesLocation[] = [...wholesalePoints, ...retailStores];

export const locationTypeLabels: Record<LocationType, string> = {
  hurtownia: "Hurtownia",
  sklep: "Sklep firmowy",
};

export function getLocation(slug: string): SalesLocation | undefined {
  return allLocations.find((l) => l.slug === slug);
}
