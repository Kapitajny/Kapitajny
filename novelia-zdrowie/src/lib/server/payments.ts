import "server-only";

import type { ValidCheckout } from "@/lib/validation";
import { transaction } from "./db";
import { downloadLinksForOrder, type DownloadLink } from "./downloads";
import { orderPaidEmail, sendEmail, shopNotificationEmail } from "./email";
import { isProductAvailable } from "./files";
import {
  attachCheckoutSession,
  createPendingOrder,
  findOrderById,
  findOrderBySessionId,
  hashCheckout,
  markEmailResult,
  recordStripeEvent,
  setOrderNote,
  transitionOrder,
  type OrderRecord,
  type OrderStatus,
} from "./orders";
import { getStripe, type Stripe } from "./stripe";

/** Sesja Stripe Checkout wygasa po 30 minutach (minimum dopuszczane przez Stripe). */
const SESSION_TTL_SECONDS = 30 * 60;

export class CheckoutError extends Error {
  constructor(
    public readonly code: "PAYMENTS_NOT_CONFIGURED" | "PRODUCT_UNAVAILABLE" | "ATTEMPT_CLOSED" | "PAYLOAD_MISMATCH" | "ALREADY_PAID" | "PROVIDER_ERROR",
    message: string,
    public readonly status: number,
    public readonly orderId?: string,
  ) {
    super(message);
  }
}

/**
 * Tworzy (lub wznawia) zamówienie i sesję płatności Stripe Checkout.
 * Kwoty pochodzą wyłącznie z katalogu (`ValidCheckout`), a każdy produkt musi mieć plik PDF w katalogu prywatnym.
 */
export async function startCheckout(value: ValidCheckout, siteUrl: string): Promise<{ url: string; orderId: string }> {
  const unavailable = value.products.filter((p) => !isProductAvailable(p));
  if (unavailable.length) {
    throw new CheckoutError("PRODUCT_UNAVAILABLE", `Publikacja „${unavailable[0].title}” nie jest jeszcze dostępna w sprzedaży. Usuń ją z koszyka.`, 409);
  }

  const stripe = getStripe();
  if (!stripe) {
    throw new CheckoutError("PAYMENTS_NOT_CONFIGURED", "Płatności online nie są jeszcze skonfigurowane. Zamówienie nie zostało złożone, a Twoja karta nie została obciążona.", 503);
  }

  const { order } = createPendingOrder(value);
  if (order.payloadHash !== hashCheckout(value)) throw new CheckoutError("PAYLOAD_MISMATCH", "Zamówienie zmieniło się od poprzedniej próby płatności.", 409);
  if (order.status === "paid") throw new CheckoutError("ALREADY_PAID", "To zamówienie zostało już opłacone.", 409, order.id);
  if (order.status !== "pending") throw new CheckoutError("ATTEMPT_CLOSED", "Poprzednia próba płatności została zamknięta.", 409);

  // Wznowienie: ta sama, wciąż aktywna sesja zamiast nowej.
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (order.stripeSessionUrl && order.stripeSessionExpiresAt && order.stripeSessionExpiresAt - 60 > nowSeconds) {
    return { url: order.stripeSessionUrl, orderId: order.id };
  }
  if (order.stripeSessionId) throw new CheckoutError("ATTEMPT_CLOSED", "Sesja płatności wygasła.", 409);

  const expiresAt = nowSeconds + SESSION_TTL_SECONDS;
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    locale: "pl",
    currency: "pln",
    customer_email: value.email,
    client_reference_id: order.id,
    expires_at: expiresAt,
    line_items: value.products.map((p) => ({
      quantity: 1,
      price_data: { currency: "pln", unit_amount: p.price, product_data: { name: `E-book „${p.title}” (PDF)`, description: p.subtitle } },
    })),
    metadata: { order_id: order.id, order_number: order.number },
    payment_intent_data: { description: `NOVELIA ZDROWIE ${order.number}`, metadata: { order_id: order.id, order_number: order.number } },
    custom_text: { submit: { message: `Po potwierdzeniu płatności otrzymasz link do pobrania PDF na adres ${value.email}. Zamówienie ${order.number}.` } },
    success_url: `${siteUrl}/zamowienie/sukces?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/zamowienie/anulowano?order=${order.id}`,
  };

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create(params, { idempotencyKey: `checkout-${order.id}-${expiresAt}` });
  } catch (error) {
    console.error("[checkout] Stripe error", error);
    throw new CheckoutError("PROVIDER_ERROR", "Nie udało się połączyć z operatorem płatności. Spróbuj ponownie za chwilę.", 502);
  }
  if (!session.url) throw new CheckoutError("PROVIDER_ERROR", "Operator płatności nie zwrócił adresu płatności.", 502);
  attachCheckoutSession(order.id, { id: session.id, url: session.url, expiresAt: session.expires_at });
  return { url: session.url, orderId: order.id };
}

/* ------------------------------------------------------------------------------------------------
 * Webhook – jedyne miejsce, w którym zamówienie może zostać oznaczone jako opłacone
 * ---------------------------------------------------------------------------------------------- */

function orderForSession(session: Stripe.Checkout.Session): OrderRecord | null {
  const byId = session.metadata?.order_id ? findOrderById(session.metadata.order_id) : null;
  return byId ?? findOrderBySessionId(session.id);
}

