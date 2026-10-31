"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, MAX_CART_ITEMS, type Product } from "@/data/products";

/**
 * Koszyk – lista publikacji (każda raz, to produkty cyfrowe), zapisywana w localStorage przeglądarki.
 * Ceny są zawsze brane z katalogu; serwer i tak przelicza kwotę przed płatnością.
 */

const STORAGE_KEY = "novelia-cart-v1";

interface CartContextValue {
  hydrated: boolean;
  items: Product[];
  count: number;
  total: number;
  isOpen: boolean;
  available: Record<string, boolean>;
  has: (slug: string) => boolean;
  add: (slug: string, options?: { open?: boolean }) => boolean;
  remove: (slug: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(available: Record<string, boolean>): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(data)) return [];
    return [...new Set(data.filter((s): s is string => typeof s === "string" && !!getProduct(s) && available[s] !== false))].slice(0, MAX_CART_ITEMS);
  } catch {
    return [];
  }
}

export function CartProvider({ children, available }: { children: ReactNode; available: Record<string, boolean> }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    // Odczyt stanu zapisanego w przeglądarce – możliwy dopiero po zamontowaniu komponentu.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlugs(readStorage(available));
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSlugs(readStorage(available));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [available]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      /* tryb prywatny / zablokowany storage – koszyk działa do odświeżenia strony */
    }
  }, [slugs, hydrated]);

  const add = useCallback(
    (slug: string, options?: { open?: boolean }) => {
      if (!getProduct(slug) || available[slug] === false) return false;
      setSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug].slice(0, MAX_CART_ITEMS)));
      if (options?.open !== false) setOpen(true);
      return true;
    },
    [available],
  );
  const remove = useCallback((slug: string) => setSlugs((prev) => prev.filter((s) => s !== slug)), []);
  const clear = useCallback(() => setSlugs([]), []);

  const value = useMemo<CartContextValue>(() => {
    const items = slugs.map((s) => getProduct(s)!).filter(Boolean);
    return {
      hydrated,
      items,
      count: items.length,
      total: items.reduce((sum, p) => sum + p.price, 0),
      isOpen,
      available,
      has: (slug) => slugs.includes(slug),
      add,
      remove,
      clear,
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
  }, [slugs, hydrated, isOpen, available, add, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart musi być użyty wewnątrz CartProvider");
  return ctx;
}
