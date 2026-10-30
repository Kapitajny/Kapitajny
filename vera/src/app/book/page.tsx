import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ConsultationFormFromUrl } from "@/components/forms/ConsultationForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Photo } from "@/components/ui/Photo";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Request a consultation at VÉRA Aesthetic Studio. Tell us what you are interested in and when suits you – we will contact you to agree a time.",
  alternates: { canonical: "/book" },
  openGraph: { title: "Book a consultation | VÉRA Aesthetic Studio", url: "/book" },
};

const next = [
  "We read your request during opening hours.",
  "We call or e-mail you with proposed times.",
  "You confirm the time that suits you – only then is the visit booked.",
];

export default function BookPage() {
  const { contact, bookingUrl } = siteConfig;
  return (
    <section className="shell grid gap-16 pb-28 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:gap-8 lg:pt-[calc(var(--header-h)+5rem)]">
      <div className="lg:col-span-4">
        <div>
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/book", label: "Book a consultation" },
            ]}
          />
          <h1 className="display mt-10 text-[clamp(3rem,12vw,6rem)] text-burgundy lg:text-[clamp(3rem,4.6vw,5.5rem)]">
            <span className="block">Book a</span>
            <span className="block pl-[0.6em]">consultation</span>
          </h1>
          <p className="mt-8 text-black/85">Tell us what you are interested in and when suits you. It takes about two minutes.</p>

          <h2 className="mt-12 font-serif text-2xl">What happens next</h2>
          <ol className="mt-5 space-y-4 text-sm">
            {next.map((item, i) => (
              <li key={item} className="flex gap-4 border-t border-line pt-4">
                <span aria-hidden="true" className="font-serif text-2xl leading-none text-rose-deep">
                  {i + 1}
                </span>
                <span className="text-stone">{item}</span>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-sm text-stone">
            Prefer to talk?{" "}
            <a href={contact.phoneHref} className="text-burgundy underline underline-offset-[3px]">
              Call {contact.phone}
            </a>
          </p>
          {bookingUrl && (
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-6">
              Open the booking calendar<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          <Photo image="portraitPlatinum" sizes="(min-width: 1024px) 28vw, 1px" className="mt-12 hidden aspect-[4/5] max-w-xs lg:block" />
        </div>
      </div>

      <div className="lg:col-span-8 lg:col-start-5">
        <ConsultationFormFromUrl />
      </div>
    </section>
  );
}
