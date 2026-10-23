"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { postJson } from "@/lib/api-client";
import { clearAttempt } from "./checkout-attempt";
import { useOrderStatus } from "./useOrderStatus";

export function OrderCancelledView() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const { state, reload } = useOrderStatus(orderId ? `order=${encodeURIComponent(orderId)}` : null, { poll: false });
  const [action, setAction] = useState<{ kind: "idle" | "sending" } | { kind: "error"; message: string }>({ kind: "idle" });

  const cancel = async () => {
    if (!orderId) return;
    setAction({ kind: "sending" });
    const result = await postJson<{ status: string }>("/api/orders/cancel", { orderId });
    if (!result.ok) return setAction({ kind: "error", message: result.message });
    clearAttempt();
    setAction({ kind: "idle" });
    reload();
  };

  const order = state.kind === "ready" ? state.order : null;
  return (
    <div className="max-w-2xl py-6">
      <h1 className="display text-[clamp(2.6rem,1rem+5vw,5.5rem)]">Płatność przerwana</h1>
      {order?.status === "paid" ? (
        <p className="mt-6 text-lg text-muted">
          Zamówienie {order.number} jest jednak opłacone.{" "}
          <Link href={`/zamowienie/sukces?order=${order.id}`} className="link text-paper">
            Zobacz potwierdzenie
          </Link>
        </p>
      ) : order?.status === "cancelled" ? (
        <p className="mt-6 text-lg text-muted">Zamówienie {order.number} jest anulowane. Produkty nadal są w Twoim koszyku.</p>
      ) : (
        <p className="mt-6 text-lg text-muted">
          Nie pobraliśmy pieniędzy. {order ? `Zamówienie ${order.number} czeka na płatność przez ok. 30 minut – możesz do niej wrócić albo je anulować.` : "Produkty nadal są w Twoim koszyku."}
        </p>
      )}
      {action.kind === "error" && (
        <p role="alert" className="mt-4 text-danger">
          {action.message}
        </p>
      )}
      <div className="mt-10 flex flex-wrap gap-3">
        {order?.resumeUrl && (
          <a href={order.resumeUrl} className="btn btn-light">
            Wróć do płatności
          </a>
        )}
        <Link href="/zamowienie" className={order?.resumeUrl ? "btn btn-outline" : "btn btn-light"}>
          Wróć do zamówienia
        </Link>
        {order?.status === "pending" && (
          <button type="button" className="btn btn-outline" onClick={cancel} disabled={action.kind === "sending"}>
            {action.kind === "sending" ? "Anulowanie…" : "Anuluj zamówienie"}
          </button>
        )}
      </div>
    </div>
  );
}
