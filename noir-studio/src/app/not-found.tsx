import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

// Style w globals.css: moduł CSS strony 404 byłby wstępnie ładowany na każdej stronie.
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <div className="container">
        <h1 className="not-found__title">This frame is empty.</h1>
        <p className="not-found__text">The page you were looking for doesn&apos;t exist or has moved.</p>
        <Link href="/" className="button button--light">
          Back to the studio
        </Link>
      </div>
    </main>
  );
}
