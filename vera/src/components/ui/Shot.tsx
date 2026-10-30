import type { ImageKey } from "@/config/images";
import { resolveImage } from "@/lib/images.server";
import { ShotView, type ShotViewProps } from "./ShotView";

/** Server wrapper: resolves a slot from the image map and renders it. */
export function Shot({ image, ...props }: Omit<ShotViewProps, "image"> & { image: ImageKey }) {
  return <ShotView image={resolveImage(image)} {...props} />;
}
