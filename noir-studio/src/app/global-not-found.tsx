import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { en } from "@/i18n/en";
import { pl } from "@/i18n/pl";
import "./globals.css";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin", "latin-ext"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"], display: "swap" });

export const metadata: Metadata = {
  title: `${pl.meta.notFoundTitle} | NOIR STUDIO`,
  robots: { index: false, follow: false },
};

/** Strona 404 dla adresów spoza obu wersji językowych – dwujęzyczna, bo nie wiemy, skąd przyszedł gość. */
export default function GlobalNotFound() {
  return (
    <html lang="pl" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <main className="not-found">
          <div className="container">
            <h1 className="not-found__title">{pl.notFound.title}</h1>
            <p className="not-found__text">
              {pl.notFound.text}
              <br />
              <span lang="en">{en.notFound.text}</span>
            </p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- poza layoutem aplikacji potrzebne jest pełne przeładowanie */}
            <a href="/" className="button button--light">
              {pl.notFound.back}
            </a>{" "}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- jw. */}
            <a href="/en" className="button button--light" lang="en">
              {en.notFound.back}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
