"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/pricing";
import { lineSku, useShop } from "@/components/shop/ShopProvider";
import { Modal } from "@/components/ui/Modal";
import { CloseIcon } from "@/components/ui/Icons";
import { CartLineItem } from "./CartLineItem";
import { useCartValidation } from "./useCartValidation";

export function CartDrawer() {
  const { cartOpen, setCartOpen, priced, lines, subtotal, itemCount, hydrated } = useShop();
  const validation = useCartValidation(lines, cartOpen);
  const close = () => setCartOpen(false);

  const problems = validation.status === "ready" ? validation.problems : 0;

  return (
    <Modal open={cartOpen} onClose={close} labelledBy="cart-title" className="drawer">
      <div className="flex h-full flex-col">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <h2 id="cart-title" className="display-sm text-lg">
            Koszyk {hydrated && itemCount > 0 && <span className="text-muted tabular-nums">({itemCount})</span>}
          </h2>
          <button type="button" className="icon-btn -mr-2" aria-label="Zamknij koszyk" onClick={close}>
            <CloseIcon />
          </button>
        </div>

        {priced.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-5 px-5">
            <p className="display text-4xl">Koszyk jest pusty</p>
            <p className="text-muted">Dodaj bluzę albo spodnie – koszyk zapamięta je także po odświeżeniu strony.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/kategoria/bluzy" className="btn btn-light" onClick={close}>
                Bluzy
              </Link>
              <Link href="/kategoria/spodnie" className="btn btn-outline" onClick={close}>
                Spodnie
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {priced.map((line) => (
                <CartLineItem key={line.sku} line={line} compact onNavigate={close} check={validation.status === "ready" ? validation.checks.get(lineSku(line)) : undefined} />
              ))}
            </ul>
            <div className="shrink-0 border-t border-line p-5">
              <dl className="flex items-baseline justify-between">
                <dt className="text-muted">Wartość produktów</dt>
                <dd className="text-lg font-bold tabular-nums">{formatPrice(subtotal)}</dd>
              </dl>
              <p className="mt-1 text-sm text-muted">Koszt dostawy wybierzesz w kolejnym kroku.</p>
              {problems > 0 && (
                <p className="mt-3 text-sm text-danger" role="alert">
                  Popraw pozycje oznaczone powyżej, aby przejść do zamówienia.
                </p>
              )}
              <div className="mt-4 grid gap-2">
                {problems > 0 ? (
                  <button type="button" className="btn btn-light btn-block" disabled>
                    Przejdź do zamówienia
                  </button>
                ) : (
                  <Link href="/zamowienie" className="btn btn-light btn-block" onClick={close}>
                    Przejdź do zamówienia
                  </Link>
                )}
                <Link href="/koszyk" className="btn btn-outline btn-block" onClick={close}>
                  Zobacz koszyk
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
