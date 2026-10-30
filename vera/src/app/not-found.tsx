import type { Metadata } from "next";
import Link from "next/link";
import { bookHref } from "@/config/site";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[80svh] flex-col justify-end pb-20 pt-[calc(var(--bar)+4rem)]">
      <p className="kicker text-rose-deep">Error 404</p>
      <h1 className="display-xl mt-6">
        This page <span className="italic text-burgundy">isn’t here.</span>
      </h1>
      <p className="mt-8 max-w-md text-stone">The address may have changed or contain a typo. Start from the home page or browse treatments.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="cta cta-burgundy">
          Home
        </Link>
        <Link href="/treatments" className="cta cta-line">
          Treatments
        </Link>
        <Link href={bookHref} className="cta cta-line">
          Book a consultation
        </Link>
      </div>
    </section>
  );
}
