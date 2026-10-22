import { DemoBadge } from "@/components/ui/DemoBadge";
import { TESTIMONIALS } from "@/data/testimonials";

export function Testimonials() {
  const [first, ...rest] = TESTIMONIALS;
  return (
    <section id="opinie" aria-labelledby="opinie-title" className="section-y">
      <div className="container-x">
        <div className="flex flex-col items-start gap-5">
          <h2 id="opinie-title" className="h2 text-wine">
            Jak wspominają pierwsze tygodnie
          </h2>
          <DemoBadge>Opinie przykładowe, nie pochodzą od prawdziwych osób</DemoBadge>
        </div>

        <figure className="mt-12 rounded-[2rem] bg-blush p-8 sm:p-12 lg:p-16">
          <blockquote className="max-w-[30ch] text-[clamp(1.8rem,1.2rem+2.4vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.02em] [font-stretch:82%]">
            „{first.quote}”
          </blockquote>
          <figcaption className="mt-6">
            <span className="font-semibold">{first.author}</span>, {first.context.toLowerCase()}
          </figcaption>
        </figure>

        <ul className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {rest.map((testimonial) => (
            <li key={testimonial.author} className="border-l-2 border-rose pl-5">
              <figure>
                <blockquote className="text-lg leading-relaxed">„{testimonial.quote}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{testimonial.author}</span>, {testimonial.context.toLowerCase()}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
