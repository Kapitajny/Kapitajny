import { Photo } from "@/components/ui/Photo";

/** Wizyta to rzeczywista sekwencja, dlatego kroki są numerowane i połączone linią. */
export const visitSteps = [
  { title: "Rozmowa", text: "Opowiadasz, co chcesz zmienić. Słuchamy i oglądamy skórę w dziennym świetle." },
  { title: "Twój plan", text: "Dostajesz go na piśmie: możliwości, terminy i koszty. Bez presji." },
  { title: "Zabieg", text: "W spokojnym gabinecie, z osobą, którą już znasz z konsultacji." },
  { title: "Opieka po", text: "Sprawdzamy efekt razem i dopasowujemy plan na kolejny sezon." },
];

export function VisitRitual() {
  return (
    <section aria-labelledby="ritual-title" className="relative py-20 sm:py-28">
      <div className="shell grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="relative mx-auto w-full max-w-md">
          <Photo image="treatmentRoom" sizes="(min-width: 1024px) 36vw, 90vw" className="oval aspect-[4/5] w-full" focus="62% 55%" />
          <div className="absolute -bottom-6 -right-2 w-36 sm:w-44">
            <Photo image="facialRitual" sizes="180px" className="oval aspect-square w-full border-[6px] border-ivory" focus="55% 40%" />
          </div>
        </div>

        <div>
          <h2 id="ritual-title" className="script text-center text-[clamp(2.4rem,6vw,4.25rem)] lg:text-left">
            Twoja wizyta, krok po kroku
          </h2>
          <ol className="relative mt-12 space-y-9 before:absolute before:bottom-6 before:left-[1.4rem] before:top-6 before:w-px before:bg-rose/60">
            {visitSteps.map((step, i) => (
              <li key={step.title} className="relative grid grid-cols-[2.8rem_1fr] gap-5">
                <span aria-hidden="true" className="script grid h-11 w-11 place-items-center rounded-full bg-powder text-xl">
                  {i + 1}
                </span>
                <div>
                  <h3 className="script text-[1.75rem] leading-tight">{step.title}</h3>
                  <p className="mt-1 max-w-md font-light text-stone">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
