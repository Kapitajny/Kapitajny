"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Odsłania zawartość (zdjęcie) przy pierwszym pojawieniu się w widoku.
 * Styl animacji: klasa `.unveil` w globals.css.
 */
export function Unveil({ children, className = "", delay = 0, style }: { children: ReactNode; className?: string; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);

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
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`unveil ${className}`} style={delay ? { ...style, ["--unveil-delay" as string]: `${delay}ms` } : style}>
      {children}
    </div>
  );
}
