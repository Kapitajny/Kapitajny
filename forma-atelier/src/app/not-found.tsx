import Link from "next/link";

import { ArchMark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[80svh] flex-col items-start justify-center pt-[var(--header-h)]">
      <ArchMark className="h-14 w-10 text-olive" />
      <h1 className="t-display mt-10 max-w-[16ch]">Tej przestrzeni jeszcze nie zaprojektowaliśmy.</h1>
      <p className="t-body mt-6 max-w-[30rem]">Strona, której szukasz, nie istnieje lub została przeniesiona.</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/" className="btn btn-dark">
          Wróć na stronę główną
        </Link>
        <Link href="/realizacje" className="btn btn-dark">
          Zobacz realizacje
        </Link>
      </div>
    </div>
  );
}
