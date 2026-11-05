"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV, SITE } from "@/data/site";
import { ArrowIcon, PhoneIcon } from "./Icons";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // cień nagłówka po przewinięciu
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // podświetlenie aktywnej sekcji na stronie głównej
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = NAV.map((n) => n.href.split("#")[1]);
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      setActive(null);
    };
  }, [pathname]);

  // panel mobilny: blokada przewijania, Esc, pułapka fokusu
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
      if (e.key !== "Tab" || !panel) return;
      const focusables = [toggleRef.current, ...panel.querySelectorAll<HTMLElement>("a, button")].filter(Boolean) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => window.innerWidth > 960 && close();
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  return (
    <header className={`header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header__inner">
        <Logo />

        <nav className="header__nav" aria-label="Główna nawigacja">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={active === item.href.split("#")[1] ? "true" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <a className="header__phone" href={SITE.phone.href}>
            <PhoneIcon />
            <span>
              <small>Zamówienia telefoniczne</small>
              {SITE.phone.display}
            </span>
          </a>
          <a className="btn btn--sm header__cta" href={SITE.phone.href}>
            Zadzwoń i zamów
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="menu-toggle__bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        ref={panelRef}
        className={`mobile-nav${open ? " is-open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Nawigacja mobilna">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link className="mobile-nav__link" href={item.href} onClick={() => close()}>
                  {item.label}
                  <ArrowIcon width={28} height={28} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-nav__foot">
          <a className="btn btn--block" href={SITE.phone.href}>
            <PhoneIcon />
            Zadzwoń i zamów
          </a>
          <p>
            Zamówienia: {SITE.phone.display}
            <br />
            Warszawa, ul. Marszałkowska 25
            <br />
            Grodzisk Mazowiecki, ul. 11 Listopada 12
          </p>
        </div>
      </div>
    </header>
  );
}
