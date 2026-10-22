import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x section-y text-center">
      <p className="label">Błąd 404</p>
      <h1 className="h2 mx-auto mt-4 max-w-[18ch] text-wine">Ten krok nie prowadzi na żadną stronę</h1>
      <p className="mx-auto mt-5 max-w-[46ch]">Strona mogła zostać przeniesiona albo adres zawiera literówkę. Wróć na stronę główną i zatańczmy od początku.</p>
      <Link href="/" className="btn btn-primary mt-9">
        Strona główna
      </Link>
    </section>
  );
}
