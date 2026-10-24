import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { company } from "@/content/company";
import type { JobOffer } from "@/content/careers";
import { pageMetadata } from "@/lib/metadata";
import { JobOfferView } from "@/components/careers/JobOfferView";
import { DemoNote } from "@/components/ui/DemoNote";

export const metadata = pageMetadata({
  title: "Szablon ogłoszenia o pracę (podgląd)",
  description: "Podgląd układu podstrony ogłoszenia o pracę w koncepcji redesignu. To nie jest aktualna oferta pracy.",
  path: "/kariera/wzor-ogloszenia",
  noindex: true,
});

/** Szablon pokazujący układ ogłoszenia – bez treści, które mógłby podać tylko dział kadr. */
const template: JobOffer = {
  slug: "wzor-ogloszenia",
  title: "Nazwa stanowiska",
  place: "Miejsce pracy",
  publishedAt: "2000-01-01",
  employmentType: "forma zatrudnienia",
  summary: "Podgląd szablonu. To nie jest aktualne ogłoszenie – tak będzie wyglądać oferta opublikowana przez dział kadr.",
  responsibilities: [],
  requirements: [],
  offer: [],
  applyEmail: company.email,
};

export default function JobTemplatePage() {
  if (!siteConfig.demoMode) notFound();
  return (
    <>
      <div className="container-x pt-6">
        <DemoNote>Szablon widoczny tylko w trybie demonstracyjnym i wyłączony z indeksowania.</DemoNote>
      </div>
      <JobOfferView offer={template} template />
    </>
  );
}
