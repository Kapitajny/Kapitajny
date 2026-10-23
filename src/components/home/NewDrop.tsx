import Link from "next/link";
import { latestDrop, newArrivals } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { ProductCard } from "@/components/catalog/ProductCard";

export function NewDrop() {
  const items = newArrivals();
  return (
    <section aria-labelledby="drop-title" className="py-16 md:py-24">
      <div className="wrap flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="drop-title" className="display text-[clamp(2.6rem,1rem+5vw,5.5rem)]">
            Nowa kolekcja
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            {latestDrop.name}: {items.length} modeli w sklepie od {formatDate(latestDrop.date)}. Duży i mały znak buta, tonalne nadruki i najszersze spodnie, jakie mamy.
          </p>
        </div>
        <Link href="/nowosci" className="btn btn-outline shrink-0 self-start md:self-auto">
          Wszystkie nowości
        </Link>
      </div>
      <div className="wrap mt-10">
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:-mx-8 md:gap-5 md:px-8 xl:-mx-12 xl:px-12" aria-label="Produkty z nowej kolekcji">
          {items.map((product) => (
            <li key={product.id} className="w-[68vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[22vw]">
              <ProductCard product={product} sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 68vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
