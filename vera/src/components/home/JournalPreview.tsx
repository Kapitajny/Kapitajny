import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { formatDate, journal } from "@/data/journal";

export function JournalPreview() {
  const [lead, ...rest] = journal;
  return (
    <section aria-labelledby="journal-title" className="shell py-24 sm:py-32 lg:py-40">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="journal-title" className="display text-[clamp(3rem,7vw,6.25rem)] text-burgundy">
          Magazyn
        </h2>
        <Link href="/magazyn" className="link-line self-start text-sm font-semibold text-burgundy sm:self-auto">
          Wszystkie artykuły
        </Link>
      </div>

      <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-8">
        <article className="lg:col-span-7">
          <Link href={`/magazyn/${lead.slug}`} className="group block">
            <div className="overflow-hidden">
              <Photo
                image={lead.image}
                sizes="(min-width: 1024px) 55vw, 100vw"
                decorative
                className="aspect-[5/4]"
                imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
              />
            </div>
            <p className="mt-6 text-xs font-medium text-rose-deep">
              {lead.topic}, <time dateTime={lead.date}>{formatDate(lead.date)}</time>
            </p>
            <h3 className="mt-3 max-w-xl font-serif text-4xl leading-[1.05] sm:text-5xl">
              <span className="link-line bg-[length:0%_1px] group-hover:bg-[length:100%_1px]">{lead.title}</span>
            </h3>
          </Link>
          <p className="mt-4 max-w-lg text-stone">{lead.excerpt}</p>
        </article>

        <ul className="flex flex-col lg:col-span-4 lg:col-start-9 lg:justify-end">
          {rest.map((entry) => (
            <li key={entry.slug} className="border-t border-line py-8 last:border-b">
              <Link href={`/magazyn/${entry.slug}`} className="group block">
                <p className="text-xs font-medium text-rose-deep">
                  {entry.topic}, <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                </p>
                <h3 className="mt-3 font-serif text-3xl leading-[1.08] group-hover:text-burgundy">{entry.title}</h3>
                <p className="mt-3 text-sm text-stone">{entry.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
