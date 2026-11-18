import type { ServiceId } from "./services";

/**
 * ★ PROJEKTY I DANE DEMONSTRACYJNE.
 *
 * PULSO nie ma jeszcze opublikowanych realizacji. Poniższe projekty i liczby są fikcyjne i służą
 * wyłącznie do pokazania, jak wyglądają plan kampanii i raport. Na stronie są wyraźnie oznaczone
 * jako DEMO. Gdy pojawią się prawdziwe realizacje (za zgodą klientów), zastąp je tutaj
 * i ustaw `isDemo: false`.
 */

export type DemoProject = {
  id: string;
  isDemo: boolean;
  name: string;
  industry: string;
  goal: string;
  platforms: ServiceId[];
  strategy: string;
  /** Plan emisji: tygodnie 1–8, [kanał, tydzień startu, liczba tygodni]. */
  flights: [ServiceId, number, number][];
};

export const portfolio: DemoProject[] = [
  {
    id: "studio-fizjo",
    isDemo: true,
    name: "Studio fizjoterapii „Oś”",
    industry: "Usługi zdrowotne, lokalnie",
    goal: "Więcej rezerwacji pierwszej wizyty z promienia 10 km",
    platforms: ["google", "meta"],
    strategy:
      "Wyszukiwarka zbiera osoby z bólem „tu i teraz”, a Meta przypomina się mieszkańcom okolicy, którzy odwiedzili stronę i nie zarezerwowali wizyty.",
    flights: [
      ["google", 1, 8],
      ["meta", 3, 6],
    ],
  },
  {
    id: "sklep-ceramika",
    isDemo: true,
    name: "Sklep z ceramiką „Glina&Co”",
    industry: "E-commerce, wyposażenie wnętrz",
    goal: "Sprzedaż kolekcji sezonowej przy kontrolowanym koszcie zamówienia",
    platforms: ["meta", "google", "tiktok"],
    strategy:
      "TikTok pokazuje proces wypalania i buduje zainteresowanie, Meta sprzedaje z katalogu produktów, a kampanie produktowe Google zbierają osoby porównujące ceny.",
    flights: [
      ["tiktok", 1, 4],
      ["meta", 2, 7],
      ["google", 3, 6],
    ],
  },
  {
    id: "b2b-oprogramowanie",
    isDemo: true,
    name: "System do grafików pracy „Zmiana”",
    industry: "B2B, oprogramowanie",
    goal: "Zapisy na prezentację produktu od firm zatrudniających 20+ osób",
    platforms: ["google", "youtube"],
    strategy:
      "Wideo na YouTube tłumaczy w 30 sekund, jaki problem rozwiązuje system, a wyszukiwarka przejmuje firmy, które już szukają narzędzia do grafików.",
    flights: [
      ["youtube", 1, 5],
      ["google", 1, 8],
    ],
  },
];

export type DemoCaseWeek = { week: number; spend: number; clicks: number; conversions: number; revenue: number };

export type DemoCase = {
  id: string;
  isDemo: boolean;
  name: string;
  platform: ServiceId;
  objective: string;
  context: string;
  whatWeDid: string[];
  /** Cel kosztu pozyskania (CPA) w zł, z którym porównujemy wynik. */
  targetCpa: number;
  conversionLabel: string;
  weeks: DemoCaseWeek[];
};

export const cases: DemoCase[] = [
  {
    id: "case-sklep",
    isDemo: true,
    name: "Sklep z ceramiką: kampania sprzedażowa",
    platform: "meta",
    objective: "Sprzedaż w sklepie internetowym",
    context: "Przykładowa kampania katalogowa Meta przez 8 tygodni, budżet stopniowo zwiększany po pierwszych testach.",
    whatWeDid: [
      "Tydzień 1–2: test trzech grup odbiorców i czterech kreacji",
      "Tydzień 3: wyłączenie dwóch słabszych kreacji, budżet na zwycięzcę",
      "Tydzień 5: remarketing osób, które dodały produkt do koszyka",
    ],
    targetCpa: 45,
    conversionLabel: "zamówienia",
    weeks: [
      { week: 1, spend: 700, clicks: 610, conversions: 11, revenue: 2090 },
      { week: 2, spend: 700, clicks: 690, conversions: 14, revenue: 2660 },
      { week: 3, spend: 900, clicks: 940, conversions: 21, revenue: 4100 },
      { week: 4, spend: 900, clicks: 980, conversions: 24, revenue: 4560 },
      { week: 5, spend: 1100, clicks: 1180, conversions: 30, revenue: 5850 },
      { week: 6, spend: 1100, clicks: 1150, conversions: 31, revenue: 6050 },
      { week: 7, spend: 1200, clicks: 1240, conversions: 33, revenue: 6400 },
      { week: 8, spend: 1200, clicks: 1210, conversions: 34, revenue: 6630 },
    ],
  },
  {
    id: "case-fizjo",
    isDemo: true,
    name: "Studio fizjoterapii: rezerwacje z wyszukiwarki",
    platform: "google",
    objective: "Rezerwacje pierwszej wizyty",
    context: "Przykładowa kampania w wyszukiwarce Google przez 8 tygodni przy stałym budżecie dziennym.",
    whatWeDid: [
      "Tydzień 1: słowa kluczowe z nazwą dzielnicy i rodzajem dolegliwości",
      "Tydzień 3: wykluczenie zapytań o studia i kursy fizjoterapii",
      "Tydzień 6: rozszerzenie o połączenia telefoniczne z reklamy",
    ],
    targetCpa: 60,
    conversionLabel: "rezerwacje",
    weeks: [
      { week: 1, spend: 520, clicks: 240, conversions: 6, revenue: 1200 },
      { week: 2, spend: 520, clicks: 255, conversions: 7, revenue: 1400 },
      { week: 3, spend: 520, clicks: 270, conversions: 9, revenue: 1800 },
      { week: 4, spend: 520, clicks: 268, conversions: 10, revenue: 2000 },
      { week: 5, spend: 520, clicks: 281, conversions: 11, revenue: 2200 },
      { week: 6, spend: 520, clicks: 290, conversions: 13, revenue: 2600 },
      { week: 7, spend: 520, clicks: 286, conversions: 12, revenue: 2400 },
      { week: 8, spend: 520, clicks: 295, conversions: 14, revenue: 2800 },
    ],
  },
];

export type CaseTotals = {
  spend: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cpa: number;
  roas: number;
  cpc: number;
};

/** Sumy i wskaźniki liczone z danych tygodniowych, żeby liczby w tabeli zawsze się zgadzały. */
export function caseTotals(c: DemoCase): CaseTotals {
  const t = c.weeks.reduce(
    (acc, w) => ({
      spend: acc.spend + w.spend,
      clicks: acc.clicks + w.clicks,
      conversions: acc.conversions + w.conversions,
      revenue: acc.revenue + w.revenue,
    }),
    { spend: 0, clicks: 0, conversions: 0, revenue: 0 },
  );
  return {
    ...t,
    cpa: t.conversions ? t.spend / t.conversions : 0,
    roas: t.spend ? t.revenue / t.spend : 0,
    cpc: t.clicks ? t.spend / t.clicks : 0,
  };
}
