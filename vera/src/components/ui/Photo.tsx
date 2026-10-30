import Image from "next/image";
import { IMAGES, imageFocus, imageSrc, type ImageKey } from "@/config/images";

interface PhotoProps {
  image: ImageKey;
  /** Responsive sizes hint for next/image. */
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Decorative use (alt is announced elsewhere or repeats nearby text). */
  decorative?: boolean;
  focus?: string;
}

/** A cropped photo that fills its box. The box sets the aspect ratio. */
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
