import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { BrowserFrame, PhoneFrame } from "@/components/portfolio/DeviceShots";
import { DemoTag } from "@/components/portfolio/DemoTag";
import { ProjectCover } from "@/components/portfolio/ProjectCover";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  const cover = project.shots[0];
  return {
    title: `${project.name} – koncepcja demonstracyjna`,
    description: project.summary,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: `${project.name} – koncepcja demonstracyjna ComputerIT`,
      description: project.summary,
      ...(cover ? { images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }] } : {}),
    },
  };
}

export default async function ProjectPage(props: PageProps<"/portfolio/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const [lead, ...rest] = project.shots.filter((shot) => shot.device === "desktop");
  const phones = project.shots.filter((shot) => shot.device === "mobile");

  return (
    <article className="pt-[calc(var(--header-h)+clamp(2.5rem,6vw,4.5rem))]">
      <div className="container-x">
        <Link href="/#portfolio" className="link-underline text-[0.9375rem] text-slate hover:text-ink">
          Wróć do portfolio
        </Link>

        <header className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <DemoTag />
            <h1 className="wide mt-6 text-[clamp(2.5rem,6vw,5rem)]">{project.name}</h1>
          </div>
          <div className="md:col-span-5">
            <p className="text-[0.9375rem] text-slate">Branża: {project.industry}</p>
            <p className="lead mt-3">{project.summary}</p>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ink mt-6">
                Otwórz wersję demonstracyjną<span className="sr-only"> (nowa karta)</span>
              </a>
            )}
          </div>
        </header>

        <div className="mt-[clamp(3rem,6vw,5rem)]">
          {lead ? (
            <BrowserFrame shot={lead} label={project.name} sizes="(min-width: 1400px) 1300px, 94vw" priority />
          ) : (
            <ProjectCover project={project} size="lg" />
          )}
        </div>

        <div className="mt-[clamp(4rem,8vw,6.5rem)] grid gap-14 md:grid-cols-12">
          <div className="space-y-6 text-[1.125rem] md:col-span-7">
            <h2 className="wide text-[1.75rem]">O projekcie</h2>
            {project.description.map((paragraph) => (
              <p key={paragraph} className="max-w-[38rem] text-ink/85">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="md:col-span-5">
            <h2 className="wide text-[1.25rem]">Zakres koncepcji</h2>
            <ul className="mt-5 border-t border-ink/10">
              {project.scope.map((item) => (
                <li key={item} className="flex items-center gap-4 border-b border-ink/10 py-3">
                  <span aria-hidden="true" className="h-px w-4 shrink-0 bg-sky" />
                  {item}
                </li>
              ))}
            </ul>
            {project.structure && (
              <>
                <h2 className="wide mt-10 text-[1.25rem]">Struktura strony</h2>
                <p className="mt-4 text-slate">{project.structure.join(", ")}.</p>
              </>
            )}
            <p className="mt-10 border-l-2 border-sky bg-white px-5 py-4 text-[0.9375rem] text-slate">
              <strong className="font-semibold text-ink">Koncepcja demonstracyjna.</strong> {project.note}
            </p>
          </div>
        </div>

        {rest.length > 0 && (
          <section aria-label="Widoki strony" className="mt-[clamp(4rem,8vw,7rem)] grid gap-x-8 gap-y-14 md:grid-cols-2">
            {rest.map((shot, i) => (
              <figure key={shot.src} className="reveal" style={{ "--d": `${(i % 2) * 120}ms` } as CSSProperties}>
                <BrowserFrame shot={shot} label={project.name} sizes="(min-width: 768px) 46vw, 94vw" />
                <figcaption className="mt-4 text-[0.9375rem] text-slate">{shot.caption}</figcaption>
              </figure>
            ))}
          </section>
        )}

        {phones.length > 0 && (
          <section aria-label="Wersja mobilna" className="mt-[clamp(4rem,8vw,7rem)] bg-white px-6 py-14 sm:px-12">
            <h2 className="wide text-[1.5rem]">Wersja mobilna</h2>
            <div className="mt-10 flex flex-wrap justify-center gap-8 sm:gap-14">
              {phones.map((shot) => (
                <figure key={shot.src} className="reveal w-[min(16rem,70vw)]">
                  <PhoneFrame shot={shot} sizes="16rem" />
                  <figcaption className="mt-4 text-center text-[0.9375rem] text-slate">{shot.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="container-x mt-[clamp(5rem,10vw,8rem)] mb-[clamp(5rem,10vw,8rem)] grid gap-10 border-t border-ink/15 pt-10 md:grid-cols-2">
        <div>
          <p className="text-[0.9375rem] text-slate">Następny projekt</p>
          <Link href={`/portfolio/${next.slug}`} className="wide link-underline mt-2 inline-block text-[clamp(1.5rem,3vw,2.25rem)] font-medium tracking-[-0.02em]">
            {next.name}
          </Link>
        </div>
        <div className="md:justify-self-end md:text-right">
          <p className="text-[0.9375rem] text-slate">Podoba Ci się ten kierunek?</p>
          <Link href="/#kontakt" className="btn btn-ink mt-4">
            Opowiedz o swoim projekcie
          </Link>
        </div>
      </div>
    </article>
  );
}
