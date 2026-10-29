import { About } from "@/components/home/About";
import { Gallery } from "@/components/home/Gallery";
import { Hero } from "@/components/home/Hero";
import { Locations } from "@/components/home/Locations";
import { MenuSection } from "@/components/home/MenuSection";
import { Newsletter } from "@/components/home/Newsletter";
import { PopularCoffees } from "@/components/home/PopularCoffees";
import { WhyNoir } from "@/components/home/WhyNoir";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularCoffees />
      <About />
      <MenuSection />
      <Gallery />
      <Locations />
      <WhyNoir />
      <Newsletter />
    </>
  );
}
