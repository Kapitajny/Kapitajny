"use client";

import { useEffect, useState } from "react";

export type OrderStatus = "pending" | "paid" | "cancelled" | "failed";

export interface PublicOrder {
  id: string;
  number: string;
  status: OrderStatus;
  customerName: string;
  locationName: string;
  locationAddress: string;
  pickupDate: string;
  pickupTime: string;
  items: { name: string; quantity: number; optionLabels: string[]; lineTotal: number }[];
  total: number;
  resumeUrl: string | null;
}

export type StatusState = { kind: "loading" } | { kind: "error"; message: string } | { kind: "ready"; order: PublicOrder; slow: boolean };

/**
 * Pobiera status zamówienia z serwera. Gdy zamówienie czeka na potwierdzenie płatności,
 * odpytuje serwer co kilka sekund (status zmienia wyłącznie webhook Stripe).
 */
export function useOrderStatus(query: string | null, { poll }: { poll: boolean }) {
  const [state, setState] = useState<StatusState>({ kind: "loading" });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    let timer: number | undefined;
    const startedAt = Date.now();

    const load = async () => {
      try {
        const response = await fetch(`/api/orders/status?${query}`, { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (cancelled) return;
        if (!response.ok) {
          setState({ kind: "error", message: data?.error?.message ?? "Nie udało się pobrać statusu zamówienia." });
          return;
        }
        const order = data.order as PublicOrder;
        const elapsed = Date.now() - startedAt;
        setState({ kind: "ready", order, slow: elapsed > 45_000 });
        if (poll && order.status === "pending" && elapsed < 10 * 60_000) {
          timer = window.setTimeout(load, elapsed < 60_000 ? 2_500 : 10_000);
        }
      } catch {
        if (cancelled) return;
        setState({ kind: "error", message: "Brak połączenia z serwerem. Sprawdź internet i odśwież stronę." });
      }
    };
    load();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, poll, reloadToken]);

  const reload = () => setReloadToken((t) => t + 1);
  if (!query) return { state: { kind: "error", message: "Brak identyfikatora zamówienia w adresie strony." } as StatusState, reload };
  return { state, reload };
}
