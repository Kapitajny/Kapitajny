import type { SalesLocation } from "@/content/locations";
import { normalizeForSearch } from "./format";

/** Kotwica sekcji miasta w spisie punktów, np. "Łódź" → "punkty-lodz". */
export function cityAnchor(city: string): string {
  return `punkty-${normalizeForSearch(city).replace(/[^a-z0-9]+/g, "-")}`;
}

/** Miejscowości z liczbą punktów – od największej liczby, przy remisie alfabetycznie. */
export function citySummary(locations: SalesLocation[]): { city: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const l of locations) counts.set(l.city, (counts.get(l.city) ?? 0) + 1);
  return [...counts.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city, "pl"));
}

/**
 * Spis punktów pogrupowany po miejscowościach: miasta w kolejności z `citySummary`
 * (najwięcej punktów najpierw), w mieście najpierw hurtownie, potem sklepy alfabetycznie po ulicy.
 */
export function groupByCity(locations: SalesLocation[]): { city: string; items: SalesLocation[] }[] {
  return citySummary(locations).map(({ city }) => ({
    city,
    items: locations
      .filter((l) => l.city === city)
      .sort((a, b) => (a.type === b.type ? 0 : a.type === "hurtownia" ? -1 : 1) || a.street.localeCompare(b.street, "pl")),
  }));
}

/** Polska odmiana: 1 punkt, 2–4 punkty, 5+ punktów (12–14 punktów). */
export function pluralPl(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const last = n % 10;
  const lastTwo = n % 100;
  return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? few : many;
}
