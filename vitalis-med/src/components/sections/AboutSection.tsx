import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";
import { SectionHeading } from "./SectionHeading";

export function AboutText() {
  return (
    <div className="space-y-4 text-[1.08rem] font-light leading-relaxed text-body">
      <p>
        Jesteśmy zespołem specjalistów, których łączy wspólny cel: zapewnienie pacjentom profesjonalnej opieki medycznej i&nbsp;bezpiecznego transportu.
        Naszą działalność opieramy na doświadczeniu, zaangażowaniu oraz nowoczesnym zapleczu technicznym.
      </p>
      <p>
        Dysponujemy rozbudowaną flotą ambulansów i&nbsp;zespołem wykwalifikowanych pracowników medycznych. Świadczymy usługi zarówno dla klientów
        indywidualnych, jak i&nbsp;instytucji oraz podmiotów medycznych.
      </p>
      <p>Realizujemy również świadczenia w&nbsp;ramach kontraktu z&nbsp;Narodowym Funduszem Zdrowia, zgodnie z&nbsp;posiadanym zakresem umowy.</p>
    </div>
  );
}

/** Cztery statystyki rozdzielone liniami – wartości edytowalne w `config/site.ts`. */
export function StatsGrid() {
  return (
    <dl className="grid grid-cols-2 border-t border-line">
      {siteConfig.stats.map((stat, i) => (
        <div key={stat.label} className={`flex flex-col border-b border-line py-7 ${i % 2 ? "border-l pl-6 lg:pl-8" : "pr-6"}`}>
          <dt className="order-2 mt-2 text-[0.95rem] leading-snug text-muted">{stat.label}</dt>
          <dd className="order-1 text-[2.6rem] font-semibold leading-none tracking-tight text-ink lg:text-[3.1rem]">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function AboutSection() {
  return (
    <section aria-labelledby="o-nas-title" className="section">
      <div className="container-x">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading title="Poznaj nas bliżej" id="o-nas-title" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <AboutText />
            <Link href="/o-nas" className="link-arrow mt-7">
              Więcej o&nbsp;firmie
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 grid items-end gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="relative aspect-[3/2] overflow-hidden rounded-[24px] lg:col-span-7">
            <Image
              src="/images/flota/zdjecie-crafter.webp"
              alt="Ambulans Vitalis Med z włączonymi sygnałami świetlnymi przed bazą"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-5">
            <StatsGrid />
            <p className="mt-3 text-xs text-muted">Liczby są założeniami projektu demonstracyjnego.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
