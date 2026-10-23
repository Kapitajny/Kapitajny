"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, phoneHref, siteConfig } from "@/config/site";
import { FIRST_VISIT, PRICES_ARE_EXAMPLES } from "@/data/pricing";
import { BookingLink } from "@/components/ui/BookingLink";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { Logo } from "./Logo";

/**
 * Nawigacja: na dużych ekranach stały panel boczny (logo, menu, pierwsza wizyta, „Umów wizytę”),
 * na mniejszych – górny pasek z logo i przyciskiem „Menu” otwierającym pełnoekranowe menu.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const { phone } = siteConfig.contact;
  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    if (!menuOpen) return;
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => query.matches && setMenuOpen(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [menuOpen]);

  const navList = (onNavigate?: () => void) => (
    <ul className="space-y-1">
      {mainNav.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={isCurrent(item.href) ? "page" : undefined}
            className="group flex min-h-11 items-center gap-3 rounded-pill px-4 text-h4 font-medium text-ink transition-colors hover:bg-white aria-[current=page]:bg-white aria-[current=page]:font-semibold aria-[current=page]:text-brand-deep"
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-transparent transition-colors group-hover:bg-mint-strong group-aria-[current=page]:bg-brand" />
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  const visitFacts = FIRST_VISIT?.duration && FIRST_VISIT.price && (
    <p className="text-small text-muted">
      Pierwsza wizyta: <span className="font-semibold text-ink">{FIRST_VISIT.duration}</span>,{" "}
      <span className="font-semibold text-ink">{FIRST_VISIT.price}</span>
      {PRICES_ARE_EXAMPLES ? " (cena przykładowa)" : ""}. Bez skierowania.
    </p>
  );

  return (
    <>
      {/* Panel boczny – duże ekrany */}
      <header className="sticky top-0 hidden h-dvh flex-col overflow-y-auto bg-mint px-6 py-8 lg:flex">
        <Logo layout="stacked" />
        <nav aria-label="Główna nawigacja" className="-mx-4 mt-12">
          {navList()}
        </nav>
        <div className="mt-auto space-y-4 pt-10">
          {visitFacts}
          <BookingLink className="btn btn-primary w-full" />
          {phone && (
            <a href={phoneHref(phone)} className="flex items-center gap-2 font-semibold text-brand-deep hover:underline">
              <PhoneIcon size={18} />
              {phone}
            </a>
          )}
        </div>
      </header>

      {/* Górny pasek – mniejsze ekrany */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm lg:hidden">
        <div className="content flex h-bar items-center justify-between gap-3">
          <Logo />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-pill bg-mint px-4 font-semibold text-brand-deep hover:bg-mint-strong max-[374px]:gap-1.5 max-[374px]:px-3"
            aria-haspopup="dialog"
            aria-controls="menu-mobilne"
            aria-expanded={menuOpen}
          >
            <MenuIcon size={20} />
            Menu
          </button>
        </div>
      </header>

      <Modal open={menuOpen} onClose={close} labelledBy="mobile-menu-title" className="" id="menu-mobilne">
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="content flex h-bar shrink-0 items-center justify-between">
            <Logo onNavigate={close} />
            <button
              type="button"
              onClick={close}
              className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-white px-4 font-semibold text-brand-deep hover:bg-mint-strong"
            >
              <CloseIcon size={20} />
              Zamknij
            </button>
          </div>
          <nav aria-labelledby="mobile-menu-title" className="content flex flex-1 flex-col pb-10 pt-8">
            <h2 id="mobile-menu-title" className="sr-only">
              Menu
            </h2>
            <div className="-mx-4">{navList(close)}</div>
            <div className="mt-auto space-y-4 pt-10">
              {visitFacts}
              <BookingLink onClick={close} className="btn btn-primary w-full" />
              {phone && (
                <a href={phoneHref(phone)} className="btn btn-quiet w-full">
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
