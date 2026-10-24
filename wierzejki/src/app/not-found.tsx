import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/content/products";

export const metadata: Metadata = {
  title: "Nie znaleziono strony",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p
            aria-hidden="true"
            data-numeral="404"
            className="before:content-[attr(data-numeral)] text-[clamp(6rem,4rem+10vw,13rem)] font-extrabold leading-[0.8] text-linen-deep"
            style={{ fontFamily: "var(--font-serif)" }}
          />
          <h1 className="display-lg mt-6">Nie ma takiej strony</h1>
          <p className="lead mt-5 max-w-[34rem] text-ink/85">
            Adres mógł się zmienić po przebudowie serwisu albo zawiera literówkę. Zacznij od jednej z poniższych stron.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-red">
              Strona główna
            </Link>
            <Link href="/kontakt" className="btn btn-outline">
              Kontakt
            </Link>
          </div>
        </div>
        <nav aria-labelledby="popularne" className="lg:col-span-4 lg:col-start-9 lg:pt-10">
          <h2 id="popularne" className="label text-muted">
            Często odwiedzane
          </h2>
          <ul className="mt-3 border-t border-line">
            {[
              ...categories.map((c) => ({ href: `/produkty/${c.slug}`, label: c.name })),
              { href: "/dla-biznesu", label: "Oferta dla biznesu" },
              { href: "/siec-sprzedazy", label: "Gdzie kupić" },
              { href: "/kariera", label: "Kariera" },
            ].map((l) => (
              <li key={l.href} className="border-b border-line">
                <Link href={l.href} className="display-sm flex min-h-14 items-center py-3 hover:text-red">
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
