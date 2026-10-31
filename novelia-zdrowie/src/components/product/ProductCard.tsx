import Link from "next/link";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { AddToCartButton, BuyNowButton } from "@/components/cart/BuyButtons";
import { Cover } from "./Cover";

export function ProductCard({ product, available, headingLevel = "h3" }: { product: Product; available: boolean; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group flex h-full flex-col">
      <Link href={`/sklep/${product.slug}`} className="relative block bg-beige/60 px-[14%] pb-[10%] pt-[12%] transition-colors group-hover:bg-beige" aria-label={`${product.title} – szczegóły`}>
        <Cover product={product} sizes="(min-width: 1024px) 18rem, (min-width: 640px) 40vw, 80vw" className="transition-transform duration-500 group-hover:-translate-y-1" />
        {product.featured && <span className="absolute left-3 top-3 bg-forest px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-cream">Nowość</span>}
        {!available && <span className="absolute left-3 top-3 bg-paper px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-forest">W przygotowaniu</span>}
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <Heading className="text-2xl">
          <Link href={`/sklep/${product.slug}`} className="hover:underline hover:decoration-1 hover:underline-offset-4">
            {product.title}
          </Link>
        </Heading>
        <p className="mt-1 text-[0.95rem] text-muted">{product.subtitle}</p>
        <p className="mt-3 text-[0.95rem] leading-relaxed">{product.short}</p>
        <div className="mt-auto pt-5">
          <p className="font-serif text-2xl text-forest">
            {formatPrice(product.price)}
            {!available && <span className="ml-2 align-middle font-sans text-xs uppercase tracking-[0.18em] text-muted">cena planowana</span>}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {available ? <BuyNowButton slug={product.slug} className="btn btn-primary w-full" /> : null}
            {available ? (
              <AddToCartButton slug={product.slug} className="btn btn-outline w-full" />
            ) : (
              <Link href={`/sklep/${product.slug}`} className="btn btn-outline w-full">
                Zobacz fragment
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
