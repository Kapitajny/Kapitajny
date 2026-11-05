"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { coverOf, kindLabel, mobileOf, type Project, type ProjectKind } from "@/data/projects";

type Filter = "wszystkie" | ProjectKind;

const filters: { value: Filter; label: string }[] = [
  { value: "wszystkie", label: "Wszystkie" },
  { value: "strona", label: "Strony" },
  { value: "sklep", label: "Sklepy" },
];

const countLabel = (n: number) => (n === 1 ? "1 projekt" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? `${n} projekty` : `${n} projektów`);

/** Siatka koncepcji demonstracyjnych z filtrem rodzaju projektu. */
export function PortfolioGrid({
  projects,
  limit,
  initial = "wszystkie",
  showFilter = true,
}: {
  projects: Project[];
  limit?: number;
  initial?: Filter;
  showFilter?: boolean;
}) {
  const [filter, setFilter] = useState<Filter>(initial);
  const statusId = useId();
  const matching = projects.filter((project) => filter === "wszystkie" || project.kind === filter);
  const visible = limit ? matching.slice(0, limit) : matching;

  return (
    <div>
      {showFilter && (
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filtruj realizacje" aria-describedby={statusId} className="inline-flex rounded-full border border-line bg-white p-1">
          {filters.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={`min-h-10 rounded-full px-4 text-[0.925rem] font-medium transition-colors ${
                filter === option.value ? "bg-ink text-white" : "text-steel hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p id={statusId} role="status" className="font-mono text-[0.75rem] tracking-[0.06em] text-steel uppercase">
          {limit && matching.length > visible.length ? `${visible.length} z ${countLabel(matching.length)}` : countLabel(matching.length)}
        </p>
      </div>
      )}

      <ul className={`${showFilter ? "mt-10" : ""} grid gap-x-6 gap-y-14 md:grid-cols-2`}>
        {visible.map((project, n) => (
          <li key={project.slug} className="page-enter" style={{ animationDelay: `${(n % 2) * 70}ms` }}>
            <ProjectCard project={project} priority={n < 2} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const isShop = project.kind === "sklep";
  return (
    <article aria-labelledby={`p-${project.slug}`} className="group">
      <a href={project.demoUrl} className="relative block rounded-[0.875rem]" tabIndex={-1} aria-hidden="true">
        <div className="browser transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1">
          <div className="browser-bar">
            <i />
            <i />
            <i />
            <span className="ml-3 truncate font-mono text-[0.6875rem] text-steel">computerit/demo/{project.slug}</span>
          </div>
          <Image
            src={coverOf(project)}
            alt=""
            width={2160}
            height={1350}
            sizes="(min-width: 80rem) 620px, (min-width: 48rem) 46vw, 92vw"
            className="aspect-[16/10] w-full object-cover object-top"
            priority={priority}
          />
        </div>
        <div className="absolute -right-2 -bottom-6 hidden w-[19%] overflow-hidden rounded-[0.9rem] border-[3px] border-ink bg-ink shadow-[0_20px_40px_-20px_rgb(11_11_12/0.6)] transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-2 sm:block">
          <Image src={mobileOf(project)} alt="" width={780} height={1688} sizes="140px" className="aspect-[390/700] w-full object-cover object-top" />
        </div>
      </a>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="chip">
          <span className={`size-1.5 rounded-[1px] ${isShop ? "bg-gold" : "bg-ink"}`} aria-hidden="true" />
          {kindLabel[project.kind]}
        </span>
        <span className="chip">Koncepcja demonstracyjna</span>
      </div>
      <h3 id={`p-${project.slug}`} className="mt-4 text-[1.5rem] tracking-[-0.03em]">
        {project.name} <span className="text-[1rem] font-medium tracking-normal text-steel">· {project.industry}</span>
      </h3>
      <p className="mt-2 max-w-xl text-[0.975rem] text-steel">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.9rem]">
        {project.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-ash" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={project.demoUrl} className="btn btn-primary btn-sm" aria-label={`${isShop ? "Otwórz sklep" : "Otwórz stronę"} ${project.name} – wersja demonstracyjna`}>
          {isShop ? "Otwórz sklep" : "Otwórz stronę"}
          <ArrowUpRight />
        </a>
        <Link
          href={`/kontakt?usluga=${project.kind}&projekt=${project.slug}`}
          className="btn btn-secondary btn-sm"
          aria-label={`${isShop ? "Chcę podobny sklep" : "Chcę podobną stronę"} do ${project.name}`}
        >
          {isShop ? "Chcę podobny sklep" : "Chcę podobną stronę"}
          <ArrowRight />
        </Link>
      </div>
    </article>
  );
}
