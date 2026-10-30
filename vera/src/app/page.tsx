import { ContactBlock } from "@/components/home/ContactBlock";
import { EditorialGallery } from "@/components/home/EditorialGallery";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { JournalPreview } from "@/components/home/JournalPreview";
import { Philosophy } from "@/components/home/Philosophy";
import { SelectedTreatments } from "@/components/home/SelectedTreatments";
import { SpecialistsPreview } from "@/components/home/SpecialistsPreview";
import { JsonLd, studioJsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd data={studioJsonLd()} />
      <Hero />
      <Philosophy />
      <SelectedTreatments />
      <Experience />
      <SpecialistsPreview />
      <EditorialGallery />
      <JournalPreview />
      <ContactBlock />
    </>
  );
}
