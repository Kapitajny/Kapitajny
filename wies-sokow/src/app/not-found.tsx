import type { Metadata } from "next";
import Link from "next/link";
import styles from "./pages.module.css";

export const metadata: Metadata = {
  title: "Nie znaleziono strony",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className={`container ${styles.notFound}`}>
      <h1>Tej strony nie ma w&nbsp;naszym sadzie.</h1>
      <p className="lead">Adres jest nieprawidłowy albo strona została przeniesiona. Soki są tam, gdzie zawsze.</p>
      <div className={styles.actions}>
        <Link href="/sklep" className="btn">
          Przejdź do sklepu
        </Link>
        <Link href="/" className="btn btn--outline">
          Strona główna
        </Link>
      </div>
    </div>
  );
}
