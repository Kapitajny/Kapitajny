import type { Metadata } from "next";
import { CaseIndex } from "@/components/cases/CaseIndex";
import { ClosingCta } from "@/components/ui/ClosingCta";
import { PageHeader } from "@/components/ui/PageHeader";
import { caseStudies } from "@/content/cases";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Realizacje – demonstracyjne studia przypadku",
  description:
    "Demonstracyjne studia przypadku: bezpieczeństwo dostępów i poczty, modernizacja infrastruktury sklepu internetowego, kopie zapasowe i odtwarzanie danych, standaryzacja stanowisk.",
  path: "/realizacje",
});

export default function CasesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: "/realizacje", label: "Realizacje" }]}
        title="Realizacje"
        lede="Studia przypadku pokazują, jak pracujemy: od opisu problemu, przez założenia i analizę rozwiązań, po kryteria, według których sprawdzamy efekt."
        aside={
          <p className={styles.disclaimer}>
            <strong>Wszystkie realizacje są demonstracyjne.</strong> Firmy, ich profile i okoliczności są fikcyjne. Nie podajemy wyników liczbowych,
            bo nie pochodzą z rzeczywistych wdrożeń.
          </p>
        }
      />
      <section className={`container ${styles.section}`} aria-label="Lista realizacji">
        <CaseIndex cases={caseStudies} />
      </section>
      <ClosingCta
        headingId="realizacje-cta"
        title="Twoja sytuacja wygląda podobnie?"
        text="Opisz ją w kilku zdaniach. Odpowiemy, od czego zaczęlibyśmy w Twojej firmie."
        secondary={{ href: "/uslugi", label: "Zobacz zakres usług" }}
      />
    </>
  );
}
