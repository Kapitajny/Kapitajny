// NOVELIA ZDROWIE: podmienia skrypt „podglądu” (atrapa koszyka) na działający koszyk demo
// z public/demo/novelia-zdrowie/assets/demo-cart.js i aktualizuje dolny pasek informacyjny.
// Idempotentny.  Użycie (z katalogu computerit-02/):  node scripts/patch-novelia-demo.mjs

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "demo", "novelia-zdrowie");
const PREVIEW_SCRIPT = /<script>\(function\(\)\{\s*var go=function\(u\)\{location\.href=u\};[\s\S]*?\}\)\(\);\s*<\/script>/;
const TAG = '<script src="assets/demo-cart.js"></script>';
const BAR = /<div class="preview-bar">[\s\S]*?<\/div>/;
const NEW_BAR =
  '<div class="preview-bar"><b>Wersja demonstracyjna sklepu</b> · koszyk działa w tej przeglądarce, płatności są wyłączone i nic nie jest wysyłane</div>';

let changed = 0;
for (const name of readdirSync(dir).filter((n) => n.endsWith(".html"))) {
  const path = join(dir, name);
  const html = readFileSync(path, "utf8");
  let next = html.replace(PREVIEW_SCRIPT, TAG).replace(BAR, NEW_BAR);
  if (!next.includes(TAG)) next = next.replace("</body>", `${TAG}</body>`);
  if (next !== html) {
    writeFileSync(path, next);
    changed++;
  }
}
console.log(`NOVELIA: ${changed} stron zaktualizowanych.`);
