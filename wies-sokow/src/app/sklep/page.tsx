import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import styles from "@/components/shop/shop.module.css";

export const metadata: Metadata = {
  title: "Sklep – soki jabłkowe i gruszkowe 3 l i 5 l",
  description:
    "Soki Wieś Soków w opakowaniach z kranikiem: jabłkowy, gruszkowy i jabłkowo-gruszkowy, 3 lub 5 litrów. Zamówienie bezpośrednio u producenta.",
  alternates: { canonical: "/sklep" },
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        title="Sklep"
        lead="Trzy smaki w dwóch pojemnościach. Wybierz sok, dodaj do koszyka i zamów bezpośrednio u nas."
      />
      <section className={styles.shop} aria-label="Produkty">
        <div className="container">
          {/* useSearchParams wymaga granicy Suspense, żeby reszta strony mogła być statyczna. */}
          <Suspense fallback={<p className="demo-note">Wczytuję produkty…</p>}>
            <ShopBrowser />
          </Suspense>
          <p className={`demo-note ${styles.shopNote}`}>
            <strong>Sklep demonstracyjny.</strong> Produkty, ceny i dostępność są przykładowe. Zdjęcia opakowań mają
            charakter poglądowy.
          </p>
        </div>
      </section>
    </>
  );
}
