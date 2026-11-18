// Usługi i ceny. Kwoty są przykładowe – służą demonstracji projektu, nie są zweryfikowanym cennikiem rynkowym.

export type ServiceSlug = "klimatyzacja" | "pompy-ciepla" | "rekuperacja" | "serwis-hvac";

export type PriceItem = {
  label: string;
  from: number;
  /** Krótkie doprecyzowanie przy cenie, np. „bez urządzenia”. */
  note?: string;
};

export type Service = {
  slug: ServiceSlug;
  name: string;
  short: string;
  description: string;
  scope: string[];
  prices: [PriceItem, PriceItem, PriceItem];
  costFactors: string;
  /** Co obejmuje cena – zdanie wyświetlane przy cenniku usługi. */
  priceIncludes: string;
  image: { src: string; alt: string; width: number; height: number };
};

export const services: Service[] = [
  {
    slug: "klimatyzacja",
    name: "Klimatyzacja",
    short: "Montaż i serwis klimatyzatorów typu split i multi-split w domach, mieszkaniach i biurach.",
    description:
      "Moc urządzenia dobieramy do powierzchni, nasłonecznienia i sposobu korzystania z pomieszczeń. Montujemy jednostki ścienne, przypodłogowe i kanałowe, a instalację uruchamiamy z pomiarami i protokołem.",
    scope: [
      "Wizja lokalna i dobór mocy urządzenia",
      "Montaż jednostki wewnętrznej i zewnętrznej",
      "Instalacja chłodnicza, elektryczna i odpływ skroplin",
      "Próba szczelności azotem i próżniowanie instalacji",
      "Uruchomienie, pomiary i instruktaż obsługi",
    ],
    prices: [
      { label: "Montaż klimatyzacji", from: 799, note: "bez urządzenia" },
      { label: "Serwis klimatyzacji", from: 299 },
      { label: "Konserwacja i czyszczenie", from: 199 },
    ],
    costFactors:
      "Długość i sposób prowadzenia instalacji, typ i moc urządzenia, wysokość montażu jednostki zewnętrznej, liczba jednostek wewnętrznych oraz konieczność wykonania przepustów w ścianach.",
    priceIncludes:
      "Cena montażu obejmuje robociznę i materiały instalacyjne. Klimatyzator nie jest wliczony – dobieramy go i wyceniamy osobno w ofercie.",
    image: {
      src: "/images/klimatyzacja-jednostka.jpg",
      alt: "Biała jednostka wewnętrzna klimatyzatora zamontowana pod sufitem jasnego pomieszczenia",
      width: 1600,
      height: 1067,
    },
  },
  {
    slug: "pompy-ciepla",
    name: "Pompy ciepła",
    short: "Powietrzne pompy ciepła do ogrzewania domu i ciepłej wody – w nowych budynkach i przy wymianie starego źródła ciepła.",
    description:
      "Zaczynamy od oszacowania zapotrzebowania budynku na ciepło i oceny istniejącej instalacji. Na tej podstawie dobieramy pompę, zasobnik i sposób współpracy z ogrzewaniem podłogowym lub grzejnikami.",
    scope: [
      "Szacunek zapotrzebowania na ciepło i dobór urządzenia",
      "Posadowienie jednostki zewnętrznej na fundamencie lub konsoli",
      "Podłączenie do instalacji c.o. i ciepłej wody użytkowej",
      "Konfiguracja sterowania i krzywej grzewczej",
      "Uruchomienie i protokół zgodny z wymaganiami producenta",
    ],
    prices: [
      { label: "Montaż pompy ciepła", from: 12900, note: "bez urządzenia" },
      { label: "Przegląd pompy ciepła", from: 399 },
      { label: "Diagnostyka i serwis", from: 299 },
    ],
    costFactors:
      "Moc i model pompy, stan istniejącej instalacji grzewczej, potrzeba zasobnika lub bufora, odległość jednostki zewnętrznej od budynku oraz zakres prac hydraulicznych i elektrycznych.",
    priceIncludes:
      "Cena montażu obejmuje robociznę i materiały instalacyjne. Pompa ciepła i zasobnik nie są wliczone – dobieramy je i wyceniamy osobno w ofercie.",
    image: {
      src: "/images/pompa-ciepla-ogrod.jpg",
      alt: "Jednostka zewnętrzna pompy ciepła na cokole przy ceglanym domu, otoczona krzewami",
      width: 1600,
      height: 1067,
    },
  },
  {
    slug: "rekuperacja",
    name: "Rekuperacja",
    short: "Wentylacja mechaniczna z odzyskiem ciepła – świeże powietrze w domu bez otwierania okien.",
    description:
      "Projektujemy rozprowadzenie kanałów, dobieramy centralę do kubatury budynku i liczby mieszkańców, a po montażu regulujemy przepływ powietrza w każdym pomieszczeniu.",
    scope: [
      "Projekt rozprowadzenia kanałów i dobór centrali",
      "Montaż centrali, kanałów, czerpni i wyrzutni",
      "Montaż anemostatów i tłumików akustycznych",
      "Regulacja i pomiar przepływów powietrza",
      "Instruktaż wymiany filtrów i obsługi sterownika",
    ],
    prices: [
      { label: "Montaż systemu rekuperacji", from: 8900, note: "bez urządzenia" },
      { label: "Serwis rekuperacji", from: 299 },
      { label: "Czyszczenie instalacji", from: 499 },
    ],
    costFactors:
      "Powierzchnia i kubatura budynku, etap budowy (stan surowy lub budynek wykończony), rodzaj kanałów, sprawność i wyposażenie centrali oraz liczba punktów nawiewnych i wywiewnych.",
    priceIncludes:
      "Cena montażu obejmuje robociznę i materiały instalacyjne. Centrala wentylacyjna nie jest wliczona – dobieramy ją i wyceniamy osobno w ofercie.",
    image: {
      src: "/images/rekuperacja-czerpnie.jpg",
      alt: "Okrągłe wyloty wentylacyjne nad czarną osłoną z lameli przy jasnej elewacji budynku",
      width: 1600,
      height: 1066,
    },
  },
  {
    slug: "serwis-hvac",
    name: "Serwis HVAC",
    short: "Przeglądy, diagnostyka i konserwacja klimatyzacji, wentylacji i pomp ciepła – także instalacji, których nie montowaliśmy.",
    /* HVAC – z ang. heating, ventilation, air conditioning: ogrzewanie, wentylacja i klimatyzacja. */
    description:
      "HVAC to ogrzewanie, wentylacja i klimatyzacja. Regularny przegląd utrzymuje sprawność urządzeń i zwykle jest warunkiem gwarancji producenta. Po każdej wizycie dostajesz protokół z wykonanymi czynnościami i wynikami pomiarów.",
    scope: [
      "Kontrola szczelności i parametrów pracy",
      "Czyszczenie wymienników, filtrów i odpływów skroplin",
      "Diagnostyka usterek i odczyt kodów błędów",
      "Wpis do karty urządzenia i protokół z pomiarami",
      "Umowy serwisowe dla firm i wspólnot mieszkaniowych",
    ],
    prices: [
      { label: "Przegląd instalacji", from: 299 },
      { label: "Diagnostyka", from: 199 },
      { label: "Konserwacja systemów", from: 249 },
    ],
    costFactors:
      "Liczba i rodzaj urządzeń, dostęp do jednostek (np. praca na wysokości), stopień zabrudzenia, konieczność uzupełnienia czynnika chłodniczego oraz koszt części zamiennych.",
    priceIncludes: "Cena obejmuje wizytę i pracę serwisanta. Części zamienne i uzupełnienie czynnika chłodniczego rozliczamy osobno.",
    image: {
      src: "/images/serwis-technik.jpg",
      alt: "Serwisant podłącza manometry do jednostki zewnętrznej klimatyzacji na dachu budynku",
      width: 1600,
      height: 857,
    },
  },
];

// Polska norma domyślnie nie grupuje liczb czterocyfrowych („8900”); w cenniku chcemy „8 900”.
const priceFormat = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0, useGrouping: "always" });

/** „12 900 zł” – z twardą spacją, żeby kwota nie łamała się między wierszami. */
export function formatPrice(value: number): string {
  return `${priceFormat.format(value).replace(/\s/g, " ")} zł`;
}

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

/** Zapis ceny z doprecyzowaniem: „od 799 zł, bez urządzenia”. */
export function formatPriceItem(item: PriceItem): string {
  return `od ${formatPrice(item.from)}${item.note ? `, ${item.note}` : ""}`;
}

export const PRICE_NOTE =
  "Podane ceny mają charakter orientacyjny. Ostateczna wycena zależy od rodzaju instalacji, zakresu prac, zastosowanych urządzeń i warunków technicznych.";
