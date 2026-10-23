"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useShop } from "@/components/shop/ShopProvider";
import { clearAttempt } from "./checkout-attempt";
import { OrderSummary } from "./OrderSummary";
import { useOrderStatus, type PublicOrder } from "./useOrderStatus";

function queryFrom(params: URLSearchParams): string | null {
  const sessionId = params.get("session_id");
  if (sessionId) return `session_id=${encodeURIComponent(sessionId)}`;
  const order = params.get("order");
  return order ? `order=${encodeURIComponent(order)}` : null;
}

function Headline({ order }: { order: PublicOrder }) {
  switch (order.status) {
    case "demo":
      return (
        <>
          <h1 className="display text-[min(11cqi,5.5rem)] [overflow-wrap:anywhere]">Zamówienie demo zapisane</h1>
          <div role="note" className="mt-6 max-w-xl border border-dashed border-[#6b6b6b] p-4 text-sm leading-relaxed">
            <strong className="font-bold">To nie jest prawdziwy zakup.</strong> Zamówienie {order.number} zapisano wyłącznie w celach testowych: płatność
            nie została pobrana, a paczka nie zostanie wysłana.
          </div>
        </>
      );
    case "paid":
      return (
        <>
          <h1 className="display text-[min(11cqi,5.5rem)] [overflow-wrap:anywhere]">Dziękujemy, {order.customerFirstName}</h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Płatność za zamówienie {order.number} została potwierdzona przez operatora. Potwierdzenie płatności wysyła Stripe na adres podany w zamówieniu.
          </p>
        </>
      );
    case "pending":
      return (
        <>
          <h1 className="display text-[min(11cqi,5.5rem)] [overflow-wrap:anywhere]">Czekamy na potwierdzenie płatności</h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Zamówienie {order.number} jest zapisane. Status odświeża się automatycznie – nie zamykaj tej strony, jeśli płatność jest w toku.
          </p>
        </>
      );
    case "failed":
      return (
        <>
          <h1 className="display text-[min(11cqi,5.5rem)] [overflow-wrap:anywhere]">Płatność nie powiodła się</h1>
          <p className="mt-6 max-w-xl text-lg text-muted">Operator odrzucił płatność za zamówienie {order.number}. Twój koszyk jest zachowany – możesz spróbować ponownie.</p>
        </>
      );
    case "cancelled":
      return (
        <>
          <h1 className="display text-[min(11cqi,5.5rem)] [overflow-wrap:anywhere]">Zamówienie anulowane</h1>
          <p className="mt-6 max-w-xl text-lg text-muted">Zamówienie {order.number} nie zostało opłacone i jest anulowane. Twój koszyk jest zachowany.</p>
        </>
      );
  }
}

export function OrderResultView() {
  const params = useSearchParams();
  const query = queryFrom(params);
  const { state, reload } = useOrderStatus(query, { poll: true });
  const { clearCart, hydrated } = useShop();
  const cleared = useRef(false);

  // Koszyk czyścimy dopiero, gdy zamówienie jest potwierdzone (opłacone albo zapisane jako demo).
  const finished = state.kind === "ready" && (state.order.status === "paid" || state.order.status === "demo");
  useEffect(() => {
    if (finished && hydrated && !cleared.current) {
      cleared.current = true;
      clearCart();
      clearAttempt();
    }
  }, [finished, hydrated, clearCart]);

  if (state.kind === "loading") return <p className="py-16 text-muted">Sprawdzanie statusu zamówienia…</p>;
  if (state.kind === "error") {
    return (
      <div className="py-10">
        <h1 className="display text-5xl">Nie znaleźliśmy zamówienia</h1>
        <p className="mt-4 text-muted">{state.message}</p>
        <Link href="/" className="btn btn-outline mt-8">
          Strona główna
        </Link>
      </div>
    );
  }

  const { order, slow } = state;
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="@container min-w-0 lg:col-span-7">
        <Headline order={order} />
        {order.status === "pending" && slow && (
          <p className="mt-4 text-sm text-muted">
            Potwierdzenie trwa dłużej niż zwykle.{" "}
            <button type="button" className="link text-paper" onClick={reload}>
              Sprawdź ponownie
            </button>
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-3">
          {order.resumeUrl && (
            <a href={order.resumeUrl} className="btn btn-light">
              Dokończ płatność
            </a>
          )}
          {(order.status === "failed" || order.status === "cancelled") && (
            <Link href="/zamowienie" className="btn btn-light">
              Spróbuj ponownie
            </Link>
          )}
          <Link href="/sklep" className="btn btn-outline">
            Wróć do sklepu
          </Link>
          <Link href="/konto" className="btn btn-outline">
            Moje konto
          </Link>
        </div>
      </div>
      <div className="lg:col-span-5">
        <OrderSummary order={order} />
      </div>
    </div>
  );
}
