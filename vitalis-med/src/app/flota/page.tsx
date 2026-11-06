import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { FleetBar, TypeBadge } from "@/components/sections/FleetSection";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { orderHref } from "@/config/site";
import { fleet, fleetGallery, fleetTotal } from "@/data/fleet";
import { vehicles } from "@/lib/plural";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Nasza flota – ambulanse typu T, S i P",
  description: "Flota 20 ambulansów: 4 pojazdy transportu sanitarnego typu T, 5 ambulansów specjalistycznych typu S i 11 ambulansów podstawowych typu P.",
  path: "/flota",
});

const fleetStandards = [
  { title: "Zgodność z wymaganiami", text: "Pojazdy i wyposażenie zgodne z obowiązującymi przepisami oraz normą PN-EN 1789 dla ambulansów.", icon: "shield" as const },
  { title: "Gotowość techniczna", text: "Codzienna kontrola przed dyżurem, regularne przeglądy i serwis sprzętu medycznego.", icon: "clipboard" as const },
  { title: "Higiena", text: "Dezynfekcja przedziału medycznego i sprzętu po każdym transporcie pacjenta.", icon: "check" as const },
  { title: "Łączność", text: "Stały kontakt zespołów z dyspozytornią i bieżąca koordynacja przejazdów.", icon: "headset" as const },
];

export default function FleetPage() {
  return (
    <>
      <PageHero
        crumb="Nasza flota"
        title="Nowoczesna flota ambulansów"
        lead={`${fleetTotal} ambulansów w trzech kategoriach – od planowego transportu sanitarnego po pojazdy dla zespołów specjalistycznych.`}
        image={{ src: "/images/flota/hero-flota.webp", alt: "Rząd ambulansów Mercedes-Benz Sprinter przed bazą" }}
      >
        <FleetBar />
      </PageHero>

      <section aria-label="Kategorie ambulansów" className="py-6 lg:py-10">
        <div className="container-x">
          {fleet.map((c, i) => (
            <Reveal
              as="article"
              key={c.type}
              id={`typ-${c.type.toLowerCase()}`}
              className="grid scroll-mt-28 items-center gap-10 border-b border-line py-14 last:border-0 lg:grid-cols-12 lg:gap-16 lg:py-20"
            >
              <div className={`relative aspect-[4/3] overflow-hidden lg:col-span-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <Image src={c.image.src} alt={c.image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              </div>
              <div className="lg:col-span-6">
                <div className="flex items-center gap-5">
                  <TypeBadge type={c.type} size="lg" />
                  <div>
                    <h2 className="text-[clamp(1.8rem,1.4rem+1.2vw,2.5rem)]">{c.name}</h2>
                    <p className="mt-1 font-display text-lg font-semibold text-red" style={{ fontStretch: "90%" }}>
                      {vehicles(c.count)} we flocie
                    </p>
                  </div>
                </div>
                <p className="mt-7 text-[1.08rem] leading-relaxed">{c.summary}</p>
                <p className="mt-4 text-[1rem] leading-relaxed text-muted">{c.description}</p>

                <h3 className="mt-8 text-sm font-semibold text-muted" style={{ fontFamily: "var(--font-sans)" }}>
                  Wybrane wyposażenie
                </h3>
                <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {c.equipment.map((e) => (
                    <li key={e} className="flex gap-3 text-[0.98rem]">
                      <Icon name="check" size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-red" />
                      {e}
                    </li>
                  ))}
                </ul>
                <p className="mt-7 border-l-2 border-ink pl-4 text-[0.98rem] leading-relaxed">
                  <strong className="font-semibold text-ink">Zespół:</strong> {c.crew}
                </p>
              </div>
            </Reveal>
          ))}
          <p className="pb-6 text-xs text-muted">
            Liczba pojazdów i wyposażenie są przykładowe (projekt demonstracyjny). Wyposażenie konkretnego pojazdu zależy od jego przeznaczenia i
            obowiązujących wymagań.
          </p>
        </div>
      </section>

      <section aria-labelledby="galeria-title" className="section border-t border-line bg-mist">
        <div className="container-x">
          <Reveal>
            <SectionHeading title="Pojazdy w gotowości" id="galeria-title" />
          </Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-2">
            {fleetGallery.map((g, i) => (
              <Reveal
                as="li"
                key={g.src}
               
                className={`relative overflow-hidden ${i === 0 ? "aspect-square sm:row-span-2 sm:aspect-auto lg:col-span-3" : "aspect-[3/2] lg:col-span-3"}`}
              >
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="standardy-floty-title" className="section">
        <div className="container-x">
          <Reveal>
            <SectionHeading title="Sprawne pojazdy to bezpieczny pacjent" id="standardy-floty-title" />
          </Reveal>
          <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {fleetStandards.map((s) => (
              <li key={s.title}>
                <Icon name={s.icon} size={30} strokeWidth={1.4} className="text-red" />
                <h3 className="mt-5 text-[1.3rem]">{s.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-14">
            <Link href={orderHref()} className="btn btn-primary">
              Zamów transport medyczny
            </Link>
          </div>
        </div>
      </section>

      <CtaBand title="Nie wiesz, jaki ambulans będzie odpowiedni?" text="Opisz sytuację dyspozytorowi – dobierzemy rodzaj pojazdu i skład zespołu do potrzeb pacjenta." />
    </>
  );
}
