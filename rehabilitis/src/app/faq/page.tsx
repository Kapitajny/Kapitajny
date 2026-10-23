import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { phoneHref, siteConfig } from "@/config/site";
import { FAQ } from "@/data/faq";
import { Breadcrumb } from "@/components/sections/Breadcrumb";
import { FaqList } from "@/components/sections/FaqList";

export const metadata: Metadata = pageMetadata({
  title: "Najczęstsze pytania – skierowanie, pierwsza wizyta, płatność",
  description: "Czy potrzebuję skierowania do fizjoterapeuty? Jak przygotować się do wizyty, ile trwa spotkanie, co zabrać na rehabilitację i jak odwołać wizytę.",
  path: "/faq",
});

/** FAQ: nagłówek i pytanie „czego tu nie ma” w przyklejonej kolumnie, pytania w szerokiej kolumnie obok. */
export default function FaqPage() {
  const { phone } = siteConfig.contact;
  return (
    <div className="content grid gap-12 pb-section pt-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16 lg:pt-16">
      <div className="lg:sticky lg:top-8 lg:self-start">
        <Breadcrumb current="Najczęstsze pytania" />
        <h1 className="mt-8 text-h2">Najczęstsze pytania</h1>
        <p className="mt-5 max-w-prose text-muted">Odpowiedzi na pytania, które pacjenci zadają przed pierwszą wizytą.</p>

        <aside aria-labelledby="pytanie" className="mt-10 rounded-photo bg-mint p-6">
          <h2 id="pytanie" className="text-h3">
            Nie ma tu Twojego pytania?
          </h2>
          <p className="mt-2 text-small">{phone ? "Napisz lub zadzwoń." : "Napisz do nas."} Odpowiemy przed wizytą.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/kontakt#formularz" className="btn btn-primary">
              Zadaj pytanie
            </Link>
            {phone && (
              <a href={phoneHref(phone)} className="btn btn-quiet">
                Zadzwoń: {phone}
              </a>
            )}
          </div>
        </aside>
      </div>

      <div className="lg:pt-16">
        <FaqList items={FAQ} headingLevel={2} />
      </div>
    </div>
  );
}
