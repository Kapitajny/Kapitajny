"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "@/config/site";
import { DockIcon } from "@/components/ui/Icons";

const MAGNIFY_RANGE = 150;
const MAGNIFY_AMOUNT = 0.5;

/**
 * Nawigacja w formie doku (jak w macOS): ikony powiększają się w pobliżu kursora,
 * podpis pojawia się po najechaniu lub fokusie, a kropka wskazuje bieżącą sekcję.
 * Powiększanie działa tylko przy precyzyjnym wskaźniku i bez `prefers-reduced-motion`.
 */
export function Dock() {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const frame = useRef<number | null>(null);
  const [active, setActive] = useState<string>("top");
  const [shown, setShown] = useState(false);
  const [magnify, setMagnify] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShown(true), 900);
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setMagnify(query.matches);
    update();
    query.addEventListener("change", update);
    return () => {
      window.clearTimeout(id);
      query.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        let best = "";
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best) setActive(best);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
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

  return (
    <nav
      aria-label="Nawigacja główna"
      className={`fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[translate,opacity] duration-700 ease-[var(--ease-ink)] motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <ul
        className="flex items-end gap-0.5 rounded-[1.15rem] border border-washi/12 bg-sumi/82 p-1.5 text-washi shadow-[0_18px_40px_-18px_rgba(26,22,18,0.75)] backdrop-blur-xl sm:gap-1 sm:p-2"
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
              className="group relative [--base:2.375rem] sm:[--base:2.875rem]"
            >
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "location" : undefined}
                className="flex aspect-square w-[calc(var(--base)*var(--m,1))] items-center justify-center rounded-[0.8rem] transition-[width,background-color] duration-150 ease-out hover:bg-washi/10 focus-visible:bg-washi/10 focus-visible:outline-offset-1"
              >
                <DockIcon name={item.icon} className="h-[46%] w-[46%]" />
              </Link>
              <span
                aria-hidden="true"
                className={`absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-washi transition-opacity duration-300 ${
                  isActive ? "opacity-90" : "opacity-0"
                }`}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[calc(100%+0.85rem)] left-1/2 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[3px] bg-sumi px-2.5 py-1 font-gothic text-2xs tracking-[0.12em] text-washi opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100 sm:block"
              >
                {item.label}
              </span>
            </li>
          );
        })}
        <li aria-hidden="true" className="mx-1 h-7 w-px self-center bg-washi/20 sm:mx-1.5" />
        <li
          ref={(el) => {
            itemRefs.current[NAV_ITEMS.length] = el;
          }}
          className="relative [--base:2.375rem] sm:[--base:2.875rem]"
        >
          <Link
            href="/rezerwacja"
            className="flex h-[calc(var(--base)*var(--m,1))] items-center gap-2 rounded-[0.8rem] bg-washi px-3 font-gothic text-xs font-medium tracking-[0.1em] text-sumi transition-[height,background-color] duration-150 ease-out hover:bg-kinari focus-visible:outline-washi sm:px-4"
          >
            <DockIcon name="book" className="h-[1.05rem] w-[1.05rem]" />
            <span>Book</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
