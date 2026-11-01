"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";

import type { Project } from "@/data/projects";

type Props = {
  project: Project;
  ratio: string;
  sizes: string;
  className?: string;
  captionClassName?: string;
  preload?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function ProjectCard({ project, ratio, sizes, className = "", captionClassName = "", preload = false }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.2, ease }}
    >
      <Link href={`/realizacje/${project.slug}`} className="group block" transitionTypes={["nav-forward"]}>
        <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
          <div className="zoom-frame relative" style={{ aspectRatio: ratio }}>
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes={sizes}
              placeholder="blur"
              preload={preload}
              quality={82}
              className="object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-graphite/0 transition-colors duration-700 ease-[var(--ease-out-soft)] group-hover:bg-graphite/10"
            />
          </div>
        </ViewTransition>
        <div className={`mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-[1fr_auto] ${captionClassName}`}>
          <h3 className="t-h3">{project.name}</h3>
          <p className="t-meta self-end text-stone sm:text-right">
            {project.kind}, {project.area} m²
          </p>
          <p className="t-body max-w-[36rem] sm:col-span-2">{project.short}</p>
          <p className="t-meta flex items-center gap-3 text-graphite sm:col-span-2">
            <span aria-hidden="true" className="h-px w-6 bg-current transition-all duration-700 ease-[var(--ease-out-soft)] group-hover:w-12" />
            Zobacz projekt
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
