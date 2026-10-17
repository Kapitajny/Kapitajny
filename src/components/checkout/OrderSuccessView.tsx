"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { formatPickup } from "@/lib/pickup";
import { useCart } from "@/components/cart/CartProvider";
import { AlertIcon, CheckIcon, ClockIcon, PinIcon } from "@/components/ui/Icons";
import { clearAttempt } from "./checkout-attempt";
import { OrderLines } from "./OrderLines";
import { useOrderStatus, type PublicOrder } from "./useOrderStatus";

export function OrderSuccessView() {
  const sessionId = useSearchParams().get("session_id");
  const { state, reload } = useOrderStatus(sessionId ? `session_id=${encodeURIComponent(sessionId)}` : null, { poll: true });
  const { clearCart, hydrated } = useCart();
  const cleared = useRef(false);

  const paid = state.kind === "ready" && state.order.status === "paid";
  useEffect(() => {
    // Koszyk czyścimy dopiero, gdy operator płatności potwierdził transakcję.
    if (paid && hydrated && !cleared.current) {
      cleared.current = true;
      clearCart();
      clearAttempt();
    }
  }, [paid, hydrated, clearCart]);

  if (state.kind === "loading") {
    return (
      <StatusShell eyebrow="Zamówienie" title="Sprawdzamy status płatności…">
        <p className="text-muted">To potrwa tylko chwilę.</p>
      </StatusShell>
    );
  }

  if (state.kind === "error") {
    return (
      <StatusShell eyebrow="Zamówienie" title="Nie możemy wyświetlić zamówienia" icon={<AlertIcon size={28} />}>
        <p className="text-muted">{state.message}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reload} className="btn btn-primary">
            Spróbuj ponownie
          </button>
          <Link href="/" className="btn btn-secondary">
            Strona główna
          </Link>
        </div>
      </StatusShell>
    );
  }

  const { order, slow } = state;

  if (order.status === "paid") {
    return (
      <StatusShell eyebrow={`Zamówienie ${order.number}`} title={`Dziękujemy, ${order.customerName}!`} icon={<CheckIcon size={28} />} tone="success">
        <p className="text-lg text-espresso">Płatność została potwierdzona. Twoje zamówienie trafiło do lokalu.</p>
        <PickupDetails order={order} />
        <div className="mt-10">
          <OrderLines lines={order.items} total={order.total} />
        </div>
        <p className="mt-6 text-sm text-muted">
          Przy odbiorze podaj numer zamówienia <strong className="font-semibold text-roast">{order.number}</strong> lub imię. Potwierdzenie transakcji wysyła
          operator płatności na adres e-mail podany w zamówieniu (jeśli sprzedawca włączył tę opcję).
        </p>
        <Link href="/" className="btn btn-secondary mt-10">
          Wróć na stronę główną
        </Link>
      </StatusShell>
    );
  }

  if (order.status === "pending") {
    return (
      <StatusShell eyebrow={`Zamówienie ${order.number}`} title="Czekamy na potwierdzenie płatności" icon={<ClockIcon size={28} />}>
        <p className="text-espresso">Czekamy, aż operator płatności potwierdzi transakcję. Strona odświeży się sama. Nie zamykaj jej i nie płać ponownie.</p>
        {slow && (
          <p className="mt-5 rounded-xl bg-sand px-4 py-3 text-sm leading-relaxed text-espresso">
            Potwierdzenie trwa dłużej niż zwykle. Jeśli płatność została pobrana, zamówienie zostanie potwierdzone automatycznie. W razie wątpliwości skontaktuj
            się z nami, podając numer zamówienia {order.number}.
          </p>
        )}
        {process.env.NODE_ENV === "development" && (
          <p className="mt-5 rounded-xl border border-dashed border-latte px-4 py-3 font-mono text-xs leading-relaxed text-muted">
            DEV: status zmienia wyłącznie webhook. Lokalnie uruchom: stripe listen --forward-to localhost:3000/api/stripe/webhook i ustaw STRIPE_WEBHOOK_SECRET.
          </p>
        )}
        <PickupDetails order={order} />
      </StatusShell>
    );
  }

  return (
    <StatusShell
      eyebrow={`Zamówienie ${order.number}`}
      title={order.status === "failed" ? "Płatność nie powiodła się" : "Zamówienie anulowane"}
      icon={<AlertIcon size={28} />}
    >
      <p className="text-espresso">
        {order.status === "failed"
          ? "Operator płatności odrzucił transakcję i nie pobrał środków za to zamówienie."
          : "Sesja płatności wygasła lub została anulowana. Środki nie zostały pobrane."}{" "}
        Twój koszyk wciąż czeka – możesz spróbować ponownie.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/zamowienie" className="btn btn-primary">
          Spróbuj ponownie
        </Link>
        <Link href="/" className="btn btn-secondary">
          Strona główna
        </Link>
      </div>
    </StatusShell>
  );
}

export function PickupDetails({ order }: { order: PublicOrder }) {
  return (
    <dl className="mt-8 grid gap-4 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-2">
      <div className="flex gap-3">
        <PinIcon size={20} className="mt-0.5 shrink-0 text-latte" />
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-muted">Odbiór</dt>
          <dd className="mt-1 text-roast">
            {order.locationName}
            <span className="block text-sm text-muted">{order.locationAddress}</span>
          </dd>
        </div>
      </div>
      <div className="flex gap-3">
        <ClockIcon size={20} className="mt-0.5 shrink-0 text-latte" />
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-muted">Godzina</dt>
          <dd className="mt-1 text-roast">{formatPickup(order.pickupDate, order.pickupTime)}</dd>
        </div>
      </div>
    </dl>
  );
}

export function StatusShell({
  eyebrow,
  title,
  icon,
  tone = "neutral",
  children,
}: {
  eyebrow: string;
  title: string;
  icon?: React.ReactNode;
  tone?: "neutral" | "success";
  children: React.ReactNode;
}) {
  return (
    <div className="container-x py-20 lg:py-28">
      <div className="mx-auto max-w-2xl">
        {icon && (
          <span
            className={`inline-flex h-14 w-14 items-center justify-center rounded-full ${tone === "success" ? "bg-success text-paper" : "bg-sand text-roast"}`}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <p className="eyebrow mt-8">{eyebrow}</p>
        <h1 className="mt-4 text-[clamp(2.2rem,1.5rem+2.6vw,3.6rem)]" aria-live="polite">
          {title}
        </h1>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
