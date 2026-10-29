import Link from "next/link";
import { DocumentPreview } from "@/components/panel/DocumentPreview";
import { DocumentsChart } from "@/components/panel/DocumentsChart";
import { IconCheck, IconFolder, IconLedger } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import { PageIntro } from "@/components/ui/PageIntro";
import { formatDateTime, formatPLN } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/payments";
import { getPackage } from "@/lib/pricing/packages";
import { listInquiriesForSession } from "@/lib/server/inquiries";
import { listOrdersForSession } from "@/lib/server/orders";
import { readDemoSession } from "@/lib/server/session";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Panel klienta (demo)",
  description: "Demonstracyjny panel klienta InterPodatki: pakiet, status umowy, zamówienia testowe, przykładowe faktury i dokumenty.",
  path: "/panel-demo",
  noindex: true,
});

const sampleDocuments = [
  { name: "Wzór umowy o świadczenie usług księgowych", type: "Wzór – do opracowania przez prawnika" },
  { name: "Lista dokumentów do przekazania na start", type: "Lista kontrolna" },
  { name: "Zestawienie miesięczne – październik", type: "Raport przykładowy" },
];

const chartData = [
  { label: "maj", value: 38 },
  { label: "cze", value: 44 },
  { label: "lip", value: 41 },
  { label: "sie", value: 35 },
  { label: "wrz", value: 49 },
  { label: "paź", value: 52 },
];

