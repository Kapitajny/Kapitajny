"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { getProduct } from "@/data/menu";
import { getLocation } from "@/data/locations";
import { ORDER_LIMITS, priceLine, type OptionSelection, type PricedLine } from "@/lib/pricing";

/* ------------------------------------------------------------------------------------------------
 * Stan koszyka – zapisywany w localStorage przeglądarki, przeliczany zawsze z aktualnego katalogu.
 * ---------------------------------------------------------------------------------------------- */

const STORAGE_KEY = "noir-cart-v1";

interface StoredLine {
  productId: string;
  options: OptionSelection;
  quantity: number;
}

interface CartState {
  lines: StoredLine[];
  locationId: string | null;
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; lines: StoredLine[]; locationId: string | null }
  | { type: "add"; line: StoredLine }
  | { type: "setQuantity"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "setLocation"; locationId: string | null };

function keyOf(line: StoredLine): string | null {
  const result = priceLine({ ...line, quantity: 1 });
  return result.ok ? result.line.key : null;
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, locationId: action.locationId, hydrated: true };
    case "add": {
      const key = keyOf(action.line);
      if (!key) return state;
      const index = state.lines.findIndex((l) => keyOf(l) === key);
      if (index >= 0) {
        const lines = [...state.lines];
        lines[index] = { ...lines[index], quantity: Math.min(ORDER_LIMITS.maxQuantityPerLine, lines[index].quantity + action.line.quantity) };
        return { ...state, lines };
      }
      if (state.lines.length >= ORDER_LIMITS.maxLinesPerOrder) return state;
      return { ...state, lines: [...state.lines, action.line] };
    }
    case "setQuantity": {
      const quantity = Math.max(1, Math.min(ORDER_LIMITS.maxQuantityPerLine, Math.round(action.quantity)));
      return { ...state, lines: state.lines.map((l) => (keyOf(l) === action.key ? { ...l, quantity } : l)) };
    }
    case "remove":
      return { ...state, lines: state.lines.filter((l) => keyOf(l) !== action.key) };
    case "clear":
      return { ...state, lines: [] };
    case "setLocation":
      return { ...state, locationId: action.locationId };
  }
}

/** Odczyt z localStorage z odrzuceniem pozycji, których nie ma już w menu. */
function readStorage(): { lines: StoredLine[]; locationId: string | null; dropped: number } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lines: [], locationId: null, dropped: 0 };
    const data = JSON.parse(raw) as { lines?: unknown; locationId?: unknown };
    const candidates = Array.isArray(data.lines) ? (data.lines as StoredLine[]) : [];
    const lines = candidates.filter((l) => l && getProduct(l.productId) && priceLine(l).ok).slice(0, ORDER_LIMITS.maxLinesPerOrder);
    const locationId = getLocation(data.locationId)?.id ?? null;
    return { lines, locationId, dropped: candidates.length - lines.length };
  } catch {
    return { lines: [], locationId: null, dropped: 0 };
  }
}

/* ------------------------------------------------------------------------------------------------
 * Kontekst
 * ---------------------------------------------------------------------------------------------- */

export interface Toast {
  id: number;
  message: string;
  detail?: string;
  showCartAction?: boolean;
}

interface CartContextValue {
  hydrated: boolean;
  lines: PricedLine[];
  itemCount: number;
  total: number;
  locationId: string | null;
  canAddMore: boolean;
  addItem: (productId: string, options: OptionSelection, quantity?: number) => boolean;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  setLocation: (locationId: string | null) => void;
  // Interfejs
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  customizingProductId: string | null;
  openCustomizer: (productId: string) => void;
  closeCustomizer: () => void;
  toasts: Toast[];
  notify: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], locationId: null, hydrated: false });
  const [cartOpen, setCartOpen] = useState(false);
  const [customizingProductId, setCustomizingProductId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const notify = useCallback((toast: Omit<Toast, "id">) => {
    const id = ++toastId.current;
    setToasts((current) => [...current.slice(-2), { ...toast, id }]);
    window.setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), 4500);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((current) => current.filter((t) => t.id !== id)), []);

  // Odczyt po zamontowaniu (localStorage nie istnieje podczas renderowania na serwerze).
  useEffect(() => {
    const stored = readStorage();
    dispatch({ type: "hydrate", lines: stored.lines, locationId: stored.locationId });
    if (stored.dropped > 0) {
      notify({ message: "Zaktualizowaliśmy Twój koszyk", detail: "Część produktów nie jest już dostępna w menu." });
    }
    // Synchronizacja między kartami przeglądarki.
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = readStorage();
      dispatch({ type: "hydrate", lines: next.lines, locationId: next.locationId });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [notify]);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines: state.lines, locationId: state.locationId }));
    } catch {
      // Tryb prywatny / brak miejsca – koszyk działa dalej, tylko bez zapamiętywania.
    }
  }, [state]);

  const priced = useMemo(() => {
    const lines: PricedLine[] = [];
    for (const line of state.lines) {
      const result = priceLine(line);
      if (result.ok) lines.push(result.line);
    }
    return {
      lines,
      itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
      total: lines.reduce((sum, l) => sum + l.lineTotal, 0),
    };
  }, [state.lines]);

  const canAddMore = priced.itemCount < ORDER_LIMITS.maxItemsPerOrder;

  const addItem = useCallback(
    (productId: string, options: OptionSelection, quantity = 1) => {
      const result = priceLine({ productId, options, quantity });
      if (!result.ok) {
        notify({ message: "Nie udało się dodać produktu", detail: result.error });
        return false;
      }
      if (priced.itemCount + quantity > ORDER_LIMITS.maxItemsPerOrder) {
        notify({ message: "Osiągnięto limit zamówienia", detail: `Jedno zamówienie może zawierać do ${ORDER_LIMITS.maxItemsPerOrder} napojów.` });
        return false;
      }
      const exists = priced.lines.some((l) => l.key === result.line.key);
      if (!exists && priced.lines.length >= ORDER_LIMITS.maxLinesPerOrder) {
        notify({ message: "Osiągnięto limit pozycji", detail: "Zmień ilość istniejącej pozycji zamiast dodawać nową." });
        return false;
      }
      dispatch({ type: "add", line: { productId, options: result.line.options, quantity } });
      notify({
        message: `Dodano: ${result.line.name}${quantity > 1 ? ` × ${quantity}` : ""}`,
        detail: result.line.optionLabels.join(" · "),
        showCartAction: true,
      });
      return true;
    },
    [notify, priced.itemCount, priced.lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      hydrated: state.hydrated,
      ...priced,
      locationId: state.locationId,
      canAddMore,
      addItem,
      setQuantity: (key, quantity) => dispatch({ type: "setQuantity", key, quantity }),
      removeItem: (key) => dispatch({ type: "remove", key }),
      clearCart: () => dispatch({ type: "clear" }),
      setLocation: (locationId) => dispatch({ type: "setLocation", locationId }),
      cartOpen,
      openCart: () => {
        setCustomizingProductId(null);
        setCartOpen(true);
      },
      closeCart: () => setCartOpen(false),
      customizingProductId,
      openCustomizer: (productId) => setCustomizingProductId(productId),
      closeCustomizer: () => setCustomizingProductId(null),
      toasts,
      notify,
      dismissToast,
    }),
    [state.hydrated, state.locationId, priced, canAddMore, addItem, cartOpen, customizingProductId, toasts, notify, dismissToast],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
