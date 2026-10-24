import Link from "next/link";
import { categories } from "@/content/products";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { AssortmentBrowser } from "@/components/products/AssortmentBrowser";
import { DemoNote } from "@/components/ui/DemoNote";
import { Photo } from "@/components/ui/Photo";

export const metadata = pageMetadata({
  title: "Produkty – mięso, wędliny i wyroby garmażeryjne",
  description:
    "Oferta Zakładu Mięsnego Wierzejki: wieprzowina i wołowina, wędzonki, kiełbasy, wyroby blokowe i podrobowe, pierogi, krokiety i naleśniki. Przeglądaj grupy asortymentowe.",
  path: "/produkty",
});

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/produkty", label: "Produkty" }]}
        title="Nasze produkty"
        lead={<p>Trzy kategorie, tak jak w katalogach firmy. Wybierz kategorię albo przeszukaj grupy asortymentowe poniżej.</p>}
      />

      <section aria-label="Kategorie" className="py-14 lg:py-20">
        <ul className="container-x grid gap-10 md:grid-cols-3 md:gap-6">
          {categories.map((c, i) => (
            <li key={c.id} className={i === 1 ? "md:mt-16" : ""}>
              <Link href={`/produkty/${c.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-linen">
                  <Photo media={c.media} sizes="(min-width: 768px) 32vw, 100vw" />
                </div>
                <h2 className="display-md mt-5 group-hover:text-red">{c.name}</h2>
                <p className="mt-2 text-muted">{c.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="asortyment" className="bg-surface py-16 lg:py-24">
        <div className="container-x">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 id="asortyment" className="display-lg">
              Przeglądaj asortyment
            </h2>
            <p className="max-w-[28rem] text-muted md:text-right">Grupy produktów z katalogów firmy. Gramatury, składy i alergeny podają etykiety i katalogi.</p>
          </div>
          <div className="mt-8">
            <AssortmentBrowser />
          </div>
          <DemoNote className="mt-8">
            Przykładowe nazwy pochodzą z katalogów PDF dostępnych na dotychczasowej stronie. Aktualność asortymentu potwierdzi firma –
            dane edytuje się w pliku <code>src/content/products.ts</code>.
          </DemoNote>
        </div>
      </section>
    </>
  );
}
