import { siteConfig } from "@/config/site";
import { BrandStory } from "@/components/home/BrandStory";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { CollectionsTeaser } from "@/components/home/CollectionsTeaser";
import { Featured } from "@/components/home/Featured";
import { Hero } from "@/components/home/Hero";
import { NewDrop } from "@/components/home/NewDrop";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { JsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: `${siteConfig.url}/images/brand/logo-light.png`,
          description: siteConfig.description,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
          potentialAction: { "@type": "SearchAction", target: `${siteConfig.url}/szukaj?q={search_term_string}`, "query-input": "required name=search_term_string" },
        }}
      />
      <Hero />
      <CategoryShowcase />
      <NewDrop />
      <Featured />
      <CollectionsTeaser />
      <BrandStory />
      <NewsletterSection />
    </>
  );
}
