import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hours } from "@/components/Hours";
import { IconPhone } from "@/components/Icons";
import { MapEmbed } from "@/components/MapEmbed";
import { OpenPill } from "@/components/OpenStatus";
import { getLocation, LOCATIONS, mapsDirectionsUrl } from "@/data/locations";
import { SITE } from "@/data/site";

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/lokale/[slug]">): Promise<Metadata> {
  const loc = getLocation((await params).slug);
  if (!loc) return {};
  return {
    title: `${loc.city}, ${loc.street}`,
    description: `BUŁA smash burger ${loc.city}, ${loc.street}. Godziny otwarcia, telefon ${loc.phone.display} i mapa dojazdu.`,
    alternates: { canonical: `/lokale/${loc.slug}` },
    openGraph: { images: [{ url: loc.image.src, width: 1536, height: 1024, alt: loc.image.alt }] },
  };
}

export default async function LocationPage({ params }: PageProps<"/lokale/[slug]">) {
  const loc = getLocation((await params).slug);
  if (!loc) notFound();
  const other = LOCATIONS.find((l) => l.slug !== loc.slug)!;
  return (
    <>
      <section className="sub-hero" aria-labelledby="loc-title">
        <div className="wrap">
          <nav className="crumbs" aria-label="Okruszki">
            <Link href="/">Strona główna</Link>
            <span aria-hidden="true">/</span>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#lokale">Lokale</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{loc.city}</span>
          </nav>
          <h1 id="loc-title" className="sub-hero__title">
            {loc.city}
          </h1>
          <p className="sub-hero__lead">
            {loc.street}, {loc.district}
          </p>
        </div>
      </section>

      <section className="spot wrap" aria-label={`Lokal ${loc.city}`}>
        <div className="spot__photo">
          <Image src={loc.image.src} alt={loc.image.alt} width={1536} height={1024} sizes="(max-width: 900px) 92vw, 56vw" quality={85} preload />
        </div>
        <div className="spot__info">
          <OpenPill loc={loc} />
          <p className="spot__intro">{loc.intro}</p>
          <address className="place__addr">
            {loc.street}
            <br />
            {loc.postalCode}
          </address>
          <Hours hours={loc.hours} />
          <ul className="spot__feats">
            {loc.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="place__acts">
            <a className="btn btn--order" href={SITE.phone.href}>
              <IconPhone className="btn__ico" />
              Zamów teraz
            </a>
            <a className="link num" href={loc.phone.href}>
              Telefon lokalu: {loc.phone.display}
            </a>
          </div>
        </div>
      </section>

      <section className="wrap spot__map" aria-label="Mapa dojazdu">
        <MapEmbed query={loc.mapQuery} title={`Mapa: BUŁA ${loc.city}, ${loc.street}`} directionsUrl={mapsDirectionsUrl(loc.mapQuery)} />
        <p className="spot__other">
          Drugi lokal:{" "}
          <Link className="link" href={`/lokale/${other.slug}`}>
            {other.city}, {other.street}
          </Link>
        </p>
      </section>
    </>
  );
}
