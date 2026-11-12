import { describe, expect, it } from "vitest";
import { formatAmount, formatPrice, plural } from "@/lib/money";
import { FREE_SHIPPING_FROM, MAX_QTY, clampQty, countItems, orderTotal, sanitizeLines, shippingCost } from "@/lib/order";

describe("formatowanie kwot", () => {
  it("pomija grosze przy pełnych złotych", () => {
    expect(formatPrice(3500)).toBe("35 zł");
    expect(formatPrice(3550)).toBe("35,50 zł");
  });
  it("w podsumowaniach zawsze pokazuje grosze", () => {
    expect(formatAmount(3500)).toBe("35,00 zł");
    expect(formatAmount(123400)).toBe("1 234,00 zł");
  });
  it("odmienia rzeczowniki", () => {
    const f = (n: number) => plural(n, "opakowanie", "opakowania", "opakowań");
    expect([1, 2, 5, 12, 22, 25].map(f)).toEqual(["opakowanie", "opakowania", "opakowań", "opakowań", "opakowania", "opakowań"]);
  });
});

describe("koszyk", () => {
  it("odrzuca nieznane produkty i scala duplikaty", () => {
    const lines = sanitizeLines([
      { slug: "sok-jablkowy-5l", qty: 1 },
      { slug: "sok-jablkowy-5l", qty: 2 },
      { slug: "nie-ma-takiego", qty: 1 },
      { slug: "sok-gruszkowy-5l", qty: 0 },
      "śmieci",
    ]);
    expect(lines).toEqual([{ slug: "sok-jablkowy-5l", qty: 3 }]);
    expect(sanitizeLines("x")).toEqual([]);
  });
  it("ogranicza ilość do dozwolonego zakresu", () => {
    expect(clampQty(0)).toBe(1);
    expect(clampQty(999)).toBe(MAX_QTY);
    expect(clampQty(2.9)).toBe(2);
    expect(clampQty(Number.NaN)).toBe(1);
  });
  it("liczy sztuki i wartość zamówienia", () => {
    const lines = [
      { slug: "sok-jablkowy-5l", qty: 2 },
      { slug: "sok-gruszkowy-5l", qty: 1 },
    ];
    expect(countItems(lines)).toBe(3);
    expect(orderTotal(lines, "kurier")).toEqual({ subtotal: 10900, shipping: 1500, total: 12400 });
    expect(orderTotal(lines, "odbior")).toEqual({ subtotal: 10900, shipping: 0, total: 10900 });
  });
  it("daje darmową dostawę od progu i nie nalicza jej dla pustego koszyka", () => {
    expect(shippingCost("kurier", FREE_SHIPPING_FROM - 1)).toBe(1500);
    expect(shippingCost("kurier", FREE_SHIPPING_FROM)).toBe(0);
    expect(orderTotal([], "kurier").total).toBe(0);
  });
});
