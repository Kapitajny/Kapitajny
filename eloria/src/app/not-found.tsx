import type { Metadata } from "next";
import Link from "next/link";
import { bookingHref } from "@/config/site";

export const metadata: Metadata = { title: "Nie znaleziono strony" };

export default function NotFound() {
  return (
    <section className="frame flex min-h-[70dvh] flex-col justify-center py-24">
      <p className="text-sm text-champagne-deep">Błąd 404</p>
      <h1 className="mt-4 max-w-3xl text-[clamp(3rem,8vw,6rem)] leading-[0.95]">Tej strony nie ma</h1>
      <p className="mt-6 max-w-md text-taupe">Adres mógł się zmienić albo zawiera literówkę. Zacznij od strony głównej lub przejrzyj zabiegi.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Strona główna
        </Link>
        <Link href="/zabiegi" className="btn btn-outline">
          Zabiegi
        </Link>
        <Link href={bookingHref} className="btn btn-outline">
          Umów konsultację
        </Link>
      </div>
    </section>
  );
}
