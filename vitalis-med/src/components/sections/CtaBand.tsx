import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { orderHref, siteConfig } from "@/config/site";

/** Pas wezwania do działania przed stopką podstron. */
export function CtaBand({ title = "Potrzebujesz transportu medycznego?", text }: { title?: string; text?: string }) {
  const { contact } = siteConfig;
  return (
    <section aria-label="Kontakt z dyspozytornią" className="bg-white py-12 lg:py-16">
      <div className="container-x">
        <div className="grid gap-6 rounded-[10px] bg-graphite px-6 py-9 text-white sm:px-10 lg:grid-cols-12 lg:items-center lg:px-12">
          <div className="lg:col-span-7">
            <h2 className="h-section text-white">{title}</h2>
            <p className="mt-3 max-w-xl text-[1.05rem] leading-relaxed text-white/80">
              {text ?? "Zadzwoń do dyspozytorni – ustalimy szczegóły, dobierzemy ambulans i zespół oraz podamy wycenę."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <a href={contact.phoneHref} className="btn bg-white text-ink hover:bg-fog">
              <Icon name="phone" size={18} />
              {contact.phoneDisplay}
            </a>
            <Link href={orderHref()} className="btn btn-primary">
              Zamów transport medyczny
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
