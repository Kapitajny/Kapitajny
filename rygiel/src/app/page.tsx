import type { Metadata } from "next";
import { AcceptanceProtocol } from "@/components/home/AcceptanceProtocol";
import { FeaturedCase } from "@/components/home/FeaturedCase";
import { Hero } from "@/components/home/Hero";
import { HomeFaq } from "@/components/home/HomeFaq";
import { ProcessSection } from "@/components/home/ProcessSection";
import { SecurityApproach } from "@/components/home/SecurityApproach";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { ClosingCta } from "@/components/ui/ClosingCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/content/site";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Rygiel – obsługa IT i cyberbezpieczeństwo dla małych i średnich firm",
  description:
    "Administrujemy komputerami, serwerami i kontami, prowadzimy audyty bezpieczeństwa oraz projektujemy kopie zapasowe sprawdzane testem odtworzenia. Dla biur, firm usługowych i sklepów internetowych.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.name,
          url: absoluteUrl("/"),
          logo: absoluteUrl("/icon.svg"),
          description: siteConfig.description,
        }}
      />
      <Hero />
      <ServicesOverview />
      <ProcessSection />
      <FeaturedCase />
      <SecurityApproach />
      <AcceptanceProtocol />
      <HomeFaq />
      <ClosingCta />
    </>
  );
}
