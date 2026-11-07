(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var SITE = window.SITE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function text(el, v) { if (el) el.textContent = v; }

  /* Dane kontaktowe z config.js */
  var tel = (SITE.phone || "").replace(/[^\d+]/g, "");
  if (/^\d{9}$/.test(tel)) tel = "+48" + tel;
  $$("[data-call]").forEach(function (a) {
    a.href = tel ? "tel:" + tel : "#wycena";
    $$("[data-phone-text]", a).forEach(function (n) { if (SITE.phone) n.textContent = SITE.phone; });
    if (a.hasAttribute("aria-label") && SITE.phone) a.setAttribute("aria-label", "Zadzwoń: " + SITE.phone);
  });
  $$("[data-email]").forEach(function (el) {
    if (!SITE.email) return;
    el.textContent = ""; var a = document.createElement("a"); a.href = "mailto:" + SITE.email; a.textContent = SITE.email; el.appendChild(a);
  });
  if (SITE.email) $$("[data-email-row]").forEach(function (el) { el.hidden = false; });
  $$("[data-legal]").forEach(function (el) { if (SITE.companyLegal) el.textContent = SITE.companyLegal; });
  $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* Opinie i realizacje: tylko prawdziwe wpisy z config.js */
  var reviews = Array.isArray(SITE.reviews) ? SITE.reviews.filter(function (r) { return r && r.text; }) : [];
  if (reviews.length && $("#reviews-list")) {
    reviews.forEach(function (r) {
      var q = document.createElement("blockquote"), p = document.createElement("p"), f = document.createElement("footer");
      p.textContent = "„" + r.text + "”"; f.textContent = [r.author, r.source].filter(Boolean).join(", ");
      q.appendChild(p); if (f.textContent) q.appendChild(f); $("#reviews-list").appendChild(q);
    });
    $("#opinie").hidden = false;
  }
  var gallery = Array.isArray(SITE.gallery) ? SITE.gallery.filter(function (g) { return g && g.src; }) : [];
  if (gallery.length && $("#gallery-list")) {
    gallery.forEach(function (g) {
      var fig = document.createElement("figure"), img = document.createElement("img");
      img.src = g.src; img.alt = g.alt || g.caption || ""; img.loading = "lazy"; img.width = 640; img.height = 480;
      fig.appendChild(img);
      if (g.caption) { var c = document.createElement("figcaption"); c.textContent = g.caption; fig.appendChild(c); }
      $("#gallery-list").appendChild(fig);
    });
    $("#realizacje").hidden = false;
  }

  /* Nagłówek: tło po zjechaniu z hero */
  var top = $("#top"), hero = $("#start");
  function onScroll() { top.classList.toggle("solid", window.scrollY > 24); }
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu na telefonie */
  var menuBtn = $("#menu-btn"), nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    top.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    $("use", menuBtn).setAttribute("href", open ? "#i-close" : "#i-menu");
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth > 980 && nav.classList.contains("open")) setMenu(false); });

  /* Aktywna sekcja w menu i pasek telefonu na telefonach */
  var links = $$(".nav > a[href^='#']"), callbar = $("#callbar");
  if ("IntersectionObserver" in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var a = byId[en.target.id]; if (a) a.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    $$("main > section").forEach(function (s) { if (!byId[s.id]) io.observe(s); });
    new IntersectionObserver(function (en) { callbar.classList.toggle("show", !en[0].isIntersecting); }, { threshold: 0.05 }).observe(hero);
  } else { callbar.classList.add("show"); }

  /* Linki do sekcji: przewijanie obsługuje skrypt, więc działa też w osadzonym podglądzie */
  var form = $("#quote-form");
  function firstEmpty() {
    var order = ["name", "phone", "service", "from"];
    for (var i = 0; i < order.length; i++) { var el = form.elements[order[i]]; if (!el.value.trim()) return el; }
    return form.elements.details;
  }
  function goTo(id) {
    var target = document.getElementById(id);
    if (!target) return false;
    if (nav.classList.contains("open")) setMenu(false);
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    try { history.replaceState(null, "", "#" + id); } catch (err) {}
    if (id === "wycena") {
      setTimeout(function () { if (!form.hidden) firstEmpty().focus({ preventScroll: true }); }, reduce ? 0 : 700);
    }
    return true;
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (a.hasAttribute("data-service")) form.elements.service.value = a.getAttribute("data-service");
    if (goTo(id)) e.preventDefault();
  });

  /* Trasa: mapa Polski */
  var CITY = {};
  $$(".area-map .city").forEach(function (g) {
    var c = $(".dot", g);
    CITY[g.getAttribute("data-city")] = { g: g, x: +c.getAttribute("cx"), y: +c.getAttribute("cy") };
  });
  var line = $("#route-line"), status = $("#route-status"), routeCta = $("#route-cta");
  var pick = [];
  function norm(s) { return (s || "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l"); }
  function findCity(s) {
    var n = norm(s); if (!n) return null;
    var names = Object.keys(CITY);
    for (var i = 0; i < names.length; i++) { if (norm(names[i]) === n || n.indexOf(norm(names[i])) === 0) return names[i]; }
    return null;
  }
  function drawRoute() {
    $$(".area-map .city").forEach(function (g) { g.classList.toggle("on", pick.indexOf(g.getAttribute("data-city")) > -1); });
    $$(".city-list button").forEach(function (b) { b.setAttribute("aria-pressed", String(pick.indexOf(b.getAttribute("data-city")) > -1)); });
    line.classList.remove("draw");
    if (pick.length < 2) {
      line.setAttribute("d", "");
      text(status, pick.length ? "Początek trasy: " + pick[0] + ". Wybierz miasto docelowe." : "");
      routeCta.hidden = true;
      return;
    }
    var a = CITY[pick[0]], b = CITY[pick[1]];
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, k = 0.16;
    line.setAttribute("d", "M" + a.x + " " + a.y + " Q" + (mx - dy * k).toFixed(1) + " " + (my + dx * k).toFixed(1) + " " + b.x + " " + b.y);
    line.style.setProperty("--len", Math.ceil(line.getTotalLength()));
    void line.getBBox(); if (!reduce) line.classList.add("draw");
    text(status, "Trasa: " + pick[0] + " – " + pick[1]);
    routeCta.textContent = "Wyceń trasę " + pick[0] + " – " + pick[1];
    routeCta.hidden = false;
  }
  function choose(name) {
    if (!CITY[name]) return;
    var i = pick.indexOf(name);
    if (i > -1) pick.splice(i, 1);
    else if (pick.length >= 2) pick = [name];
    else pick.push(name);
    drawRoute();
  }
  $$(".city-list button").forEach(function (b) { b.addEventListener("click", function () { choose(b.getAttribute("data-city")); }); });
  Object.keys(CITY).forEach(function (n) { CITY[n].g.addEventListener("click", function () { choose(n); }); });
  routeCta.addEventListener("click", function () {
    if (pick.length === 2) { form.elements.from.value = pick[0]; form.elements.to.value = pick[1]; }
  });

  /* Tablica trasy w hero */
  /* Bez zdarzenia „submit”: w osadzonym podglądzie (iframe bez allow-forms) przeglądarka blokuje wysyłkę formularzy */
  var routeForm = $("#route-form"), rFrom = $("#r-from"), rTo = $("#r-to");
  function routeGo() {
    var from = rFrom.value.trim(), to = rTo.value.trim();
    if (from) form.elements.from.value = from;
    if (to) form.elements.to.value = to;
    var cf = findCity(from), ct = findCity(to);
    if (cf && ct && cf !== ct) { pick = [cf, ct]; drawRoute(); }
    goTo("wycena");
  }
  $("#route-go").addEventListener("click", routeGo);
  routeForm.addEventListener("submit", function (e) { e.preventDefault(); routeGo(); });
  rFrom.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); rTo.focus(); } });
  rTo.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); routeGo(); } });

  /* Formularz wyceny */
  var MAX_FILES = 6, MAX_FILE = 8 * 1024 * 1024, MAX_TOTAL = 20 * 1024 * 1024;
  var files = [], thumbs = $("#thumbs"), drop = $("#drop"), fileIn = $("#f-photos");
  form.elements.started.value = String(Date.now());

  function renderThumbs() {
    thumbs.innerHTML = "";
    files.forEach(function (f, i) {
      var li = document.createElement("li"), img = document.createElement("img"), x = document.createElement("button");
      img.alt = "Podgląd: " + f.name; img.width = 76; img.height = 76;
      img.src = URL.createObjectURL(f); img.onload = function () { URL.revokeObjectURL(img.src); };
      x.type = "button"; x.innerHTML = '<svg aria-hidden="true"><use href="#i-close"/></svg>'; x.setAttribute("aria-label", "Usuń zdjęcie " + f.name);
      x.addEventListener("click", function () { files.splice(i, 1); renderThumbs(); fileIn.focus(); });
      li.appendChild(img); li.appendChild(x); thumbs.appendChild(li);
    });
    text($("#photo-count"), files.length ? "Dodane zdjęcia: " + files.length + " z " + MAX_FILES + "." : "");
  }
  function addFiles(list) {
    var msgs = [], total = files.reduce(function (s, f) { return s + f.size; }, 0);
    Array.prototype.forEach.call(list, function (f) {
      if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(f.type)) { msgs.push("Plik " + f.name + " nie jest zdjęciem JPG, PNG, WEBP ani HEIC."); return; }
      if (f.size > MAX_FILE) { msgs.push("Zdjęcie " + f.name + " ma ponad 8 MB."); return; }
      if (files.length >= MAX_FILES) { msgs.push("Możesz dodać najwyżej 6 zdjęć."); return; }
      if (total + f.size > MAX_TOTAL) { msgs.push("Łącznie zdjęcia mogą mieć najwyżej 20 MB."); return; }
      total += f.size; files.push(f);
    });
    text($("#e-photos"), msgs.filter(function (m, i, a) { return a.indexOf(m) === i; }).join(" "));
    renderThumbs();
  }
  fileIn.addEventListener("change", function () { addFiles(fileIn.files); fileIn.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
  ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
  drop.addEventListener("drop", function (e) { if (e.dataTransfer) addFiles(e.dataTransfer.files); });

  var rules = {
    name: function (v) { return v.trim().length >= 3 ? "" : "Wpisz imię i nazwisko."; },
    phone: function (v) {
      if (!v.trim()) return "Wpisz numer telefonu, żebyśmy mogli oddzwonić z wyceną.";
      var d = v.replace(/[\s().-]/g, "").replace(/^(\+48|0048)/, "");
      return /^\d{9}$/.test(d) ? "" : "Wpisz 9-cyfrowy numer, np. 600 100 200.";
    },
    email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Sprawdź adres e-mail, np. jan.kowalski@poczta.pl."; },
    service: function (v) { return v ? "" : "Wybierz rodzaj usługi."; },
    from: function (v) { return v.trim().length >= 2 ? "" : "Wpisz, skąd zabieramy rzeczy."; }
  };
  var tried = false;
  function check(n) {
    var el = form.elements[n], msg = rules[n](el.value);
    text($("#e-" + n), msg); el.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  function checkConsent() {
    var c = form.elements.consent, ok = c.checked;
    text($("#e-consent"), ok ? "" : "Zaznacz zgodę, żeby wysłać zapytanie.");
    c.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  }
  Object.keys(rules).forEach(function (n) {
    var el = form.elements[n];
    el.addEventListener(el.tagName === "SELECT" ? "change" : "blur", function () { if (tried || el.value) check(n); });
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") check(n); });
  });
  form.elements.consent.addEventListener("change", function () { if (tried) checkConsent(); });

  var msgEl = $("#form-msg"), btn = $("#submit-btn"), done = $("#form-done");
  function plural(k) { return k === 1 ? "1 pole zaznaczone" : k + (k < 5 ? " pola zaznaczone" : " pól zaznaczonych"); }
  function show(t, bad) { msgEl.textContent = t; msgEl.classList.toggle("bad", !!bad); }

  function sendQuote(e) {
    e.preventDefault(); tried = true;
    var bad = Object.keys(rules).filter(function (n) { return !check(n); });
    if (!checkConsent()) bad.push("consent");
    if (bad.length) { show("Popraw " + plural(bad.length) + " na czerwono.", true); form.elements[bad[0]].focus(); return; }
    if (!SITE.formEndpoint) { show("To jest podgląd strony. Wysyłka formularza działa po wgraniu strony na serwer z PHP (np. Hostinger).", true); return; }
    var fd = new FormData(form);
    fd.delete("photos[]");
    files.forEach(function (f) { fd.append("photos[]", f, f.name); });
    btn.disabled = true; btn.textContent = "Wysyłamy…"; show("");
    fetch(SITE.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (j) {
        btn.disabled = false; btn.textContent = "Wyślij zapytanie";
        if (j.ok) { show(""); form.hidden = true; done.hidden = false; done.focus(); return; }
        if (j.errors) Object.keys(j.errors).forEach(function (n) { text($("#e-" + n), j.errors[n]); if (form.elements[n]) form.elements[n].setAttribute("aria-invalid", "true"); });
        show(j.message || "Nie udało się wysłać zapytania. Spróbuj ponownie albo zadzwoń do nas.", true);
      })
      .catch(function () { btn.disabled = false; btn.textContent = "Wyślij zapytanie"; show("Nie udało się połączyć z serwerem. Spróbuj ponownie albo zadzwoń do nas.", true); });
  }
  /* Kliknięcie przycisku obsługujemy wprost (działa też w podglądzie, gdzie „submit” jest blokowany); Enter w polu – przez „submit” */
  btn.addEventListener("click", sendQuote);
  form.addEventListener("submit", sendQuote);
  $("#form-again").addEventListener("click", function () {
    form.reset(); files = []; renderThumbs(); tried = false;
    $$(".err", form).forEach(function (p) { p.textContent = ""; });
    $$("[aria-invalid]", form).forEach(function (el) { el.setAttribute("aria-invalid", "false"); });
    show(""); form.elements.started.value = String(Date.now());
    done.hidden = true; form.hidden = false; $("#f-name").focus();
  });
})();
