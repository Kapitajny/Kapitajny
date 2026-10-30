import type { Metadata } from "next";
import { site } from "@/config/site";
import { ContactBand } from "@/components/home/ContactBand";
import { EditorialStrip } from "@/components/home/EditorialStrip";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { JournalPreview } from "@/components/home/JournalPreview";
import { Philosophy } from "@/components/home/Philosophy";
import { SpecialistsTabs } from "@/components/home/SpecialistsTabs";
import { TreatmentIndex } from "@/components/home/TreatmentIndex";
import { JsonLd, studioJsonLd } from "@/components/seo/JsonLd";
import { editorial } from "@/data/gallery";
import { specialists } from "@/data/specialists";
import { categories, treatmentsIn } from "@/data/treatments";
import { resolveImage } from "@/lib/images.server";

export const metadata: Metadata = {
  title: { absolute: "VÉRA Aesthetic Studio – Your beauty. Your identity." },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { title: "VÉRA Aesthetic Studio", description: site.description, url: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={studioJsonLd()} />
      <Hero />
      <Philosophy />

      <section aria-labelledby="selected-title">
        <div className="wrap py-24 lg:py-32">
          <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 id="selected-title" className="display-lg lg:col-span-7">
              Selected treatments
            </h2>
            <p className="max-w-md text-stone lg:col-span-4 lg:col-start-9">Four disciplines under one roof. Every treatment begins with a consultation.</p>
          </div>
          <TreatmentIndex
            items={categories.map((c) => ({ slug: c.slug, name: c.name, line: c.line, count: treatmentsIn(c.slug).length, image: resolveImage(c.image) }))}
          />
        </div>
      </section>

      <Experience />

      <section aria-labelledby="specialists-title" className="bg-powder">
        <div className="wrap py-24 lg:py-32">
          <h2 id="specialists-title" className="display-lg mb-14 max-w-3xl">
            Meet our specialists
          </h2>
          <SpecialistsTabs people={specialists.map((s) => ({ slug: s.slug, name: s.name, role: s.role, discipline: s.discipline, quote: s.quote, image: resolveImage(s.image) }))} />
        </div>
      </section>

      <section aria-labelledby="editorial-title" className="overflow-hidden py-24 lg:py-32">
        <div className="wrap mb-2 grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="editorial-title" className="display-lg lg:col-span-6">
            Editorial
          </h2>
          <p className="max-w-sm text-stone lg:col-span-4 lg:col-start-9">The studio, the details and the light – an ongoing series shot in Kazimierz.</p>
        </div>
        <EditorialStrip frames={editorial.map((f) => ({ ...f, image: resolveImage(f.image) }))} />
      </section>

      <JournalPreview />
      <ContactBand />
    </>
  );
}
