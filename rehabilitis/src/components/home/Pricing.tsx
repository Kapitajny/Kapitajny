import { PAYMENT_METHODS, PRICE_LIST } from "@/data/pricing";
import { BookingLink } from "@/components/ui/BookingLink";
import { Pending, PendingValue } from "@/components/ui/Pending";
import { SectionHeading } from "./SectionHeading";

export function Pricing() {
  return (
    <section id="cennik" aria-labelledby="cennik-title" className="section-y border-t border-line">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="cennik-title" eyebrow="Cennik">
            Przejrzyste <em className="italic text-forest">zasady i ceny</em>
          </SectionHeading>
          <div className="mt-8 rounded-lg bg-sage p-6">
            <p className="font-serif text-xl leading-snug text-ink">Zakres oraz czas terapii ustalane są indywidualnie.</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-graphite">
              Liczbę i częstotliwość wizyt omawiamy po pierwszym spotkaniu, gdy wiemy już, jaka forma pracy będzie dla Ciebie odpowiednia.
            </p>
          </div>
          <p className="mt-6 text-sm text-muted">
            Formy płatności: {PAYMENT_METHODS?.length ? PAYMENT_METHODS.join(", ") : <Pending>akceptowane formy płatności</Pending>}
          </p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <ul aria-label="Cennik usług" className="border-t border-line">
            {PRICE_LIST.map((item) => (
              <li key={item.title} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 border-b border-line py-6 sm:grid-cols-[1fr_auto_auto] sm:gap-x-8 sm:items-baseline">
                <div className="col-span-2 sm:col-span-1">
                  <h3 className="text-[1.45rem] leading-tight">{item.title}</h3>
                  {item.note && <p className="mt-1.5 text-[0.92rem] text-muted">{item.note}</p>}
                </div>
                <p className="text-[0.95rem] text-muted sm:text-right">
                  <span className="sr-only">Czas trwania: </span>
                  {item.duration ?? <PendingValue label="Czas" />}
                </p>
                <p className="text-right font-serif text-xl text-forest">
                  <span className="sr-only">Cena: </span>
                  {item.price ?? <PendingValue label="Cena" />}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[0.95rem] text-muted">Masz pytanie o koszt terapii w Twojej sytuacji? Zapytaj – chętnie wyjaśnimy przed wizytą.</p>
            <BookingLink className="btn btn-secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}
