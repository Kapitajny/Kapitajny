"use client";

import Image from "next/image";
import { workById, workSrc } from "@/config/work";
import { LocalizedLink } from "@/i18n/LocalizedLink";
import { useI18n } from "@/i18n/I18nProvider";
import { ArrowIcon } from "@/components/ui/Icons";
import { Pattern } from "@/components/ui/Pattern";
import { Reveal } from "@/components/ui/Reveal";

const KANJI_NUMERALS = ["一", "二", "三", "四", "五"];

/** Oznaczenie rozdziału: numer i nazwa — rozdziały tworzą rzeczywistą sekwencję lektury. */
function Chapter({ index, name, dark = false }: { index: number; name: string; dark?: boolean }) {
  return (
    <p className={`flex items-center gap-4 font-gothic text-xs tracking-[0.12em] ${dark ? "text-usuzumi" : "text-nezumi"}`}>
      <span className={`tabular-nums ${dark ? "text-kin" : "text-kin-deep"}`}>{String(index + 1).padStart(2, "0")}</span>
      <span aria-hidden="true" className={`h-px w-8 ${dark ? "bg-kin/60" : "bg-kin"}`} />
      {name}
    </p>
  );
}

export function About() {
  const { t } = useI18n();
  const a = t.about;
  const approachImage = workById("lotus-hip");
  const craftImage = workById("money-mask");
  const ids = a.chapters.map((_, i) => `about-${i + 1}`);

  return (
    <section id="about" aria-labelledby="about-title" className="relative">
      {/* 01 — Filozofia */}
      <div id={ids[0]} className="page-x scroll-mt-6 border-t border-sumi/12 pb-20 pt-24 sm:pb-28 sm:pt-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Chapter index={0} name={a.chapters[0]} />
            <Reveal>
              <h2 id="about-title" className="display display-xl mt-8">
                <span className="sr-only">{a.srTitle} </span>
                {a.philosophy.title}
              </h2>
            </Reveal>
          </div>
          <nav aria-label={a.chaptersLabel} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <ol className="grid grid-cols-2 gap-x-6 border-t border-sumi/12 sm:grid-cols-3 lg:grid-cols-1">
              {a.chapters.map((name, i) => (
                <li key={name} className="border-b border-sumi/12">
                  <a href={`#${ids[i]}`} className="group flex min-h-12 items-center gap-3 font-gothic text-sm hover:text-kin-deep">
                    <span className="tabular-nums text-2xs text-nezumi group-hover:text-kin-deep">{String(i + 1).padStart(2, "0")}</span>
                    {name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <p className="lead lg:col-span-5">{a.philosophy.paragraphs[0]}</p>
          <div className="body-copy text-nezumi lg:col-span-5 lg:col-start-8">
            {a.philosophy.paragraphs.slice(1).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      <figure className="relative overflow-hidden bg-kinari">
        <div className="text-sumi/[0.1]">
          <Pattern kind="asanoha" strokeWidth={0.7} scale={1.15} />
        </div>
        <div className="page-x relative py-20 sm:py-28">
          <Reveal as="blockquote" className="mx-auto max-w-[58rem] bg-kinari px-3 py-8 text-center sm:px-12">
            <span aria-hidden="true" className="mx-auto mb-8 block h-px w-16 bg-kin-deep" />
            <p className="font-mincho text-[clamp(1.5rem,3vw,2.6rem)] leading-[1.4] text-pretty">{a.philosophy.quote}</p>
          </Reveal>
        </div>
      </figure>

      {/* 02 — Inspiracje */}
      <div id={ids[1]} className="page-x relative scroll-mt-6 overflow-hidden py-24 sm:py-32">
        <div className="absolute -right-24 top-0 hidden h-[28rem] w-[28rem] text-sumi/[0.08] [mask-image:radial-gradient(circle_at_70%_30%,black,transparent_70%)] md:block">
          <Pattern kind="seigaiha" strokeWidth={0.8} />
        </div>
        <div className="relative grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Chapter index={1} name={a.chapters[1]} />
            <Reveal>
              <h3 className="display display-lg mt-8">{a.heritage.title}</h3>
            </Reveal>
            <p className="lead mt-8">{a.heritage.paragraphs[0]}</p>
            <div className="body-copy mt-6 text-nezumi">
              {a.heritage.paragraphs.slice(1).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <dl aria-label={a.heritage.motifsLabel} className="grid grid-cols-2 self-center border-l border-t border-sumi/12 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {a.heritage.motifs.map((motif) => (
              <div key={motif.kanji} className="group flex flex-col border-b border-r border-sumi/12 bg-washi/60 p-5 transition-colors duration-500 hover:bg-washi-2 sm:p-6">
                <span aria-hidden="true" className="font-mincho text-[2.75rem] leading-none transition-colors duration-500 group-hover:text-kin-deep">
                  {motif.kanji}
                </span>
                <dt className="mt-6 font-mincho text-lg">{motif.name}</dt>
                <dd className="mt-2 font-gothic text-xs leading-relaxed text-nezumi">{motif.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* 03 — Podejście */}
      <div id={ids[2]} className="page-x scroll-mt-6 bg-washi-2 py-24 sm:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="relative lg:col-span-6">
            <span aria-hidden="true" className="absolute -left-3 -top-3 hidden h-full w-full border border-kin/70 sm:block" />
            <Reveal variant="wipe" className="relative aspect-[588/447] overflow-hidden">
              <Image src={workSrc(approachImage)} alt={t.work.items["lotus-hip"].alt} fill quality={85} sizes="(min-width: 1024px) 46vw, 92vw" className="object-cover" />
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Chapter index={2} name={a.chapters[2]} />
            <Reveal>
              <h3 className="display display-lg mt-8">{a.approach.title}</h3>
            </Reveal>
            <div className="body-copy mt-8 text-nezumi">
              {a.approach.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
        <ol aria-label={a.approach.stepsLabel} className="mt-20 grid gap-px overflow-hidden border border-sumi/12 bg-sumi/12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {a.approach.steps.map((step, index) => (
            <li key={step.title} className="flex gap-5 bg-washi-2 p-6 lg:flex-col lg:gap-8 lg:p-8">
              <span aria-hidden="true" className="font-mincho text-3xl leading-none text-kin-deep">
                {KANJI_NUMERALS[index]}
              </span>
              <div>
                <p className="font-mincho text-xl">{step.title}</p>
                <p className="mt-2 font-gothic text-sm leading-relaxed text-nezumi">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* 04 — Rzemiosło */}
      <div id={ids[3]} className="on-dark relative scroll-mt-6 overflow-hidden bg-graphite py-24 text-washi sm:py-32">
        <div className="page-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Chapter index={3} name={a.chapters[3]} dark />
            <Reveal>
              <h3 className="display display-xl mt-8">{a.craft.title}</h3>
            </Reveal>
            <p className="lead mt-10 text-washi/85">{a.craft.paragraphs[0]}</p>
            <div className="body-copy mt-6 text-washi/70">
              {a.craft.paragraphs.slice(1).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <Reveal variant="wipe" className="relative aspect-[4/5] overflow-hidden lg:col-span-5 lg:col-start-8">
            <Image src={workSrc(craftImage)} alt={t.work.items["money-mask"].alt} fill quality={85} sizes="(min-width: 1024px) 38vw, 92vw" className="object-cover object-top" />
          </Reveal>
        </div>
        <dl className="page-x mt-20 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {a.craft.items.map((item) => (
            <div key={item.term} className="py-6">
              <span aria-hidden="true" className="kin-rule mb-6 block" />
              <dt className="font-mincho text-xl">{item.term}</dt>
              <dd className="mt-2 font-gothic text-sm leading-relaxed text-usuzumi">{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 05 — Doświadczenie */}
      <div id={ids[4]} className="page-x scroll-mt-6 py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Chapter index={4} name={a.chapters[4]} />
            <Reveal>
              <h3 className="display display-lg mt-8">{a.experience.title}</h3>
            </Reveal>
          </div>
          <div className="body-copy text-nezumi lg:col-span-5 lg:col-start-8 lg:pt-14">
            {a.experience.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <ol aria-label={a.experience.journeyLabel} className="relative mt-20 grid gap-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-5 lg:gap-6">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[1.6rem] hidden h-px bg-gradient-to-r from-kin via-kin/50 to-transparent lg:block" />
          {a.experience.journey.map((step, index) => (
            <li key={step.title} className="relative">
              <span
                aria-hidden="true"
                className="relative flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full border border-kin bg-washi font-mincho text-xl"
              >
                {KANJI_NUMERALS[index]}
              </span>
              <p className="mt-5 font-mincho text-xl">{step.title}</p>
              <p className="mt-2 max-w-[16rem] font-gothic text-sm leading-relaxed text-nezumi">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* 06 — Wartości */}
      <div id={ids[5]} className="relative scroll-mt-6 overflow-hidden bg-kinari">
        <div className="text-sumi/[0.08]">
          <Pattern kind="kumiko" strokeWidth={0.8} scale={1.4} />
        </div>
        <div className="page-x relative py-24 sm:py-28">
          <Chapter index={5} name={a.chapters[5]} />
          <h3 className="display display-md mt-8">{a.values.title}</h3>
          <ul className="mt-14 grid border-sumi/20 sm:grid-cols-2 lg:grid-cols-4 lg:border-l">
            {a.values.items.map((value) => (
              <li key={value.kanji} className="border-t border-sumi/20 bg-kinari/85 py-8 lg:border-r lg:border-t-0 lg:px-8 lg:py-4">
                <span aria-hidden="true" className="block font-mincho text-[4.5rem] leading-none">
                  {value.kanji}
                </span>
                <p className="mt-8 font-mincho text-2xl">{value.name}</p>
                <p className="mt-3 max-w-[18rem] font-gothic text-sm leading-relaxed text-sumi/80">{value.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Zakończenie */}
      <div className="page-x py-28 sm:py-40">
        <div className="mx-auto max-w-[72rem]">
          <Reveal>
            <h3 className="display text-[clamp(2.75rem,7.5vw,7.5rem)] leading-[0.98]">{a.closing.title}</h3>
          </Reveal>
          <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <p className="lead">{a.closing.text}</p>
            <LocalizedLink route="booking" className="btn btn-ink shrink-0">
              {a.closing.cta}
              <ArrowIcon className="btn-arrow h-4 w-4" />
            </LocalizedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
