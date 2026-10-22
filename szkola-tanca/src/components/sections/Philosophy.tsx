import type { ReactNode } from "react";

/**
 * Znaczniki z taśmy (spike tape), którymi tancerze oznaczają swoje miejsca na parkiecie.
 * Każda wartość ma inny kształt znacznika – jak różne pozycje w formacji.
 */
function TapeMark({ children, rotate }: { children: ReactNode; rotate: number }) {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 text-blush" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <g fill="currentColor">{children}</g>
    </svg>
  );
}

const VALUES: { title: string; text: string; mark: ReactNode; offset: string }[] = [
  {
    title: "Ruch bez presji",
    text: "Nie ma złych kroków, są tylko kolejne próby. Nie porównujemy się z innymi i nie oceniamy – możesz tańczyć ostrożnie, odważnie albo po prostu dla siebie.",
    mark: (
      <TapeMark rotate={-6}>
        <rect x="8" y="27" width="48" height="10" rx="1.5" transform="rotate(45 32 32)" />
        <rect x="8" y="27" width="48" height="10" rx="1.5" transform="rotate(-45 32 32)" />
      </TapeMark>
    ),
    offset: "",
  },
  {
    title: "Rozwój we własnym tempie",
    text: "Jedni po miesiącu przechodzą wyżej, inni zostają dłużej w grupie od zera. Obie drogi są w porządku – tempo ustalasz Ty, a my podpowiadamy.",
    mark: (
      <TapeMark rotate={4}>
        <rect x="6" y="12" width="52" height="10" rx="1.5" />
        <rect x="27" y="12" width="10" height="44" rx="1.5" />
      </TapeMark>
    ),
    offset: "md:mt-28",
  },
  {
    title: "Pasja i kreatywność",
    text: "Technika jest narzędziem, nie celem. Na każdych zajęciach zostawiamy miejsce na improwizację i własną interpretację muzyki.",
    mark: (
      <TapeMark rotate={-3}>
        <rect x="10" y="8" width="10" height="48" rx="1.5" />
        <rect x="10" y="46" width="44" height="10" rx="1.5" />
      </TapeMark>
    ),
    offset: "md:-mt-10",
  },
  {
    title: "Wspierająca społeczność",
    text: "Na zajęcia przychodzisz sama lub sam, ale szybko okazuje się, że tańczysz z ludźmi, którzy kibicują sobie nawzajem – na sali i po zajęciach.",
    mark: (
      <TapeMark rotate={8}>
        <rect x="6" y="27" width="52" height="10" rx="1.5" />
        <circle cx="32" cy="14" r="5" />
      </TapeMark>
    ),
    offset: "md:mt-18",
  },
];

export function Philosophy() {
  return (
    <section id="filozofia" aria-labelledby="filozofia-title" className="on-dark band section-y bg-cocoa text-ivory">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="filozofia-title" className="h2 lg:col-span-7">
            Cztery zasady, według których ustawiamy się na parkiecie
          </h2>
          <p className="lead prose-measure text-ivory/90 lg:col-span-5">
            Na sali tancerze oznaczają swoje miejsca kawałkiem taśmy. My oznaczyliśmy w ten sposób to, czego trzymamy się na każdych zajęciach.
          </p>
        </div>

        <ul className="mt-16 grid gap-x-16 gap-y-14 md:grid-cols-2 lg:mt-24 lg:px-[6%]">
          {VALUES.map((value) => (
            <li key={value.title} className={`grid grid-cols-[3.5rem_1fr] gap-x-6 ${value.offset}`}>
              {value.mark}
              <div>
                <h3 className="h3">{value.title}</h3>
                <p className="mt-3 max-w-[44ch] text-ivory/90">{value.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
