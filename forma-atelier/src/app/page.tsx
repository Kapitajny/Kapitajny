import { About } from "@/components/home/About";
import { CtaBand } from "@/components/home/CtaBand";
import { HeroVideo } from "@/components/home/HeroVideo";
import { Offer } from "@/components/home/Offer";
import { Portfolio } from "@/components/home/Portfolio";
import { Process } from "@/components/home/Process";
import { Testimonials } from "@/components/home/Testimonials";
import { Values } from "@/components/home/Values";
import { PageTransition } from "@/components/ui/PageTransition";

export default function HomePage() {
  return (
    <PageTransition>
      <HeroVideo />
      <About />
      <Portfolio />
      <Offer />
      <Process />
      <Values />
      <Testimonials />
      <CtaBand />
    </PageTransition>
  );
}
