import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-[var(--header-h)]">
      <p className="wide text-[clamp(4rem,12vw,9rem)] leading-none font-medium tracking-[-0.04em] text-sky">404</p>
      <h1 className="wide mt-6 text-[clamp(1.75rem,3vw,2.5rem)]">Nie ma tu takiej strony.</h1>
      <p className="mt-4 max-w-[32rem] text-slate">Adres mógł się zmienić albo zawierać literówkę. Wróć na stronę główną i wybierz sekcję z menu.</p>
      <Link href="/" className="btn btn-ink mt-8">
        Przejdź na stronę główną
      </Link>
    </div>
  );
}
