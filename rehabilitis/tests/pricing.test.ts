import { describe, expect, it } from "vitest";
import { FIRST_VISIT, PRICE_LIST, priceForService, priceValue } from "@/data/pricing";
import { SERVICES } from "@/data/services";

describe("priceValue", () => {
  it.each([
    ["190 zł", 190],
    ["1 200 zł", 1200],
    ["od 150 zł", 150],
    ["50 min", 50],
    ["brak", 0],
  ])("%s → %d", (input, expected) => expect(priceValue(input)).toBe(expected));
});

describe("priceForService", () => {
  it("dla jednego wariantu podaje cenę i czas bez „od”", () => {
    expect(priceForService("fizjoterapia-indywidualna")).toEqual({ price: "190 zł", duration: "50 min", from: false });
  });

  it("dla kilku wariantów podaje najniższą cenę i zakres czasu", () => {
    expect(priceForService("masaz-leczniczy")).toEqual({ price: "120 zł", duration: "30–60 min", from: true });
  });

  it("zwraca null dla usługi bez ceny", () => {
    expect(priceForService("nieistniejaca")).toBeNull();
  });
});

describe("dane cennika", () => {
  it("pierwsza wizyta jest wskazana identyfikatorem, a nie pozycją", () => {
    expect(FIRST_VISIT?.id).toBe("pierwsza-wizyta");
  });

  it("każda pozycja powiązana z usługą wskazuje istniejącą usługę", () => {
    const slugs = new Set(SERVICES.map((s) => s.slug));
    for (const item of PRICE_LIST) if (item.service) expect(slugs.has(item.service)).toBe(true);
  });

  it("każda usługa ma cenę w cenniku", () => {
    for (const service of SERVICES) expect(priceForService(service.slug)).not.toBeNull();
  });
});
