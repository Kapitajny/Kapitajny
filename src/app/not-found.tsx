import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-24 md:py-32">
      <p className="text-sm text-muted">Błąd 404</p>
      <h1 className="display mt-4 text-[clamp(3rem,1rem+8vw,8rem)]">Nie ma tu nic</h1>
      <p className="mt-6 max-w-md text-muted">Ta strona nie istnieje albo produkt został usunięty z oferty.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/kategoria/bluzy" className="btn btn-light">
          Bluzy
        </Link>
        <Link href="/kategoria/spodnie" className="btn btn-outline">
          Spodnie
        </Link>
        <Link href="/" className="btn btn-outline">
          Strona główna
        </Link>
      </div>
    </div>
  );
}
