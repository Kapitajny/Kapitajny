import { describe, expect, it, vi } from "vitest";
import {
  applyIntent,
  buildPayload,
  emptyForm,
  firstInvalidStep,
  isValidPhone,
  isValidWebsite,
  normalizeWebsite,
  submitContact,
  summaryRows,
  validateStep,
  type ContactFormData,
} from "@/lib/contact-form";

const filled: ContactFormData = {
  ...emptyForm,
  services: ["meta", "google"],
  package: "growth",
  goal: "leads",
  budget: "1500-3000",
  company: "Studio Oś",
  industry: "fizjoterapia",
  website: "studio-os.pl",
  name: "Anna",
  email: "anna@studio-os.pl",
  phone: "600 100 200",
  consent: true,
};

describe("walidacja kroków", () => {
  it("krok 1 wymaga co najmniej jednej usługi", () => {
    expect(validateStep(1, emptyForm).services).toBeTruthy();
    expect(validateStep(1, { ...emptyForm, services: ["unsure"] })).toEqual({});
  });

  it("krok 2: „Inny cel” wymaga opisu", () => {
    expect(validateStep(2, { ...emptyForm, goal: "other" }).goalOther).toBeTruthy();
    expect(validateStep(2, { ...emptyForm, goal: "other", goalOther: "rekrutacja" })).toEqual({});
  });

  it("krok 4: strona internetowa jest opcjonalna, ale musi być poprawna", () => {
    const base = { ...emptyForm, company: "Firma", industry: "usługi" };
    expect(validateStep(4, base)).toEqual({});
    expect(validateStep(4, { ...base, website: "nie strona" }).website).toBeTruthy();
    expect(validateStep(4, { ...base, website: "firma.pl" })).toEqual({});
  });

  it("krok 5: e-mail i telefon", () => {
    const base = { ...emptyForm, name: "Jan", email: "jan@firma.pl", phone: "+48 600 100 200" };
    expect(validateStep(5, base)).toEqual({});
    expect(validateStep(5, { ...base, email: "jan@firma" }).email).toBeTruthy();
    expect(validateStep(5, { ...base, phone: "123" }).phone).toBeTruthy();
    expect(validateStep(5, { ...base, phone: "abc 600 100 200" }).phone).toBeTruthy();
  });

  it("krok 6 wymaga zgody", () => {
    expect(validateStep(6, { ...filled, consent: false }).consent).toBeTruthy();
  });

  it("firstInvalidStep wskazuje pierwszy niekompletny krok", () => {
    expect(firstInvalidStep(filled)).toBeNull();
    expect(firstInvalidStep({ ...filled, budget: null })).toBe(3);
  });
});

describe("pomocnicze", () => {
  it("normalizuje i sprawdza adres strony", () => {
    expect(normalizeWebsite("firma.pl")).toBe("https://firma.pl");
    expect(normalizeWebsite("http://firma.pl")).toBe("http://firma.pl");
    expect(isValidWebsite("")).toBe(true);
    expect(isValidWebsite("localhost")).toBe(false);
  });

  it("sprawdza numer telefonu", () => {
    expect(isValidPhone("600100200")).toBe(true);
    expect(isValidPhone("(22) 123-45-67")).toBe(true);
    expect(isValidPhone("12345")).toBe(false);
  });
});

describe("wybór z przycisków CTA", () => {
  it("dodaje usługi bez kasowania wcześniejszych i usuwa „Nie wiem”", () => {
    const d = applyIntent({ ...emptyForm, services: ["unsure"] }, { services: ["tiktok"] });
    expect(d.services).toEqual(["tiktok"]);
    const d2 = applyIntent({ ...emptyForm, services: ["meta"] }, { services: ["google"] });
    expect(d2.services).toEqual(["meta", "google"]);
  });

  it("ustawia pakiet i zachowuje inne odpowiedzi", () => {
    const d = applyIntent({ ...filled, package: null }, { package: "start" });
    expect(d.package).toBe("start");
    expect(d.company).toBe("Studio Oś");
  });
});

describe("podsumowanie i wysyłka", () => {
  it("podsumowanie zawiera pakiet i znormalizowaną stronę", () => {
    const rows = summaryRows(filled);
    expect(rows.find((r) => r.label === "Wybrany pakiet")?.value).toContain("GROWTH");
    expect(rows.find((r) => r.label === "Strona internetowa")?.value).toBe("https://studio-os.pl");
  });

  it("bez skonfigurowanego endpointu niczego nie wysyła", async () => {
    const fetchMock = vi.fn();
    const res = await submitContact(null, filled, null, fetchMock as unknown as typeof fetch);
    expect(res).toEqual({ ok: false, reason: "not-configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("wysyła JSON i rozróżnia odrzucenie od sukcesu", async () => {
    const ok = vi.fn().mockResolvedValue({ ok: true });
    expect(await submitContact("https://example.test/f", filled, "klucz", ok as unknown as typeof fetch)).toEqual({ ok: true });
    const body = JSON.parse(ok.mock.calls[0][1].body);
    expect(body.access_key).toBe("klucz");
    expect(body.uslugi).toBe("Meta Ads, Google Ads");

    const rejected = vi.fn().mockResolvedValue({ ok: false });
    expect(await submitContact("https://example.test/f", filled, null, rejected as unknown as typeof fetch)).toEqual({ ok: false, reason: "rejected" });

    const network = vi.fn().mockRejectedValue(new Error("offline"));
    expect(await submitContact("https://example.test/f", filled, null, network as unknown as typeof fetch)).toEqual({ ok: false, reason: "network" });
  });

  it("payload nie zawiera klucza, gdy go nie podano", () => {
    expect(buildPayload(filled)).not.toHaveProperty("access_key");
  });
});
