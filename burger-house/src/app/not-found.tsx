import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container not-found">
        <h1 className="display h2">Tej strony nie ma w karcie</h1>
        <p className="lead muted">Adres mógł się zmienić albo wkradła się literówka. Wróć na stronę główną albo przejdź prosto do menu.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <Link className="btn" href="/#menu">
            Zobacz menu
          </Link>
          <Link className="btn btn--dark" href="/">
            Strona główna
          </Link>
        </div>
      </div>
    </section>
  );
}
