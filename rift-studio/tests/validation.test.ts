import { describe, expect, it } from "vitest";
import { validateBooking } from "@/lib/booking/validation";
import { estimatePrice } from "@/data/services";

export const validInput = {
  service: "vocal",
  durationMin: 120,
  date: "2026-11-20",
  time: "14:00",
  name: "MC Testowy",
  email: "Artysta@Example.com ",
  phone: "+48 600 100 200",
  message: "Dwa numery, mam własny bit.",
  sound: "underground",
  acceptTerms: true,
  acceptContact: true,
  lang: "en",
};

describe("walidacja rezerwacji", () => {
  it("akceptuje poprawne dane i normalizuje e-mail", () => {
    const r = validateBooking(validInput);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.email).toBe("artysta@example.com");
      expect(r.value.lang).toBe("en");
    }
  });

  it("zwraca kody błędów dla pól", () => {
    const r = validateBooking({ ...validInput, service: "karaoke", date: "2026-02-31", name: "X", email: "nope", phone: "abc", acceptTerms: false, acceptContact: "true" });
    expect(r.ok).toBe(false);
    if (!r.ok)
      expect(r.errors).toEqual({ service: "invalid", date: "invalid", name: "too_short", email: "invalid", phone: "invalid", acceptTerms: "required", acceptContact: "required" });
  });

  it("odrzuca długość sesji niedostępną dla usługi", () => {
    const r = validateBooking({ ...validInput, service: "production", durationMin: 60 });
    expect(r.ok).toBe(false);
  });

  it("telefon i brzmienie są opcjonalne", () => {
    expect(validateBooking({ ...validInput, phone: "", sound: "" }).ok).toBe(true);
  });
});

describe("szacunek ceny", () => {
  it("liczy stawkę godzinową i blok 4 h", () => {
    expect(estimatePrice("vocal", 120)).toBe(240);
    expect(estimatePrice("vocal", 240)).toBe(420);
    expect(estimatePrice("production", 240)).toBe(600);
  });
});
