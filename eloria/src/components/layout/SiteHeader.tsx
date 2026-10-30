"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { bookingHref, mainNav, siteConfig } from "@/config/site";
import { Logo } from "./Logo";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = () => dialogRef.current?.showModal();
  const closeMenu = () => dialogRef.current?.close();

  return (
    <header
      className={`sticky top-0 z-40 bg-ivory transition-[border-color] duration-300 ${scrolled ? "border-b border-line" : "border-b border-transparent"}`}
    >
      <div className="frame flex h-[var(--header-h)] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Główna nawigacja" className="hidden lg:block">
          <ul className="flex items-center gap-9 text-sm">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-2 transition-colors hover:text-espresso ${active ? "text-espresso" : "text-taupe"} after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-champagne after:transition-transform after:duration-300 ${active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <a href={siteConfig.contact.phoneHref} className="hidden text-sm text-taupe transition-colors hover:text-espresso xl:inline">
            {siteConfig.contact.phoneDisplay}
          </a>
          <Link href={bookingHref} className="btn btn-primary hidden min-h-11 px-6 sm:inline-flex">
            Umów konsultację
          </Link>
          <button
            type="button"
            onClick={openMenu}
            className="-mr-2 inline-flex min-h-11 items-center gap-3 px-2 text-sm lg:hidden"
            aria-haspopup="dialog"
            aria-controls="menu-mobilne"
          >
            Menu
            <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
              <span className="h-px w-full bg-espresso" />
              <span className="h-px w-2/3 self-end bg-espresso" />
            </span>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        id="menu-mobilne"
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-ivory p-0 text-espresso backdrop:bg-transparent open:flex open:flex-col"
        onClick={(event) => {
          if (event.target instanceof HTMLAnchorElement) closeMenu();
        }}
      >
        <div className="frame flex h-[var(--header-h)] shrink-0 items-center justify-between">
          <Logo onNavigate={closeMenu} />
          <button type="button" onClick={closeMenu} className="-mr-2 inline-flex min-h-11 items-center gap-3 px-2 text-sm">
            Zamknij
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2 2 16" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </div>
        <nav aria-label="Menu mobilne" className="frame flex flex-1 flex-col justify-between overflow-y-auto pb-8 pt-6">
          <ul className="space-y-1">
            <li>
              <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="block py-1.5 font-serif text-[2.5rem] font-light leading-tight">
                Strona główna
              </Link>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="block py-1.5 font-serif text-[2.5rem] font-light leading-tight aria-[current=page]:italic"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-6 border-t border-line pt-8">
            <Link href={bookingHref} className="btn btn-primary w-full">
              Umów konsultację
            </Link>
            <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 text-sm text-taupe">
              <a href={siteConfig.contact.phoneHref} className="link-quiet">
                {siteConfig.contact.phoneDisplay}
              </a>
              <a href={`mailto:${siteConfig.contact.email}`} className="link-quiet">
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </nav>
      </dialog>
    </header>
  );
}
