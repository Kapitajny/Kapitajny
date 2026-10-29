/* ComputerIT – wersja podglądowa (statyczna) demonstracji wymagającej serwera.
   Przeglądanie stron działa; akcje wymagające serwera (koszyk, konto, zamówienia, formularze)
   pokazują komunikat zamiast błędu. */
(() => {
  "use strict";
  const script = document.currentScript;
  const cfg = {
    name: script?.dataset.name || "Ten projekt",
    tech: script?.dataset.tech || "serwerze",
    portfolio: script?.src ? new URL(script.dataset.portfolio || "../../../../index.html#portfolio", script.src).href : "/",
    blocked: (script?.dataset.blocked || "").split(",").filter(Boolean),
    features: script?.dataset.features || "pełne funkcje",
  };
  const box = document.createElement("aside");
  box.setAttribute("aria-label", "Informacja o wersji podglądowej");
  box.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;max-width:760px;margin:0 auto;padding:12px 16px;border-radius:14px;background:#0b0b0c;color:#fff;font:500 13px/1.4 system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 12px 34px -12px rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.18)";
  const text = document.createElement("p");
  text.style.cssText = "margin:0;flex:1 1 260px";
  text.innerHTML = "";
  const strong = document.createElement("strong");
  strong.textContent = "Wersja podglądowa · projekt demonstracyjny. ";
  text.append(strong, document.createTextNode(`Możesz przeglądać wszystkie strony. ${cfg.features} działają w pełnej wersji na ${cfg.tech}.`));
  const msg = document.createElement("p");
  msg.setAttribute("role", "status");
  msg.style.cssText = "margin:0;flex-basis:100%;color:#ffd9a8;display:none";
  const back = document.createElement("a");
  back.href = cfg.portfolio;
  back.textContent = "← Portfolio ComputerIT";
  back.style.cssText = "color:#fff;font-weight:700;text-decoration:underline;text-underline-offset:2px;white-space:nowrap";
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "×";
  close.setAttribute("aria-label", "Zamknij informację o wersji podglądowej");
  close.style.cssText = "flex:none;width:36px;height:36px;margin-left:auto;border:0;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font:400 22px/1 system-ui,sans-serif;cursor:pointer";
  close.addEventListener("click", () => { box.style.display = "none"; document.body.style.paddingBottom = ""; });
  box.append(text, back, close, msg);
  const mount = () => {
    document.body.append(box);
    document.body.style.paddingBottom = "96px";
  };
  document.body ? mount() : document.addEventListener("DOMContentLoaded", mount);

  const explain = (what) => {
    box.style.display = "flex";
    msg.textContent = `${what} nie działa w wersji podglądowej, bo wymaga serwera. W pełnej wersji projektu działa normalnie.`;
    msg.style.display = "block";
  };
  // formularze (dodaj do koszyka, wyszukiwarka, newsletter, opinie) – przechwycone przed skryptem sklepu
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    explain("Ta akcja");
  }, true);
  // linki do części wymagających serwera
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const path = new URL(a.href, location.href).pathname;
    if (cfg.blocked.some((p) => path.includes(p))) {
      e.preventDefault();
      e.stopImmediatePropagation();
      explain("Ta część sklepu");
    }
  }, true);
})();
