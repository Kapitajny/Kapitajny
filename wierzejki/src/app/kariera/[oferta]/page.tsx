import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { jobOffers } from "@/content/careers";
import { pageMetadata } from "@/lib/metadata";
import { JobOfferView } from "@/components/careers/JobOfferView";
import { JsonLd } from "@/components/ui/JsonLd";
import { company } from "@/content/company";

/** Podstrony powstają wyłącznie dla ogłoszeń wpisanych w `content/careers.ts`. */
export const dynamicParams = false;

export function generateStaticParams() {
  return jobOffers.map((o) => ({ oferta: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/kariera/[oferta]">): Promise<Metadata> {
  const { oferta } = await params;
  const offer = jobOffers.find((o) => o.slug === oferta);
  if (!offer) return {};
  return pageMetadata({ title: `${offer.title} – praca`, description: offer.summary, path: `/kariera/${offer.slug}` });
}

export default async function JobOfferPage({ params }: PageProps<"/kariera/[oferta]">) {
  const { oferta } = await params;
  const offer = jobOffers.find((o) => o.slug === oferta);
  if (!offer) notFound();

  return (
    <>
      <JobOfferView offer={offer} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: offer.title,
          description: [offer.summary, ...offer.responsibilities, ...offer.requirements].join(" "),
          datePosted: offer.publishedAt,
          ...(offer.validUntil ? { validThrough: offer.validUntil } : {}),
          employmentType: offer.employmentType,
          hiringOrganization: { "@type": "Organization", name: company.legalName },
          jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: offer.place, addressCountry: "PL" } },
        }}
      />
    </>
  );
}
