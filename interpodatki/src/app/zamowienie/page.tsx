import { OrderFlow } from "@/components/order/OrderFlow";
import { Notice } from "@/components/ui/Notice";
import { PageIntro } from "@/components/ui/PageIntro";
import { getPackage, type PackageId } from "@/lib/pricing/packages";
import { calculatorToParams, hasCalculatorParams, parseCalculatorParams } from "@/lib/pricing/params";
import { getOrderForSession } from "@/lib/server/orders";
import { readDemoSession } from "@/lib/server/session";
import { pageMetadata } from "@/lib/seo";
import { emptyOrderCustomer } from "@/lib/validation/order";

export const metadata = pageMetadata({
  title: "Zamówienie usługi",
  description: "Wybierz abonament, sprawdź zakres i koszty, a następnie przejdź do demonstracyjnej płatności.",
  path: "/zamowienie",
  noindex: true,
});

export default async function OrderPage({ searchParams }: PageProps<"/zamowienie">) {
  const params = await searchParams;
  let source: URLSearchParams | Record<string, string | string[] | undefined> = params;
  let customer = emptyOrderCustomer;
  let packageParam = typeof params.pakiet === "string" ? params.pakiet : null;

  // Powrót z płatności: odtwarzamy wybór na podstawie zamówienia zapisanego w tej sesji demo.
  const previousId = typeof params.zamowienie === "string" ? params.zamowienie : null;
  const previous = previousId ? getOrderForSession(previousId, await readDemoSession()) : undefined;
  if (previous) {
    source = previous.calculatorQuery ? new URLSearchParams(previous.calculatorQuery) : {};
    packageParam = previous.priceBasis === "package" ? previous.packageId : null;
    customer = { ...emptyOrderCustomer, name: previous.customer.name, company: previous.customer.company };
  }

  const calculator = hasCalculatorParams(source) ? parseCalculatorParams(source) : null;
  const pkg = getPackage(packageParam);

  return (
    <>
      <PageIntro
        crumbs={[{ href: "/zamowienie", label: "Zamówienie" }]}
        title="Zamówienie usługi"
        lede="Wybierz abonament, sprawdź zakres i koszty, podaj dane testowe i przejdź do demonstracyjnej płatności."
      />
      <div className="bg-mist/60 py-10 sm:py-14">
        <div className="shell">
          {previous && (
            <Notice tone="info" className="mb-6" title={`Edytujesz zamówienie ${previous.number}`}>
              Przywróciliśmy wybrany abonament, imię i nazwę firmy. Ze względów bezpieczeństwa wpisz ponownie adres e-mail
              – zapisaliśmy tylko jego zamaskowaną wersję. Zatwierdzenie utworzy nowe zamówienie testowe.
            </Notice>
          )}
          <OrderFlow
            calculator={calculator}
            calculatorQuery={calculator ? calculatorToParams(calculator).toString() : null}
            initialPackage={pkg ? (pkg.id as PackageId) : null}
            initialCustomer={customer}
          />
        </div>
      </div>
    </>
  );
}
