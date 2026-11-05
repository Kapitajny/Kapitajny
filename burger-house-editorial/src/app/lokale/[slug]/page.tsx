import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hours } from "@/components/Hours";
import { MapEmbed } from "@/components/MapEmbed";
import { OpenPill } from "@/components/OpenStatus";
import { getLocation, LOCATIONS, mapsDirectionsUrl } from "@/data/locations";
import { SITE } from "@/data/site";

const PHOTO: Record<string, { src: string; w: number; h: number; alt: string }> = {
  warszawa: { src: "/images/warszawa.jpg", w: 1536, h: 1024, alt: "Wnętrze lokalu BUŁA przy Marszałkowskiej z łukowym oknem i długim dębowym stołem" },
  "grodzisk-mazowiecki": { src: "/images/grodzisk.jpg", w: 1136, h: 1408, alt: "Biały budynek lokalu BUŁA w Grodzisku Mazowieckim z czarną witryną" },
};

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/lokale/[slug]">): Promise<Metadata> {
  const loc = getLocation((await params).slug);
  if (!loc) return {};
  return {
    title: `${loc.city}, ${loc.street}`,
    description: `BUŁA burger house ${loc.city}, ${loc.street}. Godziny otwarcia, telefon ${loc.phone.display} i mapa dojazdu.`,
    alternates: { canonical: `/lokale/${loc.slug}` },
  };
}

export default async function LocationPage({ params }: PageProps<"/lokale/[slug]">) {
  const loc = getLocation((await params).slug);
  if (!loc) notFound();
  const other = LOCATIONS.find((l) => l.slug !== loc.slug)!;
  const ph = PHOTO[loc.slug];
  return (
    <>
      <section className="page-top frame" aria-labelledby="loc-title">
        <nav className="crumbs" aria-label="Okruszki">
          <Link href="/">Strona główna</Link>
          <span aria-hidden="true">/</span>
          <Link href="/#lokale">Nasze lokale</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{loc.city}</span>
        </nav>
        <h1 id="loc-title" className="mega page-title">
          {loc.city}
        </h1>
      </section>
      <section className="section frame" style={{ paddingTop: "clamp(2rem, 4vw, 4rem)" }}>
        <div className="grid place__body">
          <figure className="place__photo" style={{ gridColumn: "1 / span 7" }}>
            <Image src={ph.src} alt={ph.alt} width={ph.w} height={ph.h} sizes="(max-width: 760px) 100vw, 58vw" preload />
          </figure>
          <div className="place__info" style={{ gridColumn: "9 / span 4" }}>
            <OpenPill loc={loc} />
            <address>
              {loc.street}
              <br />
              <span className="grey">{loc.postalCode}</span>
            </address>
            <p className="prose grey">{loc.intro}</p>
            <Hours hours={loc.hours} />
            <ul className="facts" style={{ gridTemplateColumns: "1fr" }}>
              {loc.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p>
              Telefon lokalu:{" "}
              <a className="link num" href={loc.phone.href}>
                {loc.phone.display}
              </a>
            </p>
            <div className="place__actions">
              <a className="btn" href={SITE.phone.href}>
                Zamów teraz
              </a>
              <Link className="link" href="/#menu">
                Poznaj menu
              </Link>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "clamp(3rem, 6vw, 6rem)" }}>
          <MapEmbed query={loc.mapQuery} title={`Mapa: BUŁA ${loc.city}, ${loc.street}`} directionsUrl={mapsDirectionsUrl(loc.mapQuery)} />
        </div>
        <p className="title" style={{ marginTop: "clamp(3rem, 6vw, 6rem)" }}>
          Drugi lokal:{" "}
          <Link className="link" href={`/lokale/${other.slug}`}>
            {other.city}, {other.street}
          </Link>
        </p>
      </section>
    </>
  );
}
