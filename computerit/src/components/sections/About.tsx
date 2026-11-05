import type { CSSProperties } from "react";

const qualities = [
  {
    title: "Indywidualne podejście",
    text: "Każdy projekt zaczynam od rozmowy o Twojej firmie, klientach i celach. Nie dopasowuję biznesu do gotowego szablonu.",
  },
  {
    title: "Nowoczesny design",
    text: "Projekt graficzny powstaje od podstaw – typografia, kolory i układ wynikają z charakteru marki.",
  },
  {
    title: "Responsywność",
    text: "Strona jest projektowana równolegle dla telefonu, tabletu i komputera, a nie dopasowywana na końcu.",
  },
  {
    title: "Dopracowanie szczegółów",
    text: "Odstępy, stany przycisków, komunikaty formularzy – drobiazgi, które decydują o wrażeniu profesjonalizmu.",
  },
  {
    title: "Funkcjonalność",
    text: "Strona ma pomagać Twoim klientom: szybko znaleźć ofertę, zrozumieć ją i skontaktować się z Tobą.",
  },
  {
    title: "Bezpośredni kontakt",
    text: "Rozmawiasz bezpośrednio z osobą, która projektuje i tworzy Twoją stronę. Bez pośredników i przekazywania wiadomości dalej.",
  },
];

export function About() {
  return (
    <section id="o-mnie" tabIndex={-1} aria-labelledby="o-mnie-title" className="section bg-cloud outline-none">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <h2 id="o-mnie-title" className="reveal title-xl md:col-span-5">
            Poznaj ComputerIT
          </h2>
          <p className="reveal lead max-w-[38rem] text-ink/85 md:col-span-7 md:pt-3" style={{ "--d": "120ms" } as CSSProperties}>
            ComputerIT to niezależne studio tworzenia stron internetowych i sklepów online. Łączę nowoczesny design, funkcjonalność i przemyślane
            rozwiązania technologiczne, aby tworzyć projekty dopasowane do potrzeb biznesu.
          </p>
        </div>

        <ul className="mt-[clamp(4rem,8vw,6.5rem)] grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {qualities.map((quality, i) => (
            <li key={quality.title} className="reveal border-t border-ink/15 pt-6" style={{ "--d": `${(i % 3) * 90}ms` } as CSSProperties}>
              <h3 className="text-[1.3125rem] tracking-[-0.012em]">{quality.title}</h3>
              <p className="mt-3 max-w-[34ch] text-slate">{quality.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
