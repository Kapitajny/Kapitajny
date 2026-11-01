import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { PageTransition } from "@/components/ui/PageTransition";
import { Reveal } from "@/components/ui/Reveal";
import { getProject, nextProject, projects } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/realizacje/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.kind.toLowerCase()}, ${p.area} m²`,
    description: `${p.short} Projekt wnętrz FORMA ATELIER, ${p.location}.`,
    alternates: { canonical: `/realizacje/${p.slug}` },
    openGraph: { images: [{ url: p.cover.src.src, width: p.cover.src.width, height: p.cover.src.height, alt: p.cover.alt }] },
  };
}

export default async function ProjectPage({ params }: PageProps<"/realizacje/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const next = nextProject(slug);

  const materials = (
    <section aria-labelledby="materialy" className="grid grid-cols-12 gap-x-6 gap-y-10 border-y border-line py-16 md:py-20">
      <Reveal className="col-span-12 md:col-span-4">
        <h2 id="materialy" className="t-h2">
          Materiały
        </h2>
        <p className="t-body mt-6 max-w-[22rem]">Krótka, spójna paleta, która starzeje się razem z domem.</p>
      </Reveal>
      <ul className="col-span-12 md:col-span-7 md:col-start-6">
        {p.materials.map((m, i) => (
          <Reveal as="li" key={m.name} delay={i * 0.05} className="flex items-center gap-6 border-b border-line py-5 last:border-b-0">
            <span
              aria-hidden="true"
              className="h-12 w-12 shrink-0 rounded-full ring-1 ring-graphite/10 ring-inset"
              style={{ background: m.swatch }}
            />
            <span className="grid flex-1 gap-1 sm:grid-cols-2 sm:gap-6">
              <span className="font-serif text-[1.375rem] leading-snug">{m.name}</span>
              <span className="t-body text-[0.9375rem] sm:pt-1">{m.use}</span>
            </span>
          </Reveal>
        ))}
      </ul>
    </section>
  );

  return (
    <PageTransition>
      <article>
        <header className="relative isolate h-[92svh] min-h-[560px] overflow-hidden bg-graphite text-paper">
          <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
            <div className="absolute inset-0 -z-20">
              <Image src={p.cover.src} alt={p.cover.alt} fill preload sizes="100vw" quality={82} placeholder="blur" className="object-cover" />
            </div>
          </ViewTransition>
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(26_24_20/0.62)_0%,rgb(26_24_20/0.1)_55%,rgb(26_24_20/0.25)_100%)]" />
          <div className="shell flex h-full flex-col justify-end pb-12 md:pb-16">
            <Reveal>
              <Link href="/realizacje" transitionTypes={["nav-back"]} className="t-meta link-line text-paper/80">
                Realizacje
              </Link>
            </Reveal>
            <div className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-6">
              <Reveal delay={0.1} className="col-span-12 lg:col-span-8">
                <h1 className="t-display">{p.name}</h1>
              </Reveal>
              <Reveal delay={0.2} className="col-span-12 lg:col-span-4 lg:text-right">
                <p className="t-meta text-paper/85">
                  {p.kind}, {p.area} m²
                  <br />
                  {p.location}
                </p>
              </Reveal>
            </div>
          </div>
        </header>

        <section aria-label="Opis projektu" className="shell grid grid-cols-12 gap-x-6 gap-y-14 py-[var(--section)]">
          <Reveal className="col-span-12 lg:col-span-7">
            <p className="t-statement">{p.lead}</p>
          </Reveal>
          <Reveal delay={0.1} className="col-span-12 md:col-span-6 lg:col-span-4 lg:col-start-9">
            <h2 className="t-meta text-stone">Charakterystyka projektu</h2>
            <dl className="mt-5 border-t border-line">
              {[{ label: "Rodzaj nieruchomości", value: p.kind }, ...p.facts, { label: "Rok", value: p.year }].map((f) => (
                <div key={f.label} className="grid grid-cols-[9rem_1fr] gap-4 border-b border-line py-3.5 text-[0.9375rem]">
                  <dt className="text-stone">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <div className="col-span-12 grid grid-cols-12 gap-x-6 gap-y-6 lg:mt-10">
            <Reveal className="col-span-12 md:col-span-3">
              <h2 className="t-h3">Koncepcja</h2>
            </Reveal>
            <Reveal delay={0.1} className="t-body col-span-12 max-w-[40rem] space-y-6 text-[1.0625rem] md:col-span-8 md:col-start-5">
              {p.concept.map((c) => (
                <p key={c.slice(0, 24)}>{c}</p>
              ))}
            </Reveal>
          </div>
        </section>

        <ProjectGallery project={p} materials={materials} />

        <nav aria-label="Kolejna realizacja" className="mt-[var(--section)] bg-beige">
          <Link href={`/realizacje/${next.slug}`} transitionTypes={["nav-forward"]} className="group shell grid grid-cols-12 items-center gap-x-6 gap-y-8 py-20 md:py-28">
            <span className="col-span-12 md:col-span-6">
              <span className="t-meta text-stone">Następna realizacja</span>
              <span className="t-h2 mt-4 block">{next.name}</span>
              <span className="t-meta mt-6 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-6 bg-current transition-all duration-700 ease-[var(--ease-out-soft)] group-hover:w-14" />
                {next.kind}, {next.area} m²
              </span>
            </span>
            <span className="zoom-frame relative col-span-12 block aspect-[3/2] md:col-span-5 md:col-start-8">
              <Image src={next.cover.src} alt="" fill sizes="(min-width: 768px) 40vw, 92vw" placeholder="blur" className="object-cover" />
            </span>
          </Link>
        </nav>
      </article>
    </PageTransition>
  );
}
