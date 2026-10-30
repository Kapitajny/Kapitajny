import Image from "next/image";
import { IMAGES, imageFocus, imageSrc, type ImageKey } from "@/config/images";

interface PhotoProps {
  image: ImageKey;
  /** Podpowiedź rozmiarów dla next/image. */
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Użycie dekoracyjne (opis jest obok lub powtarzałby pobliski tekst). */
  decorative?: boolean;
  focus?: string;
}

/** Kadrowane zdjęcie wypełniające swój kontener; proporcje wyznacza kontener. */
export function Photo({ image, sizes, className = "", imgClassName = "", priority, decorative, focus }: PhotoProps) {
  const entry = IMAGES[image];
  return (
    <div className={`relative overflow-hidden bg-powder ${className}`}>
      <Image
        src={imageSrc(image)}
        alt={decorative ? "" : entry.alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={85}
        className={`object-cover ${imgClassName}`}
        style={{ objectPosition: focus ?? imageFocus(image) }}
      />
    </div>
  );
}
