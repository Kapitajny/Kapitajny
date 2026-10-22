import type { Metadata } from "next";
import { getLocalBusinessJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Faq } from "@/components/home/Faq";
import { FirstVisit } from "@/components/home/FirstVisit";
import { Hero } from "@/components/home/Hero";
import { Pricing } from "@/components/home/Pricing";
import { Services } from "@/components/home/Services";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyUs } from "@/components/home/WhyUs";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = getLocalBusinessJsonLd();
  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />}
      <Hero />
      <Services />
      <FirstVisit />
      <WhyUs />
      <About />
      <Pricing />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  );
}
