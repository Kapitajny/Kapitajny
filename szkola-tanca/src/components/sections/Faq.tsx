import { Plus } from "@/components/ui/Icons";
import { FAQ } from "@/data/faq";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title" className="h2 mt-5 text-wine">
            Najczęściej zadawane pytania
          </h2>
          <p className="mt-6 prose-measure">
            Nie ma tu Twojego pytania?{" "}
            <a href="#kontakt" className="link font-semibold">
              Napisz lub zadzwoń
            </a>{" "}
            – chętnie odpowiemy.
          </p>
        </div>
        <div className="border-b rule lg:col-span-8">
          {FAQ.map((item) => (
            <details key={item.question} className="group border-t rule">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-[1.55rem] leading-snug transition-colors hover:text-wine [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cocoa/25 transition-transform duration-300 group-open:rotate-45 group-open:border-wine group-open:text-wine">
                  <Plus size={18} />
                </span>
              </summary>
              <p className="max-w-[62ch] pb-7 pr-14">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
