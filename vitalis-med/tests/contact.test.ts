import { describe, expect, it } from "vitest";
import { emptyContact, normalizeContact, requiresRoute, todayInWarsaw, validateContact, type ContactInput } from "@/lib/contact";

const NOW = new Date("2026-11-06T10:00:00Z");

const valid: ContactInput = {
  ...emptyContact,
  name: "Jan Kowalski",
  phone: "+48 500 600 700",
  email: "jan@example.com",
  service: "transport-sanitarny",
  pickup: "Szpital Powiatowy, Grodzisk Mazowiecki",
  destination: "ul. Polna 1, Warszawa",
  date: "2026-11-10",
  time: "09:30",
  consent: true,
};

describe("validateContact", () => {
  it("accepts a complete transport request", () => {
    expect(validateContact(valid, NOW)).toEqual({});
  });

  it("requires name, phone, email, service and consent", () => {
    const errors = validateContact(emptyContact, NOW);
    expect(Object.keys(errors).sort()).toEqual(["consent", "email", "name", "phone", "service"]);
  });

  it("requires pickup and destination only for transport services", () => {
    const transport = validateContact({ ...valid, pickup: "", destination: "" }, NOW);
    expect(transport.pickup).toBeDefined();
    expect(transport.destination).toBeDefined();
    const event = validateContact({ ...valid, service: "zabezpieczenie-imprez", pickup: "", destination: "" }, NOW);
    expect(event).toEqual({});
    expect(requiresRoute("obsluga-firm-i-instytucji")).toBe(false);
  });

  it("validates phone and e-mail formats", () => {
    const e = validateContact({ ...valid, phone: "12-34", email: "jan@" }, NOW);
    expect(e.phone).toBeDefined();
    expect(e.email).toBeDefined();
    expect(validateContact({ ...valid, phone: "500 600 700" }, NOW).phone).toBeUndefined();
  });

  it("rejects dates in the past, invalid dates and time without date", () => {
    expect(validateContact({ ...valid, date: "2026-11-05" }, NOW).date).toMatch(/wcześniejsza/);
    expect(validateContact({ ...valid, date: "2026-02-30" }, NOW).date).toBeDefined();
    expect(validateContact({ ...valid, date: "2028-01-01" }, NOW).date).toBeDefined();
    expect(validateContact({ ...valid, date: "", time: "10:00" }, NOW).date).toBeDefined();
    expect(validateContact({ ...valid, date: "2026-11-06" }, NOW).date).toBeUndefined();
  });

  it("rejects unknown services and over-long messages", () => {
    expect(validateContact({ ...valid, service: "nie-istnieje" }, NOW).service).toBeDefined();
    expect(validateContact({ ...valid, service: "inne", pickup: "", destination: "" }, NOW)).toEqual({});
    expect(validateContact({ ...valid, message: "x".repeat(1501) }, NOW).message).toBeDefined();
  });
});

describe("normalizeContact", () => {
  it("trims values, lowercases e-mail and requires consent === true", () => {
    const n = normalizeContact({ name: "  Anna   Nowak ", email: " ANNA@Example.com ", consent: "true", extra: 1 });
    expect(n.name).toBe("Anna Nowak");
    expect(n.email).toBe("anna@example.com");
    expect(n.consent).toBe(false);
    expect(normalizeContact(null)).toEqual(emptyContact);
  });
});

describe("todayInWarsaw", () => {
  it("uses the Europe/Warsaw calendar day", () => {
    expect(todayInWarsaw(new Date("2026-11-06T23:30:00Z"))).toBe("2026-11-07");
  });
});
