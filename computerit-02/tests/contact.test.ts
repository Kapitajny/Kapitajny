import { afterEach, describe, expect, it, vi } from "vitest";
import { validateContact } from "@/lib/contact";
import { POST } from "@/app/api/contact/route";
import { describeInquiry } from "@/lib/server/delivery";

const valid = {
  name: "Anna Nowak",
  company: "",
  email: "Anna@Example.com ",
  phone: "",
  service: "strona",
  budget: "",
  message: "Potrzebuję strony dla gabinetu fizjoterapii z opisem usług i formularzem.",
  privacy: true,
};

const request = (body: unknown, ip = "10.0.0.1") =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });

describe("validateContact", () => {
  it("akceptuje poprawne dane z pustymi polami opcjonalnymi i normalizuje e-mail", () => {
    const result = validateContact(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.email).toBe("anna@example.com");
      expect(result.data.budget).toBe("");
    }
  });

  it("zwraca błędy dla brakujących pól wymaganych", () => {
    const result = validateContact({ privacy: false });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["email", "message", "name", "privacy", "service"]);
  });

  it("odrzuca nieznaną usługę i budżet spoza listy", () => {
    const result = validateContact({ ...valid, service: "aplikacja", budget: "milion" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toMatchObject({ service: expect.any(String), budget: expect.any(String) });
  });

  it("akceptuje wszystkie budżety z formularza", () => {
    for (const budget of ["do-1000", "1000-2000", "2000-5000", "powyzej-5000", "nie-wiem"]) {
      expect(validateContact({ ...valid, budget }).ok).toBe(true);
    }
  });

  it("sprawdza format e-maila i telefonu", () => {
    for (const email of ["anna@", "anna@example", "anna example.com", "anna@@example.com"]) {
      const result = validateContact({ ...valid, email });
      expect(result.ok, email).toBe(false);
    }
    expect(validateContact({ ...valid, phone: "12ab" }).ok).toBe(false);
    expect(validateContact({ ...valid, phone: "+48 600 000 000" }).ok).toBe(true);
  });

  it("wymaga opisu projektu o sensownej długości", () => {
    const result = validateContact({ ...valid, message: "Hej" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBeTruthy();
  });

  it("oczyszcza odnośnik do projektu z portfolio", () => {
    const result = validateContact({ ...valid, reference: "neon-nami<script>" });
    expect(result.ok && result.data.reference).toBe("neon-namiscript");
  });
});

describe("POST /api/contact", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("nie udaje wysyłki, gdy brak konfiguracji", async () => {
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("CONTACT_WEBHOOK_URL", "");
    const response = await POST(request(valid, "10.0.0.2"));
    expect(response.status).toBe(503);
    expect((await response.json()).error.code).toBe("FORM_NOT_CONFIGURED");
  });

  it("zwraca błędy walidacji przypisane do pól", async () => {
    const response = await POST(request({ ...valid, email: "x" }, "10.0.0.3"));
    expect(response.status).toBe(422);
    expect((await response.json()).error.fields.email).toBeTruthy();
  });

  it("odrzuca treść, która nie jest JSON-em", async () => {
    const response = await POST(new Request("http://localhost/api/contact", { method: "POST", body: "name=x", headers: { "x-forwarded-for": "10.0.0.9" } }));
    expect(response.status).toBe(400);
  });

  it("przekazuje zapytanie do webhooka z etykietami", async () => {
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://hooks.example.test/contact");
    vi.stubEnv("CONTACT_WEBHOOK_SECRET", "s3cret");
    const fetchMock = vi.fn(async () => new Response("ok"));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ ...valid, service: "sklep", budget: "2000-5000", reference: "neon-nami" }, "10.0.0.4"));
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://hooks.example.test/contact");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer s3cret");
    expect(JSON.parse(init.body as string)).toMatchObject({
      email: "anna@example.com",
      serviceLabel: "Sklep internetowy",
      budgetLabel: "2 000–5 000 zł",
      referenceName: "NEON NAMI",
    });
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
  it("escapuje HTML w treści i nie przepuszcza nowych linii do tematu", () => {
    const result = validateContact({ ...valid, name: "Anna\nBcc: x@y.pl", message: "<script>alert(1)</script> i dłuższy opis projektu" });
    if (!result.ok) throw new Error("invalid");
    const { html, subject } = describeInquiry(result.data);
    expect(html).not.toContain("<script>");
    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject).toContain("Strona internetowa");
  });
});
