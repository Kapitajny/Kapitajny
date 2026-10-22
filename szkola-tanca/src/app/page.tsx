import { StudioProvider } from "@/components/schedule/StudioProvider";
import { About } from "@/components/sections/About";
import { Audiences } from "@/components/sections/Audiences";
import { Classes } from "@/components/sections/Classes";
import { Contact } from "@/components/sections/Contact";
import { Events } from "@/components/sections/Events";
import { Faq } from "@/components/sections/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { GettingStarted } from "@/components/sections/GettingStarted";
import { Hero } from "@/components/sections/Hero";
import { Instructors } from "@/components/sections/Instructors";
import { Newsletter } from "@/components/sections/Newsletter";
import { Philosophy } from "@/components/sections/Philosophy";
import { Pricing } from "@/components/sections/Pricing";
import { Schedule } from "@/components/sections/Schedule";
import { Studio } from "@/components/sections/Studio";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrialForm } from "@/components/sections/TrialForm";
import { siteConfig } from "@/config/site";
import { FAQ } from "@/data/faq";

/** Dane strukturalne: szkoła tańca + FAQ. Adres pomijamy, dopóki jest demonstracyjny. */
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "DanceSchool",
    name: siteConfig.fullName,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  },
];

export default function HomePage() {
  return (
    <StudioProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero />
      <About />
      <Philosophy />
      <Classes />
      <Audiences />
      <Instructors />
      <Schedule />
      <Pricing />
      <GettingStarted />
      <Studio />
      <Gallery />
      <Testimonials />
      <Events />
      <Faq />
      <TrialForm />
      <Contact />
      <Newsletter />
    </StudioProvider>
  );
}
