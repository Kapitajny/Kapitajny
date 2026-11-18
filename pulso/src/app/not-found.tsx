import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <main id="tresc" className="container-plan flex min-h-[80vh] flex-col items-start justify-center gap-6 py-24">
      <Logo />
      <h1 className="t-h2 max-w-[18ch]">Tej strony nie ma w planie.</h1>
      <p className="t-lead max-w-[48ch]">Adres mógł się zmienić albo zawiera literówkę. Wróć na stronę główną.</p>
      <Link href="/" className="btn btn-primary">
        Strona główna
      </Link>
    </main>
  );
}
