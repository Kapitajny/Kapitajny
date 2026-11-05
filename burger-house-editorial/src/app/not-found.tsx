import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section frame">
      <h1 className="mega page-title">Nie ma</h1>
      <p className="prose grey" style={{ margin: "1.5rem 0 2rem" }}>
        Tej strony nie ma w naszej karcie. Adres mógł się zmienić.
      </p>
      <Link className="btn" href="/#menu">
        Poznaj menu
      </Link>
    </section>
  );
}
