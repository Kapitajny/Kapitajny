/**
 * Eksport statyczny strony do katalogu `artifact/` – do publikacji bez serwera Next.js
 * (np. jako artefakt na claude.ai albo na dowolnym hostingu plików).
 *
 * Renderuje te same komponenty React co aplikacja (z zamiennikami `next/image`, `next/link`
 * i `next/navigation` z `scripts/artifact/shims`), dołącza skompilowany CSS Tailwinda
 * i skrypt hydratacji, więc wszystkie interakcje działają tak jak w Next.js.
 *
 * Wynik:
 *   artifact/index.html                  treść strony głównej (bez <html>/<head>/<body> – dodaje je host artefaktu)
 *   artifact/polityka-prywatnosci.html   pełne dokumenty HTML podstron
 *   artifact/regulamin.html
 *   artifact/photos/*.jpg                zdjęcia
 *
 * Uruchomienie: npm run export:artifact
 */

import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

process.env.NODE_ENV = "production";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "artifact");
const tmp = join(out, ".tmp");
const shims = join(root, "scripts/artifact/shims");

const FONTS_URL = "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Instrument+Serif:ital@0;1&display=swap";

const PAGES = {
  home: { file: "index.html", title: "Studio Tańca Swoboda" },
  privacy: { file: "polityka-prywatnosci.html", title: "Polityka prywatności | Studio Tańca Swoboda" },
  terms: { file: "regulamin.html", title: "Regulamin | Studio Tańca Swoboda" },
};

/** Wymiary JPEG odczytane z nagłówka (znacznik SOF), bez dodatkowych zależności. */
function jpegSize(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  throw new Error("Nie udało się odczytać wymiarów JPEG");
}

/** Zamienniki modułów Next.js oraz importy zdjęć → { src, width, height } ze ścieżką względną. */
const exportPlugin = {
  name: "swoboda-export",
  setup(build) {
    const aliases = {
      "next/image": "next-image.tsx",
      "next/link": "next-link.tsx",
      "next/navigation": "next-navigation.ts",
    };
    build.onResolve({ filter: /^next\/(image|link|navigation)$/ }, (args) => ({ path: join(shims, aliases[args.path]) }));
    build.onResolve({ filter: /^next$/ }, () => ({ path: "next", namespace: "empty" }));
    build.onLoad({ filter: /.*/, namespace: "empty" }, () => ({ contents: "export {}", loader: "js" }));
    build.onLoad({ filter: /\.jpe?g$/ }, (args) => {
      const { width, height } = jpegSize(readFileSync(args.path));
      const src = `photos/${basename(args.path)}`;
      return { contents: `export default ${JSON.stringify({ src, width, height })};`, loader: "js" };
    });
  },
};

const define = {
  "process.env.NODE_ENV": '"production"',
  "process.env.NEXT_PUBLIC_SITE_URL": "undefined",
  "process.env.NEXT_PUBLIC_ALLOW_INDEXING": "undefined",
};

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "photos"), { recursive: true });
mkdirSync(tmp, { recursive: true });

// 1. CSS – Tailwind skanuje źródła projektu tak samo jak w Next.js.
execFileSync(join(root, "node_modules/.bin/tailwindcss"), ["-i", "src/app/globals.css", "-o", join(tmp, "app.css"), "--minify"], {
  cwd: root,
  stdio: "inherit",
});
// Host artefaktu dodaje własny reset bez warstw (np. font 14 px na <body>), który wygrałby z warstwą `base` Tailwinda.
const extraCss = `:root{--font-instrument-serif:"Instrument Serif";--font-figtree:"Figtree"}
body{margin:0;background:var(--color-ivory);color:var(--color-cocoa);font-family:var(--font-sans);font-size:1.0625rem;line-height:1.65}
header.sticky{top:env(safe-area-inset-top,0px)}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:50;background:var(--color-ivory)}`;
const css = readFileSync(join(tmp, "app.css"), "utf8") + extraCss;

// 2. Render po stronie serwera (Node) – gotowy HTML widoczny od razu po wczytaniu.
await esbuild.build({
  entryPoints: [join(root, "scripts/artifact/entry-server.tsx")],
  outfile: join(tmp, "server.mjs"),
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  plugins: [exportPlugin],
  jsx: "automatic",
  define,
  logLevel: "warning",
  logOverride: { "unsupported-directive": "silent" },
});
// Moduły z `@/…` są wbudowane, a react/react-dom pochodzą z node_modules projektu.
const { render } = await import(pathToFileURL(join(tmp, "server.mjs")).href);

// 3. Skrypt przeglądarki (hydratacja).
const client = await esbuild.build({
  entryPoints: [join(root, "scripts/artifact/entry-client.tsx")],
  bundle: true,
  write: false,
  minify: true,
  platform: "browser",
  format: "iife",
  target: ["es2020"],
  plugins: [exportPlugin],
  jsx: "automatic",
  define,
  legalComments: "none",
  logLevel: "warning",
  logOverride: { "unsupported-directive": "silent" },
});
// `</script` w kodzie zamknąłby znacznik osadzonego skryptu.
const js = client.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

// 4. Strony.
const description = "Kameralne studio tańca dla dorosłych: zajęcia od zera, grafik, cennik i zapis na lekcję próbną (projekt demonstracyjny).";
for (const [page, { file, title }] of Object.entries(PAGES)) {
  const head = `<title>${title}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS_URL}">
<style>${css}</style>`;
  const body = `<div id="app" data-page="${page}">${render(page)}</div>
<script>${js}</script>`;
  const html =
    page === "home"
      ? `${head}\n${body}\n`
      : `<!doctype html>\n<html lang="pl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
  writeFileSync(join(out, file), html);
}

// 5. Zdjęcia.
for (const name of ["class-joy", "team-motion", "studio-hall", "instructor-hana", "instructor-daniel", "instructor-kai", "instructor-lena"]) {
  copyFileSync(join(root, "src/assets/photos", `${name}.jpg`), join(out, "photos", `${name}.jpg`));
}

rmSync(tmp, { recursive: true, force: true });
const size = (file) => `${Math.round(readFileSync(join(out, file)).length / 1024)} KB`;
console.log(`Eksport gotowy w artifact/: index.html (${size("index.html")}), polityka-prywatnosci.html, regulamin.html, photos/`);
