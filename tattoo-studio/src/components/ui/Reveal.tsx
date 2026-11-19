"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Subtelne pojawienie się elementu przy przewijaniu.
 * `variant="wipe"` odsłania zdjęcie z góry na dół (jak rozsuwane drzwi shōji).
 * Bez JS i przy `prefers-reduced-motion` treść jest widoczna od razu (patrz globals.css).
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "fade",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: "fade" | "wipe";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.dataset.visible = "true";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${variant === "wipe" ? "reveal-wipe" : "reveal"} ${className}`}
      style={delay ? { ["--reveal-delay" as string]: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
