import type { ImageKey } from "@/config/images";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "./SectionHeading";

const REASONS: { image: ImageKey; title: string; text: string; offset: string }[] = [
  {
    image: "whyBeans",
    title: "Starannie dobrane ziarna",
    text: "Wybieramy kawy z dbałością o pochodzenie i świeżość palenia. Blend NOIR komponujemy tak, by smakował i solo, i z mlekiem.",
    offset: "",
  },
  {
    image: "whyPrecision",
    title: "Precyzja w każdej filiżance",
    text: "Ważymy porcje, pilnujemy czasu ekstrakcji i temperatury mleka. Dzięki temu Twoje cappuccino smakuje tak samo w każdym lokalu.",
    offset: "md:mt-24",
  },
  {
    image: "whyPickup",
    title: "Odbiór bez czekania",
    text: "Zamów online, wybierz lokal i godzinę – kawa będzie gotowa na Twój przyjazd. Płacisz z góry, więc przy barze tylko ją odbierasz.",
    offset: "md:mt-10",
  },
];

export function WhyNoir() {
  return (
    <section aria-labelledby="why-title" className="py-24 lg:py-32">
      <div className="container-x">
        <SectionHeading id="why-title" index="06" eyebrow="Dlaczego NOIR COFFEE?" className="max-w-3xl">
          Trzy rzeczy, których <em className="italic text-latte">pilnujemy</em> codziennie.
        </SectionHeading>

        <ol className="mt-16 grid gap-14 md:grid-cols-3 md:gap-8 lg:mt-20 lg:gap-14">
          {REASONS.map((reason, i) => (
            <Reveal as="li" key={reason.title} delay={i * 110} className={reason.offset}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Photo image={reason.image} sizes="(min-width: 768px) 30vw, 92vw" placeholderLabel={reason.title} />
              </div>
              <div className="mt-6 flex gap-5">
                <span className="font-serif text-4xl font-light leading-none text-latte">{i + 1}.</span>
                <div>
                  <h3 className="text-2xl">{reason.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{reason.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
