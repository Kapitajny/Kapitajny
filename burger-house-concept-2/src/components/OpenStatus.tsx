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
  if (t < 0) return <span className="pill">Godziny otwarcia poniżej</span>;
  const s = openState(loc);
  return (
    <span className="pill" data-open={s.open}>
      <i aria-hidden="true" />
      {s.label}
    </span>
  );
}

export function TopbarStatus() {
  const t = useTick();
  if (t < 0) return <span className="status">Warszawa i Grodzisk Mazowiecki</span>;
  const states = LOCATIONS.map((l) => ({ city: l.city, ...openState(l) }));
  const anyOpen = states.some((s) => s.open);
  return (
    <span className="status" data-open={anyOpen}>
      <i className="status__dot" aria-hidden="true" />
      {states.map((s, i) => (
        <span key={s.city}>
          {i > 0 && " · "}
          {s.city}: {s.label.toLowerCase()}
        </span>
      ))}
    </span>
  );
}
