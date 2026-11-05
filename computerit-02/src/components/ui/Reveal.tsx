"use client";

import { useEffect } from "react";

/**
 * Jedno IntersectionObserver dla wszystkich elementów `.reveal` (odpinane po pokazaniu).
 * MutationObserver dopina elementy, które pojawią się później – treść podstron dociera strumieniowo
 * i po nawigacji, więc jednorazowe skanowanie przy montowaniu nie wystarcza.
 */
export function RevealObserver() {
  useEffect(() => {
    const show = (element: Element) => element.classList.add("is-in");

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Pokazujemy też elementy już przewinięte (np. po skoku do kotwicy).
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) continue;
          show(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const watched = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll(".reveal:not(.is-in)").forEach((element) => {
        if (watched.has(element)) return;
        watched.add(element);
        observer.observe(element);
      });
    };

    let frame = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    scan();
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
