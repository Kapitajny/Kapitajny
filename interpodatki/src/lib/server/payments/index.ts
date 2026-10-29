import "server-only";
import { serverEnv } from "../env";
import { demoPaymentProvider } from "./demo-provider";
import type { PaymentProvider } from "./provider";

/** Wybór operatora na podstawie PAYMENT_PROVIDER. Dostępny jest wyłącznie tryb demonstracyjny. */
export function getPaymentProvider(): PaymentProvider {
  if (serverEnv.paymentProvider !== "demo") {
    console.warn(`[płatności] Nieobsługiwany operator „${serverEnv.paymentProvider}” – używam trybu demo.`);
  }
  return demoPaymentProvider;
}
