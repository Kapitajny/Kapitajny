import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nie znaleziono strony",
  description: "Ta strona nie istnieje. Przejdź na stronę główną gabinetu lub do kontaktu.",
};

export default function NotFound() {
  return (
    <div className="page py-28 text-center lg:py-40">
      <h1 className="text-h1">Nie znaleźliśmy tej strony</h1>
      <p className="mx-auto mt-6 max-w-md text-muted">Adres mógł się zmienić albo zawierać literówkę. Wróć na stronę główną lub skontaktuj się z nami.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Strona główna
        </Link>
        <Link href="/kontakt" className="btn btn-outline">
          Kontakt
        </Link>
      </div>
    </div>
  );
}
