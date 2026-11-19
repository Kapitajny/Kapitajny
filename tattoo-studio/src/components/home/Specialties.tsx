"use client";

import Image from "next/image";
import { useState } from "react";
import { SPECIALTIES, type Specialty } from "@/config/specialties";
import { workById, workSrc } from "@/config/work";
import { PlusIcon } from "@/components/ui/Icons";
import { Pattern } from "@/components/ui/Pattern";
import { SectionMark } from "@/components/ui/SectionMark";

function SpecialtyVisual({ specialty, sizes }: { specialty: Specialty; sizes: string }) {
  if (specialty.image) {
    const work = workById(specialty.image);
    return <Image src={workSrc(work)} alt={work.alt} fill quality={85} sizes={sizes} className="object-cover" />;
  }
  // Panel zastępczy: studio nie ma jeszcze zdjęcia pracy w tym stylu.
  return (
    <div
      role="img"
      aria-label={`${specialty.name}: miejsce na zdjęcie pracy w tym stylu`}
      className="absolute inset-0 flex flex-col items-center justify-center bg-sumi-2"
    >
      <div className="text-washi/[0.1]">
        <Pattern kind={specialty.pattern} bg="var(--color-sumi-2)" strokeWidth={0.8} scale={1.2} />
      </div>
      <span className="relative bg-sumi-2 px-6 font-mincho text-[clamp(4rem,9vw,7rem)] leading-none text-washi">{specialty.kanji}</span>
      <span className="relative mt-3 bg-sumi-2 px-3 font-gothic text-xs tracking-[0.3em] text-usuzumi">{specialty.kanjiReading}</span>
      <span className="absolute bottom-5 left-5 right-5 font-gothic text-2xs tracking-[0.08em] text-usuzumi">
        Miejsce na zdjęcie pracy w tym stylu
      </span>
    </div>
  );
}

export function Specialties() {
  const [active, setActive] = useState(0);

  return (
    <section id="specialties" aria-labelledby="specialties-title" className="on-dark relative bg-sumi py-24 text-washi sm:py-32">
      <div className="page-x grid gap-10 lg:grid-cols-12">
        <SectionMark kanji="専門" reading="senmon" className="hidden lg:col-span-1 lg:flex" />
        <div className="lg:col-span-6">
          <h2 id="specialties-title" className="display display-lg">
            OUR SPECIALTIES
          </h2>
          <p className="mt-5 max-w-[30rem] font-mincho text-lg leading-relaxed text-washi/75">
            Kierunki, w których pracujemy. Wybierz styl, aby zobaczyć przykład i krótki opis.
          </p>

          <ul className="mt-14 border-t border-washi/15">
            {SPECIALTIES.map((specialty, index) => {
              const isActive = active === index;
              const panelId = `specialty-${specialty.id}`;
              return (
                <li key={specialty.id} className="border-b border-washi/15">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isActive}
                      aria-controls={panelId}
                      onClick={() => setActive(index)}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") setActive(index);
                      }}
                      onFocus={() => setActive(index)}
                      className="group flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6"
                    >
                      <span
                        className={`font-mincho text-[clamp(1.5rem,3vw,2.375rem)] leading-tight transition-[color,translate] duration-500 ease-[var(--ease-ink)] ${
                          isActive ? "translate-x-0 text-washi" : "text-washi/45 group-hover:text-washi/80 lg:translate-x-0"
                        }`}
                      >
                        {specialty.name}
                      </span>
                      <PlusIcon
                        className={`h-5 w-5 shrink-0 transition-transform duration-500 ease-[var(--ease-ink)] ${isActive ? "rotate-45" : ""}`}
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-ink)] ${
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden" inert={!isActive}>
                      <div className="relative mb-6 aspect-[4/5] overflow-hidden lg:hidden">
                        <SpecialtyVisual specialty={specialty} sizes="92vw" />
                      </div>
                      <p className="max-w-[34rem] pb-7 font-gothic text-sm leading-relaxed text-usuzumi">{specialty.description}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-16">
            <div className="relative aspect-[4/5] overflow-hidden bg-sumi-2">
              {SPECIALTIES.map((specialty, index) => (
                <div
                  key={specialty.id}
                  aria-hidden={active !== index}
                  className="absolute inset-0 transition-[clip-path,opacity] duration-[900ms] ease-[var(--ease-silk)] motion-reduce:transition-none"
                  style={{
                    clipPath: active === index ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
                    opacity: active === index ? 1 : 0.4,
                    zIndex: active === index ? 2 : 1,
                  }}
                >
                  <SpecialtyVisual specialty={specialty} sizes="30vw" />
                </div>
              ))}
            </div>
            <p className="mt-4 font-mincho text-lg" aria-hidden="true">
              {SPECIALTIES[active].name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
