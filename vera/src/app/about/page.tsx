import type { Metadata } from "next";
import { BookBand } from "@/components/ui/BookBand";
import { Crumbs } from "@/components/ui/Crumbs";
import { Shot } from "@/components/ui/Shot";
import { JsonLd, breadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "About us",
  description: "VÉRA is an aesthetic medicine and skin studio in Kraków's Kazimierz. Read how we work – and the things we will never do.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About VÉRA Aesthetic Studio", url: "/about" },
};

const will = [
  "Start every plan with a consultation and your medical history.",
  "Explain risks, alternatives and costs before you decide.",
  "Leave you time to think – a plan is valid for weeks, not minutes.",
  "Tell you when a treatment isn't needed.",
];
const wont = [
  "Sell treatment packages you have to use up.",
  "Promise results that no one can guarantee.",
  "Work from before-and-after templates or trends.",
  "Perform medical treatments without a physician.",
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "About us", path: "/about" }])} />
      <section aria-labelledby="about-title" className="bg-burgundy pt-[var(--bar)] text-ivory">
        <div className="wrap grid min-h-[78svh] gap-12 pb-20 pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-28">
          <div className="flex flex-col lg:col-span-8">
            <Crumbs light items={[{ href: "/", label: "Home" }, { href: "/about", label: "About us" }]} />
            <h1 id="about-title" className="display-xl mt-auto pt-16">
              A studio built <span className="italic text-rose-light">around you.</span>
            </h1>
          </div>
          <div className="self-end lg:col-span-4">
            <p className="text-lg text-ivory/85">
              VÉRA opened in a Kazimierz tenement with one idea: aesthetic treatments should make you look more like yourself – never like someone
              else.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-title" className="wrap grid gap-12 py-24 lg:grid-cols-12 lg:gap-8 lg:py-32">
        <h2 id="how-title" className="display-md lg:col-span-4">
          How we work
        </h2>
        <div className="grid gap-8 text-stone sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          <p>
            A physician, two cosmetologists and a skin therapist work from one shared record. Medical treatments are performed only by the physician;
            facials, peels and skin plans by cosmetologists who know when to ask for a medical opinion.
          </p>
          <p>
            We see fewer clients a day than most studios. That leaves time to talk, to explain, and to say no – which we do more often than you might
            expect.
          </p>
        </div>
      </section>

      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/7]">
        <Shot image="aboutStudio" sizes="100vw" />
      </div>

      <section aria-labelledby="promise-title" className="wrap py-24 lg:py-32">
        <h2 id="promise-title" className="display-lg max-w-4xl">
          What we will – and won’t – do
        </h2>
        <div className="mt-14 grid gap-px bg-black/15 md:grid-cols-2">
          <div className="bg-ivory pb-10 md:pr-12">
            <h3 className="kicker text-rose-deep">We will</h3>
            <ul className="mt-6 divide-y divide-black/10 border-t border-black">
              {will.map((w) => (
                <li key={w} className="py-5 font-display text-2xl leading-snug">
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-ivory pb-10 md:pl-12">
            <h3 className="kicker text-rose-deep">We won’t</h3>
            <ul className="mt-6 divide-y divide-black/10 border-t border-black">
              {wont.map((w) => (
                <li key={w} className="py-5 font-display text-2xl leading-snug text-black/60 line-through decoration-rose decoration-1">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="space-title" className="bg-powder">
        <div className="wrap grid items-center gap-12 py-24 lg:grid-cols-12 lg:gap-8 lg:py-32">
          <div className="relative aspect-[3/4] overflow-hidden lg:col-span-5">
            <Shot image="aboutPortrait" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 id="space-title" className="display-md">
              The space
            </h2>
            <p className="mt-8 max-w-lg text-black/80">
              Three private rooms on the first floor of a tenement in Kazimierz: burgundy walls, black stone, daylight from the courtyard. No waiting
              room full of strangers – appointments are spaced so you arrive to a quiet studio.
            </p>
            <p className="mt-5 max-w-lg text-black/80">If you need any help getting to us, let us know when you book – we’ll plan your visit around it.</p>
          </div>
        </div>
      </section>

      <BookBand />
    </>
  );
}
