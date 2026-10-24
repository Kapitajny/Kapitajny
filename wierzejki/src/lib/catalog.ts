import type { CategoryId, ProductGroup } from "@/content/products";
import { normalizeForSearch } from "./format";

export interface GroupFilter {
  category: CategoryId | "all";
  channel: ProductGroup["channels"][number] | "all";
  query: string;
}

/** Filtruje grupy asortymentowe po kategorii, kanale sprzedaży i frazie (nazwa, opis, przykłady). */
export function filterGroups(groups: ProductGroup[], filter: GroupFilter): ProductGroup[] {
  const terms = normalizeForSearch(filter.query).split(/\s+/).filter(Boolean);
  return groups.filter((group) => {
    if (filter.category !== "all" && group.category !== filter.category) return false;
    if (filter.channel !== "all" && !group.channels.includes(filter.channel)) return false;
    if (terms.length === 0) return true;
    const haystack = normalizeForSearch([group.name, group.description, ...group.examples].join(" "));
    return terms.every((t) => haystack.includes(t));
  });
}
