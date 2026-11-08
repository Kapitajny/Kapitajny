"use client";

import Link from "next/link";
import { homePath, LOCALES, type Locale } from "@/i18n/config";
import { Flag } from "./Flag";
import styles from "./LanguageSwitch.module.css";

const FLAGS: Record<Locale, "pl" | "gb"> = { pl: "pl", en: "gb" };

/**
 * Przełącznik języka oznaczony flagami. Zachowuje sekcję, na której jest odwiedzający (#portfolio itd.).
 */
export function LanguageSwitch({ locale, label, names, className = "" }: { locale: Locale; label: string; names: Record<Locale, string>; className?: string }) {
  return (
    <ul role="list" aria-label={label} className={`${styles.switch} ${className}`}>
      {LOCALES.map((code) => {
        const current = code === locale;
        return (
          <li key={code}>
            <Link
              href={homePath(code)}
              hrefLang={code}
              lang={code}
              className={styles.link}
              aria-current={current ? "true" : undefined}
              onClick={(event) => {
                event.preventDefault();
                if (current) return;
                window.location.assign(homePath(code) + window.location.hash);
              }}
            >
              <Flag country={FLAGS[code]} className={styles.flag} />
              <span className={styles.code} aria-hidden="true">
                {code.toUpperCase()}
              </span>
              <span className="visually-hidden">{names[code]}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
