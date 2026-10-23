import { siteConfig } from "@/config/site";
import { PRICE_LIST } from "@/data/pricing";

const STEPS = [
  { title: "Rozmowa", text: "Pytamy, co sprawia trudność, od kiedy i w jakich sytuacjach. Jeśli masz dokumentację lub zalecenia lekarza, przejrzymy je razem." },
  { title: "Ocena funkcjonalna", text: "Sprawdzamy ruch, siłę i codzienne czynności. Tylko w takim zakresie, na jaki pozwala problem i Twoje samopoczucie." },
  { title: "Omówienie planu", text: "Mówimy, co zauważyliśmy, i proponujemy plan terapii. Masz czas na pytania i decyzję." },
  { title: "Początek terapii", text: "Jeśli terapia jest wskazana, zaczynamy ją na tej lub kolejnej wizycie. Gdy potrzebna jest konsultacja lekarska, powiemy o tym wprost." },
];

const BRING = ["wygodny strój, w którym można odsłonić bolące miejsce", "wyniki badań, wypisy ze szpitala, zalecenia lekarza", "skierowanie, jeśli je masz", "listę przyjmowanych leków"];

export function FirstVisit() {
  const consultation = PRICE_LIST[0];
  const good = [
    "Na wizytę prywatną nie potrzebujesz skierowania.",
    consultation?.duration ? `Pierwsza wizyta trwa ${consultation.duration}.` : null,
    siteConfig.bookingUrl ? "Termin zarezerwujesz online, telefonicznie lub przez formularz." : "Termin ustalisz telefonicznie lub przez formularz na tej stronie.",
  ].filter(Boolean) as string[];

  return (
    <section id="pierwsza-wizyta" aria-labelledby="pierwsza-wizyta-title" className="section-y bg-sand">
      <div className="container-x">
        <h2 id="pierwsza-wizyta-title" className="h2">
          Jak wygląda pierwsza wizyta?
        </h2>
        <p className="section-intro">Nie musisz wiedzieć, jakiej terapii potrzebujesz. Na pierwszym spotkaniu ustalimy to razem.</p>

        <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <p className="font-serif text-[2.6rem] leading-none text-forest" aria-hidden="true">
                {i + 1}
              </p>
              <h3 className="mt-3 text-[1.2rem]">
                <span className="sr-only">Krok {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-graphite">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-10 border-t border-graphite/20 pt-10 md:grid-cols-2">
          <div>
            <h3 className="text-[1.2rem]">Co zabrać</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-forest">
              {BRING.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[1.2rem]">Dobrze wiedzieć</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-forest">
              {good.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
