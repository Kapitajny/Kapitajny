import Link from "next/link";
import { Photo } from "@/components/ui/Photo";

const principles = [
  { title: "Assessment before treatment", text: "No procedure is booked without a consultation. Sometimes the right plan is home care, or nothing at all." },
  { title: "Restraint as a standard", text: "We work in small, reviewed steps. It is easier to add than to undo." },
  { title: "Your features, not a trend", text: "Your own proportions are the reference – not a filter, a celebrity or last season's look." },
];

export function Philosophy() {
  return (
    <section id="philosophy" aria-labelledby="philosophy-title" className="shell py-24 sm:py-32 lg:py-44">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <h2 id="philosophy-title" className="marker text-rose-deep">
            Our philosophy
          </h2>
          <p className="mt-8 font-serif text-[clamp(2rem,4.6vw,4.25rem)] font-light leading-[1.06] tracking-[-0.01em] text-black">
            Beauty is not a standard to reach. It is something you already have – our work is to look after it, refine it and leave it unmistakably yours.
          </p>
          <Link href="/about" className="link-line mt-10 inline-block text-sm font-semibold text-burgundy">
            About the studio
          </Link>
        </div>
        <div className="sm:ml-auto sm:w-2/3 lg:col-span-3 lg:col-start-10 lg:mt-40 lg:w-full">
          <Photo image="profile" sizes="(min-width: 1024px) 22vw, (min-width: 640px) 60vw, 100vw" className="aspect-[4/5]" />
        </div>
      </div>

      <dl className="mt-20 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:mt-28">
        {principles.map((p) => (
          <div key={p.title} className="border-t border-black pt-6">
            <dt className="font-serif text-2xl leading-snug">{p.title}</dt>
            <dd className="mt-3 max-w-xs text-sm text-stone">{p.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
