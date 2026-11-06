import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { reasons } from "@/data/team";
import { SectionHeading } from "./SectionHeading";

/** „Dlaczego my?” – nagłówek po lewej, lista argumentów z liniami po prawej. */
export function WhyUsSection() {
  return (
    <section aria-labelledby="dlaczego-title" className="section">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <SectionHeading
            title="Dlaczego my?"
            id="dlaczego-title"
            lead="Sześć rzeczy, które pacjenci, rodziny i placówki medyczne cenią w pracy z naszym zespołem."
          />
        </Reveal>
        <ul className="border-t border-line lg:col-span-7 lg:col-start-6">
          {reasons.map((r) => (
            <li key={r.title} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[1.75rem_minmax(0,16rem)_minmax(0,1fr)] sm:gap-6">
              <Icon name="check" size={22} strokeWidth={2} className="mt-0.5 text-red" />
              <h3 className="text-[1.15rem] leading-snug">{r.title}</h3>
              <p className="font-light leading-relaxed">{r.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
