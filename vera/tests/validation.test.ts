import { describe, expect, it } from "vitest";
import { formDataToObject, normalizePhone, validateConsultation, validateContact, validateDateFrom } from "@/lib/validation";

const NOW = new Date("2026-10-30T10:00:00Z");

const validConsultation = {
  category: "skin-treatments",
  treatment: "chemical-peel",
  firstVisit: "yes",
  days: ["tue", "thu"],
  timeOfDay: "evening",
  dateFrom: "",
  name: "Anna Kowalska",
  phone: "600 100 200",
  email: "Anna@Example.com",
  contactBy: "phone",
  message: "",
  consent: "on",
};

describe("normalizePhone", () => {
  it("accepts Polish numbers in common formats", () => {
    expect(normalizePhone("600 100 200")).toBe("+48600100200");
    expect(normalizePhone("+48 600-100-200")).toBe("+48600100200");
    expect(normalizePhone("0048600100200")).toBe("+48600100200");
  });
  it("accepts international numbers and rejects garbage", () => {
    expect(normalizePhone("+44 20 7946 0958")).toBe("+442079460958");
    expect(normalizePhone("12345")).toBeNull();
    expect(normalizePhone("call me")).toBeNull();
  });
});

describe("validateContact", () => {
  it("returns clean data for a valid message", () => {
    const { data, errors } = validateContact({ name: " Anna Kowalska ", email: "ANNA@example.com", phone: "", topic: "other", message: "A question about hours.", consent: "on" });
    expect(errors).toEqual({});
    expect(data).toMatchObject({ name: "Anna Kowalska", email: "anna@example.com", phone: null, topic: "other" });
  });
  it("reports every invalid field", () => {
    const { data, errors } = validateContact({ name: "", email: "nope", phone: "12", topic: "x", message: "short" });
    expect(data).toBeNull();
    expect(Object.keys(errors).sort()).toEqual(["consent", "email", "message", "name", "phone", "topic"]);
  });
});

describe("validateConsultation", () => {
  it("accepts a complete request", () => {
    const { data, errors } = validateConsultation(validConsultation, NOW);
    expect(errors).toEqual({});
    expect(data).toMatchObject({ treatment: "chemical-peel", firstVisit: true, phone: "+48600100200", email: "anna@example.com", days: ["tue", "thu"] });
  });
  it("rejects a treatment from another category", () => {
    const { errors } = validateConsultation({ ...validConsultation, treatment: "signature-facial" }, NOW);
    expect(errors.treatment).toMatch(/another area/);
  });
  it("allows any treatment when the client is not sure of the area", () => {
    const { errors } = validateConsultation({ ...validConsultation, category: "not-sure", treatment: "signature-facial" }, NOW);
    expect(errors).toEqual({});
  });
  it("requires a phone number and consent", () => {
    const { errors } = validateConsultation({ ...validConsultation, phone: "", consent: undefined }, NOW);
    expect(errors.phone).toBeDefined();
    expect(errors.consent).toBeDefined();
  });
  it("rejects unknown weekdays", () => {
    const { errors } = validateConsultation({ ...validConsultation, days: ["sun"] }, NOW);
    expect(errors.days).toBeDefined();
  });
});

describe("validateDateFrom", () => {
  it("accepts today and dates within six months", () => {
    expect(validateDateFrom("2026-10-30", NOW)).toBeUndefined();
    expect(validateDateFrom("2027-04-30", NOW)).toBeUndefined();
  });
  it("rejects past and far-future dates", () => {
    expect(validateDateFrom("2026-10-29", NOW)).toMatch(/passed/);
    expect(validateDateFrom("2027-05-01", NOW)).toMatch(/six months/);
    expect(validateDateFrom("30/10/2026", NOW)).toMatch(/calendar/);
  });
});

describe("formDataToObject", () => {
  it("turns repeated fields into arrays and keeps a single day as an array", () => {
    const fd = new FormData();
    fd.append("days", "mon");
    fd.append("name", "Anna");
    fd.append("$ACTION_ID_x", "");
    expect(formDataToObject(fd)).toEqual({ days: ["mon"], name: "Anna" });
    fd.append("days", "fri");
    expect(formDataToObject(fd).days).toEqual(["mon", "fri"]);
  });
});
