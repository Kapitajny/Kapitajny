import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { phoneHref, siteConfig } from "@/config/site";
import { FAQ } from "@/data/faq";
import { FaqList } from "@/components/sections/FaqList";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = pageMetadata({
  title: "Najczęstsze pytania – skierowanie, pierwsza wizyta, płatność",
  description: "Czy potrzebuję skierowania do fizjoterapeuty? Jak przygotować się do wizyty, ile trwa spotkanie, co zabrać na rehabilitację i jak odwołać wizytę.",
  path: "/faq",
});

export default function FaqPage() {
  const { phone } = siteConfig.contact;
  return (
    <>
      <PageIntro title="Najczęstsze pytania" lead="Odpowiedzi na pytania, które pacjenci zadają przed pierwszą wizytą." />

      <div className="page grid gap-12 py-section lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <FaqList items={FAQ} headingLevel={2} />

        <aside aria-labelledby="pytanie" className="border-t-2 border-brand-strong pt-5 lg:sticky lg:top-28 lg:self-start">
          <h2 id="pytanie" className="text-h3">
            Nie ma tu Twojego pytania?
          </h2>
          <p className="mt-2 text-small">{phone ? "Napisz lub zadzwoń." : "Napisz do nas."} Odpowiemy przed wizytą.</p>
          <div className="mt-5 grid gap-3">
            <Link href="/kontakt#formularz" className="btn btn-primary">
              Zadaj pytanie
            </Link>
            {phone && (
              <a href={phoneHref(phone)} className="btn btn-outline">
                Zadzwoń: {phone}
              </a>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
