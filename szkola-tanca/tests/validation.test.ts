import { describe, expect, it } from "vitest";
import { isValidEmail, MESSAGE_MAX_LENGTH, validateNewsletter, validateTrialForm, type TrialFormValues } from "@/lib/validation";

const valid: TrialFormValues = {
  name: "Ola",
  email: "ola@example.com",
  style: "hip-hop",
  level: "start",
  day: "",
  message: "",
  privacy: true,
};

describe("isValidEmail", () => {
  it.each(["ola@example.com", " ola.nowak+taniec@poczta.example.pl "])("akceptuje %s", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });
  it.each(["", "ola", "ola@", "ola@example", "ola @example.com", "ola@example.c"])("odrzuca „%s”", (email) => {
    expect(isValidEmail(email)).toBe(false);
  });
});

describe("validateTrialForm", () => {
  it("przepuszcza poprawne dane (dzień i wiadomość są opcjonalne)", () => {
    expect(validateTrialForm(valid)).toEqual({});
  });

  it("zgłasza wszystkie brakujące pola wymagane", () => {
    const errors = validateTrialForm({ ...valid, name: " ", email: "", style: "", level: "", privacy: false });
    expect(Object.keys(errors).sort()).toEqual(["email", "level", "name", "privacy", "style"]);
  });

  it("sprawdza długość imienia i wiadomości", () => {
    expect(validateTrialForm({ ...valid, name: "A" }).name).toMatch(/co najmniej 2/);
    expect(validateTrialForm({ ...valid, name: "A".repeat(61) }).name).toMatch(/maksymalnie 60/);
    expect(validateTrialForm({ ...valid, message: "x".repeat(MESSAGE_MAX_LENGTH + 1) }).message).toBeDefined();
  });

  it("odrzuca niepoprawny e-mail", () => {
    expect(validateTrialForm({ ...valid, email: "ola@" }).email).toMatch(/Sprawdź adres/);
  });
});

describe("validateNewsletter", () => {
  it("wymaga e-maila i zgody", () => {
    expect(validateNewsletter({ email: "", consent: false })).toEqual({ email: "Podaj adres e-mail.", consent: expect.any(String) });
    expect(validateNewsletter({ email: "ola@example.com", consent: true })).toEqual({});
  });
});
