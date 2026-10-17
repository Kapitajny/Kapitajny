"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getProduct } from "@/data/menu";
import { LOCATIONS } from "@/data/locations";
import { formatPrice } from "@/lib/pricing";
import { ArrowRightIcon, CloseIcon, PinIcon, TrashIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { Photo } from "@/components/ui/Photo";
import { useCart } from "./CartProvider";
import { QuantityStepper } from "./QuantityStepper";

export function CartDrawer() {
  const cart = useCart();
  const pathname = usePathname();
  const onCheckout = pathname === "/zamowienie";

  return (
    <Modal open={cart.cartOpen} onClose={cart.closeCart} labelledBy="cart-title" className="sheet-right">
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 id="cart-title" className="text-2xl">
              Twoje zamówienie
            </h2>
            <p className="mt-1 text-sm text-muted">{cart.itemCount === 0 ? "Koszyk jest pusty" : `${cart.itemCount} ${pluralize(cart.itemCount)}`}</p>
          </div>
          <button type="button" onClick={cart.closeCart} className="-mr-2 rounded-full p-2 transition-colors hover:bg-sand" aria-label="Zamknij koszyk">
            <CloseIcon />
          </button>
        </header>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-serif text-3xl leading-tight text-roast">
              Koszyk czeka
              <br />
              <em>na pierwszą kawę.</em>
            </p>
            <p className="mt-4 max-w-xs text-muted">Zajrzyj do menu – każdą kawę możesz dopasować do siebie i odebrać w wybranym lokalu.</p>
            <Link href="/#menu" onClick={cart.closeCart} className="btn btn-primary mt-8">
              Przeglądaj menu
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6" aria-label="Produkty w koszyku">
              {cart.lines.map((line) => {
                const product = getProduct(line.productId);
                return (
                  <li key={line.key} className="flex gap-4 py-5">
                    <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-md">
                      {product && <Photo image={product.image} sizes="64px" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-lg leading-tight text-roast">{line.name}</p>
                          {line.optionLabels.length > 0 && <p className="mt-1 text-xs leading-relaxed text-muted">{line.optionLabels.join(" · ")}</p>}
                        </div>
                        <p className="shrink-0 font-medium tabular-nums">{formatPrice(line.lineTotal)}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <QuantityStepper size="sm" value={line.quantity} onChange={(q) => cart.setQuantity(line.key, q)} label={`Ilość: ${line.name}`} />
                        <span className="text-xs text-muted tabular-nums">{formatPrice(line.unitPrice)} / szt.</span>
                        <button
                          type="button"
                          onClick={() => cart.removeItem(line.key)}
                          className="rounded-full p-2 text-muted transition-colors hover:bg-sand hover:text-danger"
                          aria-label={`Usuń ${line.name} z koszyka`}
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t border-line bg-cream/60 px-6 pb-6 pt-5">
              <label htmlFor="cart-location" className="mb-2 flex items-center gap-2 text-sm font-medium text-roast">
                <PinIcon size={16} /> Miejsce odbioru
              </label>
              <select
                id="cart-location"
                className="field-input text-sm"
                value={cart.locationId ?? ""}
                onChange={(e) => cart.setLocation(e.target.value || null)}
              >
                <option value="">Wybierz lokal…</option>
                {LOCATIONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} – {l.street}
                  </option>
                ))}
              </select>

              <div className="mt-5 flex items-baseline justify-between">
                <span className="text-muted">Razem</span>
                <span className="font-serif text-3xl text-roast tabular-nums">{formatPrice(cart.total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Ceny brutto. Płatność online przy składaniu zamówienia, odbiór osobisty w lokalu.</p>

              {onCheckout ? (
                <button type="button" onClick={cart.closeCart} className="btn btn-primary mt-5 w-full">
                  Wróć do zamówienia <ArrowRightIcon size={18} />
                </button>
              ) : (
                <Link href="/zamowienie" onClick={cart.closeCart} className="btn btn-primary mt-5 w-full">
                  Przejdź do zamówienia <ArrowRightIcon size={18} />
                </Link>
              )}
            </footer>
          </>
        )}
      </div>
    </Modal>
  );
}

function pluralize(count: number): string {
  if (count === 1) return "napój";
  const lastTwo = count % 100;
  const last = count % 10;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return "napoje";
  return "napojów";
}
