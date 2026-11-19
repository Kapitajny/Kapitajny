"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS, type NavId } from "@/config/site";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import { LocalizedLink } from "@/i18n/LocalizedLink";
import { useI18n } from "@/i18n/I18nProvider";
import { CloseIcon, DockIcon, MenuIcon } from "@/components/ui/Icons";

const MAGNIFY_RANGE = 150;
const MAGNIFY_AMOUNT = 0.45;

function useActiveSection(): NavId {
  const [active, setActive] = useState<NavId>("top");
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        let best = "";
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best) setActive(best as NavId);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return active;
}

/**
 * Nawigacja w formie doku.
 *  - Komputer: ikony powiększające się w pobliżu kursora (jak w macOS), podpisy, przełącznik języka, rezerwacja.
 *  - Telefon: przycisk „Menu” (arkusz z pełną nawigacją i językiem), nazwa bieżącej sekcji, rezerwacja.
 */
export function Dock() {
  const { t } = useI18n();
  const active = useActiveSection();
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const frame = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState(false);
  const [magnify, setMagnify] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShown(true), 700);
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setMagnify(query.matches);
    update();
    query.addEventListener("change", update);
    return () => {
      window.clearTimeout(id);
      query.removeEventListener("change", update);
    };
  }, []);

  function setScales(x: number | null) {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      for (const el of itemRefs.current) {
        if (!el) continue;
        let scale = 1;
        if (x !== null) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(x - (rect.left + rect.width / 2));
          if (distance < MAGNIFY_RANGE) scale = 1 + MAGNIFY_AMOUNT * ((Math.cos((distance / MAGNIFY_RANGE) * Math.PI) + 1) / 2);
        }
        el.style.setProperty("--m", scale.toFixed(3));
      }
    });
  }

  function closeSheet() {
    sheetRef.current?.close();
  }

  return (
    <>
      <nav
        aria-label={t.nav.label}
        className={`fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[translate,opacity] duration-700 ease-[var(--ease-ink)] motion-reduce:transition-none ${
          shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        {/* Telefon i mały tablet */}
        <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-washi/12 bg-graphite/90 p-1.5 text-washi shadow-[0_18px_40px_-18px_rgba(20,17,14,0.8)] backdrop-blur-xl md:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => sheetRef.current?.showModal()}
            aria-haspopup="dialog"
            className="flex h-12 items-center gap-2 rounded-full px-4 font-gothic text-sm hover:bg-washi/10"
          >
            <MenuIcon className="h-5 w-5" />
            {t.nav.menu}
          </button>
          <p className="min-w-0 flex-1 truncate text-center font-mincho text-sm text-usuzumi" aria-hidden="true">
            {t.nav.items[active]}
          </p>
          <LocalizedLink
            route="booking"
            className="flex h-12 items-center gap-2 rounded-full bg-washi px-4 font-gothic text-sm font-medium text-sumi hover:bg-kinari"
          >
            <DockIcon name="book" className="h-4 w-4" />
            {t.nav.book}
          </LocalizedLink>
        </div>

        {/* Komputer */}
        <ul
          className="hidden items-end gap-1 rounded-[1.35rem] border border-washi/12 bg-graphite/85 p-2 text-washi shadow-[0_18px_40px_-18px_rgba(20,17,14,0.8)] backdrop-blur-xl md:flex"
          onPointerMove={magnify ? (event) => setScales(event.clientX) : undefined}
          onPointerLeave={magnify ? () => setScales(null) : undefined}
        >
          {NAV_ITEMS.map((item, index) => {
            const isActive = active === item.id;
            return (
              <li
                key={item.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="group relative [--base:2.875rem]"
              >
                <LocalizedLink
                  route="home"
                  hash={item.id}
                  aria-current={isActive ? "location" : undefined}
                  className="flex aspect-square w-[calc(var(--base)*var(--m,1))] items-center justify-center rounded-[0.9rem] transition-[width,background-color] duration-150 ease-out hover:bg-washi/10 focus-visible:bg-washi/10 focus-visible:outline-offset-1"
                >
                  <DockIcon name={item.icon} className="h-[46%] w-[46%]" />
                  <span className="sr-only">{t.nav.items[item.id]}</span>
                </LocalizedLink>
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-kin transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[calc(100%+0.85rem)] left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full bg-sumi px-3 py-1 font-gothic text-2xs tracking-[0.06em] text-washi opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100"
                >
                  {t.nav.items[item.id]}
                </span>
              </li>
            );
          })}
          <li aria-hidden="true" className="mx-1.5 h-7 w-px self-center bg-washi/20" />
          <li className="self-center">
            <LanguageSwitcher size="sm" />
          </li>
          <li aria-hidden="true" className="mx-1.5 h-7 w-px self-center bg-washi/20" />
          <li className="self-center">
            <LocalizedLink
              route="booking"
              className="flex h-[2.875rem] items-center gap-2 rounded-[0.9rem] bg-washi px-4 font-gothic text-xs font-medium tracking-[0.04em] text-sumi transition-colors hover:bg-kinari focus-visible:outline-washi"
            >
              <DockIcon name="book" className="h-4 w-4" />
              {t.nav.book}
            </LocalizedLink>
          </li>
        </ul>
      </nav>

      {/* Arkusz menu na telefonie */}
      <dialog
        ref={sheetRef}
        aria-label={t.nav.menuTitle}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeSheet();
        }}
        onClose={() => menuButtonRef.current?.focus()}
        className="sheet-dialog fade-dialog fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-sumi/60 md:hidden"
      >
        <div className="sheet-panel on-dark absolute inset-x-0 bottom-0 rounded-t-[1.5rem] bg-graphite px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 text-washi">
          <div className="flex items-center justify-between">
            <p className="font-mincho text-lg">{t.nav.menuTitle}</p>
            <button
              type="button"
              onClick={closeSheet}
              className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-washi/10"
              aria-label={t.nav.menuClose}
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <ul className="mt-2 divide-y divide-washi/10 border-y border-washi/10">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <LocalizedLink
                  route="home"
                  hash={item.id}
                  onClick={closeSheet}
                  aria-current={active === item.id ? "location" : undefined}
                  className="flex min-h-14 items-center gap-4 py-2 font-mincho text-xl aria-[current=location]:text-kin"
                >
                  <DockIcon name={item.icon} className="h-5 w-5 text-usuzumi" />
                  {t.nav.items[item.id]}
                </LocalizedLink>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between gap-4">
            <LanguageSwitcher />
            <LocalizedLink route="booking" onClick={closeSheet} className="btn btn-paper min-h-12 px-5">
              {t.nav.bookLong}
            </LocalizedLink>
          </div>
        </div>
      </dialog>
    </>
  );
}
