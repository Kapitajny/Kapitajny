"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconChevron, IconClose, IconExpand } from "@/components/Icons";

const SHOTS = [
  {
    src: "/images/dlonie.jpg",
    w: 1136,
    h: 1408,
    alt: "Dwie dłonie trzymają ociekającego cheeseburgera w papierze, w tle nocne światła miasta",
    caption: "Double Cheese po zmroku, prosto z okienka przy Marszałkowskiej.",
  },
  {
    src: "/images/okienko.jpg",
    w: 1536,
    h: 1024,
    alt: "Kucharz podaje papierową torbę przez okno odbioru klientowi stojącemu na mokrym chodniku",
    caption: "Okno odbioru od strony ulicy. Zamówienia na wynos wydajemy tutaj.",
  },
  {
    src: "/images/pakowanie.jpg",
    w: 1136,
    h: 1408,
    alt: "Kucharz w zielonym fartuchu zawija świeżego burgera w biały papier, obok pojemnik z ogórkami",
    caption: "Każdy burger zawijamy w papier zaraz po złożeniu.",
  },
  {
    src: "/images/stol.jpg",
    w: 1536,
    h: 1024,
    alt: "Widok z góry na drewniany stół: burgery w papierze, frytki, krążki cebulowe i shake’i",
    caption: "Wieczór w ogródku: burgery, krążki i shake’i na jednym stole.",
  },
  {
    src: "/images/warszawa.jpg",
    w: 1536,
    h: 1024,
    alt: "Wnętrze lokalu w Warszawie: musztardowa lada z kafli, otwarta kuchnia i drewniane hokery",
    caption: "Warszawa: musztardowa lada i otwarta kuchnia z dwiema blachami.",
  },
  {
    src: "/images/grodzisk.jpg",
    w: 1536,
    h: 1024,
    alt: "Bar przy dużym oknie w Grodzisku, na blacie taca świeżo upieczonych bułek",
    caption: "Grodzisk: bar przy oknie i bułki prosto z naszej piekarni.",
  },
];

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const [pos, setPos] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const strip = useRef<HTMLUListElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const show = (i: number, el: HTMLButtonElement) => {
    opener.current = el;
    setOpen(i);
  };
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + SHOTS.length) % SHOTS.length)), []);

  useEffect(() => {
    const dlg = dialog.current;
    if (!dlg) return;
    if (open !== null && !dlg.open) dlg.showModal();
    if (open === null && dlg.open) dlg.close();
  }, [open]);

  // licznik pozycji w pasku przewijanym na telefonie
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const onScroll = () => {
      const items = Array.from(el.children) as HTMLElement[];
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      items.forEach((it, i) => {
        if (Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid) < Math.abs(items[best].offsetLeft + items[best].offsetWidth / 2 - mid)) best = i;
      });
      setPos(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const nudge = (d: number) => {
    const el = strip.current;
    if (!el) return;
    const target = el.children[Math.max(0, Math.min(SHOTS.length - 1, pos + d))] as HTMLElement;
    el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const cur = open === null ? null : SHOTS[open];

  return (
    <section id="galeria" className="gallery" aria-labelledby="gallery-title">
      <div className="wrap">
        <div className="gallery__head">
          <h2 id="gallery-title" className="h2" data-reveal="">
            Galeria
          </h2>
          <p className="gallery__lead">Kuchnia, okienko i stoły w obu lokalach. Kliknij zdjęcie, żeby je powiększyć.</p>
        </div>
        <ul className="mosaic" ref={strip}>
          {SHOTS.map((s, i) => (
            <li key={s.src} className="mosaic__item" data-i={i}>
              <button type="button" className="mosaic__btn" onClick={(e) => show(i, e.currentTarget)} aria-haspopup="dialog">
                <span className="mosaic__img">
                  <Image src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(max-width: 760px) 82vw, (max-width: 1100px) 50vw, 40vw" />
                </span>
                <span className="mosaic__cap">
                  <span>{s.caption}</span>
                  <IconExpand className="mosaic__ico" />
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="strip-nav" aria-hidden="true">
          <button type="button" tabIndex={-1} onClick={() => nudge(-1)} disabled={pos === 0}>
            <IconChevron dir="left" />
          </button>
          <span className="num">
            {pos + 1} / {SHOTS.length}
          </span>
          <button type="button" tabIndex={-1} onClick={() => nudge(1)} disabled={pos === SHOTS.length - 1}>
            <IconChevron />
          </button>
        </div>
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Powiększone zdjęcie"
        onClose={() => {
          setOpen(null);
          opener.current?.focus();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
      >
        {cur ? (
          <figure className="lightbox__fig">
            <Image key={cur.src} src={cur.src} alt={cur.alt} width={cur.w} height={cur.h} sizes="92vw" quality={85} />
            <figcaption>
              <span className="num">
                {open! + 1} / {SHOTS.length}
              </span>{" "}
              {cur.caption}
            </figcaption>
          </figure>
        ) : null}
        <div className="lightbox__bar">
          <button type="button" className="lightbox__btn" onClick={() => step(-1)}>
            <IconChevron dir="left" />
            <span className="sr-only">Poprzednie zdjęcie</span>
          </button>
          <button type="button" className="lightbox__btn" onClick={() => step(1)}>
            <IconChevron />
            <span className="sr-only">Następne zdjęcie</span>
          </button>
          <button type="button" className="lightbox__btn lightbox__close" onClick={() => setOpen(null)} autoFocus>
            <IconClose />
            <span className="sr-only">Zamknij powiększenie</span>
          </button>
        </div>
      </dialog>
    </section>
  );
}
