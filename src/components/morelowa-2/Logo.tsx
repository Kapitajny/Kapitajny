import Image from "next/image";
import type { MouseEvent } from "react";
import emblem from "@/assets/morelowa/emblemat.png";

/** Znak MORELOWA w wersji koncepcji 2: emblemat, wordmark w Bodoni i podpis. */
export function Logo({ tone = "dark", onNavigate }: { tone?: "dark" | "light"; onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  const dark = tone === "dark";
  return (
    <a
      href="#start"
      onClick={onNavigate}
      className="inline-flex items-center gap-3"
      aria-label="Morelowa – piekarnia i cukiernia od 1991, przejdź na początek strony"
    >
      <Image src={emblem} alt="" width={44} height={44} className="h-9 w-9 shrink-0 sm:h-11 sm:w-11" />
      <span className="flex flex-col items-start leading-none">
        <span className={`font-serif text-[1.3rem] tracking-[0.2em] sm:text-[1.55rem] ${dark ? "text-braz" : "text-krem"}`}>MORELOWA</span>
        <span className={`mt-1.5 text-[0.5rem] font-medium tracking-[0.24em] whitespace-nowrap sm:text-[0.58rem] sm:tracking-[0.3em] ${dark ? "text-bordo" : "text-zloto"}`}>
          PIEKARNIA <span aria-hidden="true">•</span> CUKIERNIA <span aria-hidden="true">•</span> OD 1991
        </span>
      </span>
    </a>
  );
}
