"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, phoneHref, siteConfig } from "@/config/site";
import { BookingLink } from "@/components/ui/BookingLink";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { Logo } from "./Logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const { phone } = siteConfig.contact;
  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

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
      <header className="sticky top-0 z-30 border-b border-line bg-ivory/95 backdrop-blur-sm">
        <div className="page flex h-header items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Główna nawigacja" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className="relative inline-flex min-h-11 items-center px-3 text-small text-ink transition-colors after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:scale-x-0 after:bg-brand after:transition-transform hover:text-brand aria-[current=page]:font-bold aria-[current=page]:text-brand-strong aria-[current=page]:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {phone && (
              <a href={phoneHref(phone)} className="hidden items-center gap-2 px-2 text-small font-bold text-brand-strong hover:underline xl:inline-flex">
                <PhoneIcon size={18} />
                {phone}
              </a>
            )}
            <BookingLink className="btn btn-primary btn-sm hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-control px-2 font-bold text-brand-strong hover:bg-brand-soft lg:hidden"
              aria-haspopup="dialog"
              aria-controls="menu-mobilne"
              aria-expanded={menuOpen}
            >
              <MenuIcon size={22} />
              Menu
            </button>
          </div>
        </div>
      </header>

      <Modal open={menuOpen} onClose={close} labelledBy="mobile-menu-title" className="" id="menu-mobilne">
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="page flex h-header shrink-0 items-center justify-between border-b border-line">
            <Logo onNavigate={close} />
            <button type="button" onClick={close} className="inline-flex min-h-11 items-center gap-2 rounded-control px-3 font-bold text-brand-strong hover:bg-brand-soft">
              <CloseIcon size={22} />
              Zamknij
            </button>
          </div>
          <nav aria-labelledby="mobile-menu-title" className="page flex flex-1 flex-col pb-10 pt-4">
            <h2 id="mobile-menu-title" className="sr-only">
              Menu
            </h2>
            <ul>
              {mainNav.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className="flex min-h-14 items-center text-h3 font-bold text-ink hover:text-brand aria-[current=page]:text-brand"
                  >
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
