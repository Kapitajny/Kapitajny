"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { MenuOverlay } from "@/components/layout/MenuOverlay";

/** Strony, które zaczynają się pełnoekranowym, ciemnym kadrem — nagłówek jest wtedy przezroczysty. */
function hasDarkHero(pathname: string) {
  return pathname === "/" || /^\/realizacje\/[^/]+$/.test(pathname);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // chowa się przy przewijaniu w dół, wraca przy ruchu w górę
      setHidden(y > window.innerHeight * 0.9 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y < 80) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // zamknij menu po zmianie strony
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  const overHero = hasDarkHero(pathname) && !scrolled && !open;
  const light = overHero || open;

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className={[
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,border-color,backdrop-filter] duration-700 ease-[var(--ease-out-soft)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          open
            ? "border-b border-transparent bg-transparent text-paper"
            : overHero
              ? "border-b border-transparent bg-transparent text-paper"
              : "border-b border-line bg-paper/90 text-graphite backdrop-blur-md",
        ].join(" ")}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between">
          <Link href="/" aria-label="FORMA ATELIER — strona główna" className="relative z-10 py-2">
            <Logo />
          </Link>
          <div className="relative z-10 flex items-center gap-3 sm:gap-5">
            <Link
              href="/kontakt"
              className={`btn hidden min-h-11 px-5 py-2 sm:inline-flex ${light ? "btn-light" : "btn-dark"}`}
              tabIndex={open ? -1 : undefined}
            >
              Kontakt
            </Link>
            <button
              ref={menuButton}
              type="button"
              aria-expanded={open}
              aria-controls="menu-glowne"
              aria-label={open ? "Zamknij menu" : "Otwórz menu"}
              onClick={() => setOpen((v) => !v)}
              className="group relative grid h-11 w-11 place-items-center rounded-full"
            >
              <span aria-hidden="true" className="relative block h-3 w-7">
                <span
                  className={`absolute left-0 h-px w-7 bg-current transition-all duration-500 ease-[var(--ease-out-soft)] ${
                    open ? "top-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute top-1/2 left-0 h-px bg-current transition-all duration-500 ease-[var(--ease-out-soft)] ${
                    open ? "w-0 opacity-0" : "w-5 group-hover:w-7"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-7 bg-current transition-all duration-500 ease-[var(--ease-out-soft)] ${
                    open ? "top-1/2 -rotate-45" : "top-full"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} returnFocusTo={menuButton} />
    </>
  );
}
