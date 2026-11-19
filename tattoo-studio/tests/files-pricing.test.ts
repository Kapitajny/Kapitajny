import { describe, expect, it } from "vitest";
import { PRICING } from "@/config/pricing";
import { sniffImage } from "@/lib/booking/files";
import { bookingQueryFor, estimatePrice } from "@/lib/pricing";

describe("sniffImage", () => {
  it("recognises JPEG, PNG and WEBP by signature", () => {
    expect(sniffImage(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("jpeg");
    expect(sniffImage(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe("png");
    expect(sniffImage(new TextEncoder().encode("RIFF\0\0\0\0WEBPVP8 "))).toBe("webp");
  });

  it("rejects other content regardless of the file name", () => {
    expect(sniffImage(new TextEncoder().encode("<svg xmlns="))).toBeNull();
    expect(sniffImage(new TextEncoder().encode("%PDF-1.7"))).toBeNull();
    expect(sniffImage(new Uint8Array([]))).toBeNull();
  });
});

describe("estimatePrice", () => {
  it("returns a rounded range that grows with size and detail", () => {
    const base = { size: "small", placement: "forearm", detail: "simple", character: "black-grey" } as const;
    const small = estimatePrice(base);
    const large = estimatePrice({ ...base, size: "large" });
    const intricate = estimatePrice({ ...base, detail: "intricate" });
    for (const e of [small, large, intricate]) {
      expect(e.min % PRICING.roundTo).toBe(0);
      expect(e.max).toBeGreaterThan(e.min);
      expect(e.min).toBeGreaterThanOrEqual(PRICING.minimumPrice);
    }
    expect(large.min).toBeGreaterThan(small.max);
    expect(intricate.max).toBeGreaterThan(small.max);
  });

  it("maps calculator choices to booking form values", () => {
    const query = new URLSearchParams(bookingQueryFor({ size: "large", placement: "upper-arm", detail: "simple", character: "japanese" }));
    expect(Object.fromEntries(query)).toEqual({ size: "large", placement: "upper-arm", style: "japanese-traditional" });
  });
});
