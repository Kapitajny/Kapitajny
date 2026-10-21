import { DemoBadge } from "@/components/ui/DemoBadge";
import { TESTIMONIALS } from "@/data/testimonials";

export function Testimonials() {
  const [first, ...rest] = TESTIMONIALS;
  return (
    <section id="opinie" aria-labelledby="opinie-title" className="section-y">
      <div className="container-x">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Opinie uczestników</p>
            <h2 id="opinie-title" className="h2 mt-5 text-wine">
              Jak wspominają pierwsze tygodnie
            </h2>
          </div>
          <DemoBadge>Opinie przykładowe – nie pochodzą od prawdziwych osób</DemoBadge>
        </div>

        <figure className="mt-14 grid gap-6 border-t rule pt-10 lg:grid-cols-12">
          <span className="font-serif text-[7rem] leading-[0.6] text-rose lg:col-span-1" aria-hidden="true">
            „
          </span>
          <blockquote className="font-serif text-[clamp(1.9rem,1.3rem+2.2vw,3.2rem)] leading-[1.15] lg:col-span-9">{first.quote}</blockquote>
          <figcaption className="lg:col-span-9 lg:col-start-2">
            <span className="font-semibold">{first.author}</span> · {first.context}
          </figcaption>
        </figure>

        <ul className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {rest.map((testimonial) => (
            <li key={testimonial.author} className="border-t rule pt-6">
              <figure>
                <blockquote className="text-lg leading-relaxed">„{testimonial.quote}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{testimonial.author}</span> · {testimonial.context}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
