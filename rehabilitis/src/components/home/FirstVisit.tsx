import { SectionHeading } from "./SectionHeading";

const STEPS = [
  { title: "Rozmowa", text: "Pytamy, co sprawia trudność, od kiedy i w jakich sytuacjach. Przeglądamy dokumentację i zalecenia lekarza, jeśli je masz." },
  { title: "Ocena funkcjonalna", text: "Sprawdzamy ruch, siłę i codzienne czynności – w zakresie odpowiednim do problemu i Twojego samopoczucia." },
  { title: "Omówienie planu", text: "Wyjaśniamy, co zaobserwowaliśmy, i proponujemy plan terapii. Masz czas na pytania i decyzję." },
  { title: "Początek terapii", text: "Jeśli terapia jest wskazana, zaczynamy ją na tej lub kolejnej wizycie. Gdy potrzebna jest konsultacja lekarska, mówimy o tym otwarcie." },
];

const BRING = ["wygodny strój, który pozwala odsłonić bolące miejsce", "wyniki badań, wypisy ze szpitala, zalecenia lekarza", "skierowanie – jeśli je masz", "listę przyjmowanych leków"];

export function FirstVisit() {
  return (
    <section id="pierwsza-wizyta" aria-labelledby="pierwsza-wizyta-title" className="section-y">
      <div className="container-x">
        <SectionHeading id="pierwsza-wizyta-title" title="Jak wygląda pierwsza wizyta?">
          <p>Nie musisz wiedzieć, jakiej terapii potrzebujesz. Pierwsze spotkanie służy temu, żeby to wspólnie ustalić.</p>
        </SectionHeading>

        <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border-t-[3px] border-forest pt-5">
              <p className="text-sm font-semibold text-moss">Krok {i + 1}</p>
              <h3 className="mt-1 text-xl">{step.title}</h3>
              <p className="mt-2 text-graphite">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-6 rounded-lg bg-sand p-6 sm:p-8 md:grid-cols-[14rem_1fr] md:gap-10">
          <h3 className="text-xl">Co zabrać na wizytę</h3>
          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {BRING.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
