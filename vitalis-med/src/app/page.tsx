import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FleetSection } from "@/components/sections/FleetSection";
import { Hero } from "@/components/sections/Hero";
import { NfzSection } from "@/components/sections/NfzSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";

export const metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <FleetSection />
      <ServicesSection />
      <NfzSection />
      <PricingSection />
      <WhyUsSection />
      <TeamSection />
      <ContactSection />
    </>
  );
}
