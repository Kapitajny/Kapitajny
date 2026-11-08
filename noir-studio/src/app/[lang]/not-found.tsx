import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";

// Wywoływana tylko w obrębie istniejącej wersji językowej; nieznane adresy obsługuje global-not-found.tsx.
// Style w globals.css: moduł CSS strony 404 byłby wstępnie ładowany na każdej stronie.
export default function NotFound() {
  const t = getDictionary("pl").notFound;
  return (
    <main id="main" className="not-found">
      <div className="container">
        <h1 className="not-found__title">{t.title}</h1>
        <p className="not-found__text">{t.text}</p>
        <Link href="/" className="button button--light">
          {t.back}
        </Link>
      </div>
    </main>
  );
}
