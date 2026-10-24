import Link from "next/link";
import { Ledger } from "@/components/calculator/Ledger";
import { DemoBanner } from "@/components/order/CheckoutDemo";
import { OrderMissing } from "@/components/order/OrderMissing";
import { IconCheck } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import { formatDateTime, formatPLN } from "@/lib/format";
import { ORDER_STATUS_LABELS, PAYMENT_METHODS } from "@/lib/payments";
import { getOrderForSession } from "@/lib/server/orders";
import { readDemoSession } from "@/lib/server/session";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Potwierdzenie zamówienia (demo)",
  description: "Potwierdzenie demonstracyjnego zamówienia InterPodatki. Żadne środki nie zostały pobrane.",
  path: "/potwierdzenie",
  noindex: true,
});

const nextSteps = [
  "Opiekun kontaktuje się w celu potwierdzenia zakresu usług.",
  "Przygotowanie i podpisanie umowy o świadczenie usług.",
  "Przekazanie dokumentacji i konfiguracja obiegu dokumentów.",
  "Pierwsze zamknięcie miesiąca i omówienie zestawienia.",
];

export default async function ConfirmationPage({ searchParams }: PageProps<"/potwierdzenie">) {
  const { zamowienie } = await searchParams;
  const order = typeof zamowienie === "string" ? getOrderForSession(zamowienie, await readDemoSession()) : undefined;
  const payment = order?.payments.findLast((p) => p.status === "succeeded");

  return (
    <>
      <DemoBanner />
      <div className="bg-mist/60 py-12 sm:py-16">
        <div className="shell">
          {!order ? (
            <>
              <h1 className="mb-8 text-[clamp(2rem,1.5rem+2vw,3rem)]">Potwierdzenie zamówienia</h1>
              <OrderMissing />
            </>
          ) : order.status !== "paid" || !payment ? (
            <div className="max-w-2xl space-y-6">
              <h1 className="text-[clamp(2rem,1.5rem+2vw,3rem)]">Zamówienie nie zostało opłacone</h1>
              <Notice tone="warning" title={ORDER_STATUS_LABELS[order.status]}>
                Zamówienie {order.number} czeka na płatność demonstracyjną. Wróć do płatności, aby dokończyć symulację.
              </Notice>
              <Link href={`/platnosc-demo?zamowienie=${encodeURIComponent(order.id)}`} className="btn btn-primary">
                Wróć do płatności demo
              </Link>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-12">
              <div className="min-w-0">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-wash text-teal-ink">
                  <IconCheck size={26} />
                </span>
                <h1 className="mt-5 text-[clamp(2rem,1.5rem+2vw,3rem)]">Zamówienie testowe przyjęte</h1>
                <p className="lede mt-4" data-testid="confirmation-message">
                  Demonstracyjna transakcja zakończona powodzeniem. Nie pobrano żadnych środków.
                </p>
                <Notice tone="demo" className="mt-6" title="To nie jest potwierdzenie rzeczywistej płatności">
                  Zamówienie i płatność zostały zasymulowane. Nie zawarto umowy, nie wystawiono faktury i nie
                  przekazano danych do operatora płatności.
                </Notice>

                <dl className="mt-8 grid gap-4 rounded-[var(--radius-panel)] border border-line bg-white p-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-muted">Numer zamówienia</dt>
                    <dd className="num font-semibold text-navy" data-testid="order-number">{order.number}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted">Status</dt>
                    <dd className="font-semibold text-teal-ink">{ORDER_STATUS_LABELS[order.status]}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted">Referencja testowa</dt>
                    <dd className="num text-navy">{payment.reference}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted">Metoda (symulacja)</dt>
                    <dd className="text-navy">{PAYMENT_METHODS[payment.method].label}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm text-muted">Data</dt>
                    <dd className="text-navy">{formatDateTime(payment.createdAt)}</dd>
                  </div>
                </dl>

                <h2 className="mt-12 text-[1.75rem]">Co działoby się dalej</h2>
                <ol className="mt-5 space-y-4">
                  {nextSteps.map((step, i) => (
                    <li key={step} className="flex gap-4">
                      <span className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-navy bg-white text-sm font-semibold text-navy">
                        {i + 1}
                      </span>
                      <span className="pt-1 text-ink">{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/panel-demo" className="btn btn-dark">
                    Przejdź do panelu klienta (demo)
                  </Link>
                  <Link href="/" className="btn btn-outline">
                    Wróć na stronę główną
                  </Link>
                </div>
              </div>

              <aside className="panel h-fit p-5" aria-label="Podsumowanie kosztów">
                <p className="text-sm text-muted">Pakiet {order.packageName}</p>
                <div className="mt-3">
                  <Ledger lines={order.lines} totalLabel="Opłata miesięczna" total={order.monthly} />
                </div>
                <dl className="num mt-5 space-y-2 text-[0.9375rem]">
                  <div className="flex justify-between gap-4">
                    <dt>Opłata jednorazowa</dt>
                    <dd className="text-navy">{formatPLN(order.oneTimeFee)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-line pt-2">
                    <dt className="font-semibold text-navy">Zasymulowana kwota</dt>
                    <dd className="font-semibold text-navy">{formatPLN(order.dueNow)}</dd>
                  </div>
                </dl>
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
