import Link from "next/link";

export function CtaBand({
  title = "Sprawdź, ile może kosztować obsługa Twojej firmy",
  text = "Kalkulator pokaże szacunkowy abonament i jego rozbicie na usługi. Wynik możesz przenieść do formularza indywidualnej wyceny.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-navy text-on-navy">
      <div className="shell grid gap-8 py-14 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
        <div>
          <h2 className="max-w-2xl text-white">{title}</h2>
          <p className="mt-4 max-w-2xl text-lg">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/kalkulator" className="btn btn-primary">
            Oblicz abonament
          </Link>
          <Link href="/wycena" className="btn btn-on-dark">
            Poproś o wycenę
          </Link>
        </div>
      </div>
    </section>
  );
}
