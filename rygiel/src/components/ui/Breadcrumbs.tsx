import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";
import styles from "./Breadcrumbs.module.css";

export type Crumb = { href: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ href: "/", label: "Strona główna" }, ...items];
  return (
    <>
      <nav aria-label="Ścieżka nawigacji" className={styles.nav}>
        <ol className={styles.list}>
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={crumb.href} className={styles.item}>
                {isLast ? (
                  <span aria-current="page">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className={styles.link}>
                    {crumb.label}
                  </Link>
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
          itemListElement: trail.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            item: absoluteUrl(crumb.href),
          })),
        }}
      />
    </>
  );
}
