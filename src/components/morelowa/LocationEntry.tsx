"use client";

import { useState } from "react";
import type { BakeryLocation } from "@/data/morelowa";

/** Jeden lokal: miasto, adres demonstracyjny i rozwijane szczegóły po kliknięciu „Zobacz lokal”. */
export function LocationEntry({ location }: { location: BakeryLocation }) {
  const [open, setOpen] = useState(false);
  const panelId = `lokal-${location.id}-szczegoly`;
  const titleId = `lokal-${location.id}`;

  return (
    <article aria-labelledby={titleId} className="border-b border-linia py-10 first:pt-0 lg:py-12">
      <p className="flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.24em] text-bordo uppercase">
        Lokal {location.number}
        <span aria-hidden="true" className="h-px w-6 bg-zloto" />
        <span className="text-szary">{location.since}</span>
      </p>
      <h3 id={titleId} className="display-3 mt-4 text-braz sm:text-[2.75rem]">
        {location.city}
      </h3>

      <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-10">
        <div>
          <address className="text-[1.02rem] leading-relaxed text-braz">
            {location.street}
            <br />
            {location.postalCode}
          </address>
          <p className="mt-2 text-[0.72rem] font-semibold tracking-[0.18em] text-zloto-tekst uppercase">Adres demonstracyjny</p>
        </div>
        <p className="text-szary">{location.description}</p>
      </div>

      <button
        type="button"
        className="btn btn-outline btn-sm mt-8"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Zwiń informacje" : "Zobacz lokal"}
        <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <path d="M2 4.5 6 8.5l4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>

      <div id={panelId} hidden={!open} className="mt-8 border-l border-bordo pl-6">
        <h4 className="text-[0.72rem] font-semibold tracking-[0.22em] text-braz uppercase">Co znajdziesz na miejscu</h4>
        <ul className="mt-4 space-y-2.5 text-[0.95rem] text-szary">
          {location.details.map((detail) => (
            <li key={detail} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.7em] h-1 w-1 shrink-0 rotate-45 bg-zloto" />
              {detail}
            </li>
          ))}
        </ul>
        <dl className="mt-6 grid gap-x-8 gap-y-3 text-[0.9rem] sm:grid-cols-2">
          <div>
            <dt className="text-[0.7rem] font-semibold tracking-[0.2em] text-braz uppercase">Godziny otwarcia</dt>
            <dd className="mt-1 text-szary">Dane demonstracyjne — do uzupełnienia</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] font-semibold tracking-[0.2em] text-braz uppercase">Telefon</dt>
            <dd className="mt-1 text-szary">Dane demonstracyjne — do uzupełnienia</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
