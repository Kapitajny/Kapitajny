/**
 * Walidacja formularzy – wspólna dla przeglądarki i API (serwer zawsze waliduje ponownie).
 */
import { getShippingMethod, type ShippingMethod } from "@/data/shipping";
import { orderTotals, priceCart, type PricedLine } from "./pricing";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE = /^[\p{L}][\p{L}\p{M} .'-]*$/u;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const POSTAL_RE = /^\d{2}-\d{3}$/;

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function validateName(value: unknown, label = "imię"): string | null {
  const name = str(value);
  if (!name) return `Podaj ${label}.`;
  if (name.length < 2) return `Pole „${label}” powinno mieć co najmniej 2 znaki.`;
  if (name.length > 60) return `Pole „${label}” może mieć maksymalnie 60 znaków.`;
  if (!NAME_RE.test(name)) return `Pole „${label}” może zawierać tylko litery, spacje, apostrof i myślnik.`;
  return null;
}

export function validateEmail(value: unknown): string | null {
  const email = str(value);
  if (!email) return "Podaj adres e-mail.";
  if (email.length > 254 || !EMAIL_RE.test(email)) return "Podaj poprawny adres e-mail, np. anna@example.com.";
  return null;
}

/** Polski numer telefonu: 9 cyfr, opcjonalnie z +48 i spacjami/myślnikami. */
export function normalizePhone(value: unknown): string | null {
  const digits = str(value).replace(/[\s-]/g, "");
  const match = /^(?:\+?48)?(\d{9})$/.exec(digits);
  return match ? `+48${match[1]}` : null;
}

export function validatePhone(value: unknown): string | null {
  if (!str(value)) return "Podaj numer telefonu – przekażemy go przewoźnikowi.";
  return normalizePhone(value) ? null : "Podaj 9-cyfrowy numer telefonu, np. 600 100 200.";
}

export function validatePostalCode(value: unknown): string | null {
  const code = str(value);
  if (!code) return "Podaj kod pocztowy.";
  return POSTAL_RE.test(code) ? null : "Kod pocztowy w formacie 00-000.";
}

export function validateRequired(value: unknown, message: string, max = 120): string | null {
  const text = str(value);
  if (!text) return message;
  if (text.length > max) return `Maksymalnie ${max} znaków.`;
  return null;
}

export function validatePassword(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return "Podaj hasło.";
  if (value.length < 10) return "Hasło musi mieć co najmniej 10 znaków.";
  if (value.length > 200) return "Hasło może mieć maksymalnie 200 znaków.";
  if (!/[a-zA-Z\p{L}]/u.test(value) || !/\d/.test(value)) return "Hasło musi zawierać co najmniej jedną literę i jedną cyfrę.";
  return null;
}

/* --------------------------------------------------------------------------------------------
 * Zamówienie
 * ------------------------------------------------------------------------------------------ */

export type PaymentChoice = "stripe" | "demo";

export interface CheckoutRequest {
  items: unknown;
  customer?: { firstName?: unknown; lastName?: unknown; email?: unknown; phone?: unknown };
  address?: { street?: unknown; postalCode?: unknown; city?: unknown };
  shipping?: { method?: unknown; pickupPoint?: unknown };
  notes?: unknown;
  acceptTerms: unknown;
  payment?: unknown;
  idempotencyKey: unknown;
}

export type CheckoutField =
  | "items"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "street"
  | "postalCode"
  | "city"
  | "shippingMethod"
  | "pickupPoint"
  | "notes"
  | "acceptTerms"
  | "payment"
  | "idempotencyKey";

export interface ShippingAddress {
  street: string;
  postalCode: string;
  city: string;
}

export interface ValidCheckout {
  lines: PricedLine[];
  subtotal: number;
  shippingCost: number;
  total: number;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  address: ShippingAddress;
  shipping: { method: ShippingMethod; pickupPoint: string | null };
  notes: string | null;
  payment: PaymentChoice;
  idempotencyKey: string;
}

export type FieldErrors = Partial<Record<CheckoutField, string>>;
export type CheckoutValidation = { ok: true; value: ValidCheckout } | { ok: false; field: CheckoutField; message: string; errors: FieldErrors };

/** Błędy pól formularza (bez koszyka) – używane do podpowiedzi przy polach. */
export function checkoutFieldErrors(input: CheckoutRequest): FieldErrors {
  const errors: FieldErrors = {};
  const set = (field: CheckoutField, message: string | null) => {
    if (message) errors[field] = message;
  };
  set("firstName", validateName(input.customer?.firstName, "imię"));
  set("lastName", validateName(input.customer?.lastName, "nazwisko"));
  set("email", validateEmail(input.customer?.email));
  set("phone", validatePhone(input.customer?.phone));
  set("street", validateRequired(input.address?.street, "Podaj ulicę i numer domu."));
  set("postalCode", validatePostalCode(input.address?.postalCode));
  set("city", validateRequired(input.address?.city, "Podaj miejscowość.", 80));
  const method = getShippingMethod(input.shipping?.method);
  if (!method) set("shippingMethod", "Wybierz sposób dostawy.");
  else if (method.requiresPickupPoint) set("pickupPoint", validateRequired(input.shipping?.pickupPoint, "Podaj kod lub adres punktu odbioru.", 160));
  if (input.notes !== undefined && input.notes !== null && str(input.notes).length > 500) set("notes", "Uwagi mogą mieć maksymalnie 500 znaków.");
  if (input.acceptTerms !== true) set("acceptTerms", "Zaakceptuj regulamin, aby złożyć zamówienie.");
  return errors;
}

const FIELD_ORDER: CheckoutField[] = ["firstName", "lastName", "email", "phone", "street", "postalCode", "city", "shippingMethod", "pickupPoint", "notes", "acceptTerms"];

export function validateCheckout(input: CheckoutRequest): CheckoutValidation {
  if (typeof input.idempotencyKey !== "string" || !UUID_RE.test(input.idempotencyKey)) {
    return { ok: false, field: "idempotencyKey", message: "Nieprawidłowy identyfikator zamówienia. Odśwież stronę.", errors: {} };
  }
  const cart = priceCart(input.items);
  if (!cart.ok) return { ok: false, field: "items", message: cart.error, errors: {} };

  const errors = checkoutFieldErrors(input);
  const first = FIELD_ORDER.find((f) => errors[f]);
  if (first) return { ok: false, field: first, message: errors[first]!, errors };

  if (input.payment !== "stripe" && input.payment !== "demo") {
    return { ok: false, field: "payment", message: "Wybierz sposób płatności.", errors: {} };
  }

  const method = getShippingMethod(input.shipping?.method)!;
  const totals = orderTotals(cart.subtotal, method);
  return {
    ok: true,
    value: {
      lines: cart.lines,
      subtotal: totals.subtotal,
      shippingCost: totals.shipping,
      total: totals.total,
      customer: {
        firstName: str(input.customer?.firstName),
        lastName: str(input.customer?.lastName),
        email: str(input.customer?.email).toLowerCase(),
        phone: normalizePhone(input.customer?.phone)!,
      },
      address: { street: str(input.address?.street), postalCode: str(input.address?.postalCode), city: str(input.address?.city) },
      shipping: { method, pickupPoint: method.requiresPickupPoint ? str(input.shipping?.pickupPoint) : null },
      notes: str(input.notes) || null,
      payment: input.payment,
      idempotencyKey: input.idempotencyKey,
    },
  };
}
