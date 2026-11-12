import type { Metadata } from "next";
import { AtHome } from "@/components/home/AtHome";
import { Contact } from "@/components/home/Contact";
import { Flavors } from "@/components/home/Flavors";
import { Hero } from "@/components/home/Hero";
import { OrderBand } from "@/components/home/OrderBand";
import { Products } from "@/components/home/Products";
import { Story } from "@/components/home/Story";
import { Testimonials } from "@/components/home/Testimonials";
import { Why } from "@/components/home/Why";
import { site } from "@/data/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  description: site.description,
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd).replace(/</g, "\\u003c") }} />
      <Hero />
      <Products />
      <Why />
      <Story />
      <Flavors />
      <AtHome />
      <OrderBand />
      <Testimonials />
      <Contact />
    </>
  );
}
