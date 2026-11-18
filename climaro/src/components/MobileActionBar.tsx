"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { PhoneIcon } from "./Icons";
import styles from "./MobileActionBar.module.css";

/**
 * Pasek akcji pod kciukiem (tylko telefony): telefon i wycena. Pojawia się po przewinięciu
 * pierwszego ekranu, a na stronie kontaktu go nie ma – tam formularz i telefon są na miejscu.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (pathname.startsWith("/kontakt")) return null;

  return (
    <div className={styles.bar} data-action-bar data-visible={visible || undefined} inert={!visible}>
      <a href={site.phoneHref} className={`btn btn-secondary ${styles.call}`}>
        <PhoneIcon />
        Zadzwoń
      </a>
      <Link href="/kontakt" className={`btn btn-primary ${styles.quote}`}>
        Bezpłatna wycena
      </Link>
    </div>
  );
}
