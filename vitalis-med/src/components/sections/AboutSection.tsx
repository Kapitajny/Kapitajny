import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";
import { SectionHeading } from "./SectionHeading";

export function AboutText() {
  return (
    <div className="space-y-5 text-[1.08rem] leading-relaxed">
      <p>
        Jesteśmy zespołem specjalistów, których łączy wspólny cel – zapewnienie pacjentom profesjonalnej opieki medycznej i bezpiecznego transportu. Naszą
        działalność opieramy na doświadczeniu, zaangażowaniu oraz nowoczesnym zapleczu technicznym.
      </p>
      <p>
        Dysponujemy rozbudowaną flotą ambulansów i zespołem wykwalifikowanych pracowników medycznych. Świadczymy usługi zarówno dla klientów
        indywidualnych, jak i instytucji oraz podmiotów medycznych.
      </p>
      <p>
        Realizujemy również świadczenia w ramach kontraktu z Narodowym Funduszem Zdrowia – zgodnie z posiadanym zakresem umowy.
      </p>
    </div>
  );
}

/** Cztery duże statystyki – wartości edytowalne w `config/site.ts`. */
export function StatsGrid({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <dl className={`grid grid-cols-2 border-t ${dark ? "border-white/15" : "border-line"}`}>
      {siteConfig.stats.map((stat, i) => (
        <div
          key={stat.label}
         
          className={`flex flex-col border-b py-8 ${dark ? "border-white/15" : "border-line"} ${i % 2 === 1 ? `border-l pl-4 sm:pl-10 ${dark ? "border-white/15" : "border-line"}` : "pr-4 sm:pr-10"}`}
        >
          <dt className="order-2 mt-3">
            <span className={`block text-[1.02rem] font-semibold ${dark ? "text-white" : "text-ink"}`}>{stat.label}</span>
            <span className={`mt-1 block text-sm leading-snug ${dark ? "text-white/60" : "text-muted"}`}>{stat.note}</span>
          </dt>
          <dd
            className={`order-1 font-display text-[2.6rem] font-semibold leading-none tracking-tight sm:text-6xl ${dark ? "text-white" : "text-ink"}`}
            style={{ fontStretch: "85%" }}
          >
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function AboutSection() {
  return (
    <section aria-labelledby="o-nas-title" className="section">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionHeading title="Poznaj nas bliżej" id="o-nas-title" />
          <div className="mt-8">
            <AboutText />
          </div>
          <Link href="/o-nas" className="link-arrow mt-9">
            Więcej o firmie
          </Link>
        </Reveal>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-3">
          <StatsGrid />
          <p className="mt-4 text-xs text-muted">Liczby są założeniami projektu demonstracyjnego.</p>
        </div>
      </div>
    </section>
  );
}
