import { Icon } from "@/components/ui/Icons";
import { siteConfig } from "@/config/site";

/** Górny pasek: informacja o numerach alarmowych i całodobowa dyspozytornia transportu. */
export function EmergencyBar() {
  const { contact } = siteConfig;
  return (
    <div className="bg-ink text-[0.88rem] text-white/80">
      <div className="container-x flex min-h-10 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2">
        <p className="flex items-center gap-2">
          <Icon name="alert" size={16} className="shrink-0 text-[#ff4d55]" />
          <span>
            W stanie zagrożenia życia dzwoń <strong className="font-semibold text-white">112</strong> lub{" "}
            <strong className="font-semibold text-white">999</strong>
          </span>
        </p>
        <div className="hidden items-center gap-6 md:flex">
          <span className="flex items-center gap-2">
            <Icon name="clock" size={16} className="text-white/60" />
            Dyspozytornia transportu 24/7
          </span>
          <a href={contact.phoneHref} className="flex items-center gap-2 font-semibold text-white hover:underline">
            <Icon name="phone" size={16} className="text-white/60" />
            {contact.phoneDisplay}
          </a>
          <a href={`mailto:${contact.email}`} className="hidden items-center gap-2 hover:text-white lg:flex">
            <Icon name="mail" size={16} className="text-white/60" />
            {contact.email}
          </a>
        </div>
      </div>
    </div>
  );
}
