import type { Metadata } from "next";
import Link from "next/link";
import { pl } from "@/i18n/dictionaries/pl";
import { en } from "@/i18n/dictionaries/en";
import { shippori, zenKaku } from "./fonts/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: `404 — ${pl.notFound.title}`,
  robots: { index: false, follow: false },
};

/** Strona 404 dla adresów spoza serwisu — dwujęzyczna, bo nie wiadomo, jakiej wersji szukał użytkownik. */
export default function GlobalNotFound() {
  return (
    <html lang="pl" className={`${shippori.variable} ${zenKaku.variable}`}>
      <body className="min-h-dvh">
        <main className="page-x flex min-h-svh flex-col items-start justify-center bg-sumi text-washi">
          <p className="font-mincho text-[clamp(5rem,16vw,12rem)] leading-none" aria-hidden="true">
            迷
          </p>
          <h1 className="display display-lg mt-6">{pl.notFound.title}</h1>
          <p className="lead mt-5 text-washi/80">{pl.notFound.text}</p>
          <Link href="/" className="btn btn-paper mt-8">
            {pl.notFound.back}
          </Link>
          <div lang="en" className="mt-14 border-t border-washi/15 pt-8">
            <p className="font-mincho text-2xl">{en.notFound.title}</p>
            <Link href="/en" className="ink-link mt-4 inline-block font-gothic text-sm">
              {en.notFound.back}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
