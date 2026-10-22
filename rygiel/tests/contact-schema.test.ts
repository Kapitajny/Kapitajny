import { describe, expect, it } from "vitest";
import { cleanText, inputFromFormData, validateContact, validateField, type ContactInput } from "@/lib/contact/schema";

const valid: ContactInput = {
  name: "Anna",
  email: "anna@firma.pl",
  company: "",
  service: "cyberbezpieczenstwo",
  scope: "",
  message: "Chcemy sprawdzić konfigurację poczty w firmie.",
  consent: true,
};

describe("validateContact", () => {
  it("akceptuje poprawne dane i normalizuje je", () => {
    const result = validateContact({ ...valid, email: "  Anna@Firma.PL ", company: "  " });
    expect(result).toEqual({
      ok: true,
      data: { name: "Anna", email: "anna@firma.pl", company: null, service: "cyberbezpieczenstwo", scope: null, message: valid.message },
    });
  });

  it("zwraca błędy dla wszystkich wymaganych pól", () => {
    const result = validateContact({ name: "", email: "", company: "", service: "", scope: "", message: "", consent: false });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["consent", "email", "message", "name", "service"]);
  });

  it.each(["anna", "anna@", "anna@firma", "anna @firma.pl", "anna@firma.p", "a@b..pl"])("odrzuca niepoprawny e-mail: %s", (email) => {
    expect(validateField("email", { ...valid, email })).toBeDefined();
  });

  it.each(["jan.kowalski@example.com", "biuro+formularz@sub.firma.com.pl"])("akceptuje poprawny e-mail: %s", (email) => {
    expect(validateField("email", { ...valid, email })).toBeUndefined();
  });

  it("odrzuca wartości spoza listy usług i zakresów", () => {
    expect(validateField("service", { ...valid, service: "<script>" })).toBeDefined();
    expect(validateField("scope", { ...valid, scope: "dowolny" })).toBeDefined();
    expect(validateField("scope", { ...valid, scope: "projekt" })).toBeUndefined();
  });

  it("pilnuje długości opisu", () => {
    expect(validateField("message", { ...valid, message: "za krótko" })).toMatch(/co najmniej/);
    expect(validateField("message", { ...valid, message: "x".repeat(3001) })).toMatch(/najwyżej/);
  });

  it("wymaga zgody", () => {
    expect(validateField("consent", { ...valid, consent: false })).toBeDefined();
  });
});

describe("cleanText i inputFromFormData", () => {
  it("usuwa znaki sterujące i nadmiarowe spacje w polach jednoliniowych", () => {
    expect(cleanText("  Anna\u0000\u0007  Nowak\n ")).toBe("Anna Nowak");
  });

  it("zachowuje nowe linie w treści, ale ogranicza ich liczbę", () => {
    expect(cleanText("a\r\nb\n\n\n\n\n\nc\u0000", { multiline: true })).toBe("a\nb\n\n\nc");
  });

  it("ignoruje wartości niebędące tekstem", () => {
    expect(cleanText(null)).toBe("");
    expect(cleanText(new Blob(["x"]))).toBe("");
  });

  it("odczytuje formularz i zgodę tylko dla wartości „on”", () => {
    const formData = new FormData();
    formData.set("name", " Anna ");
    formData.set("email", "anna@firma.pl");
    formData.set("service", "obsluga-it");
    formData.set("message", "Treść");
    formData.set("consent", "true");
    const input = inputFromFormData(formData);
    expect(input).toMatchObject({ name: "Anna", company: "", scope: "", consent: false });
    formData.set("consent", "on");
    expect(inputFromFormData(formData).consent).toBe(true);
  });
});
