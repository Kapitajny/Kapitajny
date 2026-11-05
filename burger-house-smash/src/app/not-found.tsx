import Link from "next/link";

export default function NotFound() {
  return (
    <section className="sub-hero sub-hero--404">
      <div className="wrap">
        <h1 className="sub-hero__title">Tej strony nie ma</h1>
        <p className="sub-hero__lead">Adres mógł się zmienić albo pozycja zniknęła z karty.</p>
        <Link className="btn btn--order btn--lg" href="/#menu">
          Zobacz menu
        </Link>
      </div>
    </section>
  );
}
