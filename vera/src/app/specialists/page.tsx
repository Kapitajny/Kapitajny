import type { Metadata } from "next";
import Link from "next/link";
import { bookHref } from "@/config/site";
import { BookBand } from "@/components/ui/BookBand";
import { Crumbs } from "@/components/ui/Crumbs";
import { DemoNote } from "@/components/ui/DemoNote";
import { Shot } from "@/components/ui/Shot";
import { JsonLd, breadcrumbs } from "@/components/seo/JsonLd";
import { specialists } from "@/data/specialists";

export const metadata: Metadata = {
  title: "Our specialists",
  description: "Meet the VÉRA team: an aesthetic medicine physician, a cosmetologist, a skin therapist and our client experience lead.",
  alternates: { canonical: "/specialists" },
  openGraph: { title: "Our specialists – VÉRA Aesthetic Studio", url: "/specialists" },
};

export default function SpecialistsPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Our specialists", path: "/specialists" }])} />
      <header className="wrap pb-16 pt-[calc(var(--bar)+2.5rem)] lg:pb-24">
        <Crumbs items={[{ href: "/", label: "Home" }, { href: "/specialists", label: "Our specialists" }]} />
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h1 className="display-xl lg:col-span-8">
            Our <span className="italic text-burgundy">specialists</span>
          </h1>
          <nav aria-label="Specialists on this page" className="lg:col-span-4">
            <ul className="divide-y divide-black/15 border-y border-black/15 text-sm">
              {specialists.map((s) => (
                <li key={s.slug}>
                  <a href={`#${s.slug}`} className="flex justify-between gap-4 py-3 hover:text-burgundy">
                    <span>{s.name}</span>
                    <span className="text-stone">{s.discipline}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="border-t border-black">
        {specialists.map((s, i) => (
          <article key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-name`} className={`scroll-mt-20 border-b border-black/15 ${i % 2 === 1 ? "bg-powder/50" : ""}`}>
            <div className="wrap grid gap-10 py-16 lg:grid-cols-12 lg:gap-8 lg:py-24">
              <div className={`relative aspect-[4/5] overflow-hidden lg:col-span-4 ${i % 2 === 1 ? "lg:order-2 lg:col-start-9" : ""}`}>
                <Shot image={s.image} sizes="(min-width: 1024px) 32vw, 100vw" />
              </div>
              <div className={`flex flex-col lg:col-span-7 ${i % 2 === 1 ? "lg:order-1 lg:col-start-1" : "lg:col-start-6"}`}>
                <p className="kicker text-rose-deep">{s.role}</p>
                <h2 id={`${s.slug}-name`} className="display-lg mt-4">
                  {s.name}
                </h2>
                <blockquote className="mt-8 max-w-xl font-display text-2xl italic leading-snug text-burgundy">“{s.quote}”</blockquote>
                <details className="group mt-10 max-w-xl border-t border-black/20">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                    <span>About {s.name.replace(/^Dr /, "").split(" ")[0]}</span>
                    <span aria-hidden="true" className="relative size-3">
                      <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                      <span className="absolute inset-y-0 left-1/2 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
                    </span>
                  </summary>
                  <div className="space-y-4 pb-6 text-black/80">
                    {s.bio.map((p) => (
                      <p key={p.slice(0, 30)}>{p}</p>
                    ))}
                  </div>
                </details>
                <div className="mt-auto pt-8">
                  <h3 className="kicker text-stone">Focus</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {s.focus.map((f) => (
                      <li key={f} className="border border-black/20 px-3 py-1.5 text-xs">
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={bookHref} className="underline-draw mt-8 inline-block text-sm font-medium">
                    Book a consultation
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="wrap py-12">
        <DemoNote>The people on this page are fictional – a ComputerIT demo concept. Replace them with the studio&apos;s real team before launch.</DemoNote>
      </div>
      <BookBand title="Not sure who to see?" />
    </>
  );
}
