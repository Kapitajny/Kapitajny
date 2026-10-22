import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { describeRequest, deliverContactRequest, getDeliveryConfig } from "@/lib/server/contact-delivery";
import type { ContactRequest } from "@/lib/contact";

const ENV_KEYS = ["RESEND_API_KEY", "CONTACT_EMAIL_TO", "CONTACT_EMAIL_FROM", "CONTACT_WEBHOOK_URL", "CONTACT_WEBHOOK_SECRET"] as const;

const request: ContactRequest = {
  name: "Anna",
  contactMethod: "email",
  phone: null,
  email: "anna@example.com",
  preferredDate: "2026-11-03",
  preferredTime: "afternoon",
  service: "rehabilitacja-ortopedyczna",
  message: null,
};

function post(body: unknown, ip = "10.0.0.1") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

let ipCounter = 0;
const nextIp = () => `10.0.1.${++ipCounter}`;

describe("getDeliveryConfig", () => {
  it("wymaga kompletu zmiennych dla e-maila", () => {
    expect(getDeliveryConfig({ RESEND_API_KEY: "re_x", CONTACT_EMAIL_TO: "a@b.pl" }).resend).toBeNull();
    expect(getDeliveryConfig({ RESEND_API_KEY: "re_x", CONTACT_EMAIL_TO: "a@b.pl", CONTACT_EMAIL_FROM: "strona@b.pl" }).resend).not.toBeNull();
    expect(getDeliveryConfig({ CONTACT_WEBHOOK_URL: " https://hook.example " }).webhook).toEqual({ url: "https://hook.example", secret: null });
  });
});

describe("describeRequest", () => {
  it("podaje czytelne dane i przypomina, że to nie rezerwacja", () => {
    const text = describeRequest(request);
    expect(text).toContain("Imię: Anna");
    expect(text).toContain("Preferowany termin: 03.11.2026, po południu");
    expect(text).toContain("Usługa: Rehabilitacja ortopedyczna");
    expect(text).toContain("termin nie został zarezerwowany");
  });
});

describe("deliverContactRequest", () => {
  it("wysyła e-mail przez Resend z adresem do odpowiedzi", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    await deliverContactRequest(request, { resend: { apiKey: "re_x", to: "gabinet@example.com", from: "strona@example.com" }, webhook: null }, fetchMock);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_x");
    expect(JSON.parse(init.body)).toMatchObject({ to: ["gabinet@example.com"], reply_to: "anna@example.com" });
  });

  it("zgłasza błąd, gdy dostawca nie przyjmie zgłoszenia", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("nope", { status: 500 }));
    await expect(deliverContactRequest(request, { resend: null, webhook: { url: "https://hook.example", secret: "s" } }, fetchMock)).rejects.toThrow();
  });
});

describe("POST /api/contact", () => {
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      saved[key] = process.env[key];
      delete process.env[key];
    }
  });
  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
    vi.unstubAllGlobals();
  });

  const valid = { name: "Anna", contactMethod: "phone", phone: "600100200" };

  it("bez konfiguracji NIE potwierdza wysłania", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(post(valid, nextIp()));
    expect(response.status).toBe(503);
    expect((await response.json()).error.code).toBe("CONTACT_NOT_CONFIGURED");
  });

  it("zwraca błędy walidacji dla pól", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(post({ name: "", contactMethod: "phone", phone: "1" }, nextIp()));
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(Object.keys(data.error.fields).sort()).toEqual(["name", "phone"]);
  });

  it("odrzuca zgłoszenia z wypełnionym polem-pułapką", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(post({ ...valid, website: "https://spam.example" }, nextIp()));
    expect(response.status).toBe(400);
  });

  it("potwierdza zgłoszenie dopiero po przyjęciu przez webhook", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hook.example/contact";
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(post(valid, nextIp()));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).request).toMatchObject({ name: "Anna", phone: "600100200" });
  });

  it("zwraca błąd, gdy webhook nie przyjmie zgłoszenia", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hook.example/contact";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("err", { status: 500 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(post(valid, nextIp()));
    expect(response.status).toBe(502);
  });

  it("ogranicza liczbę zgłoszeń z jednego adresu", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const ip = nextIp();
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await POST(post(valid, ip))).status);
    expect(statuses.slice(0, 5).every((s) => s === 503)).toBe(true);
    expect(statuses[5]).toBe(429);
  });
});
