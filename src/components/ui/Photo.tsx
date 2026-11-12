import Image from "next/image";

/**
 * Zdjęcie: pliki z /images/ przechodzą przez optymalizację Next.js,
 * zdjęcia wgrane w panelu (/media/…) są serwowane bez przetwarzania.
 */
export function Photo({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
  position,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  position?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith("/media/")}
      quality={src.includes("hero") ? 85 : 75}
      className={`object-cover ${className}`}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}
