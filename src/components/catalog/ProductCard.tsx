"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { COLORS, SIZES, type Product, type Size } from "@/data/catalog";
import { catalogStock, colorName, detailSrc, imageSrc, isNewArrival, productHref } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import { useShop } from "@/components/shop/ShopProvider";
import type { Availability } from "@/components/shop/useLiveStock";
import { HeartIcon } from "@/components/ui/Icons";

/**
 * Karta produktu: zdjęcie wybranego koloru (po najechaniu – detal), przełącznik kolorów,
 * dostępne rozmiary, cena i dodanie do ulubionych.
 */
export function ProductCard({
  product,
  availability,
  priority = false,
  sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
  initialColor,
}: {
  product: Product;
  availability?: Availability | null;
  priority?: boolean;
  sizes?: string;
  initialColor?: string;
}) {
  const { isFavorite, toggleFavorite, hydrated } = useShop();
  const [color, setColor] = useState(product.variants.find((v) => v.color === initialColor)?.color ?? product.variants[0].color);
  const variant = product.variants.find((v) => v.color === color) ?? product.variants[0];
  const stockOf = (size: Size) => availability?.[variant.color]?.[size] ?? catalogStock(product, variant.color, size);
  const inStock = SIZES.filter((s) => stockOf(s) > 0);
  const soldOut = product.variants.every((v) => SIZES.every((s) => (availability?.[v.color]?.[s] ?? catalogStock(product, v.color, s)) === 0));
  const favorite = hydrated && isFavorite(product.id);
  const href = productHref(product, variant.color);

  return (
    <article className="group relative flex flex-col">
      <div className="studio relative aspect-[4/5] overflow-hidden">
        <Image
            src={imageSrc(variant.image)}
            alt=""
            fill
            sizes={sizes}
            preload={priority}
            className="object-cover transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0"
          />
          <Image src={detailSrc(variant.image)} alt="" fill sizes={sizes} className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1">
          {soldOut ? (
            <span className="bg-ink px-2 py-1 text-[0.7rem] font-bold text-paper">Wyprzedane</span>
          ) : (
            isNewArrival(product) && <span className="bg-paper px-2 py-1 text-[0.7rem] font-bold text-ink">Nowość</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(product.id, product.name)}
          aria-pressed={favorite}
          aria-label={favorite ? `Usuń ${product.name} z ulubionych` : `Dodaj ${product.name} do ulubionych`}
          className="absolute right-1.5 top-1.5 z-10 grid h-11 w-11 place-items-center text-ink transition-transform hover:scale-110"
        >
          <HeartIcon filled={favorite} size={22} />
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-[0.95rem] font-bold leading-snug">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-paper">
            {product.name}
          </Link>
        </h3>
        <p className="shrink-0 text-[0.95rem] font-semibold tabular-nums">
          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <>
              <span className="sr-only">Cena obniżona z </span>
              <s className="mr-2 font-normal text-muted">{formatPrice(product.compareAtPrice, { compact: true })}</s>
              <span className="sr-only"> do </span>
            </>
          ) : null}
          {formatPrice(product.price, { compact: true })}
        </p>
      </div>
      <p className="text-sm text-muted">{product.kind}</p>

      <div className="relative z-10 mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        {product.variants.length > 1 ? (
          <div role="group" aria-label={`Kolory: ${product.name}`} className="flex gap-1.5">
            {product.variants.map((v) => (
              <button
                key={v.color}
                type="button"
                onClick={() => setColor(v.color)}
                aria-pressed={v.color === variant.color}
                aria-label={colorName(v.color)}
                title={colorName(v.color)}
                className="grid h-7 w-7 place-items-center rounded-full border border-transparent aria-pressed:border-paper"
              >
                <span className="h-4 w-4 rounded-full border border-white/25" style={{ background: COLORS[v.color].hex }} />
              </button>
            ))}
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted">
            <span className="h-3.5 w-3.5 rounded-full border border-white/25" style={{ background: COLORS[variant.color].hex }} />
            {colorName(variant.color)}
          </p>
        )}
        <p className="-ml-1.5 text-xs text-muted">
          <span className="sr-only">{inStock.length ? `Dostępne rozmiary: ${inStock.join(", ")}` : "Brak dostępnych rozmiarów w tym kolorze"}</span>
          {SIZES.map((s) => (
            <span key={s} aria-hidden="true" className={`ml-1.5 ${stockOf(s) > 0 ? "text-paper" : "text-[#8a8a8a] line-through"}`}>
              {s}
            </span>
          ))}
        </p>
      </div>
    </article>
  );
}
