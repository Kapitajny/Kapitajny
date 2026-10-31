import { createReadStream, statSync } from "node:fs";
import { Readable } from "node:stream";
import { countDownloads, recordDownload, verifyDownloadToken } from "@/lib/server/downloads";
import { transaction } from "@/lib/server/db";
import { downloadMaxPerItem, getSiteUrl } from "@/lib/server/env";
import { isProductAvailable, productFilePath } from "@/lib/server/files";
import { rateLimit } from "@/lib/server/http";
import { findOrderById } from "@/lib/server/orders";

/**
 * GET /api/pobierz/<token>
 * Wydaje plik PDF z katalogu prywatnego po weryfikacji: podpisu i ważności linku, statusu zamówienia
 * (musi być opłacone), obecności produktu w zamówieniu i limitu pobrań.
 * Przy błędzie przekierowuje na stronę /pobieranie z komunikatem.
 */
export async function GET(request: Request, ctx: RouteContext<"/api/pobierz/[token]">) {
  const site = getSiteUrl(request);
  const fail = (reason: string) => Response.redirect(`${site}/pobieranie?status=${reason}`, 303);

  if (!rateLimit(request, "download", 30, 60_000)) return fail("limit-zapytan");
  const { token } = await ctx.params;
  const check = verifyDownloadToken(decodeURIComponent(token));
  if (!check.ok) return fail(check.reason === "expired" ? "wygasl" : "nieprawidlowy");

  const order = findOrderById(check.orderId);
  if (!order || order.status !== "paid" || !order.items.some((i) => i.slug === check.product.slug)) return fail("nieprawidlowy");
  if (!isProductAvailable(check.product)) return fail("brak-pliku");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
  const allowed = transaction(() => {
    if (countDownloads(order.id, check.product.slug) >= downloadMaxPerItem()) return false;
    recordDownload(order.id, check.product.slug, ip);
    return true;
  });
  if (!allowed) return fail("limit-pobran");

  const path = productFilePath(check.product);
  const size = statSync(path).size;
  const stream = Readable.toWeb(createReadStream(path)) as ReadableStream<Uint8Array>;
  const name = check.product.downloadName;
  return new Response(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(size),
      "Content-Disposition": `attachment; filename="${name}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
    },
  });
}
