import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { orderHref, siteConfig } from "@/config/site";

/** Pas wezwania do działania przed stopką podstron. */
export function CtaBand({ title = "Potrzebujesz transportu medycznego?", text }: { title?: string; text?: string }) {
  const { contact } = siteConfig;
  return (
    <section aria-label="Kontakt z dyspozytornią" className="border-t border-line bg-white">
      <div className="container-x grid gap-8 py-16 lg:grid-cols-12 lg:items-center lg:py-20">
        <div className="lg:col-span-7">
          <h2 className="h-section">{title}</h2>
          <p className="lead mt-4 max-w-xl">{text ?? "Zadzwoń do dyspozytorni – ustalimy szczegóły, dobierzemy ambulans i zespół oraz podamy wycenę."}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
          <a href={contact.phoneHref} className="btn btn-dark">
            <Icon name="phone" size={18} />
            {contact.phoneDisplay}
          </a>
          <Link href={orderHref()} className="btn btn-primary">
            Zamów transport medyczny
          </Link>
        </div>
      </div>
    </section>
  );
}
