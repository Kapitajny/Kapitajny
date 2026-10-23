import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { FIRST_VISIT, PAYMENT_METHODS, PRICE_GROUPS, PRICES_ARE_EXAMPLES } from "@/data/pricing";
import { Breadcrumb } from "@/components/sections/Breadcrumb";
import { ContactStrip } from "@/components/sections/ContactStrip";
import { ExamplePricesNote } from "@/components/sections/ExamplePricesNote";
import { PendingValue } from "@/components/ui/Pending";

export const metadata: Metadata = pageMetadata({
  title: "Cennik – fizjoterapia, rehabilitacja i masaż leczniczy",
  description: "Ceny i czas trwania wizyt: konsultacja fizjoterapeutyczna, fizjoterapia indywidualna, rehabilitacja ortopedyczna i pooperacyjna, masaż leczniczy, pakiety wizyt.",
  path: "/cennik",
});

export default function PricingPage() {
  return (
    <>
      <header className="content pt-10 lg:pt-16">
        <Breadcrumb current="Cennik" />
        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] md:items-end md:gap-12">
          <div>
            <h1 className="text-display">Cennik</h1>
            <p className="mt-6 max-w-prose text-lead">Zakres i czas terapii ustalamy indywidualnie. Na pierwszej wizycie omawiamy, ile spotkań może być potrzebnych i jak często.</p>
          </div>
          {FIRST_VISIT?.price && (
            <p className="rounded-photo bg-brand-deep p-6 text-white">
              <span className="block text-small text-white/80">Pierwsza wizyta{FIRST_VISIT.duration ? `, ${FIRST_VISIT.duration}` : ""}</span>
              <span className="mt-1 block text-h2 font-semibold [font-stretch:78%] tabular-nums">{FIRST_VISIT.price}</span>
              {PRICES_ARE_EXAMPLES && <span className="mt-2 block text-caption text-white/80">cena przykładowa</span>}
            </p>
          )}
        </div>
      </header>

      <div className="content grid gap-12 pb-section pt-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
        <div className="space-y-14">
          <ExamplePricesNote />
          {PRICE_GROUPS.map((group, groupIndex) => (
            <section key={group.title} aria-labelledby={`cennik-${groupIndex}`}>
              <h2 id={`cennik-${groupIndex}`} className="text-h3">
                {group.title}
              </h2>
              <ul className="mt-4 border-t-2 border-brand-deep">
                {group.items.map((item, i) => (
                  <li key={`${item.title}-${i}`} className="border-b border-line py-5">
                    <div className="flex items-baseline gap-3">
                      <span className="font-semibold text-ink">{item.title}</span>
                      <span aria-hidden="true" className="leader hidden sm:block" />
                      <span className="ml-auto shrink-0 text-h4 font-semibold text-brand-deep tabular-nums sm:ml-0">
                        <span className="sr-only">Cena: </span>
                        {item.price ?? <PendingValue />}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap justify-between gap-x-6 gap-y-1 text-small text-muted">
                      <span>{item.note}</span>
                      <span className="tabular-nums">
                        <span className="sr-only">Czas: </span>
                        {item.duration ?? <PendingValue />}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside aria-labelledby="zasady" className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-photo bg-mint p-6">
            <h2 id="zasady" className="text-h3">
              Zasady
            </h2>
            <ul className="mt-4 space-y-4 text-small">
              <li>Na wizytę prywatną nie potrzebujesz skierowania.</li>
              <li>Ceny dotyczą jednej wizyty, a w przypadku pakietów całego pakietu.</li>
              {PAYMENT_METHODS?.length ? <li>Płatność: {PAYMENT_METHODS.join(", ")}.</li> : null}
              <li>
                Zasady odwoływania wizyt opisujemy w{" "}
                <Link href="/faq#faq-odwolanie" className="link">
                  najczęstszych pytaniach
                </Link>
                .
              </li>
              <li>
                Masz pytanie o koszt terapii w Twojej sytuacji?{" "}
                <Link href="/kontakt#formularz" className="link">
                  Napisz do nas
                </Link>
                .
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <ContactStrip />
    </>
  );
}
