"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconClose, IconPhone } from "@/components/Icons";
import { Logo } from "@/components/Logo";
import { LOCATIONS } from "@/data/locations";
import { NAV, SITE } from "@/data/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [barShown, setBarShown] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const close = useCallback((focusToggle = false) => {
    setOpen(false);
    if (focusToggle) toggle.current?.focus();
  }, []);

  // cień nagłówka i dolny pasek zamawiania na telefonie
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setBarShown(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // menu pełnoekranowe: blokada przewijania, Esc, pułapka fokusu
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
      if (e.key !== "Tab" || !panel.current) return;
      const f = [toggle.current, ...Array.from(panel.current.querySelectorAll<HTMLElement>("a, button"))].filter(Boolean) as HTMLElement[];
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => window.innerWidth > 980 && close();
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  return (
    <>
      <header className="top" data-scrolled={scrolled} data-open={open}>
        <div className="top__in wrap">
          <Link href="/" className="top__logo" onClick={() => close()}>
            <Logo />
          </Link>
          <nav className="top__nav" aria-label="Główna nawigacja">
            {NAV.map((n) => (
              <a key={n.href} href={pathname === "/" ? n.href.slice(1) : n.href} className="top__link">
                {n.label}
              </a>
            ))}
          </nav>
          <a className="btn btn--order top__order" href={SITE.phone.href}>
            <IconPhone className="btn__ico" />
            <span>
              Zamów teraz<span className="top__num"> {SITE.phone.display}</span>
            </span>
          </a>
          <button ref={toggle} type="button" className="top__burger" aria-expanded={open} aria-controls="nav-sheet" onClick={() => setOpen((o) => !o)}>
            <span className="top__burger-lines" aria-hidden="true">
              <i />
              <i />
            </span>
            <span>{open ? "Zamknij" : "Menu"}</span>
          </button>
        </div>
      </header>

      <div id="nav-sheet" ref={panel} className="sheet" data-open={open} aria-hidden={!open} inert={!open}>
        <nav aria-label="Nawigacja mobilna" className="sheet__nav">
          {NAV.map((n, i) => (
            <a key={n.href} href={pathname === "/" ? n.href.slice(1) : n.href} onClick={() => close()} style={{ ["--i" as string]: i }}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="sheet__foot">
          <a className="btn btn--order btn--block" href={SITE.phone.href}>
            <IconPhone className="btn__ico" />
            Zadzwoń: {SITE.phone.display}
          </a>
          <ul className="sheet__places">
            {LOCATIONS.map((l) => (
              <li key={l.slug}>
                <Link href={`/lokale/${l.slug}`} onClick={() => close()}>
                  <strong>{l.city}</strong> {l.street}
                </Link>
              </li>
            ))}
          </ul>
          <button type="button" className="sheet__x" onClick={() => close(true)}>
            <IconClose className="btn__ico" />
            Zamknij menu
          </button>
        </div>
      </div>

      {/* dolny pasek zamawiania – tylko telefon, po zjechaniu poniżej hero */}
      <div className="dock" data-shown={barShown && !open} inert={!(barShown && !open)}>
        <a className="dock__call" href={SITE.phone.href}>
          <IconPhone className="btn__ico" />
          Zadzwoń i zamów
        </a>
        {}
        <a className="dock__menu" href={pathname === "/" ? "#menu" : "/#menu"}>
          Menu
        </a>
      </div>
    </>
  );
}
