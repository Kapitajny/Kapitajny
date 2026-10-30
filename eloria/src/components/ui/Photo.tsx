import type { ImageKey } from "@/config/images";
import { resolveImage } from "@/lib/images.server";
import { PhotoView, type PhotoViewProps } from "./PhotoView";

/** Zdjęcie z centralnej mapy `config/images.ts` (komponent serwerowy). */
export function Photo({ image, ...props }: Omit<PhotoViewProps, "image"> & { image: ImageKey }) {
  return <PhotoView image={resolveImage(image)} {...props} />;
}