export default async function PanelPage() {
  const session = await readDemoSession();
  const orders = listOrdersForSession(session);
  const inquiries = listInquiriesForSession(session);
  const active = orders.find((o) => o.status === "paid");
  const fallback = getPackage("biznes")!;

  const packageName = active?.packageName ?? `${fallback.name} (przykład)`;
  const monthly = active?.monthly ?? 1480;
  const scope = active?.scope ?? fallback.features;
  const contractStatus = active ? "Aktywna – umowa demonstracyjna" : "Brak – dane przykładowe";

  const invoices = [
    ...(active
      ? [{ number: `DEMO/${active.number.slice(-7)}/1`, period: "Pierwszy miesiąc + wdrożenie", amount: active.dueNow, status: "Opłacona (symulacja)" }]
      : []),
    { number: "DEMO/2026/10/001", period: "Październik 2026", amount: 1480, status: "Przykład" },
    { number: "DEMO/2026/09/001", period: "Wrzesień 2026", amount: 1480, status: "Przykład" },
    { number: "DEMO/2026/08/001", period: "Sierpień 2026", amount: 1480, status: "Przykład" },
  ];

  return (
    <>
      <PageIntro
        crumbs={[{ href: "/panel-demo", label: "Panel klienta (demo)" }]}
        title="Panel klienta"
        lede="Podgląd tego, jak mógłby wyglądać panel klienta: pakiet, status umowy, zamówienia, faktury i dokumenty."
      >
        <span className="demo-stamp">Tryb demonstracyjny bez logowania</span>
      </PageIntro>

      <div className="py-10 sm:py-14">
        <div className="shell space-y-10">
          <Notice tone="demo" title="To nie jest system z logowaniem">
            Panel pokazuje zamówienia i zgłoszenia utworzone w tej przeglądarce (anonimowe ciasteczko sesji, ważne kilka
            godzin). Nie zawiera prawdziwych dokumentów księgowych ani podatkowych. Produkcyjny panel wymaga
            uwierzytelniania, autoryzacji i bezpiecznego magazynu plików.
          </Notice>

          <section aria-labelledby="podsumowanie">
            <h2 id="podsumowanie" className="sr-only">
              Podsumowanie
            </h2>
            <dl className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-line bg-line sm:grid-cols-3">
              <div className="bg-white p-5">
                <dt className="text-sm text-muted">Wybrany pakiet</dt>
                <dd className="mt-1 font-serif text-2xl text-navy" data-testid="panel-package">
                  {packageName}
                </dd>
              </div>
              <div className="bg-white p-5">
                <dt className="text-sm text-muted">Abonament netto</dt>
                <dd className="num mt-1 font-serif text-2xl text-navy">
                  <span className="ledger-total">{formatPLN(monthly)}</span>
                  <span className="ml-1 font-sans text-sm text-muted">/ mies.</span>
                </dd>
              </div>
              <div className="bg-white p-5">
                <dt className="text-sm text-muted">Status umowy</dt>
                <dd className={`mt-1 flex items-center gap-2 font-medium ${active ? "text-teal-ink" : "text-ink"}`}>
                  {active && <IconCheck size={18} />}
                  {contractStatus}
                </dd>
              </div>
            </dl>
          </section>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
            <section aria-labelledby="zamowienia" className="panel p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="zamowienia" className="text-[1.5rem]">
                  Zamówienia testowe
                </h2>
                <Link href="/zamowienie" className="btn btn-sm btn-outline">
                  Nowe zamówienie testowe
                </Link>
              </div>
              {orders.length === 0 ? (
                <p className="mt-4 text-ink">
                  Brak zamówień w tej sesji. Złóż zamówienie testowe, aby zobaczyć je tutaj wraz ze statusem płatności demo.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="num w-full min-w-[30rem] text-left text-[0.9375rem]">
                    <thead className="text-sm text-muted">
                      <tr>
                        <th scope="col" className="py-2 pr-4 font-medium">Numer</th>
                        <th scope="col" className="py-2 pr-4 font-medium">Pakiet</th>
                        <th scope="col" className="py-2 pr-4 font-medium">Status</th>
                        <th scope="col" className="py-2 text-right font-medium">Miesięcznie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <th scope="row" className="py-3 pr-4 font-normal">
                            <Link
                              href={o.status === "paid" ? `/potwierdzenie?zamowienie=${o.id}` : `/platnosc-demo?zamowienie=${o.id}`}
                              className="link"
                            >
                              {o.number}
                            </Link>
                            <span className="block text-xs text-muted">{formatDateTime(o.createdAt)}</span>
                          </th>
                          <td className="py-3 pr-4">{o.packageName}</td>
                          <td className={`py-3 pr-4 ${o.status === "paid" ? "text-teal-ink" : o.status === "failed" ? "text-danger" : "text-ink"}`}>
                            {ORDER_STATUS_LABELS[o.status]}
                          </td>
                          <td className="py-3 text-right text-navy">{formatPLN(o.monthly)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {inquiries.length > 0 && (
                <div className="mt-8 border-t border-line pt-6">
                  <h3 className="font-sans text-base font-semibold">Zgłoszenia z formularzy</h3>
                  <ul className="mt-3 divide-y divide-line text-[0.9375rem]">
                    {inquiries.map((i) => (
                      <li key={i.id} className="py-3">
                        <span className="num font-medium text-navy">{i.number}</span>
                        <span className="ml-2 text-sm text-muted">
                          {i.kind === "wycena" ? "Wycena" : "Kontakt"}, {formatDateTime(i.createdAt)}, {i.emailMasked}
                        </span>
                        <span className="block text-ink">{i.summary}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <section aria-labelledby="zakres-uslug" className="panel p-5 sm:p-6">
              <h2 id="zakres-uslug" className="text-[1.5rem]">
                Zakres usług
              </h2>
              <ul className="mt-4 space-y-2.5">
                {scope.map((item) => (
                  <li key={item} className="flex gap-2 text-ink">
                    <IconCheck size={18} className="mt-0.5 shrink-0 text-teal-ink" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-line pt-6">
                <DocumentsChart data={chartData} title="Dokumenty przekazane w miesiącu (dane przykładowe)" unit="dok." />
              </div>
            </section>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <section aria-labelledby="faktury" className="panel p-5 sm:p-6">
              <h2 id="faktury" className="flex items-center gap-2 text-[1.5rem]">
                <IconLedger size={22} className="text-blue-ink" />
                Faktury (DEMO)
              </h2>
              <p className="mt-1 text-sm text-muted">Dokumenty przykładowe – nie są fakturami VAT i nie mają mocy prawnej.</p>
              <ul className="mt-4 divide-y divide-line">
                {invoices.map((inv) => (
                  <li key={inv.number} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="num font-medium text-navy">{inv.number}</p>
                      <p className="text-sm text-muted">
                        {inv.period}, {inv.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="num font-semibold text-navy">{formatPLN(inv.amount)}</span>
                      <DocumentPreview label="Podgląd" title={`Faktura ${inv.number} (DEMO)`}>
                        <dl className="num grid grid-cols-2 gap-y-2 text-[0.9375rem]">
                          <dt className="text-muted">Numer</dt>
                          <dd>{inv.number}</dd>
                          <dt className="text-muted">Okres</dt>
                          <dd>{inv.period}</dd>
                          <dt className="text-muted">Sprzedawca</dt>
                          <dd>InterPodatki (marka fikcyjna)</dd>
                          <dt className="text-muted">Nabywca</dt>
                          <dd>Klient demonstracyjny</dd>
                          <dt className="text-muted">Pozycja</dt>
                          <dd>Obsługa księgowa – pakiet {packageName}</dd>
                          <dt className="text-muted">Kwota netto</dt>
                          <dd className="font-semibold text-navy">{formatPLN(inv.amount)}</dd>
                        </dl>
                        <p className="mt-6 rounded-md bg-mist p-3 text-sm text-ink">
                          Dokument demonstracyjny. Nie jest fakturą VAT, nie zawiera danych rejestrowych i nie stanowi
                          podstawy do zapłaty ani księgowania.
                        </p>
                      </DocumentPreview>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="dokumenty" className="panel p-5 sm:p-6">
              <h2 id="dokumenty" className="flex items-center gap-2 text-[1.5rem]">
                <IconFolder size={22} className="text-blue-ink" />
                Dokumenty
              </h2>
              <p className="mt-1 text-sm text-muted">Materiały przykładowe. Przesyłanie plików jest wyłączone w wersji demo.</p>
              <ul className="mt-4 divide-y divide-line">
                {sampleDocuments.map((doc) => (
                  <li key={doc.name} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-medium text-navy">{doc.name}</p>
                      <p className="text-sm text-muted">{doc.type}</p>
                    </div>
                    <DocumentPreview label="Podgląd" title={`${doc.name} (DEMO)`}>
                      <p className="text-ink">
                        Podgląd dokumentu demonstracyjnego „{doc.name}”. W wersji produkcyjnej w tym miejscu
                        wyświetlałby się plik udostępniony przez biuro – po zalogowaniu i weryfikacji uprawnień.
                      </p>
                      <p className="mt-4 text-sm text-muted">
                        Treść wzorów umów i dokumentów prawnych musi przygotować lub zweryfikować prawnik.
                      </p>
                    </DocumentPreview>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
