import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, channelLabels, groupsOf, type Category } from "@/content/products";
import { wholesalePoints } from "@/content/locations";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { DemoNote } from "@/components/ui/DemoNote";
import { DownloadIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ kategoria: c.slug }));
}

const descriptions: Record<Category["id"], string> = {
  mieso:
    "Wieprzowina i wołowina z uboju i rozbioru w zakładzie Wierzejki w Płudach: półtusze, ćwierćtusze i elementy dla hurtu, gastronomii i sklepów firmowych.",
  wedliny:
    "Wędliny Wierzejki: wędzonki, kiełbasy, produkty blokowe, kiełbasy suche i podsuszane oraz wędliny podrobowe z przetwórni w Płudach.",
  garmaz: "Wyroby garmażeryjne Wierzejki: pierogi w wielu farszach, krokiety, naleśniki, kopytka i kluski leniwe.",
};

function findCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/produkty/[kategoria]">): Promise<Metadata> {
  const { kategoria } = await params;
  const category = findCategory(kategoria);
  if (!category) return {};
  return pageMetadata({ title: category.name, description: descriptions[category.id], path: `/produkty/${category.slug}` });
}

/** Blok właściwy tylko dla danej kategorii – każda podstrona odpowiada na inne pytania odbiorcy. */
function CategoryFeature({ category }: { category: Category }) {
  if (category.id === "mieso") {
    const porcjowanie = wholesalePoints.find((w) => w.services.some((s) => s.toLowerCase().includes("porcjowanie")));
    return (
      <section aria-labelledby="formy-sprzedazy" className="py-20 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <h2 id="formy-sprzedazy" className="display-lg lg:col-span-4">
            W jakiej formie
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <table className="ui w-full border-collapse text-left text-[0.9375rem]">
              <caption className="sr-only">Formy sprzedaży mięsa według odbiorcy</caption>
              <thead>
                <tr className="border-b-2 border-ink">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Odbiorca
                  </th>
                  <th scope="col" className="py-3 font-semibold">
                    Forma
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr>
                  <th scope="row" className="py-4 pr-4 align-top font-semibold">
                    Hurt
                  </th>
                  <td className="py-4 text-muted">Tusze, półtusze wieprzowe, ćwierćtusze wołowe, elementy z rozbioru</td>
                </tr>
                <tr>
                  <th scope="row" className="py-4 pr-4 align-top font-semibold">
                    Gastronomia i stołówki
                  </th>
                  <td className="py-4 text-muted">Elementy kulinarne i mięso do dalszej obróbki</td>
                </tr>
                <tr>
                  <th scope="row" className="py-4 pr-4 align-top font-semibold">
                    Klienci sklepów
                  </th>
                  <td className="py-4 text-muted">Mięso porcjowane przy ladzie w sklepach firmowych</td>
                </tr>
              </tbody>
            </table>
            {porcjowanie && (
              <p className="mt-6 text-[1rem]">
                Rozbiorem i porcjowaniem mięsa zajmuje się także{" "}
                <Link href={`/siec-sprzedazy/${porcjowanie.slug}`} className="link font-semibold">
                  hurtownia w {porcjowanie.cityLocative}
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (category.id === "wedliny") {
    return (
      <section aria-labelledby="katalog-wedlin" className="py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-linen lg:col-span-5">
            <Photo media="smokehouse" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 id="katalog-wedlin" className="display-lg">
              Jak czytać katalog wędlin
            </h2>
            <p className="mt-5 max-w-[34rem] text-muted">Katalog dzieli wyroby na pięć części – w tej samej kolejności, w jakiej pokazujemy je wyżej.</p>
            <ol className="mt-8 border-t border-line">
              {groupsOf("wedliny").map((g, i) => (
                <li key={g.id} className="flex items-baseline gap-5 border-b border-line py-4">
                  <span className="ui w-6 text-[0.875rem] font-semibold tabular-nums text-red">{i + 1}</span>
                  <span className="display-sm text-[1.3rem]">{g.name}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  }

  const pierogi = groupsOf("garmaz").find((g) => g.id === "pierogi");
  return (
    <section aria-labelledby="farsze" className="on-dark bg-green py-20 text-on-dark lg:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="farsze" className="display-lg">
            Farsze pierogów
          </h2>
          <p className="mt-5 max-w-[30rem] text-on-dark/80">Farsze wymienione w katalogu garmażerki – od wytrawnych po słodkie.</p>
        </div>
        <ul className="flex flex-wrap content-start gap-3 lg:col-span-6 lg:col-start-7">
          {pierogi?.examples.map((f) => (
            <li key={f} className="display-sm border border-on-dark/30 px-4 py-2.5 text-[1.25rem]">
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default async function CategoryPage({ params }: PageProps<"/produkty/[kategoria]">) {
  const { kategoria } = await params;
  const category = findCategory(kategoria);
  if (!category) notFound();
  const groups = groupsOf(category.id);
  const others = categories.filter((c) => c.id !== category.id);

  return (
    <>
      <PageIntro
        variant="split"
        media={category.media}
        crumbs={[
          { href: "/produkty", label: "Produkty" },
          { href: `/produkty/${category.slug}`, label: category.name },
        ]}
        title={category.name}
        lead={<p>{category.intro}</p>}
      >
        {category.catalog && (
          <a href={category.catalog.href} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
            <DownloadIcon size={18} />
            {category.catalog.label}
          </a>
        )}
      </PageIntro>

      <section aria-labelledby="grupy" className="bg-surface py-20 lg:py-24">
        <div className="container-x">
          <h2 id="grupy" className="display-md">
            Grupy asortymentowe
          </h2>
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {groups.map((g) => (
              <li key={g.id} className="grid gap-3 py-7 md:grid-cols-12 md:gap-8">
                <h3 className="display-md md:col-span-4">{g.name}</h3>
                <div className="md:col-span-5">
                  <p>{g.description}</p>
                  {g.examples.length > 0 && <p className="ui mt-3 text-[0.9375rem] text-muted">Np.: {g.examples.join(", ")}</p>}
                </div>
                <p className="ui text-[0.8125rem] text-muted md:col-span-3 md:text-right">{g.channels.map((c) => channelLabels[c]).join(" / ")}</p>
              </li>
            ))}
          </ul>
          <DemoNote className="mt-8">
            Nazwy grup i przykłady pochodzą z katalogów firmy. Bez kart produktów nie publikujemy gramatur, cen ani składów.
          </DemoNote>
        </div>
      </section>

      <CategoryFeature category={category} />

      <section aria-labelledby="zamowienia" className="border-t border-line py-16 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <h2 id="zamowienia" className="display-md">
              Kupujesz dla firmy?
            </h2>
            <p className="mt-3 max-w-[32rem] text-muted">Zapytaj o asortyment, formę dostawy i terminy – warunki ustalamy indywidualnie.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dla-biznesu#zapytanie" className="btn btn-red">
                Wyślij zapytanie handlowe
              </Link>
              <Link href="/siec-sprzedazy" className="btn btn-outline">
                Gdzie kupić
              </Link>
            </div>
          </div>
          <nav aria-label="Pozostałe kategorie" className="lg:col-span-5 lg:col-start-8">
            <p className="label text-muted">Zobacz też</p>
            <ul className="mt-3 border-t border-line">
              {others.map((c) => (
                <li key={c.id} className="border-b border-line">
                  <Link href={`/produkty/${c.slug}`} className="display-sm flex min-h-14 items-center py-3 hover:text-red">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
