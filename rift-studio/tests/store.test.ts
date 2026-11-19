import { beforeEach, describe, expect, it } from "vitest";
import { SqliteStore } from "@/lib/server/store/sqlite";
import type { NewBooking } from "@/lib/server/store/types";

const base: Omit<NewBooking, "startsAt" | "endsAt" | "tokenHash"> = {
  service: "vocal",
  durationMin: 120,
  name: "Test",
  email: "t@example.com",
  phone: "",
  message: "",
  sound: "",
  lang: "pl",
};

let store: SqliteStore;
let n = 0;
const booking = (startsAt: string, endsAt: string): NewBooking => ({ ...base, startsAt, endsAt, tokenHash: `hash-${n++}` });

beforeEach(() => {
  store = new SqliteStore(":memory:");
});

describe("SqliteStore – ochrona przed podwójną rezerwacją", () => {
  it("odrzuca nakładający się termin, przyjmuje sąsiedni", async () => {
    expect((await store.create(booking("2026-11-20T13:00:00Z", "2026-11-20T15:00:00Z"))).ok).toBe(true);
    expect(await store.create(booking("2026-11-20T14:00:00Z", "2026-11-20T16:00:00Z"))).toEqual({ ok: false, reason: "conflict" });
    expect(await store.create(booking("2026-11-20T12:00:00Z", "2026-11-20T13:30:00Z"))).toEqual({ ok: false, reason: "conflict" });
    expect((await store.create(booking("2026-11-20T15:00:00Z", "2026-11-20T16:00:00Z"))).ok).toBe(true);
  });

  it("przy równoczesnych próbach zapisuje dokładnie jedną rezerwację", async () => {
    const attempts = await Promise.all(Array.from({ length: 10 }, () => store.create(booking("2026-11-21T10:00:00Z", "2026-11-21T12:00:00Z"))));
    expect(attempts.filter((a) => a.ok)).toHaveLength(1);
  });

  it("anulowana rezerwacja zwalnia termin, a jej przywrócenie nie może go nadpisać", async () => {
    const first = await store.create(booking("2026-11-20T13:00:00Z", "2026-11-20T15:00:00Z"));
    if (!first.ok) throw new Error();
    await store.setStatus(first.value.id, "cancelled", "test");
    expect((await store.create(booking("2026-11-20T13:00:00Z", "2026-11-20T14:00:00Z"))).ok).toBe(true);
    expect(await store.setStatus(first.value.id, "confirmed")).toEqual({ ok: false, reason: "conflict" });
  });

  it("blokady terminów są traktowane jak zajętość", async () => {
    await store.addBlock("2026-11-24T09:00:00Z", "2026-11-24T21:00:00Z", "urlop");
    expect(await store.create(booking("2026-11-24T10:00:00Z", "2026-11-24T11:00:00Z"))).toEqual({ ok: false, reason: "conflict" });
    const busy = await store.listBusy(new Date("2026-11-24T00:00:00Z"), new Date("2026-11-25T00:00:00Z"));
    expect(busy).toHaveLength(1);
  });

  it("zmiana terminu pomija własną rezerwację i wraca do statusu pending", async () => {
    const a = await store.create(booking("2026-11-20T13:00:00Z", "2026-11-20T15:00:00Z"));
    await store.create(booking("2026-11-20T16:00:00Z", "2026-11-20T17:00:00Z"));
    if (!a.ok) throw new Error();
    await store.setStatus(a.value.id, "confirmed");
    const moved = await store.reschedule(a.value.id, "2026-11-20T14:00:00Z", "2026-11-20T16:00:00Z");
    expect(moved.ok && moved.value.status).toBe("pending");
    expect(await store.reschedule(a.value.id, "2026-11-20T15:00:00Z", "2026-11-20T17:00:00Z")).toEqual({ ok: false, reason: "conflict" });
  });
});
