import Image from "next/image";
import Link from "next/link";
import { collections } from "@/data/catalog";
import { productsInCollection } from "@/lib/catalog";
import { plural } from "@/lib/format";

function Tile({ c, big }: { c: (typeof collections)[number]; big?: boolean }) {
  const n = productsInCollection(c.slug).length;
  return (
    <Link href={`/kolekcje/${c.slug}`} className="group relative block h-full">
      <div className={`studio relative overflow-hidden ${big ? "aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[40rem]" : "aspect-[4/3]"}`}>
        <Image src={`/images/products/${c.coverImage}.jpg`} alt="" fill sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="display text-4xl md:text-5xl">{c.name}</h3>
        <span className="text-sm text-muted tabular-nums">
          {n} {plural(n, "produkt", "produkty", "produktów")}
        </span>
      </div>
      <p className="mt-2 max-w-md text-sm text-muted">{c.description}</p>
    </Link>
  );
}

export function CollectionsTeaser() {
  const [first, ...rest] = collections;
  return (
    <section aria-labelledby="collections-title" className="border-t border-line py-16 md:py-24">
      <div className="wrap">
        <h2 id="collections-title" className="display text-[clamp(2.6rem,1rem+5vw,5.5rem)]">
          Kolekcje
        </h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <Tile c={first} big />
          </div>
          <div className="grid gap-10 lg:col-span-5 lg:col-start-8">
            {rest.map((c) => (
              <Tile key={c.slug} c={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
