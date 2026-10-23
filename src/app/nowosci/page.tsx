import type { Metadata } from "next";
import { latestDrop, newArrivals } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export const metadata: Metadata = {
  title: "Nowości",
  description: `Najnowszy drop: ${latestDrop.name}. Bluzy i spodnie, które właśnie trafiły do sklepu.`,
  alternates: { canonical: "/nowosci" },
};

export default function NewArrivalsPage() {
  return (
    <CatalogPage
      crumbs={[
        { href: "/", label: "Strona główna" },
        { href: "/nowosci", label: "Nowości" },
      ]}
      title="Nowości"
      description={`${latestDrop.name} – w sklepie od ${formatDate(latestDrop.date)}.`}
      products={newArrivals()}
    />
  );
}
