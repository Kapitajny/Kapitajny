import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center lg:py-40">
      <p className="eyebrow">Błąd 404</p>
      <h1 className="mt-5 text-[clamp(2.6rem,1.6rem+3.6vw,5rem)]">
        Tej strony <em className="italic text-latte">nie ma w menu.</em>
      </h1>
      <p className="mx-auto mt-6 max-w-md text-muted">Adres mógł się zmienić albo zawierać literówkę. Wróć na stronę główną i wybierz coś dobrego.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Strona główna
        </Link>
        <Link href="/#menu" className="btn btn-secondary">
          Nasze menu
        </Link>
      </div>
    </div>
  );
}
