import { describe, expect, it } from "vitest";
import { formatPrice, ORDER_LIMITS, orderTotals, priceCart } from "@/lib/pricing";
import { getShippingMethod } from "@/data/shipping";
import { checkoutFieldErrors, normalizePhone, validateCheckout, validatePassword, type CheckoutRequest } from "@/lib/validation";

const line = (patch: Record<string, unknown> = {}) => ({ productId: "B01", color: "black", size: "M", quantity: 1, ...patch });

describe("wycena koszyka", () => {
  it("liczy ceny wyłącznie z katalogu", () => {
    const result = priceCart([line({ quantity: 2, unitPrice: 1 }), line({ productId: "P01", size: "L" })]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.lines[0].unitPrice).toBe(28900);
    expect(result.lines[0].lineTotal).toBe(57800);
    expect(result.subtotal).toBe(57800 + 34900);
    expect(result.itemCount).toBe(3);
  });

  it("odrzuca nieznany produkt, kolor, rozmiar i złą ilość", () => {
    expect(priceCart([line({ productId: "X99" })]).ok).toBe(false);
    expect(priceCart([line({ color: "pink" })]).ok).toBe(false);
    expect(priceCart([line({ size: "XXXL" })]).ok).toBe(false);
    expect(priceCart([line({ quantity: 0 })]).ok).toBe(false);
    expect(priceCart([line({ quantity: 1.5 })]).ok).toBe(false);
    expect(priceCart([line({ quantity: ORDER_LIMITS.maxQuantityPerLine + 1 })]).ok).toBe(false);
    expect(priceCart([]).ok).toBe(false);
    expect(priceCart("x").ok).toBe(false);
  });

  it("nie przyjmuje tego samego wariantu dwa razy", () => {
    expect(priceCart([line(), line()]).ok).toBe(false);
  });

  it("dolicza koszt dostawy", () => {
    expect(orderTotals(10000, getShippingMethod("kurier"))).toEqual({ subtotal: 10000, shipping: 1999, total: 11999 });
    expect(orderTotals(10000, getShippingMethod("punkt")).total).toBe(11499);
  });

  it("formatuje ceny po polsku", () => {
    expect(formatPrice(28900).replace(/\s/g, " ")).toBe("289,00 zł");
    expect(formatPrice(28900, { compact: true }).replace(/\s/g, " ")).toBe("289 zł");
  });
});

const validRequest = (patch: Partial<CheckoutRequest> = {}): CheckoutRequest => ({
  items: [line()],
  customer: { firstName: "Anna", lastName: "Nowak", email: "Anna@Example.com ", phone: "600 100 200" },
  address: { street: "Prosta 1/2", postalCode: "00-001", city: "Warszawa" },
  shipping: { method: "kurier" },
  acceptTerms: true,
  payment: "demo",
  idempotencyKey: "123e4567-e89b-42d3-a456-426614174000",
  ...patch,
});

describe("walidacja zamówienia", () => {
  it("przyjmuje poprawne dane i normalizuje e-mail oraz telefon", () => {
    const result = validateCheckout(validRequest());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.customer.email).toBe("anna@example.com");
    expect(result.value.customer.phone).toBe("+48600100200");
    expect(result.value.total).toBe(28900 + 1999);
  });

  it("wymaga punktu odbioru dla dostawy do punktu", () => {
    const result = validateCheckout(validRequest({ shipping: { method: "punkt" } }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.field).toBe("pickupPoint");
  });

  it("zgłasza błędy pól", () => {
    const errors = checkoutFieldErrors(validRequest({ customer: { firstName: "", lastName: "N0wak", email: "zly", phone: "123" }, address: { street: "", postalCode: "00001", city: "" }, acceptTerms: false }));
    expect(Object.keys(errors).sort()).toEqual(["acceptTerms", "city", "email", "firstName", "lastName", "phone", "postalCode", "street"]);
  });

  it("odrzuca nieznany sposób płatności i zły klucz idempotencji", () => {
    expect(validateCheckout(validRequest({ payment: "cash" })).ok).toBe(false);
    expect(validateCheckout(validRequest({ idempotencyKey: "abc" })).ok).toBe(false);
  });

  it("sprawdza telefon i hasło", () => {
    expect(normalizePhone("+48 600-100-200")).toBe("+48600100200");
    expect(normalizePhone("12345")).toBeNull();
    expect(validatePassword("krotkie1")).not.toBeNull();
    expect(validatePassword("bezcyfrbezcyfr")).not.toBeNull();
    expect(validatePassword("dobrehaslo123")).toBeNull();
  });
});
