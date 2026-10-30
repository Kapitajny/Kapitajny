import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ContactBlock } from "@/components/home/ContactBlock";
import { Distinctions } from "@/components/home/Distinctions";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { ServicesIndex } from "@/components/home/ServicesIndex";
import { TeamPreview } from "@/components/home/TeamPreview";
import { JsonLd, clinicJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: { absolute: "ÉLORIA Aesthetic Medical Clinic – medycyna estetyczna i kosmetologia w Warszawie" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: { title: "ÉLORIA Aesthetic Medical Clinic", description: siteConfig.description, url: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={clinicJsonLd()} />
      <Hero />
      <Philosophy />
      <ServicesIndex />
      <Distinctions />
      <TeamPreview />
      <GalleryPreview />
      <ContactBlock />
    </>
  );
}
