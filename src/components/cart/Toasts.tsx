"use client";

import { CloseIcon } from "@/components/ui/Icons";
import { useCart } from "./CartProvider";

/** Komunikaty o dodaniu do koszyka – ogłaszane czytnikom ekranu przez region aria-live. */
export function Toasts() {
  const { toasts, dismissToast, openCart } = useCart();
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-full max-w-md items-center gap-4 rounded-2xl bg-roast px-5 py-4 text-paper shadow-[var(--shadow-lift)] motion-safe:animate-[toast-in_320ms_var(--ease-soft)]"
        >
          <div className="min-w-0 flex-1">
            <p className="font-medium">{toast.message}</p>
            {toast.detail && <p className="mt-0.5 truncate text-sm text-paper/65">{toast.detail}</p>}
          </div>
          {toast.showCartAction && (
            <button
              type="button"
              onClick={() => {
                dismissToast(toast.id);
                openCart();
              }}
              className="shrink-0 rounded-full border border-paper/30 px-3 py-1.5 text-sm transition-colors hover:bg-paper/10"
            >
              Zobacz koszyk
            </button>
          )}
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="-mr-1 shrink-0 rounded-full p-1 text-paper/60 hover:text-paper"
            aria-label="Zamknij powiadomienie"
          >
            <CloseIcon size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
