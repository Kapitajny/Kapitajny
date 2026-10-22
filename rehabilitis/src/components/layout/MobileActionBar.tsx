import { phoneHref, siteConfig } from "@/config/site";
import { BookingLink } from "@/components/ui/BookingLink";
import { PhoneIcon } from "@/components/ui/Icons";

/**
 * Stały pasek akcji na telefonach: „Zadzwoń” (gdy numer jest uzupełniony) i „Umów wizytę”.
 * Na większych ekranach te akcje są w nagłówku.
 */
export function MobileActionBar() {
  const { phone } = siteConfig.contact;
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:hidden">
      <div className={`grid gap-3 ${phone ? "grid-cols-2" : "grid-cols-1"}`}>
        {phone && (
          <a href={phoneHref(phone)} className="btn btn-secondary w-full">
            <PhoneIcon size={18} /> Zadzwoń
          </a>
        )}
        <BookingLink className="btn btn-primary w-full" />
      </div>
    </div>
  );
}
