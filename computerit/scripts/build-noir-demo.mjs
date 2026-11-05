// Buduje wersję demonstracyjną NOIR COFFEE (projekt z katalogu nadrzędnego) jako statyczną stronę
// w public/demo/noir-coffee. Płatności, newsletter i statusy zamówień wymagają serwera, więc w demo są wyłączone.
//
// Użycie (z katalogu computerit/, po `npm install` w katalogu nadrzędnym):  node scripts/build-noir-demo.mjs

import { execSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE_PATH = "/demo/noir-coffee";
const here = dirname(fileURLToPath(import.meta.url));
const noirRoot = join(here, "..", "..");
const target = join(here, "..", "public", "demo", "noir-coffee");
const work = mkdtempSync(join(tmpdir(), "noir-demo-"));

const tracked = execSync("git ls-files", { cwd: noirRoot, encoding: "utf8" })
  .split("\n")
  .filter((file) => file && !file.startsWith("computerit/"));
for (const file of tracked) cpSync(join(noirRoot, file), join(work, file));
// Turbopack nie rozwiązuje modułów spoza katalogu projektu, więc node_modules kopiujemy zamiast linkować.
cpSync(join(noirRoot, "node_modules"), join(work, "node_modules"), { recursive: true, verbatimSymlinks: true });

const edit = (file, from, to) => {
  const path = join(work, file);
  const source = readFileSync(path, "utf8");
  if (!source.includes(from)) throw new Error(`Nie znaleziono fragmentu do podmiany w ${file}: ${from}`);
  writeFileSync(path, source.replace(from, to));
};

for (const dir of ["src/app/api", "src/app/zamowienie/sukces", "src/app/zamowienie/anulowano", "src/app/robots.ts", "src/app/sitemap.ts", "tests"]) {
  rmSync(join(work, dir), { recursive: true, force: true });
}

// Statyczny eksport: bez Cache Components / PPR i bez nagłówków serwera.
edit("next.config.ts", "  cacheComponents: true,\n  partialPrefetching: true,\n", `  output: "export",\n  basePath: "${BASE_PATH}",\n`);
edit("next.config.ts", "  images: {\n", "  images: {\n    unoptimized: true,\n");
const config = readFileSync(join(work, "next.config.ts"), "utf8").replace(/ {2}async headers\(\) \{\n[\s\S]*?\n {2}\},\n/, "");
writeFileSync(join(work, "next.config.ts"), config);
edit("src/components/layout/SiteFooter.tsx", 'import { cacheLife } from "next/cache";\n', "");
edit("src/components/layout/SiteFooter.tsx", '  "use cache";\n  cacheLife("days");\n', "");
// Ścieżki zdjęć z manifestu nie dostają basePath automatycznie.
edit("src/lib/images.server.ts", "src: exists ? publicPath : null", `src: exists ? \`${BASE_PATH}\${publicPath}\` : null`);
// Zamówienie bez płatności – formularz pokazuje komunikat, że płatności nie są skonfigurowane.
edit("src/app/zamowienie/page.tsx", 'import { connection } from "next/server";\n', "");
edit("src/app/zamowienie/page.tsx", 'import { getPaymentsMode } from "@/lib/server/env";\n', "");
edit(
  "src/app/zamowienie/page.tsx",
  "async function CheckoutWithConfig() {\n  // Konfigurację płatności czytamy przy każdym żądaniu (klucze mogą być ustawione dopiero na serwerze).\n  await connection();\n  return <CheckoutFlow paymentsMode={getPaymentsMode()} />;\n}",
  '// Wersja demonstracyjna w portfolio ComputerIT: płatności są wyłączone.\nfunction CheckoutWithConfig() {\n  return <CheckoutFlow paymentsMode="unconfigured" />;\n}',
);

execSync("npx next build", { cwd: work, stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_SITE_URL: `http://localhost:3000${BASE_PATH}` } });
rmSync(target, { recursive: true, force: true });
cpSync(join(work, "out"), target, { recursive: true });
rmSync(work, { recursive: true, force: true });
// Przycisk powrotu do portfolio – ten sam co w pozostałych wersjach demonstracyjnych.
execSync("node scripts/add-demo-back-link.mjs", { cwd: join(here, ".."), stdio: "inherit" });
console.log(`Gotowe: ${target}`);
