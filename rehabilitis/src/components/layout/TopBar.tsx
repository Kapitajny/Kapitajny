import { formatAddress, phoneHref, siteConfig } from "@/config/site";
import { ClockIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";

/** Górny pasek z najważniejszymi danymi – telefon, adres, godziny (jak na stronach gabinetów). */
export function TopBar() {
  const { phone } = siteConfig.contact;
  const address = formatAddress();
  const weekdays = siteConfig.openingHours[0];

  return (
    <div className="hidden bg-forest text-[0.9rem] text-white md:block">
      <div className="container-x flex h-10 items-center justify-between gap-6">
        <ul className="flex items-center gap-6">
          <li className="flex items-center gap-2">
            <PinIcon size={16} className="text-sage" />
            {address ?? <span className="text-white/75">Adres: do uzupełnienia</span>}
          </li>
          <li className="flex items-center gap-2">
            <ClockIcon size={16} className="text-sage" />
            {weekdays.days}: {weekdays.hours ?? <span className="text-white/75">do uzupełnienia</span>}
          </li>
        </ul>
        {phone ? (
          <a href={phoneHref(phone)} className="flex items-center gap-2 font-semibold hover:underline">
            <PhoneIcon size={16} className="text-sage" />
            {phone}
          </a>
        ) : (
          <span className="flex items-center gap-2 text-white/75">
            <PhoneIcon size={16} className="text-sage" />
            Telefon: do uzupełnienia
          </span>
        )}
      </div>
    </div>
  );
}
