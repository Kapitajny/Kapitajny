import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";

export function Breadcrumbs({ items, className = "" }: { items: { href: string; label: string }[]; className?: string }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Okruszki" className={`text-xs text-stone ${className}`}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-black">
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="hover:text-burgundy">
                      {item.label}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
