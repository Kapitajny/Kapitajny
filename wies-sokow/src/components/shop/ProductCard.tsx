import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { capacityLabel, flavors, type Product } from "@/data/products";
import { formatPrice } from "@/lib/money";
import styles from "./shop.module.css";

export function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const flavor = flavors[product.flavor];
  const href = `/sklep/${product.slug}`;
  const label = `${product.name}, ${capacityLabel(product.capacity)}`;

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.cardMedia} tabIndex={-1} aria-hidden="true">
        <Image
          src={flavor.image}
          alt=""
          sizes="(min-width: 64rem) 22vw, (min-width: 40rem) 30vw, 44vw"
          quality={90}
          loading={eager ? "eager" : "lazy"}
          data-capacity={product.capacity}
        />
        <span className={styles.cardCapacity}>{product.capacity} l</span>
      </Link>
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>
          <Link href={href}>{product.name}</Link>
        </h3>
        <p className={styles.cardMeta}>{capacityLabel(product.capacity)}</p>
        <p className={styles.cardPrice}>{formatPrice(product.price)}</p>
        <AddToCartButton slug={product.slug} productLabel={label} className={`btn btn--outline ${styles.cardButton}`} />
      </div>
    </article>
  );
}
