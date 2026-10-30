import type { Metadata } from "next";
import Link from "next/link";
import { Crumbs } from "@/components/ui/Crumbs";
import { JournalList } from "@/components/ui/JournalList";
import { Shot } from "@/components/ui/Shot";
import { JsonLd, breadcrumbs } from "@/components/seo/JsonLd";
import { articles, formatDate } from "@/data/journal";
import { resolveImage } from "@/lib/images.server";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes from VÉRA Aesthetic Studio on skin care, treatments and preparing for your first consultation.",
  alternates: { canonical: "/journal" },
  openGraph: { title: "Journal – VÉRA Aesthetic Studio", url: "/journal" },
};

export default function JournalPage() {
  const [featured, ...rest] = articles;
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Journal", path: "/journal" }])} />
      <header className="wrap pb-12 pt-[calc(var(--bar)+2.5rem)]">
        <Crumbs items={[{ href: "/", label: "Home" }, { href: "/journal", label: "Journal" }]} />
        <h1 className="display-xl mt-12">Journal</h1>
      </header>

      <section aria-labelledby="featured" className="wrap">
        <Link href={`/journal/${featured.slug}`} className="group grid gap-10 border-t border-black pt-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="kicker text-rose-deep">Latest / {featured.category}</p>
            <h2 id="featured" className="display-lg mt-6 group-hover:italic">
              {featured.title}
            </h2>
            <p className="mt-6 max-w-lg text-lg text-stone">{featured.dek}</p>
            <p className="mt-8 text-sm text-stone">
              <time dateTime={featured.date}>{formatDate(featured.date)}</time> – {featured.readingMinutes} min read
            </p>
          </div>
          {/* The supplied image is small (259 px), so it is shown at a modest size instead of full width. */}
          <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden lg:col-span-4 lg:col-start-9 lg:self-end">
            <Shot image={featured.image} sizes="(min-width: 1024px) 384px, 100vw" />
          </div>
        </Link>
      </section>

      <section aria-labelledby="all-articles" className="wrap py-24">
        <h2 id="all-articles" className="sr-only">
          All articles
        </h2>
        <JournalList
          items={rest.map((a) => ({ slug: a.slug, title: a.title, dek: a.dek, category: a.category, date: a.date, dateLabel: formatDate(a.date), minutes: a.readingMinutes, image: resolveImage(a.image) }))}
        />
      </section>
    </>
  );
}
