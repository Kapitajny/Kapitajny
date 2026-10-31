import { describe, expect, it } from "vitest";
import { createDownloadToken, verifyDownloadToken } from "@/lib/server/downloads";

describe("podpisane linki do pobrania", () => {
  it("weryfikuje poprawny token", () => {
    const { token } = createDownloadToken("order-1", "zdrowiej-kazdego-dnia");
    const r = verifyDownloadToken(token);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.orderId).toBe("order-1");
      expect(r.product.slug).toBe("zdrowiej-kazdego-dnia");
    }
  });

  it("odrzuca zmodyfikowany token", () => {
    const { token } = createDownloadToken("order-1", "zdrowiej-kazdego-dnia");
    const [body, sig] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ o: "order-2", p: "zdrowiej-kazdego-dnia", e: 9999999999 })).toString("base64url");
    expect(verifyDownloadToken(`${forged}.${sig}`)).toEqual({ ok: false, reason: "invalid" });
    expect(verifyDownloadToken(`${body}.${sig.slice(0, -2)}xx`)).toEqual({ ok: false, reason: "invalid" });
    expect(verifyDownloadToken("śmieci")).toEqual({ ok: false, reason: "invalid" });
  });

  it("odrzuca wygasły token", () => {
    const { token } = createDownloadToken("order-1", "zdrowiej-kazdego-dnia", Date.now() - 73 * 3600 * 1000);
    expect(verifyDownloadToken(token)).toEqual({ ok: false, reason: "expired" });
  });
});
