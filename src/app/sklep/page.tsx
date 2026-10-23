import type { Metadata } from "next";
import { products } from "@/data/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export const metadata: Metadata = {
  title: "Wszystkie produkty",
  description: "Wszystkie bluzy i spodnie w jednym miejscu – filtruj po rozmiarze, kolorze, kroju i cenie.",
  alternates: { canonical: "/sklep" },
};

export default function ShopPage() {
  return (
    <CatalogPage
      crumbs={[
        { href: "/", label: "Strona główna" },
        { href: "/sklep", label: "Wszystkie produkty" },
      ]}
      title="Wszystko"
      description="Bluzy i spodnie w jednym miejscu. Filtruj po rozmiarze, kolorze, kroju i cenie."
      links={[
        { href: "/kategoria/bluzy", label: "Bluzy" },
        { href: "/kategoria/spodnie", label: "Spodnie" },
        { href: "/nowosci", label: "Nowości" },
      ]}
      products={products}
    />
  );
}
