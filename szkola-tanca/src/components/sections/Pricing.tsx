import Link from "next/link";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { formatPrice, PRICING, type PricingPlan } from "@/data/pricing";

/** Dziurki do skasowania na karnecie – ich liczba to liczba wejść. */
function Punches({ entries, dark }: { entries: number | null; dark: boolean }) {
  const count = entries ?? 12;
  return (
    <div className="flex max-w-[14rem] flex-wrap gap-1.5" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={`h-4 w-4 rounded-full border-[1.5px] ${dark ? "border-blush" : "border-wine"} ${entries === null && index > 7 ? "opacity-40" : ""}`}
        />
      ))}
    </div>
  );
}

function Ticket({ plan }: { plan: PricingPlan }) {
  const dark = Boolean(plan.featured);
  const entriesLabel = plan.entries === null ? "Bez limitu wejść" : plan.entries === 1 ? "1 wejście" : `${plan.entries} wejść`;
  return (
    <li
      className={`ticket grid gap-6 rounded-[1.5rem] p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:gap-10 ${
        dark ? "on-dark bg-cocoa text-ivory" : "bg-blush"
      }`}
    >
      <div>
        {plan.featured && <p className="label mb-2 text-blush">Polecamy na regularny start</p>}
        <h3 className="h3">{plan.name}</h3>
        <p className="mt-2 max-w-[46ch]">{plan.summary}</p>
        <ul className={`mt-3 space-y-1 text-[0.95rem] ${dark ? "text-ivory/90" : ""}`}>
          {plan.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <Punches entries={plan.entries} dark={dark} />
        <p className="text-sm font-semibold">{entriesLabel}</p>
      </div>
      <p className="md:min-w-[9rem] md:text-right">
        <span className={`block text-5xl font-bold leading-none tracking-[-0.03em] [font-stretch:75%] ${dark ? "" : "text-wine"}`}>{formatPrice(plan.price)}</span>
        <span className="mt-1 block text-sm">{plan.unit}</span>
      </p>
    </li>
  );
}

export function Pricing() {
  return (
    <section id="cennik" aria-labelledby="cennik-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="cennik-title" className="h2 text-wine lg:col-span-7">
            Karnety bez drobnego druku
          </h2>
          <div className="lg:col-span-5">
            <p className="prose-measure">
              Zacznij od lekcji próbnej, a karnet wybierz dopiero wtedy, gdy wiesz, jak często chcesz tańczyć. Każda dziurka to jedno wejście.
            </p>
            <DemoBadge className="mt-5">Ceny przykładowe, do uzupełnienia przez studio</DemoBadge>
          </div>
        </div>

        <ul className="mt-12 grid gap-3">
          {PRICING.map((plan) => (
            <Ticket key={plan.id} plan={plan} />
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href="#zapis" className="btn btn-primary">
            Zacznij od lekcji próbnej
          </Link>
          <p className="text-[0.95rem]">Karnet kupujesz w studiu po pierwszych zajęciach. Na tej stronie nic nie płacisz.</p>
        </div>
      </div>
    </section>
  );
}
