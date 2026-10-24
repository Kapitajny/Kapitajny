import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDepartment } from "@/content/company";
import { allLocations, getLocation, locationTypeLabels, regionLabels, verificationLabels } from "@/content/locations";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MapEmbed } from "@/components/locations/MapEmbed";
import { DepartmentContact } from "@/components/ui/ContactCard";
import { DemoNote } from "@/components/ui/DemoNote";
import { ArrowLeft, ExternalIcon } from "@/components/ui/Icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return allLocations.map((l) => ({ punkt: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/siec-sprzedazy/[punkt]">): Promise<Metadata> {
  const { punkt } = await params;
  const location = getLocation(punkt);
  if (!location) return {};
  return pageMetadata({
    title: `${location.name}, ${location.street}`,
    description: `${locationTypeLabels[location.type]} Zakładu Mięsnego Wierzejki: ${location.street}, ${location.postalCode ? `${location.postalCode} ` : ""}${location.city}. ${location.services.join(", ")}.`,
    path: `/siec-sprzedazy/${location.slug}`,
  });
}

export default async function LocationPage({ params }: PageProps<"/siec-sprzedazy/[punkt]">) {
  const { punkt } = await params;
  const location = getLocation(punkt);
  if (!location) notFound();
  const contact = getDepartment(location.type === "hurtownia" ? "zbyt" : "sekretariat");
  const others = allLocations.filter((l) => l.slug !== location.slug);
  const sameCity = others.filter((l) => l.city === location.city);
  const nearby = (sameCity.length > 0 ? sameCity : others.filter((l) => l.region === location.region)).slice(0, 6);
  const verification = verificationLabels[location.verification];

  return (
    <>
      <header className="border-b border-line">
        <div className="container-x py-10 lg:py-14">
          <Breadcrumbs
            items={[
              { href: "/siec-sprzedazy", label: "Sieć sprzedaży" },
              { href: `/siec-sprzedazy/${location.slug}`, label: `${location.city}, ${location.street}` },
            ]}
          />
          <p className="ui mt-8 flex flex-wrap gap-x-3 text-[0.9375rem] font-semibold text-red lg:mt-14">
            {locationTypeLabels[location.type]}
            {location.storeNumber && <span className="font-normal text-muted">{location.storeNumber}</span>}
          </p>
          <h1 className="display-xl mt-2">{location.city}</h1>
          <p className="lead mt-4">{location.street}</p>
        </div>
      </header>

      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-4">
            <div>
              <h2 className="display-sm">Adres</h2>
              <address className="mt-2 not-italic">
                {location.street}
                <br />
                {location.postalCode ? `${location.postalCode} ` : ""}
                {location.city}, woj. {regionLabels[location.region].toLowerCase()}
              </address>
            </div>
            <div>
              <h2 className="display-sm">Zakres</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {location.services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="display-sm">Godziny otwarcia</h2>
              {location.hours ? (
                <dl className="ui mt-2 text-[0.9375rem]">
                  {location.hours.map((h) => (
                    <div key={h.label} className="flex justify-between gap-4 border-b border-line py-2">
                      <dt>{h.label}</dt>
                      <dd className="font-semibold">{h.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-2 text-muted">
                  {location.type === "hurtownia" ? "Godziny otwarcia potwierdzisz w Dziale Zbytu." : "Godziny otwarcia potwierdzisz w sekretariacie firmy."}
                </p>
              )}
            </div>
            <div>
              <h2 className="display-sm">Skąd pochodzi adres</h2>
              <p className="mt-2">{verification.long}</p>
              <p className="ui mt-2 text-[0.9375rem] text-muted">
                Źródło:{" "}
                {location.sourceUrl ? (
                  <a href={location.sourceUrl} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 font-semibold text-ink">
                    {location.source}
                    <ExternalIcon size={14} />
                    <span className="sr-only">(otwiera się w nowej karcie)</span>
                  </a>
                ) : (
                  location.source
                )}
              </p>
            </div>
            <div className="border-t border-line pt-8">
              <DepartmentContact department={contact} />
            </div>
            <DemoNote>
              Godziny i telefon punktu uzupełnia się w pliku <code>src/content/locations.ts</code> po otrzymaniu danych od firmy.
            </DemoNote>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <MapEmbed query={location.mapsQuery} label={location.name} />
          </div>
        </div>
      </section>

      <nav aria-labelledby="inne-punkty" className="border-t border-line bg-surface py-14">
        <div className="container-x">
          <h2 id="inne-punkty" className="display-md">
            {sameCity.length > 0 ? `Inne punkty: ${location.city}` : `Punkty w województwie ${regionLabels[location.region].toLowerCase().replace(/ie$/, "im")}`}
          </h2>
          <ul className="mt-6 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map((l) => (
              <li key={l.slug} className="bg-surface">
                <Link href={`/siec-sprzedazy/${l.slug}`} className="block py-5 hover:text-red sm:p-5">
                  <span className="ui block text-[0.8125rem] font-semibold text-red">{locationTypeLabels[l.type]}</span>
                  <span className="display-sm block">{l.street}</span>
                  <span className="ui text-[0.875rem] text-muted">{l.city}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/siec-sprzedazy" className="btn btn-outline mt-8">
            <ArrowLeft size={18} />
            Wróć do spisu punktów
          </Link>
        </div>
      </nav>
    </>
  );
}
