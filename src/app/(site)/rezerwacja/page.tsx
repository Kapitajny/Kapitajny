import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublicData } from "@/lib/server/public-data";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Rezerwacja skutera",
  description: "Wybierz skuter, czas wynajmu, datę i godzinę. Sprawdź dostępność i cenę, a potem zarezerwuj termin online.",
};

async function Flow({ searchParams }: { searchParams: PageProps<"/rezerwacja">["searchParams"] }) {
  const [data, params] = await Promise.all([getPublicData(), searchParams]);
  const skuter = typeof params.skuter === "string" ? params.skuter : null;
  const czas = typeof params.czas === "string" ? Number(params.czas) : null;
  return <BookingFlow jetskis={data.jetskis} rules={{ cancelFreeHours: data.rules.cancelFreeHours, horizonDays: data.rules.horizonDays }} initialJetski={skuter} initialDuration={czas} />;
}

export default function BookingPage(props: PageProps<"/rezerwacja">) {
  return (
    <div className="on-light bg-sand pb-24 pt-28 md:pt-36">
      <div className="wrap">
        <h1 className="display-lg max-w-[12ch]">Zarezerwuj skuter</h1>
        <span className="wake mt-6 rotate-[-3deg] w-[min(40rem,90%)]" aria-hidden="true" />
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Pięć kroków: skuter, czas, data, godzina i Twoje dane. Widzisz tylko wolne terminy, a cena liczy się automatycznie.
        </p>
        <div className="mt-12">
          <Suspense fallback={<p className="text-muted">Ładowanie dostępnych skuterów…</p>}>
            <Flow searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
