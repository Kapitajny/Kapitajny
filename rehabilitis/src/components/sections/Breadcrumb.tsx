import Link from "next/link";

/** Ścieżka nawigacji podstrony. */
export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Ścieżka nawigacji" className="text-small text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="underline underline-offset-4 hover:text-brand">
            Strona główna
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-ink">
          {current}
        </li>
      </ol>
    </nav>
  );
}
