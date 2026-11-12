import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { capacityLabel, flavors, products } from "@/data/products";
import { formatPrice } from "@/lib/money";
import styles from "./home.module.css";

const featured = products.filter((product) => product.featured);

export function Products() {
  return (
    <section id="produkty" className={`section ${styles.products}`} aria-labelledby="produkty-tytul">
      <div className="container">
        <header className={styles.productsHead}>
          <h2 id="produkty-tytul">Nasze produkty</h2>
          <div>
            <p className="lead">
              Dwa smaki, od których najłatwiej zacząć. Oba w opakowaniu z kranikiem, które wygodnie stoi w lodówce i na
              stole.
            </p>
            <Link href="/sklep" className="text-link">
              Zobacz wszystkie soki
            </Link>
          </div>
        </header>

        <div className={styles.productsGrid}>
          {featured.map((product) => {
            const flavor = flavors[product.flavor];
            const href = `/sklep/${product.slug}`;
            return (
              <article key={product.slug} className={styles.feature}>
                <Link href={href} className={styles.featureMedia} tabIndex={-1} aria-hidden="true">
                  <span className={styles.featureWord}>{flavor.label}</span>
                  <Image src={flavor.image} alt="" sizes="(min-width: 60rem) 30vw, (min-width: 40rem) 46vw, 78vw" quality={90} />
                </Link>
                <div className={styles.featureBody}>
                  <div className={styles.featureRow}>
                    <h3>
                      <Link href={href}>{product.name}</Link>
                    </h3>
                    <span className={styles.leader} aria-hidden="true" />
                    <p className={styles.price}>{formatPrice(product.price)}</p>
                  </div>
                  <p className={styles.capacity}>{capacityLabel(product.capacity)}</p>
                  <p className={styles.featureText}>{flavor.short}</p>
                  <AddToCartButton slug={product.slug} productLabel={`${product.name}, ${capacityLabel(product.capacity)}`} />
                </div>
              </article>
            );
          })}
        </div>
        <p className={`demo-note ${styles.productsNote}`}>Produkty i ceny są przykładowe.</p>
      </div>
    </section>
  );
}
