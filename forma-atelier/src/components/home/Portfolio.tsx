import Link from "next/link";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";

/**
 * Redakcyjny układ galerii: każda realizacja ma inną skalę i miejsce w siatce,
 * jak rozkładówka magazynu — duży kadr, portret, pełna szerokość, oddech.
 */
const layout = [
  { col: "lg:col-span-8", ratio: "3 / 2", sizes: "(min-width: 1024px) 62vw, 92vw" },
  { col: "lg:col-span-4 lg:mt-[22rem]", ratio: "4 / 5", sizes: "(min-width: 1024px) 30vw, 92vw" },
  { col: "lg:col-span-5 lg:col-start-2 lg:-mt-12", ratio: "4 / 5", sizes: "(min-width: 1024px) 38vw, 92vw" },
  { col: "lg:col-span-6 lg:col-start-7 lg:mt-20", ratio: "3 / 2", sizes: "(min-width: 1024px) 46vw, 92vw" },
  { col: "lg:col-span-12", ratio: "21 / 9", sizes: "92vw" },
  { col: "lg:col-span-7 lg:col-start-6", ratio: "16 / 10", sizes: "(min-width: 1024px) 54vw, 92vw" },
];

export function Portfolio() {
  return (
    <section id="realizacje" aria-labelledby="wybrane-realizacje" className="pb-[var(--section)]">
      <div className="shell">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8 border-t border-line pt-14 md:pt-20">
          <Reveal className="col-span-12 md:col-span-7">
            <h2 id="wybrane-realizacje" className="t-h2">
              Wybrane realizacje.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="col-span-12 md:col-span-4 md:col-start-9">
            <p className="t-body">
              Domy i apartamenty, w których pracowaliśmy od pierwszego szkicu do ostatniej lampy. Każdy projekt to inna historia i
              inny zestaw materiałów.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-20 md:mt-24 lg:gap-y-28">
          {projects.map((p, i) => {
            const l: { col: string; ratio: string; sizes: string; caption?: string } = layout[i];
            const card = (
              <ProjectCard
                key={p.slug}
                project={p}
                ratio={l.ratio}
                sizes={l.sizes}
                className={`col-span-12 ${l.col}`}
                captionClassName={l.caption ?? ""}
                preload={i === 0}
              />
            );
            if (i === 5) {
              return [
                <Reveal key="note" className="col-span-12 flex flex-col justify-end lg:col-span-4 lg:row-start-auto">
                  <p className="t-lead max-w-[22rem] text-stone">
                    Każdą realizację prowadzimy do końca: od pomiaru po ustawienie ostatniego wazonu.
                  </p>
                  <Link href="/realizacje" className="btn btn-dark mt-8 self-start" transitionTypes={["nav-forward"]}>
                    Wszystkie realizacje
                  </Link>
                </Reveal>,
                card,
              ];
            }
            return card;
          })}
        </div>
      </div>
    </section>
  );
}
