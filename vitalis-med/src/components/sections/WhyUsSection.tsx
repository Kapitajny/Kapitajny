import { Reveal } from "@/components/ui/Reveal";
import { reasons } from "@/data/team";
import { SectionHeading } from "./SectionHeading";

export function WhyUsSection() {
  return (
    <section aria-labelledby="dlaczego-title" className="section">
      <div className="container-x">
        <Reveal>
          <SectionHeading title="Dlaczego my?" id="dlaczego-title" className="max-w-3xl" />
        </Reveal>
        <ul className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {reasons.map((r) => (
            <li key={r.title} className="border-t-2 border-ink pt-6">
              <h3 className="text-[1.4rem]">{r.title}</h3>
              <p className="mt-3 text-[1rem] leading-relaxed">{r.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
