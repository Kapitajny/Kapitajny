import type { Metadata } from "next";
import { Contact } from "@/components/home/Contact";
import styles from "./kontakt.module.css";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Napisz do Wieś Soków w sprawie soków, zamówienia lub dostawy. Formularz kontaktowy i dane kontaktowe.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <Contact headingLevel="h1" />
    </div>
  );
}
