"use client";

import { useSyncExternalStore } from "react";
import type { Location } from "@/data/locations";
import { openState } from "@/lib/open";

// odświeżanie co minutę; na serwerze (i przy pierwszym renderze) brak statusu
let listeners: (() => void)[] = [];
let tick = 0;
let timer: ReturnType<typeof setInterval> | undefined;
function subscribe(cb: () => void) {
  listeners.push(cb);
  if (!timer)
    timer = setInterval(() => {
      tick++;
      listeners.forEach((l) => l());
    }, 60_000);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
    if (!listeners.length && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}
export const useTick = () =>
  useSyncExternalStore(
    subscribe,
    () => tick,
    () => -1,
  );

/** „Otwarte do 22:00” z kropką; przed hydratacją – neutralny tekst. */
export function OpenPill({ loc, className = "" }: { loc: Location; className?: string }) {
  const t = useTick();
  if (t < 0)
    return (
      <span className={`status ${className}`} data-status="">
        Godziny otwarcia niżej
      </span>
    );
  const s = openState(loc);
  return (
    <span className={`status ${className}`} data-open={s.open} data-status="">
      <i aria-hidden="true" />
      {s.label}
    </span>
  );
}
