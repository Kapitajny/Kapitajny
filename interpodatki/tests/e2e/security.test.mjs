import assert from "node:assert/strict";
import { after, describe, test } from "node:test";
import { BASE_URL, closeBrowser, openPage } from "./helpers.mjs";

after(closeBrowser);

const json = (data, extraHeaders = {}) => ({
  headers: { "content-type": "application/json", origin: BASE_URL, ...extraHeaders },
  data,
});

describe("bezpieczeństwo i walidacja API", () => {
  test("nagłówki bezpieczeństwa są ustawione", async () => {
    const { page } = await openPage();
    const res = await page.request.get(`${BASE_URL}/`);
    const h = res.headers();
    assert.match(h["content-security-policy"], /default-src 'self'/);
    assert.match(h["content-security-policy"], /frame-ancestors 'none'/);
    assert.equal(h["x-content-type-options"], "nosniff");
    assert.equal(h["x-frame-options"], "DENY");
    assert.ok(h["referrer-policy"]);
    assert.equal(h["x-powered-by"], undefined);
  });

  test("API odrzuca żądania z obcej domeny, zły format i zbyt duże dane", async () => {
    const { page } = await openPage();
    const url = `${BASE_URL}/api/demo/orders`;
    const foreign = await page.request.post(url, json({ packageId: "start" }, { origin: "https://evil.example" }));
    assert.equal(foreign.status(), 403);
    const wrongType = await page.request.post(url, { headers: { "content-type": "text/plain", origin: BASE_URL }, data: "x" });
    assert.equal(wrongType.status(), 415);
    const broken = await page.request.post(url, { headers: { "content-type": "application/json", origin: BASE_URL }, data: "{nie-json" });
    assert.equal(broken.status(), 400);
    const huge = await page.request.post(url, json({ packageId: "start", pad: "x".repeat(20_000) }));
    assert.equal(huge.status(), 413);
  });

  test("serwer ignoruje cenę podaną przez klienta i waliduje dane", async () => {
    const { page } = await openPage();
    const invalid = await page.request.post(`${BASE_URL}/api/demo/orders`, json({ packageId: "start", customer: { name: "", email: "x" } }));
    assert.equal(invalid.status(), 422);
    const body = await invalid.json();
    assert.ok(body.errors.name && body.errors.email && body.errors.acceptTerms);

    const res = await page.request.post(
      `${BASE_URL}/api/demo/orders`,
      json({
        packageId: "premium",
        monthly: 1,
        dueNow: 0,
        customer: { name: "Jan", email: "jan@przyklad.pl", acceptTerms: true, acceptDemo: true },
      }),
    );
    assert.equal(res.status(), 201);
    const { order } = await res.json();
    assert.equal(order.monthly, 5000);
    assert.equal(order.dueNow, 6500);
    assert.equal(order.customer.emailMasked, "j***@przyklad.pl");

    const enterprise = await page.request.post(
      `${BASE_URL}/api/demo/orders`,
      json({ packageId: "enterprise", customer: { name: "Jan", email: "jan@przyklad.pl", acceptTerms: true, acceptDemo: true } }),
    );
    assert.equal(enterprise.status(), 422);
  });

  test("zamówienie jest dostępne tylko w sesji, która je utworzyła", async () => {
    const owner = await openPage();
    const res = await owner.page.request.post(
      `${BASE_URL}/api/demo/orders`,
      json({ packageId: "start", customer: { name: "Jan", email: "jan@przyklad.pl", acceptTerms: true, acceptDemo: true } }),
    );
    const { order } = await res.json();
    const cookies = await owner.context.cookies();
    const session = cookies.find((c) => c.name === "ip_demo_session");
    assert.ok(session?.httpOnly, "ciasteczko sesji ma flagę HttpOnly");
    assert.equal(session.sameSite, "Lax");

    const stranger = await openPage();
    const read = await stranger.page.request.get(`${BASE_URL}/api/demo/orders/${order.id}`);
    assert.equal(read.status(), 404);
    const pay = await stranger.page.request.post(`${BASE_URL}/api/demo/orders/${order.id}/payment`, json({ method: "blik", scenario: "success" }));
    assert.equal(pay.status(), 404);
    const badMethod = await owner.page.request.post(`${BASE_URL}/api/demo/orders/${order.id}/payment`, json({ method: "toString", scenario: "success" }));
    assert.equal(badMethod.status(), 422);
    const ownRead = await owner.page.request.get(`${BASE_URL}/api/demo/orders/${order.id}`);
    assert.equal(ownRead.status(), 200);
  });

  test("ochrona antyspamowa formularzy: pole-pułapka i minimalny czas", async () => {
    const { page } = await openPage();
    const values = { name: "Jan", email: "jan@przyklad.pl", topic: "inne", message: "Treść wiadomości testowej.", consent: true };
    const bot = await page.request.post(`${BASE_URL}/api/demo/inquiries`, json({ kind: "kontakt", values, website: "http://spam", startedAt: 0 }));
    assert.equal(bot.status(), 400);
    const tooFast = await page.request.post(`${BASE_URL}/api/demo/inquiries`, json({ kind: "kontakt", values, startedAt: Date.now() }));
    assert.equal(tooFast.status(), 400);
    const ok = await page.request.post(`${BASE_URL}/api/demo/inquiries`, json({ kind: "kontakt", values, startedAt: Date.now() - 5000 }));
    assert.equal(ok.status(), 201);
    const xss = await page.request.post(
      `${BASE_URL}/api/demo/inquiries`,
      json({ kind: "kontakt", values: { ...values, message: "<img src=x onerror=alert(1)>" }, startedAt: Date.now() - 5000 }),
    );
    assert.equal(xss.status(), 422);
  });

  test("brak sekretów i kluczy w kodzie wysyłanym do przeglądarki", async () => {
    const { page } = await openPage();
    const scripts = [];
    page.on("response", async (r) => {
      if (r.url().endsWith(".js")) scripts.push(await r.text().catch(() => ""));
    });
    await page.goto(`${BASE_URL}/platnosc-demo`, { waitUntil: "networkidle" });
    await page.goto(`${BASE_URL}/kalkulator`, { waitUntil: "networkidle" });
    const all = scripts.join("\n");
    assert.ok(all.length > 1000);
    assert.doesNotMatch(all, /sk_(live|test)_[A-Za-z0-9]{8,}|PAYMENT_API_KEY=|WEBHOOK_SECRET=/);
  });
});
