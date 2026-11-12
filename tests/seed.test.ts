import { describe, expect, it } from "vitest";

process.env.DB_PATH = ":memory:";
process.env.SEED_FLEET = "true";

const { resetDbForTests } = await import("@/lib/server/db");
const repo = await import("@/lib/server/repo");

describe("dane startowe", () => {
  it("każdy skuter ma cennik 170 zł brutto za każdą godzinę (1 h 170 zł … 24 h 4080 zł)", () => {
    resetDbForTests();
    const fleet = repo.listJetskis();
    expect(fleet.length).toBeGreaterThan(0);
    for (const j of fleet) {
      expect(j.prices).toEqual({ 60: 17_000, 120: 34_000, 180: 51_000, 240: 68_000, 360: 102_000, 720: 204_000, 1440: 408_000 });
      expect(j.depositGr).toBeNull();
    }
  });

  it("kaucję można zapisać osobno i wyczyścić", () => {
    resetDbForTests();
    const [j] = repo.listJetskis();
    repo.setDeposit(j.id, 100_000);
    expect(repo.getJetski(j.id)?.depositGr).toBe(100_000);
    repo.setDeposit(j.id, null);
    expect(repo.getJetski(j.id)?.depositGr).toBeNull();
  });
});
