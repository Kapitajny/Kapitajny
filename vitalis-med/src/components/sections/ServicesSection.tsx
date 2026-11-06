import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { orderHref } from "@/config/site";
import { services } from "@/data/services";
import { SectionHeading } from "./SectionHeading";

/** Karty usług – strona główna. */
export function ServicesGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s) => (
        <li key={s.slug} className="card card-lift flex flex-col p-6">
          <span className="icon-badge">
            <Icon name={s.icon} size={24} />
          </span>
          <h3 className="mt-5 text-[1.15rem]">
            <Link href={`/uslugi#${s.slug}`} className="hover:text-red-dark">
              {s.title}
            </Link>
          </h3>
          <p className="mt-2 flex-1 text-[0.97rem] leading-relaxed">{s.summary}</p>
          <Link href={orderHref(s.slug)} className="link-arrow mt-5 self-start text-[0.95rem]" aria-label={`Zapytaj o usługę: ${s.title}`}>
            Zapytaj o&nbsp;usługę
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
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading title="Nasze usługi" id="uslugi-title" />
          <Link href="/uslugi" className="link-arrow self-start sm:self-auto">
            Opis wszystkich usług
          </Link>
        </Reveal>
        <div className="mt-10">
          <ServicesGrid />
        </div>
      </div>
    </section>
  );
}
