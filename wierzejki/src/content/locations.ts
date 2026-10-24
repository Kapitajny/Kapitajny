/**
 * SIEĆ SPRZEDAŻY
 *
 * Hurtownie: adresy z zakładki „Hurtowy” dotychczasowej witryny wierzejki.pl.
 *
 * Sklepy firmowe: firma nie publikuje dziś kompletnej listy sklepów, więc adresy zebrano z dwóch rodzajów źródeł
 * i każdy punkt ma pole `verification`:
 *  - "wolt"    – sklep ma stronę w serwisie dostaw Wolt (aktywna oferta, adres podany przez sklep),
 *  - "katalog" – wpis w katalogu firm (Panorama Firm, pkt.pl, Targeo, Cylex); może być nieaktualny.
 * Strona pokazuje ten status przy każdym punkcie. Po otrzymaniu listy od firmy ustaw "firma" i usuń
 * punkty, których nie ma na jej liście.
 *
 * Godzin otwarcia i telefonów sklepów nie podajemy – w źródłach były niepełne lub sprzed lat.
 */

export type LocationType = "hurtownia" | "sklep";
export type Region = "mazowieckie" | "lubelskie" | "łódzkie";
export type Verification = "firma" | "wolt" | "katalog";

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
  firma: { short: "Dane firmy", long: "Adres pochodzi z materiałów firmy." },
  wolt: { short: "Sklep w serwisie Wolt", long: "Sklep ma aktywną stronę w serwisie dostaw Wolt – adres podany przez sklep." },
  katalog: { short: "Wpis z katalogu firm", long: "Adres z katalogu firm. Wpis może być nieaktualny – przed wizytą zadzwoń do sekretariatu." },
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

const RETAIL_SERVICES = ["Sprzedaż detaliczna mięsa, wędlin i wyrobów garmażeryjnych"];

/** Usuwa polskie znaki i znaki specjalne – do adresów podstron. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function store(
  city: string,
  street: string,
  region: Region,
  verification: Exclude<Verification, "firma">,
  source: string,
  extra: { postalCode?: string; storeNumber?: string; sourceUrl?: string } = {},
): SalesLocation {
  const streetName = street.replace(/^(ul\.|al\.)\s*/, "");
  return {
    slug: `sklep-${slugify(city)}-${slugify(streetName)}`,
    type: "sklep",
    name: `Sklep firmowy ${city}${extra.storeNumber ? ` ${extra.storeNumber}` : ""}`,
    city,
    street,
    region,
    services: RETAIL_SERVICES,
    mapsQuery: `${streetName}, ${extra.postalCode ? `${extra.postalCode} ` : ""}${city}`,
    verification,
    source,
    ...extra,
  };
}

const WOLT = "Strona sklepu w serwisie Wolt";
const PANORAMA = "Katalog Panorama Firm";
const TARGEO = "Katalog Targeo";
const PKT = "Katalog pkt.pl";
const CYLEX = "Katalog Cylex";

