import Link from "next/link";
import { getProduct } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";

/** Ręcznie wybrane produkty na stronę główną (slugi). Bez oznaczeń „bestseller” – to wybór, nie ranking sprzedaży. */
const FEATURED = ["core-hoodie", "parachute-cargo", "sole-boxy-crew", "wash-baggy-jeans", "track-zip-hoodie", "core-sweatpants", "earth-hoodie", "utility-cargo-straight"];

export function Featured() {
  const items = FEATURED.map(getProduct).filter((p) => p !== null);
  return (
    <section aria-labelledby="featured-title" className="border-t border-line py-16 md:py-24">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <h2 id="featured-title" className="display text-[clamp(2.6rem,1rem+5vw,5.5rem)]">
            Polecane
          </h2>
          <Link href="/sklep" className="link mb-2 shrink-0 text-sm">
            Wszystkie produkty
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
          {items.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} sizes="(min-width: 1024px) 25vw, 50vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
