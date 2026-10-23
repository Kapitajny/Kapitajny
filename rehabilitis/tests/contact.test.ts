import { describe, expect, it } from "vitest";
import { addDays, normalizePhone, todayInWarsaw, validateContact, validatePreferredDate } from "@/lib/contact";

const TODAY = "2026-10-22";

const base = { name: "Anna", contactMethod: "phone", phone: "600 100 200" };

describe("validateContact", () => {
  it("akceptuje minimalne zgłoszenie telefoniczne i normalizuje numer", () => {
    const result = validateContact(base, TODAY);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({
      name: "Anna",
      contactMethod: "phone",
      phone: "600100200",
      email: null,
      preferredDate: null,
      preferredTime: "any",
      service: null,
      message: null,
    });
  });

  it("wymaga adresu e-mail, gdy wybrano kontakt mailowy, i ignoruje wtedy telefon", () => {
    expect(validateContact({ ...base, contactMethod: "email" }, TODAY)).toMatchObject({ ok: false, errors: { email: expect.any(String) } });
    const result = validateContact({ ...base, contactMethod: "email", email: " Anna@Example.com " }, TODAY);
    expect(result).toMatchObject({ ok: true, value: { email: "anna@example.com", phone: null } });
  });

  it("zgłasza wszystkie błędy naraz", () => {
    const result = validateContact({ name: "", contactMethod: "fax", preferredTime: "night", service: "nieistniejaca" }, TODAY);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual(["contactMethod", "name", "preferredTime", "service"]);
  });

  it("nie akceptuje dziedziczonych kluczy jako pory dnia", () => {
    expect(validateContact({ ...base, preferredTime: "toString" }, TODAY)).toMatchObject({ ok: false, errors: { preferredTime: expect.any(String) } });
  });

  it("akceptuje usługę z listy i ogranicza długość wiadomości", () => {
    expect(validateContact({ ...base, service: "masaz-leczniczy", message: "Dzień dobry" }, TODAY)).toMatchObject({
      ok: true,
      value: { service: "masaz-leczniczy", message: "Dzień dobry" },
    });
    expect(validateContact({ ...base, message: "a".repeat(601) }, TODAY)).toMatchObject({ ok: false, errors: { message: expect.any(String) } });
  });

  it("odrzuca imię z cyframi lub zbyt krótkie", () => {
    expect(validateContact({ ...base, name: "A" }, TODAY).ok).toBe(false);
    expect(validateContact({ ...base, name: "Anna123" }, TODAY).ok).toBe(false);
    expect(validateContact({ ...base, name: "Zofia Łęcka-Żak" }, TODAY).ok).toBe(true);
  });
});

describe("normalizePhone", () => {
  it.each([
    ["600 100 200", "600100200"],
    ["+48 600-100-200", "+48600100200"],
    ["0048 600 100 200", "+48600100200"],
    ["(58) 123 45 67", "581234567"],
    ["+49 30 1234567", "+49301234567"],
  ])("%s → %s", (input, expected) => expect(normalizePhone(input)).toBe(expected));

  it.each(["12345", "600 100 2OO", "+48 600 700 80", "+48 600 100 2000", "60010020", "6001002001", "+48 600 100 200 300 400", ""])("odrzuca %s", (input) =>
    expect(normalizePhone(input)).toBeNull(),
  );
});

describe("validatePreferredDate", () => {
  it("pozwala pominąć datę", () => expect(validatePreferredDate("", TODAY)).toBeNull());
  it("akceptuje dziś i daty w ciągu 6 miesięcy", () => {
    expect(validatePreferredDate(TODAY, TODAY)).toBeNull();
    expect(validatePreferredDate(addDays(TODAY, 180), TODAY)).toBeNull();
  });
  it("odrzuca daty przeszłe, zbyt odległe i nieistniejące", () => {
    expect(validatePreferredDate("2026-10-21", TODAY)).toMatch(/przyszłą/);
    expect(validatePreferredDate(addDays(TODAY, 181), TODAY)).toMatch(/6 miesięcy/);
    expect(validatePreferredDate("2026-02-30", TODAY)).toMatch(/poprawną/);
    expect(validatePreferredDate("22.10.2026", TODAY)).toMatch(/poprawną/);
  });
});

describe("todayInWarsaw", () => {
  it("liczy datę w strefie Europe/Warsaw", () => {
    // 23:30 UTC 22 października to już 23 października w Polsce (UTC+2 w czasie letnim)
    expect(todayInWarsaw(new Date("2026-10-22T23:30:00Z"))).toBe("2026-10-23");
    expect(todayInWarsaw(new Date("2026-01-15T10:00:00Z"))).toBe("2026-01-15");
  });
});
