import Link from "next/link";

export default function NotFound() {
  return (
    <div className="on-dark bg-graphite pb-24 pt-36 text-white">
      <div className="wrap">
        <h1 className="display-xl max-w-[12ch]">Tu jest tylko woda</h1>
        <span className="wake mt-6 rotate-[-3deg] w-[min(40rem,90%)]" aria-hidden="true" />
        <p className="mt-6 max-w-lg text-lg text-white/75">Nie znaleźliśmy tej strony. Wróć na przystań i wybierz skuter.</p>
        <Link href="/" className="btn btn-primary mt-8">
          Strona główna
        </Link>
      </div>
    </div>
  );
}
