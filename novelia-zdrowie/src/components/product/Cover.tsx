import Image from "next/image";
import type { Product } from "@/data/products";

/** Okładka publikacji z delikatnym grzbietem i cieniem książki. */
export function Cover({ product, sizes, priority = false, className = "" }: { product: Product; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div className={`relative aspect-[1410/2250] book-shadow ${className}`}>
      <Image src={product.cover.src} alt={product.cover.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[4%] bg-gradient-to-r from-black/25 via-white/10 to-transparent" />
    </div>
  );
}
