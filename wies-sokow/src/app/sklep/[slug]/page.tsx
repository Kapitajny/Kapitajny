import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductPurchase } from "@/components/shop/ProductPurchase";
import styles from "@/components/shop/shop.module.css";
import { capacities, capacityLabel, flavors, getProduct, products } from "@/data/products";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/money";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const flavor = flavors[product.flavor];
  const title = `${product.name} ${product.capacity} l`;
  return {
    title,
    description: `${product.name}, ${capacityLabel(product.capacity)}, ${formatPrice(product.price)}. ${flavor.short}`,
    alternates: { canonical: `/sklep/${product.slug}` },
    openGraph: { title: `${title} | ${site.name}`, description: flavor.short, url: `/sklep/${product.slug}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const flavor = flavors[product.flavor];
  const label = `${product.name}, ${capacityLabel(product.capacity)}`;
  const siblings = capacities.map((capacity) => products.find((item) => item.flavor === product.flavor && item.capacity === capacity));
  const related = products.filter((item) => item.flavor !== product.flavor && item.capacity === product.capacity);
  const perLitre = Math.round(product.price / product.capacity);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} ${product.capacity} l`,
    description: flavor.short,
    image: `${site.url}${flavor.image.src}`,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      url: `${site.url}/sklep/${product.slug}`,
      priceCurrency: "PLN",
      price: (product.price / 100).toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className={styles.product}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd).replace(/</g, "\\u003c") }} />
      <div className="container">
        <nav className={styles.crumbs} aria-label="Ścieżka nawigacji">
          <Link href="/sklep">Sklep</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{label}</span>
        </nav>

        <div className={styles.productGrid}>
          <div className={styles.productMedia}>
            <span className={styles.productWord} aria-hidden="true">
              {flavor.label.split(" ")[0]}
            </span>
            <Image src={flavor.image} alt={flavor.imageAlt} sizes="(min-width: 60rem) 48vw, 92vw" quality={90} preload />
          </div>

          <div className={styles.productInfo}>
            <h1 className={styles.productTitle}>{product.name}</h1>

            <div className={styles.productPriceRow}>
              <p className={styles.productPrice}>{formatPrice(product.price)}</p>
              <p className={styles.productUnit}>
                {capacityLabel(product.capacity)}, czyli {formatPrice(perLitre)} za litr
              </p>
            </div>

            <div className="prose">
              {flavor.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className={styles.variants}>
              <span className="field-label">Pojemność</span>
              <div className={styles.variantList}>
                {siblings.map((item) =>
                  item ? (
                    <Link
                      key={item.slug}
                      href={`/sklep/${item.slug}`}
                      className={styles.variant}
                      aria-current={item.slug === product.slug ? "true" : undefined}
                    >
                      {capacityLabel(item.capacity)}
                    </Link>
                  ) : null,
                )}
              </div>
            </div>

            <ProductPurchase slug={product.slug} price={product.price} label={label} />

            <dl className={styles.specs}>
              <div>
                <dt>Skład</dt>
                <dd>{flavor.composition} Bez dodatku cukru i wody.</dd>
              </div>
              <div>
                <dt>Smak</dt>
                <dd>{flavor.taste}</dd>
              </div>
              <div>
                <dt>Opakowanie</dt>
                <dd>Worek z kranikiem w kartonie (bag-in-box), {capacityLabel(product.capacity)}.</dd>
              </div>
              <div>
                <dt>Przechowywanie</dt>
                <dd>Przed otwarciem w chłodnym, zacienionym miejscu. Po otwarciu w lodówce.</dd>
              </div>
            </dl>
            <p className="demo-note">
              <strong>Dane demonstracyjne.</strong> Skład, opis i cena są przykładowe i nie opisują rzeczywistego
              produktu. Zdjęcie poglądowe.
            </p>
          </div>
        </div>

        <section className={styles.related} aria-labelledby="inne-smaki">
          <h2 id="inne-smaki">Inne smaki w&nbsp;tej pojemności</h2>
          <ul className={styles.relatedGrid}>
            {related.map((item) => (
              <li key={item.slug}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
