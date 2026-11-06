import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

/** Nagłówek podstrony: okruszki, H1, krótki opis i opcjonalne zdjęcie – na jasnym panelu, jak w serwisach medycznych. */
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
    <section className="bg-white pt-6 lg:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <div className="container-x">
        <nav aria-label="Okruszki" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-ink hover:underline">
                Strona główna
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-ink">
              {crumb}
            </li>
          </ol>
        </nav>
        <div className={`panel mt-4 grid overflow-hidden ${image ? "lg:grid-cols-2" : ""}`}>
          <div className="px-6 py-9 sm:px-10 lg:px-12 lg:py-12">
            <h1 className="h-display hero-in">{title}</h1>
            {lead && (
              <div className="hero-in mt-4 max-w-2xl text-[1.05rem] leading-relaxed" style={{ ["--d" as string]: "80ms" }}>
                {lead}
              </div>
            )}
            {children && (
              <div className="hero-in mt-7" style={{ ["--d" as string]: "160ms" }}>
                {children}
              </div>
            )}
          </div>
          {image && (
            <div className="relative aspect-[3/2] lg:aspect-auto lg:min-h-[18rem]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="eager"
                fetchPriority="high"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
