import type { Metadata } from "next";
import Link from "next/link";
import { PAYMENT_METHODS } from "@/data/pricing";
import { CtaBand } from "@/components/sections/CtaBand";
import { ExamplePricesNote } from "@/components/sections/ExamplePricesNote";
import { PageIntro } from "@/components/sections/PageIntro";
import { PriceTable } from "@/components/sections/PriceTable";

export const metadata: Metadata = {
  title: "Cennik – fizjoterapia, rehabilitacja i masaż leczniczy",
  description: "Ceny i czas trwania wizyt: konsultacja fizjoterapeutyczna, fizjoterapia indywidualna, rehabilitacja ortopedyczna i pooperacyjna, masaż leczniczy, pakiety wizyt.",
  alternates: { canonical: "/cennik" },
};

export default function PricingPage() {
  return (
    <>
      <PageIntro
        title="Cennik"
        lead="Zakres oraz czas terapii ustalamy indywidualnie. Na pierwszej wizycie omawiamy, ile spotkań może być potrzebnych i jak często."
        aside={<ExamplePricesNote />}
      />

      <div className="page grid gap-12 py-section lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <PriceTable />

        <aside aria-labelledby="zasady" className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="zasady" className="text-h3">
            Zasady
          </h2>
          <ul className="mt-4 space-y-4 border-t border-line pt-4 text-small">
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
        </aside>
      </div>

      <CtaBand />
    </>
  );
}
