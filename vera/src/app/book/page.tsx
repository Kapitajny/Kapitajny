import type { Metadata } from "next";
import { site } from "@/config/site";
import { BookingFormFromUrl } from "@/components/forms/BookingFormFromUrl";
import { Crumbs } from "@/components/ui/Crumbs";
import { JsonLd, breadcrumbs } from "@/components/seo/JsonLd";
import { DisplayPhone } from "@/components/ui/DisplayPhone";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Request a consultation at VÉRA Aesthetic Studio in Kraków. Choose a treatment area and times that suit you – the studio will contact you to confirm.",
  alternates: { canonical: "/book" },
  openGraph: { title: "Book a consultation – VÉRA Aesthetic Studio", url: "/book" },
};

export default function BookPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Book a consultation", path: "/book" }])} />
      <div className="wrap grid gap-16 pb-24 pt-[calc(var(--bar)+2.5rem)] lg:grid-cols-12 lg:gap-8 lg:pb-32">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Crumbs items={[{ href: "/", label: "Home" }, { href: "/book", label: "Book a consultation" }]} />
            <h1 className="display-lg mt-12">
              Book a <span className="italic text-burgundy">consultation</span>
            </h1>
            <p className="mt-8 max-w-sm text-stone">
              Three short steps. We&apos;ll get back to you to agree a time – your visit is booked once we confirm it.
            </p>
            {site.bookingUrl && (
              <p className="mt-8 text-sm">
                Prefer to pick a slot yourself?{" "}
                <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="underline-draw font-medium">
                  Open the online calendar<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            )}
            <div className="mt-10 border-t border-black/15 pt-6 text-sm text-stone">
              Rather talk to someone?
              <a href={site.contact.phoneHref} className="mt-1 block font-display text-2xl text-black hover:text-burgundy">
                <DisplayPhone number={site.contact.phone} />
              </a>
            </div>
          </div>
        </header>
        <section aria-label="Consultation request" className="lg:col-span-7 lg:col-start-6">
          <BookingFormFromUrl />
        </section>
      </div>
    </>
  );
}
