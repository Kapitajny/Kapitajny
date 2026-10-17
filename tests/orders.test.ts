import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.ORDERS_DB_PATH = ":memory:";
process.env.STRIPE_SECRET_KEY = "sk_test_dummy";

const createSession = vi.fn();
const expireSession = vi.fn();
vi.mock("@/lib/server/stripe", () => ({
  getStripe: () => ({ checkout: { sessions: { create: createSession, expire: expireSession, retrieve: vi.fn() } } }),
}));

const { getDefaultSelection } = await import("@/lib/pricing");
const { getProduct } = await import("@/data/menu");
const { validateCheckout } = await import("@/lib/validation");
const { getDb } = await import("@/lib/server/db");
const { findOrderById } = await import("@/lib/server/orders");
const { startCheckout, handleStripeEvent, cancelPendingOrder, CheckoutError } = await import("@/lib/server/payments");

const NOW = { date: "2026-10-14", minutes: 9 * 60 };

function checkoutInput(overrides: Record<string, unknown> = {}) {
  return {
    items: [{ productId: "cappuccino", options: { ...getDefaultSelection(getProduct("cappuccino")!), milk: "oat" }, quantity: 2 }],
    locationId: "wrzeszcz",
    pickup: { date: "2026-10-14", time: "10:00" },
    customer: { name: "Anna", email: "Anna@Example.com" },
    acceptTerms: true,
    idempotencyKey: crypto.randomUUID(),
    ...overrides,
  };
}

function valid(overrides: Record<string, unknown> = {}) {
  const result = validateCheckout(checkoutInput(overrides), NOW);
  if (!result.ok) throw new Error(result.message);
  return result.value;
}

let sessionCounter = 0;
beforeEach(() => {
  getDb().exec("DELETE FROM orders; DELETE FROM stripe_events;");
  createSession.mockReset();
  createSession.mockImplementation(async (params: { line_items: unknown[] }) => ({
    id: `cs_test_${++sessionCounter}`,
    url: `https://checkout.stripe.com/c/pay/cs_test_${sessionCounter}`,
    expires_at: Math.floor(Date.now() / 1000) + 1800,
    params,
  }));
  expireSession.mockReset();
});

function sessionEvent(type: string, orderId: string, extra: Record<string, unknown> = {}) {
  return {
    id: `evt_${crypto.randomUUID()}`,
    type,
    data: {
      object: {
        id: findOrderById(orderId)!.stripeSessionId,
        metadata: { order_id: orderId },
        amount_total: findOrderById(orderId)!.total,
        currency: "pln",
        payment_status: "paid",
        payment_intent: "pi_test_1",
        ...extra,
      },
    },
  } as never;
}

describe("walidacja zamówienia", () => {
  it("normalizuje e-mail i wylicza kwotę z katalogu", () => {
    const value = valid();
    expect(value.customer.email).toBe("anna@example.com");
    expect(value.total).toBe(2 * (1600 + 300));
  });

  it("odrzuca brak akceptacji regulaminu, zły lokal i godzinę spoza grafiku", () => {
    expect(validateCheckout(checkoutInput({ acceptTerms: false }), NOW)).toMatchObject({ ok: false, field: "acceptTerms" });
    expect(validateCheckout(checkoutInput({ locationId: "sopot" }), NOW)).toMatchObject({ ok: false, field: "location" });
    expect(validateCheckout(checkoutInput({ pickup: { date: "2026-10-14", time: "06:00" } }), NOW)).toMatchObject({ ok: false, field: "pickup" });
    expect(validateCheckout(checkoutInput({ customer: { name: "A", email: "x@y.pl" } }), NOW)).toMatchObject({ ok: false, field: "name" });
    expect(validateCheckout(checkoutInput({ customer: { name: "Anna", email: "nie-email" } }), NOW)).toMatchObject({ ok: false, field: "email" });
  });

  it("ignoruje cenę podsuniętą przez klienta", () => {
    const value = valid({
      items: [{ productId: "espresso", options: getDefaultSelection(getProduct("espresso")!), quantity: 1, unitPrice: 1, price: 1 }],
    });
    expect(value.total).toBe(1000);
  });
});

