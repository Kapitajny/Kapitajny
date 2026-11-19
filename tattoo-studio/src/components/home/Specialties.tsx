"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SPECIALTIES } from "@/config/specialties";
import { workById, workSrc } from "@/config/work";
import { useI18n } from "@/i18n/I18nProvider";
import { ArrowIcon, PlusIcon } from "@/components/ui/Icons";
import { Pattern } from "@/components/ui/Pattern";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GALLERY_FILTER_EVENT } from "./Gallery";

type Specialty = (typeof SPECIALTIES)[number];

function Visual({ specialty, sizes }: { specialty: Specialty; sizes: string }) {
  const { t } = useI18n();
  if ("image" in specialty && specialty.image) {
    const work = workById(specialty.image);
    return <Image src={workSrc(work)} alt={t.work.items[specialty.image].alt} fill quality={85} sizes={sizes} className="object-cover" />;
  }
  return (
    <div role="img" aria-label={`${t.specialties.items[specialty.id].name}: ${t.specialties.placeholder}`} className="absolute inset-0 flex flex-col items-center justify-center bg-sumi-2">
      <div className="text-washi/[0.1]">
        <Pattern kind={specialty.pattern} bg="var(--color-sumi-2)" strokeWidth={0.8} scale={1.2} />
      </div>
      <span className="relative bg-sumi-2 px-6 font-mincho text-[clamp(3.5rem,8vw,6rem)] leading-none text-washi">{specialty.kanji}</span>
      <span className="relative mt-3 bg-sumi-2 px-3 font-gothic text-xs tracking-[0.3em] text-usuzumi">{specialty.reading}</span>
      <span className="absolute bottom-4 left-4 right-4 font-gothic text-2xs text-usuzumi">{t.specialties.placeholder}</span>
    </div>
  );
}

export function Specialties() {
  const { t } = useI18n();
  const [open, setOpen] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Podgląd podąża za kursorem z wygładzeniem (lerp); bez animacji przy prefers-reduced-motion.
  function animate() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 1 : 0.16;
    current.current.x += (target.current.x - current.current.x) * k;
    current.current.y += (target.current.y - current.current.y) * k;
    if (previewRef.current) previewRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
    if (Math.abs(target.current.x - current.current.x) > 0.5 || Math.abs(target.current.y - current.current.y) > 0.5) {
      raf.current = requestAnimationFrame(animate);
    } else raf.current = null;
  }

  function moveTo(x: number, y: number, jump = false) {
    target.current = { x, y };
    if (jump) current.current = { x, y };
    if (raf.current === null) raf.current = requestAnimationFrame(animate);
  }

  function onPointerMove(event: React.PointerEvent) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    moveTo(event.clientX - rect.left + 28, event.clientY - rect.top - 160, hovered === null);
  }

  /** Fokus z klawiatury: podgląd zakotwiczony obok wiersza. */
  function anchorTo(el: HTMLElement) {
    const rect = sectionRef.current?.getBoundingClientRect();
    const row = el.getBoundingClientRect();
    if (!rect) return;
    moveTo(row.right - rect.left - 300, row.top - rect.top - 120, true);
  }

  function showGallery(style: string) {
    window.dispatchEvent(new CustomEvent(GALLERY_FILTER_EVENT, { detail: style }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("gallery")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <section ref={sectionRef} id="specialties" aria-labelledby="specialties-title" className="on-dark relative overflow-hidden bg-sumi py-24 text-washi sm:py-32">
      <div className="page-x">
        <SectionHeader id="specialties-title" kanji="専門" reading="senmon" tone="dark" title={t.specialties.title} lead={<p>{t.specialties.lead}</p>} />

        <ul className="mt-16 border-t border-washi/12" onPointerMove={finePointer ? onPointerMove : undefined} onPointerLeave={() => setHovered(null)}>
          {SPECIALTIES.map((specialty, index) => {
            const isOpen = open === index;
            const text = t.specialties.items[specialty.id];
            const panelId = `specialty-${specialty.id}`;
            const filter = "galleryFilter" in specialty ? specialty.galleryFilter : undefined;
            return (
              <li key={specialty.id} className="border-b border-washi/12" onPointerEnter={() => finePointer && setHovered(index)}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    onFocus={(event) => {
                      if (finePointer && event.currentTarget.matches(":focus-visible")) {
                        setHovered(index);
                        anchorTo(event.currentTarget);
                      }
                    }}
                    onBlur={() => setHovered(null)}
                    className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 py-6 text-left sm:gap-8 sm:py-7"
                  >
                    <span aria-hidden="true" className="w-12 font-mincho text-2xl text-kin sm:w-16 sm:text-3xl">
                      {specialty.kanji}
                    </span>
                    <span
                      className={`font-mincho text-[clamp(1.5rem,3.4vw,3rem)] leading-tight transition-[color,translate] duration-500 ease-[var(--ease-ink)] ${
                        isOpen || hovered === index ? "text-washi sm:translate-x-2" : "text-washi/55"
                      }`}
                    >
                      {text.name}
                    </span>
                    <span className="flex items-center gap-5">
                      <span aria-hidden="true" className="hidden font-gothic text-xs tracking-[0.3em] text-usuzumi md:block">
                        {specialty.reading}
                      </span>
                      <PlusIcon className={`h-5 w-5 shrink-0 transition-transform duration-500 ease-[var(--ease-ink)] ${isOpen ? "rotate-45" : ""}`} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-ink)] motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <div className="grid gap-6 pb-8 sm:pl-[5.5rem] md:grid-cols-[1fr_auto] md:items-end">
                      {!finePointer && (
                        <div className="relative aspect-[4/5] max-w-sm overflow-hidden md:order-2 md:w-56">
                          <Visual specialty={specialty} sizes="(min-width: 768px) 14rem, 90vw" />
                        </div>
                      )}
                      <div>
                        <p className="max-w-[36rem] font-gothic text-base leading-relaxed text-usuzumi">{text.description}</p>
                        {filter && (
                          <button type="button" onClick={() => showGallery(filter)} className="btn btn-line mt-6 min-h-12 text-washi">
                            {t.specialties.seeWork}
                            <ArrowIcon className="btn-arrow h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Podgląd podążający za kursorem (dekoracyjny — opisy są w treści listy). */}
      {finePointer && (
        <div ref={previewRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-20 w-[17rem] will-change-transform">
          <div
            className={`relative aspect-[4/5] overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] outline outline-1 -outline-offset-4 outline-kin/50 transition-[clip-path,opacity] duration-500 ease-[var(--ease-silk)] ${
              hovered !== null ? "opacity-100 [clip-path:inset(0_0_0_0)]" : "opacity-0 [clip-path:inset(100%_0_0_0)]"
            }`}
          >
            {SPECIALTIES.map((specialty, index) => (
              <div key={specialty.id} className={`absolute inset-0 transition-opacity duration-500 ${hovered === index ? "opacity-100" : "opacity-0"}`}>
                <Visual specialty={specialty} sizes="17rem" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
