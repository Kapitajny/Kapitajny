import { getSiteUrl, getStripeConfig } from "@/lib/server/env";
import { fulfillOrder, handleStripeEvent } from "@/lib/server/payments";
import { getStripe } from "@/lib/server/stripe";

/**
 * POST /api/stripe/webhook
 * Jedyne miejsce, w którym zamówienie może zostać oznaczone jako opłacone.
 * Podpis zdarzenia jest weryfikowany sekretem STRIPE_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = getStripeConfig()?.webhookSecret;
  if (!stripe || !webhookSecret) {
    console.error("[webhook] Brak STRIPE_SECRET_KEY lub STRIPE_WEBHOOK_SECRET");
    return new Response("Webhook not configured", { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.warn("[webhook] Nieprawidłowy podpis", error instanceof Error ? error.message : error);
    return new Response("Invalid signature", { status: 400 });
  }

  let result;
  try {
    result = handleStripeEvent(event);
  } catch (error) {
    // 500 => Stripe ponowi dostarczenie zdarzenia później.
    console.error("[webhook] Błąd przetwarzania", event.id, error);
    return new Response("Processing error", { status: 500 });
  }

  if (result.paidOrderId) {
    // Błąd wysyłki e-maila nie cofa płatności – klient pobierze plik ze strony potwierdzenia lub zamówi nowe linki.
    await fulfillOrder(result.paidOrderId, getSiteUrl(request)).catch((error) => console.error("[webhook] Błąd realizacji zamówienia", error));
  }
  return Response.json({ received: true, handled: result.handled, duplicate: result.duplicate });
}
