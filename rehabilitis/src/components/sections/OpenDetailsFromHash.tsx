"use client";

import { useEffect } from "react";

/**
 * Otwiera <details>, do którego prowadzi kotwica w adresie (np. /faq#faq-odwolanie),
 * żeby po kliknięciu linku od razu widać było odpowiedź, a nie zwinięte pytanie.
 */
export function OpenDetailsFromHash() {
  useEffect(() => {
    const open = () => {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
