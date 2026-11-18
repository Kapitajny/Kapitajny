"use client";

import { useEffect } from "react";

/**
 * Jeden obserwator dla elementów [data-reveal]. Treść jest widoczna domyślnie (bez JS i przy
 * ograniczonym ruchu); klasa `js` na <html> włącza delikatne wejście tylko wtedy, gdy skrypt działa.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => {
      // Elementy już widoczne przy załadowaniu pokazujemy od razu (bez mignięcia).
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
