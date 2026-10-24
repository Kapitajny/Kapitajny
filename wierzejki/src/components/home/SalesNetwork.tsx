import Link from "next/link";
import { retailStores, wholesalePoints } from "@/content/locations";
import { PinIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";

export function SalesNetwork() {
  return (
    <section aria-labelledby="siec-title" className="py-20 lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="siec-title" className="display-lg">
            Gdzie kupić wyroby z&nbsp;Wierzejek
          </h2>
          <p className="mt-6 max-w-[32rem] text-ink/85">
            Hurtownie firmowe obsługują odbiorców na Mazowszu i Lubelszczyźnie. Sklepy firmowe prowadzą sprzedaż detaliczną – ich lista trafi
            do wyszukiwarki po potwierdzeniu adresów przez firmę.
          </p>
          <figure className="mt-10">
            <div className="relative aspect-[3/2] overflow-hidden bg-linen">
              <Photo media="shop" sizes="(min-width: 1024px) 38vw, 100vw" />
            </div>
            <figcaption className="ui mt-3 text-[0.8125rem] text-muted">Stoisko patronackie Wierzejki – mięso, wędliny, drób</figcaption>
          </figure>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h3 className="label text-muted">Hurtownie firmowe</h3>
          <ul className="mt-3 border-t border-line">
            {wholesalePoints.map((p) => (
              <li key={p.slug} className="border-b border-line">
                <Link href={`/siec-sprzedazy/${p.slug}`} className="group flex items-center justify-between gap-4 py-5">
                  <span>
                    <span className="display-sm block group-hover:text-red">{p.city}</span>
                    <span className="ui mt-1 block text-[0.9375rem] text-muted">{p.street}</span>
                  </span>
                  <PinIcon size={22} className="shrink-0 text-red" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 border border-dashed border-linen-deep bg-surface p-6">
            <h3 className="display-sm">Sklepy firmowe</h3>
            {retailStores.length > 0 ? (
              <p className="mt-2 text-muted">W wyszukiwarce znajdziesz {retailStores.length} sklepów z adresami i godzinami otwarcia.</p>
            ) : (
              <p className="mt-2 text-[1rem] text-muted">
                Moduł jest gotowy na listę sklepów z adresami, godzinami i mapą. Do czasu jej uzupełnienia o najbliższy sklep zapytaj w
                sekretariacie.
              </p>
            )}
            <Link href="/siec-sprzedazy" className="btn btn-ink mt-5">
              Otwórz wyszukiwarkę punktów
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
