import type { Metadata } from "next";
import Link from "next/link";
import { bookingHref } from "@/config/site";
import { TreatmentBrowser } from "@/components/treatments/TreatmentBrowser";
import { DemoNote } from "@/components/ui/DemoNote";
import { PageHead } from "@/components/ui/PageHead";
import { Photo } from "@/components/ui/Photo";

export const metadata: Metadata = {
  title: "Zabiegi",
  description: "Medycyna estetyczna, zabiegi na skórę, kosmetologia profesjonalna i konsultacje skóry w VÉRA Aesthetic Studio.",
  alternates: { canonical: "/zabiegi" },
  openGraph: { title: "Zabiegi | VÉRA Aesthetic Studio", url: "/zabiegi" },
};

export default function TreatmentsPage() {
  return (
    <>
      <PageHead
        crumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/zabiegi", label: "Zabiegi" },
        ]}
        title="Zabiegi"
        lede="Od medycyny estetycznej po chwilę relaksu. Każdy plan zaczyna się od rozmowy o tym, czego naprawdę potrzebujesz."
      />

      <section aria-label="Lista zabiegów" className="shell pb-20 sm:pb-24">
        <TreatmentBrowser />
      </section>

      <section aria-labelledby="start-title" className="bg-powder py-20 sm:py-24">
        <div className="shell mx-auto grid max-w-5xl items-center gap-10 sm:grid-cols-[auto_1fr] sm:gap-14">
          <Photo image="consultation" sizes="240px" className="oval mx-auto aspect-[3/4] w-48 sm:w-56" />
          <div className="text-center sm:text-left">
            <h2 id="start-title" className="script text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.1]">
              Nie wiesz, od czego zacząć?
            </h2>
            <p className="mt-4 max-w-lg font-light text-black/80">
              Umów konsultację skóry. To godzina, podczas której specjalistka lub specjalista ocenia Twoją skórę, słucha, co chcesz zmienić, i przygotowuje plan na
              piśmie.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link href={`${bookingHref}?zabieg=konsultacja-skory`} className="pill pill-solid">
                Umów konsultację skóry
              </Link>
              <Link href="/zabiegi/konsultacja-skory" className="pill pill-line">
                Jak wygląda konsultacja
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="shell py-14">
        <DemoNote>
          Opisy zabiegów na tej demonstracyjnej stronie mają charakter poglądowy i przed publikacją musi je sprawdzić personel medyczny studia. Efekty różnią się u
          poszczególnych osób i nigdy nie są gwarantowane.
        </DemoNote>
      </div>
    </>
  );
}