describe("startCheckout", () => {
  it("tworzy zamówienie oczekujące i sesję Stripe z cenami z serwera", async () => {
    const value = valid();
    const result = await startCheckout(value, "https://noir.test");
    const order = findOrderById(result.orderId)!;
    expect(order.status).toBe("pending");
    expect(order.stripeSessionId).toBe("cs_test_" + sessionCounter);

    const params = createSession.mock.calls[0][0];
    expect(params.line_items[0].price_data.unit_amount).toBe(1900);
    expect(params.line_items[0].quantity).toBe(2);
    expect(params.currency).toBe("pln");
    expect(params.metadata.order_id).toBe(order.id);
    expect(params.success_url).toBe("https://noir.test/zamowienie/sukces?session_id={CHECKOUT_SESSION_ID}");
  });

  it("ponowne wysłanie z tym samym kluczem nie tworzy drugiego zamówienia ani sesji", async () => {
    const value = valid();
    const first = await startCheckout(value, "https://noir.test");
    const second = await startCheckout(value, "https://noir.test");
    expect(second).toEqual(first);
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(getDb().prepare("SELECT COUNT(*) AS n FROM orders").get()).toEqual({ n: 1 });
  });

  it("ten sam klucz z inną treścią jest odrzucany", async () => {
    const key = crypto.randomUUID();
    await startCheckout(valid({ idempotencyKey: key }), "https://noir.test");
    await expect(startCheckout(valid({ idempotencyKey: key, locationId: "oliwa" }), "https://noir.test")).rejects.toMatchObject({ code: "PAYLOAD_MISMATCH" });
  });

  it("błąd Stripe pozostawia zamówienie do ponowienia bez duplikatu", async () => {
    createSession.mockRejectedValueOnce(new Error("network"));
    const value = valid();
    await expect(startCheckout(value, "https://noir.test")).rejects.toBeInstanceOf(CheckoutError);
    const retry = await startCheckout(value, "https://noir.test");
    expect(retry.url).toContain("checkout.stripe.com");
    expect(getDb().prepare("SELECT COUNT(*) AS n FROM orders").get()).toEqual({ n: 1 });
  });
});

describe("webhook Stripe", () => {
  it("oznacza zamówienie jako opłacone tylko po potwierdzeniu płatności", async () => {
    const { orderId } = await startCheckout(valid(), "https://noir.test");
    handleStripeEvent(sessionEvent("checkout.session.completed", orderId, { payment_status: "unpaid" }));
    expect(findOrderById(orderId)!.status).toBe("pending");

    handleStripeEvent(sessionEvent("checkout.session.async_payment_succeeded", orderId));
    const order = findOrderById(orderId)!;
    expect(order.status).toBe("paid");
    expect(order.paidAt).not.toBeNull();
    expect(order.stripePaymentIntentId).toBe("pi_test_1");
  });

  it("ignoruje duplikaty zdarzeń", async () => {
    const { orderId } = await startCheckout(valid(), "https://noir.test");
    const event = sessionEvent("checkout.session.completed", orderId);
    expect(handleStripeEvent(event)).toEqual({ handled: true, duplicate: false });
    expect(handleStripeEvent(event)).toEqual({ handled: false, duplicate: true });
  });

  it("nie oznacza jako opłacone przy niezgodnej kwocie", async () => {
    const { orderId } = await startCheckout(valid(), "https://noir.test");
    handleStripeEvent(sessionEvent("checkout.session.completed", orderId, { amount_total: 1 }));
    const order = findOrderById(orderId)!;
    expect(order.status).toBe("pending");
    expect(order.statusNote).toMatch(/niezgodna/);

    // Późniejsze poprawne potwierdzenie usuwa notatkę o niezgodności.
    handleStripeEvent(sessionEvent("checkout.session.completed", orderId));
    expect(findOrderById(orderId)).toMatchObject({ status: "paid", statusNote: null });
  });

  it("wygaśnięcie sesji anuluje zamówienie, a nieudana płatność oznacza je jako nieudane", async () => {
    const a = await startCheckout(valid(), "https://noir.test");
    handleStripeEvent(sessionEvent("checkout.session.expired", a.orderId, { payment_status: "unpaid" }));
    expect(findOrderById(a.orderId)!.status).toBe("cancelled");

    const b = await startCheckout(valid(), "https://noir.test");
    handleStripeEvent(sessionEvent("checkout.session.async_payment_failed", b.orderId, { payment_status: "unpaid" }));
    expect(findOrderById(b.orderId)!.status).toBe("failed");
  });

  it("opłacone zamówienie nie wraca do statusu anulowanego", async () => {
    const { orderId } = await startCheckout(valid(), "https://noir.test");
    handleStripeEvent(sessionEvent("checkout.session.completed", orderId));
    handleStripeEvent(sessionEvent("checkout.session.expired", orderId));
    expect(findOrderById(orderId)!.status).toBe("paid");
  });

  it("po anulowaniu z tym samym kluczem trzeba rozpocząć nową próbę", async () => {
    const value = valid();
    const { orderId } = await startCheckout(value, "https://noir.test");
    expireSession.mockResolvedValueOnce({});
    expect(await cancelPendingOrder(orderId)).toBe("cancelled");
    await expect(startCheckout(value, "https://noir.test")).rejects.toMatchObject({ code: "ATTEMPT_CLOSED" });
  });
});
