import Link from "next/link";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/ui/JsonLd";
import { ChevronRight } from "@/components/ui/Icons";

export interface Crumb {
  href: string;
  label: string;
}

/** Okruszki z danymi strukturalnymi BreadcrumbList. Ostatni element to bieżąca strona. */
export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all = [{ href: "/", label: "Strona główna" }, ...items];
  return (
    <nav aria-label="Okruszki" className={`ui text-[0.8125rem] ${tone === "light" ? "text-on-dark/75" : "text-muted"}`}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {all.map((item, i) => {
          const last = i === all.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className={tone === "light" ? "text-on-dark" : "text-ink"}>
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="link">
                    {item.label}
                  </Link>
                  <ChevronRight size={14} />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: `${siteConfig.url}${item.href}`,
          })),
        }}
      />
    </nav>
  );
}
