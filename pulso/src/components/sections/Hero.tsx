import { site } from "@/config/site";
import { ContactLink, Arrow } from "@/components/ui/ContactLink";
import { HeroPlan } from "./HeroPlan";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-tytul" className="relative pt-[calc(var(--nav-h)+2.5rem)] pb-[var(--section-y)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
      <div className="container-plan">
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h1 id="hero-tytul" className="t-display max-w-[13ch] lg:col-span-12 lg:max-w-none">
            Plan, zanim wydasz złotówkę.
          </h1>
        </div>

        <div className="mt-6 grid gap-x-10 gap-y-6 sm:mt-8 lg:grid-cols-12 lg:items-end">
          <p className="t-lead max-w-[60ch] lg:col-span-7">
            {site.fullName} prowadzi kampanie w Meta, Google, YouTube i TikToku. Zaczynamy od strategii i liczb, kończymy na
            raporcie, który da się sprawdzić. Opłata za obsługę jest stała i jawna, a budżet reklamowy płacisz bezpośrednio
            platformom.
          </p>
          <div className="flex flex-col gap-4 lg:col-span-5 lg:items-end">
            <p className="text-[1.0625rem] font-[640] text-ink-3" style={{ fontVariationSettings: '"wdth" 112' }}>
              {site.tagline}
            </p>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ContactLink className="btn btn-primary">
                Umów konsultację <Arrow />
              </ContactLink>
              <a href="#uslugi" className="btn btn-secondary">
                Poznaj naszą ofertę
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12">
          <HeroPlan />
        </div>
      </div>
    </section>
  );
}
