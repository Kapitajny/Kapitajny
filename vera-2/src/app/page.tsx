import { CategoryCapsules } from "@/components/home/CategoryCapsules";
import { ConcernFinder } from "@/components/home/ConcernFinder";
import { Hero } from "@/components/home/Hero";
import { Moodboard } from "@/components/home/Moodboard";
import { NotesPreview } from "@/components/home/NotesPreview";
import { QuoteBand } from "@/components/home/QuoteBand";
import { SpecialistsCircles } from "@/components/home/SpecialistsCircles";
import { VisitCard } from "@/components/home/VisitCard";
import { VisitRitual } from "@/components/home/VisitRitual";
import { JsonLd, studioJsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd data={studioJsonLd()} />
      <Hero />
      <ConcernFinder />
      <CategoryCapsules />
      <QuoteBand />
      <VisitRitual />
      <Moodboard />
      <SpecialistsCircles />
      <NotesPreview />
      <VisitCard />
    </>
  );
}
