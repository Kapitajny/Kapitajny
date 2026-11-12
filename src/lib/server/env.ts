import "server-only";

/** Konfiguracja serwera ze zmiennych środowiskowych. Nic z tego modułu nie trafia do przeglądarki. */

export function getDbPath(): string {
  return process.env.DB_PATH?.trim() || "data/kilwater.sqlite";
}

/** Hasło do panelu administratora. Bez niego panel jest wyłączony. */
export function getAdminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD?.trim();
  return value && value.length >= 10 ? value : null;
}

/** Sekret do podpisywania sesji panelu (min. 32 znaki). */
export function getSessionSecret(): string | null {
  const value = process.env.ADMIN_SESSION_SECRET?.trim();
  return value && value.length >= 32 ? value : null;
}

/** Adres webhooka, na który trafiają wiadomości z formularza kontaktowego (np. Make, Zapier, n8n). */
export function getContactWebhook(): { url: string; secret: string | null } | null {
  const url = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!url) return null;
  return { url, secret: process.env.CONTACT_WEBHOOK_SECRET?.trim() || null };
}

/** Opinie Google: klucz Places API (New) i identyfikator miejsca. */
export function getGooglePlaces(): { apiKey: string; placeId: string } | null {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();
  return apiKey && placeId ? { apiKey, placeId } : null;
}
