import type { Metadata } from "next";
import Link from "next/link";

/**
 * Strona 404 dla adresów spoza wszystkich tras. Aplikacja ma dwa layouty główne
 * – `(noir)`, `(morelowa)` i `(morelowa-2)` – więc zwykły `app/not-found.tsx` nie ma w czym się wyrenderować.
 *
 * Celowo bez `next/font` i arkuszy stylów: ten plik trafia do każdej strony jako granica 404,
 * więc importowane tu fonty byłyby wstępnie ładowane także na stronach, które ich nie używają.
 */
export const metadata: Metadata = {
  title: "Nie znaleziono strony",
  robots: { index: false, follow: false },
};

const styles = `
  body { margin: 0; min-height: 100dvh; display: grid; place-items: center; padding: 1.5rem;
    background: #f6f1e9; color: #3a2a20; font: 1rem/1.6 ui-sans-serif, system-ui, sans-serif; }
  main { max-width: 32rem; text-align: center; }
  p.code { font-size: .75rem; font-weight: 600; letter-spacing: .24em; text-transform: uppercase; color: #6b5b4f; }
  h1 { margin: 1rem 0; font: 400 clamp(2.2rem, 1.6rem + 3vw, 3.6rem)/1.05 Georgia, "Times New Roman", serif; }
  nav { margin-top: 2rem; display: flex; flex-wrap: wrap; justify-content: center; gap: .75rem; }
  a { display: inline-block; padding: .8rem 1.4rem; border: 1px solid currentColor; color: inherit; text-decoration: none;
    font-size: .8rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; }
  a:hover { background: #3a2a20; color: #f6f1e9; }
  a:focus-visible { outline: 2px solid #3a2a20; outline-offset: 3px; }
`;

export default function GlobalNotFound() {
  return (
    <html lang="pl">
      <head>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>
        <main>
          <p className="code">Błąd 404</p>
          <h1>Nie znaleziono strony</h1>
          <p>Adres mógł się zmienić albo zawierać literówkę.</p>
          <nav aria-label="Strony główne">
            <Link href="/">NOIR COFFEE</Link>
            <Link href="/morelowa">Piekarnia Morelowa</Link>
            <Link href="/morelowa-2">Morelowa – koncepcja 2</Link>
          </nav>
        </main>
      </body>
    </html>
  );
}
