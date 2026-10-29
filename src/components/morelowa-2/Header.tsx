"use client";

import { useActiveSection, useMobileMenu, useScrolled } from "@/components/morelowa/site-menu";
import { morelowaNav } from "@/data/morelowa";
import { Logo } from "./Logo";

const SECTION_IDS = morelowaNav.map((item) => item.href.slice(1));

/** Nagłówek przezroczysty nad zdjęciem hero; po przewinięciu dostaje ciemne tło. */
export function Header() {
  const active = useActiveSection(SECTION_IDS);
  const scrolled = useScrolled(24);
  const { open, setOpen, toggleRef, panelRef, navigateFromMenu } = useMobileMenu("(min-width: 1024px)");
  const solid = scrolled || open;

  return (
    <header
      // Bez backdrop-filter i transform – inaczej panel `fixed` menu mobilnego pozycjonowałby się względem nagłówka.
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${solid ? "border-linia-ciemna bg-noc" : "border-transparent bg-transparent"}`}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between gap-6 lg:h-[5.25rem]">
        <Logo onNavigate={open ? navigateFromMenu : undefined} />

        <nav aria-label="Menu główne" className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-10">
            {morelowaNav.map((item) => {
              const current = active === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current ? "true" : undefined}
                    className={`podkreslenie text-[0.86rem] font-medium transition-colors hover:text-zloto ${current ? "text-zloto" : "text-krem"}`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href="#lokale" className="cta cta-zloto cta-sm hidden sm:inline-flex">
            Odwiedź nas <span aria-hidden="true">→</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex h-11 items-center gap-3 px-2 text-[0.75rem] font-semibold tracking-[0.2em] text-krem uppercase lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobilne"
            onClick={() => setOpen((value) => !value)}
          >
            <span>{open ? "Zamknij" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-7">
              <span className={`absolute right-0 h-px bg-current transition-all duration-300 ${open ? "top-1.5 w-7 rotate-45" : "top-0 w-7"}`} />
              <span className={`absolute right-0 h-px bg-current transition-all duration-300 ${open ? "top-1.5 w-7 -rotate-45" : "top-3 w-4"}`} />
            </span>
          </button>
        </div>
      </div>

      <div ref={panelRef} id="menu-mobilne" hidden={!open} className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-noc lg:hidden">
        <nav aria-label="Menu mobilne" className="shell flex min-h-full flex-col justify-between gap-12 py-10">
          <ul className="flex flex-col">
            {morelowaNav.map((item) => (
              <li key={item.href} className="border-b border-linia-ciemna">
                <a
                  href={item.href}
                  onClick={navigateFromMenu}
                  aria-current={active === item.href.slice(1) ? "true" : undefined}
                  className="flex items-center justify-between py-4 font-serif text-[2rem] leading-tight text-krem aria-[current=true]:text-zloto"
                >
                  {item.label}
                  <span aria-hidden="true" className="font-sans text-[1.1rem] text-zloto">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-5">
            <a href="#lokale" onClick={navigateFromMenu} className="cta cta-zloto w-full">
              Odwiedź nas <span aria-hidden="true">→</span>
            </a>
            <p className="text-center text-[0.72rem] tracking-[0.24em] text-mgla uppercase">Grodzisk Mazowiecki · Warszawa</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
