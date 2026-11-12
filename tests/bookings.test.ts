import { beforeEach, describe, expect, it } from "vitest";
import { fromLocal } from "@/lib/time";

process.env.DB_PATH = ":memory:";
process.env.SEED_FLEET = "false";

const { resetDbForTests } = await import("@/lib/server/db");
const repo = await import("@/lib/server/repo");
const bookings = await import("@/lib/server/bookings");

const now = fromLocal("2027-07-01", 8 * 60);

function makeJetski() {
  return repo.createJetski({
    manufacturer: "Test",
    model: "One",
    name: "Test One",
    description: null,
    powerHp: null,
    seats: 2,
    license: "required",
    licenseNote: null,
    depositGr: 50000,
    image: null,
    imageAlt: null,
    active: true,
    needsReview: false,
    sort: 0,
  });
}

let key = 0;
const request = (jetskiId: string, over: Record<string, unknown> = {}) => ({
  jetskiId,
  date: "2027-07-02",
  time: "12:00",
  duration: 60,
  name: "Jan Kowalski",
  email: "jan@example.com",
  phone: "600 100 200",
  acceptTerms: true,
  acceptRules: true,
  idempotencyKey: `test-key-${String(++key).padStart(12, "0")}`,
  ...over,
});

beforeEach(() => {
  resetDbForTests();
});

describe("rezerwacje", () => {
  it("nie przyjmuje rezerwacji bez ustalonej ceny", () => {
    const j = makeJetski();
    const r = bookings.createBooking(request(j.id), now);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe("no-price");
  });

  it("tworzy rezerwację z ceną i kaucją z cennika", () => {
    const j = makeJetski();
    repo.setPrices(j.id, { 60: 30000 });
    const r = bookings.createBooking(request(j.id), now);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.booking.priceGr).toBe(30000);
      expect(r.booking.depositGr).toBe(50000);
      expect(r.booking.status).toBe("pending");
      expect(r.booking.number).toMatch(/^MJ-270702-[A-Z0-9]{4}$/);
    }
  });

  it("blokuje podwójną rezerwację i respektuje bufor", () => {
    const j = makeJetski();
    repo.setPrices(j.id, { 60: 30000 });
    expect(bookings.createBooking(request(j.id), now).ok).toBe(true);
    const clash = bookings.createBooking(request(j.id, { time: "12:30", email: "anna@example.com" }), now);
    expect(clash.ok).toBe(false);
    if (!clash.ok) expect(clash.code).toBe("busy");
    // 13:00 wypada w buforze 15 min po zwrocie
    expect(bookings.createBooking(request(j.id, { time: "13:00" }), now).ok).toBe(false);
    expect(bookings.createBooking(request(j.id, { time: "13:30" }), now).ok).toBe(true);
  });

  it("ponowne wysłanie tego samego formularza nie tworzy drugiej rezerwacji", () => {
    const j = makeJetski();
    repo.setPrices(j.id, { 60: 30000 });
    const body = request(j.id);
    const a = bookings.createBooking(body, now);
    const b = bookings.createBooking(body, now);
    expect(a.ok && b.ok && a.booking.number === b.booking.number && b.replayed).toBe(true);
  });

  it("uwzględnia blokady terminów", () => {
    const j = makeJetski();
    repo.setPrices(j.id, { 60: 30000 });
    repo.createBlock({ jetskiId: null, start: fromLocal("2027-07-02", 11 * 60), end: fromLocal("2027-07-02", 14 * 60), reason: "Serwis" });
    const r = bookings.createBooking(request(j.id), now);
    expect(r.ok).toBe(false);
  });

  it("waliduje dane klienta i zgody", () => {
    const j = makeJetski();
    repo.setPrices(j.id, { 60: 30000 });
    const r = bookings.createBooking(request(j.id, { email: "zly", phone: "12", acceptTerms: false }), now);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors ?? {})).toEqual(expect.arrayContaining(["email", "phone", "acceptTerms"]));
  });

  it("pozwala anulować z tokenem i zwalnia termin; przywrócenie sprawdza kolizje", () => {
    const j = makeJetski();
    repo.setPrices(j.id, { 60: 30000 });
    const start = Date.now() + 3 * 86_400_000;
    const { date, minutes } = (() => {
      const f = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" });
      return { date: f.format(new Date(start)), minutes: 12 * 60 };
    })();
    const r = bookings.createBooking(request(j.id, { date, time: "12:00" }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(bookings.getBookingForCustomer(r.booking.number, "zly-token")).toBeNull();
    expect(bookings.cancelByCustomer(r.booking.number, r.booking.token)).toEqual({ ok: true });
    expect(bookings.getAvailability(j.id, date, 60).ok).toBe(true);
    const second = bookings.createBooking(request(j.id, { date, time: "12:00", email: "ewa@example.com" }));
    expect(second.ok).toBe(true);
    const cancelled = bookings.listBookings({ status: "cancelled" })[0];
    const restore = bookings.updateBooking(cancelled.id, { status: "confirmed" });
    expect(restore.ok).toBe(false);
    void minutes;
  });

  it("usunięcie skutera z historią tylko go wyłącza", () => {
    const j = makeJetski();
    repo.setPrices(j.id, { 60: 30000 });
    bookings.createBooking(request(j.id), now);
    expect(repo.deleteJetski(j.id)).toBe("deactivated");
    const k = makeJetski();
    expect(repo.deleteJetski(k.id)).toBe("deleted");
  });
});
