// Użycie: npm run build && npm run start -- --port 3001, a w drugim terminalu: node scripts/podglad/build.mjs
// Składa statyczną wersję serwisu Rygiel w jeden plik HTML do publikacji jako Artifact.
import { mkdir, readFile, writeFile } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3001";
const OUT = new URL("../../.podglad/rygiel-podglad.html", import.meta.url);
const get = async (path) => {
  const res = await fetch(BASE + path);
  if (!res.ok && path !== "/404-nie-istnieje") throw new Error(`${path}: ${res.status}`);
  return res;
};

const sitemap = await (await get("/sitemap.xml")).text();
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

const pages = new Map();
for (const route of [...routes, "/404-nie-istnieje"]) pages.set(route, await (await get(route)).text());

// Arkusze stylów w kolejności pierwszego wystąpienia
const cssHrefs = [];
for (const html of pages.values())
  for (const m of html.matchAll(/<link rel="stylesheet" href="([^"]+\.css)"/g)) if (!cssHrefs.includes(m[1])) cssHrefs.push(m[1]);
let css = "";
for (const href of cssHrefs) css += (await (await get(href)).text()) + "\n";
// Fonty jako data URI – serwis nie może ładować plików z innych adresów
// Ścieżki fontów w CSS są względne wobec /_next/static/chunks/
const fontUrls = [...new Set([...css.matchAll(/url\(((?:\.\.\/media|\/_next\/static\/media)\/[^)]+\.woff2)\)/g)].map((m) => m[1]))];
for (const url of fontUrls) {
  const path = url.startsWith("../") ? "/_next/static/" + url.slice(3) : url;
  const buf = Buffer.from(await (await get(path)).arrayBuffer());
  css = css.split(`url(${url})`).join(`url(data:font/woff2;base64,${buf.toString("base64")})`);
}
css += `
/* Wersja podglądowa: nagłówek przyklejony poniżej paska systemowego telefonu */
header:first-of-type { top: env(safe-area-inset-top, 0px); }
`;

// Obrazy next/image: jeden wariant WebP osadzony jako data URI (podgląd nie może pobierać plików z serwera)
const imageCache = new Map();
async function inlineImages(html) {
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = match[0];
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1]?.replace(/&amp;/g, "&");
    if (!src || !src.startsWith("/_next/image")) continue;
    if (!imageCache.has(src)) {
      const res = await fetch(BASE + src, { headers: { Accept: "image/webp" } });
      const type = res.headers.get("content-type") ?? "image/webp";
      imageCache.set(src, `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`);
    }
    const inlined = tag
      .replace(/\s(?:srcset|srcSet|sizes)="[^"]*"/g, "")
      .replace(/\ssrc="[^"]+"/, ` src="${imageCache.get(src)}"`);
    html = html.replace(tag, inlined);
  }
  return html;
}

const stripScripts = (html) => html.replace(/<script\b[\s\S]*?<\/script>/g, "").replace(/<link\b[^>]*>/g, "");
const rewriteLinks = (html) =>
  html
    .replace(/href="\/(?!_next)([^"]*)"/g, (_, rest) => `href="#/${rest}"`)
    .replace(/(<a [^>]*href="#\/[^"]*"[^>]*?) target="_blank"/g, "$1")
    .replace(/(<a [^>]*href="#\/[^"]*"[^>]*>(?:(?!<\/a>)[\s\S])*?)<span class="visually-hidden"> \(otwiera się w(?:&nbsp;| | )nowej karcie\)<\/span>/g, "$1");
const fixRootLink = (html) => html.replace(/href="#\/"/g, 'href="#/"');

const home = pages.get("/");
const htmlClass = home.match(/<html[^>]*class="([^"]+)"/)?.[1] ?? "";
const body = home.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
const [beforeMain] = body.split(/<main\b/);
const afterMain = body.slice(body.indexOf("</main>") + "</main>".length);
const chrome = (s) => fixRootLink(rewriteLinks(stripScripts(s))).replace(/<template\b[\s\S]*?<\/template>/g, "");

const templates = [];
for (const [route, html] of pages) {
  const inner = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  const title = (html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "Rygiel").replace(/"/g, "&quot;");
  const key = route === "/404-nie-istnieje" ? "/404" : route;
  templates.push(`<template data-route="${key}" data-title="${title}">${fixRootLink(rewriteLinks(stripScripts(await inlineImages(inner))))}</template>`);
}

const app = await readFile(new URL("./app.js", import.meta.url), "utf8");
const out = `<title>Serwis Rygiel</title>
<style>${css}</style>
<script>document.documentElement.lang="pl";document.documentElement.className=${JSON.stringify(htmlClass)};</script>
${chrome(beforeMain)}
<main id="tresc" tabindex="-1"></main>
${chrome(afterMain)}
${templates.join("\n")}
<script>${app}</script>
`;
await mkdir(new URL("./", OUT), { recursive: true });
await writeFile(OUT, out);
console.log("routes", templates.length, "css files", cssHrefs.length, "fonts", fontUrls.length, "size KB", Math.round(out.length / 1024));
