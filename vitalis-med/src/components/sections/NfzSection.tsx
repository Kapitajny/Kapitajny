import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { nfzContract, nfzVsPrivate } from "@/data/nfz";

/** Porównanie: świadczenia NFZ i usługi prywatne – jeden obiekt podzielony linią. */
export function NfzComparison({ headingLevel = "h3", tone = "light" }: { headingLevel?: "h2" | "h3"; tone?: "light" | "dark" }) {
  const H = headingLevel;
  const dark = tone === "dark";
  const col = (title: string, note: string, items: string[]) => (
    <div className="p-6 lg:p-8">
      <H className={`text-[1.2rem] ${dark ? "text-white" : ""}`}>{title}</H>
      <p className={`mt-1 text-sm ${dark ? "text-white/60" : "text-muted"}`}>{note}</p>
      <ul className="mt-5 space-y-3">
        {items.map((t) => (
          <li key={t} className={`flex gap-3 text-[0.97rem] leading-snug ${dark ? "text-white/85" : ""}`}>
            <Icon name="check" size={18} strokeWidth={2} className={`mt-0.5 shrink-0 ${dark ? "text-white" : "text-ink"}`} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className={`grid overflow-hidden rounded-[18px] border sm:grid-cols-2 ${dark ? "divide-white/15 border-white/15 max-sm:divide-y sm:divide-x" : "divide-line border-line bg-white max-sm:divide-y sm:divide-x"}`}>
      {col("Świadczenia w ramach NFZ", "Finansowanie publiczne", nfzVsPrivate.nfz)}
      {col("Usługi prywatne", "Płatne według cennika", nfzVsPrivate.private)}
    </div>
  );
}

export function NfzSection() {
  return (
    <section aria-labelledby="nfz-title" className="section">
      <div className="container-x">
        <Reveal className="grid gap-10 rounded-[28px] bg-graphite px-6 py-12 text-white/80 sm:px-10 lg:grid-cols-12 lg:gap-12 lg:px-14 lg:py-16">
          <div className="lg:col-span-5">
            <h2 id="nfz-title" className="h-section text-white">
              Świadczenia medyczne w&nbsp;ramach NFZ
            </h2>
            <p className="mt-5 font-light leading-relaxed">
              Realizujemy również świadczenia zdrowotne finansowane ze środków Narodowego Funduszu Zdrowia w&nbsp;zakresie objętym zawartym kontraktem.
              Naszym priorytetem jest zapewnienie pacjentom profesjonalnej obsługi, bezpieczeństwa oraz wysokiej jakości świadczeń.
            </p>
            <h3 className="mt-8 text-[1.05rem] text-white">Zakres umowy</h3>
            <ul className="mt-3 space-y-2.5 text-[0.97rem]">
              {nfzContract.scopes.map((s) => (
                <li key={s.title}>
                  <span className="font-semibold text-white">{s.title}.</span> <span className="font-light">{s.text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-white/55">Zakres przykładowy, do uzupełnienia zgodnie z&nbsp;faktyczną umową z&nbsp;NFZ.</p>
            <Link href="/nfz" className="btn mt-8 bg-white text-ink hover:bg-fog">
              Dowiedz się więcej
            </Link>
          </div>
          <div className="lg:col-span-7">
            <h3 className="sr-only">Zasady korzystania z usług</h3>
            <NfzComparison tone="dark" />
            <p className="mt-5 flex gap-3 text-[0.95rem] leading-relaxed text-white/75">
              <Icon name="alert" size={20} className="mt-0.5 shrink-0 text-[#ff6b7f]" />
              <span>
                <strong className="text-white">Nagły stan zagrożenia życia?</strong> Dzwoń pod 112 lub 999. Zespoły ratownictwa medycznego
                w&nbsp;systemie Państwowego Ratownictwa Medycznego wysyła wyłącznie dyspozytor medyczny.
              </span>
            </p>
            <Link href="/cennik" className="link-arrow mt-5 border-white/40 text-white hover:border-white hover:text-white">
              Cennik usług prywatnych
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
