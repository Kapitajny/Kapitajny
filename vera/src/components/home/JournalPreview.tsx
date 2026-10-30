import Link from "next/link";
import { Shot } from "@/components/ui/Shot";
import { articles, formatDate } from "@/data/journal";

export function JournalPreview() {
  const [lead, ...rest] = [articles[1], articles[0], articles[2], articles[3]];
  return (
    <section aria-labelledby="journal-title" className="border-t border-black/10">
      <div className="wrap py-24 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="journal-title" className="display-lg">
            Journal
          </h2>
          <Link href="/journal" className="underline-draw text-sm font-medium">
            All articles
          </Link>
        </div>
        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-8">
          <article className="lg:col-span-7">
            <Link href={`/journal/${lead.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Shot image={lead.image} sizes="(min-width: 1024px) 56vw, 100vw" className="transition-transform duration-700 group-hover:scale-[1.02]" />
              </div>
              <p className="kicker mt-6 text-rose-deep">
                {lead.category} <span aria-hidden="true">/</span> {lead.readingMinutes} min read
              </p>
              <h3 className="mt-3 font-display text-[clamp(2rem,3.4vw,3rem)] leading-tight group-hover:italic">{lead.title}</h3>
              <p className="mt-3 max-w-xl text-stone">{lead.dek}</p>
            </Link>
          </article>
          <ul className="divide-y divide-black/15 border-y border-black/15 lg:col-span-4 lg:col-start-9 lg:self-start">
            {rest.map((a) => (
              <li key={a.slug}>
                <Link href={`/journal/${a.slug}`} className="group grid grid-cols-[1fr_6.5rem] gap-5 py-6">
                  <span>
                    <span className="kicker block text-stone">
                      <time dateTime={a.date}>{formatDate(a.date)}</time>
                    </span>
                    <span className="mt-2 block font-display text-2xl leading-tight group-hover:italic">{a.title}</span>
                  </span>
                  <span className="relative aspect-[4/5] overflow-hidden">
                    <Shot image={a.image} sizes="104px" bare />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
