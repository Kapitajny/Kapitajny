"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { PORTFOLIO_IS_SAMPLE, WORK, WORK_STYLES, workSrc, type WorkStyle } from "@/config/work";
import { useI18n } from "@/i18n/I18nProvider";
import { ArrowIcon, CloseIcon } from "@/components/ui/Icons";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Filter = WorkStyle | "all";
type Work = (typeof WORK)[number];

/** Zdarzenie pozwalające innym sekcjom (np. specjalizacjom) ustawić filtr galerii. */
export const GALLERY_FILTER_EVENT = "gallery:filter";

export function Gallery() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const items = useMemo<Work[]>(() => (filter === "all" ? [...WORK] : WORK.filter((w) => w.style === filter)), [filter]);
  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["all", WORK.length]]);
    for (const w of WORK) map.set(w.style, (map.get(w.style) ?? 0) + 1);
    return map;
  }, []);

  useEffect(() => {
    const onFilter = (event: Event) => {
      const style = (event as CustomEvent<WorkStyle>).detail;
      if ((WORK_STYLES as readonly string[]).includes(style)) setFilter(style);
    };
    window.addEventListener(GALLERY_FILTER_EVENT, onFilter);
    return () => window.removeEventListener(GALLERY_FILTER_EVENT, onFilter);
  }, []);

  function close(lastIndex: number | null) {
    setOpenIndex(null);
    const id = lastIndex !== null ? items[lastIndex]?.id : undefined;
    if (id) requestAnimationFrame(() => triggerRefs.current.get(id)?.focus());
  }

  const filters: Filter[] = ["all", ...WORK_STYLES];

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="page-x relative py-24 sm:py-32">
      <SectionHeader
        id="gallery-title"
        kanji="作品"
        reading="sakuhin"
        title={t.gallery.title}
        lead={
          <>
            <p>{t.gallery.lead}</p>
            {PORTFOLIO_IS_SAMPLE && <p className="mt-3 max-w-[34rem] font-gothic text-xs leading-relaxed">{t.gallery.sampleNote}</p>}
          </>
        }
      />

      <div role="group" aria-label={t.gallery.filterLabel} className="-mx-1 mt-12 flex gap-1.5 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible">
        {filters.map((id) => {
          const pressed = filter === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(id)}
              className={`min-h-11 shrink-0 rounded-full border px-4 font-gothic text-xs tracking-[0.04em] transition-colors duration-300 ${
                pressed ? "border-sumi bg-sumi text-washi" : "border-sumi/20 text-sumi hover:border-sumi/60"
              }`}
            >
              {id === "all" ? t.gallery.all : t.gallery.styles[id]}
              <span aria-hidden="true" className={`ml-2 tabular-nums ${pressed ? "text-kin" : "text-nezumi"}`}>
                {counts.get(id) ?? 0}
              </span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {t.gallery.shown(items.length)}
      </p>

      {/* Wiersze o stałej wysokości: każde zdjęcie zachowuje proporcje, kolejność od lewej do prawej. */}
      <ul className="mt-8 flex flex-wrap gap-2.5 [--row:150px] sm:gap-4 sm:[--row:230px] lg:[--row:290px] 2xl:[--row:340px]">
        {items.map((item, index) => {
          const ratio = item.width / item.height;
          const text = t.work.items[item.id];
          const credit = "credit" in item ? item.credit : undefined;
          return (
            <li key={item.id} className="min-w-0" style={{ flexGrow: ratio, flexBasis: `calc(var(--row) * ${ratio.toFixed(4)})` }}>
              <button
                type="button"
                ref={(el) => {
                  if (el) triggerRefs.current.set(item.id, el);
                  else triggerRefs.current.delete(item.id);
                }}
                onClick={() => setOpenIndex(index)}
                className="group block w-full text-left"
              >
                <span className="relative block overflow-hidden bg-washi-2" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
                  <Image
                    src={workSrc(item)}
                    alt={text.alt}
                    fill
                    quality={85}
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className="object-cover transition-[scale] duration-[1.2s] ease-[var(--ease-ink)] group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
                  />
                  <span aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-kin/0 transition-[box-shadow] duration-500 group-hover:ring-kin/60" />
                </span>
                {/* Dwie linie dla każdej pracy — wiersze galerii pozostają wyrównane. */}
                <span className="mt-2.5 block truncate font-mincho text-sm">
                  <span className="sr-only">{t.gallery.enlarge} </span>
                  {text.title}
                </span>
                <span className="block truncate font-gothic text-2xs text-nezumi">{credit ? t.gallery.credit(credit) : text.placement}</span>
              </button>
            </li>
          );
        })}
        <li aria-hidden="true" className="h-0" style={{ flexGrow: 10 }} />
      </ul>

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
  items: Work[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: (lastIndex: number | null) => void;
}) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const item = index === null ? null : items[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && item && !dialog.open) dialog.showModal();
  }, [item]);

  useEffect(() => {
    thumbsRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [index]);

  if (index === null || !item) return null;

  const text = t.work.items[item.id];
  const credit = "credit" in item ? item.credit : undefined;
  const go = (delta: number) => onIndexChange((index + delta + items.length) % items.length);

  return (
    <dialog
      ref={dialogRef}
      aria-label={t.gallery.lightbox.label(text.title)}
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
      className="fade-dialog on-dark fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-sumi/96 p-0 text-washi backdrop:bg-sumi/70"
    >
      <div className="flex h-full flex-col">
        <div className="page-x flex items-center justify-between py-4">
          <p className="font-gothic text-xs tabular-nums tracking-[0.15em] text-usuzumi" aria-live="polite">
            {t.gallery.lightbox.counter(index + 1, items.length)}
          </p>
          <button
            type="button"
            onClick={() => onClose(index)}
            className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-washi/10"
            aria-label={t.gallery.lightbox.close}
            autoFocus
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <figure className="page-x flex min-h-0 flex-1 flex-col items-center justify-center gap-5">
          <div key={item.id} className="lightbox-image relative min-h-0 w-full flex-1" style={{ maxWidth: `min(100%, ${Math.round(item.width * 1.35)}px)` }}>
            <Image src={workSrc(item)} alt={text.alt} fill quality={85} sizes="90vw" className="object-contain" />
          </div>
          <figcaption className="max-w-xl text-center">
            <span className="block font-mincho text-xl">{text.title}</span>
            <span className="mt-1 block font-gothic text-xs text-usuzumi">
              {text.placement}
              {credit ? `. ${t.gallery.credit(credit)}` : ""}
            </span>
          </figcaption>
        </figure>

        <div className="page-x flex items-center gap-3 py-5">
          <button type="button" onClick={() => go(-1)} className="btn btn-line h-12 min-h-12 shrink-0 px-4 text-washi sm:px-5">
            <ArrowIcon direction="left" className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">{t.gallery.lightbox.prev}</span>
          </button>
          <div ref={thumbsRef} role="group" aria-label={t.gallery.lightbox.thumbnails} className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1">
            {items.map((thumb, thumbIndex) => (
              <button
                key={thumb.id}
                type="button"
                onClick={() => onIndexChange(thumbIndex)}
                aria-current={thumbIndex === index ? "true" : undefined}
                aria-label={t.gallery.lightbox.thumbnail(t.work.items[thumb.id].title)}
                className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-sm transition-opacity ${
                  thumbIndex === index ? "opacity-100 ring-1 ring-kin" : "opacity-45 hover:opacity-80"
                }`}
              >
                <Image src={workSrc(thumb)} alt="" fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(1)} className="btn btn-line h-12 min-h-12 shrink-0 px-4 text-washi sm:px-5">
            <span className="sr-only sm:not-sr-only">{t.gallery.lightbox.next}</span>
            <ArrowIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </dialog>
  );
}
