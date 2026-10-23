"use client";

import Link from "next/link";
import { CloseIcon } from "@/components/ui/Icons";
import { useShop } from "./ShopProvider";

/** Krótkie potwierdzenia akcji (dodanie do koszyka, ulubione) – ogłaszane czytnikom ekranu. */
export function Toasts() {
  const { toasts, dismissToast } = useShop();
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 md:items-end md:p-6">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto flex w-full max-w-sm items-center gap-3 border border-line bg-paper py-2 pl-4 pr-2 text-sm text-ink shadow-2xl">
          <p className="flex-1 font-medium">{toast.message}</p>
          {toast.action && (
            <Link href={toast.action.href} className="shrink-0 font-bold underline underline-offset-2" onClick={() => dismissToast(toast.id)}>
              {toast.action.label}
            </Link>
          )}
          <button type="button" className="grid h-9 w-9 shrink-0 place-items-center hover:bg-black/5" aria-label="Zamknij powiadomienie" onClick={() => dismissToast(toast.id)}>
            <CloseIcon size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
