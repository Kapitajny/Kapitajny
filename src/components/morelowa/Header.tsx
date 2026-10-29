"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { morelowaNav } from "@/data/morelowa";
import { Logo } from "./Logo";

const SECTION_IDS = morelowaNav.map((item) => item.href.slice(1));

/** Śledzi, która sekcja jest aktualnie na ekranie (do podświetlenia pozycji menu). */
function useActiveSection() {
  const [active, setActive] = useState<string>("start");

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Sekcja jest „aktywna”, gdy przecina pasek tuż pod nagłówkiem.
      { rootMargin: "-30% 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Link z menu mobilnego: najpierw zdejmujemy blokadę przewijania, potem przewijamy do sekcji
  // (przy zablokowanym przewijaniu natywny skok kotwicy kończy się w złym miejscu).
  const navigateFromMenu = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const hash = event.currentTarget.hash;
      const target = hash ? document.getElementById(hash.slice(1)) : null;
      if (!target) return close();
      event.preventDefault();
      delete document.documentElement.dataset.menuOpen;
      close();
      history.pushState(null, "", hash);
      target.scrollIntoView();
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    },
    [close],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mobilne: blokada przewijania, Escape, pułapka fokusu i zamknięcie po przejściu na desktop.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.menuOpen = "";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close(true);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a")].filter(Boolean) as HTMLElement[];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = () => desktop.matches && close();

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      delete root.dataset.menuOpen;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open, close]);

  return (
    <header
      // Bez backdrop-filter i transform – inaczej panel `fixed` menu mobilnego pozycjonowałby się względem nagłówka.
      className={`sticky top-0 z-40 border-b bg-krem/[0.97] transition-[border-color,box-shadow] duration-300 ${
        scrolled || open ? "border-linia shadow-[0_10px_30px_-24px_rgb(56_41_32/0.45)]" : "border-transparent"
      }`}
    >
      <div className="container-m flex h-[4.75rem] items-center justify-between gap-6 lg:h-[5.5rem]">
        <Logo onNavigate={open ? navigateFromMenu : undefined} />

        <nav aria-label="Menu główne" className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-9">
            {morelowaNav.map((item) => {
              const current = active === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current ? "true" : undefined}
                    className={`link-line text-[0.8rem] font-medium tracking-[0.04em] transition-colors hover:text-bordo ${current ? "text-bordo" : "text-braz"}`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href="#lokale" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Odwiedź nas
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex h-11 items-center gap-3 px-2 text-[0.72rem] font-semibold tracking-[0.2em] text-braz uppercase lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobilne"
            onClick={() => setOpen((value) => !value)}
          >
            <span>{open ? "Zamknij" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-px w-6 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        id="menu-mobilne"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[4.75rem] overflow-y-auto border-t border-linia bg-krem lg:hidden"
      >
        <nav aria-label="Menu mobilne" className="container-m flex min-h-full flex-col justify-between gap-10 py-8">
          <ul className="divide-y divide-linia border-b border-linia">
            {morelowaNav.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={navigateFromMenu}
                  aria-current={active === item.href.slice(1) ? "true" : undefined}
                  className="flex items-baseline gap-5 py-4 font-serif text-[1.9rem] leading-tight text-braz transition-colors hover:text-bordo aria-[current=true]:text-bordo"
                >
                  <span className="w-6 font-sans text-[0.7rem] font-semibold tracking-[0.2em] text-zloto-tekst">{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-5">
            <a href="#lokale" onClick={navigateFromMenu} className="btn btn-primary w-full">
              Odwiedź nas
            </a>
            <p className="text-center text-[0.72rem] tracking-[0.2em] text-szary uppercase">Grodzisk Mazowiecki · Warszawa</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
