import type { Metadata } from "next";
import Link from "next/link";
import { mainNav } from "@/config/site";

export const metadata: Metadata = { title: "Nie znaleziono strony" };

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center pb-20 pt-[calc(var(--header-h)+3rem)]">
      <p className="text-sm font-medium text-rose-deep">Błąd 404</p>
      <h1 className="display mt-6 text-[clamp(3rem,9vw,8rem)] text-burgundy">
        <span className="block">Takiej strony</span>
        <span className="block pl-[0.6em] sm:pl-[1.2em]">nie ma.</span>
      </h1>
      <p className="mt-8 max-w-md text-stone">Adres może zawierać literówkę albo strona została przeniesiona. Spróbuj jednej z tych:</p>
      <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        {mainNav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="link-line text-sm font-semibold text-burgundy">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
