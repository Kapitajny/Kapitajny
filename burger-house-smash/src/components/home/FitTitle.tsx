"use client";

import { useEffect } from "react";

/**
 * Pilnuje, żeby żadna linia tytułu hero nie wyszła poza ekran: mierzy każdą linię
 * na urządzeniu (inne silniki i kroje mają inne szerokości liter) i w razie potrzeby ją zmniejsza.
 */
export function FitTitle() {
  useEffect(() => {
    const title = document.querySelector<HTMLElement>(".hero__title");
    const box = title?.closest<HTMLElement>(".hero__in");
    if (!title || !box) return;
    const fit = () => {
      const lines = Array.from(title.querySelectorAll<HTMLElement>(".hero__line"));
      lines.forEach((l) => (l.style.fontSize = ""));
      const copy = title.closest<HTMLElement>(".hero__copy");
      const avail = (copy && getComputedStyle(copy).display !== "contents" ? copy : box).getBoundingClientRect().width * 0.97;
      lines.forEach((l) => {
        const w = l.getBoundingClientRect().width;
        if (w > avail) l.style.fontSize = `${(parseFloat(getComputedStyle(l).fontSize) * avail) / w}px`;
      });
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);
  return null;
}
