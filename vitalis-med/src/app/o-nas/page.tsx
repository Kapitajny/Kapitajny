import Link from "next/link";
import { AboutText, StatsGrid } from "@/components/sections/AboutSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { TeamSection } from "@/components/sections/TeamSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "O nas – zespół, flota i standardy",
  description: "Poznaj Vitalis Med: zespół około 200 pracowników, flota 20 ambulansów typu T, S i P oraz całodobowa gotowość operacyjna.",
  path: "/o-nas",
});

const values = [
  { title: "Bezpieczeństwo", text: "Procedury, sprawny sprzęt i przeszkolony personel – w każdym przejeździe, bez wyjątków.", icon: "shield" as const },
  { title: "Szacunek", text: "Dbamy o godność i komfort pacjenta oraz jasno informujemy jego bliskich.", icon: "users" as const },
  { title: "Gotowość", text: "Dyspozytornia, zespoły i pojazdy pracują w trybie całodobowym, 7 dni w tygodniu.", icon: "clock" as const },
  {
    title: "Przejrzystość",
    text: "Jasne zasady zamawiania i rozliczeń. Usługi prywatne i świadczenia NFZ są wyraźnie rozdzielone.",
    icon: "document" as const,
  },
];

const standards = [
  "Codzienna kontrola gotowości pojazdów i wyposażenia przed rozpoczęciem dyżuru",
  "Dezynfekcja przedziału medycznego po każdym transporcie",
  "Regularne przeglądy techniczne pojazdów i serwis sprzętu medycznego",
  "Szkolenia doskonalące personelu z zakresu medycznych czynności ratunkowych",
  "Dokumentowanie przebiegu transportu i przekazania pacjenta",
  "Ochrona danych pacjentów zgodnie z RODO i przepisami o prawach pacjenta",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="O nas"
        title="O firmie Vitalis Med"
        lead="Vitalis Med to prywatne pogotowie ratunkowe realizujące transport sanitarny i medyczny, zabezpieczenia wydarzeń oraz obsługę placówek medycznych."
        image={{ src: "/images/flota/zdjecie-crafter.webp", alt: "Ambulans Vitalis Med przed bazą" }}
      />

      <section aria-labelledby="poznaj-title" className="section">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading title="Poznaj nas bliżej" id="poznaj-title" />
            <div className="mt-8">
              <AboutText />
            </div>
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-3">
            <StatsGrid />
            <p className="mt-4 text-xs text-muted">Liczby są założeniami projektu demonstracyjnego.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="wartosci-title" className="section border-t border-line bg-mist">
        <div className="container-x">
          <Reveal>
            <SectionHeading title="Nasze wartości" id="wartosci-title" />
          </Reveal>
          <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <li key={v.title} className="border-t border-line-strong pt-6">
                <Icon name={v.icon} size={28} strokeWidth={1.5} className="text-ink" />
                <h3 className="mt-4 text-[1.15rem]">{v.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="standardy-title" className="section">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading title="Standardy pracy" id="standardy-title" lead="Zasady, które obowiązują każdy zespół i każdy pojazd." />
            <Link href="/flota" className="link-arrow mt-8">
              Poznaj naszą flotę
            </Link>
          </Reveal>
          <Reveal className="lg:col-span-7">
            <ul className="divide-y divide-line border-y border-line">
              {standards.map((s) => (
                <li key={s} className="flex gap-4 py-5 text-[1.03rem]">
                  <Icon name="check" size={20} strokeWidth={2} className="mt-0.5 shrink-0 text-red" />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <TeamSection />
      <WhyUsSection />
      <CtaBand />
    </>
  );
}
