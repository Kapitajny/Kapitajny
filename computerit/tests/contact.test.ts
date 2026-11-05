import { afterEach, describe, expect, it, vi } from "vitest";
import { validateContact } from "@/lib/contact";
import { POST } from "@/app/api/contact/route";
import { describeInquiry } from "@/lib/server/delivery";

const valid = {
  name: "Anna",
  email: "Anna@Example.com ",
  company: "",
  projectType: "strona",
  budget: "1500-3000",
  message: "Potrzebuję strony dla gabinetu fizjoterapii z opisem usług.",
  consent: true,
};

const request = (body: unknown, ip = "10.0.0.1") =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });

describe("validateContact", () => {
  it("akceptuje poprawne dane i normalizuje e-mail", () => {
    const result = validateContact(valid);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.email).toBe("anna@example.com");
  });

  it("zwraca błędy dla brakujących pól", () => {
    const result = validateContact({ consent: false });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["budget", "consent", "email", "message", "name", "projectType"]);
  });

  it("odrzuca nieznany rodzaj projektu i budżet", () => {
    const result = validateContact({ ...valid, projectType: "aplikacja", budget: "milion" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toMatchObject({ projectType: expect.any(String), budget: expect.any(String) });
  });

  it("odrzuca błędny e-mail i zbyt krótką wiadomość", () => {
    const result = validateContact({ ...valid, email: "anna@", message: "Hej" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toMatchObject({ email: expect.any(String), message: expect.any(String) });
  });
});

describe("POST /api/contact", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("nie udaje wysyłki, gdy brak konfiguracji", async () => {
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("CONTACT_WEBHOOK_URL", "");
    const response = await POST(request(valid, "10.0.0.2"));
    expect(response.status).toBe(503);
    expect((await response.json()).error.code).toBe("FORM_NOT_CONFIGURED");
  });

  it("zwraca błędy walidacji dla pól", async () => {
    const response = await POST(request({ ...valid, email: "x" }, "10.0.0.3"));
    expect(response.status).toBe(422);
    expect((await response.json()).error.fields.email).toBeTruthy();
  });

  it("przekazuje zapytanie do webhooka", async () => {
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://hooks.example.test/contact");
    vi.stubEnv("CONTACT_WEBHOOK_SECRET", "s3cret");
    const fetchMock = vi.fn(async () => new Response("ok"));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request(valid, "10.0.0.4"));
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://hooks.example.test/contact");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer s3cret");
    expect(JSON.parse(init.body as string)).toMatchObject({ email: "anna@example.com", projectTypeLabel: "Strona internetowa" });
  });

  it("zgłasza błąd, gdy webhook odpowiada błędem", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://hooks.example.test/contact");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await POST(request(valid, "10.0.0.5"));
    expect(response.status).toBe(502);
  });

  it("po cichu ignoruje boty wypełniające pole-pułapkę", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://hooks.example.test/contact");
    const response = await POST(request({ ...valid, website: "http://spam.example" }, "10.0.0.6"));
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ogranicza liczbę zapytań z jednego adresu", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) statuses.push((await POST(request({}, "10.0.0.7"))).status);
    expect(statuses.at(-1)).toBe(429);
  });
});

describe("describeInquiry", () => {
  it("escapuje HTML w treści wiadomości", () => {
    const result = validateContact({ ...valid, message: "<script>alert(1)</script> i dłuższy opis projektu" });
    if (!result.ok) throw new Error("invalid");
    const { html, subject } = describeInquiry(result.data);
    expect(html).not.toContain("<script>");
    expect(subject).toContain("Strona internetowa");
  });
});
