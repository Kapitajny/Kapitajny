import { Breads } from "@/components/morelowa/Breads";
import { Contact } from "@/components/morelowa/Contact";
import { Footer } from "@/components/morelowa/Footer";
import { Header } from "@/components/morelowa/Header";
import { Hero } from "@/components/morelowa/Hero";
import { Locations } from "@/components/morelowa/Locations";
import { Patisserie } from "@/components/morelowa/Patisserie";
import { Philosophy } from "@/components/morelowa/Philosophy";
import { Timeline } from "@/components/morelowa/Timeline";

export default function MorelowaPage() {
  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-50 bg-bordo px-5 py-3 text-sm font-semibold text-krem focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
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
