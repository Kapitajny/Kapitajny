/**
 * Klucz idempotencji próby płatności – przechowywany w sessionStorage.
 * Ta sama treść zamówienia = ten sam klucz, więc ponowne kliknięcie „Zapłać”
 * (albo powrót ze Stripe) wznawia istniejącą płatność zamiast tworzyć nowe zamówienie.
 */

const ATTEMPT_KEY = "noir-checkout-attempt";

interface StoredAttempt {
  key: string;
  fingerprint: string;
}

function read(): StoredAttempt | null {
  try {
    const raw = window.sessionStorage.getItem(ATTEMPT_KEY);
    return raw ? (JSON.parse(raw) as StoredAttempt) : null;
  } catch {
    return null;
  }
}

function newKey(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // Zapas dla starszych przeglądarek / kontekstów bez HTTPS.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function getAttemptKey(fingerprint: string, forceNew = false): string {
  const stored = read();
  if (stored && stored.fingerprint === fingerprint && !forceNew) return stored.key;
  const attempt = { key: newKey(), fingerprint };
  try {
    window.sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempt));
  } catch {}
  return attempt.key;
}

export function clearAttempt(): void {
  try {
    window.sessionStorage.removeItem(ATTEMPT_KEY);
  } catch {}
}
