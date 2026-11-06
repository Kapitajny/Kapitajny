import { Icon, type IconName } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { reasons } from "@/data/team";
import { SectionHeading } from "./SectionHeading";

const icons: IconName[] = ["ambulance", "users", "pulse", "clipboard", "shield", "document"];

export function WhyUsSection() {
  return (
    <section aria-labelledby="dlaczego-title" className="section bg-mist">
      <div className="container-x">
        <Reveal>
          <SectionHeading title="Dlaczego my?" id="dlaczego-title" />
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <li key={r.title} className="card flex gap-4 p-6">
              <span className="icon-badge">
                <Icon name={icons[i % icons.length]} size={22} />
              </span>
              <div>
                <h3 className="text-[1.1rem]">{r.title}</h3>
                <p className="mt-1.5 text-[0.97rem] leading-relaxed">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
