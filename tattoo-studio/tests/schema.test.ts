import { describe, expect, it } from "vitest";
import { EMPTY_BOOKING, STEP_FIELDS, coerceBooking, normalizeBooking, validateBooking } from "@/lib/booking/schema";
import { VALID } from "./fixtures";

const NOW = new Date("2026-11-19T10:00:00Z");



describe("validateBooking", () => {
  it("accepts a complete booking", () => {
    expect(validateBooking(VALID, undefined, NOW)).toEqual({});
  });

  it("requires name and a valid email", () => {
    const errors = validateBooking({ ...VALID, fullName: " ", email: "anna@" }, undefined, NOW);
    expect(errors.fullName).toBeDefined();
    expect(errors.email).toBeDefined();
  });

  it("phone is optional unless phone is the preferred contact", () => {
    expect(validateBooking({ ...VALID, phone: "" }, ["phone"], NOW).phone).toBeUndefined();
    expect(validateBooking({ ...VALID, phone: "", contactMethod: "phone" }, ["phone"], NOW).phone).toBeDefined();
    expect(validateBooking({ ...VALID, phone: "+48 600 000 000", contactMethod: "phone" }, ["phone"], NOW).phone).toBeUndefined();
    expect(validateBooking({ ...VALID, phone: "12ab" }, ["phone"], NOW).phone).toBeDefined();
    expect(validateBooking({ ...VALID, phone: "123" }, ["phone"], NOW).phone).toBeDefined();
  });

  it("requires a meaningful description", () => {
    expect(validateBooking({ ...VALID, description: "koi" }, ["description"], NOW).description).toMatch(/at least/);
  });

  it("validates option lists", () => {
    const errors = validateBooking(
      { ...VALID, styles: ["tribal" as never], placement: "elbow" as never, size: "" , budget: "free" as never },
      undefined,
      NOW,
    );
    expect(Object.keys(errors).sort()).toEqual(["budget", "placement", "size", "styles"]);
    expect(validateBooking({ ...VALID, styles: [] }, ["styles"], NOW).styles).toBeDefined();
  });

  it("only accepts future dates within a year (Warsaw time)", () => {
    expect(validateBooking({ ...VALID, preferredDate: "2026-11-18" }, ["preferredDate"], NOW).preferredDate).toBeDefined();
    expect(validateBooking({ ...VALID, preferredDate: "2026-11-19" }, ["preferredDate"], NOW).preferredDate).toBeUndefined();
    expect(validateBooking({ ...VALID, preferredDate: "2028-01-01" }, ["preferredDate"], NOW).preferredDate).toBeDefined();
    expect(validateBooking({ ...VALID, preferredDate: "2026-02-30" }, ["preferredDate"], NOW).preferredDate).toBeDefined();
    expect(validateBooking({ ...VALID, preferredDate: "" }, ["preferredDate"], NOW).preferredDate).toBeUndefined();
  });

  it("requires both consents and never defaults them to true", () => {
    expect(EMPTY_BOOKING.privacyAccepted).toBe(false);
    expect(EMPTY_BOOKING.accuracyConfirmed).toBe(false);
    const errors = validateBooking({ ...VALID, privacyAccepted: false, accuracyConfirmed: false }, undefined, NOW);
    expect(Object.keys(errors).sort()).toEqual(["accuracyConfirmed", "privacyAccepted"]);
  });

  it("each step only validates its own fields", () => {
    const errors = validateBooking(EMPTY_BOOKING, STEP_FIELDS[0], NOW);
    expect(Object.keys(errors).sort()).toEqual(["email", "fullName"]);
    expect(validateBooking(EMPTY_BOOKING, STEP_FIELDS[4], NOW)).toEqual({});
  });
});

describe("coerceBooking / normalizeBooking", () => {
  it("ignores unknown fields and wrong types", () => {
    const data = coerceBooking({ fullName: 42, email: "A@Example.com ", isAdmin: true, styles: ["fine-line", 3], privacyAccepted: "yes" });
    expect(data.fullName).toBe("");
    expect(data.styles).toEqual(["fine-line"]);
    expect(data.privacyAccepted).toBe(false);
    expect("isAdmin" in data).toBe(false);
    expect(normalizeBooking(data).email).toBe("a@example.com");
  });
});
