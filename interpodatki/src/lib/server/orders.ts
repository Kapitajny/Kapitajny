import "server-only";
import { buildOrderQuote } from "@/lib/order-quote";
import type { PaymentMethod, PaymentScenario, PublicOrder, PublicPayment } from "@/lib/payments";
import type { CalculatorInput } from "@/lib/pricing/calculator";
import type { OrderCustomerValues } from "@/lib/validation/order";
import { getPaymentProvider } from "./payments";
import { collection, maskEmail, publicNumber } from "./store";

type StoredOrder = PublicOrder & { sessionId: string };

const orders = collection<StoredOrder>("orders");

function toPublic({ sessionId: _session, ...order }: StoredOrder): PublicOrder {
  void _session;
  return order;
}

export type CreateOrderResult = { ok: true; order: PublicOrder } | { ok: false; message: string };

export function createOrder(args: {
  sessionId: string;
  packageId: string | null;
  calculator: CalculatorInput | null;
  customer: OrderCustomerValues;
}): CreateOrderResult {
  const quote = buildOrderQuote(args.packageId, args.calculator);
  if (!quote.ok) return { ok: false, message: quote.message };

  const order: StoredOrder = {
    id: crypto.randomUUID(),
    number: publicNumber("DEMO-ZAM"),
    createdAt: new Date().toISOString(),
    status: "awaiting_payment",
    packageId: quote.pkg.id,
    packageName: quote.pkg.name,
    priceBasis: quote.priceBasis,
    lines: quote.lines,
    scope: quote.scope,
    monthly: quote.monthly,
    oneTimeFee: quote.oneTimeFee,
    dueNow: quote.dueNow,
    calculatorQuery: quote.calculatorQuery,
    // Minimalizacja danych: pełny e-mail i telefon nie są przechowywane w magazynie demo.
    customer: { name: args.customer.name, company: args.customer.company, emailMasked: maskEmail(args.customer.email) },
    payments: [],
    sessionId: args.sessionId,
  };
  orders.set(order.id, order);
  return { ok: true, order: toPublic(order) };
}

/** Zwraca zamówienie tylko wtedy, gdy należy do bieżącej sesji demo (brak dostępu do cudzych zamówień). */
export function getOrderForSession(id: string, sessionId: string | null): PublicOrder | undefined {
  if (!sessionId) return undefined;
  const order = orders.get(id);
  return order && order.sessionId === sessionId ? toPublic(order) : undefined;
}

export function listOrdersForSession(sessionId: string | null): PublicOrder[] {
  if (!sessionId) return [];
  return orders
    .filter((o) => o.sessionId === sessionId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toPublic);
}

export type PayResult =
  | { ok: true; order: PublicOrder; payment: PublicPayment }
  | { ok: false; status: number; message: string };

export async function payOrder(args: {
  id: string;
  sessionId: string | null;
  method: PaymentMethod;
  scenario: PaymentScenario;
}): Promise<PayResult> {
  const stored = args.sessionId ? orders.get(args.id) : undefined;
  if (!stored || stored.sessionId !== args.sessionId) {
    return { ok: false, status: 404, message: "Nie znaleziono zamówienia w tej sesji demonstracyjnej." };
  }
  if (stored.status === "paid") {
    return { ok: false, status: 409, message: "To zamówienie zostało już opłacone w trybie demo." };
  }

  const outcome = await getPaymentProvider().createPayment({
    orderId: stored.id,
    amount: stored.dueNow,
    description: `${stored.number} – pakiet ${stored.packageName}`,
    method: args.method,
    scenario: args.scenario,
  });
  if (outcome.status === "redirect") {
    // Tryb demo nigdy nie przekierowuje; gałąź zostaje dla przyszłej integracji z operatorem.
    return { ok: false, status: 501, message: "Przekierowanie do operatora nie jest obsługiwane w wersji demo." };
  }

  const payment: PublicPayment = {
    reference: outcome.reference,
    method: args.method,
    status: outcome.status,
    message: outcome.message,
    createdAt: new Date().toISOString(),
  };
  stored.payments = [...stored.payments, payment];
  stored.status = outcome.status === "succeeded" ? "paid" : "failed";
  orders.set(stored.id, stored);
  return { ok: true, order: toPublic(stored), payment };
}