function paymentIntentId(session: Stripe.Checkout.Session): string | null {
  const pi = session.payment_intent;
  return typeof pi === "string" ? pi : (pi?.id ?? null);
}

function markPaid(order: OrderRecord, session: Stripe.Checkout.Session): boolean {
  if (session.amount_total !== order.total || session.currency?.toLowerCase() !== order.currency) {
    console.error(`[webhook] Kwota sesji ${session.id} (${session.amount_total} ${session.currency}) ≠ zamówienie ${order.number} (${order.total})`);
    setOrderNote(order.id, "Kwota płatności niezgodna z zamówieniem – wymaga weryfikacji w panelu Stripe.");
    return false;
  }
  return transitionOrder(order.id, "paid", ["pending", "failed", "cancelled"], { paymentIntentId: paymentIntentId(session), note: null });
}

export interface WebhookOutcome {
  handled: boolean;
  duplicate: boolean;
  /** Zamówienie, które właśnie zostało opłacone – trzeba wysłać e-mail z linkami. */
  paidOrderId?: string;
}

/**
 * Przetwarza zweryfikowane zdarzenie Stripe. Idempotentne: zdarzenie jest zapisywane w tej samej
 * transakcji co zmiana statusu, więc ponowne dostarczenie jest ignorowane.
 */
export function handleStripeEvent(event: Stripe.Event): WebhookOutcome {
  return transaction(() => {
    if (!recordStripeEvent(event.id, event.type)) return { handled: false, duplicate: true };
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        const order = orderForSession(session);
        if (!order) break;
        // Płatności asynchroniczne (np. przelew) kończą się później – czekamy na async_payment_succeeded.
        if (session.payment_status !== "paid") return { handled: true, duplicate: false };
        const changed = markPaid(order, session);
        return { handled: true, duplicate: false, ...(changed ? { paidOrderId: order.id } : {}) };
      }
      case "checkout.session.async_payment_failed": {
        const order = orderForSession(event.data.object);
        if (!order) break;
        transitionOrder(order.id, "failed", ["pending"], { note: "Płatność odrzucona przez operatora." });
        return { handled: true, duplicate: false };
      }
      case "checkout.session.expired": {
        const order = orderForSession(event.data.object);
        if (!order) break;
        transitionOrder(order.id, "cancelled", ["pending"], { note: "Sesja płatności wygasła lub została anulowana." });
        return { handled: true, duplicate: false };
      }
    }
    return { handled: false, duplicate: false };
  });
}

/** Po opłaceniu: e-mail z linkami do klienta i (opcjonalnie) powiadomienie dla sklepu. */
export async function fulfillOrder(orderId: string, siteUrl: string): Promise<void> {
  const order = findOrderById(orderId);
  if (!order || order.status !== "paid") return;
  const links = downloadLinksForOrder(order, siteUrl);
  const result = await sendEmail(orderPaidEmail(order, links, siteUrl));
  markEmailResult(order.id, result.sent ? { sent: true } : { sent: false, error: result.error });
  const shop = process.env.SHOP_NOTIFICATIONS_EMAIL?.trim();
  if (shop) await sendEmail(shopNotificationEmail(order, shop, siteUrl));
}

/* ------------------------------------------------------------------------------------------------
 * Anulowanie przez klienta (przed opłaceniem)
 * ---------------------------------------------------------------------------------------------- */

export async function cancelPendingOrder(orderId: string): Promise<OrderStatus | null> {
  const order = findOrderById(orderId);
  if (!order) return null;
  if (order.status !== "pending") return order.status;

  const stripe = getStripe();
  if (stripe && order.stripeSessionId) {
    try {
      await stripe.checkout.sessions.expire(order.stripeSessionId);
    } catch (error) {
      const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId).catch(() => null);
      if (!session || session.status !== "expired") {
        console.warn("[cancel] Nie można wygasić sesji", order.stripeSessionId, error);
        return findOrderById(orderId)?.status ?? null;
      }
    }
  }
  transitionOrder(order.id, "cancelled", ["pending"], { note: "Anulowane przez klienta przed płatnością." });
  return findOrderById(orderId)?.status ?? null;
}

/* ------------------------------------------------------------------------------------------------
 * Widok publiczny zamówienia (bez adresu e-mail w całości)
 * ---------------------------------------------------------------------------------------------- */

export interface PublicOrder {
  id: string;
  number: string;
  status: OrderStatus;
  emailHint: string;
  items: { slug: string; title: string; price: number }[];
  total: number;
  emailSent: boolean;
  downloads: DownloadLink[];
  resumeUrl: string | null;
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  return `${user.slice(0, 2)}${"•".repeat(Math.max(1, Math.min(6, user.length - 2)))}@${domain}`;
}

export function toPublicOrder(order: OrderRecord, siteUrl: string, withDownloads: boolean): PublicOrder {
  const active = order.status === "pending" && !!order.stripeSessionUrl && !!order.stripeSessionExpiresAt && order.stripeSessionExpiresAt - 60 > Date.now() / 1000;
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    emailHint: maskEmail(order.customerEmail),
    items: order.items,
    total: order.total,
    emailSent: !!order.emailSentAt,
    downloads: withDownloads ? downloadLinksForOrder(order, siteUrl) : [],
    resumeUrl: active ? order.stripeSessionUrl : null,
  };
}
