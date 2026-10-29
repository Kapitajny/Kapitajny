import Image from "next/image";
import type { MouseEvent } from "react";
import emblem from "@/assets/morelowa/emblemat.png";

/** Znak MORELOWA w wersji nocnej: emblemat, wordmark w DM Serif i złoty podpis. */
export function Logo({ onNavigate }: { onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a href="#start" onClick={onNavigate} className="inline-flex items-center gap-3" aria-label="Morelowa – piekarnia i cukiernia od 1991, przejdź na początek strony">
      <Image src={emblem} alt="" width={44} height={44} className="h-9 w-9 shrink-0 sm:h-11 sm:w-11" />
      <span className="flex flex-col items-start leading-none">
        <span className="font-serif text-[1.45rem] tracking-[0.14em] text-krem sm:text-[1.7rem]">MORELOWA</span>
        <span className="mt-1.5 text-[0.5rem] font-semibold tracking-[0.24em] whitespace-nowrap text-zloto sm:text-[0.58rem] sm:tracking-[0.3em]">
          PIEKARNIA <span aria-hidden="true">•</span> CUKIERNIA <span aria-hidden="true">•</span> OD 1991
        </span>
      </span>
    </a>
  );
}
