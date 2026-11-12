"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, site } from "@/config/site";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { Logo } from "./Logo";

export function SiteHeader() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !overHero || scrolled;
  const close = () => menuRef.current?.close();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 text-white transition-[background-color,box-shadow] duration-300 ${
        solid ? "bg-graphite shadow-[0_1px_0_var(--color-slate-line)]" : "bg-gradient-to-b from-graphite/70 to-transparent"
      }`}
    >
      <a href="#tresc" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:bg-white focus:px-4 focus:py-2 focus:text-graphite">
        Przejdź do treści
      </a>
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Główna nawigacja" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.98rem] font-medium">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center text-white/85 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/rezerwacja" className="btn btn-light btn-sm hidden sm:inline-flex">
            Zarezerwuj
          </Link>
          <button
            type="button"
            className="-mr-2 grid h-11 w-11 place-items-center lg:hidden"
            aria-label="Otwórz menu"
            aria-haspopup="dialog"
            onClick={() => menuRef.current?.showModal()}
          >
            <MenuIcon size={26} />
          </button>
        </div>
      </div>

      <dialog ref={menuRef} className="dialog h-dvh w-screen" aria-label="Menu" onClick={(e) => e.target === e.currentTarget && close()}>
        <div className="menu-panel on-dark flex h-full flex-col bg-graphite text-white">
          <div className="wrap flex h-[4.5rem] items-center justify-between">
            <Logo compact />
            <button type="button" className="-mr-2 grid h-11 w-11 place-items-center" aria-label="Zamknij menu" onClick={close} autoFocus>
              <CloseIcon size={26} />
            </button>
          </div>
          <nav aria-label="Menu mobilne" className="wrap flex-1 overflow-y-auto pb-8 pt-6">
            <ul className="grid gap-1">
              {mainNav.map((item, i) => (
                <li key={item.href} style={{ ["--i" as string]: i }}>
                  <Link href={item.href} onClick={close} className="block py-2 font-display text-[2.6rem] font-extrabold uppercase leading-none">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <span className="wake mt-8 w-[85%]" aria-hidden="true" />
            <p className="mt-8 text-white/70">
              {site.address.street}, {site.address.postal} {site.address.city}
            </p>
          </nav>
          <div className="wrap grid grid-cols-[1fr_auto] gap-2 border-t border-slate-line py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link href="/rezerwacja" onClick={close} className="btn btn-primary">
              Zarezerwuj skuter
            </Link>
            <Link href="/#cennik" onClick={close} className="btn btn-ghost">
              Cennik
            </Link>
          </div>
        </div>
      </dialog>
    </header>
  );
}
