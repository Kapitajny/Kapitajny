import Link from "next/link";

/** Breadcrumb trail. */
export function Crumbs({ items, light = false }: { items: { href: string; label: string }[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs ${light ? "text-ivory/70" : "text-stone"}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page">{c.label}</span>
            ) : (
              <Link href={c.href} className="underline-hover">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
