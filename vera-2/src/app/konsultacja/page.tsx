import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ConsultationFormFromUrl } from "@/components/forms/ConsultationForm";
import { PageHead } from "@/components/ui/PageHead";

export const metadata: Metadata = {
  title: "Umów konsultację",
  description: "Zapytaj o konsultację w VÉRA Aesthetic Studio. Napisz, co Cię interesuje i kiedy Ci pasuje – oddzwonimy, aby ustalić termin.",
  alternates: { canonical: "/konsultacja" },
  openGraph: { title: "Umów konsultację | VÉRA Aesthetic Studio", url: "/konsultacja" },
};

const next = ["Czytamy Twoje zapytanie w godzinach otwarcia.", "Dzwonimy lub piszemy z propozycją terminów.", "Potwierdzasz termin – dopiero wtedy wizyta jest umówiona."];

export default function BookPage() {
  const { contact, bookingUrl } = siteConfig;
  return (
    <>
      <PageHead
        crumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/konsultacja", label: "Umów konsultację" },
        ]}
        title="Umów konsultację"
        lede="Napisz, co Cię interesuje i kiedy Ci pasuje. Zajmie Ci to około dwóch minut."
      >
        <ol aria-label="Co dalej" className="mx-auto mt-10 grid max-w-4xl gap-4 text-left sm:grid-cols-3">
          {next.map((item, i) => (
            <li key={item} className="flex items-center gap-4 rounded-full bg-blush py-2 pl-2 pr-5">
              <span aria-hidden="true" className="script grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ivory text-lg">
                {i + 1}
              </span>
              <span className="text-sm leading-snug text-stone">{item}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-stone">
          Wolisz porozmawiać?{" "}
          <a href={contact.phoneHref} className="rose-link font-medium text-burgundy">
            Zadzwoń: {contact.phone}
          </a>
        </p>
        {bookingUrl && (
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="pill pill-line mt-6">
            Otwórz kalendarz wizyt<span className="sr-only"> (otwiera się w nowej karcie)</span>
          </a>
        )}
      </PageHead>

      <section aria-label="Formularz" className="bg-blush py-16 sm:py-24">
        <div className="shell">
          <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-ivory px-5 py-10 sm:rounded-[3.5rem] sm:px-12 sm:py-14">
            <ConsultationFormFromUrl />
          </div>
        </div>
      </section>
    </>
  );
}
