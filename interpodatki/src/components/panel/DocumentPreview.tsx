"use client";

import { useRef, type ReactNode } from "react";
import { IconClose } from "@/components/ui/Icons";

/** Podgląd dokumentu demonstracyjnego w oknie modalnym (natywny <dialog>: pułapka fokusu i Escape). */
export function DocumentPreview({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-outline"
        aria-label={`${label}: ${title}`}
        onClick={() => ref.current?.showModal()}
      >
        {label}
      </button>
      <dialog
        ref={ref}
        aria-label={title}
        className="m-auto w-[min(40rem,calc(100vw-2rem))] rounded-[var(--radius-panel)] border border-line p-0 shadow-[var(--shadow-float)] backdrop:bg-navy-deep/60"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <p className="font-semibold text-navy">{title}</p>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-mist"
            onClick={() => ref.current?.close()}
            aria-label="Zamknij podgląd"
          >
            <IconClose size={20} />
          </button>
        </div>
        <div className="relative max-h-[70vh] overflow-y-auto p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            <span className="-rotate-[24deg] font-serif text-[6rem] font-semibold text-gold/20 select-none">DEMO</span>
          </div>
          <div className="relative">{children}</div>
        </div>
      </dialog>
    </>
  );
}