/** Sklepy firmowe – patrz komentarz na początku pliku. */
export const retailStores: SalesLocation[] = [
  // Warszawa – serwis Wolt
  store("Warszawa", "ul. Marszałkowska 27/35", "mazowieckie", "wolt", WOLT, {
    postalCode: "00-639",
    sourceUrl: "https://wolt.com/en/pol/warsaw/venue/wierzejki-zakad-misny-marszakowska",
  }),
  store("Warszawa", "al. Zjednoczenia 1", "mazowieckie", "wolt", WOLT, {
    postalCode: "01-829",
    sourceUrl: "https://wolt.com/en/pol/warsaw/venue/wierzejki-zakad-misny-zjednoczenia",
  }),
  store("Warszawa", "ul. Ludwika Kondratowicza 23", "mazowieckie", "wolt", WOLT, {
    postalCode: "03-361",
    sourceUrl: "https://wolt.com/en/pol/warsaw/venue/wierzejki-zakad-misny-kondratowicza",
  }),
  store("Warszawa", "ul. Mołdawska 7", "mazowieckie", "wolt", WOLT, {
    postalCode: "02-127",
    sourceUrl: "https://wolt.com/en/pol/warsaw/venue/wierzejki-zakad-misny-modawska",
  }),
  store("Warszawa", "ul. gen. Romana Abrahama 1B", "mazowieckie", "wolt", WOLT, {
    postalCode: "03-982",
    sourceUrl: "https://wolt.com/en/pol/warsaw/venue/wierzejki-zakad-misny-abrahama",
  }),
  // Łódź – serwis Wolt
  store("Łódź", "ul. Bratysławska 8a", "łódzkie", "wolt", WOLT, {
    postalCode: "94-032",
    sourceUrl: "https://wolt.com/en/pol/lodz/venue/zakad-misny-wierzejki-d-bratysawska",
  }),
  store("Łódź", "ul. Wojska Polskiego 2", "łódzkie", "wolt", WOLT, {
    postalCode: "91-743",
    sourceUrl: "https://wolt.com/en/pol/lodz/venue/zakad-misny-wierzejki-d-wojska-polskiego",
  }),
  store("Łódź", "ul. Zakładowa 56", "łódzkie", "wolt", WOLT, {
    postalCode: "92-402",
    sourceUrl: "https://wolt.com/en/pol/lodz/venue/zakad-misny-wierzejki-d-zakadowa",
  }),
  // Lublin – serwis Wolt
  store("Lublin", "ul. 1 Maja 26", "lubelskie", "wolt", WOLT, {
    postalCode: "20-410",
    sourceUrl: "https://wolt.com/en/pol/lublin/venue/zakad-misny-wierzejki-lublin-1-maja",
  }),
  store("Lublin", "ul. Lwowska 12", "lubelskie", "wolt", WOLT, {
    postalCode: "20-400",
    sourceUrl: "https://wolt.com/en/pol/lublin/venue/zakad-misny-wierzejki-lublin-lwowska",
  }),
  // Warszawa – katalogi firm
  store("Warszawa", "ul. Złota 67", "mazowieckie", "katalog", PANORAMA, { storeNumber: "nr 45" }),
  store("Warszawa", "ul. Tamka 16", "mazowieckie", "katalog", TARGEO, { storeNumber: "nr 87" }),
  store("Warszawa", "ul. Wałbrzyska 48", "mazowieckie", "katalog", TARGEO, { postalCode: "02-739", storeNumber: "nr 125" }),
  store("Warszawa", "ul. Wolska 46/48", "mazowieckie", "katalog", TARGEO),
  // Okolice Warszawy – katalogi firm
  store("Ząbki", "ul. Szwoleżerów 65A", "mazowieckie", "katalog", PANORAMA, { postalCode: "05-091", storeNumber: "nr 19" }),
  store("Sulejówek", "ul. Dworcowa 38B", "mazowieckie", "katalog", PKT, { postalCode: "05-070", storeNumber: "nr 84" }),
  store("Otwock", "ul. Poniatowskiego 1", "mazowieckie", "katalog", PKT, { storeNumber: "nr 24" }),
  store("Otwock", "ul. Okrzei 46", "mazowieckie", "katalog", PANORAMA, { storeNumber: "nr 23" }),
  // Siedlce – katalogi firm
  store("Siedlce", "ul. Kilińskiego 16", "mazowieckie", "katalog", PANORAMA, { postalCode: "08-110", storeNumber: "nr 16" }),
  store("Siedlce", "ul. Mazurska 2", "mazowieckie", "katalog", CYLEX, { storeNumber: "nr 17" }),
  store("Siedlce", "ul. Łukowska 16", "mazowieckie", "katalog", PKT, { storeNumber: "nr 18" }),
  store("Siedlce", "ul. Warszawska 91", "mazowieckie", "katalog", TARGEO, { storeNumber: "nr 34" }),
  store("Siedlce", "ul. Starowiejska 106", "mazowieckie", "katalog", TARGEO, { storeNumber: "nr 62" }),
];

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
