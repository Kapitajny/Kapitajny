import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { deliverContact, getDeliveryMode } from "@/lib/contact/delivery";
import type { ContactData } from "@/lib/contact/schema";

const data: ContactData = {
  name: "Anna <b>",
  email: "anna@firma.pl",
  company: null,
  service: "obsluga-it",
  scope: "projekt",
  message: "Treść z <script>alert(1)</script>",
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("getDeliveryMode", () => {
  it("rozpoznaje tryb na podstawie zmiennych środowiskowych", () => {
    expect(getDeliveryMode({})).toBe("demo");
    expect(getDeliveryMode({ RESEND_API_KEY: "k", CONTACT_TO_EMAIL: "a@b.pl" })).toBe("demo");
    expect(getDeliveryMode({ RESEND_API_KEY: "k", CONTACT_TO_EMAIL: "a@b.pl", CONTACT_FROM_EMAIL: "c@d.pl" })).toBe("resend");
    expect(getDeliveryMode({ CONTACT_WEBHOOK_URL: "https://hook.example" })).toBe("webhook");
  });
});

describe("deliverContact", () => {
  it("w trybie demonstracyjnym niczego nie wysyła", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(deliverContact(data, {})).resolves.toEqual({ delivered: false, mode: "demo", reason: "not-configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("wysyła e-mail przez Resend z escapowaną treścią HTML i adresem do odpowiedzi", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await deliverContact(data, { RESEND_API_KEY: "re_test", CONTACT_TO_EMAIL: "a@b.pl, c@d.pl", CONTACT_FROM_EMAIL: "Strona <x@y.pl>" });
    expect(result).toEqual({ delivered: true });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_test");
    const body = JSON.parse(init.body);
    expect(body.to).toEqual(["a@b.pl", "c@d.pl"]);
    expect(body.reply_to).toBe("anna@firma.pl");
    expect(body.html).not.toContain("<script>");
    expect(body.html).toContain("&lt;script&gt;");
    expect(body.text).toContain("Usługa: Obsługa IT");
  });

  it("podpisuje żądanie webhooka HMAC-iem", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    await deliverContact(data, { CONTACT_WEBHOOK_URL: "https://hook.example/in", CONTACT_WEBHOOK_SECRET: "sekret" });
    const [, init] = fetchMock.mock.calls[0]!;
    const expected = createHmac("sha256", "sekret").update(init.body).digest("hex");
    expect(init.headers["X-Signature-SHA256"]).toBe(expected);
  });

  it("zgłasza błąd dostawcy bez logowania danych osobowych", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("no", { status: 500 })));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await deliverContact(data, { CONTACT_WEBHOOK_URL: "https://hook.example/in" });
    expect(result).toEqual({ delivered: false, mode: "webhook", reason: "provider-error" });
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).not.toContain("anna@firma.pl");
    expect(logged).not.toContain("Treść");
  });

  it("obsługuje błąd sieci", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(deliverContact(data, { CONTACT_WEBHOOK_URL: "https://hook.example/in" })).resolves.toMatchObject({ reason: "network-error" });
  });
});
