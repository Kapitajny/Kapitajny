import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/ui/PageHead";
import { Photo } from "@/components/ui/Photo";
import { formatDate, journal } from "@/data/journal";

export const metadata: Metadata = {
  title: "Magazyn",
  description: "Notatki ze studia VÉRA o skórze, pielęgnacji, konsultacjach i zabiegach.",
  alternates: { canonical: "/magazyn" },
  openGraph: { title: "Magazyn | VÉRA Aesthetic Studio", url: "/magazyn" },
};

export default function JournalPage() {
  return (
    <>
      <PageHead
        crumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/magazyn", label: "Magazyn" },
        ]}
        title="Notatki dla Ciebie"
        lede="Krótko i konkretnie o skórze, pielęgnacji i o tym, co dzieje się w gabinecie."
      />

      <ul className="shell mx-auto grid max-w-6xl gap-12 pb-24 sm:grid-cols-3 sm:gap-8">
        {journal.map((entry) => (
          <li key={entry.slug} className="text-center">
            <Link href={`/magazyn/${entry.slug}`} className="group block">
              <Photo
                image={entry.image}
                sizes="(min-width: 640px) 28vw, 80vw"
                decorative
                className="capsule mx-auto aspect-[3/4] w-[min(80vw,18rem)]"
                imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
              />
              <p className="mt-6 text-xs text-rose-deep">
                {entry.topic}, <time dateTime={entry.date}>{formatDate(entry.date)}</time>
              </p>
              <h2 className="script mt-2 text-[1.9rem] leading-tight group-hover:text-rose-deep">{entry.title}</h2>
            </Link>
            <p className="mx-auto mt-3 max-w-xs text-sm font-light text-stone">{entry.excerpt}</p>
            <p className="mt-3 text-xs text-stone">{entry.readingMinutes} min czytania</p>
          </li>
        ))}
      </ul>
    </>
  );
}
