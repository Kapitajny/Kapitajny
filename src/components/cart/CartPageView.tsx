"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/pricing";
import { SHIPPING_METHODS } from "@/data/shipping";
import { lineSku, useShop } from "@/components/shop/ShopProvider";
import { CartLineItem } from "./CartLineItem";
import { useCartValidation } from "./useCartValidation";

export function CartPageView() {
  const { priced, lines, subtotal, itemCount, hydrated, clearCart } = useShop();
  const validation = useCartValidation(lines);
  const problems = validation.status === "ready" ? validation.problems : 0;
  const cheapest = Math.min(...SHIPPING_METHODS.map((m) => m.price));

  if (!hydrated) {
    return <p className="py-16 text-muted">Wczytywanie koszyka…</p>;
  }

  if (priced.length === 0) {
    return (
      <div className="border border-line px-6 py-20 text-center">
        <p className="display text-4xl md:text-6xl">Koszyk jest pusty</p>
        <p className="mx-auto mt-4 max-w-md text-muted">Wybierz bluzę albo spodnie – zawartość koszyka zostanie zapamiętana w tej przeglądarce.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/kategoria/bluzy" className="btn btn-light">
            Odkryj bluzy
          </Link>
          <Link href="/kategoria/spodnie" className="btn btn-outline">
            Odkryj spodnie
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <ul className="divide-y divide-line border-y border-line">
          {priced.map((line) => (
            <CartLineItem key={line.sku} line={line} check={validation.status === "ready" ? validation.checks.get(lineSku(line)) : undefined} />
          ))}
        </ul>
        <button type="button" className="mt-5 text-sm text-muted underline underline-offset-2 hover:text-paper" onClick={clearCart}>
          Wyczyść koszyk
        </button>
      </div>
      <aside className="lg:col-span-4 lg:col-start-9" aria-label="Podsumowanie koszyka">
        <div className="border border-line bg-graphite p-6 lg:sticky lg:top-28">
          <h2 className="display-sm text-xl">Podsumowanie</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Produkty ({itemCount} szt.)</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Dostawa</dt>
              <dd className="text-muted">od {formatPrice(cheapest)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
              <dt>Razem bez dostawy</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          {validation.status === "error" && <p className="mt-4 text-sm text-muted">Nie udało się sprawdzić dostępności – zrobimy to przy składaniu zamówienia.</p>}
          {problems > 0 && (
            <p className="mt-4 text-sm text-danger" role="alert">
              {problems === 1 ? "Jedna pozycja wymaga poprawy" : `${problems} pozycje wymagają poprawy`} – zmień rozmiar, ilość albo usuń produkt.
            </p>
          )}
          {problems > 0 ? (
            <button type="button" className="btn btn-light btn-block mt-6" disabled>
              Przejdź do zamówienia
            </button>
          ) : (
            <Link href="/zamowienie" className="btn btn-light btn-block mt-6">
              Przejdź do zamówienia
            </Link>
          )}
          <Link href="/sklep" className="btn btn-outline btn-block mt-2">
            Kontynuuj zakupy
          </Link>
        </div>
      </aside>
    </div>
  );
}
