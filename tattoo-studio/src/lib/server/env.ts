import "server-only";

/**
 * Konfiguracja odbioru zgłoszeń (zmienne środowiskowe — patrz `.env.example`).
 * Zgłoszenia są przyjmowane tylko wtedy, gdy skonfigurowany jest co najmniej jeden kanał.
 */

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string[];
}

export interface WebhookConfig {
  url: string;
  secret: string;
}

export interface DeliveryConfig {
  smtp: SmtpConfig | null;
  webhook: WebhookConfig | null;
  storageDir: string | null;
  turnstileSecret: string | null;
}

export function getDeliveryConfig(): DeliveryConfig {
  const env = process.env;

  const smtp =
    env.SMTP_HOST && env.BOOKING_EMAIL_TO && env.BOOKING_EMAIL_FROM
      ? {
          host: env.SMTP_HOST,
          port: Number(env.SMTP_PORT || 587),
          secure: env.SMTP_SECURE === "true" || env.SMTP_PORT === "465",
          user: env.SMTP_USER || "",
          pass: env.SMTP_PASS || "",
          from: env.BOOKING_EMAIL_FROM,
          to: env.BOOKING_EMAIL_TO.split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }
      : null;

  const webhook = env.BOOKING_WEBHOOK_URL?.startsWith("https://") || env.BOOKING_WEBHOOK_URL?.startsWith("http://localhost")
    ? { url: env.BOOKING_WEBHOOK_URL, secret: env.BOOKING_WEBHOOK_SECRET || "" }
    : null;

  return {
    smtp,
    webhook,
    storageDir: env.BOOKING_STORAGE_DIR?.trim() || null,
    turnstileSecret: env.TURNSTILE_SECRET_KEY?.trim() || null,
  };
}

export function isDeliveryConfigured(config: DeliveryConfig = getDeliveryConfig()): boolean {
  return Boolean(config.smtp || config.webhook || config.storageDir);
}
