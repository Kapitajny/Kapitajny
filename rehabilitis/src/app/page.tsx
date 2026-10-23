import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/data/faq";
import { getLocalBusinessJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { ApproachTeaser } from "@/components/home/ApproachTeaser";
import { Hero } from "@/components/home/Hero";
import { RegionIndex } from "@/components/home/RegionIndex";
import { ServiceIndex } from "@/components/home/ServiceIndex";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { VisitSteps } from "@/components/sections/VisitSteps";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const HOME_FAQ = ["pierwsza-wizyta", "przygotowanie", "czas-trwania"];

export default function HomePage() {
  const jsonLd = getLocalBusinessJsonLd();
  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />}
      <Hero />
      <RegionIndex />
      <ServiceIndex />

      <section aria-labelledby="pierwsza-wizyta-title" className="bg-brand-soft py-section">
        <div className="page">
          <h2 id="pierwsza-wizyta-title" className="text-h2">
            Pierwsza wizyta krok po kroku
          </h2>
          <p className="mt-4 max-w-prose text-lead">Nie musisz wiedzieć, jakiej terapii potrzebujesz. Na pierwszym spotkaniu ustalimy to razem.</p>
          <VisitSteps />
          <p className="mt-10">
            <Link href="/o-gabinecie#pierwsza-wizyta" className="link">
              Co zabrać i jak się przygotować
            </Link>
          </p>
        </div>
      </section>

      <ApproachTeaser />
      <Testimonials />

      <section aria-labelledby="faq-skrot-title" className="border-t border-line py-section">
        <div className="page grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <h2 id="faq-skrot-title" className="text-h2">
              Zanim przyjdziesz
            </h2>
            <p className="mt-4">
              <Link href="/faq" className="link">
                Wszystkie pytania i odpowiedzi
              </Link>
            </p>
          </div>
          <FaqList items={FAQ.filter((item) => HOME_FAQ.includes(item.id))} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
