"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useStudio } from "@/components/schedule/StudioProvider";
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
          <h2 id="zajecia-title" className="h2 text-wine lg:col-span-7">
            Pięć stylów, jeden spokojny start
          </h2>
          <p className="lead prose-measure lg:col-span-5">
            Każdy styl prowadzimy na kilku poziomach. Wybierz ten, który Cię ciekawi, a pokażemy, czego się spodziewać.
          </p>
        </div>

        <div role="tablist" aria-label="Style tańca" className="mt-10 flex flex-wrap gap-2 lg:mt-14">
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
                className="chip sm:min-h-12 sm:px-5 sm:text-base"
              >
                {item.name}
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
          className="fade-in mt-6 grid overflow-hidden rounded-[2rem] bg-blush md:grid-cols-2"
        >
          <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[32rem]">
            {style.photo ? (
              <Photo
                photo={style.photo.key}
                position={style.photo.position}
                zoom={style.photo.zoom}
                sizes="(min-width: 1312px) 38rem, (min-width: 768px) 48vw, 96vw"
                alt=""
              />
            ) : (
              <PhotoPlaceholder label="High heels" note="Zdjęcie z zajęć high heels do uzupełnienia" />
            )}
          </div>
          <div className="flex flex-col p-7 sm:p-10 lg:p-14">
            <h3 className="h2 text-wine">{style.name}</h3>
            <p className="lead mt-4 font-semibold">{style.tagline}</p>
            <p className="mt-4 max-w-[52ch]">{style.description}</p>
            <dl className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="label">Poziomy</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {style.levels.map((level) => (
                    <span key={level} className="rounded-full bg-ivory px-3 py-1 text-sm font-semibold">
                      {LEVELS[level].label}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="label">Czas zajęć</dt>
                <dd className="mt-1">{style.duration}</dd>
              </div>
              <div>
                <dt className="label">Co zabrać</dt>
                <dd className="mt-1">{style.bring}</dd>
              </div>
            </dl>
            <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row sm:items-center sm:gap-6">
              <button type="button" className="btn btn-primary" onClick={() => showSchedule({ styleId: style.id })}>
                Zobacz terminy
              </button>
              <button type="button" className="text-action justify-center" onClick={() => requestTrial({ style: style.id })}>
                Zapisz się na próbę
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
