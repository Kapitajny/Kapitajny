"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { categories } from "@/data/catalog";
import { helpNav, mainNav } from "@/config/site";
import { useShop } from "@/components/shop/ShopProvider";
import { Modal } from "@/components/ui/Modal";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/ui/Icons";
import { Logo } from "./Logo";
import { SearchDialog } from "./SearchDialog";

function Count({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span className="absolute right-0.5 top-0.5 grid h-[1.1rem] min-w-[1.1rem] place-items-center rounded-full bg-paper px-1 text-[0.65rem] font-bold leading-none text-ink tabular-nums">
      {value > 99 ? "99+" : value}
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, favorites, setCartOpen, hydrated } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const cartLabel = hydrated && itemCount > 0 ? `Koszyk, ${itemCount} szt.` : "Koszyk";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink">
      <a href="#tresc" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
        Przejdź do treści
      </a>
      <div className="wrap flex h-16 items-center gap-2 md:h-[4.5rem]">
        <button type="button" className="icon-btn -ml-2 lg:hidden" aria-label="Otwórz menu" aria-haspopup="dialog" onClick={() => setMenuOpen(true)}>
          <MenuIcon />
        </button>

        <Logo className="mr-6 lg:mr-10" />

        <nav aria-label="Główna" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="relative block px-3 py-2 text-[0.8125rem] font-bold uppercase tracking-[0.04em] wide text-muted transition-colors hover:text-paper aria-[current=page]:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center">
          <button type="button" className="icon-btn" aria-label="Szukaj" aria-haspopup="dialog" onClick={() => setSearchOpen(true)}>
            <SearchIcon />
          </button>
          <Link href="/konto" className="icon-btn hidden sm:inline-grid" aria-label="Konto">
            <UserIcon />
          </Link>
          <Link href="/ulubione" className="icon-btn relative hidden sm:inline-grid" aria-label={hydrated && favorites.length ? `Ulubione, ${favorites.length}` : "Ulubione"}>
            <HeartIcon />
            {hydrated && <Count value={favorites.length} />}
          </Link>
          <button type="button" className="icon-btn relative -mr-2" aria-label={cartLabel} aria-haspopup="dialog" onClick={() => setCartOpen(true)}>
            <BagIcon />
            {hydrated && <Count value={itemCount} />}
          </button>
        </div>
      </div>

      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} labelledBy="menu-title" className="drawer drawer-left">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            <h2 id="menu-title" className="display-sm text-lg">
              Menu
            </h2>
            <button type="button" className="icon-btn -mr-2" aria-label="Zamknij menu" onClick={() => setMenuOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="Menu mobilne" className="flex-1 overflow-y-auto px-4 pb-10">
            {categories.map((category) => (
              <div key={category.slug} className="border-b border-line py-5">
                <Link href={`/kategoria/${category.slug}`} onClick={() => setMenuOpen(false)} className="display text-[2.4rem] block">
                  {category.name}
                </Link>
                <ul className="mt-3 grid grid-cols-2 gap-x-4">
                  {category.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link href={`/kategoria/${category.slug}/${sub.slug}`} onClick={() => setMenuOpen(false)} className="block py-2 text-[0.95rem] text-muted hover:text-paper">
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <ul className="py-5">
              {mainNav.slice(2).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setMenuOpen(false)} className="display-sm block py-2.5 text-xl">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sklep" onClick={() => setMenuOpen(false)} className="display-sm block py-2.5 text-xl">
                  Wszystkie produkty
                </Link>
              </li>
            </ul>
            <ul className="border-t border-line pt-5">
              {helpNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setMenuOpen(false)} className="block py-2.5 text-muted hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Modal>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
