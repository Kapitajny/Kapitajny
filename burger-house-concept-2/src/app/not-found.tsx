import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap" style={{ display: "grid", gap: "1.5rem", justifyItems: "start", minHeight: "50vh", alignContent: "center" }}>
        <h1 className="display h2">Tej strony nie ma w karcie</h1>
        <p className="lead muted">Adres mógł się zmienić. Wróć na stronę główną albo przejdź do menu.</p>
        <Link className="btn" href="/#menu">
          Zobacz menu
        </Link>
      </div>
    </section>
  );
}
