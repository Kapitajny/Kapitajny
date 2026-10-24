import type { LocationType, SalesLocation } from "@/content/locations";
import { normalizeForSearch } from "./format";

export interface LocationFilter {
  query: string;
  type: LocationType | "all";
  region: SalesLocation["region"] | "all";
}

/** Wyszukiwanie punktów po mieście, ulicy i nazwie – bez względu na wielkość liter i polskie znaki. */
export function searchLocations(locations: SalesLocation[], filter: LocationFilter): SalesLocation[] {
  const terms = normalizeForSearch(filter.query).split(/\s+/).filter(Boolean);
  return locations
    .filter((l) => filter.type === "all" || l.type === filter.type)
    .filter((l) => filter.region === "all" || l.region === filter.region)
    .filter((l) => {
      if (terms.length === 0) return true;
      const haystack = normalizeForSearch(`${l.name} ${l.city} ${l.street} ${l.postalCode ?? ""}`);
      return terms.every((t) => haystack.includes(t));
    })
    .sort((a, b) => a.city.localeCompare(b.city, "pl"));
}
