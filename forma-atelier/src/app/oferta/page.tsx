import type { Metadata } from "next";

import { CtaBand } from "@/components/home/CtaBand";
import { OfferList } from "@/components/home/Offer";
import { PageIntro } from "@/components/ui/PageIntro";
import { PageTransition } from "@/components/ui/PageTransition";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Oferta",
  description:
    "Projekt koncepcyjny, projekt kompleksowy, projekt pod klucz i konsultacja architektoniczna. Wycena indywidualna po rozmowie i obejrzeniu wnętrza.",
  alternates: { canonical: "/oferta" },
};

const faq = [
  {
    q: "Ile kosztuje projekt wnętrza?",
    a: "Koszt zależy od metrażu, zakresu i stopnia skomplikowania. Po pierwszej rozmowie i obejrzeniu przestrzeni przygotowujemy indywidualną wycenę z opisem etapów.",
  },
  {
    q: "Czy pracujecie poza Warszawą?",
    a: "Tak, prowadzimy projekty w Warszawie i okolicach. Przy realizacjach pod klucz nadzór obejmuje regularne wizyty na budowie.",
  },
  {
    q: "Czy mogę zacząć od konsultacji?",
    a: "Oczywiście. Konsultacja jest dobrym początkiem przed zakupem nieruchomości lub remontem, a jej koszt odliczamy od późniejszego projektu.",
  },
  {
    q: "Jak długo trwa projekt?",
    a: "Projekt kompleksowy apartamentu trwa zwykle od dwóch do trzech miesięcy, domu od trzech do pięciu. Dokładny harmonogram ustalamy na starcie.",
  },
];

export default function OfferPage() {
  return (
    <PageTransition>
      <PageIntro title="Oferta">
        <p>
          Cztery formy współpracy dopasowane do etapu, na którym jesteś. Nie publikujemy cennika, bo każde wnętrze jest inne.
          Każdą wycenę przygotowujemy indywidualnie.
        </p>
      </PageIntro>
      <section aria-labelledby="uslugi" className="shell pb-[var(--section)]">
        <h2 id="uslugi" className="sr-only">
          Usługi
        </h2>
        <OfferList initial={null} />
      </section>
      <section aria-labelledby="pytania" className="bg-beige py-[var(--section)]">
        <div className="shell grid grid-cols-12 gap-x-6 gap-y-12">
          <Reveal className="col-span-12 lg:col-span-4">
            <h2 id="pytania" className="t-h2">
              Częste pytania
            </h2>
          </Reveal>
          <dl className="col-span-12 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:col-span-8">
            {faq.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05} className="border-t border-line pt-6">
                <dt className="font-serif text-[1.5rem] leading-snug">{f.q}</dt>
                <dd className="t-body mt-4">{f.a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>
      <CtaBand />
    </PageTransition>
  );
}
