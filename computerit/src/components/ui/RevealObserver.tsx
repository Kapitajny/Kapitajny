"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Jedno IntersectionObserver dla wszystkich elementów `.reveal` / `.reveal-frame` na stronie. */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal:not(.is-in), .reveal-frame:not(.is-in)");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
