import Link from "next/link";
import type { CSSProperties } from "react";
import { BrowserFrame, PhoneFrame, leadShots } from "@/components/portfolio/DeviceShots";
import { DemoTag } from "@/components/portfolio/DemoTag";
import { ProjectCover } from "@/components/portfolio/ProjectCover";
import { projects } from "@/data/projects";

export function Portfolio() {
  const withShots = projects.filter((project) => project.shots.length > 0);
  // Rytm galerii: dwie duże prezentacje, para średnich i okładki – zamiast jednej powtarzalnej siatki.
  const featured = withShots.slice(0, 2);
  const paired = withShots.slice(2);
  const more = projects.filter((project) => project.shots.length === 0);

  return (
    <section id="portfolio" tabIndex={-1} aria-labelledby="portfolio-title" className="section overflow-hidden bg-cloud outline-none">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-10">
          <h2 id="portfolio-title" className="reveal title-xl md:col-span-6">
            Portfolio
          </h2>
          <p className="reveal max-w-[36rem] text-[1.125rem] text-slate md:col-span-6 md:justify-self-end" style={{ "--d": "120ms" } as CSSProperties}>
            Koncepcje demonstracyjne dla fikcyjnych marek z różnych branż. Pokazują sposób pracy i jakość wykonania – nie są realizacjami dla klientów.
          </p>
        </div>

        <div className="mt-[clamp(3.5rem,7vw,6rem)] space-y-[clamp(5rem,10vw,9rem)]">
          {featured.map((project, i) => {
            const { desktop, mobile } = leadShots(project);
            const flip = i % 2 === 1;
            return (
              <article key={project.slug} aria-labelledby={`projekt-${project.slug}`} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
                <div className={`relative pb-10 lg:col-span-8 ${flip ? "lg:order-2" : ""} ${mobile ? "pr-[14%] sm:pr-[12%]" : ""}`}>
                  {desktop && (
                    <div className="reveal-frame">
                      <div>
                        <BrowserFrame shot={desktop} label={project.name} sizes="(min-width: 1024px) 58vw, 92vw" />
                      </div>
                    </div>
                  )}
                  {mobile && (
                    <div className="reveal absolute right-0 bottom-0 w-[24%] sm:w-[20%]" style={{ "--d": "300ms" } as CSSProperties}>
                      <PhoneFrame shot={mobile} sizes="(min-width: 1024px) 12vw, 22vw" />
                    </div>
                  )}
                </div>

                <div className={`reveal lg:col-span-4 ${flip ? "lg:order-1" : ""}`}>
                  <DemoTag />
                  <h3 id={`projekt-${project.slug}`} className="wide mt-6 text-[clamp(1.75rem,3vw,2.5rem)]">
                    {project.name}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] text-slate">Branża: {project.industry}</p>
                  <p className="mt-5 max-w-[30rem] text-[1.0625rem]">{project.summary}</p>
                  <Link href={`/portfolio/${project.slug}`} className="btn btn-outline-ink mt-8" aria-label={`Zobacz projekt ${project.name}`}>
                    Zobacz projekt
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {paired.length > 0 && (
          <div className="mt-[clamp(5rem,10vw,9rem)] grid gap-x-10 gap-y-20 md:grid-cols-2">
            {paired.map((project, i) => {
              const { desktop } = leadShots(project);
              return (
                <article key={project.slug} aria-labelledby={`projekt-${project.slug}`} className={`flex flex-col ${i % 2 === 1 ? "md:mt-24" : ""}`}>
                  {desktop && (
                    <div className="reveal-frame">
                      <div>
                        <BrowserFrame shot={desktop} label={project.name} sizes="(min-width: 768px) 45vw, 92vw" />
                      </div>
                    </div>
                  )}
                  <div className="reveal mt-8 flex flex-1 flex-col">
                    <DemoTag />
                    <h3 id={`projekt-${project.slug}`} className="wide mt-5 text-[clamp(1.5rem,2.4vw,2rem)]">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] text-slate">Branża: {project.industry}</p>
                    <p className="mt-4 mb-7 max-w-[32rem]">{project.summary}</p>
                    <Link href={`/portfolio/${project.slug}`} className="btn btn-outline-ink mt-auto self-start" aria-label={`Zobacz projekt ${project.name}`}>
                      Zobacz projekt
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-[clamp(5rem,10vw,9rem)] grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {more.map((project, i) => (
            <article key={project.slug} aria-labelledby={`projekt-${project.slug}`} className="reveal group flex flex-col" style={{ "--d": `${i * 100}ms` } as CSSProperties}>
              <Link href={`/portfolio/${project.slug}`} tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
                <div className="transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.03]">
                  <ProjectCover project={project} />
                </div>
              </Link>
              <div className="mt-6 flex flex-1 flex-col">
                <DemoTag />
                <h3 id={`projekt-${project.slug}`} className="wide mt-5 text-[1.5rem]">
                  {project.name}
                </h3>
                <p className="mt-2 text-[0.9375rem] text-slate">Branża: {project.industry}</p>
                <p className="mt-4 mb-7">{project.summary}</p>
                <Link href={`/portfolio/${project.slug}`} className="btn btn-outline-ink mt-auto self-start" aria-label={`Zobacz projekt ${project.name}`}>
                  Zobacz projekt
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="reveal mt-[clamp(5rem,10vw,8rem)] flex flex-col items-start justify-between gap-6 border-t border-ink/15 pt-10 md:flex-row md:items-center">
          <p className="wide max-w-[34rem] text-[clamp(1.375rem,2.4vw,1.875rem)] leading-tight font-medium tracking-[-0.02em]">
            Tu może pojawić się strona Twojej firmy.
          </p>
          <a href="#kontakt" className="btn btn-ink">
            Opowiedz o swoim projekcie
          </a>
        </div>
      </div>
    </section>
  );
}
