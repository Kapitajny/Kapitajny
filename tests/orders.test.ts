import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { closeDb, getDb } from "@/lib/server/db";
import { availableStock } from "@/lib/server/inventory";
import { createOrder, findOrderById, OutOfStockError, transitionOrder } from "@/lib/server/orders";
import { CheckoutError, handleStripeEvent, startCheckout } from "@/lib/server/payments";
import { authenticate, createPasswordReset, createSession, createUser, EmailTakenError, resetPassword, userForSession } from "@/lib/server/auth";
import { validateCheckout, type CheckoutRequest, type ValidCheckout } from "@/lib/validation";

function checkout(items: CheckoutRequest["items"], payment: "stripe" | "demo" = "stripe"): ValidCheckout {
  const result = validateCheckout({
    items,
    customer: { firstName: "Jan", lastName: "Kowalski", email: "jan@example.com", phone: "600100200" },
    address: { street: "Długa 5", postalCode: "80-001", city: "Gdańsk" },
    shipping: { method: "kurier" },
    acceptTerms: true,
    payment,
    idempotencyKey: randomUUID(),
  });
  if (!result.ok) throw new Error(result.message);
  return result.value;
}

// B01 czarny XXL ma w katalogu 2 sztuki.
const SKU = "B01-black-XXL";
const item = (quantity: number) => [{ productId: "B01", color: "black", size: "XXL", quantity }];

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
  delete process.env.STRIPE_SECRET_KEY;
  closeDb();
  getDb();
});
afterEach(() => {
  closeDb();
  vi.unstubAllEnvs();
});

describe("zamówienia i stan magazynowy", () => {
  it("rezerwuje towar dla nieopłaconego zamówienia online i blokuje nadsprzedaż", () => {
    expect(availableStock([SKU]).get(SKU)).toBe(2);
    createOrder(checkout(item(2)), null);
    expect(availableStock([SKU]).get(SKU)).toBe(0);
    expect(() => createOrder(checkout(item(1)), null)).toThrow(OutOfStockError);
  });

  it("ten sam klucz idempotencji zwraca to samo zamówienie", () => {
    const value = checkout(item(1));
    const first = createOrder(value, null);
    const second = createOrder(value, null);
    expect(first.created).toBe(true);
    expect(second.created).toBe(false);
    expect(second.order.id).toBe(first.order.id);
  });

  it("opłacenie odejmuje stan dokładnie raz, anulowanie zwalnia rezerwację", () => {
    const paid = createOrder(checkout(item(1)), null).order;
    expect(transitionOrder(paid.id, "paid", ["pending"])).toBe(true);
    expect(transitionOrder(paid.id, "paid", ["pending", "failed"])).toBe(false);
    expect(availableStock([SKU]).get(SKU)).toBe(1);

    const other = createOrder(checkout(item(1)), null).order;
    expect(availableStock([SKU]).get(SKU)).toBe(0);
    transitionOrder(other.id, "cancelled", ["pending"]);
    expect(availableStock([SKU]).get(SKU)).toBe(1);
  });

  it("zamówienie demo nie rezerwuje ani nie odejmuje towaru i ma wyraźny status", async () => {
    const result = await startCheckout(checkout(item(2), "demo"), () => "http://localhost:3000");
    expect(result.demo).toBe(true);
    const order = findOrderById(result.orderId)!;
    expect(order.status).toBe("demo");
    expect(order.number.startsWith("DEMO-")).toBe(true);
    expect(availableStock([SKU]).get(SKU)).toBe(2);
  });

  it("bez klucza Stripe płatność online nie tworzy zamówienia", async () => {
    await expect(startCheckout(checkout(item(1)), () => "http://localhost:3000")).rejects.toMatchObject({ code: "PAYMENTS_NOT_CONFIGURED" });
    expect(getDb().prepare("SELECT COUNT(*) AS n FROM orders").get()).toEqual({ n: 0 });
  });

  it("w produkcji zamówienia demo są domyślnie wyłączone", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DEMO_ORDERS", "");
    await expect(startCheckout(checkout(item(1), "demo"), () => "http://localhost:3000")).rejects.toBeInstanceOf(CheckoutError);
  });

  it("webhook oznacza zamówienie jako opłacone tylko przy zgodnej kwocie i ignoruje duplikaty", () => {
    const order = createOrder(checkout(item(1)), null).order;
    const event = (id: string, amount: number) =>
      ({
        id,
        type: "checkout.session.completed",
        data: { object: { id: "cs_test_1", metadata: { order_id: order.id }, payment_status: "paid", amount_total: amount, currency: "pln", payment_intent: "pi_1" } },
      }) as never;

    handleStripeEvent(event("evt_bad", 100));
    expect(findOrderById(order.id)!.status).toBe("pending");

    expect(handleStripeEvent(event("evt_ok", order.total))).toEqual({ handled: true, duplicate: false });
    expect(findOrderById(order.id)!.status).toBe("paid");
    expect(handleStripeEvent(event("evt_ok", order.total)).duplicate).toBe(true);
    expect(availableStock([SKU]).get(SKU)).toBe(1);
  });
});

describe("konta klientów", () => {
  it("rejestruje, loguje, tworzy sesję i nie pozwala na duplikat e-maila", async () => {
    const user = await createUser({ email: "Ola@Example.com", firstName: "Ola", password: "bezpieczne123" });
    expect(user.email).toBe("ola@example.com");
    await expect(createUser({ email: "ola@example.com", firstName: "Ola", password: "bezpieczne123" })).rejects.toBeInstanceOf(EmailTakenError);
    expect(await authenticate("ola@example.com", "zlehaslo123")).toBeNull();
    expect((await authenticate("OLA@example.com", "bezpieczne123"))?.id).toBe(user.id);
    const { token } = createSession(user.id);
    expect(userForSession(token)?.id).toBe(user.id);
    expect(userForSession("nieistniejacy")).toBeNull();
  });

  it("reset hasła działa raz i unieważnia sesje", async () => {
    const user = await createUser({ email: "a@example.com", firstName: "Adam", password: "stareHaslo123" });
    const { token: session } = createSession(user.id);
    expect(createPasswordReset("brak@example.com")).toBeNull();
    const reset = createPasswordReset("a@example.com")!;
    expect(await resetPassword(reset.token, "noweHaslo456")).toBe(true);
    expect(await resetPassword(reset.token, "inneHaslo789")).toBe(false);
    expect(userForSession(session)).toBeNull();
    expect(await authenticate("a@example.com", "noweHaslo456")).not.toBeNull();
  });
});
