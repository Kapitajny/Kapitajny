"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonClass } from "@/components/ui/LinkButton";
import styles from "./not-found.module.css";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Do konsoli trafia tylko identyfikator błędu – szczegóły zostają w logach serwera.
    if (error.digest) console.error("Błąd strony", error.digest);
  }, [error]);

  return (
    <section className={`container ${styles.wrap}`} aria-labelledby="blad">
      <p className={styles.code} aria-hidden="true">
        !
      </p>
      <div className={styles.copy}>
        <h1 id="blad" className={styles.title}>
          Nie udało się wyświetlić tej strony
        </h1>
        <p className={styles.text}>Wystąpił nieoczekiwany błąd. Spróbuj ponownie – jeśli problem się powtarza, wróć na stronę główną.</p>
        <div className={styles.actions}>
          <button type="button" className={buttonClass()} onClick={reset}>
            Spróbuj ponownie
          </button>
          <Link href="/" className={buttonClass({ variant: "secondary" })}>
            Strona główna
          </Link>
        </div>
      </div>
    </section>
  );
}
