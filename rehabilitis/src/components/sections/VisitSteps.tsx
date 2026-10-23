const STEPS = [
  { title: "Rozmowa", text: "Pytamy, co sprawia trudność, od kiedy i w jakich sytuacjach. Jeśli masz dokumentację lub zalecenia lekarza, przejrzymy je razem." },
  { title: "Ocena funkcjonalna", text: "Sprawdzamy ruch, siłę i codzienne czynności. Tylko w takim zakresie, na jaki pozwala problem i Twoje samopoczucie." },
  { title: "Omówienie planu", text: "Mówimy, co zauważyliśmy, i proponujemy plan terapii. Masz czas na pytania i decyzję." },
  { title: "Początek terapii", text: "Jeśli terapia jest wskazana, zaczynamy ją na tej lub kolejnej wizycie. Gdy potrzebna jest konsultacja lekarska, powiemy o tym wprost." },
];

/**
 * Przebieg pierwszej wizyty – prawdziwa sekwencja, więc kroki są numerowane.
 * `layout="row"`: cztery kolumny (strona główna); `layout="timeline"`: pionowa oś (O gabinecie).
 */
export function VisitSteps({ layout = "row" }: { layout?: "row" | "timeline" }) {
  if (layout === "timeline") {
    return (
      <ol className="relative mt-8 space-y-8 border-l-2 border-brand pl-8">
        {STEPS.map((step, i) => (
          <li key={step.title} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[3.2rem] top-0 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-small font-bold text-white"
            >
              {i + 1}
            </span>
            <h3 className="text-h3">
              <span className="sr-only">Krok {i + 1}: </span>
              {step.title}
            </h3>
            <p className="mt-1 max-w-prose">{step.text}</p>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step, i) => (
        <li key={step.title} className="border-t-2 border-brand pt-4">
          <p aria-hidden="true" className="text-small font-bold text-brand">
            Krok {i + 1}
          </p>
          <h3 className="mt-1 text-h3">
            <span className="sr-only">Krok {i + 1}: </span>
            {step.title}
          </h3>
          <p className="mt-2">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
