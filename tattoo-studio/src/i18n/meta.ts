import type { RouteKey } from "./config";
import type { Dictionary } from "./dictionaries";

/** Tytuł strony (karta przeglądarki) dla danej trasy w danym języku. */
export function pageTitle(t: Dictionary, route: RouteKey): string {
  if (route === "home") return t.meta.title;
  return t.meta.titleTemplate.replace("%s", t.meta.pages[route].title);
}
