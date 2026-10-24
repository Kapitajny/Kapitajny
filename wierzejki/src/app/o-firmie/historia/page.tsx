import Link from "next/link";
import { company } from "@/content/company";
import { history, recognitions } from "@/content/history";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { DemoNote } from "@/components/ui/DemoNote";
import { Seal } from "@/components/ui/Seal";

export const metadata = pageMetadata({
  title: "Historia firmy",
  description:
    "Historia Zakładu Mięsnego Wierzejki: założenie w 1991 roku przez braci Jana i Marka Zdanowskich oraz budowa zakładu w Płudach w latach 2004–2008.",
  path: "/o-firmie/historia",
});

export default function HistoryPage() {
  return (
    <>
      <PageIntro
        crumbs={[
          { href: "/o-firmie", label: "O firmie" },
          { href: "/o-firmie/historia", label: "Historia" },
        ]}
        title="Od Wierzejek do Płud"
        lead={<p>Kronika firmy od grudnia {company.foundedYear} roku – na podstawie zapisów zakładu.</p>}
      />

      <section aria-label="Oś czasu" className="py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-32">
              <Seal className="w-48 rotate-[-6deg]" />
            </div>
          </div>
          <ol className="relative lg:col-span-8 lg:col-start-5">
            <span aria-hidden="true" className="absolute bottom-2 left-[0.3rem] top-2 w-px bg-ink/20" />
            {history.map((event) => (
              <li key={event.id} className="relative pb-16 pl-10 last:pb-0">
                <span aria-hidden="true" className="absolute left-0 top-4 h-3 w-3 bg-red" />
                <p
                  className="text-[clamp(3.5rem,2.5rem+4vw,6.5rem)] font-extrabold leading-[0.9] text-ink"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {event.year}
                </p>
                <p className="ui mt-3 text-[0.9375rem] font-semibold text-red">{event.date}</p>
                <h2 className="display-md mt-3">{event.title}</h2>
                <p className="mt-3 max-w-[38rem] text-[1.125rem]">{event.text}</p>
                <p className="ui mt-3 text-[0.8125rem] text-muted">Źródło: {event.source}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="wyroznienia" className="bg-surface py-20 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="wyroznienia" className="display-md">
              Wyróżnienia
            </h2>
            <p className="mt-4 text-muted">Nagrody i tytuły wymienione w materiałach firmy.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ul className="divide-y divide-line border-y border-line">
              {recognitions.map((r) => (
                <li key={r.title} className="grid gap-2 py-5 sm:grid-cols-[5rem_1fr] sm:gap-6">
                  <span className="display-sm text-red">{r.year ?? "–"}</span>
                  <span>
                    <span className="display-sm block text-[1.25rem]">{r.title}</span>
                    <span className="ui mt-1 block text-[0.8125rem] text-muted">Źródło: {r.source}</span>
                  </span>
                </li>
              ))}
            </ul>
            <DemoNote className="mt-6">
              Kronika firmy zawiera też wpis z 11 września 2012 roku, którego treści nie udało się odczytać. Lata części wyróżnień oraz
              dalsze wydarzenia (np. rozwój sieci sklepów) firma może uzupełnić w pliku <code>src/content/history.ts</code>.
            </DemoNote>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x flex flex-wrap items-center justify-between gap-6">
          <p className="display-sm max-w-[36rem]">Zobacz, jak dziś działa zakład w Płudach.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/jakosc-i-produkcja" className="btn btn-red">
              Jakość i produkcja
            </Link>
            <Link href="/o-firmie" className="btn btn-outline">
              Wróć do strony O firmie
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
