import type { CSSProperties } from "react";

/** Odpowiednik `StaticImageData` z Next.js – tworzony przez skrypt eksportu dla importów `.jpg`. */
export interface StaticImageData {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
}

interface ImageProps {
  src: StaticImageData | string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  preload?: boolean;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
}

/** Zastępuje `next/image` w eksporcie statycznym: zwykły `<img>` z leniwym ładowaniem. */
export default function Image({ src, alt, fill, preload, className, style }: ImageProps) {
  const image = typeof src === "string" ? { src, width: undefined, height: undefined } : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- eksport bez serwera Next.js nie ma optymalizatora obrazów
    <img
      src={image.src}
      alt={alt}
      width={fill ? undefined : image.width}
      height={fill ? undefined : image.height}
      loading={preload ? "eager" : "lazy"}
      fetchPriority={preload ? "high" : undefined}
      decoding="async"
      className={className}
      style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none", ...style } : style}
    />
  );
}
