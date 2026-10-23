"use client";

import { useEffect, useMemo, useState } from "react";
import { lineSku, type CartLine } from "@/components/shop/ShopProvider";

export interface LineCheck {
  ok: boolean;
  available: number;
  error?: string;
}

export type CartValidation =
  | { status: "idle" | "loading" }
  | { status: "ready"; checks: Map<string, LineCheck>; problems: number }
  | { status: "error" };

/**
 * Sprawdza koszyk na serwerze (/api/cart/validate): istnienie produktów i aktualną dostępność.
 * Wynik służy do ostrzeżeń przy pozycjach – ostateczną weryfikację i tak robi /api/checkout.
 */
export function useCartValidation(lines: CartLine[], enabled = true): CartValidation {
  const key = useMemo(() => JSON.stringify(lines.map((l) => [l.productId, l.color, l.size, l.quantity])), [lines]);
  const [result, setResult] = useState<{ key: string; value: CartValidation }>({ key: "", value: { status: "idle" } });

  useEffect(() => {
    if (!enabled || lines.length === 0) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines }),
        signal: controller.signal,
        cache: "no-store",
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((data: { lines: ({ ok: true; sku: string; available: number } | { ok: false; error: string })[] }) => {
          const checks = new Map<string, LineCheck>();
          let problems = 0;
          data.lines.forEach((check, i) => {
            const line = lines[i];
            if (!line) return;
            const sku = lineSku(line);
            if (!check.ok) {
              checks.set(sku, { ok: false, available: 0, error: check.error });
              problems++;
            } else {
              const ok = check.available >= line.quantity;
              if (!ok) problems++;
              checks.set(sku, { ok, available: check.available });
            }
          });
          setResult({ key, value: { status: "ready", checks, problems } });
        })
        .catch((error) => {
          if (error?.name !== "AbortError") setResult({ key, value: { status: "error" } });
        });
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
    // `key` opisuje zawartość koszyka – `lines` zmienia referencję przy każdej zmianie stanu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  if (!enabled || lines.length === 0) return { status: "idle" };
  return result.key === key ? result.value : { status: "loading" };
}
