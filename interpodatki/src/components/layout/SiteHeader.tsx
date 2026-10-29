"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, serviceNav } from "@/config/site";
import { IconChevronDown, IconClose, IconMenu } from "@/components/ui/Icons";
import { Logo } from "./Logo";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const servicesRef = useRef<HTMLLIElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Zamknięcie menu po przejściu na inną stronę.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (mobileOpen) {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
      setServicesOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [mobileOpen]);

  const servicesActive = serviceNav.some((s) => isActive(pathname, s.href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="shell flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Link href="/" className="shrink-0 rounded-md" aria-label="InterPodatki – strona główna">
          <Logo />
        </Link>

        <nav aria-label="Główna nawigacja" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[0.9375rem]">
            <li ref={servicesRef} className="relative">
              <button
                type="button"
                className={`flex h-10 items-center gap-1 rounded-md px-3 font-medium transition-colors hover:text-blue-ink ${servicesActive ? "text-blue-ink" : "text-navy"}`}
                aria-expanded={servicesOpen}
                aria-controls="menu-uslugi"
                onClick={() => setServicesOpen((o) => !o)}
              >
                Usługi
                <IconChevronDown size={16} className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                id="menu-uslugi"
                hidden={!servicesOpen}
                className="absolute left-0 top-full mt-2 w-[22rem] rounded-[var(--radius-panel)] border border-line bg-white p-2 shadow-[var(--shadow-float)]"
              >
                <ul>
                  {serviceNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive(pathname, item.href) ? "page" : undefined}
                        className="block rounded-md px-3 py-2.5 hover:bg-mist aria-[current=page]:bg-sky"
                      >
                        <span className="block font-medium text-navy">{item.label}</span>
                        <span className="block text-sm text-muted">{item.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="flex h-10 items-center rounded-md px-3 font-medium text-navy transition-colors hover:text-blue-ink aria-[current=page]:text-blue-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/panel-demo" className="btn btn-sm btn-outline hidden xl:inline-flex">
            Panel klienta (demo)
          </Link>
          <Link href="/kalkulator" className="btn btn-sm btn-primary hidden sm:inline-flex">
            Oblicz abonament
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-navy hover:bg-mist lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="menu-mobilne"
            aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <IconClose size={24} /> : <IconMenu size={24} />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobilne"
        hidden={!mobileOpen}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white lg:hidden"
      >
        <nav aria-label="Nawigacja mobilna" className="shell py-4">
          <p className="px-1 pb-1 text-sm text-muted">Usługi</p>
          <ul className="mb-3 border-b border-line pb-3">
            {serviceNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="flex min-h-12 items-center rounded-md px-1 text-lg text-navy aria-[current=page]:text-blue-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mb-4">
            {[...mainNav, { href: "/panel-demo", label: "Panel klienta (demo)" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="flex min-h-12 items-center rounded-md px-1 text-lg text-navy aria-[current=page]:text-blue-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/kalkulator" className="btn btn-primary w-full">
            Oblicz abonament
          </Link>
        </nav>
      </div>
    </header>
  );
}
