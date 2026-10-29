import { describe, expect, it } from "vitest";
import { buildOrderQuote } from "@/lib/order-quote";
import { defaultCalculatorInput } from "@/lib/pricing/calculator";
import { createOrder, getOrderForSession, listOrdersForSession, payOrder } from "@/lib/server/orders";
import { emptyOrderCustomer } from "@/lib/validation/order";

const customer = { ...emptyOrderCustomer, name: "Jan", email: "jan@przyklad.pl", acceptTerms: true, acceptDemo: true };

describe("wycena zamówienia", () => {
  it("rozdziela opłatę miesięczną i jednorazową", () => {
    const q = buildOrderQuote("biznes", null);
    expect(q.ok).toBe(true);
    if (q.ok) {
      expect(q.monthly).toBe(1200);
      expect(q.oneTimeFee).toBe(500);
      expect(q.dueNow).toBe(1700);
    }
  });

  it("nie pozwala zamówić pakietu Enterprise ani nieznanego pakietu", () => {
    expect(buildOrderQuote("enterprise", null)).toMatchObject({ ok: false, reason: "individual-quote" });
    expect(buildOrderQuote("gold", null)).toMatchObject({ ok: false, reason: "unknown-package" });
  });

  it("dla konfiguracji z kalkulatora liczy cenę z kalkulatora", () => {
    const q = buildOrderQuote(null, { ...defaultCalculatorInput, documents: 50 });
    expect(q.ok && q.monthly).toBe(970);
    expect(q.ok && q.pkg.id).toBe("start");
  });
});

describe("zamówienia i płatności demonstracyjne", () => {
  it("tworzy zamówienie z maskowanym e-mailem i kwotami z serwera", () => {
    const r = createOrder({ sessionId: "a".repeat(32), packageId: "pro", calculator: null, customer });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.order.number).toMatch(/^DEMO-ZAM-\d{4}-[0-9A-Z]{7}$/);
    expect(r.order.customer.emailMasked).toBe("j***@przyklad.pl");
    expect(JSON.stringify(r.order)).not.toContain("jan@przyklad.pl");
    expect(r.order.dueNow).toBe(2500 + 900);
    expect(r.order.status).toBe("awaiting_payment");
  });

  it("nie udostępnia zamówienia innej sesji", () => {
    const r = createOrder({ sessionId: "b".repeat(32), packageId: "start", calculator: null, customer });
    if (!r.ok) throw new Error("order not created");
    expect(getOrderForSession(r.order.id, "c".repeat(32))).toBeUndefined();
    expect(getOrderForSession(r.order.id, null)).toBeUndefined();
    expect(getOrderForSession(r.order.id, "b".repeat(32))?.id).toBe(r.order.id);
    expect(listOrdersForSession("c".repeat(32))).toHaveLength(0);
  });

  it("obsługuje scenariusz błędu, a potem sukcesu, i blokuje podwójną płatność", async () => {
    const session = "d".repeat(32);
    const r = createOrder({ sessionId: session, packageId: "biznes", calculator: null, customer });
    if (!r.ok) throw new Error("order not created");

    const failed = await payOrder({ id: r.order.id, sessionId: session, method: "karta", scenario: "declined" });
    expect(failed.ok && failed.order.status).toBe("failed");
    expect(failed.ok && failed.payment.message).toMatch(/odmowa/i);

    const ok = await payOrder({ id: r.order.id, sessionId: session, method: "blik", scenario: "success" });
    expect(ok.ok && ok.order.status).toBe("paid");
    expect(ok.ok && ok.payment.message).toMatch(/Nie pobrano żadnych środków/);
    expect(ok.ok && ok.order.payments).toHaveLength(2);

    const again = await payOrder({ id: r.order.id, sessionId: session, method: "blik", scenario: "success" });
    expect(again).toMatchObject({ ok: false, status: 409 });

    const foreign = await payOrder({ id: r.order.id, sessionId: "e".repeat(32), method: "blik", scenario: "success" });
    expect(foreign).toMatchObject({ ok: false, status: 404 });
  });
});
