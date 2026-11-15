import Link from "next/link";

// Strona 404 korzysta wyłącznie ze stylów globalnych: jest częścią wspólnego layoutu,
// więc import modułu CSS powodowałby wstępne ładowanie jego arkusza na każdej stronie.
export default function NotFound() {
  return (
    <section className="theme-dark section not-found">
      <div className="container">
        <h1 className="not-found-title">Nie ma takiej strony</h1>
        <p className="lead">Adres mógł się zmienić albo zawiera literówkę. Sprawdź usługi i cennik lub wróć na stronę główną.</p>
        <div className="not-found-actions">
          <Link href="/uslugi" className="btn btn-primary">
            Usługi i cennik
          </Link>
          <Link href="/" className="btn btn-secondary">
            Strona główna
          </Link>
        </div>
      </div>
    </section>
  );
}
