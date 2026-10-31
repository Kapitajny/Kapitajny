import type { Metadata } from "next";
import { products } from "@/data/products";
import { isProductAvailable } from "@/lib/server/files";
import { ProductCard } from "@/components/product/ProductCard";
import { DownloadIcon, FileIcon, LockIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Sklep – e-booki o zdrowym odżywianiu",
  description: "Publikacje NOVELIA ZDROWIE w formacie PDF: „Zdrowiej każdego dnia”, „Zdrowe śniadania”, „Zdrowe obiady” i „Zdrowe nawyki”.",
  alternates: { canonical: "/sklep" },
};

export default function ShopPage() {
  return (
    <>
      <section className="border-b border-line bg-cream">
        <div className="container-x py-14 lg:py-20">
          <p className="eyebrow">Sklep NOVELIA</p>
          <span className="gold-rule mt-5" />
          <h1 className="mt-6 text-[clamp(2.4rem,1.6rem+3vw,4rem)]">E-booki o zdrowym odżywianiu</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Praktyczne publikacje w formacie PDF – do czytania na telefonie, tablecie i komputerze. Plik pobierzesz od razu po potwierdzeniu płatności.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
            <li className="inline-flex items-center gap-2">
              <FileIcon size={18} className="text-olive" /> Format PDF
            </li>
            <li className="inline-flex items-center gap-2">
              <DownloadIcon size={18} className="text-olive" /> Dostęp natychmiast po płatności
            </li>
            <li className="inline-flex items-center gap-2">
              <LockIcon size={18} className="text-olive" /> Bezpieczne płatności online
            </li>
          </ul>
        </div>
      </section>
      <section aria-label="Lista publikacji" className="container-x py-16 lg:py-20">
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} available={isProductAvailable(product)} headingLevel="h2" />
          ))}
        </div>
      </section>
    </>
  );
}
