import { Reveal } from "@/components/ui/Reveal";
import { pillars } from "@/data/morelowa";

export function Philosophy() {
  return (
    <section id="filozofia" aria-labelledby="filozofia-tytul" className="section-y">
      <div className="container-m grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:sticky lg:top-36 lg:col-span-5 lg:self-start lg:pr-8">
          <p className="eyebrow">Nasza filozofia</p>
          <h2 id="filozofia-tytul" className="display-2 mt-6 text-braz">
            Dobre rzeczy <em className="font-normal text-bordo italic">potrzebują czasu.</em>
          </h2>
          <p className="lead mt-7 text-szary">
            Nie przyspieszamy fermentacji, nie skracamy wypieku i nie upraszczamy receptur, które się sprawdziły. Codzienna praca w piekarni opiera
            się u nas na trzech prostych zasadach.
          </p>
        </Reveal>

        <ol className="border-t border-braz/80 lg:col-span-7 lg:col-start-6">
          {pillars.map((pillar, index) => (
            <Reveal
              as="li"
              key={pillar.title}
              delay={index * 120}
              className="grid gap-3 border-b border-linia py-9 sm:grid-cols-[5.5rem_1fr] sm:gap-8 lg:py-11"
            >
              <span aria-hidden="true" className="font-serif text-[2.6rem] leading-none text-zloto-tekst italic">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="display-3 text-braz">
                  {pillar.title}
                  <span className="mt-2 block font-sans text-[0.72rem] font-semibold tracking-[0.2em] text-bordo uppercase">{pillar.lead}</span>
                </h3>
                <p className="mt-4 max-w-[34rem] text-szary">{pillar.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
