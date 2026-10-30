import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Photo } from "@/components/ui/Photo";
import { formatDate, journal } from "@/data/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes from the VÉRA studio on skin, care, consultations and treatments.",
  alternates: { canonical: "/journal" },
  openGraph: { title: "Journal | VÉRA Aesthetic Studio", url: "/journal" },
};

export default function JournalPage() {
  return (
    <>
      <section className="shell pb-16 pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/journal", label: "Journal" },
          ]}
        />
        <div className="mt-10 flex flex-col gap-8 border-b border-black pb-10 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="display text-[clamp(3.5rem,13vw,12rem)] text-burgundy">Journal</h1>
          <p className="max-w-sm text-black/80 lg:pb-6">Notes on skin, care and restraint, written by the people who work at the studio.</p>
        </div>
      </section>

      <ol className="shell pb-28">
        {journal.map((entry, i) => (
          <li key={entry.slug} className="border-b border-line">
            <Link href={`/journal/${entry.slug}`} className="group grid gap-6 py-10 sm:grid-cols-12 sm:items-center sm:gap-8 sm:py-14">
              <div className={`sm:col-span-4 ${i % 2 ? "sm:order-2 sm:col-start-9" : ""}`}>
                <div className="overflow-hidden">
                  <Photo
                    image={entry.image}
                    sizes="(min-width: 640px) 33vw, 100vw"
                    decorative
                    className="aspect-[5/4]"
                    imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
                  />
                </div>
              </div>
              <div className={`sm:col-span-7 ${i % 2 ? "sm:order-1 sm:col-start-1" : "sm:col-start-6"}`}>
                <p className="text-xs font-medium text-rose-deep">
                  {entry.topic}, <time dateTime={entry.date}>{formatDate(entry.date)}</time>, {entry.readingMinutes} min read
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-[1.05] group-hover:text-burgundy sm:text-5xl">{entry.title}</h2>
                <p className="mt-4 max-w-lg text-stone">{entry.excerpt}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
