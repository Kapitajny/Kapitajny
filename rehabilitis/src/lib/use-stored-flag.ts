"use client";

import { useCallback, useSyncExternalStore } from "react";

const CHANGE_EVENT = "rehabilitis-storage-flag";
/** Wartości ustawione w tej sesji – działają także, gdy przeglądarka blokuje localStorage. */
const memory = new Map<string, boolean>();

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * Flaga zapisana w localStorage (np. zgoda na mapę), zsynchronizowana między komponentami i kartami.
 * Zwraca `null` podczas renderowania na serwerze, zanim stan przeglądarki będzie znany.
 */
export function useStoredFlag(key: string): [value: boolean | null, set: (value: boolean) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      if (memory.has(key)) return memory.get(key)!;
      try {
        return window.localStorage.getItem(key) === "1";
      } catch {
        return false;
      }
    },
    () => null,
  );

  const set = useCallback(
    (next: boolean) => {
      memory.set(key, next);
      try {
        if (next) window.localStorage.setItem(key, "1");
        else window.localStorage.removeItem(key);
      } catch {
        // brak dostępu do pamięci przeglądarki – zmiana obowiązuje tylko do odświeżenia
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key],
  );

  return [value, set];
}
