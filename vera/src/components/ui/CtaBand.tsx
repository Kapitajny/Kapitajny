import Link from "next/link";
import { bookingHref } from "@/config/site";

/** Wezwanie do działania na końcu podstron. */
export function CtaBand({ title = "Zacznij od konsultacji", text, href = bookingHref }: { title?: string; text?: string; href?: string }) {
  return (
    <section aria-label="Umów konsultację" className="bg-burgundy text-ivory">
      <div className="shell flex flex-col gap-10 py-20 sm:py-24 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="display max-w-3xl text-[clamp(2.75rem,6vw,5.5rem)]">{title}</p>
          {text && <p className="mt-6 max-w-lg text-ivory/80">{text}</p>}
        </div>
        <Link href={href} className="btn btn-light self-start lg:self-auto">
          Umów konsultację
        </Link>
      </div>
    </section>
  );
}
