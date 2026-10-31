import type { Metadata } from "next";

import { CtaBand } from "@/components/home/CtaBand";
import { ProcessTimeline } from "@/components/home/Process";
import { PageIntro } from "@/components/ui/PageIntro";
import { PageTransition } from "@/components/ui/PageTransition";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Proces projektowy",
  description:
    "Pięć etapów współpracy z FORMA ATELIER: rozmowa, analiza przestrzeni, koncepcja i wizualizacje, dokumentacja techniczna, realizacja i nadzór.",
  alternates: { canonical: "/proces" },
};

const deliverables = [
  { step: "Rozmowa i poznanie potrzeb", get: "Ankieta potrzeb, zakres prac, harmonogram i wycena." },
  { step: "Analiza przestrzeni", get: "Inwentaryzacja, dokumentacja zdjęciowa, analiza światła i instalacji." },
  { step: "Koncepcja i wizualizacje", get: "Układ funkcjonalny, moodboard materiałów, wizualizacje fotorealistyczne." },
  { step: "Dokumentacja techniczna", get: "Rysunki wykonawcze, projekty zabudów, zestawienie materiałów i wyposażenia." },
  { step: "Realizacja i nadzór", get: "Harmonogram prac, wizyty na budowie, odbiory, stylizacja wnętrza." },
];

export default function ProcessPage() {
  return (
    <PageTransition>
      <PageIntro title="Proces projektowy">
        <p>
          Dobry proces daje spokój. Na każdym etapie wiesz, nad czym pracujemy, co otrzymasz i jakie decyzje są przed Tobą.
        </p>
      </PageIntro>
      <section aria-label="Etapy" className="shell pb-[var(--section)]">
        <ProcessTimeline detailed />
      </section>
      <section aria-labelledby="co-otrzymasz" className="bg-beige py-[var(--section)]">
        <div className="shell grid grid-cols-12 gap-x-6 gap-y-12">
          <Reveal className="col-span-12 lg:col-span-4">
            <h2 id="co-otrzymasz" className="t-h2">
              Co otrzymujesz na każdym etapie
            </h2>
          </Reveal>
          <ol className="col-span-12 lg:col-span-7 lg:col-start-6">
            {deliverables.map((d, i) => (
              <Reveal as="li" key={d.step} delay={i * 0.05} className="grid gap-2 border-t border-line py-7 md:grid-cols-[3rem_1fr_1.3fr] md:gap-6">
                <span className="font-serif text-[1.5rem] leading-none text-olive">0{i + 1}</span>
                <span className="font-serif text-[1.375rem] leading-snug">{d.step}</span>
                <span className="t-body">{d.get}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand />
    </PageTransition>
  );
}
