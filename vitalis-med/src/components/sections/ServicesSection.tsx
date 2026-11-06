import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { orderHref } from "@/config/site";
import { services } from "@/data/services";
import { SectionHeading } from "./SectionHeading";

/** Siatka usług z liniami podziału (bez kart) – strona główna. */
export function ServicesGrid({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <ul className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s) => (
        <li key={s.slug} className="group relative flex flex-col border-b border-r border-line bg-white p-7 transition-colors duration-300 hover:bg-mist lg:p-8">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-red transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-x-100"
          />
          <Icon name={s.icon} size={34} strokeWidth={1.4} className="text-red" />
          <H className="mt-7 text-[1.3rem] leading-tight">
            <Link href={`/uslugi#${s.slug}`} className="hover:text-red-dark">
              {s.title}
            </Link>
          </H>
          <p className="mt-3 flex-1 text-[0.98rem] leading-relaxed">{s.summary}</p>
          <Link href={orderHref(s.slug)} className="link-arrow mt-6 self-start text-[0.95rem]" aria-label={`Zapytaj o usługę: ${s.title}`}>
            Zapytaj o usługę
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ServicesSection() {
  return (
    <section aria-labelledby="uslugi-title" className="section">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionHeading
              title="Nasze usługi"
              id="uslugi-title"
              lead="Od planowego transportu sanitarnego po zabezpieczenie dużych wydarzeń – każdą usługę organizujemy z tą samą starannością."
            />
          </Reveal>
          <Reveal className="lg:col-span-5 lg:text-right">
            <Link href="/uslugi" className="link-arrow">
              Opis wszystkich usług
            </Link>
          </Reveal>
        </div>
        <Reveal className="mt-14">
          <ServicesGrid />
        </Reveal>
      </div>
    </section>
  );
}
