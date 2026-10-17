import Link from "next/link";
import { POPULAR_PRODUCTS } from "@/data/menu";
import { formatPrice } from "@/lib/pricing";
import { CustomizeButton, QuickAddButton } from "@/components/cart/AddToCartButton";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "./SectionHeading";

/** Różne proporcje i przesunięcia kart – rytm jak na rozkładówce, a nie siatka identycznych kafli. */
const LAYOUT = [
  { aspect: "aspect-[4/5]", offset: "" },
  { aspect: "aspect-[3/4]", offset: "lg:mt-24" },
  { aspect: "aspect-[4/5]", offset: "lg:mt-8" },
  { aspect: "aspect-[3/4]", offset: "lg:mt-32" },
];

export function PopularCoffees() {
  return (
    <section id="klasyki" aria-labelledby="klasyki-title" className="py-24 lg:py-32">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="klasyki-title" index="01" eyebrow="Klasyki" className="lg:col-span-7">
            Klasyki, do których <em className="italic text-latte">się wraca</em>
          </SectionHeading>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-muted">Cztery klasyki z naszego baru. Dodaj je jednym kliknięciem albo dopasuj rozmiar, mleko i dodatki.</p>
            <Link href="/#menu" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-roast link-quiet">
              Zobacz pełne menu <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>

        <ul className="mt-16 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {POPULAR_PRODUCTS.map((product, i) => {
            const layout = LAYOUT[i % LAYOUT.length];
            return (
              <Reveal as="li" key={product.id} delay={i * 90} className={layout.offset}>
                <article className="group">
                  <div className={`relative ${layout.aspect} overflow-hidden rounded-2xl`}>
                    <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.03]">
                      <Photo image={product.image} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw" placeholderLabel={product.name} />
                    </div>
                    <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-2.5 py-1 text-xs font-medium tabular-nums text-roast">0{i + 1}</span>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="text-[1.75rem]">{product.name}</h3>
                    <p className="font-serif text-xl text-roast tabular-nums">{formatPrice(product.basePrice, { compact: true })}</p>
                  </div>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{product.flavor}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <QuickAddButton productId={product.id} />
                    <CustomizeButton productId={product.id} label="Dostosuj" className="btn btn-sm px-3 text-roast link-quiet" />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
