"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Subtelne pojawianie się elementu przy przewijaniu.
 * Bez JS i przy `prefers-reduced-motion` treść jest widoczna od razu (patrz globals.css).
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={delay ? { ["--reveal-delay" as string]: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
