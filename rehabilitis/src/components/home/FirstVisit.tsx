import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "./SectionHeading";

const STEPS = [
  {
    title: "Rozmowa o potrzebach i dolegliwościach",
    text: "Pytamy o to, co sprawia trudność, od kiedy i w jakich sytuacjach. Jeśli masz dokumentację lub zalecenia lekarza, przejrzymy je razem.",
  },
  {
    title: "Ocena funkcjonalna",
    text: "Sprawdzamy ruch, siłę i sposób wykonywania codziennych czynności – w zakresie odpowiednim do Twojego problemu i samopoczucia.",
  },
  {
    title: "Omówienie proponowanego planu",
    text: "Wyjaśniamy, co zaobserwowaliśmy, i proponujemy plan terapii. Masz czas na pytania i decyzję.",
  },
  {
    title: "Rozpoczęcie terapii, jeśli jest wskazana",
    text: "Gdy terapia jest wskazana, zaczynamy ją jeszcze podczas pierwszej wizyty lub na kolejnym spotkaniu. Jeśli potrzebna jest konsultacja lekarska, powiemy o tym otwarcie.",
  },
];

export function FirstVisit() {
  return (
    <section aria-labelledby="pierwsza-wizyta-title" className="section-y bg-sand">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="pierwsza-wizyta-title" eyebrow="Pierwsza wizyta">
              Jak wygląda <em className="italic text-forest">pierwsza wizyta?</em>
            </SectionHeading>
            <p className="lead mt-6">
              Nie musisz wiedzieć, jaka terapia jest Ci potrzebna. Pierwsze spotkanie służy temu, aby to wspólnie ustalić – spokojnie i bez pośpiechu.
            </p>
          </div>
        </div>

        <div className="relative lg:col-span-7 lg:col-start-6">
          {/* Linia osi czasu */}
          <span aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-forest/25" />
          <ol>
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 80} className="relative grid grid-cols-[2.8rem_1fr] gap-5 pb-12 last:pb-0 sm:gap-8">
              <span
                aria-hidden="true"
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-forest/30 bg-sand font-serif text-lg text-forest"
              >
                {i + 1}
              </span>
              <div className="pt-1.5">
                <h3 className="text-[clamp(1.45rem,1.25rem+0.8vw,1.9rem)]">
                  <span className="sr-only">Krok {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xl text-muted">{step.text}</p>
              </div>
            </Reveal>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
