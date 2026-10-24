import { describe, expect, it } from "vitest";
import { isValidNip, parseContactPayload, validateContact } from "@/lib/contact";

const base = {
  topic: "inne",
  name: "Jan Kowalski",
  email: "jan@example.pl",
  phone: "",
  message: "Dzień dobry, mam pytanie o sklep.",
  consent: true,
};

describe("isValidNip", () => {
  it("akceptuje poprawny NIP (także z myślnikami)", () => {
    expect(isValidNip("8250002694")).toBe(true);
    expect(isValidNip("825-000-26-94")).toBe(true);
  });
  it("odrzuca błędną sumę kontrolną i złą długość", () => {
    expect(isValidNip("8250002695")).toBe(false);
    expect(isValidNip("12345")).toBe(false);
  });
});

describe("validateContact", () => {
  it("przepuszcza poprawną wiadomość ogólną", () => {
    expect(validateContact(parseContactPayload(base))).toEqual({});
  });

  it("wymaga zgody, e-maila i treści", () => {
    const errors = validateContact(parseContactPayload({ ...base, consent: false, email: "zly-adres", message: "krótko" }));
    expect(Object.keys(errors).sort()).toEqual(["consent", "email", "message"]);
  });

  it("w temacie B2B wymaga danych firmy i sprawdza NIP", () => {
    const errors = validateContact(parseContactPayload({ ...base, topic: "handel", nip: "123" }));
    expect(errors.company).toBeDefined();
    expect(errors.businessType).toBeDefined();
    expect(errors.nip).toBeDefined();
    const ok = validateContact(
      parseContactPayload({ ...base, topic: "handel", company: "Hurtownia Sp. z o.o.", businessType: "Hurtownia lub dystrybutor", nip: "8250002694" }),
    );
    expect(ok).toEqual({});
  });

  it("odrzuca nieznany temat i ignoruje nieznane wartości asortymentu", () => {
    const data = parseContactPayload({ ...base, topic: "hack", interests: ["Mięso", "<script>"] });
    expect(data.interests).toEqual(["Mięso"]);
    expect(validateContact(data).topic).toBeDefined();
  });

  it("odporny na dane niebędące obiektem", () => {
    expect(validateContact(parseContactPayload(null)).name).toBeDefined();
  });
});
