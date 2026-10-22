import { FAQ } from "@/data/faq";
import { PlusIcon } from "@/components/ui/Icons";
import { TextWithPending } from "@/components/ui/Pending";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <h2 id="faq-title" className="h2">
            Najczęstsze pytania
          </h2>
          <p className="section-intro">
            Nie ma tu odpowiedzi na Twoje pytanie?{" "}
            <a href="#kontakt" className="link">
              Zadzwoń lub napisz
            </a>
            .
          </p>
        </div>

        <div className="border-t border-line">
          {FAQ.map((item) => (
            <details key={item.id} id={`faq-${item.id}`} className="faq-item border-b border-line">
              <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-6 py-5 text-left hover:text-forest">
                <h3 className="text-lg">{item.question}</h3>
                <PlusIcon size={22} className="faq-icon shrink-0 text-forest" />
              </summary>
              <div className="max-w-2xl space-y-3 pb-6 text-graphite">
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
