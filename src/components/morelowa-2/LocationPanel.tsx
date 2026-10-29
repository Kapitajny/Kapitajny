"use client";

import { useRef } from "react";
import type { BakeryLocation } from "@/data/morelowa";

/** Lokal z przyciskiem „Zobacz lokal”, który wysuwa z prawej panel ze szczegółami (natywny <dialog>). */
export function LocationPanel({ location }: { location: BakeryLocation }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `lokal-${location.id}`;
  const panelTitleId = `lokal-${location.id}-panel`;

  return (
    <article aria-labelledby={titleId} className="grid gap-6 border-t border-braz/80 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
      <div>
        <p className="text-[0.72rem] font-semibold tracking-[0.24em] text-bordo uppercase">
          Lokal {location.number} · {location.since}
        </p>
        <h3 id={titleId} className="mt-3 text-[2.6rem] leading-[1.02] text-braz">
          {location.city}
        </h3>
        <address className="mt-4 text-braz">
          {location.street}, {location.postalCode}
        </address>
        <p className="mt-1 text-[0.7rem] font-semibold tracking-[0.2em] text-zloto-tekst uppercase">Adres demonstracyjny</p>
        <p className="mt-4 max-w-[30rem] text-szary">{location.description}</p>
      </div>
      <button type="button" className="cta cta-ciemny cta-sm self-start sm:self-end" aria-haspopup="dialog" onClick={() => dialogRef.current?.showModal()}>
        Zobacz lokal <span aria-hidden="true">→</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={panelTitleId}
        className="panel jasne"
        // Kliknięcie w przyciemnione tło zamyka panel.
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
      >
        <div className="flex min-h-full flex-col p-7 sm:p-10">
          <div className="flex items-center justify-between gap-6 border-b border-linia pb-5">
            <p className="text-[0.72rem] font-semibold tracking-[0.24em] text-bordo uppercase">
              Lokal {location.number} · {location.since}
            </p>
            <form method="dialog">
              <button type="submit" className="-mr-2 inline-flex h-11 items-center gap-2 px-2 text-[0.75rem] font-semibold tracking-[0.18em] uppercase hover:text-bordo">
                Zamknij
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
                  <path d="M2 2l12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </form>
          </div>

          <h4 id={panelTitleId} className="mt-8 font-serif text-[2.8rem] leading-[1.02]">
            {location.city}
          </h4>
          <p className="mt-4 text-szary">{location.description}</p>
          <address className="mt-6 text-braz">
            {location.street}
            <br />
            {location.postalCode}
          </address>
          <p className="mt-1 text-[0.7rem] font-semibold tracking-[0.2em] text-zloto-tekst uppercase">Adres demonstracyjny</p>

          <h5 className="mt-10 text-[0.72rem] font-semibold tracking-[0.24em] uppercase">Co znajdziesz na miejscu</h5>
          <ul className="mt-4 divide-y divide-linia border-y border-linia">
            {location.details.map((detail) => (
              <li key={detail} className="py-3 text-szary">
                {detail}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase">Godziny otwarcia</dt>
              <dd className="mt-1 text-szary">Dane demonstracyjne — do uzupełnienia</dd>
            </div>
            <div>
              <dt className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase">Telefon</dt>
              <dd className="mt-1 text-szary">Dane demonstracyjne — do uzupełnienia</dd>
            </div>
          </dl>

          <p className="mt-auto pt-10 text-[0.82rem] text-szary">Morelowa jest marką fikcyjną — lokal nie istnieje, a dane mają charakter demonstracyjny.</p>
        </div>
      </dialog>
    </article>
  );
}
