import { Reveal } from "@/components/ui/Reveal";
import { pillars } from "@/data/morelowa";

export function Philosophy() {
  return (
    <section id="filozofia" aria-labelledby="filozofia-tytul" className="rytm bg-noc">
      <div className="shell">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="etykieta">Nasza filozofia</p>
            <h2 id="filozofia-tytul" className="display-xl mt-6 text-krem">
              Dobre rzeczy <em className="text-zloto italic">potrzebują czasu.</em>
            </h2>
          </div>
          <p className="lead text-mgla lg:col-span-5 lg:col-start-8">
            Nie przyspieszamy fermentacji, nie skracamy wypieku i nie upraszczamy receptur, które się sprawdziły. Na tym opiera się każdy dzień w
            naszej piekarni.
          </p>
        </Reveal>

        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10 lg:mt-24">
          {pillars.map((pillar, index) => (
            <Reveal as="li" key={pillar.title} delay={index * 120} className="border-t border-zloto/60 pt-8">
              <h3 className="text-[2.5rem] text-krem">{pillar.title}</h3>
              <p className="mt-2 text-[0.72rem] font-semibold tracking-[0.24em] text-zloto uppercase">{pillar.lead}</p>
              <p className="mt-5 text-mgla">{pillar.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
