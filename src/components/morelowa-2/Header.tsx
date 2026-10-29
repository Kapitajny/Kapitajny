"use client";

import { useActiveSection, useMobileMenu, useScrolled } from "@/components/morelowa/site-menu";
import { morelowaNav } from "@/data/morelowa";
import { Logo } from "./Logo";

const SECTION_IDS = morelowaNav.map((item) => item.href.slice(1));
export function Header() {
  const active = useActiveSection(SECTION_IDS);
  const scrolled = useScrolled();
  const { open, setOpen, toggleRef, panelRef, navigateFromMenu } = useMobileMenu("(min-width: 1280px)");

  const link = (item: (typeof morelowaNav)[number]) => {
    const current = active === item.href.slice(1);
    return (
      <li key={item.href}>
        <a
          href={item.href}
          aria-current={current ? "true" : undefined}
          className={`nav-link text-[0.76rem] font-medium tracking-[0.16em] whitespace-nowrap uppercase transition-colors hover:text-bordo ${current ? "text-bordo" : "text-braz"}`}
        >
          {item.label}
        </a>
      </li>
    );
  };

  return (
    <header
      // Bez backdrop-filter i transform – inaczej panel `fixed` menu mobilnego pozycjonowałby się względem nagłówka.
      className={`sticky top-0 z-40 bg-krem transition-shadow duration-300 ${
        scrolled || open ? "shadow-[0_1px_0_0_var(--color-linia),0_12px_30px_-26px_rgb(56_41_32/0.5)]" : ""
      }`}
    >
      {/* Rząd 1: miasta, logo pośrodku, przycisk „Odwiedź nas”. Rząd 2 (desktop): menu wyśrodkowane pod logo. */}
      <div className="wrap grid h-[4.5rem] grid-cols-[1fr_auto] items-center gap-4 xl:h-[5.25rem] xl:grid-cols-[1fr_auto_1fr] xl:gap-10">
        <p className="hidden text-[0.7rem] font-medium tracking-[0.24em] text-szary uppercase xl:block">Grodzisk Mazowiecki · Warszawa</p>

        <Logo onNavigate={open ? navigateFromMenu : undefined} />

        <div className="flex items-center justify-end gap-3">
          <a href="#lokale" className="pill pill-bordo pill-sm hidden whitespace-nowrap sm:inline-flex">
            Odwiedź nas
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex h-11 min-w-11 items-center justify-center gap-3 rounded-full px-2 text-[0.75rem] font-medium tracking-[0.18em] text-braz uppercase xl:hidden"
            aria-expanded={open}
            aria-controls="menu-mobilne"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only sm:not-sr-only">{open ? "Zamknij" : "Menu"}</span>
            {/* Ikona: dwie kreski zamieniające się w krzyżyk */}
            <span aria-hidden="true" className="relative block h-2.5 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "top-1 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "top-1 -rotate-45" : "top-2.5"}`} />
            </span>
          </button>
        </div>
      </div>

      <nav aria-label="Menu główne" className="hidden border-t border-linia xl:block">
        <ul className="wrap flex h-12 items-center justify-center gap-12">{morelowaNav.map(link)}</ul>
      </nav>

      <div ref={panelRef} id="menu-mobilne" hidden={!open} className="on-dark fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-bordo text-krem xl:hidden">
        <nav aria-label="Menu mobilne" className="wrap flex min-h-full flex-col justify-between gap-12 py-10">
          <ul className="flex flex-col gap-1">
            {morelowaNav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={navigateFromMenu}
                  aria-current={active === item.href.slice(1) ? "true" : undefined}
                  className="group flex items-center gap-4 py-2.5 font-serif text-[2.2rem] leading-tight sm:text-[2.6rem]"
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rotate-45 bg-zloto opacity-0 transition-opacity group-hover:opacity-100 group-aria-[current=true]:opacity-100"
                  />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-5">
            <a href="#lokale" onClick={navigateFromMenu} className="pill pill-krem w-full">
              Odwiedź nas
            </a>
            <p className="text-center text-[0.72rem] tracking-[0.24em] text-krem/80 uppercase">Grodzisk Mazowiecki · Warszawa</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
