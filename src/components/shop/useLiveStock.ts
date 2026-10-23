"use client";

import { useEffect, useState } from "react";
import type { Size } from "@/data/catalog";

export type Availability = Record<string, Record<Size, number>>;

/**
 * Aktualna dostępność wariantów produktu z serwera (/api/stock).
 * Do czasu odpowiedzi (albo przy błędzie sieci) komponent korzysta ze stanu z katalogu.
 */
export function useLiveStock(productId: string): { availability: Availability | null; error: boolean } {
  const [state, setState] = useState<{ id: string; availability: Availability | null; error: boolean }>({ id: productId, availability: null, error: false });

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/stock?product=${encodeURIComponent(productId)}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: { availability: Availability }) => {
        if (!cancelled) setState({ id: productId, availability: data.availability, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ id: productId, availability: null, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  return state.id === productId ? { availability: state.availability, error: state.error } : { availability: null, error: false };
}

export type AllAvailability = Record<string, Availability>;

let allStockPromise: Promise<AllAvailability> | null = null;
let allStockFetchedAt = 0;

function fetchAllStock(): Promise<AllAvailability> {
  // Wynik współdzielony przez wszystkie listy na stronie; odświeżany co minutę.
  if (!allStockPromise || Date.now() - allStockFetchedAt > 60_000) {
    allStockFetchedAt = Date.now();
    allStockPromise = fetch("/api/stock", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { products: AllAvailability }) => data.products)
      .catch((error) => {
        allStockPromise = null;
        throw error;
      });
  }
  return allStockPromise;
}

/** Aktualna dostępność wszystkich produktów (lub `null`, dopóki nie przyjdzie odpowiedź). */
export function useAllStock(): AllAvailability | null {
  const [stock, setStock] = useState<AllAvailability | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetchAllStock()
      .then((data) => {
        if (!cancelled) setStock(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return stock;
}
