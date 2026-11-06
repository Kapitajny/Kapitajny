import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/kontakt/route";

function tomorrow() {
  const d = new Date(Date.now() + 2 * 86_400_000);
  return d.toISOString().slice(0, 10);
}

const body = () => ({
  name: "Jan Kowalski",
  phone: "500 600 700",
  email: "jan@example.com",
  service: "transport-pacjentow-lezacych",
  pickup: "Grodzisk Mazowiecki",
  destination: "Warszawa",
  date: tomorrow(),
  time: "",
  message: "",
  consent: true,
});

let ip = 0;
function request(payload: unknown) {
  ip += 1;
  return new Request("http://localhost/api/kontakt", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${ip}` },
    body: JSON.stringify(payload),
  });
}

const ENV_KEYS = ["CONTACT_WEBHOOK_URL", "CONTACT_WEBHOOK_SECRET", "RESEND_API_KEY", "CONTACT_EMAIL_TO", "CONTACT_EMAIL_FROM"];

beforeEach(() => {
  for (const k of ENV_KEYS) delete process.env[k];
});
afterEach(() => {
  vi.restoreAllMocks();
  for (const k of ENV_KEYS) delete process.env[k];
});

describe("POST /api/kontakt", () => {
  it("returns 422 with field errors for invalid input", async () => {
    const res = await POST(request({ ...body(), email: "zly", consent: false }));
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.error.fields.email).toBeDefined();
    expect(data.error.fields.consent).toBeDefined();
  });

  it("does not pretend to send when no delivery channel is configured", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const res = await POST(request(body()));
    expect(res.status).toBe(503);
    expect((await res.json()).error.code).toBe("NOT_CONFIGURED");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("delivers to the configured webhook and returns a reference", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/kontakt";
    process.env.CONTACT_WEBHOOK_SECRET = "s3cret";
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok", { status: 200 }));
    const res = await POST(request(body()));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reference).toMatch(/^VM-[A-Z0-9]{6}$/);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://hooks.example.com/kontakt");
    expect((init!.headers as Record<string, string>).Authorization).toBe("Bearer s3cret");
    const sent = JSON.parse(init!.body as string);
    expect(sent.serviceLabel).toBe("Transport pacjentów leżących");
    expect(sent.reference).toBe(data.reference);
  });

  it("sends an e-mail through Resend when configured", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.CONTACT_EMAIL_TO = "biuro@example.com, dyspozytornia@example.com";
    process.env.CONTACT_EMAIL_FROM = "Strona <formularz@example.com>";
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));
    const res = await POST(request(body()));
    expect(res.status).toBe(200);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    const sent = JSON.parse(init!.body as string);
    expect(sent.to).toEqual(["biuro@example.com", "dyspozytornia@example.com"]);
    expect(sent.reply_to).toBe("jan@example.com");
  });

  it("returns 502 when the provider fails", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/kontakt";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("err", { status: 500 }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(request(body()));
    expect(res.status).toBe(502);
  });

  it("silently drops honeypot submissions", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/kontakt";
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const res = await POST(request({ ...body(), company_website: "http://spam" }));
    expect(res.status).toBe(200);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rate limits repeated requests from one address", async () => {
    const make = () =>
      new Request("http://localhost/api/kontakt", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": "10.9.9.9" }, body: "{}" });
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await POST(make())).status);
    expect(statuses.slice(0, 5).every((s) => s === 422)).toBe(true);
    expect(statuses[5]).toBe(429);
  });
});
