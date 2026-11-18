"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { ContactLink } from "@/components/ui/ContactLink";

/**
 * Pływające menu. Po przewinięciu staje się zwartym arkuszem z cieniem.
 * Aktywna sekcja jest oznaczona playheadem (jedyny aktywny znacznik w systemie).
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = [...nav.map((n) => n.id), "kontakt"];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActive(best);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !toggleRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      <div className="container-plan">
        <nav
          aria-label="Główna nawigacja"
          className={`pointer-events-auto relative flex items-center justify-between gap-4 rounded-full border bg-paper pr-2 pl-5 transition-[box-shadow,border-color,height] duration-300 ease-(--ease-out-expo) ${
            scrolled ? "h-14 border-rule shadow-(--shadow-lift)" : "h-16 border-rule/70"
          }`}
        >
          <a href="#top" className="rounded-full" aria-label="PULSO, przejdź na początek strony">
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative inline-flex h-10 items-center rounded-full px-3.5 text-[0.9375rem] font-[560] transition-colors duration-150 hover:text-ink ${
                      isActive ? "text-ink" : "text-ink-2"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-ink transition-transform duration-300 ease-(--ease-out-expo) ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <ContactLink className="btn btn-primary btn-sm">Kontakt</ContactLink>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-2 lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobilne"
              aria-label={open ? "Zamknij menu" : "Otwórz menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h11" />}
              </svg>
            </button>
          </div>

          <div
            ref={panelRef}
            id="menu-mobilne"
            hidden={!open}
            className="absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-3xl border border-rule bg-paper p-3 shadow-(--shadow-sheet) lg:hidden"
          >
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-lg font-[600] hover:bg-paper-2"
                  >
                    {item.label}
                    {active === item.id && <span className="h-5 w-0.5 rounded-full bg-ink" aria-hidden="true" />}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 border-t border-rule px-1 pt-3">
              <ContactLink className="btn btn-primary w-full" onNavigate={() => setOpen(false)}>
                Umów konsultację
              </ContactLink>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
