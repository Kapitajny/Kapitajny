import Link from "next/link";
import { allLocations, locationTypeLabels, verificationLabels, type SalesLocation } from "@/content/locations";
import { directionsUrl } from "@/lib/maps";
import { cityAnchor, groupByCity, pluralPl } from "@/lib/locations-search";
import { ExternalIcon } from "@/components/ui/Icons";

const groups = groupByCity(allLocations);

function SourceBadge({ location }: { location: SalesLocation }) {
  const v = location.verification;
  return (
    <span
      className={`ui inline-flex items-center border px-1.5 py-0.5 text-[0.75rem] font-medium leading-tight ${
        v === "katalog" ? "border-linen-deep text-muted" : "border-green/40 text-green"
      }`}
    >
      {verificationLabels[v].short}
    </span>
  );
}

/**
 * Spis punktów sprzedaży pogrupowany po miejscowościach. Bez pól do wypełniania: skróty do miast
 * są zwykłymi kotwicami, więc spis działa bez JavaScriptu i jest czytelny także na zrzutach ekranu.
 */
export function LocationDirectory() {
  const wholesale = allLocations.filter((l) => l.type === "hurtownia").length;
  const shops = allLocations.length - wholesale;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="ui text-[0.9375rem]">
          <span className="font-semibold">
            {allLocations.length} {pluralPl(allLocations.length, "punkt", "punkty", "punktów")} w {groups.length}{" "}
            {pluralPl(groups.length, "miejscowości", "miejscowościach", "miejscowościach")}
          </span>
          <span className="text-muted">
            {" "}
            – {wholesale} {pluralPl(wholesale, "hurtownia", "hurtownie", "hurtowni")} i {shops} {pluralPl(shops, "sklep firmowy", "sklepy firmowe", "sklepów firmowych")}
          </span>
        </p>
        <p className="ui flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8125rem] text-muted">
          <span>Źródło adresu:</span>
          {(["firma", "wolt", "katalog"] as const).map((v) => (
            <span key={v} className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`inline-block h-3 w-3 border ${v === "katalog" ? "border-linen-deep" : "border-green/60 bg-green/10"}`} />
              {verificationLabels[v].short}
            </span>
          ))}
        </p>
      </div>

      <nav aria-label="Miejscowości" className="mt-6 border-y border-line py-4">
        <ul className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <li key={g.city}>
              <a
                href={`#${cityAnchor(g.city)}`}
                className="ui inline-flex min-h-11 items-center gap-2 border border-linen-deep bg-surface px-3.5 text-[0.9375rem] font-medium transition-colors hover:border-ink"
              >
                {g.city}
                <span className="tabular-nums text-muted">{g.items.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-4">
        {groups.map((g) => (
          <section key={g.city} id={cityAnchor(g.city)} aria-labelledby={`${cityAnchor(g.city)}-title`} className="scroll-mt-28 pt-8">
            <h2 id={`${cityAnchor(g.city)}-title`} className="display-md flex items-baseline gap-3">
              {g.city}
              <span className="ui text-[0.9375rem] font-medium text-muted">
                {g.items.length} {pluralPl(g.items.length, "punkt", "punkty", "punktów")}
              </span>
            </h2>
            <ul className="mt-4 border-t border-line">
              {g.items.map((l) => (
                <li key={l.slug} className="grid gap-x-6 gap-y-2 border-b border-line py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div className="min-w-0">
                    <p className="ui flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] font-semibold text-red">
                      {locationTypeLabels[l.type]}
                      {l.storeNumber && <span className="font-normal text-muted">{l.storeNumber}</span>}
                      <SourceBadge location={l} />
                    </p>
                    <p className="display-sm mt-1 text-[1.25rem]">{l.street}</p>
                    <p className="ui text-[0.875rem] text-muted">
                      {l.postalCode ? `${l.postalCode} ` : ""}
                      {l.city}
                    </p>
                  </div>
                  <div className="ui flex flex-wrap gap-2">
                    <a
                      href={directionsUrl(l.mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      Trasa
                      <ExternalIcon size={15} />
                      <span className="sr-only">do: {l.street}, {l.city} (Mapy Google, nowa karta)</span>
                    </a>
                    <Link href={`/siec-sprzedazy/${l.slug}`} className="btn btn-ink btn-sm">
                      Szczegóły<span className="sr-only">punktu: {l.street}, {l.city}</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
