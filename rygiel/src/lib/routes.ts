import { articles } from "@/content/articles";
import { caseStudies } from "@/content/cases";
import { services } from "@/content/services";

/** Wszystkie publiczne adresy serwisu – źródło dla sitemap.xml i testów linków. */
export const staticRoutes = [
  "/",
  "/uslugi",
  "/realizacje",
  "/baza-wiedzy",
  "/o-nas",
  "/kontakt",
  "/polityka-prywatnosci",
  "/polityka-cookies",
  "/regulamin",
] as const;

export function allRoutes(): string[] {
  return [
    ...staticRoutes,
    ...services.map((service) => service.href),
    ...caseStudies.map((study) => `/realizacje/${study.slug}`),
    ...articles.map((article) => `/baza-wiedzy/${article.slug}`),
  ];
}
