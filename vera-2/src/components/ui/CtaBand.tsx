import Link from "next/link";
import { bookingHref } from "@/config/site";

/** Zaproszenie na końcu podstron – wyśrodkowana, zaokrąglona plansza. */
export function CtaBand({ title = "Zacznij od rozmowy", text, href = bookingHref }: { title?: string; text?: string; href?: string }) {
  return (
    <section aria-label="Umów konsultację" className="shell py-20 sm:py-24">
      <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-blush px-6 py-14 text-center sm:rounded-[4rem] sm:px-12 sm:py-16">
        <p className="script text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.1]">{title}</p>
        {text && <p className="mx-auto mt-5 max-w-lg font-light text-stone">{text}</p>}
        <Link href={href} className="pill pill-solid mt-9">
          Umów konsultację
        </Link>
      </div>
    </section>
  );
}
