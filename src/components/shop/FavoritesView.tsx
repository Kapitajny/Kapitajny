"use client";

import Link from "next/link";
import { getProductById } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useShop } from "./ShopProvider";
import { useAllStock } from "./useLiveStock";

export function FavoritesView() {
  const { favorites, hydrated } = useShop();
  const stock = useAllStock();
  if (!hydrated) return <p className="py-16 text-muted">Wczytywanie…</p>;
  const items = favorites.map(getProductById).filter((p) => p !== null);

  if (items.length === 0) {
    return (
      <div className="border border-line px-6 py-20 text-center">
        <p className="display text-4xl md:text-5xl">Nic tu jeszcze nie ma</p>
        <p className="mx-auto mt-4 max-w-md text-muted">Kliknij serce przy produkcie, żeby go tu zapisać. Lista jest przechowywana w tej przeglądarce.</p>
        <Link href="/sklep" className="btn btn-light mt-8">
          Przeglądaj produkty
        </Link>
      </div>
    );
  }
  return (
    <>
      <p className="mb-8 text-sm text-muted">Lista ulubionych jest zapisana w tej przeglądarce – na innym urządzeniu będzie pusta.</p>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
        {items.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} availability={stock?.[product.id]} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" />
          </li>
        ))}
      </ul>
    </>
  );
}
