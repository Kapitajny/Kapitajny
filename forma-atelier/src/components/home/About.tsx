import Link from "next/link";

import studioTable from "@/assets/photos/studio-table.jpg";
import { Reveal, RevealImage } from "@/components/ui/Reveal";
import { site } from "@/data/site";

const principles = [
  "Apartamenty i domy w Warszawie i okolicach",
  "Jeden zespół od koncepcji do odbioru",
  "Projekty dopasowane do codzienności, nie do trendów",
];

export function About() {
  return (
    <section id="pracownia" aria-labelledby="o-pracowni" className="py-[var(--section)]">
      <div className="shell">
        <Reveal>
          <p className="t-statement max-w-[24ch] text-graphite lg:ml-[8.333%]">{site.subclaim}</p>
        </Reveal>

        <div className="mt-20 grid grid-cols-12 gap-x-6 gap-y-14 md:mt-28">
          <div className="col-span-12 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-1 lg:col-span-5">
            <RevealImage
              src={studioTable}
              alt="Stół projektowy pracowni z próbkami trawertynu, drewna i tkanin w świetle dziennym"
              sizes="(min-width: 1024px) 38vw, (min-width: 768px) 50vw, 90vw"
              ratio="4 / 5"
              rounded="rounded-t-[999px]"
              parallax={4}
            />
          </div>

          <div className="col-span-12 flex flex-col justify-end md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-7">
            <Reveal>
              <h2 id="o-pracowni" className="t-h2">
                Projektowanie zaczyna się od zrozumienia przestrzeni.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="t-body mt-9 max-w-[34rem] space-y-5">
                <p>
                  Zanim narysujemy pierwszą linię, spędzamy czas w Twoim wnętrzu. Sprawdzamy, skąd przychodzi światło, jak
                  poruszasz się między pomieszczeniami i co naprawdę jest dla Ciebie ważne.
                </p>
                <p>
                  Prowadzimy projekt kompleksowo: od koncepcji i wizualizacji, przez dokumentację techniczną, po zamówienia,
                  koordynację wykonawców i nadzór. Dzięki temu efekt końcowy wygląda dokładnie tak, jak go zaplanowaliśmy.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="mt-10 max-w-[34rem] border-t border-line">
                {principles.map((p) => (
                  <li key={p} className="flex items-baseline gap-4 border-b border-line py-4 text-[0.9375rem]">
                    <span aria-hidden="true" className="h-px w-5 shrink-0 translate-y-[-0.3em] bg-olive" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2}>
              <Link href="/o-pracowni" className="btn btn-dark mt-12 self-start" transitionTypes={["nav-forward"]}>
                Poznaj pracownię
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
