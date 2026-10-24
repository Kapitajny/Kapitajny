import { describe, expect, it } from "vitest";
import { checkEmail, checkPhone, cleanText } from "@/lib/validation/fields";
import { parseContact } from "@/lib/validation/contact";
import { parseOrderCustomer } from "@/lib/validation/order";
import { emptyQuote, parseQuote, validateQuote, QUOTE_STEPS } from "@/lib/validation/quote";

const validQuote = {
  ...emptyQuote,
  name: "Anna",
  email: "Anna@Przyklad.PL",
  businessType: "jdg",
  documents: "25",
  employees: "0",
  services: ["ksiegowosc"],
  budget: "do-1200",
  startTerm: "jak-najszybciej",
  consent: true,
};

describe("walidacja formularza wyceny", () => {
  it("akceptuje poprawne dane i normalizuje e-mail", () => {
    const r = parseQuote(validQuote);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.email).toBe("anna@przyklad.pl");
      expect(r.data.documents).toBe(25);
    }
  });

  it("zwraca polskie komunikaty dla pustego formularza", () => {
    const r = parseQuote({});
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.name).toBe("Podaj imię.");
      expect(r.errors.email).toBe("Podaj adres e-mail.");
      expect(r.errors.services).toMatch(/co najmniej jedną usługę/);
      expect(r.errors.consent).toMatch(/zgodę/);
      expect(r.errors.phone).toBeUndefined();
      expect(r.errors.company).toBeUndefined();
    }
  });

  it("waliduje tylko pola bieżącego kroku", () => {
    const errors = validateQuote(emptyQuote, QUOTE_STEPS[0].fields);
    expect(Object.keys(errors).every((k) => QUOTE_STEPS[0].fields.includes(k as never))).toBe(true);
    expect(errors.name).toBeUndefined();
  });

  it("odrzuca wartości spoza list i liczby spoza zakresu", () => {
    const r = parseQuote({ ...validQuote, businessType: "hack", documents: "-5", employees: "2.5", budget: "milion" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.businessType).toBeDefined();
      expect(r.errors.documents).toBeDefined();
      expect(r.errors.employees).toBeDefined();
      expect(r.errors.budget).toBeDefined();
    }
  });

  it("odrzuca znaczniki HTML w polach tekstowych", () => {
    const r = parseQuote({ ...validQuote, message: "<script>alert(1)</script>", name: "<b>Jan</b>" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.message).toBeDefined();
      expect(r.errors.name).toBeDefined();
    }
  });

  it("nie przyjmuje zgody innej niż true", () => {
    expect(parseQuote({ ...validQuote, consent: "true" }).ok).toBe(false);
  });
});

describe("pola wspólne", () => {
  it("sprawdza e-mail i telefon", () => {
    expect(checkEmail("jan@firma.pl")).toBeUndefined();
    expect(checkEmail("jan@firma")).toBeDefined();
    expect(checkEmail("jan firma@x.pl")).toBeDefined();
    expect(checkPhone("")).toBeUndefined();
    expect(checkPhone("+48 600 100 200")).toBeUndefined();
    expect(checkPhone("123")).toBeDefined();
    expect(checkPhone("abc123456789")).toBeDefined();
  });

  it("usuwa znaki sterujące i przycina długość", () => {
    expect(cleanText("  a\u0000b\u0007c  ", 10)).toBe("abc");
    expect(cleanText("x".repeat(50), 10)).toHaveLength(10);
    expect(cleanText(42, 10)).toBe("");
  });
});

describe("kontakt i zamówienie", () => {
  it("wymaga treści wiadomości i tematu", () => {
    const r = parseContact({ name: "Jan", email: "jan@firma.pl", message: "krótko", consent: true });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.message).toBeDefined();
      expect(r.errors.topic).toBeDefined();
    }
  });

  it("wymaga obu zgód przy zamówieniu", () => {
    const r = parseOrderCustomer({ name: "Jan", email: "jan@firma.pl", acceptTerms: true });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.acceptDemo).toBeDefined();
    expect(parseOrderCustomer({ name: "Jan", email: "jan@firma.pl", acceptTerms: true, acceptDemo: true }).ok).toBe(true);
  });
});
