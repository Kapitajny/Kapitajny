import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PortfolioGrid } from "@/components/sections/Portfolio";
import { PageHero } from "@/components/ui/SectionHeading";
import { interleaved } from "@/data/projects";

export const metadata: Metadata = {
  title: "Realizacje",
  description: "Koncepcje demonstracyjne stron i sklepów internetowych przygotowane przez ComputerIT. Każdą można otworzyć i przeklikać.",
  alternates: { canonical: "/realizacje" },
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Realizacje"
        title="Koncepcje, które możesz przeklikać"
        lead="Wszystkie projekty to koncepcje demonstracyjne przygotowane przez ComputerIT dla fikcyjnych marek – nie są realizacjami dla klientów. Adresy, ceny i dane kontaktowe w nich są przykładowe, a sklepy nie przyjmują prawdziwych zamówień ani płatności."
      />
      <section className="section container-x" aria-labelledby="lista-realizacji">
        <h2 id="lista-realizacji" className="sr-only">
          Lista realizacji
        </h2>
        <PortfolioGrid projects={interleaved} />
      </section>
      <CtaBand title="Chcesz podobny projekt?" secondary={{ href: "/uslugi", label: "Poznaj nasze usługi" }} />
    </>
  );
}
