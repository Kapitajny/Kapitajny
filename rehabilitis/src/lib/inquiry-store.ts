"use client";

import { useSyncExternalStore } from "react";

/**
 * Usługa wybrana przyciskiem „Zapytaj o wizytę” – formularz kontaktowy podstawia ją automatycznie.
 * Prosty magazyn w pamięci strony (bez parametrów w adresie, aby strona pozostała w pełni statyczna).
 */
let selected: { slug: string; at: number } | null = null;
const listeners = new Set<() => void>();

export function selectService(slug: string) {
  selected = { slug, at: Date.now() };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSelectedService() {
  return useSyncExternalStore(
    subscribe,
    () => selected,
    () => null,
  );
}
