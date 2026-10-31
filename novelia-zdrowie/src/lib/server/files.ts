import "server-only";

import { existsSync, statSync } from "node:fs";
import { basename, join, resolve, sep } from "node:path";
import type { Product } from "@/data/products";
import { getEbooksDir } from "./env";

/**
 * Pliki e-booków leżą w katalogu prywatnym (domyślnie `private/ebooks/`), poza `public/`.
 * Nie są dostępne pod żadnym publicznym adresem – wydaje je wyłącznie `/api/pobierz/[token]`
 * po weryfikacji podpisanego linku i statusu zamówienia.
 */
export function productFilePath(product: Product): string {
  const dir = getEbooksDir();
  // Ochrona przed path traversal – nazwa pliku pochodzi z katalogu, ale sprawdzamy ją mimo to.
  const path = resolve(join(dir, basename(product.file)));
  if (!path.startsWith(resolve(dir) + sep)) throw new Error("Nieprawidłowa ścieżka pliku.");
  return path;
}

/** Czy plik PDF produktu jest dostępny (tylko wtedy produkt można kupić). */
export function isProductAvailable(product: Product): boolean {
  try {
    const path = productFilePath(product);
    return existsSync(path) && statSync(path).size > 0;
  } catch {
    return false;
  }
}
