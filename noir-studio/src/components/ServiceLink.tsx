"use client";

import type { SessionType } from "@/data/services";
import { requestSession } from "./inquiry-events";
import { scrollToSection } from "./scroll";

/** Przycisk zapytania o ofertę: przewija do formularza i wybiera w nim rodzaj sesji. */
export function ServiceLink({ session, children }: { session: SessionType; children: string }) {
  return (
    <a
      href={`?session=${session}#contact`}
      className="button"
      onClick={(event) => {
        event.preventDefault();
        requestSession(session);
        scrollToSection("#contact");
      }}
    >
      {children}
    </a>
  );
}
