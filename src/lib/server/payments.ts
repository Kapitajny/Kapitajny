import "server-only";

import { getLocation } from "@/data/locations";
import { formatPickup } from "@/lib/pickup";
import type { ValidCheckout } from "@/lib/validation";
import {
  attachCheckoutSession,
  createPendingOrder,
  findOrderById,
  findOrderBySessionId,
  hashCheckout,
  recordStripeEvent,
  setOrderNote,
  transitionOrder,
  type OrderRecord,
  type OrderStatus,
} from "./orders";
import { transaction } from "./db";
import { getStripe, type Stripe } from "./stripe";

/** Sesja Stripe Checkout wygasa po 30 minutach (minimum dopuszczane przez Stripe). */
const SESSION_TTL_SECONDS = 30 * 60;

export class CheckoutError extends Error {
  constructor(
    public readonly code: "PAYMENTS_NOT_CONFIGURED" | "ATTEMPT_CLOSED" | "PAYLOAD_MISMATCH" | "ALREADY_PAID" | "PROVIDER_ERROR",
    message: string,
    public readonly status: number,
    public readonly orderId?: string,
  ) {
    super(message);
  }
}

export type CheckoutResult = { url: string; orderId: string };

/**
 * Tworzy (lub wznawia) zamówienie i sesję płatności Stripe Checkout.
 * Kwoty pochodzą wyłącznie z katalogu przeliczonego na serwerze (`ValidCheckout`).
 */
export async function startCheckout(value: ValidCheckout, siteUrl: string): Promise<CheckoutResult> {
  const stripe = getStripe();
  if (!stripe) {
    throw new CheckoutError("PAYMENTS_NOT_CONFIGURED", "Płatności online nie są jeszcze skonfigurowane. Zamówienie nie zostało złożone.", 503);
  }

  const { order } = createPendingOrder(value);

  if (order.payloadHash !== hashCheckout(value)) {
    throw new CheckoutError("PAYLOAD_MISMATCH", "Zamówienie zmieniło się od poprzedniej próby płatności.", 409);
  }
  if (order.status === "paid") {
    throw new CheckoutError("ALREADY_PAID", "To zamówienie zostało już opłacone.", 409, order.id);
  }
  if (order.status !== "pending") {
    throw new CheckoutError("ATTEMPT_CLOSED", "Poprzednia próba płatności została zamknięta.", 409);
  }

  // Wznowienie: ta sama, wciąż aktywna sesja zamiast nowego zamówienia.
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (order.stripeSessionUrl && order.stripeSessionExpiresAt && order.stripeSessionExpiresAt - 60 > nowSeconds) {
    return { url: order.stripeSessionUrl, orderId: order.id };
  }
  if (order.stripeSessionId) {
    throw new CheckoutError("ATTEMPT_CLOSED", "Sesja płatności wygasła.", 409);
  }

  const session = await createStripeSession(stripe, order, value, siteUrl);
  if (!session.url) throw new CheckoutError("PROVIDER_ERROR", "Stripe nie zwrócił adresu płatności.", 502);
  attachCheckoutSession(order.id, { id: session.id, url: session.url, expiresAt: session.expires_at });
  return { url: session.url, orderId: order.id };
}

async function createStripeSession(stripe: Stripe, order: OrderRecord, value: ValidCheckout, siteUrl: string) {
  const pickupLabel = formatPickup(value.pickup.date, value.pickup.time);
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    locale: "pl",
    currency: "pln",
    customer_email: value.customer.email,
    client_reference_id: order.id,
    expires_at: expiresAt,
    line_items: value.lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: "pln",
        unit_amount: line.unitPrice,
        product_data: {
          name: line.name,
          ...(line.optionLabels.length ? { description: line.optionLabels.join(", ") } : {}),
        },
      },
    })),
    metadata: {
      order_id: order.id,
      order_number: order.number,
      location_id: value.location.id,
      pickup: `${value.pickup.date} ${value.pickup.time}`,
    },
    payment_intent_data: {
      description: `NOIR COFFEE ${order.number} – odbiór ${value.location.name}, ${pickupLabel}`,
      metadata: { order_id: order.id, order_number: order.number },
    },
    custom_text: {
      submit: { message: `Odbiór osobisty: ${value.location.name}, ${pickupLabel}. Zamówienie ${order.number}.` },
    },
    success_url: `${siteUrl}/zamowienie/sukces?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/zamowienie/anulowano?order=${order.id}`,
  };

  try {
    // Klucz idempotencji Stripe: automatyczne ponowienia tego samego żądania (np. po zerwaniu połączenia)
    // nie utworzą drugiej sesji. Główną ochroną przed duplikatami jest klucz zamówienia w bazie.
    return await stripe.checkout.sessions.create(params, { idempotencyKey: `checkout-${order.id}-${expiresAt}` });
  } catch (error) {
    console.error("[checkout] Stripe error", error);
    throw new CheckoutError("PROVIDER_ERROR", "Nie udało się połączyć z operatorem płatności. Spróbuj ponownie za chwilę.", 502);
  }
}

