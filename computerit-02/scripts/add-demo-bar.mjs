// Wstawia do każdej strony w public/demo/<slug>/ pasek ComputerIT Concept 02:
//  – etykieta „Wersja demonstracyjna”,
//  – „Portfolio” (powrót do realizacji ComputerIT),
//  – „Chcę podobną stronę” / „Chcę podobny sklep” → formularz kontaktowy z wybraną usługą i projektem.
// Pasek unosi się nad dolnymi paskami samych dem (np. koszyk na telefonie) i można go zwinąć.
// Skrypt jest idempotentny: blok jest oznaczony komentarzami i przy kolejnym uruchomieniu podmieniany.
// Usuwa też przycisk z wersji 1 strony (blok computerit:powrot), jeśli dema skopiowano z tamtego katalogu.
//
// Użycie (z katalogu computerit-02/):  node scripts/add-demo-bar.mjs

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const START = "<!-- computerit02:demo -->";
const END = "<!-- /computerit02:demo -->";
const OLD = /<!-- computerit:powrot -->[\s\S]*?<!-- \/computerit:powrot -->\n?/g;
const demoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "demo");

/** Rodzaj projektu – musi się zgadzać z src/data/projects.ts. */
const kinds = {
  "sklep-kapitajny": "sklep",
  "neon-nami": "sklep",
  "noir-coffee": "sklep",
  "novelia-zdrowie": "sklep",
  "aureon-homes": "strona",
  "vantor-automotive": "strona",
  interpodatki: "strona",
  "forma-atelier": "strona",
  "vera-aesthetic-studio": "strona",
  balans: "strona",
  "volt-gsm": "strona",
  "piekarnia-morelowa": "strona",
};

const css = `
#cit-demo{position:fixed;right:max(12px,env(safe-area-inset-right,0px));bottom:calc(max(12px,env(safe-area-inset-bottom,0px)) + var(--cit-lift,0px));z-index:2147483000;display:flex;flex-direction:column;align-items:flex-end;gap:6px;margin:0;padding:0;font:500 14px/1.2 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:0;text-transform:none;color:#fff;transition:bottom .25s ease}
#cit-demo *{box-sizing:border-box;margin:0;font:inherit;letter-spacing:inherit;text-transform:none}
#cit-demo .cit-tag{display:inline-flex;align-items:center;gap:7px;padding:5px 10px;border-radius:999px;background:#0b0b0c;color:#e2c88f;font:600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 6px 18px -8px rgba(0,0,0,.6)}
#cit-demo .cit-tag i{width:6px;height:6px;border-radius:1px;background:#c9a45c}
#cit-demo .cit-bar{display:flex;align-items:center;gap:4px;padding:4px;border-radius:999px;background:#0b0b0c;border:1px solid rgba(255,255,255,.14);box-shadow:0 18px 40px -16px rgba(0,0,0,.7)}
#cit-demo a,#cit-demo button{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:40px;padding:0 14px;border:0;border-radius:999px;background:transparent;color:#fff;font-weight:600;font-size:14px;text-decoration:none;cursor:pointer;white-space:nowrap;transition:background-color .2s ease,color .2s ease}
#cit-demo a:hover,#cit-demo button:hover{background:rgba(255,255,255,.1)}
#cit-demo .cit-cta{background:#c9a45c;color:#0b0b0c}
#cit-demo .cit-cta:hover{background:#e2c88f}
#cit-demo .cit-min{width:40px;padding:0}
#cit-demo svg{width:16px;height:16px;flex:none}
#cit-demo a:focus-visible,#cit-demo button:focus-visible{outline:2px solid #e2c88f;outline-offset:2px}
#cit-demo .cit-open{display:none;width:48px;height:48px;padding:0;background:#0b0b0c;border:1px solid rgba(255,255,255,.18);box-shadow:0 14px 30px -12px rgba(0,0,0,.7)}
#cit-demo .cit-open:hover{background:#1b1c1f}
#cit-demo[data-min="1"] .cit-tag,#cit-demo[data-min="1"] .cit-bar{display:none}
#cit-demo[data-min="1"] .cit-open{display:inline-flex}
@media (max-width:420px){#cit-demo a,#cit-demo button{padding:0 11px;font-size:13px}#cit-demo .cit-back span{display:none}#cit-demo .cit-min{width:36px}}
@media print{#cit-demo{display:none}}`;

