import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { nfzContract, nfzVsPrivate } from "@/data/nfz";
import { SectionHeading } from "./SectionHeading";

/** Porównanie: świadczenia NFZ i usługi komercyjne – dwie osobne karty. */
export function NfzComparison({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="card p-6">
        <H className="text-[1.2rem]">Świadczenia w&nbsp;ramach NFZ</H>
        <p className="mt-1 text-sm text-muted">Finansowanie publiczne</p>
        <ul className="mt-5 space-y-3">
          {nfzVsPrivate.nfz.map((t) => (
            <li key={t} className="flex gap-3 text-[0.97rem] leading-snug">
              <Icon name="check" size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-ink" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="card p-6">
        <H className="text-[1.2rem]">Usługi prywatne</H>
        <p className="mt-1 text-sm text-muted">Płatne według cennika</p>
        <ul className="mt-5 space-y-3">
          {nfzVsPrivate.private.map((t) => (
            <li key={t} className="flex gap-3 text-[0.97rem] leading-snug">
              <Icon name="check" size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-red" />
              {t}
            </li>
          ))}
        </ul>
        <Link href="/cennik" className="link-arrow mt-6 text-[0.95rem]">
          Cennik usług prywatnych
        </Link>
      </div>
    </div>
  );
}

export function NfzSection() {
  return (
    <section aria-labelledby="nfz-title" className="section bg-mist">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-5">
          <SectionHeading title="Świadczenia medyczne w ramach NFZ" id="nfz-title" />
          <p className="mt-5 text-[1.05rem] leading-relaxed">
            Realizujemy również świadczenia zdrowotne finansowane ze środków Narodowego Funduszu Zdrowia w&nbsp;zakresie objętym zawartym kontraktem. Naszym
            priorytetem jest zapewnienie pacjentom profesjonalnej obsługi, bezpieczeństwa oraz wysokiej jakości świadczeń.
          </p>
          <h3 className="mt-8 text-[1.1rem]">Zakres umowy</h3>
          <ul className="mt-3 space-y-2">
            {nfzContract.scopes.map((s) => (
              <li key={s.title} className="flex gap-3 text-[0.98rem]">
                <Icon name="check" size={18} strokeWidth={2} className="mt-1 shrink-0 text-red" />
                <span>
                  <strong className="font-bold text-ink">{s.title}.</strong> {s.text}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Zakres przykładowy, do uzupełnienia zgodnie z&nbsp;faktyczną umową z&nbsp;NFZ.</p>
          <Link href="/nfz" className="btn btn-primary mt-8">
            Dowiedz się więcej
          </Link>
        </Reveal>

        <Reveal className="lg:col-span-7">
          <h3 className="sr-only">Zasady korzystania z usług</h3>
          <NfzComparison />
          <div className="mt-4 flex gap-4 rounded-[8px] border border-red/30 bg-white p-5">
            <Icon name="alert" size={22} className="mt-0.5 shrink-0 text-red" />
            <p className="text-[0.97rem] leading-relaxed">
              <strong className="font-bold text-ink">Nagły stan zagrożenia życia?</strong> Dzwoń pod 112 lub 999. Zespoły ratownictwa medycznego w&nbsp;systemie
              Państwowego Ratownictwa Medycznego wysyła wyłącznie dyspozytor medyczny.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
