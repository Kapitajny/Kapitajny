"use client";

import { useSyncExternalStore } from "react";
import { clampQty, countItems, sanitizeLines, type CartLine } from "@/lib/order";

/*
 * Koszyk żyje w localStorage przeglądarki – projekt demonstracyjny nie ma serwera zamówień.
 * Zewnętrzny magazyn + useSyncExternalStore: serwer renderuje pusty koszyk, a po hydracji
 * komponenty dostają stan z przeglądarki bez ostrzeżeń o niezgodności.
 */

const STORAGE_KEY = "wies-sokow:koszyk:v1";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeLines(JSON.parse(raw)) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function commit(next: CartLine[]) {
  lines = next.length ? next : EMPTY;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Brak dostępu do localStorage (np. tryb prywatny) – koszyk działa do zamknięcia karty.
  }
  emit();
}

function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  lines = readStorage();
  emit();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): CartLine[] {
  if (!loaded) {
    loaded = true;
    lines = readStorage();
  }
  return lines;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

export const cart = {
  add(slug: string, qty = 1) {
    const current = getSnapshot();
    const existing = current.find((line) => line.slug === slug);
    commit(
      existing
        ? current.map((line) => (line.slug === slug ? { slug, qty: clampQty(line.qty + qty) } : line))
        : [...current, { slug, qty: clampQty(qty) }],
    );
  },
  setQty(slug: string, qty: number) {
    commit(getSnapshot().map((line) => (line.slug === slug ? { slug, qty: clampQty(qty) } : line)));
  },
  remove(slug: string) {
    commit(getSnapshot().filter((line) => line.slug !== slug));
  },
  clear() {
    commit(EMPTY);
  },
};

export function useCartLines(): CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCartCount(): number {
  return countItems(useCartLines());
}

/** false na serwerze i w trakcie hydracji, true gdy widok pokazuje już stan z przeglądarki. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/* ---------- wysuwany panel koszyka ---------- */

let drawerOpen = false;
const drawerListeners = new Set<() => void>();

export const cartDrawer = {
  open() {
    if (drawerOpen) return;
    drawerOpen = true;
    for (const listener of drawerListeners) listener();
  },
  close() {
    if (!drawerOpen) return;
    drawerOpen = false;
    for (const listener of drawerListeners) listener();
  },
};

export function useCartDrawerOpen(): boolean {
  return useSyncExternalStore(
    (listener) => {
      drawerListeners.add(listener);
      return () => drawerListeners.delete(listener);
    },
    () => drawerOpen,
    () => false,
  );
}
