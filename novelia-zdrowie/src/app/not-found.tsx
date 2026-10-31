import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x py-24 text-center lg:py-32">
      <p className="eyebrow">Błąd 404</p>
      <h1 className="mt-6 text-[clamp(2.2rem,1.5rem+2.6vw,3.6rem)]">Nie znaleziono strony</h1>
      <p className="mx-auto mt-5 max-w-lg text-lg text-muted">Strona mogła zostać przeniesiona albo adres zawiera błąd.</p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          Strona główna
        </Link>
        <Link href="/sklep" className="btn btn-outline">
          Sklep
        </Link>
      </div>
    </section>
  );
}
