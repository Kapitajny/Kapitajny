import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DURATIONS, durationLabelLong, formatPrice, jetskiTitle } from "@/lib/rental";
import { getPublicData } from "@/lib/server/public-data";
import { LICENSE_LABEL } from "@/components/home/FleetRail";
import { ArrowLeftIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";

export const metadata: Metadata = { title: "Skuter wodny – szczegóły" };

async function Details({ params }: { params: PageProps<"/flota/[id]">["params"] }) {
  const [{ id }, data] = await Promise.all([params, getPublicData()]);
  const j = data.jetskis.find((x) => x.id === id);
  if (!j) notFound();
  const specs = [
    ["Producent", j.manufacturer],
    ["Model", j.model],
    ["Moc silnika", j.powerHp != null ? `${j.powerHp} KM` : null],
    ["Liczba miejsc", j.seats != null ? String(j.seats) : null],
    ["Uprawnienia", LICENSE_LABEL[j.license]],
    ["Kaucja zwrotna", j.depositGr != null ? formatPrice(j.depositGr) : null],
  ];

  return (
    <>
      <section className="on-dark relative isolate bg-graphite pb-14 pt-24 text-white md:pt-28">
        <div className="wrap">
          <Link href="/#flota" className="inline-flex min-h-11 items-center gap-2 font-semibold text-white/80 hover:text-white">
            <ArrowLeftIcon /> Wróć do floty
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate">
              {j.image ? <Photo src={j.image} alt={j.imageAlt ?? jetskiTitle(j)} sizes="(min-width: 1024px) 58vw, 100vw" priority /> : <div className="grid h-full place-items-center text-white/40">Zdjęcie wkrótce</div>}
            </div>
            <div>
              {j.manufacturer && <p className="text-lg text-mist">{j.manufacturer}</p>}
              <h1 className="display-lg mt-1">{j.model ?? j.name}</h1>
              <span className="wake mt-6 rotate-[-3deg] w-[90%]" aria-hidden="true" />
              {j.description && <p className="mt-6 whitespace-pre-line text-lg text-white/80">{j.description}</p>}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/rezerwacja?skuter=${encodeURIComponent(j.id)}`} className="btn btn-primary">
                  Zarezerwuj ten skuter
                </Link>
                <Link href="/#cennik" className="btn btn-ghost">
                  Porównaj ceny
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="on-light bg-white py-16 md:py-24">
        <div className="wrap grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="display-md">Parametry</h2>
            <dl className="mt-6 border-t-2 border-graphite">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-line py-3">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-semibold">{v ?? <span className="font-normal text-muted">wkrótce</span>}</dd>
                </div>
              ))}
            </dl>
            {j.licenseNote && (
              <div className="mt-6 border-l-4 border-turq py-1 pl-4">
                <p className="font-semibold">Wymagania</p>
                <p className="mt-1 whitespace-pre-line text-muted">{j.licenseNote}</p>
              </div>
            )}
          </div>
          <div>
            <h2 className="display-md">Cennik</h2>
            <p className="mt-2 text-muted">Ceny brutto w złotych, z podatkiem VAT.</p>
            <dl className="tabular mt-6 border-t-2 border-graphite">
              {DURATIONS.map((d) => (
                <div key={d} className="flex justify-between gap-6 border-b border-line py-3">
                  <dt className="text-muted">{durationLabelLong(d)}</dt>
                  <dd className={j.prices[d] == null ? "text-muted" : "font-display text-2xl font-bold leading-none"}>{formatPrice(j.prices[d])}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-muted">„—” oznacza, że cena tego wariantu nie jest jeszcze ustalona.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function JetskiPage(props: PageProps<"/flota/[id]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh] bg-graphite" aria-busy="true" />}>
      <Details params={props.params} />
    </Suspense>
  );
}
