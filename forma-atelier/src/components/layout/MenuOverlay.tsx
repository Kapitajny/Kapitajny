"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type RefObject, useEffect, useRef, useState } from "react";

import { nav, site } from "@/data/site";
import oferta from "@/assets/photos/quiet-residence-3.jpg";
import proces from "@/assets/photos/studio-samples.jpg";
import kontakt from "@/assets/photos/studio-table.jpg";
import pracownia from "@/assets/photos/studio-wide.jpg";
import realizacje from "@/assets/photos/sandstone-house-1.jpg";
import home from "@/assets/photos/villa-natura-1.jpg";

const previews: Record<string, StaticImageData> = {
  "/": home,
  "/o-pracowni": pracownia,
  "/realizacje": realizacje,
  "/oferta": oferta,
  "/proces": proces,
  "/kontakt": kontakt,
};

const ease = [0.22, 1, 0.36, 1] as const;

type Props = { open: boolean; onClose: () => void; returnFocusTo: RefObject<HTMLButtonElement | null> };

export function MenuOverlay({ open, onClose, returnFocusTo }: Props) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(pathname in previews ? pathname : "/");

  // blokada przewijania, Esc, pułapka fokusu
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []).concat(
        returnFocusTo.current ? [returnFocusTo.current] : [],
      );
    const t = window.setTimeout(() => focusables()[0]?.focus(), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (!els.length) return;
      const i = els.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        els[els.length - 1].focus();
      } else if (!e.shiftKey && i === els.length - 1) {
        e.preventDefault();
        els[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const button = returnFocusTo.current;
    return () => {
      window.clearTimeout(t);
      html.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      button?.focus({ preventScroll: true });
    };
  }, [open, onClose, returnFocusTo]);

  const d = reduce ? 0 : 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          id="menu-glowne"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 overflow-y-auto bg-graphite text-paper"
          initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: 0.1 } }}
          transition={{ duration: 0.9 * d, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="shell grid min-h-full grid-cols-12 gap-x-6 pt-[calc(var(--header-h)+3rem)] pb-10 lg:pb-14">
            <nav aria-label="Główna" className="col-span-12 lg:col-span-6 xl:col-span-5">
              <ul className="flex flex-col">
                {nav.map((item, i) => {
                  const current = item.href === pathname;
                  return (
                    <li key={item.href} className="overflow-hidden">
                      <motion.div
                        initial={{ y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 }}
                        animate={{ y: 0, opacity: 1, transition: { duration: 0.9 * d, ease, delay: 0.35 * d + i * 0.06 * d } }}
                        exit={{ y: reduce ? 0 : "-40%", opacity: 0, transition: { duration: 0.35 * d, ease } }}
                      >
                        <Link
                          href={item.href}
                          onClick={onClose}
                          onMouseEnter={() => setActive(item.href)}
                          onFocus={() => setActive(item.href)}
                          aria-current={current ? "page" : undefined}
                          className="group flex items-baseline py-1.5 font-serif text-[clamp(2.25rem,1.6rem+2.6vw,4.25rem)] leading-[1.08] transition-colors duration-500 hover:text-sand focus-visible:text-sand"
                        >
                          <span
                            aria-hidden="true"
                            className={`mb-[0.35em] h-px shrink-0 bg-current transition-all duration-700 ease-[var(--ease-out-soft)] ${
                              current ? "mr-4 w-10" : "mr-0 w-0 group-hover:mr-4 group-hover:w-10 group-focus-visible:mr-4 group-focus-visible:w-10"
                            }`}
                          />
                          {item.label}
                        </Link>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              className="relative col-span-12 mt-12 hidden aspect-[4/5] max-h-[68vh] overflow-hidden lg:col-span-5 lg:col-start-8 lg:mt-0 lg:block"
              initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 1.2 * d, ease, delay: 0.45 * d } }}
              exit={{ opacity: 0, transition: { duration: 0.3 * d } }}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 * d, ease }}
                >
                  <Image src={previews[active]} alt="" fill sizes="(min-width: 1024px) 40vw, 1px" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="t-meta col-span-12 mt-14 grid gap-6 border-t border-line-light pt-8 text-mist sm:grid-cols-3 lg:mt-auto lg:col-span-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.8 * d, delay: 0.7 * d } }}
              exit={{ opacity: 0, transition: { duration: 0.2 * d } }}
            >
              <p>
                {site.contact.street}
                <br />
                {site.contact.city}
              </p>
              <p>
                <a className="link-line" href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
                <br />
                <a className="link-line" href={`tel:${site.contact.phoneHref}`}>
                  {site.contact.phone}
                </a>
              </p>
              <p className="sm:text-right">
                <a className="link-line" href={site.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
