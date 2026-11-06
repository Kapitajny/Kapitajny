import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { nfzContract, nfzVsPrivate } from "@/data/nfz";
import { SectionHeading } from "./SectionHeading";

/** Porównanie: świadczenia NFZ vs usługi komercyjne – wyraźne rozdzielenie obu ścieżek. */
export function NfzComparison({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
      <div className="bg-white p-7 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Finansowanie publiczne</p>
        <H className="mt-2 text-[1.35rem]">Świadczenia w ramach NFZ</H>
        <ul className="mt-6 space-y-3.5">
          {nfzVsPrivate.nfz.map((t) => (
            <li key={t} className="flex gap-3 text-[0.98rem] leading-snug">
              <Icon name="check" size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-ink" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-7 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-dark">Usługi komercyjne</p>
        <H className="mt-2 text-[1.35rem]">Transport prywatny</H>
        <ul className="mt-6 space-y-3.5">
          {nfzVsPrivate.private.map((t) => (
            <li key={t} className="flex gap-3 text-[0.98rem] leading-snug">
              <Icon name="check" size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-red" />
              {t}
            </li>
          ))}
        </ul>
        <Link href="/cennik" className="link-arrow mt-7 text-[0.95rem]">
          Cennik usług prywatnych
          <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    </div>
  );
}

export function NfzSection() {
  return (
    <section aria-labelledby="nfz-title" className="section border-y border-line bg-mist">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionHeading eyebrow="Narodowy Fundusz Zdrowia" title="Świadczenia medyczne w ramach NFZ" id="nfz-title" />
          <p className="mt-7 text-[1.08rem] leading-relaxed">
            Realizujemy również świadczenia zdrowotne finansowane ze środków Narodowego Funduszu Zdrowia w zakresie objętym zawartym kontraktem. Naszym
            priorytetem jest zapewnienie pacjentom profesjonalnej obsługi, bezpieczeństwa oraz wysokiej jakości świadczeń.
          </p>

          <h3 className="mt-10 text-lg">Zakres umowy</h3>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {nfzContract.scopes.map((s) => (
              <li key={s.title} className="py-4">
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="mt-1 text-[0.95rem] text-muted">{s.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Zakres przykładowy – wymaga uzupełnienia zgodnie z faktyczną umową z NFZ.</p>

          <Link href="/nfz" className="btn btn-dark mt-9">
            Dowiedz się więcej
            <Icon name="arrowRight" size={18} />
          </Link>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={100}>
          <h3 className="sr-only">Zasady korzystania z usług</h3>
          <NfzComparison />
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-white text-ink">
                <Icon name="document" size={20} />
              </span>
              <p className="text-[0.95rem] leading-relaxed">
                <strong className="font-semibold text-ink">Zlecenie lekarza.</strong> Transport w ramach NFZ wymaga zlecenia lekarza ubezpieczenia
                zdrowotnego i mieści się w zakresie naszej umowy.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red/40 bg-white text-red">
                <Icon name="alert" size={20} />
              </span>
              <p className="text-[0.95rem] leading-relaxed">
                <strong className="font-semibold text-ink">Nagły stan zagrożenia życia?</strong> Dzwoń pod 112 lub 999 – zespoły ratownictwa medycznego
                wysyła wyłącznie dyspozytor medyczny.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
