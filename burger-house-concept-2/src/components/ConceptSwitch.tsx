"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/data/site";

/** Przełącznik koncepcji do prezentacji klientowi. Pojawia się po przewinięciu poza hero, żeby nie zasłaniać treści. */
export function ConceptSwitch() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const on = () => setShown(window.scrollY > window.innerHeight * 0.8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={`switch${shown ? " is-shown" : ""}`} aria-label="Wersje projektu">
      <a href={SITE.concept1Url}>Koncepcja 01</a>
      <span aria-current="page">Koncepcja 02</span>
    </nav>
  );
}
