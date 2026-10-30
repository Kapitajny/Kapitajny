"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { imageFocus, imageSrc } from "@/config/images";
import { bookingHref, mainNav, siteConfig } from "@/config/site";
import { Logo } from "./Logo";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Nagłówek z menu-kurtyną.
 * – Zamknięty: logo po lewej i okrągły przycisk z trzema kreskami po prawej.
 * – Otwarty: burgundowa kurtyna z zaokrąglonym dołem opada od góry, pozycje są wyśrodkowane,
 *   przycisk zmienia się w X, strona pod spodem jest zablokowana i przygaszona.
 * – Zamyka się klawiszem Escape, kliknięciem w tło, przyciskiem i przy każdej zmianie adresu.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Blokada przewijania z kompensacją paska przewijania.
  useEffect(() => {
    const root = document.documentElement;
    if (!open) return;
    root.style.setProperty("--scrollbar-w", `${window.innerWidth - root.clientWidth}px`);
    root.setAttribute("data-menu-open", "");
    return () => {
      root.removeAttribute("data-menu-open");
      root.style.removeProperty("--scrollbar-w");
    };
  }, [open]);

  // Escape zamyka; Tab krąży w obrębie nagłówka, gdy menu jest otwarte.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab" || !headerRef.current) return;
      const items = Array.from(headerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.closest("[inert]") && el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !headerRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <header ref={headerRef} data-menu={open ? "open" : "closed"} className="fixed inset-x-0 top-0 z-50">
      <div
        className={`relative z-[60] transition-[background-color,color,box-shadow] duration-500 ${
          open ? "bg-transparent text-ivory" : scrolled ? "bg-ivory/95 text-burgundy shadow-[0_1px_0_rgb(72_30_44/0.08)]" : "bg-transparent text-burgundy"
        }`}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between">
          <Logo onNavigate={() => close()} />
          <button
            ref={toggleRef}
            type="button"
            className="toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="line" aria-hidden="true" />
            <span className="line" aria-hidden="true" />
            <span className="line" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div aria-hidden="true" className="veil fixed inset-0 z-40 bg-burgundy-deep/45" onClick={() => close()} />

      <div
        id="site-menu"
        inert={!open}
        className="curtain fixed inset-x-0 top-0 z-50 flex h-dvh flex-col overflow-y-auto bg-burgundy text-ivory lg:h-[82svh] lg:min-h-[36rem] lg:overflow-hidden"
      >
        <div className="h-[var(--header-h)] shrink-0" />
        <div className="shell flex flex-1 flex-col items-center justify-center gap-10 pb-10 pt-4 text-center lg:pb-12">
          <nav aria-label="Menu główne">
            <ul className="nav-list flex flex-col items-center gap-1 sm:gap-1.5">
              {mainNav.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="bloom" style={{ "--i": i } as React.CSSProperties}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => close()}
                      className="nav-item script py-0.5 text-[clamp(2.1rem,9vw,3.1rem)] leading-[1.15] lg:text-[clamp(2.4rem,min(4.4vw,6.4svh),4.4rem)]"
                    >
                      <span aria-hidden="true" className="mr-3 self-start pt-[0.55em] font-sans text-xs font-normal not-italic tracking-[0.1em] text-rose-light">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span aria-hidden="true" className="nav-thumb relative">
                        <Image src={imageSrc(item.image)} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: imageFocus(item.image) }} />
                      </span>
                      <span className={active ? "underline decoration-rose-light decoration-1 underline-offset-[0.18em]" : ""}>{item.label}</span>
                      {active && <span className="sr-only"> (bieżąca strona)</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="bloom flex flex-col items-center gap-6" style={{ "--i": 7 } as React.CSSProperties}>
            <Link href={bookingHref} onClick={() => close()} className="pill pill-ivory">
              Umów wizytę
            </Link>
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-ivory/85">
              <li>
                <a href={siteConfig.contact.phoneHref} className="rose-link">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="rose-link">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a href={siteConfig.contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="rose-link">
                  Instagram {siteConfig.contact.instagramHandle}
                  <span className="sr-only"> (otwiera się w nowej karcie)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
