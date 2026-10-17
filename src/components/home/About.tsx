import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="o-nas" aria-labelledby="o-nas-title" className="relative bg-paper py-24 lg:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal as="figure" className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Photo image="aboutMain" sizes="(min-width: 1024px) 38vw, 92vw" placeholderLabel="Barista przy pracy" />
          </div>
          <figcaption className="mt-4 flex items-center gap-3 text-sm italic text-muted">
            <span aria-hidden="true" className="h-px w-8 bg-oat" />
            Espresso przygotowywane na zamówienie
          </figcaption>
        </Reveal>

        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <p className="eyebrow flex items-center gap-3">
            <span>02</span>
            <span aria-hidden="true" className="h-px w-10 bg-current opacity-50" />
            <span>O nas</span>
          </p>
          <h2 id="o-nas-title" className="mt-5 text-[clamp(2.4rem,1.5rem+3.4vw,4.5rem)]">
            Kawa to coś więcej niż <em className="italic text-latte">poranna rutyna.</em>
          </h2>

          <p className="mt-10 max-w-xl text-lg leading-[1.8] text-espresso first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.6rem] first-letter:leading-[0.8] first-letter:text-latte">
            NOIR COFFEE powstało z miłości do dobrego espresso, spokojnych poranków i miejsc, w których chce się zostać trochę dłużej. Wybieramy ziarna z
            dbałością o pochodzenie i smak, a każdą kawę przygotowujemy z uwagą na detale.
          </p>

          <blockquote className="mt-12 border-l border-latte pl-6">
            <p className="font-serif text-2xl italic leading-snug text-roast md:text-3xl">
              Nie spieszymy espresso. Spieszymy się tylko z tym, żeby było gotowe na Twój przyjazd.
            </p>
          </blockquote>

          <Reveal className="mt-14 grid grid-cols-5 items-end gap-5">
            <div className="relative col-span-3 aspect-[16/10] overflow-hidden rounded-xl">
              <Photo image="aboutDetail" sizes="(min-width: 1024px) 26vw, 55vw" placeholderLabel="Ziarna" />
            </div>
            <p className="col-span-2 pb-1 text-sm leading-relaxed text-muted">
              Każdy z lokali NOIR ma własny charakter, ale tę samą recepturę: świeże ziarno, precyzyjna ekstrakcja i chwila uwagi dla każdej filiżanki.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
