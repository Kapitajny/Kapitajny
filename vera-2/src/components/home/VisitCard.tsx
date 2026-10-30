import Link from "next/link";
import { bookingHref, siteConfig } from "@/config/site";

export function VisitCard() {
  const { contact, address, hours } = siteConfig;
  return (
    <section aria-labelledby="visit-title" className="pb-20 sm:pb-28">
      <div className="shell">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-powder px-6 py-14 text-center sm:rounded-[4rem] sm:px-12 sm:py-20">
          <h2 id="visit-title" className="script text-[clamp(2.4rem,6vw,4rem)]">
            Zajrzyj do nas
          </h2>
          <address className="mt-6 text-lg not-italic">
            {address.street}, {address.postalCode} {address.city}
            <span className="block text-sm text-stone">{address.note}</span>
          </address>
          <p className="mt-6 text-sm">
            {hours.map((h, i) => (
              <span key={h.days}>
                {h.days} {h.time}
                {i < hours.length - 1 && <br className="sm:hidden" />}
                {i < hours.length - 1 && <span className="hidden sm:inline"> &nbsp;/&nbsp; </span>}
              </span>
            ))}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={bookingHref} className="pill pill-solid">
              Umów konsultację
            </Link>
            <a href={contact.phoneHref} className="pill pill-line">
              Zadzwoń: {contact.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
