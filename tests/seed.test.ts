import { describe, expect, it } from "vitest";

process.env.DB_PATH = ":memory:";
process.env.SEED_FLEET = "true";

const { resetDbForTests } = await import("@/lib/server/db");
const repo = await import("@/lib/server/repo");

describe("dane startowe", () => {
  it("każdy skuter ma cenę 1500 zł brutto za 24 h, pozostałe czasy są puste", () => {
    resetDbForTests();
    const fleet = repo.listJetskis();
    expect(fleet.length).toBeGreaterThan(0);
    for (const j of fleet) {
      expect(j.prices[1440]).toBe(150_000);
      expect(j.prices[60]).toBeNull();
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
