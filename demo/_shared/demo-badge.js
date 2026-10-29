/* ComputerIT – plakietka „projekt demonstracyjny” dla demonstracji zbudowanych wcześniej (bez dostępu do źródeł).
   Wstrzykiwana skryptem, aby nie ingerować w skompilowany kod aplikacji. Można ją zamknąć (zapamiętane w sesji). */
(() => {
  "use strict";
  const KEY = "cit-demo-badge-hidden";
  try { if (sessionStorage.getItem(KEY) === "1") return; } catch { /* brak dostępu do sessionStorage */ }
  const text = document.currentScript?.dataset.text || "Projekt demonstracyjny ComputerIT — marka, oferta i dane są fikcyjne.";
  const box = document.createElement("aside");
  box.setAttribute("aria-label", "Informacja o projekcie demonstracyjnym");
  box.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:12px;max-width:calc(100% - 32px);padding:10px 10px 10px 16px;border-radius:999px;background:#0b0b0c;color:#fff;font:500 13px/1.35 system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.18)";
  const p = document.createElement("p");
  p.style.cssText = "margin:0";
  p.textContent = text + " ";
  const a = document.createElement("a");
  a.href = "../../index.html#portfolio";
  a.textContent = "Portfolio";
  a.style.cssText = "color:#fff;font-weight:700;text-decoration:underline;text-underline-offset:2px";
  p.append(a);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Zamknij informację o projekcie demonstracyjnym");
  btn.textContent = "×";
  btn.style.cssText = "flex:none;width:32px;height:32px;border:0;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font:400 20px/1 system-ui,sans-serif;cursor:pointer";
  btn.addEventListener("click", () => {
    box.remove();
    try { sessionStorage.setItem(KEY, "1"); } catch { /* ignoruj */ }
  });
  box.append(p, btn);
  const mount = () => document.body.append(box);
  document.body ? mount() : document.addEventListener("DOMContentLoaded", mount);
})();
