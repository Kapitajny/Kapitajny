import Link from "next/link";
import { bookHref, site } from "@/config/site";

/** Closing call to action – book a consultation or call. */
export function BookBand({ title = "Begin with a consultation", treatment }: { title?: string; treatment?: string }) {
  return (
    <section aria-labelledby="book-band" className="bg-burgundy text-ivory">
      <div className="wrap grid gap-10 py-20 lg:grid-cols-12 lg:items-end lg:py-28">
        <h2 id="book-band" className="display-lg lg:col-span-8">
          {title}
        </h2>
        <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <Link href={treatment ? `${bookHref}?treatment=${treatment}` : bookHref} className="cta cta-ivory">
            Book a consultation
          </Link>
          <a href={site.contact.phoneHref} className="cta cta-line-light">
            {site.contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
