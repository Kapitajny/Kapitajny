import type { ReactNode } from "react";

/** Każda wartość ma własny, ręcznie rysowany detal – zamiast powtarzalnych ikon. */
const VALUES: { title: string; text: string; glyph: ReactNode }[] = [
  {
    title: "Ruch bez presji",
    text: "Nie ma złych kroków, są tylko kolejne próby. Nie porównujemy się z innymi i nie oceniamy – możesz tańczyć ostrożnie, odważnie albo po prostu dla siebie.",
    glyph: (
      <path d="M4 34c8 0 8-12 16-12s8 12 16 12 8-12 16-12 8 12 16 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
  {
    title: "Rozwój we własnym tempie",
    text: "Jedni po miesiącu przechodzą wyżej, inni zostają dłużej w grupie od zera. Obie drogi są w porządku – tempo ustalasz Ty, a my podpowiadamy.",
    glyph: (
      <path d="M8 44h14V34h14V24h14V14h14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Pasja i kreatywność",
    text: "Technika jest narzędziem, nie celem. Na każdych zajęciach zostawiamy miejsce na improwizację i własną interpretację muzyki.",
    glyph: (
      <>
        <path d="M36 8c2 10 6 14 16 16-10 2-14 6-16 16-2-10-6-14-16-16 10-2 14-6 16-16Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="14" cy="42" r="2.5" fill="currentColor" />
      </>
    ),
  },
  {
    title: "Wspierająca społeczność",
    text: "Na zajęcia przychodzisz sama lub sam, ale szybko okazuje się, że tańczysz z ludźmi, którzy kibicują sobie nawzajem – na sali i po zajęciach.",
    glyph: (
      <>
        <circle cx="26" cy="28" r="13" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="46" cy="28" r="13" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
];

export function Philosophy() {
  return (
    <section id="filozofia" aria-labelledby="filozofia-title" className="section-y bg-blush">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Nasza filozofia</p>
            <h2 id="filozofia-title" className="h2 mt-5 text-wine">
              Cztery zasady, które słychać w każdej sali
            </h2>
            <p className="lead prose-measure mt-6">
              Nie mamy listy zakazów. Mamy kilka przekonań, którymi kierujemy się, układając grafik, prowadząc zajęcia i witając nowe osoby.
            </p>
          </div>
        </div>

        <ol className="lg:col-span-7">
          {VALUES.map((value, index) => (
            <li key={value.title} className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-cocoa/20 py-9 first:border-t-0 first:pt-0 sm:grid-cols-[4.5rem_1fr_auto] sm:gap-x-8">
              <span className="font-serif text-5xl leading-none text-wine" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="h3">{value.title}</h3>
                <p className="mt-3 max-w-[52ch]">{value.text}</p>
              </div>
              <svg viewBox="0 0 72 56" className="col-start-2 h-12 w-16 text-wine sm:col-start-3 sm:row-start-1" aria-hidden="true">
                {value.glyph}
              </svg>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
