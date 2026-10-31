import { siteConfig } from "@/config/site";
import type { Product } from "@/data/products";

/** Dane strukturalne schema.org (bez ocen i opinii – sklep ich nie zbiera). */
export function productJsonLd(product: Product, available: boolean) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.title} – ${product.subtitle}`,
    description: product.description[0],
    image: `${siteConfig.url}${product.cover.src}`,
    brand: { "@type": "Brand", name: siteConfig.name },
    category: "E-book",
    url: `${siteConfig.url}/sklep/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: "PLN",
      availability: available ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      url: `${siteConfig.url}/sklep/${product.slug}`,
    },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
