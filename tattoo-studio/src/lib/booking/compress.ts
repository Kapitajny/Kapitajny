import { UPLOAD_LIMITS } from "@/config/booking";

/**
 * Przygotowanie zdjęcia w przeglądarce przed wysłaniem:
 *  - zmniejszenie do UPLOAD_LIMITS.maxDimension px po dłuższym boku,
 *  - zapis jako JPEG (usuwa metadane EXIF, w tym lokalizację GPS),
 *  - obniżanie jakości, aż plik zmieści się w limicie serwera.
 * Dzięki temu całe zgłoszenie mieści się w limitach typowych hostingów.
 */
export async function prepareImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const scale = Math.min(1, UPLOAD_LIMITS.maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not available");
    // Przezroczyste tło (np. szkic PNG) zamieniamy na biel.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);

    for (const quality of [0.86, 0.78, 0.68, 0.56]) {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      if (blob && blob.size <= UPLOAD_LIMITS.maxFileBytes * 0.9) return blob;
    }
    throw new Error("Image is too large after compression");
  } finally {
    bitmap.close();
  }
}
