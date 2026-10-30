"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { bookHref, menu, site } from "@/config/site";
import { Logo } from "./Logo";

/** Pages whose first screen is dark – the bar starts with a light logo there. */
const DARK_TOP = new Set(["/about", "/contact"]);

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu when the route changes (e.g. browser back while it is open).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setPreview(null);
  }

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    setPreview(null);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While open: lock page scroll, make everything outside the header inert, close on Escape.
  useEffect(() => {
    const root = document.documentElement;
    const outside = [document.getElementById("content"), document.getElementById("site-footer"), document.getElementById("skip-link")];
    // Scrollbar width is compensated, so hiding the scrollbar doesn't shift the page sideways.
    if (open) root.style.setProperty("--sbw", `${window.innerWidth - root.clientWidth}px`);
    root.toggleAttribute("data-menu-open", open);
    outside.forEach((el) => el?.toggleAttribute("inert", open));
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.removeAttribute("data-menu-open");
      root.style.removeProperty("--sbw");
      outside.forEach((el) => el?.removeAttribute("inert"));
    };
  }, [open, close]);

  const light = open || (!scrolled && DARK_TOP.has(pathname));
  const currentIndex = menu.findIndex((item) => isCurrent(pathname, item.href));
  const noteIndex = preview ?? (currentIndex >= 0 ? currentIndex : 0);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Bar: logo + toggle. Stays above the menu panel, so both remain visible when it is open. */}
      <div
        className={`relative z-20 transition-[background-color,border-color] duration-300 ${
          !open && scrolled ? "border-b border-black/10 bg-ivory" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="wrap flex h-[var(--bar)] items-center justify-between pr-[calc(var(--pad)+var(--sbw,0px))]">
          <Logo light={light} onNavigate={() => open && close(false)} />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close(false) : setOpen(true))}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`group relative -mr-3 grid size-12 place-items-center transition-colors duration-300 ${light ? "text-ivory" : "text-black"}`}
          >
            <span aria-hidden="true" className="relative block h-[15px] w-8">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-[var(--ease-out-quint)] ${
                  open ? "translate-y-[6.75px] rotate-45" : "group-hover:-translate-y-px"
                }`}
              />
              <span
                className={`absolute left-0 top-[6.75px] h-[1.5px] w-full origin-right bg-current transition-[transform,opacity] duration-300 ${
                  open ? "scale-x-0 opacity-0" : "scale-x-[0.7] group-hover:scale-x-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-[var(--ease-out-quint)] ${
                  open ? "-translate-y-[6.75px] -rotate-45" : "group-hover:translate-y-px"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Backdrop below the panel on large screens – a click outside closes the menu. */}
      <div
        aria-hidden="true"
        onClick={() => close(false)}
        className={`fixed inset-0 z-0 bg-black/55 transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <div
        id="site-menu"
        inert={!open}
        className={`menu-panel fixed inset-x-0 top-0 z-10 flex h-dvh flex-col overflow-y-auto bg-burgundy text-ivory lg:h-[82vh] lg:min-h-[40rem] ${open ? "is-open" : ""}`}
      >
        <div className="wrap flex flex-1 flex-col pb-8 pt-[calc(var(--bar)+1.5rem)] lg:pb-10 lg:pt-[calc(var(--bar)+2.5rem)]">
          <div className="grid flex-1 gap-10 lg:grid-cols-12 lg:gap-8">
            <nav aria-label="Main" className="lg:col-span-8">
              <ol className="menu-list" onMouseLeave={() => setPreview(null)}>
                {menu.map((item, i) => {
                  const current = i === currentIndex;
                  return (
                    <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                      <Link
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        onClick={() => close(false)}
                        onMouseEnter={() => setPreview(i)}
                        onFocus={() => setPreview(i)}
                        className="menu-link group/item flex items-baseline gap-4 py-1 sm:gap-6"
                      >
                        <span className="kicker w-14 shrink-0 text-rose-light sm:w-20">
                          {String(i + 1).padStart(2, "0")} <span aria-hidden="true">—</span>
                        </span>
                        <span className="menu-label font-display text-[clamp(2.1rem,7.2vw,2.75rem)] uppercase leading-[1.08] tracking-[-0.01em] sm:text-[clamp(2.6rem,4.6vh+1.6vw,4.4rem)]">
                          {item.label}
                        </span>
                        {current && (
                          <span className="kicker hidden self-center text-rose-light sm:inline">
                            <span className="sr-only">(</span>you are here<span className="sr-only">)</span>
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="menu-aside flex flex-col justify-between gap-8 lg:col-span-4 lg:border-l lg:border-ivory/15 lg:pl-10">
              <p aria-live="polite" className="hidden max-w-xs font-display text-2xl leading-snug text-ivory/90 lg:block">
                {menu[noteIndex].note}
              </p>
              <Link href={bookHref} onClick={() => close(false)} className="cta cta-ivory w-full justify-between sm:w-auto lg:w-full">
                Book your visit
                <svg aria-hidden="true" width="22" height="10" viewBox="0 0 22 10" fill="none">
                  <path d="M0 5h21M16.5 1 21 5l-4.5 4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
            </div>
          </div>

          <ul className="menu-aside mt-10 grid gap-x-8 gap-y-3 border-t border-ivory/15 pt-6 text-sm sm:grid-cols-3">
            <li>
              <span className="kicker block text-rose-light">Phone</span>
              <a href={site.contact.phoneHref} className="underline-hover mt-1 inline-block">
                {site.contact.phone}
              </a>
            </li>
            <li>
              <span className="kicker block text-rose-light">E-mail</span>
              <a href={`mailto:${site.contact.email}`} className="underline-hover mt-1 inline-block">
                {site.contact.email}
              </a>
            </li>
            <li>
              <span className="kicker block text-rose-light">Instagram</span>
              <a href={site.contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline-hover mt-1 inline-block">
                {site.contact.instagramHandle}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
