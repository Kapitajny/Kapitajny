import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hours } from "@/components/Hours";
import { ArrowIcon, PhoneIcon } from "@/components/Icons";
import { MapEmbed } from "@/components/MapEmbed";
import { getLocation, LOCATIONS, mapsDirectionsUrl } from "@/data/locations";
import { SITE } from "@/data/site";

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/lokale/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return {};
  return {
    title: `Lokal ${loc.city} – ${loc.street}`,
    description: `BUŁA burger house ${loc.city}, ${loc.street}. Godziny otwarcia, telefon ${loc.phone.display}, mapa dojazdu. Zamówienia: ${SITE.phone.display}.`,
    alternates: { canonical: `/lokale/${loc.slug}` },
    openGraph: { images: [{ url: loc.image.src, width: 1536, height: 1024, alt: loc.image.alt }] },
  };
}

export default async function LocationPage({ params }: PageProps<"/lokale/[slug]">) {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) notFound();
  const other = LOCATIONS.find((l) => l.slug !== loc.slug)!;
  const directions = mapsDirectionsUrl(loc.mapQuery);

  return (
    <>
      <section className="page-hero on-dark" aria-labelledby="loc-title">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Okruszki">
            <ol>
              <li>
                <Link href="/">Strona główna</Link>
              </li>
              <li>
                <Link href="/#lokale">Lokale</Link>
              </li>
              <li aria-current="page">{loc.city}</li>
            </ol>
          </nav>
          <h1 id="loc-title" className="display h2">
            BUŁA {loc.city}
          </h1>
          <p className="lead muted" style={{ marginTop: "1rem" }}>
            {loc.street}, {loc.postalCode}
          </p>
        </div>
      </section>

      <section className="section page-light">
        <div className="container">
          <div className="loc-page__grid">
            <div className="loc-page__photo">
              <Image src={loc.image.src} alt={loc.image.alt} fill preload sizes="(max-width: 960px) 100vw, 55vw" quality={85} />
            </div>
            <div className="loc-page__info">
              <p className="lead">{loc.intro}</p>
              <div>
                <h2 className="h3">Godziny otwarcia</h2>
                <Hours hours={loc.hours} />
              </div>
              <div>
                <h2 className="h3">Kontakt</h2>
                <p>
                  Telefon lokalu: <a href={loc.phone.href}>{loc.phone.display}</a>
                  <br />
                  Zamówienia na wynos: <a href={SITE.phone.href}>{SITE.phone.display}</a>
                </p>
              </div>
              <div>
                <h2 className="h3">Na miejscu</h2>
                <ul className="loc-page__features">
                  {loc.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                <a className="btn" href={SITE.phone.href}>
                  <PhoneIcon />
                  Zadzwoń i zamów
                </a>
                <Link className="btn btn--dark" href="/#menu">
                  Zobacz menu
                </Link>
              </div>
            </div>
          </div>

          <MapEmbed query={loc.mapQuery} title={`Mapa: BUŁA ${loc.city}, ${loc.street}`} directionsUrl={directions} />
        </div>
      </section>

      <section className="section on-cream" style={{ paddingBlock: "clamp(2.5rem, 5vw, 4rem)" }}>
        <div className="container other-loc">
          <p className="h3">
            Drugi lokal: {other.city}, {other.street}
          </p>
          <Link className="text-link" href={`/lokale/${other.slug}`}>
            Zobacz lokal
            <ArrowIcon width={18} height={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
