import { describe, expect, it } from "vitest";
import { validateCheckout } from "@/lib/validation";

const base = {
  items: ["zdrowiej-kazdego-dnia"],
  email: "Anna@Example.com ",
  emailConfirm: "anna@example.com",
  name: "  Anna   Nowak ",
  acceptTerms: true,
  digitalConsent: true,
  idempotencyKey: "0f8fad5b-d9cb-469f-a165-70867728950e",
};

describe("validateCheckout", () => {
  it("akceptuje poprawne zamówienie i liczy cenę z katalogu", () => {
    const r = validateCheckout(base);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.total).toBe(3999);
    expect(r.value.email).toBe("anna@example.com");
    expect(r.value.name).toBe("Anna Nowak");
  });

  it("ignoruje duplikaty i sumuje kilka publikacji", () => {
    const r = validateCheckout({ ...base, items: ["zdrowiej-kazdego-dnia", "zdrowe-obiady", "zdrowiej-kazdego-dnia"] });
    expect(r.ok && r.value.products.length).toBe(2);
    expect(r.ok && r.value.total).toBe(3999 + 2999);
  });

  it.each([
    [{ items: [] }, "items"],
    [{ items: ["nie-ma-takiego"] }, "items"],
    [{ email: "zly-adres" }, "email"],
    [{ emailConfirm: "inny@example.com" }, "emailConfirm"],
    [{ acceptTerms: false }, "acceptTerms"],
    [{ digitalConsent: undefined }, "digitalConsent"],
  ])("odrzuca nieprawidłowe dane %#", (patch, field) => {
    const r = validateCheckout({ ...base, ...patch });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.field).toBe(field);
  });

  it("wymaga klucza idempotencji", () => {
    expect(validateCheckout({ ...base, idempotencyKey: "x" }).ok).toBe(false);
  });
});
