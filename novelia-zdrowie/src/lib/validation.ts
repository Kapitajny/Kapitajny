import { getProduct, MAX_CART_ITEMS, type Product } from "@/data/products";

/** Dane wysyłane przez formularz zamówienia. */
export interface CheckoutRequest {
  items?: unknown;
  email?: unknown;
  emailConfirm?: unknown;
  name?: unknown;
  acceptTerms?: unknown;
  digitalConsent?: unknown;
  idempotencyKey?: unknown;
}

export interface ValidCheckout {
  products: Product[];
  total: number;
  email: string;
  name: string;
  acceptTerms: true;
  digitalConsent: true;
  idempotencyKey: string;
}

export type ValidationResult = { ok: true; value: ValidCheckout } | { ok: false; field?: string; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email);
}

/** Walidacja zamówienia – wspólna dla przeglądarki i serwera. Ceny pochodzą wyłącznie z katalogu. */
export function validateCheckout(input: CheckoutRequest): ValidationResult {
  if (!Array.isArray(input.items) || input.items.length === 0) return { ok: false, field: "items", message: "Koszyk jest pusty." };
  if (input.items.length > MAX_CART_ITEMS) return { ok: false, field: "items", message: "Zbyt wiele pozycji w koszyku." };
  const slugs = new Set<string>();
  const products: Product[] = [];
  for (const slug of input.items) {
    const product = getProduct(slug);
    if (!product) return { ok: false, field: "items", message: "Koszyk zawiera nieznany produkt. Odśwież stronę i spróbuj ponownie." };
    if (slugs.has(product.slug)) continue;
    slugs.add(product.slug);
    products.push(product);
  }

  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) return { ok: false, field: "email", message: "Podaj prawidłowy adres e-mail – na niego wyślemy link do pobrania." };
  if (normalizeEmail(input.emailConfirm) !== email) return { ok: false, field: "emailConfirm", message: "Adresy e-mail nie są takie same." };

  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  if (name.length > 120) return { ok: false, field: "name", message: "Imię i nazwisko jest zbyt długie." };

  if (input.acceptTerms !== true) return { ok: false, field: "acceptTerms", message: "Zaakceptuj regulaminy, aby złożyć zamówienie." };
  if (input.digitalConsent !== true) {
    return { ok: false, field: "digitalConsent", message: "Potwierdź zgodę na dostarczenie treści cyfrowych przed upływem terminu do odstąpienia od umowy." };
  }

  const key = typeof input.idempotencyKey === "string" ? input.idempotencyKey : "";
  if (!/^[a-zA-Z0-9-]{16,64}$/.test(key)) return { ok: false, message: "Nieprawidłowy identyfikator próby płatności. Odśwież stronę." };

  const total = products.reduce((sum, p) => sum + p.price, 0);
  return { ok: true, value: { products, total, email, name, acceptTerms: true, digitalConsent: true, idempotencyKey: key } };
}

/** Treść zgody na dostarczenie treści cyfrowych – zapisywana w zamówieniu i potwierdzana w e-mailu. */
export const DIGITAL_CONSENT_TEXT =
  "Żądam dostarczenia treści cyfrowych przed upływem terminu do odstąpienia od umowy i przyjmuję do wiadomości, że wraz z rozpoczęciem ich dostarczania (udostępnieniem pliku do pobrania) tracę prawo odstąpienia od umowy.";

export const TERMS_CONSENT_TEXT = "Akceptuję Regulamin sklepu oraz Regulamin sprzedaży treści cyfrowych.";
