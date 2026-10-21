import Link from "next/link";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Check } from "@/components/ui/Icons";
import { formatPrice, PRICING } from "@/data/pricing";

export function Pricing() {
  const featured = PRICING.find((plan) => plan.featured);
  const others = PRICING.filter((plan) => !plan.featured);

  return (
    <section id="cennik" aria-labelledby="cennik-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">Cennik i karnety</p>
            <h2 id="cennik-title" className="h2 mt-5 text-wine">
              Proste zasady, bez drobnego druku
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="prose-measure">Zacznij od lekcji próbnej, a karnet wybierz dopiero wtedy, gdy wiesz, jak często chcesz tańczyć.</p>
            <DemoBadge className="mt-5">Ceny przykładowe – do uzupełnienia przez studio</DemoBadge>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <ul className="border-b rule lg:col-span-7">
            {others.map((plan) => (
              <li key={plan.id} className="grid gap-3 border-t rule py-7 sm:grid-cols-[1fr_auto] sm:gap-8">
                <div>
                  <h3 className="font-serif text-[1.9rem] leading-tight">{plan.name}</h3>
                  <p className="mt-2 max-w-[48ch]">{plan.summary}</p>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    {plan.details.map((detail) => (
                      <li key={detail} className="inline-flex items-center gap-1.5">
                        <Check size={15} className="text-wine" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="sm:text-right">
                  <span className="font-serif text-4xl text-wine">{formatPrice(plan.price)}</span>
                  <span className="block text-sm">{plan.unit}</span>
                </p>
              </li>
            ))}
          </ul>

          {featured && (
            <div className="flex flex-col bg-blush p-8 sm:p-10 lg:col-span-5 lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wine">Polecamy na regularny start</p>
              <h3 className="mt-4 font-serif text-[2.4rem] leading-tight">{featured.name}</h3>
              <p className="mt-3">{featured.summary}</p>
              <p className="mt-8 flex items-baseline gap-3">
                <span className="font-serif text-6xl text-wine">{formatPrice(featured.price)}</span>
                <span className="text-sm">{featured.unit}</span>
              </p>
              <ul className="mt-6 space-y-2 border-t border-cocoa/20 pt-6">
                {featured.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2">
                    <Check size={18} className="mt-1 shrink-0 text-wine" />
                    {detail}
                  </li>
                ))}
              </ul>
              <Link href="#zapis" className="btn btn-primary mt-8 self-start">
                Zacznij od lekcji próbnej
              </Link>
              <p className="mt-4 text-sm">Pakiet kupujesz w studiu po pierwszych zajęciach – nic nie płacisz online.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
