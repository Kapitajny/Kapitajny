import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { collections } from "@/data/catalog";
import { productsInCollection } from "@/lib/catalog";
import { plural } from "@/lib/format";
import { Breadcrumbs } from "@/components/catalog/CatalogPage";

export const metadata: Metadata = {
  title: "Kolekcje",
  description: "Mono, Sole i Earth – bluzy i spodnie pogrupowane według kolorów i nadruków.",
  alternates: { canonical: "/kolekcje" },
};

export default function CollectionsPage() {
  return (
    <div className="wrap pb-24 pt-8 md:pt-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Strona główna" },
          { href: "/kolekcje", label: "Kolekcje" },
        ]}
      />
      <h1 className="display mt-6 text-[clamp(3rem,1rem+8vw,8.5rem)]">Kolekcje</h1>
      <p className="mt-6 max-w-lg text-muted">Produkty pogrupowane według palety i nadruków. Każdy model może należeć do więcej niż jednej kolekcji.</p>
      <ul className="mt-12 grid gap-12 md:grid-cols-3 md:gap-5">
        {collections.map((c, i) => {
          const items = productsInCollection(c.slug);
          return (
            <li key={c.slug} className={i === 1 ? "md:mt-24" : undefined}>
              <Link href={`/kolekcje/${c.slug}`} className="group block">
                <div className="studio relative aspect-[4/5] overflow-hidden">
                  <Image src={`/images/products/${c.coverImage}.jpg`} alt="" fill preload={i === 0} sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h2 className="display text-5xl">{c.name}</h2>
                  <span className="text-sm text-muted">
                    {items.length} {plural(items.length, "produkt", "produkty", "produktów")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{c.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
