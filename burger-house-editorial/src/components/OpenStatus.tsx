"use client";

import { useSyncExternalStore } from "react";
import { LOCATIONS, type Location } from "@/data/locations";
import { openState } from "@/lib/open";

// odświeżanie co minutę; na serwerze (i przy pierwszym renderze) brak statusu
let listeners: (() => void)[] = [];
let tick = 0;
let timer: ReturnType<typeof setInterval> | undefined;
function subscribe(cb: () => void) {
  listeners.push(cb);
  if (!timer) timer = setInterval(() => { tick++; listeners.forEach((l) => l()); }, 60_000);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
    if (!listeners.length && timer) { clearInterval(timer); timer = undefined; }
  };
}
const useTick = () => useSyncExternalStore(subscribe, () => tick, () => -1);

export function OpenPill({ loc }: { loc: Location }) {
  const t = useTick();
  if (t < 0) return <span className="label">Godziny otwarcia poniżej</span>;
  const s = openState(loc);
  return (
    <span className="label" data-open={s.open}>
      <i className="dot" aria-hidden="true" />
      {s.label}
    </span>
  );
}

/** Status obu lokali, jeden wiersz na lokal. */
export function CitiesStatus() {
  const t = useTick();
  return (
    <>
      {LOCATIONS.map((l) => {
        const s = t < 0 ? null : openState(l);
        return (
          <span key={l.slug} className="label" data-open={s?.open}>
            <i className="dot" aria-hidden="true" />
            {l.city}
            {s ? `: ${s.label.toLowerCase()}` : ""}
          </span>
        );
      })}
    </>
  );
}
