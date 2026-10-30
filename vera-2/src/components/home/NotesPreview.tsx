import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { formatDate, journal } from "@/data/journal";

export function NotesPreview() {
  return (
    <section aria-labelledby="notes-title" className="py-20 sm:py-28">
      <div className="shell">
        <div className="text-center">
          <h2 id="notes-title" className="script text-[clamp(2.4rem,6vw,4.25rem)]">
            Notatki dla Ciebie
          </h2>
          <p className="mx-auto mt-4 max-w-md font-light text-stone">Krótko i konkretnie o skórze i pielęgnacji – piszą osoby, które pracują w studiu.</p>
        </div>

        <ul className="mx-auto mt-14 max-w-4xl divide-y divide-line border-y border-line">
          {journal.map((entry) => (
            <li key={entry.slug}>
              <Link href={`/magazyn/${entry.slug}`} className="group grid grid-cols-[4.5rem_1fr] items-center gap-5 py-6 sm:grid-cols-[6rem_1fr_auto] sm:gap-8">
                <Photo image={entry.image} sizes="96px" decorative className="oval aspect-[3/4] w-full" />
                <span>
                  <span className="block text-xs text-rose-deep">{entry.topic}</span>
                  <span className="script mt-1 block text-2xl leading-tight group-hover:text-rose-deep sm:text-3xl">{entry.title}</span>
                </span>
                <time dateTime={entry.date} className="col-start-2 text-xs text-stone sm:col-start-auto">
                  {formatDate(entry.date)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
