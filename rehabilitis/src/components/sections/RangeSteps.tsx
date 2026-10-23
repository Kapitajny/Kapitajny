import { RangeArc } from "@/components/ui/RangeArc";

const STEPS = [
  { title: "Rozmowa", text: "Pytamy, co sprawia trudność, od kiedy i w jakich sytuacjach. Jeśli masz dokumentację lub zalecenia lekarza, przejrzymy je razem." },
  { title: "Ocena funkcjonalna", text: "Sprawdzamy ruch, siłę i codzienne czynności. Tylko w takim zakresie, na jaki pozwala problem i Twoje samopoczucie." },
  { title: "Omówienie planu", text: "Mówimy, co zauważyliśmy, i proponujemy plan terapii. Masz czas na pytania i decyzję." },
  { title: "Terapia i ćwiczenia", text: "Jeśli terapia jest wskazana, zaczynamy ją na tej lub kolejnej wizycie. Gdy potrzebna jest konsultacja lekarska, powiemy o tym wprost." },
];

/**
 * Przebieg terapii – prawdziwa sekwencja. Łuk przy każdym kroku pokazuje rosnący zakres ruchu
 * (45° → 180°): to jedyny motyw graficzny strony, użyty tam, gdzie opisuje postęp.
 */
export function RangeSteps() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-photo bg-mint-strong sm:grid-cols-2 xl:grid-cols-4">
      {STEPS.map((step, i) => (
        <li key={step.title} className="flex flex-col bg-mint p-6 lg:p-7">
          <div className="flex items-end justify-between gap-4">
            <RangeArc angle={(i + 1) * 45} className="w-24" />
            <span className="text-caption text-muted tabular-nums">{(i + 1) * 45}°</span>
          </div>
          <h3 className="mt-6 text-h3">
            <span className="sr-only">Krok {i + 1}: </span>
            {step.title}
          </h3>
          <p className="mt-2 text-small">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
