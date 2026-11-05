"use client";

import { useEffect } from "react";

/**
 * Jeden obserwator dla wszystkich elementów z atrybutem `data-reveal`.
 * Bez JS (lub z `prefers-reduced-motion`) treść jest po prostu widoczna.
 */
export function RevealObserver() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
