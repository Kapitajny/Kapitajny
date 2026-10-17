"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AlertIcon, CheckIcon, InfoIcon } from "@/components/ui/Icons";
import { clearAttempt } from "./checkout-attempt";
import { OrderLines } from "./OrderLines";
import { PickupDetails, StatusShell } from "./OrderSuccessView";
import { useOrderStatus } from "./useOrderStatus";

export function OrderCancelledView() {
  const orderId = useSearchParams().get("order");
  const { state, reload } = useOrderStatus(orderId ? `order=${encodeURIComponent(orderId)}` : null, { poll: false });
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelOrder = async () => {
    if (!orderId) return;
    setCancelling(true);
    setError(null);
    try {
      const response = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error?.message ?? "Nie udało się anulować zamówienia.");
      clearAttempt();
      reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nie udało się anulować zamówienia.");
    }
    setCancelling(false);
  };

  if (state.kind === "loading") {
    return (
      <StatusShell eyebrow="Płatność" title="Sprawdzamy zamówienie…">
        <p className="text-muted">To potrwa tylko chwilę.</p>
      </StatusShell>
    );
  }

  if (state.kind === "error") {
    return (
      <StatusShell eyebrow="Płatność przerwana" title="Płatność nie została dokończona" icon={<InfoIcon size={28} />}>
        <p className="text-espresso">Nie pobraliśmy żadnych środków. Twój koszyk został zachowany.</p>
        <Link href="/zamowienie" className="btn btn-primary mt-8">
          Wróć do zamówienia
        </Link>
      </StatusShell>
    );
  }

  const { order } = state;

  if (order.status === "paid") {
    return (
      <StatusShell eyebrow={`Zamówienie ${order.number}`} title="To zamówienie jest już opłacone" icon={<CheckIcon size={28} />} tone="success">
        <p className="text-espresso">Operator płatności potwierdził transakcję – nie musisz płacić ponownie.</p>
        <PickupDetails order={order} />
      </StatusShell>
    );
  }

  if (order.status === "cancelled" || order.status === "failed") {
    return (
      <StatusShell eyebrow={`Zamówienie ${order.number}`} title="Zamówienie anulowane" icon={<CheckIcon size={28} />}>
        <p className="text-espresso">Płatność została anulowana, środki nie zostały pobrane. Produkty nadal czekają w Twoim koszyku.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/zamowienie" className="btn btn-primary">
            Złóż zamówienie ponownie
          </Link>
          <Link href="/#menu" className="btn btn-secondary">
            Wróć do menu
          </Link>
        </div>
      </StatusShell>
    );
  }

  return (
    <StatusShell eyebrow={`Zamówienie ${order.number}`} title="Płatność nie została dokończona" icon={<InfoIcon size={28} />}>
      <p className="text-espresso">
        Nie pobraliśmy żadnych środków. Możesz wrócić do tej samej płatności albo anulować zamówienie – Twój koszyk zostanie zachowany.
      </p>
      {error && (
        <p role="alert" className="mt-5 flex gap-2 rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm text-danger">
          <AlertIcon size={18} className="shrink-0" /> {error}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        {order.resumeUrl ? (
          <a href={order.resumeUrl} className="btn btn-primary">
            Wróć do płatności
          </a>
        ) : (
          <Link href="/zamowienie" className="btn btn-primary">
            Wróć do zamówienia
          </Link>
        )}
        <button type="button" onClick={cancelOrder} disabled={cancelling} className="btn btn-secondary">
          {cancelling ? "Anulowanie…" : "Anuluj zamówienie"}
        </button>
      </div>
      <PickupDetails order={order} />
      <div className="mt-8">
        <OrderLines lines={order.items} total={order.total} />
      </div>
    </StatusShell>
  );
}
