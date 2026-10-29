import { CheckoutDemo, DemoBanner } from "@/components/order/CheckoutDemo";
import { OrderMissing } from "@/components/order/OrderMissing";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getOrderForSession } from "@/lib/server/orders";
import { readDemoSession } from "@/lib/server/session";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Płatność demonstracyjna",
  description: "Demonstracyjny checkout InterPodatki. Płatności nie są realizowane, a dane kart nie są przetwarzane.",
  path: "/platnosc-demo",
  noindex: true,
});

export default async function CheckoutPage({ searchParams }: PageProps<"/platnosc-demo">) {
  const { zamowienie } = await searchParams;
  const order = typeof zamowienie === "string" ? getOrderForSession(zamowienie, await readDemoSession()) : undefined;

  return (
    <>
      <DemoBanner />
      <section className="border-b border-line bg-mist">
        <div className="shell py-10">
          <Breadcrumbs items={[{ href: "/zamowienie", label: "Zamówienie" }, { href: "/platnosc-demo", label: "Płatność demo" }]} />
          <h1 className="mt-5 text-[clamp(2rem,1.5rem+2vw,3rem)]">Płatność</h1>
        </div>
      </section>
      <div className="bg-mist/60 py-10 sm:py-14">
        <div className="shell">{order ? <CheckoutDemo initialOrder={order} /> : <OrderMissing />}</div>
      </div>
    </>
  );
}
