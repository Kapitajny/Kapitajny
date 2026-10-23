import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/catalog";
import { productsInCategory, productsInSubcategory } from "@/lib/catalog";
import { plural } from "@/lib/format";
import { ArrowIcon } from "@/components/ui/Icons";

const COVERS = {
  bluzy: { src: "/images/products/track-zip-black.jpg", alt: "Czarna rozpinana bluza z kapturem na zamek" },
  spodnie: { src: "/images/products/cargo-baggy-black.jpg", alt: "Czarne spodnie cargo baggy ze stoperami przy nogawkach" },
} as const;

export function CategoryShowcase() {
  return (
    <section aria-label="Kategorie" className="border-t border-line">
      {categories.map((category, index) => {
        const count = productsInCategory(category.slug).length;
        const cover = COVERS[category.slug];
        return (
          <div key={category.slug} className="border-b border-line">
            <div className="wrap grid gap-8 py-14 md:py-20 lg:grid-cols-12 lg:gap-12">
              <Link
                href={`/kategoria/${category.slug}`}
                className={`studio group relative block aspect-[4/5] overflow-hidden lg:col-span-5 ${index % 2 ? "lg:order-2 lg:col-start-8" : ""}`}
                tabIndex={-1}
                aria-hidden="true"
              >
                <Image src={cover.src} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </Link>
              <div className={`flex flex-col lg:col-span-7 ${index % 2 ? "lg:order-1" : ""}`}>
                <div className="flex items-end justify-between gap-6">
                  <h2 className="display text-[clamp(3.5rem,1rem+9vw,9rem)]">
                    <Link href={`/kategoria/${category.slug}`} className="hover:underline hover:decoration-4 hover:underline-offset-8">
                      {category.name}
                    </Link>
                  </h2>
                  <p className="mb-2 shrink-0 text-sm text-muted tabular-nums">
                    {count} {plural(count, "produkt", "produkty", "produktów")}
                  </p>
                </div>
                <p className="mt-6 max-w-lg text-muted">{category.description}</p>
                <ul className="mt-10 border-t border-line lg:mt-auto">
                  {category.subcategories.map((sub) => {
                    const n = productsInSubcategory(category.slug, sub.slug).length;
                    return (
                      <li key={sub.slug} className="border-b border-line">
                        <Link href={`/kategoria/${category.slug}/${sub.slug}`} className="group flex items-center gap-4 py-4 transition-colors hover:bg-graphite md:py-5">
                          <span className="display-sm flex-1 text-xl md:text-2xl">{sub.name}</span>
                          <span className="text-sm text-muted tabular-nums">{n}</span>
                          <ArrowIcon size={20} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-paper" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
