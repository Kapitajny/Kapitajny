"use client";

import { morelowaNav } from "@/data/morelowa";
import { Logo } from "./Logo";
import { useActiveSection, useMobileMenu, useScrolled } from "./site-menu";

const SECTION_IDS = morelowaNav.map((item) => item.href.slice(1));

export function Header() {
  const active = useActiveSection(SECTION_IDS);
  const scrolled = useScrolled();
  const { open, setOpen, toggleRef, panelRef, navigateFromMenu } = useMobileMenu("(min-width: 1024px)");

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
