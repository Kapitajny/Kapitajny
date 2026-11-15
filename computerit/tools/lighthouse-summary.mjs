// Podsumowanie raportu Lighthouse (JSON): wyniki kategorii, kluczowe metryki
// i lista nieudanych audytów posortowana według wpływu – punkt wyjścia do poprawek.
// Użycie: node tools/lighthouse-summary.mjs raport.report.json
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Podaj plik .report.json");
  process.exit(1);
}
const lhr = JSON.parse(readFileSync(file, "utf8"));
const names = { performance: "Performance", accessibility: "Accessibility", "best-practices": "Best Practices", seo: "SEO" };

console.log(`\n# Lighthouse ${lhr.lighthouseVersion}: ${lhr.finalDisplayedUrl}`);
console.log(`Profil: ${lhr.configSettings.formFactor}, ${new Date(lhr.fetchTime).toLocaleString("pl-PL")}\n`);
console.log("| Kategoria | Wynik |\n| --- | --- |");
for (const [id, cat] of Object.entries(lhr.categories)) {
  console.log(`| ${names[id] ?? cat.title} | ${Math.round(cat.score * 100)} |`);
}

const metrics = ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"];
console.log("\n| Metryka | Wartość |\n| --- | --- |");
for (const id of metrics) {
  const a = lhr.audits[id];
  if (a) console.log(`| ${a.title} | ${a.displayValue ?? "–"} |`);
}

// Nieudane audyty: wynik < 0,9 w audytach punktowanych, z wagą kategorii lub szacowaną oszczędnością.
const failing = [];
for (const [catId, cat] of Object.entries(lhr.categories)) {
  for (const ref of cat.auditRefs) {
    const a = lhr.audits[ref.id];
    if (!a || a.score === null || a.score >= 0.9) continue;
    if (["notApplicable", "manual", "informative"].includes(a.scoreDisplayMode)) continue;
    const savingsMs = a.metricSavings ? Object.values(a.metricSavings).reduce((s, v) => s + (v || 0), 0) : 0;
    failing.push({ cat: names[catId] ?? catId, id: a.id, title: a.title, score: a.score, weight: ref.weight, value: a.displayValue ?? "", savingsMs });
  }
}
failing.sort((x, y) => y.weight - x.weight || y.savingsMs - x.savingsMs || x.score - y.score);

console.log(`\n## Problemy do poprawy (${failing.length})\n`);
if (!failing.length) console.log("Brak nieudanych audytów punktowanych.");
for (const f of failing) {
  console.log(`- [${f.cat}] ${f.title} (${f.id}) – wynik ${Math.round(f.score * 100)}${f.value ? `, ${f.value}` : ""}${f.weight ? `, waga ${f.weight}` : ""}`);
}
