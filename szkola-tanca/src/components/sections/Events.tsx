"use client";

import { useRef, useState } from "react";
import { useStudio } from "@/components/schedule/StudioProvider";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Close } from "@/components/ui/Icons";
import { EVENTS, formatEventDate, type StudioEvent } from "@/data/events";

export function Events() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<StudioEvent | null>(null);
  const { requestTrial } = useStudio();

  const openDetails = (event: StudioEvent) => {
    setSelected(event);
    dialogRef.current?.showModal();
  };

  const signUp = (event: StudioEvent) => {
    dialogRef.current?.close();
    requestTrial({ style: "nie-wiem", message: `Chcę zapisać się na wydarzenie „${event.title}” (${formatEventDate(event.date).long.toLowerCase()}).` });
  };

  return (
    <section id="wydarzenia" aria-labelledby="wydarzenia-title" className="band section-y bg-blush">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="wydarzenia-title" className="h2 text-wine lg:col-span-7">
            Warsztaty i wydarzenia poza grafikiem
          </h2>
          <div className="lg:col-span-5">
            <p className="prose-measure">Warsztaty, zajęcia specjalne, spotkania i pokazy – dla uczestników zajęć i osób, które chcą nas poznać.</p>
            <DemoBadge className="mt-5">Wydarzenia przykładowe, terminy demonstracyjne</DemoBadge>
          </div>
        </div>

        <ul className="mt-12 grid gap-3">
          {EVENTS.map((event) => {
            const date = formatEventDate(event.date);
            return (
              <li key={event.id} className="grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-4 rounded-[1.5rem] bg-ivory p-5 sm:p-7 md:grid-cols-[6rem_1fr_auto] md:items-center md:gap-x-10">
                <p className="text-center leading-none text-wine">
                  <time dateTime={event.date}>
                    <span className="block text-5xl font-bold tracking-[-0.03em] [font-stretch:75%] md:text-6xl">{date.day}</span>
                    <span className="mt-1 block text-sm font-semibold">{date.month}</span>
                  </time>
                </p>
                <div>
                  <p className="label text-wine">{event.type}</p>
                  <h3 className="h3 mt-1">{event.title}</h3>
                  <p className="mt-2 max-w-[60ch]">{event.summary}</p>
                  <p className="mt-2 text-sm">
                    {date.long}, {event.time}. {event.price}
                  </p>
                </div>
                <button type="button" onClick={() => openDetails(event)} className="btn btn-secondary btn-sm col-start-2 justify-self-start md:col-start-auto" aria-haspopup="dialog">
                  Szczegóły<span className="sr-only">: {event.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="event-dialog-title"
        className="dialog-fade m-auto w-[min(92vw,40rem)] max-w-none rounded-[1.75rem] bg-ivory p-0 text-cocoa"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        {selected && (
          <div className="p-7 sm:p-10">
            <div className="flex items-start justify-between gap-6">
              <p className="label text-wine">{selected.type}</p>
              <button type="button" onClick={() => dialogRef.current?.close()} className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cocoa/25" autoFocus>
                <Close size={18} />
                <span className="sr-only">Zamknij szczegóły</span>
              </button>
            </div>
            <h3 id="event-dialog-title" className="h2 -mt-2 text-[2.4rem]">
              {selected.title}
            </h3>
            <p className="mt-3 font-semibold">
              {formatEventDate(selected.date).long}, {selected.time}. {selected.price}
            </p>
            <p className="mt-4">{selected.summary}</p>
            <ul className="mt-5 space-y-2">
              {selected.details.map((detail) => (
                <li key={detail} className="flex gap-3">
                  <span className="mt-3 h-px w-4 shrink-0 bg-wine" aria-hidden="true" />
                  {detail}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm">Wydarzenie przykładowe – szczegóły i termin są demonstracyjne.</p>
            <button type="button" className="btn btn-primary mt-6" onClick={() => signUp(selected)}>
              Zapytaj o miejsce
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}
