import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { products } from "@/data/catalog";
import { siteConfig } from "@/config/site";
import { colorName, getCategory, getProduct, imageSrc, relatedProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import { Breadcrumbs } from "@/components/catalog/CatalogPage";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductView, ProductViewWithParams } from "@/components/product/ProductView";
import { JsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produkt/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const colors = product.variants.map((v) => colorName(v.color).toLowerCase()).join(", ");
  const description = `${product.kind} ${product.name}, ${formatPrice(product.price)}. Kolory: ${colors}. ${product.description}`;
  return {
    title: `${product.name} – ${product.kind.toLowerCase()}`,
    description: description.slice(0, 300),
    alternates: { canonical: `/produkt/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} – ${product.kind}`,
      description: product.description,
      images: [{ url: imageSrc(product.variants[0].image), width: 928, height: 1160, alt: `${product.name} – ${colorName(product.variants[0].color)}` }],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/produkt/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const category = getCategory(product.category)!;
  const related = relatedProducts(product, 4);

  return (
    <div className="wrap pb-24 pt-6 md:pt-8">
      {/* Dane strukturalne bez ocen, recenzji i deklaracji dostępności – stan zmienia się po sprzedaży. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProductGroup",
          name: product.name,
          description: product.description,
          productGroupID: product.id,
          brand: { "@type": "Brand", name: siteConfig.name },
          category: `${category.name} > ${product.kind}`,
          material: product.material,
          variesBy: ["https://schema.org/color", "https://schema.org/size"],
          url: `${siteConfig.url}/produkt/${product.slug}`,
          hasVariant: product.variants.map((v) => ({
            "@type": "Product",
            name: `${product.name} – ${colorName(v.color)}`,
            color: colorName(v.color),
            image: `${siteConfig.url}${imageSrc(v.image)}`,
            offers: {
              "@type": "Offer",
              price: (product.price / 100).toFixed(2),
              priceCurrency: "PLN",
              itemCondition: "https://schema.org/NewCondition",
              url: `${siteConfig.url}/produkt/${product.slug}?kolor=${v.color}`,
            },
          })),
        }}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Strona główna" },
          { href: `/kategoria/${category.slug}`, label: category.name },
          { href: `/produkt/${product.slug}`, label: product.name },
        ]}
      />
      <div className="mt-6">
        <Suspense fallback={<ProductView product={product} />}>
          <ProductViewWithParams product={product} />
        </Suspense>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-24 border-t border-line pt-14">
          <h2 id="related-title" className="display text-[clamp(2.2rem,1rem+3.6vw,4rem)]">
            Pasuje do tego
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} sizes="(min-width: 1024px) 25vw, 50vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
