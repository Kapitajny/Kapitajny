import { formatAddress, phoneHref, siteConfig } from "@/config/site";
import { ClockIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";

/** Górny pasek z adresem, godzinami i telefonem. Pokazuje tylko uzupełnione dane, a bez nich się nie wyświetla. */
export function TopBar() {
  const { phone } = siteConfig.contact;
  const address = formatAddress();
  const weekdays = siteConfig.openingHours[0];
  if (!phone && !address && !weekdays?.hours) return null;

  return (
    <aside aria-label="Dane kontaktowe" className="hidden bg-forest text-[0.95rem] text-white md:block">
      <div className="container-x flex h-10 items-center justify-between gap-6">
        <ul className="flex items-center gap-6">
          {address && (
            <li className="flex items-center gap-2">
              <PinIcon size={16} className="text-sage" />
              {address}
            </li>
          )}
          {weekdays?.hours && (
            <li className="flex items-center gap-2">
              <ClockIcon size={16} className="text-sage" />
              {weekdays.days}: {weekdays.hours}
            </li>
          )}
        </ul>
        {phone && (
          <a href={phoneHref(phone)} className="flex items-center gap-2 font-bold hover:underline">
            <PhoneIcon size={16} className="text-sage" />
            {phone}
          </a>
        )}
      </div>
    </aside>
  );
}
