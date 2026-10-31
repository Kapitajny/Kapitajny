import { beforeEach, describe, expect, it } from "vitest";
import type Stripe from "stripe";
import { resetDbForTests } from "@/lib/server/db";
import { countDownloads, downloadLinksForOrder, recordDownload } from "@/lib/server/downloads";
import { orderPaidEmail } from "@/lib/server/email";
import { attachCheckoutSession, createPendingOrder, findOrderById } from "@/lib/server/orders";
import { handleStripeEvent, toPublicOrder } from "@/lib/server/payments";
import { validateCheckout } from "@/lib/validation";

function checkout(key = "0f8fad5b-d9cb-469f-a165-70867728950e") {
  const r = validateCheckout({
    items: ["zdrowiej-kazdego-dnia"],
    email: "klient@example.com",
    emailConfirm: "klient@example.com",
    acceptTerms: true,
    digitalConsent: true,
    idempotencyKey: key,
  });
  if (!r.ok) throw new Error(r.message);
  return r.value;
}

function sessionEvent(id: string, type: string, session: Partial<Stripe.Checkout.Session>): Stripe.Event {
  return { id, type, data: { object: { id: "cs_test_123", object: "checkout.session", currency: "pln", ...session } } } as unknown as Stripe.Event;
}

describe("zamówienia i webhook", () => {
  beforeEach(() => resetDbForTests());

  it("ten sam klucz idempotencji zwraca to samo zamówienie", () => {
    const a = createPendingOrder(checkout());
    const b = createPendingOrder(checkout());
    expect(a.created).toBe(true);
    expect(b.created).toBe(false);
    expect(b.order.id).toBe(a.order.id);
    expect(a.order.number).toMatch(/^NZ-[A-Z0-9]{6}$/);
    expect(a.order.total).toBe(3999);
  });

  it("oznacza zamówienie jako opłacone tylko przy zgodnej kwocie, raz", () => {
    const { order } = createPendingOrder(checkout());
    attachCheckoutSession(order.id, { id: "cs_test_123", url: "https://checkout.stripe.com/x", expiresAt: Math.floor(Date.now() / 1000) + 1800 });

    const wrong = handleStripeEvent(sessionEvent("evt_1", "checkout.session.completed", { metadata: { order_id: order.id }, payment_status: "paid", amount_total: 100 }));
    expect(wrong.paidOrderId).toBeUndefined();
    expect(findOrderById(order.id)?.status).toBe("pending");

    const ok = handleStripeEvent(sessionEvent("evt_2", "checkout.session.completed", { metadata: { order_id: order.id }, payment_status: "paid", amount_total: 3999 }));
    expect(ok.paidOrderId).toBe(order.id);
    expect(findOrderById(order.id)?.status).toBe("paid");

    const dup = handleStripeEvent(sessionEvent("evt_2", "checkout.session.completed", { metadata: { order_id: order.id }, payment_status: "paid", amount_total: 3999 }));
    expect(dup.duplicate).toBe(true);
  });

  it("nie oznacza opłacenia, gdy płatność jest jeszcze w toku", () => {
    const { order } = createPendingOrder(checkout());
    const r = handleStripeEvent(sessionEvent("evt_3", "checkout.session.completed", { metadata: { order_id: order.id }, payment_status: "unpaid", amount_total: 3999 }));
    expect(r.paidOrderId).toBeUndefined();
    expect(findOrderById(order.id)?.status).toBe("pending");
  });

  it("wygaśnięcie sesji anuluje zamówienie", () => {
    const { order } = createPendingOrder(checkout());
    handleStripeEvent(sessionEvent("evt_4", "checkout.session.expired", { metadata: { order_id: order.id } }));
    expect(findOrderById(order.id)?.status).toBe("cancelled");
  });

  it("linki do pobrania tylko dla opłaconych zamówień + licznik pobrań + e-mail z oświadczeniem", () => {
    const { order } = createPendingOrder(checkout());
    expect(downloadLinksForOrder(order, "https://sklep.test")).toEqual([]);
    expect(toPublicOrder(order, "https://sklep.test", true).downloads).toEqual([]);

    handleStripeEvent(sessionEvent("evt_5", "checkout.session.completed", { metadata: { order_id: order.id }, payment_status: "paid", amount_total: 3999 }));
    const paid = findOrderById(order.id)!;
    const links = downloadLinksForOrder(paid, "https://sklep.test");
    expect(links).toHaveLength(1);
    expect(links[0].url).toMatch(/^https:\/\/sklep\.test\/api\/pobierz\//);
    expect(links[0].remaining).toBe(3);

    recordDownload(order.id, "zdrowiej-kazdego-dnia", "1.2.3.4");
    expect(countDownloads(order.id, "zdrowiej-kazdego-dnia")).toBe(1);
    expect(downloadLinksForOrder(paid, "https://sklep.test")[0].remaining).toBe(2);

    const mail = orderPaidEmail(paid, links, "https://sklep.test");
    expect(mail.to).toBe("klient@example.com");
    expect(mail.html).toContain(links[0].url.replace(/&/g, "&amp;"));
    expect(mail.html).toContain("tracę prawo odstąpienia od umowy");
    expect(toPublicOrder(paid, "https://sklep.test", true).emailHint).toBe("kl••••@example.com");
  });
});
