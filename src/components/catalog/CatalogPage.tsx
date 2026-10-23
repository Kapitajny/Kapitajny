import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import type { Product } from "@/data/catalog";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { CatalogFallback, CatalogView, type CatalogScope } from "./CatalogView";

export interface Crumb {
  href: string;
  label: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="Ścieżka" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-x-2">
          {items.map((item, i) => (
            <li key={item.href} className={i > 0 ? "before:mr-2 before:content-['/']" : undefined}>
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-paper">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-paper">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.label, item: `${siteConfig.url}${item.href}` })),
        }}
      />
    </>
  );
}

/** Wspólny układ stron z listą produktów: nagłówek, opcjonalne linki do podkategorii i filtrowana lista. */
export function CatalogPage({
  crumbs,
  title,
  description,
  links,
  products,
  scope,
  searchMode,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  description?: ReactNode;
  links?: { href: string; label: string; current?: boolean }[];
  products: Product[];
  scope?: CatalogScope;
  searchMode?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="wrap pb-24 pt-8 md:pt-10">
      <Breadcrumbs items={crumbs} />
      <header className="@container mt-6 grid gap-6 pb-8 lg:grid-cols-12 lg:items-end">
        <h1 className="display min-w-0 text-[min(12cqi,8.5rem)] lg:col-span-8">{title}</h1>
        {description && <div className="max-w-md text-muted lg:col-span-4 lg:pb-3">{description}</div>}
      </header>
      {links && links.length > 0 && (
        <nav aria-label="Podkategorie" className="no-scrollbar -mx-4 mb-8 overflow-x-auto px-4 md:mx-0 md:px-0">
          <ul className="flex gap-2">
            {links.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className="block border border-line px-4 py-2 text-sm font-semibold hover:border-paper aria-[current=page]:border-paper aria-[current=page]:bg-paper aria-[current=page]:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {children}
      <Suspense fallback={<CatalogFallback products={products} />}>
        <CatalogView products={products} scope={scope} searchMode={searchMode} />
      </Suspense>
    </div>
  );
}
