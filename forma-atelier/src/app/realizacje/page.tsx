import type { Metadata } from "next";

import { CtaBand } from "@/components/home/CtaBand";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { PageIntro } from "@/components/ui/PageIntro";
import { PageTransition } from "@/components/ui/PageTransition";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Realizacje",
  description:
    "Wybrane realizacje FORMA ATELIER: domy jednorodzinne i apartamenty w Warszawie i okolicach. Villa Natura, Quiet Residence, Sandstone House i inne.",
  alternates: { canonical: "/realizacje" },
};

const layout = [
  { col: "md:col-span-7", ratio: "4 / 3" },
  { col: "md:col-span-5 md:mt-40", ratio: "4 / 5" },
  { col: "md:col-span-5 md:col-start-2", ratio: "4 / 5" },
  { col: "md:col-span-6 md:col-start-7 md:mt-32", ratio: "3 / 2" },
  { col: "md:col-span-8 md:col-start-3", ratio: "16 / 9" },
  { col: "md:col-span-6", ratio: "3 / 2" },
];

export default function ProjectsPage() {
  return (
    <PageTransition>
      <PageIntro title="Realizacje">
        <p>
          Sześć wnętrz, sześć historii. Pokazujemy domy i apartamenty, które prowadziliśmy od koncepcji po stylizację. Każdy
          projekt ma osobną stronę z opisem idei, materiałami i galerią.
        </p>
      </PageIntro>
      <div className="shell grid grid-cols-12 gap-x-6 gap-y-20 pb-[var(--section)] md:gap-y-28">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={p}
            ratio={layout[i].ratio}
            sizes="(min-width: 768px) 55vw, 92vw"
            className={`col-span-12 ${layout[i].col}`}
            preload={i < 2}
          />
        ))}
      </div>
      <CtaBand />
    </PageTransition>
  );
}
