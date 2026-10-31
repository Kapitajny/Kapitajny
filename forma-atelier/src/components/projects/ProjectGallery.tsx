"use client";

import { Expand } from "lucide-react";
import { type ReactNode, useState } from "react";

import { Lightbox } from "@/components/projects/Lightbox";
import { RevealImage } from "@/components/ui/Reveal";
import type { Project } from "@/data/projects";

function Tile({ onOpen, label, children, className = "" }: { onOpen: () => void; label: string; children: ReactNode; className?: string }) {
  return (
    <button type="button" onClick={onOpen} aria-label={label} className={`group relative block w-full cursor-zoom-in text-left ${className}`}>
      {children}
      <span
        aria-hidden="true"
        className="absolute right-4 bottom-4 grid h-10 w-10 place-items-center rounded-full bg-paper/85 text-graphite opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Expand size={15} strokeWidth={1.25} />
      </span>
    </button>
  );
}

/** Galeria realizacji: trzy kadry w różnej skali + materiały, z podglądem pełnoekranowym. */
export function ProjectGallery({ project, materials }: { project: Project; materials: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const photos = [project.cover, ...project.gallery];
  const [a, b, c] = project.gallery;
  const label = (i: number) => `Powiększ zdjęcie: ${photos[i].alt}`;

  return (
    <>
      <div className="shell grid grid-cols-12 gap-x-6 gap-y-16 md:gap-y-28">
        <Tile onOpen={() => setIndex(1)} label={label(1)} className="col-span-12 md:col-span-7">
          <RevealImage src={a.src} alt={a.alt} sizes="(min-width: 768px) 56vw, 92vw" />
        </Tile>
        <Tile onOpen={() => setIndex(2)} label={label(2)} className="col-span-10 col-start-3 md:col-span-4 md:col-start-9 md:mt-48">
          <RevealImage src={b.src} alt={b.alt} sizes="(min-width: 768px) 32vw, 80vw" parallax={3} />
        </Tile>

        <div className="col-span-12">{materials}</div>

        <Tile onOpen={() => setIndex(3)} label={label(3)} className="col-span-12 md:col-span-10 md:col-start-2">
          <RevealImage src={c.src} alt={c.alt} sizes="(min-width: 768px) 80vw, 92vw" />
        </Tile>
      </div>
      <Lightbox photos={photos} index={index} onChange={setIndex} title={project.name} />
    </>
  );
}
