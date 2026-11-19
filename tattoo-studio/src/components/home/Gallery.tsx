"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { PORTFOLIO_IS_SAMPLE, WORK, WORK_STYLES, workSrc, type WorkItem, type WorkStyle } from "@/config/work";
import { ArrowIcon, CloseIcon } from "@/components/ui/Icons";
import { SectionMark } from "@/components/ui/SectionMark";

type Filter = WorkStyle | "all";

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const items = useMemo(() => (filter === "all" ? WORK : WORK.filter((w) => w.style === filter)), [filter]);
  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["all", WORK.length]]);
    for (const w of WORK) map.set(w.style, (map.get(w.style) ?? 0) + 1);
    return map;
  }, []);

  function close(lastIndex: number | null) {
    setOpenIndex(null);
    // Po zamknięciu okna fokus wraca do miniatury ostatnio oglądanego zdjęcia.
    const id = lastIndex !== null ? items[lastIndex]?.id : undefined;
    if (id) requestAnimationFrame(() => triggerRefs.current.get(id)?.focus());
  }

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="page-x relative py-24 sm:py-32">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionMark kanji="作品" reading="sakuhin" className="hidden lg:col-span-1 lg:flex" />
        <div className="lg:col-span-11">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="gallery-title" className="display display-lg">
                THE WORK
              </h2>
              <p className="mt-5 max-w-[32rem] font-mincho text-lg leading-relaxed text-nezumi">
                Tatuaże w pełnej skali — kliknij zdjęcie, aby obejrzeć je w powiększeniu.
              </p>
              {PORTFOLIO_IS_SAMPLE && (
                <p className="mt-3 max-w-[34rem] font-gothic text-xs leading-relaxed text-nezumi">
                  Zdjęcia poglądowe: zostaną zastąpione realizacjami studia. Prace oznaczone podpisem pochodzą od innych
                  autorów.
                </p>
              )}
            </div>

            <div role="group" aria-label="Filtruj według stylu" className="-mx-1 flex flex-wrap gap-1.5">
              {(["all", ...WORK_STYLES.map((s) => s.id)] as Filter[]).map((id) => {
                const label = id === "all" ? "All work" : WORK_STYLES.find((s) => s.id === id)!.label;
                const pressed = filter === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={pressed}
                    onClick={() => setFilter(id)}
                    className={`min-h-11 rounded-[2px] border px-3.5 font-gothic text-xs tracking-[0.08em] transition-colors duration-300 ${
                      pressed ? "border-sumi bg-sumi text-washi" : "border-sumi/20 text-sumi hover:border-sumi/60"
                    }`}
                  >
                    {label}
                    <span aria-hidden="true" className={`ml-2 tabular-nums ${pressed ? "text-usuzumi" : "text-nezumi"}`}>
                      {counts.get(id) ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            {`Wyświetlono ${items.length} ${items.length === 1 ? "pracę" : items.length < 5 ? "prace" : "prac"}.`}
          </p>

          <ul className="mt-14 columns-2 gap-3 sm:gap-5 lg:columns-3 [&>li]:mb-3 sm:[&>li]:mb-5">
            {items.map((item, index) => (
              <li key={item.id} className="break-inside-avoid">
                <button
                  type="button"
                  ref={(el) => {
                    if (el) triggerRefs.current.set(item.id, el);
                    else triggerRefs.current.delete(item.id);
                  }}
                  onClick={() => setOpenIndex(index)}
                  className="group block w-full text-left"
                  aria-label={`Powiększ: ${item.title}`}
                >
                  <span className="relative block overflow-hidden bg-washi-2" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
                    <Image
                      src={workSrc(item)}
                      alt={item.alt}
                      fill
                      quality={85}
                      sizes="(min-width: 1024px) 28vw, 46vw"
                      className="object-cover transition-[scale,filter] duration-[1.2s] ease-[var(--ease-ink)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
                    />
                  </span>
                  <span className="mt-3 flex items-baseline justify-between gap-3 font-gothic text-xs">
                    <span className="font-mincho text-sm text-sumi">{item.title}</span>
                    <span className="shrink-0 text-nezumi">{item.placement}</span>
                  </span>
                  {item.credit && <span className="mt-1 block font-gothic text-2xs text-nezumi">Autor: {item.credit}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Lightbox items={items} index={openIndex} onIndexChange={setOpenIndex} onClose={close} />
    </section>
  );
}

function Lightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: WorkItem[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: (lastIndex: number | null) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const item = index === null ? null : items[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (item && !dialog.open) dialog.showModal();
    if (!item && dialog.open) dialog.close();
  }, [item]);

  if (index === null || !item) return null;

  const go = (delta: number) => onIndexChange((index + delta + items.length) % items.length);

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Podgląd: ${item.title}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose(index);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(1);
        if (event.key === "ArrowLeft") go(-1);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose(index);
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const dx = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchStart.current = null;
      }}
      className="lightbox fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-sumi/95 p-0 text-washi backdrop:bg-sumi/70"
    >
      <div className="flex h-full flex-col">
        <div className="page-x flex items-center justify-between py-4">
          <p className="font-gothic text-xs tabular-nums tracking-[0.15em] text-usuzumi" aria-live="polite">
            {index + 1} / {items.length}
          </p>
          <button
            type="button"
            onClick={() => onClose(index)}
            className="flex h-11 w-11 items-center justify-center rounded-[2px] hover:bg-washi/10"
            aria-label="Zamknij podgląd"
            autoFocus
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <figure className="page-x flex min-h-0 flex-1 flex-col items-center justify-center gap-5 pb-6">
          <div
            key={item.id}
            className="lightbox-image relative min-h-0 w-full flex-1"
            style={{ maxWidth: `min(100%, ${Math.round(item.width * 1.35)}px)` }}
          >
            <Image src={workSrc(item)} alt={item.alt} fill quality={85} sizes="90vw" className="object-contain" />
          </div>
          <figcaption className="max-w-xl text-center">
            <span className="block font-mincho text-xl">{item.title}</span>
            <span className="mt-1 block font-gothic text-xs tracking-[0.08em] text-usuzumi">
              {item.placement}
              {item.credit ? `. Autor: ${item.credit}` : ""}
            </span>
          </figcaption>
        </figure>

        <div className="page-x flex justify-center gap-3 pb-6">
          <button type="button" onClick={() => go(-1)} className="btn btn-line min-w-28 text-washi" aria-label="Poprzednie zdjęcie">
            <ArrowIcon direction="left" className="h-4 w-4" />
            Prev
          </button>
          <button type="button" onClick={() => go(1)} className="btn btn-line min-w-28 text-washi" aria-label="Następne zdjęcie">
            Next
            <ArrowIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </dialog>
  );
}
