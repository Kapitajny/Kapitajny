import Image from "next/image";
import type { PlateTone, ResolvedImage } from "@/config/images";

export interface ShotViewProps {
  image: ResolvedImage;
  sizes: string;
  className?: string;
  /** Above-the-fold image – loaded eagerly with high priority. */
  preload?: boolean;
  /** Hides the slot name on the placeholder plate (small thumbnails). */
  bare?: boolean;
}

const tone: Record<PlateTone, string> = {
  burgundy: "bg-burgundy text-rose-light",
  rose: "bg-rose text-black",
  powder: "bg-powder text-black",
  black: "bg-black text-rose-light",
};

/**
 * A photo from `config/images.ts`. The parent must be positioned and sized; the image covers it.
 * Without a file the slot renders a layout plate with crop marks and the slot name.
 */
export function ShotView({ image, sizes, className = "", preload, bare }: ShotViewProps) {
  if (image.src) {
    return <Image src={image.src} alt={image.alt} fill sizes={sizes} preload={preload} quality={85} className={`object-cover ${className}`} />;
  }
  return (
    <div role="img" aria-label={image.alt} data-missing-image={image.expectedPath} data-tone={image.tone} className={`plate absolute inset-0 ${tone[image.tone]} ${className}`}>
      {!bare && (
        <span aria-hidden="true" className="kicker absolute bottom-9 left-9 right-9 truncate opacity-80">
          {image.caption}
        </span>
      )}
      {process.env.NODE_ENV === "development" && (
        <span aria-hidden="true" className="absolute right-9 top-9 max-w-[60%] truncate bg-ivory/90 px-2 py-1 text-[10px] text-black">
          missing: {image.expectedPath}
        </span>
      )}
    </div>
  );
}
