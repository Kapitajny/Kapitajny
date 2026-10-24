"use client";

import Link from "next/link";
import { useState } from "react";
import { CloseIcon, InfoIcon } from "@/components/ui/Icons";

/**
 * Dyskretne oznaczenie trybu demonstracyjnego. Renderowane tylko, gdy NEXT_PUBLIC_DEMO_MODE ≠ "false".
 */
export function DemoBadge({ agency }: { agency: string }) {
  const [open, setOpen] = useState(false);

  return (
    <aside aria-label="Informacja o koncepcji" className="ui fixed bottom-3 right-3 z-30 max-w-[calc(100vw-1.5rem)] text-[0.8125rem]">
      {open ? (
        <div className="w-80 max-w-full border border-line bg-surface p-4 text-ink shadow-[0_18px_40px_-20px_rgb(34_37_42/0.5)]">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold">Koncepcja redesignu</p>
            <button type="button" onClick={() => setOpen(false)} className="-m-2 cursor-pointer p-2" aria-label="Zamknij informację">
              <CloseIcon size={18} />
            </button>
          </div>
          <p className="mt-2 leading-relaxed text-muted">
            Niezależna propozycja przygotowana przez {agency}. Nie jest oficjalną stroną Zakładu Mięsnego Wierzejki ani projektem zatwierdzonym
            przez firmę. Dane pochodzą z publicznych źródeł i wymagają potwierdzenia.
          </p>
          <Link href="/o-koncepcji" className="link mt-3 inline-block font-semibold">
            Źródła i zakres koncepcji
          </Link>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="inline-flex min-h-9 cursor-pointer items-center gap-2 border border-line bg-surface/95 px-3 py-1.5 text-ink shadow-sm backdrop-blur-sm"
        >
          <InfoIcon size={16} className="text-red" />
          Koncepcja {agency}
        </button>
      )}
    </aside>
  );
}
