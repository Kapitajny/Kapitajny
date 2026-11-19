import { beforeAll, describe, expect, it } from "vitest";
import { checkPassword, createSessionValue, verifySessionValue } from "@/lib/server/admin-auth";

beforeAll(() => {
  process.env.ADMIN_PASSWORD = "bardzo-tajne-haslo";
  process.env.ADMIN_SESSION_SECRET = "x".repeat(40);
});

describe("sesja panelu administracyjnego", () => {
  it("sprawdza hasło", () => {
    expect(checkPassword("bardzo-tajne-haslo")).toBe(true);
    expect(checkPassword("zle")).toBe(false);
  });

  it("podpisuje i weryfikuje ciasteczko sesji", () => {
    const { value } = createSessionValue(1_000);
    expect(verifySessionValue(value, 2_000)).toBe(true);
    expect(verifySessionValue(value.replace(/.$/, (c) => (c === "A" ? "B" : "A")), 2_000)).toBe(false);
    expect(verifySessionValue(value, 1_000 + 13 * 3600_000)).toBe(false); // wygasła
    expect(verifySessionValue("9999999999999.podrobka", 2_000)).toBe(false);
  });
});
