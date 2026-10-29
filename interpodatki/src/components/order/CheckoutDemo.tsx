"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ledger } from "@/components/calculator/Ledger";
import { IconArrowLeft, IconBank, IconCard, IconLock, IconPhoneApp } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import { postJson } from "@/lib/api-client";
import { formatDateTime, formatPLN } from "@/lib/format";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHODS,
  PAYMENT_SCENARIOS,
  type PaymentMethod,
  type PaymentScenario,
  type PublicOrder,
  type PublicPayment,
} from "@/lib/payments";

const METHOD_ICONS = { blik: IconPhoneApp, przelew: IconBank, karta: IconCard } as const;

export function DemoBanner() {
  return (
    <div role="note" className="border-y-2 border-gold bg-navy-deep text-white">
      <p className="shell flex flex-wrap items-center gap-x-3 gap-y-1 py-3 text-sm font-semibold tracking-wide sm:text-base">
        <IconLock size={18} className="shrink-0 text-gold" />
        TRYB DEMONSTRACYJNY — PŁATNOŚCI NIE SĄ REALIZOWANE
      </p>
    </div>
  );
}

export function CheckoutDemo({ initialOrder }: { initialOrder: PublicOrder }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [method, setMethod] = useState<PaymentMethod>("blik");
  const [scenario, setScenario] = useState<PaymentScenario>("success");
  const [status, setStatus] = useState<"idle" | "processing" | "failed" | "error">("idle");
  const [lastPayment, setLastPayment] = useState<PublicPayment | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setStatus("processing");
    const res = await postJson<{ order: PublicOrder; payment: PublicPayment }>(
      `/api/demo/orders/${encodeURIComponent(order.id)}/payment`,
      { method, scenario },
    );
    if (!res.ok) {
      setStatus("error");
      setErrorMessage(res.message);
      return;
    }
    setOrder(res.data.order);
    setLastPayment(res.data.payment);
    if (res.data.payment.status === "succeeded") {
      router.push(`/potwierdzenie?zamowienie=${encodeURIComponent(order.id)}`);
      return;
    }
    setStatus("failed");
    requestAnimationFrame(() => document.getElementById("payment-result")?.focus());
  }

  const processing = status === "processing";
  const paid = order.status === "paid";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-12">
      <div className="min-w-0 space-y-6">
        {paid ? (
          <Notice tone="success" title="To zamówienie zostało już opłacone w trybie demo" role="status">
            <Link href={`/potwierdzenie?zamowienie=${encodeURIComponent(order.id)}`} className="link">
              Zobacz potwierdzenie
            </Link>
          </Notice>
        ) : (
          <form onSubmit={pay} className="panel p-5 sm:p-8" aria-label="Płatność demonstracyjna" aria-busy={processing}>
            <h2 className="text-[1.75rem]">Płatność demonstracyjna</h2>
            <p className="mt-2 text-ink">
              Wybierz przykładową metodę i scenariusz testowy. Serwis nie łączy się z operatorem płatności i nie
              przetwarza danych kart – nie wpisujesz tu żadnych danych płatniczych.
            </p>

            <fieldset className="mt-6" disabled={processing}>
              <legend className="field-label">Metoda płatności (symulacja)</legend>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((m) => {
                  const Icon = METHOD_ICONS[m];
                  return (
                    <label key={m} className="choice flex-col gap-2">
                      <span className="flex items-center gap-2">
                        <input type="radio" name="method" checked={method === m} onChange={() => setMethod(m)} />
                        <Icon size={20} className="text-navy" />
                      </span>
                      <span>
                        <span className="block font-medium text-navy">{PAYMENT_METHODS[m].label}</span>
                        <span className="block text-sm text-muted">{PAYMENT_METHODS[m].hint}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-6" disabled={processing}>
              <legend className="field-label">Wynik testowej transakcji</legend>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {(Object.keys(PAYMENT_SCENARIOS) as PaymentScenario[]).map((s) => (
                  <label key={s} className="choice">
                    <input type="radio" name="scenario" checked={scenario === s} onChange={() => setScenario(s)} />
                    <span>
                      <span className="block font-medium text-navy">{PAYMENT_SCENARIOS[s].label}</span>
                      <span className="block text-sm text-muted">{PAYMENT_SCENARIOS[s].hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div id="payment-result" tabIndex={-1} className="mt-6 focus:outline-none" aria-live="polite">
              {status === "failed" && lastPayment && (
                <Notice tone="error" title="Płatność demonstracyjna nie powiodła się">
                  <p>{lastPayment.message}</p>
                  <p className="num mt-1 text-sm text-muted">Referencja testowa: {lastPayment.reference}</p>
                </Notice>
              )}
              {status === "error" && (
                <Notice tone="error" title="Nie udało się przetworzyć symulacji" role="alert">
                  {errorMessage}
                </Notice>
              )}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
              <Link href={`/zamowienie?zamowienie=${encodeURIComponent(order.id)}`} className="btn btn-outline">
                <IconArrowLeft size={18} />
                Wróć do zamówienia
              </Link>
              <button type="submit" className="btn btn-primary" disabled={processing}>
                {processing && <span className="spinner" aria-hidden="true" />}
                {processing
                  ? "Przetwarzanie symulacji…"
                  : status === "failed"
                    ? "Spróbuj ponownie (symulacja)"
                    : `Zapłać ${formatPLN(order.dueNow)} (symulacja)`}
              </button>
            </div>
          </form>
        )}

        {order.payments.length > 0 && (
          <section className="panel p-5 sm:p-6" aria-labelledby="historia">
            <h2 id="historia" className="font-sans text-base font-semibold">
              Historia prób płatności (demo)
            </h2>
            <ul className="mt-3 divide-y divide-line text-[0.9375rem]">
              {[...order.payments].reverse().map((p) => (
                <li key={p.reference} className="flex flex-wrap justify-between gap-2 py-2.5">
                  <span>
                    <span className="num text-navy">{p.reference}</span>
                    <span className="block text-sm text-muted">
                      {PAYMENT_METHODS[p.method].label}, {formatDateTime(p.createdAt)}
                    </span>
                  </span>
                  <span className={p.status === "succeeded" ? "font-medium text-teal-ink" : "font-medium text-danger"}>
                    {p.status === "succeeded" ? "Zaakceptowana (demo)" : "Odrzucona (demo)"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <aside aria-label="Podsumowanie zamówienia" className="lg:sticky lg:top-24 lg:self-start">
        <div className="panel overflow-hidden shadow-[var(--shadow-panel)]">
          <div className="border-b border-line bg-mist px-5 py-4">
            <p className="text-sm text-muted">Zamówienie testowe</p>
            <p className="num font-semibold text-navy" data-testid="order-number">
              {order.number}
            </p>
            <p className="mt-1 text-sm">
              Status: <span className="font-medium text-navy" data-testid="order-status">{ORDER_STATUS_LABELS[order.status]}</span>
            </p>
          </div>
          <div className="p-5">
            <p className="text-sm text-muted">Pakiet {order.packageName}</p>
            <div className="mt-3">
              <Ledger lines={order.lines} totalLabel="Opłata miesięczna" total={order.monthly} />
            </div>
            <dl className="num mt-5 space-y-2 text-[0.9375rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink">Opłata jednorazowa</dt>
                <dd className="text-navy">{formatPLN(order.oneTimeFee)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-2">
                <dt className="font-semibold text-navy">Do zapłaty teraz</dt>
                <dd className="font-semibold text-navy">{formatPLN(order.dueNow)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink">Kolejne miesiące</dt>
                <dd className="text-navy">{formatPLN(order.monthly)} / mies.</dd>
              </div>
            </dl>
            <p className="mt-4 text-[0.8125rem] text-muted">Kwoty netto. Wartości wyliczone na serwerze demonstracyjnym.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
