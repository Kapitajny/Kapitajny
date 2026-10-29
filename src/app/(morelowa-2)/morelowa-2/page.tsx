import { Breads } from "@/components/morelowa-2/Breads";
import { Contact } from "@/components/morelowa-2/Contact";
import { Footer } from "@/components/morelowa-2/Footer";
import { Header } from "@/components/morelowa-2/Header";
import { Hero } from "@/components/morelowa-2/Hero";
import { Locations } from "@/components/morelowa-2/Locations";
import { Patisserie } from "@/components/morelowa-2/Patisserie";
import { Philosophy } from "@/components/morelowa-2/Philosophy";
import { Timeline } from "@/components/morelowa-2/Timeline";

/** Koncepcja 2 strony Morelowej – ciemny, nastrojowy kierunek „Nocny wypiek”. */
export default function MorelowaConcept2Page() {
  return (
    <>
      <a href="#tresc" className="sr-only z-50 bg-zloto px-5 py-3 text-sm font-semibold text-noc focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Przejdź do treści
      </a>
      <Header />
      <main id="tresc" className="flex-1">
        <Hero />
        <Philosophy />
        <Breads />
        <Patisserie />
        <Timeline />
        <Locations />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
