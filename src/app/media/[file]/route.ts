import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getMediaDir } from "@/lib/server/media";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };

/** Serwuje zdjęcia wgrane w panelu. Nazwy plików to UUID nadawane przy wgrywaniu. */
export async function GET(_request: Request, ctx: RouteContext<"/media/[file]">) {
  const { file } = await ctx.params;
  const match = /^([a-f0-9-]{36})\.(jpg|png|webp|avif)$/.exec(file);
  if (!match) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(join(/*turbopackIgnore: true*/ getMediaDir(), file));
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": TYPES[match[2]], "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
