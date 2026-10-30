import Link from "next/link";
import { bookingHref, siteConfig } from "@/config/site";

/** Zamknięcie podstrony – zaproszenie na konsultację z alternatywą telefoniczną. */
export function BookingCta({ title = "Zacznij od konsultacji", text, serviceSlug }: { title?: string; text?: string; serviceSlug?: string }) {
  const href = serviceSlug ? `${bookingHref}?zabieg=${serviceSlug}` : bookingHref;
  return (
    <section aria-labelledby="cta-title" data-surface="dark" className="bg-espresso text-ivory">
      <div className="frame grid gap-10 py-20 md:grid-cols-12 md:items-end lg:py-28">
        <div className="md:col-span-7">
          <h2 id="cta-title" className="text-[clamp(2.5rem,5.5vw,4.25rem)] text-ivory">
            {title}
          </h2>
          <p className="mt-6 max-w-lg text-ivory/75">
            {text ?? "Wyślij zapytanie, a koordynatorka pacjentek oddzwoni, aby zaproponować termin. Możesz też zadzwonić bezpośrednio do recepcji."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
          <Link href={href} className="btn btn-light">
            Umów konsultację
          </Link>
          <a href={siteConfig.contact.phoneHref} className="btn btn-outline-light">
            {siteConfig.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
