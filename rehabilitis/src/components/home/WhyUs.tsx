import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "./SectionHeading";

const VALUES = [
  {
    title: "Indywidualne podejście do pacjenta",
    text: "Nie ma dwóch takich samych historii. Terapię układamy wokół Twoich potrzeb, możliwości i codziennych aktywności.",
  },
  {
    title: "Zrozumiałe wyjaśnianie kolejnych etapów",
    text: "Mówimy prostym językiem, co robimy i dlaczego. Pytania są mile widziane na każdym etapie terapii.",
  },
  {
    title: "Komfort i poczucie bezpieczeństwa",
    text: "Pracujemy w tempie, które jest dla Ciebie akceptowalne, i reagujemy na to, jak się czujesz podczas wizyty.",
  },
  {
    title: "Rehabilitacja planowana z myślą o Tobie",
    text: "Plan uwzględnia Twoje cele – powrót do pracy, sportu czy swobodnego spaceru – i jest aktualizowany wraz z postępami.",
  },
];

export function WhyUs() {
  return (
    <section aria-labelledby="dlaczego-title" className="section-y relative overflow-hidden bg-forest text-paper">
      {/* Dyskretny łuk w tle – motyw zakresu ruchu */}
      <svg aria-hidden="true" viewBox="0 0 600 600" className="pointer-events-none absolute -right-40 -top-40 w-[38rem] text-paper/[0.07] lg:-right-24">
        <circle cx="300" cy="300" r="280" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="300" cy="300" r="200" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <div className="container-x relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading id="dlaczego-title" eyebrow="Dlaczego warto" tone="light">
            Dlaczego warto wybrać <em className="italic text-sage">nasz gabinet?</em>
          </SectionHeading>
          <blockquote className="mt-10 border-l border-sage/40 pl-6 font-serif text-[clamp(1.35rem,1.15rem+0.8vw,1.75rem)] italic leading-snug text-sage">
            Dobra terapia to taka, w której wiesz, co się dzieje, czujesz się bezpiecznie i masz wpływ na kolejne kroki.
          </blockquote>
        </div>

        <ul className="grid gap-x-10 sm:grid-cols-2 sm:pb-16 lg:col-span-7">
          {VALUES.map((value, i) => (
            <Reveal
              as="li"
              key={value.title}
              delay={(i % 2) * 120}
              className={`border-t border-paper/20 py-8 ${i % 2 === 1 ? "sm:translate-y-16" : ""}`}
            >
              <span aria-hidden="true" className="font-serif text-5xl italic leading-none text-sage/70">
                {["i", "ii", "iii", "iv"][i]}
              </span>
              <h3 className="mt-5 text-[1.6rem] !text-paper">{value.title}</h3>
              <p className="mt-3 leading-relaxed text-paper/80">{value.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
