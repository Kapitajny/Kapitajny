"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useStudio } from "@/components/schedule/StudioProvider";
import { ArrowRight } from "@/components/ui/Icons";
import { Photo, PhotoPlaceholder } from "@/components/ui/Photo";
import { LEVELS } from "@/data/levels";
import { STYLES } from "@/data/styles";

/** Oferta zajęć jako zakładki: lista stylów + panel ze zdjęciem i opisem wybranego stylu. */
export function Classes() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { showSchedule, requestTrial } = useStudio();
  const style = STYLES[activeIndex];

  // Obsługa klawiatury zgodna ze wzorcem WAI-ARIA Tabs (strzałki, Home, End).
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowDown: activeIndex + 1,
      ArrowRight: activeIndex + 1,
      ArrowUp: activeIndex - 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: STYLES.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = (keys[event.key] + STYLES.length) % STYLES.length;
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="zajecia" aria-labelledby="zajecia-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">Nasze zajęcia</p>
            <h2 id="zajecia-title" className="h2 mt-5 text-wine">
              Pięć stylów, jeden spokojny start
            </h2>
          </div>
          <p className="lead prose-measure lg:col-span-5">
            Każdy styl prowadzimy na kilku poziomach. Wybierz ten, który Cię ciekawi – szczegóły i terminy znajdziesz obok.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <div role="tablist" aria-label="Style tańca" aria-orientation="vertical" className="grid grid-cols-2 gap-x-4 lg:col-span-5 lg:block">
            {STYLES.map((item, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  id={`tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={onKeyDown}
                  className={`group flex w-full items-baseline gap-3 border-t py-3.5 text-left transition-colors sm:gap-4 lg:py-6 ${
                    selected ? "border-wine" : "rule hover:border-cocoa/40"
                  }`}
                >
                  <span className={`font-serif text-lg ${selected ? "text-wine" : "text-rose"}`} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className={`block font-serif text-[1.35rem] leading-tight transition-colors sm:text-3xl lg:text-[2.1rem] ${selected ? "text-wine" : "group-hover:text-wine"}`}>
                      {item.name}
                    </span>
                    <span className="mt-1 hidden text-sm lg:block">{item.tagline}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            key={style.id}
            id={`panel-${style.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${style.id}`}
            tabIndex={0}
            className="fade-in grid gap-8 md:grid-cols-2 lg:col-span-7 lg:gap-10"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-blush">
              {style.photo ? (
                <Photo
                  photo={style.photo.key}
                  position={style.photo.position}
                  zoom={style.photo.zoom}
                  sizes="(min-width: 1024px) 26vw, (min-width: 768px) 46vw, 92vw"
                  alt=""
                />
              ) : (
                <PhotoPlaceholder label="High heels" note="Zdjęcie z zajęć high heels – do uzupełnienia" />
              )}
            </div>
            <div className="flex flex-col">
              <h3 className="h3 text-wine">{style.name}</h3>
              <p className="mt-2 font-semibold">{style.tagline}</p>
              <p className="mt-4">{style.description}</p>
              <dl className="mt-6 space-y-4 border-t rule pt-6 text-[0.95rem]">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em]">Poziomy</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {style.levels.map((level) => (
                      <span key={level} className="rounded-full bg-blush px-3 py-1 text-sm font-semibold">
                        {LEVELS[level].label}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em]">Czas zajęć</dt>
                  <dd className="mt-1">{style.duration}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em]">Co zabrać</dt>
                  <dd className="mt-1">{style.bring}</dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-col items-stretch gap-2 sm:items-start">
                <button type="button" className="btn btn-primary" onClick={() => showSchedule({ styleId: style.id })}>
                  Zobacz terminy
                </button>
                <button type="button" className="link-arrow justify-center sm:justify-start" onClick={() => requestTrial({ style: style.id })}>
                  Zapisz się na próbę <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
