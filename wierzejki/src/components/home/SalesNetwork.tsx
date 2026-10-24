import Link from "next/link";
import { retailStores, wholesalePoints } from "@/content/locations";
import { citySummary, pluralPl } from "@/lib/locations-search";
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
            Hurtownie firmowe obsługują odbiorców na Mazowszu i Lubelszczyźnie, a sklepy firmowe działają m.in. w Warszawie, Łodzi, Lublinie i
            Siedlcach. Wyszukiwarka pokaże najbliższy punkt i drogę dojazdu.
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
            <p className="mt-2 text-[1rem] text-muted">
              W wyszukiwarce: {retailStores.length} {pluralPl(retailStores.length, "sklep", "sklepy", "sklepów")} w{" "}
              {citySummary(retailStores).length} {pluralPl(citySummary(retailStores).length, "miejscowości", "miejscowościach", "miejscowościach")}, z mapą i
              wyszukiwaniem po ulicy lub kodzie pocztowym.
            </p>
            <Link href="/siec-sprzedazy" className="btn btn-ink mt-5">
              Otwórz wyszukiwarkę punktów
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
