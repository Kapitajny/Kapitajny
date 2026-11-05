"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- linki do sekcji (/#menu) celowo jako <a>: <Link> nie przewija, gdy router uważa adres za niezmieniony po kliknięciu kotwicy w spisie kategorii */

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV, SITE } from "@/data/site";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const close = useCallback((focus = false) => {
    setOpen(false);
    if (focus) btn.current?.focus();
  }, []);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const els = NAV.map((n) => document.getElementById(n.href.slice(2))).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
          else setActive((cur) => (cur === e.target.id ? null : cur));
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
      if (e.key !== "Tab" || !panel.current) return;
      const f = [btn.current!, ...panel.current.querySelectorAll<HTMLElement>("a")];
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    const onResize = () => window.innerWidth > 1080 && close();
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
      <div className="frame header__inner">
        <Logo />
        <nav className="header__nav" aria-label="Główna nawigacja">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} aria-current={active === n.href.slice(2) ? "true" : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header__right">
          <a className="btn header__order" href={SITE.phone.href} aria-label={`Zamów teraz: zadzwoń ${SITE.phone.display}`}>
            Zamów teraz
          </a>
          <button
            ref={btn}
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="overlay"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
      <div id="overlay" ref={panel} className={`overlay${open ? " is-open" : ""}`} inert={!open} aria-hidden={!open}>
        <nav aria-label="Nawigacja mobilna">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a className="overlay__link" href={n.href} onClick={() => close()}>
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a className="overlay__link" href="/#kontakt" onClick={() => close()}>
                Kontakt
              </a>
            </li>
          </ul>
        </nav>
        <div className="overlay__foot">
          <a className="btn" href={SITE.phone.href}>
            Zamów teraz
          </a>
          <p className="grey">Zamówienia telefoniczne w obu lokalach: {SITE.phone.display}</p>
        </div>
      </div>
    </header>
  );
}
