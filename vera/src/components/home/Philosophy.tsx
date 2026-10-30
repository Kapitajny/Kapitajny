import Link from "next/link";
import { Shot } from "@/components/ui/Shot";

const beliefs = [
  { title: "Your face, not a trend", text: "We don't work towards a template. Every plan starts from your proportions, your skin and what you want to keep." },
  { title: "Less, but better", text: "Small steps with time to review. If a treatment isn't needed, we'll say so." },
  { title: "Medicine first", text: "Medical treatments are performed only by a physician, after a consultation and written consent." },
];

export function Philosophy() {
  return (
    <section id="philosophy" aria-labelledby="philosophy-title" className="relative bg-burgundy text-ivory">
      <div className="wrap grid gap-y-16 py-24 lg:grid-cols-12 lg:gap-x-8 lg:py-36">
        <div className="lg:col-span-8">
          <h2 id="philosophy-title" className="kicker text-rose-light">
            Our philosophy
          </h2>
          <p className="display-lg mt-8 text-ivory">
            Beauty isn’t a standard to reach. <span className="text-rose-light">It’s yours to keep.</span>
          </p>
        </div>
        <div className="relative lg:col-span-3 lg:col-start-10">
          <div className="relative ml-auto aspect-[4/5] w-3/4 overflow-hidden lg:w-full">
            <Shot image="philosophy" sizes="(min-width: 1024px) 24vw, 75vw" />
          </div>
        </div>

        <ul className="grid gap-10 border-t border-ivory/20 pt-10 sm:grid-cols-3 lg:col-span-12">
          {beliefs.map((b) => (
            <li key={b.title}>
              <h3 className="font-display text-2xl">{b.title}</h3>
              <p className="mt-3 max-w-xs text-sm text-ivory/75">{b.text}</p>
            </li>
          ))}
        </ul>
        <Link href="/about" className="underline-draw justify-self-start text-sm font-medium lg:col-span-12">
          Read about the studio
        </Link>
      </div>
    </section>
  );
}
