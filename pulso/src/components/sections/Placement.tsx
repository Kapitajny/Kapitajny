import type { ServiceId } from "@/data/services";
import { channelColor } from "@/lib/channels";

/** Schematyczne ilustracje miejsc, w których wyświetla się reklama. Dekoracyjne (opis jest w tekście). */
export function Placement({ id }: { id: ServiceId }) {
  const c = channelColor(id);
  switch (id) {
    case "meta":
      return (
        <div className="mx-auto w-full max-w-[19rem] rounded-[14px] border border-rule bg-sheet p-3 shadow-(--shadow-lift)">
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-full" style={{ background: c }} />
            <span className="flex flex-col gap-1">
              <span className="h-2.5 w-24 rounded-full bg-ink" />
              <span className="text-[0.6875rem] leading-none text-ink-3">Sponsorowane</span>
            </span>
          </div>
          <span className="mt-3 block h-2 w-11/12 rounded-full bg-rule" />
          <span className="mt-1.5 block h-2 w-2/3 rounded-full bg-rule" />
          <span className="mt-3 block aspect-[4/5] w-full rounded-md" style={{ background: c }}>
            <span className="flex h-full items-end p-3">
              <span className="h-10 w-2/3 rounded bg-sheet/90" />
            </span>
          </span>
          <span className="mt-3 flex items-center justify-between rounded-md bg-paper-2 px-3 py-2">
            <span className="h-2 w-20 rounded-full bg-ink-3" />
            <span className="rounded px-2.5 py-1 text-[0.6875rem] font-[640] text-paper" style={{ background: "var(--color-ink)" }}>
              Dowiedz się więcej
            </span>
          </span>
        </div>
      );
    case "google":
      return (
        <div className="mx-auto w-full max-w-[24rem] rounded-[14px] border border-rule bg-sheet p-4 shadow-(--shadow-lift)">
          <div className="flex items-center gap-2 rounded-full border border-rule px-4 py-2.5">
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-ink-3" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className="text-sm text-ink-2">fizjoterapeuta mokotów</span>
          </div>
          <div className="mt-4 rounded-md border-[1.5px] p-3" style={{ borderColor: "var(--color-google-line)" }}>
            <span className="text-[0.6875rem] font-[700] tracking-wide text-ink">Sponsorowane</span>
            <span className="mt-1.5 block h-3 w-4/5 rounded-full" style={{ background: c }} />
            <span className="mt-2 block h-2 w-full rounded-full bg-rule" />
            <span className="mt-1.5 block h-2 w-3/4 rounded-full bg-rule" />
          </div>
          {[0, 1].map((k) => (
            <div key={k} className="mt-3 px-3">
              <span className="block h-3 w-2/3 rounded-full bg-ink-3/50" />
              <span className="mt-2 block h-2 w-full rounded-full bg-rule" />
              <span className="mt-1.5 block h-2 w-1/2 rounded-full bg-rule" />
            </div>
          ))}
        </div>
      );
    case "youtube":
      return (
        <div className="mx-auto w-full max-w-[26rem]">
          <div className="relative aspect-video overflow-hidden rounded-[12px] bg-ink shadow-(--shadow-lift)">
            <span className="absolute inset-0 grid place-items-center">
              <span className="h-14 w-20 rounded-2xl" style={{ background: c }}>
                <svg viewBox="0 0 24 24" className="mx-auto mt-3.5 h-7 w-7 text-paper" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
            <span className="absolute top-3 left-3 rounded bg-paper px-2 py-1 text-[0.6875rem] font-[700] text-ink">Reklama · 0:12</span>
            <span className="absolute right-3 bottom-5 rounded border border-paper/60 bg-ink/80 px-3 py-1.5 text-[0.75rem] font-[600] text-paper">
              Pomiń za 5
            </span>
            <span className="absolute inset-x-0 bottom-0 h-1.5 bg-paper/25">
              <span className="block h-full w-1/3" style={{ background: c }} />
            </span>
          </div>
          <span className="mt-3 block h-3 w-3/4 rounded-full bg-ink/80" />
          <span className="mt-2 block h-2 w-1/2 rounded-full bg-rule" />
        </div>
      );
    case "tiktok":
      return (
        <div className="relative mx-auto aspect-[9/16] w-full max-w-[14rem] overflow-hidden rounded-[18px] bg-ink shadow-(--shadow-lift)">
          <span className="absolute inset-x-6 top-[22%] bottom-[34%] rounded-xl" style={{ background: c }} />
          <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[0.75rem] font-[640] text-paper">Dla Ciebie</span>
          <span className="absolute right-3 bottom-24 flex flex-col gap-3">
            {[0, 1, 2].map((k) => (
              <span key={k} className="h-8 w-8 rounded-full bg-paper/25" />
            ))}
          </span>
          <span className="absolute inset-x-3 bottom-4 flex flex-col gap-1.5">
            <span className="text-[0.6875rem] font-[700] text-paper">Twoja marka · Sponsorowane</span>
            <span className="h-2 w-5/6 rounded-full bg-paper/50" />
            <span className="mt-1 rounded bg-paper py-1.5 text-center text-[0.6875rem] font-[700] text-ink">Kup teraz</span>
          </span>
        </div>
      );
  }
}
