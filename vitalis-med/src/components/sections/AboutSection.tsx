import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";
import { SectionHeading } from "./SectionHeading";

export function AboutText() {
  return (
    <div className="space-y-4 text-[1.05rem] leading-relaxed">
      <p>
        Jesteśmy zespołem specjalistów, których łączy wspólny cel: zapewnienie pacjentom profesjonalnej opieki medycznej i&nbsp;bezpiecznego transportu. Naszą
        działalność opieramy na doświadczeniu, zaangażowaniu oraz nowoczesnym zapleczu technicznym.
      </p>
      <p>
        Dysponujemy rozbudowaną flotą ambulansów i&nbsp;zespołem wykwalifikowanych pracowników medycznych. Świadczymy usługi zarówno dla klientów
        indywidualnych, jak i&nbsp;instytucji oraz podmiotów medycznych.
      </p>
      <p>Realizujemy również świadczenia w&nbsp;ramach kontraktu z&nbsp;Narodowym Funduszem Zdrowia, zgodnie z&nbsp;posiadanym zakresem umowy.</p>
    </div>
  );
}

/** Cztery statystyki – wartości edytowalne w `config/site.ts`. */
export function StatsGrid({ columns = 4 }: { columns?: 2 | 4 }) {
  return (
    <dl className={`grid grid-cols-2 gap-3 ${columns === 4 ? "lg:grid-cols-4" : ""}`}>
      {siteConfig.stats.map((stat) => (
        <div key={stat.label} className="card flex flex-col px-5 py-6 text-center">
          <dt className="order-2 mt-2 text-[0.95rem] font-bold leading-snug text-ink">{stat.label}</dt>
          <dd className="order-1 text-[2.1rem] font-black leading-none text-red sm:text-[2.5rem]">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function AboutSection() {
  return (
    <section aria-labelledby="o-nas-title" className="section">
      <div className="container-x grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading title="Poznaj nas bliżej" id="o-nas-title" />
          <div className="mt-6">
            <AboutText />
          </div>
          <Link href="/o-nas" className="btn btn-outline mt-8">
            Więcej o&nbsp;firmie
          </Link>
        </Reveal>
        <div className="lg:pt-14">
          <StatsGrid columns={2} />
          <p className="mt-3 text-xs text-muted">Liczby są założeniami projektu demonstracyjnego.</p>
        </div>
      </div>
    </section>
  );
}
