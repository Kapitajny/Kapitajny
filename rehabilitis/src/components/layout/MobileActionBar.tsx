"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { phoneHref, siteConfig } from "@/config/site";
import { BookingLink } from "@/components/ui/BookingLink";
import { PhoneIcon } from "@/components/ui/Icons";

/**
 * Stały pasek na telefonach: „Zadzwoń” (gdy numer jest uzupełniony) i „Umów wizytę”.
 * Nie pokazujemy go na stronie kontaktu, bo formularz i dane są tam w treści strony.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  const barRef = useRef<HTMLElement>(null);
  const { phone } = siteConfig.contact;
  const hidden = pathname.startsWith("/kontakt");

  // Element z fokusem nie może chować się pod paskiem (WCAG 2.4.11). Przeglądarka nie przewija,
  // gdy element jest częściowo widoczny, więc przy przejściu fokusu pod pasek przewijamy sami.
  useEffect(() => {
    if (hidden) return;
    const onFocusIn = (event: FocusEvent) => {
      const bar = barRef.current;
      const target = event.target;
      if (!bar || !(target instanceof HTMLElement) || bar.contains(target) || target.closest("dialog")) return;
      // Następna klatka: po ewentualnym przewinięciu wykonanym przez przeglądarkę.
      requestAnimationFrame(() => {
        const barTop = bar.getBoundingClientRect().top;
        const rect = target.getBoundingClientRect();
        // Elementy wyższe niż miejsce nad paskiem (np. panel zakładek) zostawiamy z widocznym początkiem.
        const room = barTop - 16;
        if (bar.offsetParent !== null && rect.bottom > barTop && rect.height < room) {
          window.scrollBy({ top: rect.bottom - barTop + 16, behavior: "instant" });
        }
      });
    };
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, [hidden]);

  if (hidden) return null;
  return (
    <nav
      ref={barRef}
      aria-label="Szybki kontakt"
      className="mobile-action-bar fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 px-4 backdrop-blur-sm pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:hidden"
    >
      <div className={`grid gap-3 ${phone ? "grid-cols-2" : "grid-cols-1"}`}>
        {phone && (
          <a href={phoneHref(phone)} className="btn btn-quiet w-full">
            <PhoneIcon size={18} /> Zadzwoń
          </a>
        )}
        <BookingLink className="btn btn-primary w-full" />
      </div>
    </nav>
  );
}
