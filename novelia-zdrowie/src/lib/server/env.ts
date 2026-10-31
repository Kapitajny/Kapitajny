import "server-only";

import { randomBytes } from "node:crypto";
import { resolve } from "node:path";

/**
 * Konfiguracja serwera odczytywana ze zmiennych środowiskowych.
 * Klucze i sekrety NIGDY nie trafiają do przeglądarki – ten moduł działa tylko po stronie serwera.
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
 * Adres sklepu używany w linkach (Stripe, e-maile).
 * W produkcji wymagany jest NEXT_PUBLIC_SITE_URL – nie polegamy wtedy na nagłówkach żądania.
 */
export function getSiteUrl(request?: Request): string {
  // SITE_URL jest czytany w czasie działania serwera; NEXT_PUBLIC_SITE_URL jest wstawiany przy budowaniu.
  const configured = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL)?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  if (process.env.NODE_ENV === "production") {
    throw new Error("Brak SITE_URL / NEXT_PUBLIC_SITE_URL – ustaw adres sklepu w zmiennych środowiskowych.");
  }
  return request ? new URL(request.url).origin : "http://localhost:3000";
}

export function getOrdersDbPath(): string {
  return process.env.ORDERS_DB_PATH?.trim() || "data/orders.sqlite";
}

export function getEbooksDir(): string {
  return resolve(/* turbopackIgnore: true */ process.cwd(), process.env.EBOOKS_DIR?.trim() || "private/ebooks");
}

const globalForSecret = globalThis as unknown as { noveliaDevDownloadSecret?: string };

/**
 * Sekret do podpisywania linków pobierania. W produkcji wymagany (min. 32 znaki).
 * W trybie deweloperskim, gdy go brak, generowany jest tymczasowy sekret (linki tracą ważność po restarcie).
 */
export function getDownloadSecret(): string {
  const secret = process.env.DOWNLOAD_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("Brak DOWNLOAD_SECRET (min. 32 znaki) – linki do pobierania nie mogą zostać wygenerowane.");
  }
  if (!globalForSecret.noveliaDevDownloadSecret) {
    console.warn("[downloads] Brak DOWNLOAD_SECRET – używam tymczasowego sekretu (tylko tryb deweloperski).");
    globalForSecret.noveliaDevDownloadSecret = randomBytes(32).toString("hex");
  }
  return globalForSecret.noveliaDevDownloadSecret;
}

function intEnv(name: string, fallback: number, min: number, max: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

export const downloadLinkTtlHours = () => intEnv("DOWNLOAD_LINK_TTL_HOURS", 72, 1, 24 * 30);
export const downloadMaxPerItem = () => intEnv("DOWNLOAD_MAX_PER_ITEM", 10, 1, 100);
