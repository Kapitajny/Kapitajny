import Image from "next/image";
import type { MouseEvent } from "react";
import emblem from "@/assets/morelowa/emblemat.png";

/** Znak MORELOWA: emblemat z bochenkiem i kłosem, wordmark i podpis. */
export function Logo({ tone = "dark", onNavigate }: { tone?: "dark" | "light"; onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  const dark = tone === "dark";
  return (
    <a href="#start" onClick={onNavigate} className="inline-flex items-center gap-3 sm:gap-3.5" aria-label="Morelowa – piekarnia i cukiernia od 1991, przejdź na początek strony">
      <Image src={emblem} alt="" width={48} height={48} className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" />
      <span className="flex flex-col items-start leading-none">
        <span className={`font-serif text-[1.45rem] font-semibold tracking-[0.18em] sm:text-[1.8rem] sm:tracking-[0.2em] ${dark ? "text-bordo" : "text-krem"}`}>MORELOWA</span>
        <span className={`mt-1.5 text-[0.5rem] font-semibold tracking-[0.2em] whitespace-nowrap sm:text-[0.6rem] sm:tracking-[0.28em] ${dark ? "text-szary" : "text-zloto"}`}>
          PIEKARNIA <span aria-hidden="true">•</span> CUKIERNIA <span aria-hidden="true">•</span> OD 1991
        </span>
      </span>
    </a>
  );
}
