"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { type ReactNode, useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Spokojne pojawienie się treści: krótki dystans, długi czas, raz na sesję. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p" | "header";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </Comp>
  );
}

/**
 * Fotografia odsłaniana kurtyną od dołu, z lekkim „oddechem” skali i paralaksą przy przewijaniu.
 * Kadr zawsze zarezerwowany (aspect-ratio) — brak przesunięć układu.
 */
export function RevealImage({
  src,
  alt,
  sizes,
  className = "",
  ratio,
  preload = false,
  parallax = 0,
  rounded = "",
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  ratio?: string;
  preload?: boolean;
  parallax?: number;
  rounded?: string;
}) {
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-parallax}%`, `${parallax}%`]);

  return (
    <motion.div
      ref={frame}
      className={`zoom-frame relative ${rounded} ${className}`}
      style={{ aspectRatio: ratio ?? `${src.width} / ${src.height}` }}
      initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
    >
      <motion.div className="absolute inset-0" style={parallax && !reduce ? { y, scale: 1 + parallax / 45 } : undefined}>
        <motion.div
          className="absolute inset-0"
          initial={reduce ? undefined : { scale: 1.12 }}
          whileInView={reduce ? undefined : { scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease }}
        >
          <Image src={src} alt={alt} fill sizes={sizes} placeholder="blur" preload={preload} quality={82} className="object-cover" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
