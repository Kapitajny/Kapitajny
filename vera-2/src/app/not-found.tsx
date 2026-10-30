import type { Metadata } from "next";
import Link from "next/link";
import { mainNav } from "@/config/site";

export const metadata: Metadata = { title: "Nie znaleziono strony" };

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80svh] flex-col items-center justify-center pb-20 pt-[calc(var(--header-h)+3rem)] text-center">
      <p className="text-sm font-medium text-rose-deep">Błąd 404</p>
      <h1 className="script mt-6 text-[clamp(3rem,9vw,6.5rem)] leading-none">
        <span className="block">Takiej strony</span>
        <span className="block">nie ma.</span>
      </h1>
      <p className="mt-8 max-w-md font-light text-stone">Adres może zawierać literówkę albo strona została przeniesiona. Spróbuj jednej z tych:</p>
      <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
        {mainNav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="pill pill-line">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
