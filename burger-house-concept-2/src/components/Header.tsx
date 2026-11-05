"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MENU } from "@/data/menu";
import { CAMPAIGNS, NAV, SITE } from "@/data/site";
import { Phone } from "./Icons";
import { Logo } from "./Logo";
import { TopbarStatus } from "./OpenStatus";

const HINTS: Record<string, string> = {
  "/#menu": `${MENU.length} pozycje`,
  "/#promocje": `${CAMPAIGNS.length} kampanie`,
  "/#o-nas": `od ${SITE.founded}`,
  "/#lokale": "Warszawa, Grodzisk",
  "/#kontakt": SITE.phone.display,
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();
  const btnRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const left = NAV.slice(0, 3);
  const right = NAV.slice(3);

  const close = useCallback((focus = false) => {
    setOpen(false);
    if (focus) btnRef.current?.focus();
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const els = NAV.map((n) => document.getElementById(n.href.slice(2))).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), {
      rootMargin: "-40% 0px -55% 0px",
    });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
      if (e.key !== "Tab" || !sheetRef.current) return;
      const f = [btnRef.current!, ...sheetRef.current.querySelectorAll<HTMLElement>("a")];
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    const onResize = () => window.innerWidth > 1000 && close();
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  const navLink = (n: (typeof NAV)[number]) => (
    <li key={n.href}>
      <Link className="navlink" href={n.href} aria-current={active === n.href.slice(2) ? "true" : undefined}>
        {n.label}
      </Link>
    </li>
  );

  return (
    <>
      <aside className="topbar" aria-label="Status lokali i zamówienia telefoniczne">
        <div className="wrap topbar__inner">
          <TopbarStatus />
          <a href={SITE.phone.href}>Zamówienia: {SITE.phone.display}</a>
        </div>
      </aside>
      <header className="header">
        <div className="wrap header__inner">
          <nav className="header__nav header__nav--left" aria-label="Sekcje strony">
            <ul>{left.map(navLink)}</ul>
          </nav>
          <div className="header__logo">
            <Logo />
          </div>
          <div className="header__nav header__nav--right">
            <nav aria-label="Lokale i kontakt">
              <ul>{right.map(navLink)}</ul>
            </nav>
            <a className="btn btn--mustard btn--sm header__cta" href={SITE.phone.href}>
              <Phone />
              Zadzwoń i zamów
            </a>
            <button
              ref={btnRef}
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls="sheet"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="menu-btn__icon" aria-hidden="true">
                <span />
                <span />
              </span>
              {open ? "Zamknij" : "Menu"}
            </button>
          </div>
        </div>
      </header>
      <div id="sheet" ref={sheetRef} className={`sheet${open ? " is-open" : ""}`} inert={!open} aria-hidden={!open}>
        <nav aria-label="Nawigacja mobilna">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => close()}>
                  {n.label}
                  <small>{HINTS[n.href]}</small>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sheet__foot">
          <a className="btn" href={SITE.phone.href}>
            <Phone />
            Zadzwoń i zamów
          </a>
          <p>Zamówienia na wynos i na miejscu w obu lokalach: {SITE.phone.display}</p>
        </div>
      </div>
    </>
  );
}
