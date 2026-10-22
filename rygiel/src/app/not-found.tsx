import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/ui/LinkButton";
import { mainNav } from "@/content/site";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Nie znaleziono strony",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className={`container ${styles.wrap}`} aria-labelledby="nie-znaleziono">
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <div className={styles.copy}>
        <h1 id="nie-znaleziono" className={styles.title}>
          Tej strony nie ma pod tym adresem
        </h1>
        <p className={styles.text}>Adres mógł się zmienić albo zawierać literówkę. Wybierz jedną z&nbsp;głównych sekcji serwisu lub wróć na stronę główną.</p>
        <div className={styles.actions}>
          <LinkButton href="/">Strona główna</LinkButton>
          <LinkButton href="/kontakt" variant="secondary">
            Napisz do nas
          </LinkButton>
        </div>
        <nav aria-label="Główne sekcje serwisu">
          <ul role="list" className={styles.links}>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
