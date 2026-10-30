import { describe, expect, it } from "vitest";
import { bookingSteps, checkEarliestDate, formToObject, normalisePhone, todayInPoland, validateBooking, validateContact } from "@/lib/validation";

const NOW = new Date("2026-10-30T10:00:00Z");
const booking = {
  area: "skin-treatments",
  treatment: "chemical-peels",
  firstVisit: "yes",
  days: ["mon", "thu"],
  time: "evening",
  earliest: "2026-11-10",
  name: "Zofia Nowak-Lis",
  phone: "600 100 200",
  email: "Zofia@Example.com",
  contactBy: "email",
  notes: "",
  consent: "on",
};

describe("phone and dates", () => {
  it("normalises Polish and international numbers", () => {
    expect(normalisePhone("600-100-200")).toBe("+48600100200");
    expect(normalisePhone("0048 600 100 200")).toBe("+48600100200");
    expect(normalisePhone("+44 20 7946 0958")).toBe("+442079460958");
    expect(normalisePhone("123")).toBeNull();
  });

  it("uses the Warsaw date and rejects past or far-future dates", () => {
    expect(todayInPoland(new Date("2026-12-31T23:30:00Z"))).toBe("2027-01-01");
    expect(checkEarliestDate("2026-10-29", NOW)).toMatch(/passed/);
    expect(checkEarliestDate("2027-11-01", NOW)).toMatch(/12 months/);
    expect(checkEarliestDate("2026-10-30", NOW)).toBeUndefined();
  });
});

describe("contact form", () => {
  it("accepts a valid message and cleans it", () => {
    const r = validateContact({ name: " Ewa Lis ", email: "EWA@x.pl", subject: "treatment", message: "Hello, a question about peels.", consent: "on" });
    expect(r.errors).toEqual({});
    expect(r.data).toMatchObject({ name: "Ewa Lis", email: "ewa@x.pl", phone: null });
  });
  it("reports every invalid field", () => {
    const r = validateContact({ email: "x", phone: "1", subject: "spam", message: "short" });
    expect(Object.keys(r.errors).sort()).toEqual(["consent", "email", "message", "name", "phone", "subject"]);
  });
});

describe("booking", () => {
  it("accepts a complete request", () => {
    const r = validateBooking(booking, NOW);
    expect(r.errors).toEqual({});
    expect(r.data).toMatchObject({ area: "skin-treatments", firstVisit: true, phone: "+48600100200", email: "zofia@example.com", notes: null });
  });
  it("rejects a treatment from another area, but allows any with “not sure”", () => {
    expect(validateBooking({ ...booking, treatment: "signature-facial" }, NOW).errors.treatment).toBeDefined();
    expect(validateBooking({ ...booking, area: "not-sure", treatment: "signature-facial" }, NOW).errors).toEqual({});
  });
  it("maps every field to exactly one step", () => {
    const fields = bookingSteps.flat();
    expect(new Set(fields).size).toBe(fields.length);
    const r = validateBooking({}, NOW);
    for (const key of Object.keys(r.errors)) expect(fields).toContain(key);
  });
});

describe("formToObject", () => {
  it("turns repeated fields into arrays and drops action fields", () => {
    const fd = new FormData();
    fd.append("days", "mon");
    fd.append("days", "fri");
    fd.append("$ACTION_ID_x", "");
    fd.append("name", "Ola");
    expect(formToObject(fd)).toEqual({ days: ["mon", "fri"], name: "Ola" });
  });
});
