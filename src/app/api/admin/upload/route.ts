import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { requireAdmin } from "@/lib/server/auth";
import { errorResponse } from "@/lib/server/http";
import { getMediaDir } from "@/lib/server/media";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
const MAX_BYTES = 8 * 1024 * 1024;

function looksLikeImage(buf: Buffer, type: string): boolean {
  if (type === "image/jpeg") return buf[0] === 0xff && buf[1] === 0xd8;
  if (type === "image/png") return buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (type === "image/webp") return buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP";
  if (type === "image/avif") return buf.subarray(4, 12).toString().startsWith("ftyp");
  return false;
}

/** POST multipart (pole „file”) – zapisuje zdjęcie w katalogu mediów i zwraca jego adres /media/… */
export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return errorResponse(400, "invalid", "Wybierz plik zdjęcia.");
  const ext = TYPES[file.type];
  if (!ext) return errorResponse(415, "type", "Dozwolone formaty: JPG, PNG, WebP, AVIF.");
  if (file.size > MAX_BYTES) return errorResponse(413, "size", "Zdjęcie może mieć najwyżej 8 MB.");
  const buf = Buffer.from(await file.arrayBuffer());
  if (!looksLikeImage(buf, file.type)) return errorResponse(415, "type", "Plik nie wygląda na zdjęcie w podanym formacie.");
  const dir = getMediaDir();
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await writeFile(join(/*turbopackIgnore: true*/ dir, name), buf);
  return Response.json({ path: `/media/${name}` }, { status: 201 });
}
