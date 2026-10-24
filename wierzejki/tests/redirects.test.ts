import { describe, expect, it } from "vitest";
import { legacyRedirects } from "@/content/sources";
import { categories } from "@/content/products";

const routes = ["/kontakt", "/o-firmie/historia", "/dla-biznesu", "/siec-sprzedazy", "/kariera", "/produkty", ...categories.map((c) => `/produkty/${c.slug}`)];

describe("legacyRedirects", () => {
  it("prowadzą wyłącznie do istniejących podstron", () => {
    for (const target of Object.values(legacyRedirects)) expect(routes).toContain(target);
  });
});
