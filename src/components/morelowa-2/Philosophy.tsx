import { Reveal } from "@/components/ui/Reveal";
import { pillars } from "@/data/morelowa";

/** Mały łuk – powtarzający się motyw koncepcji (otwór pieca). */
function ArchMark() {
  return (
    <svg viewBox="0 0 28 34" aria-hidden="true" className="mx-auto h-9 w-7 text-zloto">
      <path d="M1 33V14a13 13 0 0 1 26 0v19" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 33V15a7 7 0 0 1 14 0v18" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function Philosophy() {
  return (
    <section id="filozofia" aria-labelledby="filozofia-tytul" className="band">
      <div className="wrap">
        <Reveal className="mx-auto max-w-[46rem] text-center">
          <p className="kicker">Nasza filozofia</p>
          <h2 id="filozofia-tytul" className="title-lg mt-6 text-braz">
            Dobre rzeczy <em className="text-bordo italic">potrzebują czasu.</em>
          </h2>
          <p className="intro mt-7 text-szary">
            Nie przyspieszamy fermentacji, nie skracamy wypieku i nie upraszczamy receptur, które się sprawdziły. Tak pracujemy od pierwszego dnia.
          </p>
        </Reveal>

        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-linia lg:mt-20">
          {pillars.map((pillar, index) => (
            <Reveal as="li" key={pillar.title} delay={index * 120} className="text-center md:px-8 lg:px-12">
              <ArchMark />
              <h3 className="mt-6 text-[2.3rem] text-braz italic">{pillar.title}</h3>
              <p className="mt-2 text-[0.72rem] font-medium tracking-[0.24em] text-bordo uppercase">{pillar.lead}</p>
              <p className="mx-auto mt-5 max-w-[22rem] text-[1rem] text-szary">{pillar.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
