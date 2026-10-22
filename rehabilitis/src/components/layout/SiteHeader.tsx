"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mainNav, phoneHref, siteConfig } from "@/config/site";
import { BookingLink } from "@/components/ui/BookingLink";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { Logo } from "./Logo";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const { phone } = siteConfig.contact;

  // Menu mobilne zamykamy, gdy okno zostanie poszerzone do widoku desktopowego.
  useEffect(() => {
    if (!menuOpen) return;
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => query.matches && setMenuOpen(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="container-x flex h-[4.25rem] items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Główna nawigacja" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="rounded-md px-3 py-2 font-medium text-graphite transition-colors hover:bg-sage hover:text-forest">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <BookingLink className="btn btn-primary btn-sm hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-md px-3 font-semibold text-forest hover:bg-sage lg:hidden"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
            >
              <MenuIcon size={22} />
              Menu
            </button>
          </div>
        </div>
      </header>

      <Modal open={menuOpen} onClose={close} labelledBy="mobile-menu-title" className="">
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="container-x flex h-[4.25rem] shrink-0 items-center justify-between border-b border-line">
            <Logo onNavigate={close} />
            <button type="button" onClick={close} className="inline-flex h-11 items-center gap-2 rounded-md px-3 font-semibold text-forest hover:bg-sage">
              <CloseIcon size={22} />
              Zamknij
            </button>
          </div>
          <nav aria-labelledby="mobile-menu-title" className="container-x flex flex-1 flex-col pb-10 pt-4">
            <h2 id="mobile-menu-title" className="sr-only">
              Menu
            </h2>
            <ul>
              {mainNav.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link href={item.href} onClick={close} className="block py-4 text-xl font-semibold text-ink hover:text-forest">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3">
              <BookingLink onClick={close} className="btn btn-primary w-full" />
              {phone && (
                <a href={phoneHref(phone)} className="btn btn-outline w-full">
                  <PhoneIcon size={18} /> Zadzwoń: {phone}
                </a>
              )}
            </div>
          </nav>
        </div>
      </Modal>
    </>
  );
}
