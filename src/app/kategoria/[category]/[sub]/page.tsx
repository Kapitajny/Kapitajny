import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/data/catalog";
import { getCategory, getSubcategory, productsInSubcategory } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export function generateStaticParams() {
  return categories.flatMap((c) => c.subcategories.map((s) => ({ category: c.slug, sub: s.slug })));
}

async function resolve(params: PageProps<"/kategoria/[category]/[sub]">["params"]) {
  const { category: categorySlug, sub: subSlug } = await params;
  const category = getCategory(categorySlug);
  const sub = getSubcategory(categorySlug, subSlug);
  return category && sub ? { category, sub } : null;
}

export async function generateMetadata({ params }: PageProps<"/kategoria/[category]/[sub]">): Promise<Metadata> {
  const found = await resolve(params);
  if (!found) return {};
  const { category, sub } = found;
  return {
    title: `${category.name} ${sub.name.toLowerCase()}`,
    description: `${category.name} – ${sub.name.toLowerCase()}. ${sub.description}`,
    alternates: { canonical: `/kategoria/${category.slug}/${sub.slug}` },
  };
}

export default async function SubcategoryPage({ params }: PageProps<"/kategoria/[category]/[sub]">) {
  const found = await resolve(params);
  if (!found) notFound();
  const { category, sub } = found;
  return (
    <CatalogPage
      crumbs={[
        { href: "/", label: "Strona główna" },
        { href: `/kategoria/${category.slug}`, label: category.name },
        { href: `/kategoria/${category.slug}/${sub.slug}`, label: sub.name },
      ]}
      title={`${category.name} ${sub.name.toLowerCase()}`}
      description={sub.description}
      links={[
        { href: `/kategoria/${category.slug}`, label: "Wszystkie" },
        ...category.subcategories.map((s) => ({ href: `/kategoria/${category.slug}/${s.slug}`, label: s.name, current: s.slug === sub.slug })),
      ]}
      products={productsInSubcategory(category.slug, sub.slug)}
      scope={{ category: category.slug, style: sub.slug }}
    />
  );
}
