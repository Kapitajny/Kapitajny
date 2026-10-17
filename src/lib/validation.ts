/**
 * Walidacja danych zamówienia – wspólna dla formularza i API.
 */
import { getLocation, type Location } from "@/data/locations";
import { priceCart, type PricedLine } from "./pricing";
import { getWarsawNow, isValidPickup, type WarsawNow } from "./pickup";

export interface CheckoutRequest {
  items: unknown;
  locationId: unknown;
  pickup: { date?: unknown; time?: unknown } | undefined;
  customer: { name?: unknown; email?: unknown } | undefined;
  acceptTerms: unknown;
  idempotencyKey: unknown;
}

export type CheckoutField = "items" | "location" | "pickup" | "name" | "email" | "acceptTerms" | "idempotencyKey";

export interface ValidCheckout {
  lines: PricedLine[];
  total: number;
  location: Location;
  pickup: { date: string; time: string };
  customer: { name: string; email: string };
  idempotencyKey: string;
}

export type CheckoutValidation = { ok: true; value: ValidCheckout } | { ok: false; field: CheckoutField; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE = /^[\p{L}][\p{L}\p{M} .'-]*$/u;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateName(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() === "") return "Podaj imię.";
  const name = value.trim();
  if (name.length < 2) return "Imię powinno mieć co najmniej 2 znaki.";
  if (name.length > 60) return "Imię może mieć maksymalnie 60 znaków.";
  if (!NAME_RE.test(name)) return "Imię może zawierać tylko litery, spacje, apostrof i myślnik.";
  return null;
}

export function validateEmail(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() === "") return "Podaj adres e-mail.";
  const email = value.trim();
  if (email.length > 254 || !EMAIL_RE.test(email)) return "Podaj poprawny adres e-mail, np. anna@example.com.";
  return null;
}

export function validateCheckout(input: CheckoutRequest, now: WarsawNow = getWarsawNow()): CheckoutValidation {
  if (typeof input.idempotencyKey !== "string" || !UUID_RE.test(input.idempotencyKey)) {
    return { ok: false, field: "idempotencyKey", message: "Nieprawidłowy identyfikator zamówienia. Odśwież stronę." };
  }

  const cart = priceCart(input.items);
  if (!cart.ok) return { ok: false, field: "items", message: cart.error };

  const location = getLocation(input.locationId);
  if (!location) return { ok: false, field: "location", message: "Wybierz lokal, w którym odbierzesz zamówienie." };
  if (!location.acceptsOrders) return { ok: false, field: "location", message: "Ten lokal nie przyjmuje obecnie zamówień online." };

  const date = input.pickup?.date;
  const time = input.pickup?.time;
  if (!isValidPickup(location, date, time, now)) {
    return { ok: false, field: "pickup", message: "Wybrana godzina odbioru jest już niedostępna. Wybierz inną." };
  }

  const nameError = validateName(input.customer?.name);
  if (nameError) return { ok: false, field: "name", message: nameError };
  const emailError = validateEmail(input.customer?.email);
  if (emailError) return { ok: false, field: "email", message: emailError };

  if (input.acceptTerms !== true) {
    return { ok: false, field: "acceptTerms", message: "Zaakceptuj regulamin, aby przejść do płatności." };
  }

  return {
    ok: true,
    value: {
      lines: cart.lines,
      total: cart.total,
      location,
      pickup: { date: date as string, time: time as string },
      customer: { name: (input.customer!.name as string).trim(), email: (input.customer!.email as string).trim().toLowerCase() },
      idempotencyKey: input.idempotencyKey,
    },
  };
}
