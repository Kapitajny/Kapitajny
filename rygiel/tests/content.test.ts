import { describe, expect, it } from "vitest";
import { articles, filterArticles, readingMinutes } from "@/content/articles";
import { caseStudies, filterCases } from "@/content/cases";
import { approachFaqCount } from "./helpers";
import { infrastructureLayers, services } from "@/content/services";
import { isInternalHref, parseInline } from "@/lib/inline-markup";
import { allRoutes } from "@/lib/routes";

const routes = new Set(allRoutes());

function textsOf(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(textsOf);
  if (value && typeof value === "object") return Object.values(value).flatMap(textsOf);
  return [];
}

describe("spójność treści", () => {
  it("slugi są unikalne i bezpieczne dla adresów URL", () => {
    for (const slugs of [articles.map((a) => a.slug), caseStudies.map((c) => c.slug), services.map((s) => s.slug)]) {
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("wszystkie linki wewnętrzne w artykułach prowadzą do istniejących stron", () => {
    const links = articles.flatMap((article) => textsOf(article.sections).flatMap((text) => parseInline(text)));
    const internal = links.filter((token) => token.type === "link" && isInternalHref(token.href));
    expect(internal.length).toBeGreaterThan(10);
    for (const token of internal) if (token.type === "link") expect(routes, token.href).toContain(token.href.split("#")[0]);
  });

  it("powiązane artykuły i usługi istnieją", () => {
    const slugs = new Set(articles.map((article) => article.slug));
    const serviceSlugs = new Set(services.map((service) => service.slug));
    for (const article of articles) {
      for (const related of article.related) expect(slugs, related).toContain(related);
      expect(article.related).not.toContain(article.slug);
      for (const service of article.services) expect(serviceSlugs).toContain(service);
    }
    for (const study of caseStudies) for (const service of study.services) expect(serviceSlugs).toContain(service);
  });

  it("artykuły mają pełną strukturę", () => {
    expect(articles.length).toBeGreaterThanOrEqual(3);
    for (const article of articles) {
      expect(article.description.length, article.slug).toBeGreaterThan(80);
      expect(article.description.length, article.slug).toBeLessThan(260);
      expect(article.sections.length).toBeGreaterThanOrEqual(4);
      expect(new Set(article.sections.map((section) => section.id)).size).toBe(article.sections.length);
      expect(readingMinutes(article)).toBeGreaterThanOrEqual(2);
    }
  });

  it("realizacje są oznaczone jako demonstracyjne i mają kompletne schematy", () => {
    expect(caseStudies.length).toBeGreaterThanOrEqual(3);
    for (const study of caseStudies) {
      expect(study.profile).toMatch(/^Fikcyjn/);
      expect(study.diagram.links.length).toBe(study.diagram.columns.length - 1);
      expect(study.criteria.length).toBeGreaterThanOrEqual(3);
      expect(study.analysis.options.some((option) => option.chosen)).toBe(true);
    }
  });

  it("treści nie zawierają wymyślonych wyników procentowych ani tekstu zastępczego", () => {
    const all = [...textsOf(articles), ...textsOf(caseStudies), ...textsOf(services)].join("\n");
    expect(all).not.toMatch(/\d+\s?%/);
    expect(all).not.toMatch(/lorem ipsum/i);
    expect(all).not.toMatch(/TODO|FIXME/);
  });

  it("każdy filar ma opis warstw przekroju i FAQ", () => {
    const layerIds = new Set(infrastructureLayers.map((layer) => layer.id));
    for (const service of services) {
      expect(Object.keys(service.layers).length).toBeGreaterThan(0);
      for (const id of Object.keys(service.layers)) expect(layerIds).toContain(id);
      expect(service.faq.length).toBeGreaterThanOrEqual(3);
    }
    expect(approachFaqCount()).toBeGreaterThanOrEqual(5);
  });
});

describe("filtry", () => {
  it("filtruje realizacje po obszarze i branży", () => {
    expect(filterCases(caseStudies, { area: "all", sector: "all" })).toHaveLength(caseStudies.length);
    expect(filterCases(caseStudies, { area: "kopie", sector: "all" }).map((c) => c.slug)).toEqual(["kopie-zapasowe-pracowni-projektowej"]);
    expect(filterCases(caseStudies, { area: "all", sector: "uslugi" })).toHaveLength(2);
    expect(filterCases(caseStudies, { area: "bezpieczenstwo", sector: "ecommerce" })).toHaveLength(0);
  });

  it("filtruje artykuły po kategorii", () => {
    expect(filterArticles(articles, "all")).toHaveLength(articles.length);
    expect(filterArticles(articles, "poczta").every((article) => article.category === "poczta")).toBe(true);
  });
});
