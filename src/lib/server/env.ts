import "server-only";

/**
 * Konfiguracja serwera odczytywana ze zmiennych środowiskowych.
 * Klucze Stripe NIGDY nie trafiają do przeglądarki – ten moduł jest dostępny tylko po stronie serwera.
 */

export type PaymentsMode = "test" | "live" | "unconfigured";

export interface StripeConfig {
  secretKey: string;
  webhookSecret: string | null;
  mode: "test" | "live";
}

export function getStripeConfig(): StripeConfig | null {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) return null;
  const mode = secretKey.startsWith("sk_live_") || secretKey.startsWith("rk_live_") ? "live" : "test";
  return { secretKey, webhookSecret: process.env.STRIPE_WEBHOOK_SECRET?.trim() || null, mode };
}

export function getPaymentsMode(): PaymentsMode {
  return getStripeConfig()?.mode ?? "unconfigured";
}

/**
 * Zamówienia demonstracyjne (bez płatności, oznaczone jako „demo”, nie są realizowane).
 * Domyślnie włączone poza produkcją; w produkcji tylko przy DEMO_ORDERS=true.
 */
export function isDemoOrdersEnabled(): boolean {
  const flag = process.env.DEMO_ORDERS?.trim().toLowerCase();
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV !== "production";
}

export const isProduction = () => process.env.NODE_ENV === "production";

/**
 * Adres strony używany w linkach powrotnych ze Stripe i w e-mailach.
 * W produkcji ustaw NEXT_PUBLIC_SITE_URL – nie polegamy wtedy na nagłówkach żądania.
 */
export function getSiteUrl(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  if (isProduction()) {
    throw new Error("Brak NEXT_PUBLIC_SITE_URL – ustaw adres strony w zmiennych środowiskowych.");
  }
  return new URL(request.url).origin;
}

export function getDatabasePath(): string {
  return process.env.DATABASE_PATH?.trim() || "data/shop.sqlite";
}
