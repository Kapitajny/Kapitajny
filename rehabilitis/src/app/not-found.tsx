import type { Metadata } from "next";
import Link from "next/link";
import { RangeArc } from "@/components/ui/RangeArc";

export const metadata: Metadata = {
  title: "Nie znaleziono strony",
  description: "Ta strona nie istnieje. Przejdź na stronę główną gabinetu lub do kontaktu.",
};

export default function NotFound() {
  return (
    <div className="content py-section">
      <RangeArc angle={0} className="w-32" />
      <h1 className="mt-8 max-w-[14ch] text-display">Nie znaleźliśmy tej strony</h1>
      <p className="mt-6 max-w-prose text-lead">Adres mógł się zmienić albo zawierać literówkę. Wróć na stronę główną lub skontaktuj się z nami.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Strona główna
        </Link>
        <Link href="/kontakt" className="btn btn-quiet">
          Kontakt
        </Link>
      </div>
    </div>
  );
}
