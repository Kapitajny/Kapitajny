import type { LocationType, Region, SalesLocation } from "@/content/locations";
import { normalizeForSearch } from "./format";

export interface LocationFilter {
  query: string;
  type: LocationType | "all";
  region: Region | "all";
  /** Dokładna nazwa miejscowości z szybkiego wyboru albo "all". */
  city: string;
}

export const EMPTY_FILTER: LocationFilter = { query: "", type: "all", region: "all", city: "all" };

export function isFilterActive(filter: LocationFilter): boolean {
  return filter.query.trim() !== "" || filter.type !== "all" || filter.region !== "all" || filter.city !== "all";
}

/**
 * Wyszukiwanie punktów po mieście, ulicy, kodzie pocztowym, numerze sklepu i nazwie –
 * bez względu na wielkość liter i polskie znaki. Wyniki: alfabetycznie po mieście, w mieście najpierw hurtownie.
 */
export function searchLocations(locations: SalesLocation[], filter: LocationFilter): SalesLocation[] {
  const terms = normalizeForSearch(filter.query).split(/\s+/).filter(Boolean);
  return locations
    .filter((l) => filter.type === "all" || l.type === filter.type)
    .filter((l) => filter.region === "all" || l.region === filter.region)
    .filter((l) => filter.city === "all" || l.city === filter.city)
    .filter((l) => {
      if (terms.length === 0) return true;
      const haystack = normalizeForSearch(`${l.name} ${l.city} ${l.street} ${l.postalCode ?? ""} ${l.storeNumber ?? ""}`);
      return terms.every((t) => haystack.includes(t));
    })
    .sort(
      (a, b) =>
        a.city.localeCompare(b.city, "pl") ||
        (a.type === b.type ? 0 : a.type === "hurtownia" ? -1 : 1) ||
        a.street.localeCompare(b.street, "pl"),
    );
}

/** Wyniki pogrupowane po miejscowości, w kolejności z `searchLocations`. */
export function groupByCity(locations: SalesLocation[]): { city: string; items: SalesLocation[] }[] {
  const groups: { city: string; items: SalesLocation[] }[] = [];
  for (const l of locations) {
    const last = groups[groups.length - 1];
    if (last && last.city === l.city) last.items.push(l);
    else groups.push({ city: l.city, items: [l] });
  }
  return groups;
}

/** Miejscowości z liczbą punktów – od największej liczby, przy remisie alfabetycznie. */
export function citySummary(locations: SalesLocation[]): { city: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const l of locations) counts.set(l.city, (counts.get(l.city) ?? 0) + 1);
  return [...counts.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city, "pl"));
}

/** Polska odmiana: 1 punkt, 2–4 punkty, 5+ punktów (12–14 punktów). */
export function pluralPl(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const last = n % 10;
  const lastTwo = n % 100;
  return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? few : many;
}
