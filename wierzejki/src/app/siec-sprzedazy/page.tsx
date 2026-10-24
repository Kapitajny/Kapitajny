import Link from "next/link";
import { getDepartment } from "@/content/company";
import { retailStores } from "@/content/locations";
import { telHref } from "@/lib/format";
import { pluralPl } from "@/lib/locations-search";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { LocationFinder } from "@/components/locations/LocationFinder";
import { DemoNote } from "@/components/ui/DemoNote";
import { Photo } from "@/components/ui/Photo";

export const metadata = pageMetadata({
  title: "Sieć sprzedaży – hurtownie i sklepy firmowe",
  description: "Hurtownie i sklepy firmowe Wierzejki w Warszawie, Łodzi, Lublinie, Siedlcach, Łukowie, Otwocku i okolicach. Wyszukiwarka punktów z mapą.",
  path: "/siec-sprzedazy",
});

export default function SalesNetworkPage() {
  const secretariat = getDepartment("sekretariat");
  const woltCount = retailStores.filter((s) => s.verification === "wolt").length;
  const catalogCount = retailStores.filter((s) => s.verification === "katalog").length;
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/siec-sprzedazy", label: "Sieć sprzedaży" }]}
        title="Gdzie kupić"
        lead={<p>Hurtownie i sklepy firmowe Wierzejki na Mazowszu, Lubelszczyźnie i w Łodzi. Szukaj po miejscowości, ulicy lub kodzie pocztowym.</p>}
      />

      <section aria-label="Wyszukiwarka punktów sprzedaży" className="py-14 lg:py-20">
        <div className="container-x">
          <LocationFinder />
        </div>
      </section>

      <section aria-labelledby="sklepy-firmowe" className="border-t border-line bg-surface py-16 lg:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="sklepy-firmowe" className="display-lg">
              Sklepy firmowe
            </h2>
            <figure className="mt-8">
              <div className="relative aspect-[3/2] overflow-hidden bg-linen">
                <Photo media="shop" sizes="(min-width: 1024px) 38vw, 100vw" />
              </div>
              <figcaption className="ui mt-3 text-[0.8125rem] text-muted">Stoisko patronackie Wierzejki – mięso, wędliny, drób</figcaption>
            </figure>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p>
              Firma prowadzi własną sieć sklepów mięsnych. Wyszukiwarka zawiera {retailStores.length}{" "}
              {pluralPl(retailStores.length, "sklep", "sklepy", "sklepów")}: {woltCount} z aktywną stroną w serwisie Wolt i {catalogCount} z katalogów firm.
              Przy każdym punkcie widać, skąd pochodzi adres. Jeśli chcesz mieć pewność przed wizytą, zadzwoń do sekretariatu:{" "}
              <a href={telHref(secretariat.phones[0].display)} className="link font-semibold">
                {secretariat.phones[0].display}
              </a>
              .
            </p>
            <DemoNote className="mt-6">
              Firma nie publikuje dziś pełnej listy sklepów. Adresy zebrano z serwisu Wolt i katalogów firm – część wpisów katalogowych może być
              nieaktualna. Po otrzymaniu listy od firmy wystarczy podmienić dane w pliku <code>src/content/locations.ts</code>.
            </DemoNote>
            <Link href="/dla-biznesu" className="btn btn-outline mt-8">
              Oferta dla biznesu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
