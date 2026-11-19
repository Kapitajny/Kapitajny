"use client";

import { useRef, useState } from "react";

/**
 * Adres e-mail jako zaznaczalny tekst + link mailto i przycisk kopiowania.
 * Link mailto nie zawsze działa (np. w osadzonym podglądzie), więc kopiowanie jest pewną alternatywą.
 */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "select">("idle");
  const textRef = useRef<HTMLAnchorElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      // Brak dostępu do schowka: zaznaczamy adres, żeby można go było skopiować ręcznie.
      const el = textRef.current;
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setState("select");
    }
  };

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
      <a ref={textRef} className="link-ink text-[1.0625rem] font-[600] break-all select-all" href={`mailto:${email}`}>
        {email}
      </a>
      <button type="button" onClick={copy} className="link-ink min-h-11 text-[0.9375rem] font-[600]">
        {state === "copied" ? "Skopiowano" : "Kopiuj adres"}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Adres e-mail skopiowany do schowka." : state === "select" ? "Adres zaznaczony, skopiuj go skrótem klawiszowym." : ""}
      </span>
    </div>
  );
}
