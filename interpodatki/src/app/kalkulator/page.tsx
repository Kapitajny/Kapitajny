import { CalculatorApp } from "@/components/calculator/CalculatorApp";
import { PageIntro } from "@/components/ui/PageIntro";
import { parseCalculatorParams } from "@/lib/pricing/params";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kalkulator abonamentu księgowego",
  description:
    "Oblicz szacunkowy miesięczny abonament za księgowość, rozliczenia VAT, kadry i płace oraz doradztwo podatkowe. Wynik z rozbiciem na usługi, aktualizowany na bieżąco.",
  path: "/kalkulator",
});

export default async function CalculatorPage({ searchParams }: PageProps<"/kalkulator">) {
  const initial = parseCalculatorParams(await searchParams);
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/kalkulator", label: "Kalkulator" }]}
        title="Kalkulator abonamentu"
        lede="Przejdź przez cztery kroki – szacunkowa cena i jej rozbicie aktualizują się przy każdej zmianie. Konfigurację możesz przenieść do formularza wyceny lub zamówienia."
      />
      <div className="bg-mist/60 py-10 sm:py-14">
        <div className="shell">
          <CalculatorApp initial={initial} />
        </div>
      </div>
    </>
  );
}
