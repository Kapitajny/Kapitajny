"use client";

import { useEffect } from "react";

/** Dodaje .is-in elementom [data-reveal], gdy wjadą w ekran. Bez JS wszystko jest po prostu widoczne. */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    const watch = () => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    watch();
    // panele menu pojawiają się po zmianie kategorii
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["hidden"] });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
