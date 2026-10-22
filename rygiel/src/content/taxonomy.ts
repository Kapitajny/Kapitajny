/**
 * Lekkie słowniki i filtry używane przez komponenty klienckie. Trzymane osobno, żeby do przeglądarki
 * nie trafiała cała treść artykułów i realizacji.
 */

export const articleCategories = {
  podstawy: "Podstawy bezpieczeństwa",
  kopie: "Kopie zapasowe",
  poczta: "Bezpieczeństwo poczty",
  dostepy: "Zarządzanie dostępami",
  phishing: "Phishing",
} as const;

export type ArticleCategory = keyof typeof articleCategories;

export function filterArticles<T extends { category: ArticleCategory }>(items: T[], category: ArticleCategory | "all"): T[] {
  return category === "all" ? items : items.filter((article) => article.category === category);
}

export const caseAreas = {
  bezpieczenstwo: "Bezpieczeństwo",
  infrastruktura: "Infrastruktura i chmura",
  kopie: "Kopie i ciągłość działania",
  "obsluga-it": "Obsługa IT",
} as const;

export const caseSectors = {
  uslugi: "Usługi profesjonalne",
  ecommerce: "Handel internetowy",
  zdrowie: "Ochrona zdrowia",
} as const;

export type CaseArea = keyof typeof caseAreas;
export type CaseSector = keyof typeof caseSectors;
export type CaseFilterState = { area: CaseArea | "all"; sector: CaseSector | "all" };

export function filterCases<T extends { area: CaseArea; sector: CaseSector }>(items: T[], filter: CaseFilterState): T[] {
  return items.filter(
    (item) => (filter.area === "all" || item.area === filter.area) && (filter.sector === "all" || item.sector === filter.sector),
  );
}

export type LayerId = "ludzie" | "urzadzenia" | "siec" | "dane";
