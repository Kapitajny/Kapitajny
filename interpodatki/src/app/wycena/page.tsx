import { QuoteForm } from "@/components/forms/QuoteForm";
import { PageIntro } from "@/components/ui/PageIntro";
import { calculate } from "@/lib/pricing/calculator";
import { calculatorToParams, hasCalculatorParams, parseCalculatorParams } from "@/lib/pricing/params";
import { pageMetadata } from "@/lib/seo";
import { emptyQuote, type QuoteFormValues } from "@/lib/validation/quote";

export const metadata = pageMetadata({
  title: "Formularz indywidualnej wyceny",
  description:
    "Opisz swoją firmę i potrzeby – przygotujemy indywidualną wycenę obsługi księgowej, kadrowej i podatkowej. Dane z kalkulatora przenosimy automatycznie. Formularz demonstracyjny.",
  path: "/wycena",
});

export default async function QuotePage({ searchParams }: PageProps<"/wycena">) {
  const params = await searchParams;
  const fromCalculator = hasCalculatorParams(params);
  const calc = fromCalculator ? parseCalculatorParams(params) : null;

  const initial: QuoteFormValues = calc
    ? {
        ...emptyQuote,
        businessType: calc.businessType,
        documents: String(calc.documents),
        employees: String(calc.employees),
        services: calc.services,
      }
    : emptyQuote;

  return (
    <>
      <PageIntro
        crumbs={[{ href: "/wycena", label: "Indywidualna wycena" }]}
        title="Indywidualna wycena"
        lede="Trzy krótkie kroki i podsumowanie. Na podstawie odpowiedzi przygotowalibyśmy ofertę dopasowaną do Twojej firmy – w wersji demo zgłoszenie jest tylko zapisywane testowo."
      />
      <div className="bg-mist/60 py-10 sm:py-14">
        <div className="shell">
          <QuoteForm
            initial={initial}
            calculatorQuery={calc ? calculatorToParams(calc).toString() : null}
            estimate={calc ? calculate(calc) : null}
          />
        </div>
      </div>
    </>
  );
}
