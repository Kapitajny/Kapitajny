import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { setStoreForTests } from "@/lib/server/store";
import { SqliteStore } from "@/lib/server/store/sqlite";
import { POST as createRoute } from "@/app/api/bookings/route";
import { POST as manageRoute } from "@/app/api/bookings/manage/route";
import { GET as availabilityRoute } from "@/app/api/availability/route";
import { addDays, utcToZoned, weekdayOf } from "@/lib/booking/time";

vi.spyOn(console, "info").mockImplementation(() => {});

/** Najbliższy dzień roboczy co najmniej 3 dni od dziś (żeby nie zależeć od godziny uruchomienia testów). */
function nextWorkday(): string {
  let d = addDays(utcToZoned(new Date()).date, 3);
  while (weekdayOf(d) === 0 || weekdayOf(d) === 6) d = addDays(d, 1);
  return d;
}

const DATE = nextWorkday();
const form = (over: Record<string, unknown> = {}) => ({
  service: "vocal",
  durationMin: 120,
  date: DATE,
  time: "14:00",
  name: "MC Test",
  email: "mc@example.com",
  phone: "",
  message: "",
  sound: "",
  acceptTerms: true,
  acceptContact: true,
  lang: "pl",
  website: "",
  startedAt: Date.now() - 60_000,
  ...over,
});

let ip = 0;
const post = (url: string, body: unknown, headers: Record<string, string> = {}) =>
  new Request(`http://localhost:3000${url}`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost:3000", host: "localhost:3000", "x-forwarded-for": `10.0.0.${++ip}`, ...headers },
    body: JSON.stringify(body),
  });

beforeEach(() => setStoreForTests(new SqliteStore(":memory:")));
afterAll(() => setStoreForTests(undefined));

describe("API rezerwacji", () => {
  it("tworzy rezerwację i odrzuca drugą na ten sam termin (409)", async () => {
    const first = await createRoute(post("/api/bookings", form()));
    expect(first.status).toBe(201);
    const data = await first.json();
    expect(data.booking.status).toBe("pending");
    expect(data.manageToken).toMatch(/^[A-Za-z0-9_-]{43}$/);

    const second = await createRoute(post("/api/bookings", form({ time: "15:00", email: "inny@example.com" })));
    expect(second.status).toBe(409);
  });

  it("pokazuje zajęty termin jako niedostępny", async () => {
    await createRoute(post("/api/bookings", form()));
    const res = await availabilityRoute(new Request(`http://localhost:3000/api/availability?service=vocal&duration=120&from=${DATE}&days=1`, { headers: { "x-forwarded-for": "10.9.9.9" } }));
    const { days } = await res.json();
    const slot = (t: string) => days[0].slots.find((s: { time: string }) => s.time === t);
    expect(slot("14:00").available).toBe(false);
    expect(slot("16:00").available).toBe(true);
  });

  it("zwraca błędy walidacji (422) i odrzuca boty", async () => {
    const invalid = await createRoute(post("/api/bookings", form({ email: "x" })));
    expect(invalid.status).toBe(422);
    expect((await invalid.json()).fields).toEqual({ email: "invalid" });
    expect((await createRoute(post("/api/bookings", form({ website: "spam" })))).status).toBe(400);
    expect((await createRoute(post("/api/bookings", form({ startedAt: Date.now() })))).status).toBe(400);
  });

  it("odrzuca żądania z obcej domeny", async () => {
    const res = await createRoute(post("/api/bookings", form(), { origin: "https://evil.example" }));
    expect(res.status).toBe(403);
  });

  it("pozwala zmienić termin i anulować przez token", async () => {
    const { manageToken } = await (await createRoute(post("/api/bookings", form()))).json();
    const moved = await manageRoute(post("/api/bookings/manage", { token: manageToken, action: "reschedule", date: DATE, time: "15:00" }));
    expect(moved.status).toBe(200);
    // nowy termin nachodzi na stary – musi przejść, bo stary należy do tej samej rezerwacji
    const cancelled = await manageRoute(post("/api/bookings/manage", { token: manageToken, action: "cancel" }));
    expect((await cancelled.json()).booking.status).toBe("cancelled");
    // termin znowu wolny
    expect((await createRoute(post("/api/bookings", form({ time: "15:00" })))).status).toBe(201);
  });

  it("nieznany token = 404", async () => {
    const res = await manageRoute(post("/api/bookings/manage", { token: "a".repeat(43), action: "cancel" }));
    expect(res.status).toBe(404);
  });
});
