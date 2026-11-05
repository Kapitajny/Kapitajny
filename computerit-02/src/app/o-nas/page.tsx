import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { CtaBand } from "@/components/sections/CtaBand";
import { Process } from "@/components/sections/Process";
import { ArrowRight } from "@/components/ui/Icons";
import { PageHero, SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "O nas",
  description: "ComputerIT – studio projektowania i tworzenia stron internetowych oraz sklepów online. Poznaj nasze podejście i zasady współpracy.",
  alternates: { canonical: "/o-nas" },
};

const principles = [
  {
    title: "Uczciwie od pierwszej rozmowy",
    text: "Ceny „od” podajemy wprost, a zakres ustalamy przed startem. W portfolio pokazujemy koncepcje demonstracyjne i nazywamy je po imieniu – nie publikujemy wymyślonych klientów ani opinii.",
  },
  {
    title: "Detal ma znaczenie",
    text: "Odstępy, typografia, stany przycisków, komunikaty błędów w formularzu. To drobiazgi, ale to po nich klient poznaje, czy strona jest dopracowana.",
  },
  {
    title: "Prosto dla klienta",
    text: "Projektujemy tak, żeby odwiedzający szybko znalazł to, czego szuka – i bez wysiłku skontaktował się z Tobą albo złożył zamówienie.",
  },
  {
    title: "Technologia, która nie przeszkadza",
    text: "Lekki, nowoczesny kod i zoptymalizowane obrazy. Strona ma działać szybko i stabilnie, także na słabszym telefonie.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="O nas"
        title="Projektujemy strony, które dobrze wyglądają i dobrze działają"
        lead="ComputerIT to studio projektowania i tworzenia stron internetowych oraz sklepów online. Łączymy staranny projekt graficzny z porządnym kodem."
      />

      <section className="section container-x grid items-center gap-14 lg:grid-cols-2" aria-labelledby="kim-jestesmy">
        <div>
          <SectionHeading eyebrow="Kim jesteśmy" id="kim-jestesmy" title="Mniej szablonów, więcej przemyślanych decyzji" />
          <div className="reveal mt-6 space-y-4 text-[1.05rem] text-steel">
            <p>
              Każda firma ma innych klientów, inną ofertę i inny sposób mówienia o sobie. Dlatego nie zaczynamy od wyboru szablonu, tylko od rozmowy: kto
              odwiedza Twoją stronę, czego tam szuka i co powinien zrobić dalej.
            </p>
            <p>
              Na tej podstawie projektujemy układ, treści i wygląd, a potem budujemy stronę lub sklep tak, żeby działały szybko na każdym urządzeniu.
              Przez cały czas rozmawiasz bezpośrednio z nami.
            </p>
          </div>
          <Link href="/uslugi" className="link-arrow reveal mt-6">
            Zobacz, co robimy <ArrowRight />
          </Link>
        </div>
        <div className="reveal relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[1.75rem] bg-ink">
          <div className="grid-bg-dark absolute inset-0" aria-hidden="true" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" fill="none" aria-hidden="true">
            <path d="M0 120H90V200H150" stroke="#5c4a26" strokeWidth="1.5" />
            <path d="M400 280H310V200H250" stroke="#5c4a26" strokeWidth="1.5" />
            <path d="M0 120H90V200H150" stroke="var(--color-gold)" strokeWidth="2.5" className="trace-pulse" />
            <path d="M400 280H310V200H250" stroke="var(--color-gold)" strokeWidth="2.5" className="trace-pulse" style={{ "--d": "2s" } as CSSProperties} />
          </svg>
          <LogoMark accent className="absolute top-1/2 left-1/2 h-[34%] w-auto -translate-x-1/2 -translate-y-1/2 text-white" />
        </div>
      </section>

      <section className="section border-y border-line bg-white/60" aria-labelledby="zasady">
        <div className="container-x">
          <SectionHeading eyebrow="Zasady" id="zasady" title="Na czym opieramy współpracę" />
          <ul className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
            {principles.map((item, n) => (
              <li key={item.title} className="reveal grid grid-cols-[auto_1fr] gap-5">
                <span className="mt-1 font-mono text-[0.75rem] tracking-[0.08em] text-steel">{String(n + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[1.3rem] tracking-[-0.025em]">{item.title}</h3>
                  <p className="mt-3 text-steel">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section container-x" aria-labelledby="proces">
        <SectionHeading eyebrow="Proces" id="proces" title="Jak wygląda współpraca" align="center" />
        <div className="mt-14">
          <Process />
        </div>
      </section>

      <CtaBand secondary={{ href: "/realizacje", label: "Zobacz realizacje" }} />
    </>
  );
}
