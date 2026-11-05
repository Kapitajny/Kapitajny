"use client";

import { useEffect } from "react";

/** Odsłania zdjęcia z klasą .reveal przy przewijaniu. Bez JS zdjęcia są po prostu widoczne. */
export function RevealObserver() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-in"), io.unobserve(e.target))),
      { rootMargin: "0px 0px -10% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
