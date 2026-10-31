import "server-only";

import Stripe from "stripe";
import { getStripeConfig } from "./env";

const globalForStripe = globalThis as unknown as { noveliaStripe?: { key: string; client: Stripe } };

/** Klient Stripe albo `null`, jeśli płatności nie są skonfigurowane. */
export function getStripe(): Stripe | null {
  const config = getStripeConfig();
  if (!config) return null;
  if (globalForStripe.noveliaStripe?.key !== config.secretKey) {
    globalForStripe.noveliaStripe = { key: config.secretKey, client: new Stripe(config.secretKey, mockServerConfig(config.mode)) };
  }
  return globalForStripe.noveliaStripe.client;
}

/**
 * Tylko do testów lokalnych z `stripe-mock` (https://github.com/stripe/stripe-mock):
 * STRIPE_API_BASE=http://localhost:12111. Działa wyłącznie z kluczem testowym – klucz `live` zawsze łączy się ze Stripe.
 */
function mockServerConfig(mode: "test" | "live"): ConstructorParameters<typeof Stripe>[1] {
  const base = process.env.STRIPE_API_BASE;
  if (!base || mode === "live") return {};
  const url = new URL(base);
  return { host: url.hostname, port: Number(url.port), protocol: url.protocol.replace(":", "") as "http" | "https" };
}

export type { Stripe };
