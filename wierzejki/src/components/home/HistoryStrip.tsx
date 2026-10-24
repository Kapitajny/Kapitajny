import Link from "next/link";
import { history } from "@/content/history";

export function HistoryStrip() {
  return (
    <section aria-labelledby="historia-title" className="border-y border-line bg-linen/60 py-20 lg:py-24">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="historia-title" className="display-lg max-w-[34rem]">
            Siedemnaście lat od pierwszego zakładu do trzeciego etapu budowy
          </h2>
          <Link href="/o-firmie/historia" className="btn btn-outline self-start md:self-auto">
            Cała historia firmy
          </Link>
        </div>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[2.15rem] hidden h-px bg-ink/25 md:block" />
          {history.map((event) => (
            <li key={event.id} className="relative">
              <p
                className="text-[clamp(2.75rem,2rem+2.5vw,4.25rem)] font-extrabold leading-none text-red"
                style={{ fontFamily: "var(--font-sans)", fontVariationSettings: '"wdth" 64' }}
              >
                <time dateTime={String(event.year)}>{event.year}</time>
              </p>
              <span aria-hidden="true" className="absolute left-0 top-[1.9rem] hidden h-2.5 w-2.5 -translate-x-full bg-ink md:block" />
              <h3 className="display-sm mt-5">{event.title}</h3>
              <p className="mt-2 text-[1rem] text-ink/85">{event.text}</p>
            </li>
          ))}
        </ol>
        <p className="ui mt-10 text-[0.8125rem] text-muted">Źródło dat: kronika na dotychczasowej stronie firmy.</p>
      </div>
    </section>
  );
}
