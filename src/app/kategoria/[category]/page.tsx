import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/data/catalog";
import { getCategory, productsInCategory } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/kategoria/[category]">): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.name} streetwear – ${category.description}`,
    alternates: { canonical: `/kategoria/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/kategoria/[category]">) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  return (
    <CatalogPage
      crumbs={[
        { href: "/", label: "Strona główna" },
        { href: `/kategoria/${category.slug}`, label: category.name },
      ]}
      title={category.name}
      description={category.description}
      links={[
        { href: `/kategoria/${category.slug}`, label: "Wszystkie", current: true },
        ...category.subcategories.map((s) => ({ href: `/kategoria/${category.slug}/${s.slug}`, label: s.name })),
      ]}
      products={productsInCategory(category.slug)}
      scope={{ category: category.slug }}
    />
  );
}
