import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections } from "@/data/catalog";
import { getCollection, productsInCollection } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/kolekcje/[slug]">): Promise<Metadata> {
  const collection = getCollection((await params).slug);
  if (!collection) return {};
  return { title: `Kolekcja ${collection.name}`, description: collection.description, alternates: { canonical: `/kolekcje/${collection.slug}` } };
}

export default async function CollectionPage({ params }: PageProps<"/kolekcje/[slug]">) {
  const collection = getCollection((await params).slug);
  if (!collection) notFound();
  return (
    <CatalogPage
      crumbs={[
        { href: "/", label: "Strona główna" },
        { href: "/kolekcje", label: "Kolekcje" },
        { href: `/kolekcje/${collection.slug}`, label: collection.name },
      ]}
      title={collection.name}
      description={collection.description}
      links={collections.map((c) => ({ href: `/kolekcje/${c.slug}`, label: c.name, current: c.slug === collection.slug }))}
      products={productsInCollection(collection.slug)}
    />
  );
}
