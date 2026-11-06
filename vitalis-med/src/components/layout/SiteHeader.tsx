"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icons";
import { mainNav, orderHref, siteConfig } from "@/config/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Zamknij menu mobilne po przejściu na inną stronę.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const openMenu = () => dialogRef.current?.showModal();
  const closeMenu = () => dialogRef.current?.close();

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur-md transition-[border-color,box-shadow] duration-300 supports-[backdrop-filter]:bg-white/88 ${
          scrolled ? "border-line shadow-[0_8px_24px_-20px_rgb(21_24_27/0.4)]" : "border-transparent"
        }`}
      >
        <div className="container-x flex h-[4.5rem] items-center gap-6 lg:h-20">
          <Link href="/" className="shrink-0" aria-label={`${siteConfig.name} – strona główna`}>
            <Logo className="h-9 w-auto lg:h-11" />
          </Link>

          <nav aria-label="Menu główne" className="ml-auto hidden xl:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative block px-3 py-2 text-[0.97rem] font-bold transition-colors duration-200 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-red after:transition-transform after:duration-300 ${
                        active ? "text-ink after:scale-x-100" : "text-body after:scale-x-0 hover:text-ink hover:after:scale-x-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link href={orderHref()} className="btn btn-primary btn-sm ml-auto hidden sm:inline-flex xl:ml-4">
            Zamów transport medyczny
          </Link>

          <a
            href={siteConfig.contact.phoneHref}
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-[4px] bg-red text-white sm:hidden"
            aria-label={`Zadzwoń: ${siteConfig.contact.phoneDisplay}`}
          >
            <Icon name="phone" size={20} />
          </a>

          <button
            type="button"
            onClick={openMenu}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ink xl:hidden"
            aria-label="Otwórz menu"
            aria-haspopup="dialog"
          >
            <Icon name="menu" size={26} />
          </button>
        </div>
      </header>

      <dialog ref={dialogRef} className="menu-sheet xl:hidden" aria-label="Menu" onClick={(e) => e.target === e.currentTarget && closeMenu()}>
        <div className="flex h-full flex-col">
          <div className="container-x flex h-[4.5rem] shrink-0 items-center justify-between border-b border-line">
            <Link href="/" onClick={closeMenu} aria-label={`${siteConfig.name} – strona główna`}>
              <Logo className="h-9 w-auto" />
            </Link>
            <button type="button" onClick={closeMenu} className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ink" aria-label="Zamknij menu">
              <Icon name="close" size={26} />
            </button>
          </div>

          <nav aria-label="Menu główne (mobilne)" className="container-x flex-1 overflow-y-auto py-6">
            <ul className="divide-y divide-line border-b border-line">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className="flex items-center justify-between py-4 font-display text-[1.6rem] font-bold tracking-tight text-ink"
                    >
                      <span className="flex items-center gap-3">
                        {active && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red" />}
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 grid gap-3">
              <Link href={orderHref()} onClick={closeMenu} className="btn btn-primary w-full">
                Zamów transport medyczny
              </Link>
              <a href={siteConfig.contact.phoneHref} className="btn btn-outline w-full">
                <Icon name="phone" size={18} />
                {siteConfig.contact.phoneDisplay}
              </a>
            </div>
            <p className="mt-6 flex items-start gap-2 text-sm text-muted">
              <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-red" />W stanie zagrożenia życia dzwoń pod numer alarmowy 112 lub 999.
            </p>
          </nav>
        </div>
      </dialog>
    </>
  );
}
