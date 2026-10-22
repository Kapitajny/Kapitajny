import { PAYMENT_METHODS, PRICE_LIST } from "@/data/pricing";
import { PendingValue } from "@/components/ui/Pending";

export function Pricing() {
  return (
    <section id="cennik" aria-labelledby="cennik-title" className="section-y border-t border-line bg-white">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <h2 id="cennik-title" className="h2">
            Cennik
          </h2>
          <p className="section-intro">Zakres oraz czas terapii ustalane są indywidualnie – liczbę i częstotliwość wizyt omawiamy po pierwszym spotkaniu.</p>
          <p className="mt-6 text-[0.95rem] text-muted">
            Formy płatności: {PAYMENT_METHODS?.length ? <span className="text-ink">{PAYMENT_METHODS.join(", ")}</span> : <PendingValue />}
          </p>
        </div>

        <div>
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Cennik usług gabinetu</caption>
            <thead>
              <tr className="border-b-2 border-forest text-sm text-muted">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Usługa
                </th>
                <th scope="col" className="hidden w-32 py-3 pr-4 font-semibold sm:table-cell">
                  Czas
                </th>
                <th scope="col" className="w-28 py-3 text-right font-semibold sm:w-36">
                  Cena
                </th>
              </tr>
            </thead>
            <tbody>
              {PRICE_LIST.map((item) => (
                <tr key={item.title} className="border-b border-line align-top">
                  <th scope="row" className="py-4 pr-4 font-normal">
                    <span className="block font-semibold text-ink">{item.title}</span>
                    {item.note && <span className="mt-0.5 block text-[0.92rem] text-muted">{item.note}</span>}
                    <span className="mt-1 block text-[0.92rem] sm:hidden">Czas: {item.duration ?? <PendingValue />}</span>
                  </th>
                  <td className="hidden py-4 pr-4 sm:table-cell">{item.duration ?? <PendingValue />}</td>
                  <td className="py-4 text-right font-semibold text-forest">{item.price ?? <PendingValue />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