const script = `
(function () {
  var root = document.getElementById("cit-demo");
  if (!root) return;
  var KEY = "cit-demo-min";
  try { if (sessionStorage.getItem(KEY) === "1") root.setAttribute("data-min", "1"); } catch (e) {}
  root.querySelector(".cit-min").addEventListener("click", function () {
    root.setAttribute("data-min", "1");
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    root.querySelector(".cit-open").focus();
  });
  root.querySelector(".cit-open").addEventListener("click", function () {
    root.removeAttribute("data-min");
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    root.querySelector(".cit-back").focus();
  });
  // Gdy klient przyszedł ze strony ComputerIT, „Portfolio” działa jak „Wstecz” i wraca dokładnie tam, skąd przyszedł.
  root.querySelector(".cit-back").addEventListener("click", function (event) {
    try {
      var from = new URL(document.referrer);
      if (from.origin === location.origin && from.pathname.indexOf("/demo/") === -1 && history.length > 1) {
        event.preventDefault();
        history.back();
      }
    } catch (e) {}
  });
  // Unosimy pasek nad przyklejonymi do dołu elementami dema (np. pasek koszyka na telefonie).
  var lift = function () {
    var max = 0, vh = window.innerHeight, vw = window.innerWidth;
    var nodes = document.body.querySelectorAll("body > *, body > * > *, body > * > * > *");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el === root || root.contains(el)) continue;
      var cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") continue;
      if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) continue;
      var r = el.getBoundingClientRect();
      if (r.height < 20 || r.height > vh * 0.4 || r.width < vw * 0.5) continue;
      if (r.bottom >= vh - 2 && r.top > vh * 0.5) max = Math.max(max, vh - r.top);
    }
    root.style.setProperty("--cit-lift", max ? max + 8 + "px" : "0px");
  };
  var timer;
  var schedule = function () { clearTimeout(timer); timer = setTimeout(lift, 250); };
  window.addEventListener("load", lift);
  window.addEventListener("resize", schedule);
  document.addEventListener("click", schedule, true);
  window.addEventListener("scroll", schedule, { passive: true });
  setTimeout(lift, 600);
})();`;

const block = (slug) => {
  const kind = kinds[slug];
  if (!kind) throw new Error(`Brak rodzaju projektu dla dema „${slug}” – dodaj go do mapy kinds.`);
  const cta = kind === "sklep" ? "Chcę podobny sklep" : "Chcę podobną stronę";
  const href = `/kontakt?usluga=${kind}&amp;projekt=${slug}`;
  return `${START}
<div id="cit-demo" role="region" aria-label="ComputerIT – wersja demonstracyjna">
<span class="cit-tag"><i aria-hidden="true"></i>Wersja demonstracyjna</span>
<div class="cit-bar">
<a class="cit-back" href="/realizacje" aria-label="Wróć do portfolio ComputerIT"><svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8H3M7 4 3 8l4 4"/></svg><span>Portfolio</span></a>
<a class="cit-cta" href="${href}">${cta}<svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></a>
<button type="button" class="cit-min" aria-label="Zwiń pasek ComputerIT"><svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m4 6 4 4 4-4"/></svg></button>
</div>
<button type="button" class="cit-open" aria-label="Pokaż pasek ComputerIT: wersja demonstracyjna, powrót do portfolio"><svg aria-hidden="true" viewBox="0 0 48 52" style="width:20px;height:22px"><rect x="2.25" y="2.25" width="43.5" height="39" rx="6.5" fill="none" stroke="#fff" stroke-width="4.5"/><rect x="31.5" y="27.5" width="7.5" height="7.5" rx="1" fill="#c9a45c"/><rect x="5.5" y="46.25" width="37" height="5" rx="2.5" fill="#fff"/></svg></button>
</div>
<style>${css}
</style>
<script>${script}
</script>
${END}`;
};

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
  const slug = relative(demoRoot, page).split(sep)[0];
  const html = readFileSync(page, "utf8");
  let next = html.replace(OLD, "");
  const start = next.indexOf(START);
  if (start !== -1) {
    const end = next.indexOf(END, start) + END.length;
    next = next.slice(0, start) + block(slug) + next.slice(end);
  } else {
    const body = next.lastIndexOf("</body>");
    if (body === -1) throw new Error(`Brak </body> w ${page}`);
    next = next.slice(0, body) + block(slug) + "\n" + next.slice(body);
  }
  if (next !== html) {
    writeFileSync(page, next);
    updated++;
  }
}
console.log(`Pasek demo ComputerIT: ${updated} z ${pages.length} stron zaktualizowanych.`);
