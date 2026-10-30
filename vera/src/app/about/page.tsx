import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand";
import { Photo } from "@/components/ui/Photo";

export const metadata: Metadata = {
  title: "About us",
  description: "VÉRA is an aesthetic medicine and skin care studio that starts every treatment with a consultation and works in small, reviewed steps.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About VÉRA Aesthetic Studio", url: "/about" },
};

const refusals = [
  { title: "No treatment without a consultation", text: "Not even a small one. Not even if you have had it elsewhere." },
  { title: "No packages sold at the door", text: "We propose a course only when your skin needs one, and you can stop at any time." },
  { title: "No promised results", text: "Skin responds differently in every person. We tell you what is likely – never what is guaranteed." },
];

export default function AboutPage() {
  return (
    <>
      <section className="shell pb-16 pt-[calc(var(--header-h)+3rem)] sm:pb-24 lg:pt-[calc(var(--header-h)+5rem)]">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/about", label: "About us" },
          ]}
        />
        <h1 className="display mt-10 text-[clamp(3.25rem,10vw,9.5rem)] text-burgundy">
          <span className="block">True to</span>
          <span className="block pl-[0.6em] sm:pl-[1.4em]">your face.</span>
        </h1>
        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12">
          <p className="lede text-black/85 lg:col-span-5 lg:col-start-7">
            VÉRA takes its name from <em>vera</em> – true. We opened the studio for people who want to look after their skin and their face without becoming
            someone else in the process.
          </p>
        </div>
      </section>

      {/* Two rooms side by side, deliberately unequal. */}
      <section aria-label="The studio" className="shell grid gap-4 sm:grid-cols-12 sm:gap-6">
        <Photo image="treatmentRoom" sizes="(min-width: 640px) 66vw, 100vw" className="aspect-[4/3] sm:col-span-8 sm:aspect-[3/2]" />
        <div className="sm:col-span-4 sm:mt-32">
          <Photo image="reception" sizes="(min-width: 640px) 33vw, 100vw" className="aspect-[4/5]" focus="22% 60%" />
          <p className="mt-4 text-xs text-stone">The reception and one of two treatment rooms.</p>
        </div>
      </section>

      <section aria-labelledby="approach-title" className="shell grid gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:gap-8 lg:py-40">
        <h2 id="approach-title" className="display text-[clamp(2.75rem,5.5vw,5rem)] lg:col-span-5">
          Fewer treatments,
          <br />
          better chosen.
        </h2>
        <div className="space-y-6 text-lg leading-relaxed text-black/85 lg:col-span-6 lg:col-start-7">
          <p>
            Most of the people who come to us have already tried something. Often too much, too quickly, or the wrong thing for their skin. So we slow down.
          </p>
          <p>
            Every first visit is a consultation with the specialist who will look after you. We talk, we look at your skin in daylight, and you leave with a
            written plan. Treatments come after – if they are needed at all.
          </p>
          <p>
            Aesthetic medicine procedures are performed by a physician. Facials, peels and hand care are performed by cosmetologists. Each person works only
            within their own field.
          </p>
        </div>
      </section>

      <section aria-labelledby="refuse-title" className="bg-black py-24 text-ivory sm:py-32">
        <div className="shell">
          <h2 id="refuse-title" className="display max-w-4xl text-[clamp(2.75rem,5.5vw,5rem)]">
            What we
            <br />
            <span className="pl-[0.9em]">don&apos;t do</span>
          </h2>
          <ul className="mt-16 divide-y divide-line-light border-y border-line-light">
            {refusals.map((r) => (
              <li key={r.title} className="grid gap-3 py-8 sm:grid-cols-12 sm:gap-8 sm:py-10">
                <h3 className="font-serif text-3xl leading-tight sm:col-span-6 lg:text-4xl">{r.title}</h3>
                <p className="text-ivory/75 sm:col-span-5 sm:col-start-8 sm:self-center">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="space-title" className="shell grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Photo image="facialRitual" sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-square" />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <h2 id="space-title" className="font-serif text-4xl leading-tight sm:text-5xl">
            A quiet place, on purpose
          </h2>
          <p className="mt-6 text-black/85">
            Two treatment rooms, one reception, no waiting room full of strangers. Appointments are spaced so that you are never rushed out and the next
            person is never kept waiting.
          </p>
          <p className="mt-4 text-black/85">The studio is on the ground floor with step-free access from the courtyard.</p>
        </div>
      </section>

      <CtaBand title="Meet us before deciding anything" text="A consultation is an hour with a specialist and a written plan to take home. It commits you to nothing." />
    </>
  );
}
