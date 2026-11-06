import { Reveal } from "@/components/ui/Reveal";
import { reasons } from "@/data/team";
import { SectionHeading } from "./SectionHeading";

export function WhyUsSection() {
  return (
    <section aria-labelledby="dlaczego-title" className="section">
      <div className="container-x">
        <Reveal>
          <SectionHeading eyebrow="Dlaczego my?" title="Sześć powodów, dla których warto nam zaufać" id="dlaczego-title" className="max-w-3xl" />
        </Reveal>
        <ol className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal as="li" key={r.title} delay={(i % 3) * 80} className="border-t-2 border-ink pt-6">
              <span className="font-display text-sm font-semibold tracking-[0.12em] text-red" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-[1.4rem]">{r.title}</h3>
              <p className="mt-3 text-[1rem] leading-relaxed">{r.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
