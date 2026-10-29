import Link from "next/link";
import { serviceNav } from "@/config/site";

export const metadata = { title: "Nie znaleziono strony", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="bg-mist">
      <div className="shell grid gap-12 py-20 sm:py-28 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
        <div>
          <p className="kicker">Błąd 404</p>
          <h1 className="mt-4 max-w-2xl">Tej strony nie ma w naszej ewidencji.</h1>
          <p className="lede mt-5">
            Adres mógł się zmienić albo zawierać literówkę. Sprawdź go lub przejdź do jednej z poniższych stron.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">
              Wróć na stronę główną
            </Link>
            <Link href="/kalkulator" className="btn btn-outline">
              Oblicz abonament
            </Link>
          </div>
        </div>
        <nav aria-label="Popularne strony" className="panel p-5">
          <p className="text-sm font-semibold text-navy">Popularne strony</p>
          <ul className="mt-3 space-y-1">
            {[...serviceNav, { href: "/cennik", label: "Cennik" }, { href: "/baza-wiedzy", label: "Baza wiedzy" }, { href: "/kontakt", label: "Kontakt" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex min-h-10 items-center text-ink hover:text-blue-ink hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
