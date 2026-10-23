"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { skuOf } from "@/lib/catalog";
import { ORDER_LIMITS, priceLine, type PricedLine } from "@/lib/pricing";

/**
 * Stan sklepu po stronie przeglądarki: koszyk i ulubione (localStorage, synchronizacja między kartami),
 * panel koszyka oraz krótkie powiadomienia. Ceny zawsze liczone z katalogu – w pamięci trzymamy tylko wybór klienta.
 */

const CART_KEY = "kp-cart-v1";
const FAVORITES_KEY = "kp-favorites-v1";

export interface CartLine {
  productId: string;
  color: string;
  size: string;
  quantity: number;
}

export const lineSku = (line: Pick<CartLine, "productId" | "color" | "size">) => skuOf(line.productId, line.color, line.size);

type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: CartLine }
  | { type: "set-quantity"; sku: string; quantity: number }
  | { type: "change-variant"; sku: string; color: string; size: string }
  | { type: "remove"; sku: string }
  | { type: "clear" };

function sanitize(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const lines: CartLine[] = [];
  for (const item of raw) {
    const priced = priceLine(item);
    if (!priced.ok) continue;
    const { productId, color, size, quantity } = priced.line;
    if (lines.some((l) => lineSku(l) === priced.line.sku)) continue;
    lines.push({ productId, color, size, quantity });
  }
  return lines.slice(0, ORDER_LIMITS.maxLinesPerOrder);
}

function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const sku = lineSku(action.line);
      const existing = state.find((l) => lineSku(l) === sku);
      if (existing) {
        const quantity = Math.min(existing.quantity + action.line.quantity, ORDER_LIMITS.maxQuantityPerLine);
        return state.map((l) => (l === existing ? { ...l, quantity } : l));
      }
      return [...state, { ...action.line, quantity: Math.min(action.line.quantity, ORDER_LIMITS.maxQuantityPerLine) }];
    }
    case "set-quantity":
      return state.map((l) => (lineSku(l) === action.sku ? { ...l, quantity: Math.max(1, Math.min(action.quantity, ORDER_LIMITS.maxQuantityPerLine)) } : l));
    case "change-variant": {
      const line = state.find((l) => lineSku(l) === action.sku);
      if (!line) return state;
      const updated = { ...line, color: action.color, size: action.size };
      const target = state.find((l) => l !== line && lineSku(l) === lineSku(updated));
      if (target) {
        // Ten wariant już jest w koszyku – łączymy pozycje.
        const quantity = Math.min(target.quantity + line.quantity, ORDER_LIMITS.maxQuantityPerLine);
        return state.filter((l) => l !== line).map((l) => (l === target ? { ...l, quantity } : l));
      }
      return state.map((l) => (l === line ? updated : l));
    }
    case "remove":
      return state.filter((l) => lineSku(l) !== action.sku);
    case "clear":
      return [];
  }
}

function readStorage(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Pamięć przeglądarki niedostępna (tryb prywatny) – koszyk działa do odświeżenia strony.
  }
}

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; href: string };
}

export type AddResult = "added" | "limit";

interface ShopContextValue {
  hydrated: boolean;
  lines: CartLine[];
  priced: PricedLine[];
  itemCount: number;
  subtotal: number;
  addToCart: (line: CartLine) => AddResult;
  setQuantity: (sku: string, quantity: number) => void;
  changeVariant: (sku: string, color: string, size: string) => void;
  removeLine: (sku: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  favorites: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string, name?: string) => void;
  toasts: Toast[];
  notify: (message: string, action?: Toast["action"]) => void;
  dismissToast: (id: number) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const skipWrite = useRef(true);

  // Odczyt z pamięci przeglądarki po zamontowaniu + synchronizacja między kartami.
  useEffect(() => {
    const load = () => {
      skipWrite.current = true;
      dispatch({ type: "hydrate", lines: sanitize(readStorage(CART_KEY)) });
      const fav = readStorage(FAVORITES_KEY);
      setFavorites(Array.isArray(fav) ? fav.filter((id): id is string => typeof id === "string").slice(0, 100) : []);
    };
    load();
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_KEY || event.key === FAVORITES_KEY) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipWrite.current) {
      skipWrite.current = false;
      return;
    }
    writeStorage(CART_KEY, lines);
  }, [lines, hydrated]);

  const notify = useCallback((message: string, action?: Toast["action"]) => {
    const id = ++toastId.current;
    setToasts((list) => [...list.slice(-2), { id, message, action }]);
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4500);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const priced = useMemo(() => lines.flatMap((l) => {
    const result = priceLine(l);
    return result.ok ? [result.line] : [];
  }), [lines]);

  const addToCart = useCallback(
    (line: CartLine): AddResult => {
      const existing = lines.find((l) => lineSku(l) === lineSku(line));
      if (existing && existing.quantity >= ORDER_LIMITS.maxQuantityPerLine) return "limit";
      if (!existing && lines.length >= ORDER_LIMITS.maxLinesPerOrder) return "limit";
      dispatch({ type: "add", line });
      return "added";
    },
    [lines],
  );

  const toggleFavorite = useCallback(
    (productId: string, name?: string) => {
      setFavorites((current) => {
        const next = current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId];
        writeStorage(FAVORITES_KEY, next);
        return next;
      });
      if (name) {
        const adding = !favorites.includes(productId);
        notify(adding ? `${name} – dodano do ulubionych` : `${name} – usunięto z ulubionych`, adding ? { label: "Ulubione", href: "/ulubione" } : undefined);
      }
    },
    [favorites, notify],
  );

  const value = useMemo<ShopContextValue>(
    () => ({
      hydrated,
      lines,
      priced,
      itemCount: priced.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: priced.reduce((sum, l) => sum + l.lineTotal, 0),
      addToCart,
      setQuantity: (sku, quantity) => dispatch({ type: "set-quantity", sku, quantity }),
      changeVariant: (sku, color, size) => dispatch({ type: "change-variant", sku, color, size }),
      removeLine: (sku) => dispatch({ type: "remove", sku }),
      clearCart: () => dispatch({ type: "clear" }),
      cartOpen,
      setCartOpen,
      favorites,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite,
      toasts,
      notify,
      dismissToast,
    }),
    [hydrated, lines, priced, addToCart, cartOpen, favorites, toggleFavorite, toasts, notify, dismissToast],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop musi być użyty wewnątrz <ShopProvider>.");
  return context;
}
