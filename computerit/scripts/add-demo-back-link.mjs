// Wstawia do każdej strony w public/demo przycisk „Wróć do portfolio” prowadzący z powrotem na stronę ComputerIT.
// Skrypt można uruchamiać wielokrotnie – blok jest oznaczony komentarzami i przy kolejnym uruchomieniu zostaje podmieniony.
//
// Użycie (z katalogu computerit/):  node scripts/add-demo-back-link.mjs

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const START = "<!-- computerit:powrot -->";
const END = "<!-- /computerit:powrot -->";
const demoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "demo");

// Gdy klient przyszedł ze strony ComputerIT (np. z portfolio), przycisk działa jak „Wstecz” i wraca dokładnie
// tam, skąd przyszedł. W pozostałych przypadkach prowadzi do sekcji portfolio na stronie głównej.
const block = `${START}
<a id="computerit-powrot" href="/#portfolio"><svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 3 5 8l5 5"/></svg>Wróć do portfolio</a>
<style>
#computerit-powrot{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:max(16px,env(safe-area-inset-bottom,0px));z-index:2147483000;display:inline-flex;align-items:center;gap:8px;min-height:44px;margin:0;padding:10px 18px 10px 12px;border:1px solid rgba(255,255,255,.18);border-radius:3px;background:#0a1633;color:#fff;font:600 14px/1.2 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:0;text-transform:none;text-decoration:none;box-shadow:0 12px 30px -12px rgba(10,22,51,.7);transition:transform .2s ease,background-color .2s ease}
#computerit-powrot:hover{background:#0c2257;transform:translateY(-1px)}
#computerit-powrot:focus-visible{outline:2px solid #ffc25c;outline-offset:3px}
#computerit-powrot svg{width:16px;height:16px;flex:none}
@media (max-width:760px){body:has(.offer__mobile-bar) #computerit-powrot{bottom:calc(84px + env(safe-area-inset-bottom,0px))}}
@media print{#computerit-powrot{display:none}}
</style>
<script>
(function () {
  var link = document.getElementById("computerit-powrot");
  if (!link) return;
  link.addEventListener("click", function (event) {
    try {
      var from = new URL(document.referrer);
      if (from.origin === location.origin && from.pathname.indexOf("/demo/") === -1 && history.length > 1) {
        event.preventDefault();
        history.back();
      }
    } catch (error) {}
  });
})();
</script>
${END}`;

const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".html")) pages.push(path);
  }
};
walk(demoRoot);

let updated = 0;
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const start = html.indexOf(START);
  let next;
  if (start !== -1) {
    const end = html.indexOf(END, start) + END.length;
    next = html.slice(0, start) + block + html.slice(end);
  } else {
    const body = html.lastIndexOf("</body>");
    if (body === -1) throw new Error(`Brak </body> w ${page}`);
    next = html.slice(0, body) + block + "\n" + html.slice(body);
  }
  if (next !== html) {
    writeFileSync(page, next);
    updated++;
  }
}
console.log(`Przycisk „Wróć do portfolio”: ${updated} z ${pages.length} stron zaktualizowanych.`);
