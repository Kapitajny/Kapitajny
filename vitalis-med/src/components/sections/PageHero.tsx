import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

/** Nagłówek podstrony: okruszki, H1, lead i opcjonalne zdjęcie po prawej. */
export function PageHero({
  title,
  lead,
  crumb,
  image,
  children,
}: {
  title: ReactNode;
  lead?: ReactNode;
  crumb: string;
  image?: { src: string; alt: string };
  children?: ReactNode;
}) {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: `${siteConfig.url}/` },
      { "@type": "ListItem", position: 2, name: crumb },
    ],
  };
  return (
    <section className="relative overflow-hidden border-b border-line bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      {image && (
        <div className="relative aspect-[16/9] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[40%]">
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" loading="eager" fetchPriority="high" className="object-cover" />
        </div>
      )}
      <div className="container-x relative">
        <div className={`py-14 lg:py-24 ${image ? "lg:w-[54%]" : "max-w-4xl"}`}>
          <nav aria-label="Okruszki" className="hero-in text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-ink">
                  Strona główna
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">
                {crumb}
              </li>
            </ol>
          </nav>
          <h1 className="h-display hero-in mt-10" style={{ ["--d" as string]: "120ms" }}>
            {title}
          </h1>
          {lead && (
            <div className="lead hero-in mt-6 max-w-2xl" style={{ ["--d" as string]: "180ms" }}>
              {lead}
            </div>
          )}
          {children && (
            <div className="hero-in mt-9" style={{ ["--d" as string]: "240ms" }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
