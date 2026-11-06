import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { orderHref, siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Nasze usługi – transport sanitarny i medyczny",
  description:
    "Prywatny transport medyczny, transport sanitarny, przewozy międzyszpitalne, transport pacjentów leżących, zabezpieczenie imprez i obsługa medyczna firm.",
  path: "/uslugi",
});

const steps = [
  { title: "Zgłoszenie", text: "Zadzwoń do dyspozytorni lub wyślij formularz. Zapytamy o trasę, termin i podstawowe potrzeby pacjenta." },
  { title: "Kwalifikacja i wycena", text: "Dobieramy rodzaj ambulansu i skład zespołu. Przed realizacją podajemy cenę lub informujemy o finansowaniu NFZ." },
  { title: "Potwierdzenie", text: "Potwierdzamy termin telefonicznie. Dopiero potwierdzenie przez dyspozytora oznacza przyjęcie zlecenia." },
  { title: "Realizacja", text: "Zespół przyjeżdża na miejsce, przejmuje pacjenta i przekazuje go wraz z dokumentacją w miejscu docelowym." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumb="Nasze usługi"
        title="Transport medyczny i opieka nad pacjentem w każdej sytuacji"
        lead="Usługi realizujemy komercyjnie dla klientów indywidualnych, firm i placówek, a w zakresie kontraktu – także w ramach NFZ."
      >
        <nav aria-label="Lista usług">
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <a href={`#${s.slug}`} className="inline-block rounded-[4px] border border-line px-3 py-1.5 text-sm text-body transition-colors hover:border-ink hover:text-ink">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <section aria-label="Opis usług" className="py-6 lg:py-10">
        <div className="container-x">
          {services.map((s) => (
            <Reveal as="article" key={s.slug} id={s.slug} className="grid scroll-mt-28 gap-8 border-b border-line py-14 last:border-0 lg:grid-cols-12 lg:gap-16 lg:py-20">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-soft text-red">
                    <Icon name={s.icon} size={28} strokeWidth={1.5} />
                  </span>
                </div>
                <h2 className="mt-6 text-[clamp(1.7rem,1.3rem+1.2vw,2.4rem)]">{s.title}</h2>
              </div>
              <div className="lg:col-span-7">
                <p className="text-[1.08rem] leading-relaxed">{s.description}</p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {s.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[0.98rem]">
                      <Icon name="check" size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-red" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href={orderHref(s.slug)} className="btn btn-primary btn-sm" aria-label={`Zapytaj o usługę: ${s.title}`}>
                    Zapytaj o usługę
                  </Link>
                  <a href={siteConfig.contact.phoneHref} className="btn btn-outline btn-sm">
                    <Icon name="phone" size={16} />
                    Zadzwoń
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="jak-title" className="section bg-graphite">
        <div className="container-x">
          <Reveal>
            <SectionHeading title="Cztery kroki do bezpiecznego transportu" id="jak-title" tone="dark" />
          </Reveal>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => (
              <li key={step.title} className="border-t border-white/20 pt-6">
                <span className="font-display text-5xl font-semibold leading-none text-white/55" style={{ fontStretch: "85%" }} aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-[1.35rem] text-white">{step.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-white/70">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
