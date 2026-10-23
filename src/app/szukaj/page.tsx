import type { Metadata } from "next";
import { Suspense } from "react";
import { products } from "@/data/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { SearchHeader } from "@/components/catalog/SearchHeader";

export const metadata: Metadata = {
  title: "Szukaj",
  description: "Wyszukiwarka bluz i spodni.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <CatalogPage
      crumbs={[
        { href: "/", label: "Strona główna" },
        { href: "/szukaj", label: "Szukaj" },
      ]}
      title="Szukaj"
      products={products}
      searchMode
    >
      <Suspense fallback={<div className="mb-8 h-12 max-w-xl border border-line bg-graphite" />}>
        <SearchHeader />
      </Suspense>
    </CatalogPage>
  );
}
