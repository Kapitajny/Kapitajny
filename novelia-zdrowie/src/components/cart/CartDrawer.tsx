"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "./CartProvider";
import { CloseIcon, TrashIcon } from "@/components/ui/Icons";

/** Panel koszyka wysuwany z prawej strony (natywny <dialog> – fokus i Esc obsługuje przeglądarka). */
export function CartDrawer() {
  const cart = useCart();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (cart.isOpen && !dialog.open) dialog.showModal();
    if (!cart.isOpen && dialog.open) dialog.close();
  }, [cart.isOpen]);

  return (
    <dialog
      ref={ref}
      aria-label="Koszyk"
      onClose={cart.close}
      onClick={(e) => {
        if (e.target === ref.current) cart.close();
      }}
      className="fixed inset-0 m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-paper p-0 text-ink shadow-lift backdrop:bg-forest-deep/50 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
          <h2 className="text-2xl">Koszyk</h2>
          <button type="button" onClick={cart.close} className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-forest hover:bg-beige" aria-label="Zamknij koszyk">
            <CloseIcon />
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-serif text-xl text-forest">Twój koszyk jest pusty</p>
            <p className="mt-2 text-muted">Zacznij od naszego głównego e-booka.</p>
            <Link href="/sklep/zdrowiej-kazdego-dnia" onClick={cart.close} className="btn btn-primary mt-6">
              Zobacz e-book
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5 sm:px-6">
              {cart.items.map((p) => (
                <li key={p.slug} className="flex gap-4 py-5">
                  <Image src={p.cover.src} alt="" width={72} height={115} className="h-[115px] w-[72px] shrink-0 object-cover book-shadow" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="font-serif text-lg leading-snug text-forest">{p.title}</p>
                    <p className="mt-0.5 text-sm text-muted">E-book PDF</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="font-medium">{formatPrice(p.price)}</span>
                      <button type="button" onClick={() => cart.remove(p.slug)} className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm text-muted hover:text-danger" aria-label={`Usuń „${p.title}” z koszyka`}>
                        <TrashIcon size={16} /> Usuń
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line bg-cream px-5 py-5 sm:px-6">
              <div className="flex items-baseline justify-between">
                <span className="text-muted">Razem</span>
                <span className="font-serif text-2xl text-forest">{formatPrice(cart.total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Cena brutto. Produkt cyfrowy – bez kosztów dostawy.</p>
              <Link href="/koszyk" onClick={cart.close} className="btn btn-primary mt-4 w-full">
                Przejdź do zamówienia
              </Link>
              <button type="button" onClick={cart.close} className="mt-2 min-h-11 w-full text-sm text-forest underline-offset-4 hover:underline">
                Kontynuuj zakupy
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
