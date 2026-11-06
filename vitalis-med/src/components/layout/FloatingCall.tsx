"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icons";
import { siteConfig } from "@/config/site";

/**
 * Stały przycisk szybkiego kontaktu z dyspozytornią (wzorem „Szybki kontakt” w serwisach przychodni).
 * Pojawia się po przewinięciu poza pierwszy ekran, aby nie zasłaniać treści sekcji hero.
 */
export function FloatingCall() {
  const { contact } = siteConfig;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside aria-label="Szybki kontakt">
      <a
        href={contact.phoneHref}
        tabIndex={visible ? undefined : -1}
        aria-hidden={visible ? undefined : true}
        className={`fixed z-30 flex items-center gap-3 rounded-full bg-ink p-2 text-white shadow-[0_10px_30px_-10px_rgb(17_20_23/0.55)] transition-[opacity,transform,background-color] duration-300 hover:bg-graphite-2 sm:py-2.5 sm:pl-2.5 sm:pr-5 ${
          visible ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
        style={{
          right: "max(1rem, env(safe-area-inset-right, 0px))",
          bottom: "max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.5rem))",
        }}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red sm:h-9 sm:w-9">
          <Icon name="phone" size={18} />
        </span>
        <span className="sr-only sm:hidden">Zadzwoń do dyspozytorni: {contact.phoneDisplay}</span>
        <span className="hidden leading-tight sm:block">
          <span className="block text-[0.72rem] text-white/70">Dyspozytornia 24/7</span>
          <span className="block text-[0.95rem] font-semibold">{contact.phoneDisplay}</span>
        </span>
      </a>
    </aside>
  );
}
