import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { ArrowRight } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x relative flex min-h-[70vh] flex-col items-start justify-center py-24">
        <LogoMark accent className="h-14 w-auto" />
        <p className="eyebrow mt-10">Błąd 404</p>
        <h1 className="h2 mt-5 max-w-2xl">Tej strony nie ma – ale możemy zbudować nową</h1>
        <p className="lead mt-5 max-w-xl">Adres mógł się zmienić albo zawierać literówkę. Wróć na stronę główną lub przejdź do usług.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Strona główna
            <ArrowRight />
          </Link>
          <Link href="/uslugi" className="btn btn-secondary">
            Nasze usługi
          </Link>
        </div>
      </div>
    </section>
  );
}
