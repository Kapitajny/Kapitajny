import { describe, expect, it } from "vitest";
import { PRODUCTS, getProduct } from "@/data/menu";
import { formatPrice, getDefaultSelection, priceCart, priceLine } from "@/lib/pricing";

describe("katalog", () => {
  it("zawiera 10 napojów z cenami z briefu", () => {
    const prices = Object.fromEntries(PRODUCTS.map((p) => [p.name, p.basePrice / 100]));
    expect(prices).toEqual({
      Espresso: 10,
      Americano: 13,
      Cappuccino: 16,
      "Caffè Latte": 17,
      "Flat White": 17,
      Mocha: 19,
      "Espresso Macchiato": 12,
      "Iced Latte": 18,
      "Cold Brew": 18,
      "Caramel Latte": 20,
    });
  });

  it("każdy napój ma poprawną konfigurację domyślną", () => {
    for (const product of PRODUCTS) {
      const result = priceLine({ productId: product.id, options: getDefaultSelection(product), quantity: 1 });
      expect(result.ok, product.id).toBe(true);
      if (result.ok) expect(result.line.unitPrice).toBe(product.basePrice);
    }
  });

  it("napoje mleczne oferują trzy rodzaje mleka", () => {
    for (const product of PRODUCTS.filter((p) => p.categories.includes("milk"))) {
      const milk = product.options.find((o) => o.group === "milk");
      expect(milk, product.id).toBeDefined();
    }
  });
});

describe("priceLine", () => {
  const cappuccino = getProduct("cappuccino")!;

  it("dolicza dopłaty za rozmiar, mleko owsiane i dodatki", () => {
    const result = priceLine({
      productId: "cappuccino",
      options: { ...getDefaultSelection(cappuccino), size: "l", milk: "oat", extras: ["extra-shot", "vanilla"] },
      quantity: 2,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // 16 + 5 (L) + 3 (owsiane) + 4 (shot) + 3 (wanilia) = 31 zł
    expect(result.line.unitPrice).toBe(3100);
    expect(result.line.lineTotal).toBe(6200);
    expect(result.line.optionLabels.map((l) => l.replace(/\s/g, " "))).toContain("Mleko owsiane (+3,00 zł)");
  });

  it("mleko bez laktozy kosztuje +2 zł", () => {
    const result = priceLine({ productId: "cappuccino", options: { ...getDefaultSelection(cappuccino), milk: "lactose-free" }, quantity: 1 });
    expect(result.ok && result.line.unitPrice).toBe(1800);
  });

  it("używa nadpisanych dopłat dla napojów na zimno", () => {
    const icedLatte = getProduct("iced-latte")!;
    const result = priceLine({ productId: "iced-latte", options: { ...getDefaultSelection(icedLatte), size: "l" }, quantity: 1 });
    expect(result.ok && result.line.unitPrice).toBe(2200);
  });

  it("odrzuca nieistniejący produkt", () => {
    expect(priceLine({ productId: "latte-z-mlekiem-jednorożca", options: {}, quantity: 1 }).ok).toBe(false);
  });

  it("odrzuca opcję niedostępną dla danego napoju", () => {
    const espresso = getProduct("espresso")!;
    expect(priceLine({ productId: "espresso", options: { ...getDefaultSelection(espresso), milk: "oat" }, quantity: 1 }).ok).toBe(false);
    expect(priceLine({ productId: "espresso", options: { ...getDefaultSelection(espresso), size: "l" }, quantity: 1 }).ok).toBe(false);
  });

  it("odrzuca dodatek spoza konfiguracji napoju i duplikaty", () => {
    const base = getDefaultSelection(cappuccino);
    expect(priceLine({ productId: "cappuccino", options: { ...base, extras: ["whipped"] }, quantity: 1 }).ok).toBe(false);
    expect(priceLine({ productId: "cappuccino", options: { ...base, extras: ["vanilla", "vanilla"] }, quantity: 1 }).ok).toBe(false);
  });

  it("wymaga wyboru w grupach jednokrotnego wyboru", () => {
    expect(priceLine({ productId: "cappuccino", options: { milk: "cow" }, quantity: 1 }).ok).toBe(false);
  });

  it("waliduje ilość", () => {
    const options = getDefaultSelection(cappuccino);
    for (const quantity of [0, -1, 1.5, 11, Number.NaN]) {
      expect(priceLine({ productId: "cappuccino", options, quantity }).ok, String(quantity)).toBe(false);
    }
  });

  it("ten sam wybór w innej kolejności daje ten sam klucz pozycji", () => {
    const base = getDefaultSelection(cappuccino);
    const a = priceLine({ productId: "cappuccino", options: { ...base, extras: ["vanilla", "extra-shot"] }, quantity: 1 });
    const b = priceLine({ productId: "cappuccino", options: { ...base, extras: ["extra-shot", "vanilla"] }, quantity: 1 });
    expect(a.ok && b.ok && a.line.key === b.line.key).toBe(true);
  });
});

describe("priceCart", () => {
  it("scala identyczne pozycje i sumuje koszyk", () => {
    const espresso = getDefaultSelection(getProduct("espresso")!);
    const result = priceCart([
      { productId: "espresso", options: espresso, quantity: 1 },
      { productId: "espresso", options: espresso, quantity: 2 },
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.lines).toHaveLength(1);
    expect(result.total).toBe(3000);
  });

  it("odrzuca pusty koszyk i przekroczenie limitu napojów", () => {
    expect(priceCart([]).ok).toBe(false);
    const espresso = getDefaultSelection(getProduct("espresso")!);
    const cappuccino = getDefaultSelection(getProduct("cappuccino")!);
    const americano = getDefaultSelection(getProduct("americano")!);
    expect(
      priceCart([
        { productId: "espresso", options: espresso, quantity: 10 },
        { productId: "cappuccino", options: cappuccino, quantity: 10 },
        { productId: "americano", options: americano, quantity: 1 },
      ]).ok,
    ).toBe(false);
  });
});

describe("formatPrice", () => {
  it("formatuje kwoty po polsku", () => {
    expect(formatPrice(1600).replace(/\s/g, " ")).toBe("16,00 zł");
    expect(formatPrice(1600, { compact: true }).replace(/\s/g, " ")).toBe("16 zł");
    expect(formatPrice(1650, { compact: true }).replace(/\s/g, " ")).toBe("16,50 zł");
  });
});
