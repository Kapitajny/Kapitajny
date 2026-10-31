import { FAQ_ITEMS } from "@/data/faq";
import { mainProduct, products } from "@/data/products";
import { faqJsonLd, JsonLd, productJsonLd } from "@/lib/jsonld";
import { isProductAvailable } from "@/lib/server/files";
import { Faq, FinalCta, Hero, HowItWorks, Inside, MeetEbook, ShopSection, WhyNovelia } from "@/components/home/Sections";

export default function HomePage() {
  const available = Object.fromEntries(products.map((p) => [p.slug, isProductAvailable(p)]));
  return (
    <>
      <JsonLd data={productJsonLd(mainProduct, available[mainProduct.slug])} />
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      <Hero />
      <MeetEbook />
      <Inside />
      <WhyNovelia />
      <ShopSection available={available} />
      <HowItWorks />
      <Faq />
      <FinalCta />
    </>
  );
}
