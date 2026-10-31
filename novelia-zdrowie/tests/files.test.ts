import { describe, expect, it } from "vitest";
import { getProduct, products } from "@/data/products";
import { isProductAvailable, productFilePath } from "@/lib/server/files";

describe("pliki e-booków", () => {
  it("ścieżki wskazują katalog prywatny, nie public/", () => {
    for (const p of products) {
      const path = productFilePath(p);
      expect(path).toContain(`${"private"}/ebooks/`);
      expect(path).not.toContain("/public/");
    }
  });

  it("produkt bez pliku PDF nie jest dostępny do zakupu", () => {
    expect(isProductAvailable({ ...getProduct("zdrowe-nawyki")!, file: "nie-istnieje.pdf" })).toBe(false);
  });

  it("ceny zgodne z założeniami", () => {
    expect(getProduct("zdrowiej-kazdego-dnia")!.price).toBe(3999);
    for (const slug of ["zdrowe-sniadania", "zdrowe-obiady", "zdrowe-nawyki"]) expect(getProduct(slug)!.price).toBe(2999);
  });
});
