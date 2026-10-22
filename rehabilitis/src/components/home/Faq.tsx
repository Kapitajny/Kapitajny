import { FAQ } from "@/data/faq";
import { PlusIcon } from "@/components/ui/Icons";
import { TextWithPending } from "@/components/ui/Pending";
import { SectionHeading } from "./SectionHeading";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="faq-title" eyebrow="FAQ">
              Najczęstsze <em className="italic text-forest">pytania</em>
            </SectionHeading>
            <p className="lead mt-6">
              Nie ma tu odpowiedzi na Twoje pytanie?{" "}
              <a href="#kontakt" className="link-quiet text-forest">
                Napisz lub zadzwoń
              </a>{" "}
              – odpowiemy na każde pytanie.
            </p>
          </div>
        </div>

        <div className="border-t border-line lg:col-span-7 lg:col-start-6">
          {FAQ.map((item) => (
            <details key={item.id} id={`faq-${item.id}`} className="faq-item group border-b border-line">
              <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-6 py-6 text-left">
                <h3 className="font-serif text-[clamp(1.25rem,1.1rem+0.5vw,1.5rem)] leading-snug text-ink transition-colors group-hover:text-forest">
                  {item.question}
                </h3>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-forest/30 text-forest">
                  <PlusIcon size={18} className="faq-icon" />
                </span>
              </summary>
              <div className="max-w-2xl space-y-3 pb-7 pr-12 text-graphite">
                {item.answer.map((paragraph, i) => (
                  <p key={i}>
                    <TextWithPending text={paragraph} />
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
