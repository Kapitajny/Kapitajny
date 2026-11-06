import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-x max-w-3xl">
        <p className="eyebrow">Błąd 404</p>
        <h1 className="h-display mt-5">Nie znaleźliśmy tej strony</h1>
        <p className="lead mt-6">Adres mógł się zmienić albo strona została usunięta. Skorzystaj z menu lub wróć na stronę główną.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-dark">
            Strona główna
            <Icon name="arrowRight" size={18} />
          </Link>
          <a href={siteConfig.contact.phoneHref} className="btn btn-outline">
            <Icon name="phone" size={18} />
            {siteConfig.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
