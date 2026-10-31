import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { getProduct, type Product } from "@/data/products";
import { getDb } from "./db";
import { downloadLinkTtlHours, downloadMaxPerItem, getDownloadSecret } from "./env";
import type { OrderRecord } from "./orders";

/**
 * Bezpieczne linki do pobierania.
 *
 * Token = base64url(JSON {o: id zamówienia, p: produkt, e: wygaśnięcie}) + "." + HMAC-SHA256.
 * Link jest ważny do `e`, a przy każdym pobraniu serwer dodatkowo sprawdza, czy zamówienie jest
 * opłacone i czy nie przekroczono limitu pobrań. Linki można wygenerować ponownie (e-mail „Pobierz ponownie”).
 */

interface TokenPayload {
  o: string;
  p: string;
  e: number;
}

const b64url = (buf: Buffer | string) => Buffer.from(buf).toString("base64url");

function sign(data: string): string {
  return createHmac("sha256", getDownloadSecret()).update(data).digest("base64url");
}

export function createDownloadToken(orderId: string, productSlug: string, now = Date.now()): { token: string; expiresAt: Date } {
  const expires = Math.floor(now / 1000) + downloadLinkTtlHours() * 3600;
  const body = b64url(JSON.stringify({ o: orderId, p: productSlug, e: expires } satisfies TokenPayload));
  return { token: `${body}.${sign(body)}`, expiresAt: new Date(expires * 1000) };
}

export type TokenCheck = { ok: true; orderId: string; product: Product } | { ok: false; reason: "invalid" | "expired" };

export function verifyDownloadToken(token: string, now = Date.now()): TokenCheck {
  if (typeof token !== "string" || token.length > 600) return { ok: false, reason: "invalid" };
  const [body, signature] = token.split(".");
  if (!body || !signature) return { ok: false, reason: "invalid" };
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, reason: "invalid" };
  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as TokenPayload;
  } catch {
    return { ok: false, reason: "invalid" };
  }
  const product = getProduct(payload.p);
  if (!product || typeof payload.o !== "string" || typeof payload.e !== "number") return { ok: false, reason: "invalid" };
  if (payload.e * 1000 < now) return { ok: false, reason: "expired" };
  return { ok: true, orderId: payload.o, product };
}

export interface DownloadLink {
  slug: string;
  title: string;
  url: string;
  expiresAt: string;
  remaining: number;
}

export function countDownloads(orderId: string, productSlug: string): number {
  const row = getDb().prepare("SELECT COUNT(*) AS n FROM downloads WHERE order_id = ? AND product_slug = ?").get(orderId, productSlug) as { n: number };
  return Number(row.n);
}

export function recordDownload(orderId: string, productSlug: string, ip: string | null): void {
  const ipHash = ip ? createHash("sha256").update(ip).digest("hex").slice(0, 16) : null;
  getDb().prepare("INSERT INTO downloads (order_id, product_slug, downloaded_at, ip_hash) VALUES (?, ?, ?, ?)").run(orderId, productSlug, new Date().toISOString(), ipHash);
}

/** Linki do wszystkich publikacji w opłaconym zamówieniu. */
export function downloadLinksForOrder(order: OrderRecord, siteUrl: string): DownloadLink[] {
  if (order.status !== "paid") return [];
  const max = downloadMaxPerItem();
  return order.items.map((item) => {
    const { token, expiresAt } = createDownloadToken(order.id, item.slug);
    return {
      slug: item.slug,
      title: item.title,
      url: `${siteUrl}/api/pobierz/${token}`,
      expiresAt: expiresAt.toISOString(),
      remaining: Math.max(0, max - countDownloads(order.id, item.slug)),
    };
  });
}