/* ------------------------------------------------------------------------------------------------
 * Webhook
 * ---------------------------------------------------------------------------------------------- */

function orderForSession(session: Stripe.Checkout.Session): OrderRecord | null {
  const byId = session.metadata?.order_id ? findOrderById(session.metadata.order_id) : null;
  return byId ?? findOrderBySessionId(session.id);
}

function paymentIntentId(session: Stripe.Checkout.Session): string | null {
  const pi = session.payment_intent;
  return typeof pi === "string" ? pi : (pi?.id ?? null);
}

function markPaid(order: OrderRecord, session: Stripe.Checkout.Session): void {
  if (session.amount_total !== order.total || session.currency?.toLowerCase() !== order.currency) {
    // Nie oznaczamy jako opłacone – kwota nie zgadza się z zamówieniem. Wymaga ręcznej weryfikacji.
    console.error(`[webhook] Kwota sesji ${session.id} (${session.amount_total} ${session.currency}) ≠ zamówienie ${order.number} (${order.total})`);
    setOrderNote(order.id, "Kwota płatności niezgodna z zamówieniem – wymaga weryfikacji w panelu Stripe.");
    return;
  }
  transitionOrder(order.id, "paid", ["pending", "failed", "cancelled"], { paymentIntentId: paymentIntentId(session), note: null });
}

/**
 * Przetwarza zweryfikowane zdarzenie Stripe. Idempotentne: każde zdarzenie jest
 * zapisywane w tej samej transakcji co zmiana statusu, więc duplikaty są ignorowane.
 */
export function handleStripeEvent(event: Stripe.Event): { handled: boolean; duplicate: boolean } {
  return transaction(() => {
    if (!recordStripeEvent(event.id, event.type)) return { handled: false, duplicate: true };

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const order = orderForSession(session);
        if (!order) break;
        // Płatności asynchroniczne (np. przelew) kończą się później – czekamy na async_payment_succeeded.
        if (session.payment_status === "paid") markPaid(order, session);
        return { handled: true, duplicate: false };
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        const order = orderForSession(session);
        if (!order) break;
        markPaid(order, session);
        return { handled: true, duplicate: false };
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
      // Wygaszenie sesji gwarantuje, że po anulowaniu nie da się już jej opłacić.
      await stripe.checkout.sessions.expire(order.stripeSessionId);
    } catch (error) {
      // Sesja mogła zostać właśnie opłacona albo już wygasła – sprawdzamy jej stan u operatora.
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
 * Widok publiczny zamówienia (bez adresu e-mail)
 * ---------------------------------------------------------------------------------------------- */

export interface PublicOrder {
  id: string;
  number: string;
  status: OrderStatus;
  customerName: string;
  locationName: string;
  locationAddress: string;
  pickupDate: string;
  pickupTime: string;
  items: { name: string; quantity: number; optionLabels: string[]; lineTotal: number }[];
  total: number;
  /** Adres wznowienia płatności – tylko dla aktywnej, nieopłaconej sesji. */
  resumeUrl: string | null;
}

export function toPublicOrder(order: OrderRecord): PublicOrder {
  const location = getLocation(order.locationId);
  const active =
    order.status === "pending" && !!order.stripeSessionUrl && !!order.stripeSessionExpiresAt && order.stripeSessionExpiresAt - 60 > Date.now() / 1000;
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    customerName: order.customerName,
    locationName: location?.name ?? order.locationId,
    locationAddress: location ? `${location.street}, ${location.city}` : "",
    pickupDate: order.pickupDate,
    pickupTime: order.pickupTime,
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, optionLabels: i.optionLabels, lineTotal: i.lineTotal })),
    total: order.total,
    resumeUrl: active ? order.stripeSessionUrl : null,
  };
}
