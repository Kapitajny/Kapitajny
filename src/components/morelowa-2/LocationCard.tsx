"use client";

import { useRef } from "react";
import type { BakeryLocation } from "@/data/morelowa";

/** Lokal z przyciskiem „Zobacz lokal”, który otwiera okno ze szczegółami (natywny <dialog>). */
export function LocationCard({ location }: { location: BakeryLocation }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `lokal-${location.id}`;
  const dialogTitleId = `lokal-${location.id}-okno`;

  return (
    <article aria-labelledby={titleId} className="flex w-full flex-col border-t border-braz pt-7">
      <p className="text-[0.72rem] font-medium tracking-[0.24em] text-bordo uppercase">
        Lokal {location.number} · {location.since}
      </p>
      <h3 id={titleId} className="mt-4 text-[2.3rem] leading-[1.05] text-braz">
        {location.city}
      </h3>
      <address className="mt-5 text-braz">
        {location.street}
        <br />
        {location.postalCode}
      </address>
      <p className="mt-1.5 text-[0.7rem] font-medium tracking-[0.2em] text-zloto-tekst uppercase">Adres demonstracyjny</p>
      <p className="mt-5 flex-1 text-szary">{location.description}</p>
      <button type="button" className="pill pill-line pill-sm mt-8 self-start" aria-haspopup="dialog" onClick={() => dialogRef.current?.showModal()}>
        Zobacz lokal
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={dialogTitleId}
        className="dialog"
        // Kliknięcie w przyciemnione tło zamyka okno.
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
      >
        <div className="p-7 sm:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[0.72rem] font-medium tracking-[0.24em] text-bordo uppercase">
                Lokal {location.number} · {location.since}
              </p>
              <h4 id={dialogTitleId} className="mt-3 font-serif text-[2.2rem] leading-tight">
                {location.city}
              </h4>
            </div>
            <form method="dialog">
              <button type="submit" className="-mt-1 -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-bez" aria-label="Zamknij okno">
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
                  <path d="M2 2l12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </form>
          </div>

          <address className="mt-5 text-braz">
            {location.street}, {location.postalCode}
          </address>
          <p className="mt-1 text-[0.7rem] font-medium tracking-[0.2em] text-zloto-tekst uppercase">Adres demonstracyjny</p>

          <h5 className="mt-8 text-[0.72rem] font-medium tracking-[0.22em] uppercase">Co znajdziesz na miejscu</h5>
          <ul className="mt-4 space-y-2.5 text-szary">
            {location.details.map((detail) => (
              <li key={detail} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rotate-45 bg-zloto" />
                {detail}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid gap-4 border-t border-linia pt-6 text-[0.95rem] sm:grid-cols-2">
            <div>
              <dt className="text-[0.7rem] font-medium tracking-[0.2em] uppercase">Godziny otwarcia</dt>
              <dd className="mt-1 text-szary">Dane demonstracyjne — do uzupełnienia</dd>
            </div>
            <div>
              <dt className="text-[0.7rem] font-medium tracking-[0.2em] uppercase">Telefon</dt>
              <dd className="mt-1 text-szary">Dane demonstracyjne — do uzupełnienia</dd>
            </div>
          </dl>
        </div>
      </dialog>
    </article>
  );
}
