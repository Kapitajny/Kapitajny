import type { Metadata } from "next";
import Link from "next/link";
import { archivo } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 – RIFT Studio",
};

/** 404 dla adresów, które nie pasują do żadnej trasy (poza segmentem języka). */
export default function GlobalNotFound() {
  return (
    <html lang="pl-PL" className={archivo.variable}>
      <body>
        <main
          id="main"
          style={{ minHeight: "100vh", display: "grid", placeContent: "center", gap: 24, padding: "0 var(--gutter)", textAlign: "left" }}
        >
          <h1 className="section-title">Tu jest cisza.</h1>
          <p className="lead" lang="pl">
            Ta strona nie istnieje albo została przeniesiona.
          </p>
          <p className="lead" lang="en">
            Only silence here. This page doesn&apos;t exist or has moved.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/" className="btn btn-primary">
              Strona główna
            </Link>
            <Link href="/en" className="btn" lang="en">
              Home (English)
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
