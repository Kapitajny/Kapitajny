import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export type Crumb = { href: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ href: "/", label: "Strona główna" }, ...items];
  return (
    <>
      <nav aria-label="Ścieżka nawigacji" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((item, index) => {
            const last = index === all.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-ink">
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="hover:text-navy hover:underline">
                      {item.label}
                    </Link>
                    <span aria-hidden="true" className="text-line-strong">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: absoluteUrl(item.href),
          })),
        }}
      />
    </>
  );
}
