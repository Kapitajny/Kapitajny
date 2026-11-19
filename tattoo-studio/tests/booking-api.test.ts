import { createHmac } from "node:crypto";
import { mkdtemp, readFile, readdir, stat } from "node:fs/promises";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { handleBookingRequest } from "@/lib/server/booking";
import type { DeliveryConfig } from "@/lib/server/env";
import { resetRateLimits } from "@/lib/server/http";
import { VALID } from "./fixtures";

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1]);
const NONE: DeliveryConfig = { smtp: null, webhook: null, storageDir: null, turnstileSecret: null };

// Daty w danych testowych muszą być w przyszłości względem bieżącej daty.
const future = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);
const DATA = { ...VALID, preferredDate: future };

let ipCounter = 0;

function makeRequest({
  data = DATA as object,
  meta = {},
  files = [] as { bytes: Uint8Array<ArrayBuffer>; name: string; type: string }[],
  ip = `10.0.0.${++ipCounter}`,
} = {}): Request {
  const form = new FormData();
  form.append("data", JSON.stringify(data));
  form.append("meta", JSON.stringify({ submissionId: crypto.randomUUID(), startedAt: Date.now() - 60_000, website: "", ...meta }));
  for (const f of files) form.append("references", new Blob([f.bytes], { type: f.type }), f.name);
  return new Request("http://localhost/api/booking", { method: "POST", body: form, headers: { "x-forwarded-for": ip } });
}

async function storageConfig(): Promise<DeliveryConfig> {
  return { ...NONE, storageDir: await mkdtemp(join(tmpdir(), "bookings-")) };
}

beforeEach(() => resetRateLimits());

describe("POST /api/booking", () => {
  it("refuses honestly when no delivery channel is configured", async () => {
    const response = await handleBookingRequest(makeRequest(), NONE);
    expect(response.status).toBe(503);
    expect((await response.json()).error.code).toBe("not_configured");
  });

  it("rejects the honeypot and instant submissions", async () => {
    const config = await storageConfig();
    expect((await handleBookingRequest(makeRequest({ meta: { website: "spam.example" } }), config)).status).toBe(400);
    expect((await handleBookingRequest(makeRequest({ meta: { startedAt: Date.now() - 500 } }), config)).status).toBe(400);
  });

  it("validates on the server and returns field errors", async () => {
    const response = await handleBookingRequest(makeRequest({ data: { ...DATA, email: "nope", privacyAccepted: false } }), await storageConfig());
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(Object.keys(body.error.fieldErrors).sort()).toEqual(["email", "privacyAccepted"]);
  });

  it("rejects files that are not real images, whatever their name", async () => {
    const svg = new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'></svg>");
    const response = await handleBookingRequest(makeRequest({ files: [{ bytes: svg, name: "photo.jpg", type: "image/jpeg" }] }), await storageConfig());
    expect(response.status).toBe(422);
    expect((await response.json()).error.code).toBe("invalid_file");
  });

  it("rejects more than the allowed number of files", async () => {
    const files = Array.from({ length: 6 }, (_, i) => ({ bytes: JPEG, name: `${i}.jpg`, type: "image/jpeg" }));
    expect((await handleBookingRequest(makeRequest({ files }), await storageConfig())).status).toBe(422);
  });

  it("stores an accepted request privately with sanitised file names", async () => {
    const config = await storageConfig();
    const response = await handleBookingRequest(
      makeRequest({ files: [{ bytes: JPEG, name: "../../etc/passwd.jpg", type: "image/jpeg" }] }),
      config,
    );
    expect(response.status).toBe(201);
    const { ok, reference } = await response.json();
    expect(ok).toBe(true);
    expect(reference).toMatch(/^SUMI-\d{6}-[0-9A-Z]{4}$/);

    const [year] = await readdir(config.storageDir!);
    const [month] = await readdir(join(config.storageDir!, year));
    const dir = join(config.storageDir!, year, month, reference);
    expect((await readdir(dir)).sort()).toEqual(["reference-1.jpg", "request.json"]);
    const saved = JSON.parse(await readFile(join(dir, "request.json"), "utf8"));
    expect(saved.data.email).toBe("anna@example.com");
    expect((await stat(join(dir, "request.json"))).mode & 0o777).toBe(0o600);
  });

  it("does not deliver the same submission twice", async () => {
    const config = await storageConfig();
    const submissionId = crypto.randomUUID();
    const first = await (await handleBookingRequest(makeRequest({ meta: { submissionId } }), config)).json();
    const second = await (await handleBookingRequest(makeRequest({ meta: { submissionId } }), config)).json();
    expect(second.reference).toBe(first.reference);
  });

  it("limits repeated submissions from one address", async () => {
    const config = await storageConfig();
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) statuses.push((await handleBookingRequest(makeRequest({ ip: "203.0.113.9" }), config)).status);
    expect(statuses.slice(0, 5).every((s) => s === 201)).toBe(true);
    expect(statuses[5]).toBe(429);
  });

  it("sends a signed webhook and fails honestly when the studio can't be notified", async () => {
    const received: { headers: Record<string, string | string[] | undefined>; body: string }[] = [];
    const server = createServer((req, res) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        received.push({ headers: req.headers, body });
        res.writeHead(200).end("ok");
      });
    });
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const port = (server.address() as AddressInfo).port;

    try {
      const secret = "test-secret";
      const ok = await handleBookingRequest(
        makeRequest({ files: [{ bytes: JPEG, name: "a.jpg", type: "image/jpeg" }] }),
        { ...NONE, webhook: { url: `http://localhost:${port}/hook`, secret } },
      );
      expect(ok.status).toBe(201);
      const [hit] = received;
      const expected = createHmac("sha256", secret).update(`${hit.headers["x-booking-timestamp"]}.${hit.body}`).digest("hex");
      expect(hit.headers["x-booking-signature"]).toBe(`sha256=${expected}`);
      const payload = JSON.parse(hit.body);
      expect(payload.attachments[0]).toMatchObject({ filename: "reference-1.jpg", contentType: "image/jpeg" });

      // Webhook nieosiągalny: zapis w archiwum nie wystarcza, bo studio nie dostałoby powiadomienia.
      const storage = await storageConfig();
      const failed = await handleBookingRequest(makeRequest(), { ...storage, webhook: { url: "http://localhost:1/hook", secret: "" } });
      expect(failed.status).toBe(502);
      expect((await failed.json()).error.code).toBe("delivery_failed");
    } finally {
      server.close();
    }
  });
});
