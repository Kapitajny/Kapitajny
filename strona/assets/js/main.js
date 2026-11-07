(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var SITE = window.SITE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var mq = function (q) { return window.matchMedia ? window.matchMedia(q) : { matches: false }; };
  var reduce = mq("(prefers-reduced-motion: reduce)").matches;
  var finePointer = mq("(hover: hover) and (pointer: fine)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  function text(el, v) { if (el) el.textContent = v; }
  var SVGNS = "http://www.w3.org/2000/svg";

  /* ---------------------------------------------------------------------
     Dane kontaktowe z config.js
     --------------------------------------------------------------------- */
  var tel = (SITE.phone || "").replace(/[^\d+]/g, "");
  if (/^\d{9}$/.test(tel)) tel = "+48" + tel;
  $$("[data-call]").forEach(function (a) {
    if (tel) a.href = "tel:" + tel; else { a.href = "#wycena"; }
    $$("[data-phone-text]", a).forEach(function (n) { n.textContent = SITE.phone || "Zamów wycenę"; });
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

  /* ---------------------------------------------------------------------
     Cennik: treść banknotów z config.js
     --------------------------------------------------------------------- */
  function zl(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " zł"; }
  (Array.isArray(SITE.pricing) ? SITE.pricing : []).forEach(function (p) {
    var note = p && $('.note[data-note="' + p.id + '"]');
    if (!note) return;
    var has = typeof p.price === "number" && p.price > 0;
    if (p.name) $$('[data-f="name"]', note).forEach(function (n) { n.textContent = p.name; });
    if (p.scope) $$('[data-f="scope"]', note).forEach(function (n) { n.textContent = p.scope; });
    $$('[data-f="price-label"]', note).forEach(function (n) { n.textContent = has ? "Cena od" : "Cena"; });
    $$('[data-f="price"]', note).forEach(function (n) { n.textContent = has ? zl(p.price) : "Wycena indywidualna"; n.classList.toggle("is-ind", !has); });
    $$('[data-f="denom"]', note).forEach(function (n) { n.textContent = has ? String(p.price) : "LM"; });
  });

  /* ---------------------------------------------------------------------
     Gilosze banknotów (generowane raz, używane przez <use>)
     --------------------------------------------------------------------- */
  function polar(fn, steps) {
    var d = "";
    for (var i = 0; i <= steps; i++) {
      var t = (i / steps) * Math.PI * 2, r = fn(t);
      d += (i ? "L" : "M") + (r * Math.cos(t)).toFixed(1) + " " + (r * Math.sin(t)).toFixed(1);
    }
    return d + "Z";
  }
  function addPath(parent, d, attrs) {
    var p = document.createElementNS(SVGNS, "path");
    p.setAttribute("d", d);
    Object.keys(attrs || {}).forEach(function (k) { p.setAttribute(k, attrs[k]); });
    parent.appendChild(p);
  }
  var sprite = document.createElementNS(SVGNS, "svg");
  sprite.setAttribute("width", "0"); sprite.setAttribute("height", "0"); sprite.setAttribute("aria-hidden", "true");
  sprite.style.position = "absolute";
  var rose = document.createElementNS(SVGNS, "symbol");
  rose.setAttribute("id", "gl-rosette"); rose.setAttribute("viewBox", "-100 -100 200 200");
  addPath(rose, polar(function () { return 97; }, 120), { "stroke-width": ".9", "stroke-opacity": ".9" });
  addPath(rose, polar(function () { return 93.5; }, 120), { "stroke-width": ".5" });
  [0, Math.PI].forEach(function (ph) { addPath(rose, polar(function (t) { return 86 + 4 * Math.sin(72 * t + ph); }, 1100)); });
  for (var k = 0; k < 7; k++) (function (k) { addPath(rose, polar(function (t) { return 64 + 11 * Math.sin(20 * t + k * Math.PI * 2 / (20 * 7)); }, 760)); })(k);
  for (var j = 0; j < 5; j++) (function (j) { addPath(rose, polar(function (t) { return 42 + 6 * Math.sin(30 * t + j * Math.PI * 2 / (30 * 5)); }, 760)); })(j);
  sprite.appendChild(rose);
  var field = document.createElementNS(SVGNS, "symbol");
  field.setAttribute("id", "gl-field"); field.setAttribute("viewBox", "0 0 450 200"); field.setAttribute("preserveAspectRatio", "none");
  for (var i = 0; i < 19; i++) {
    var d = "";
    for (var x = 0; x <= 450; x += 3) {
      var y = 6 + i * 10.4 + 4 * Math.sin(x / 9 + i * 0.55) + 2.2 * Math.sin(x / 31 + i);
      d += (x ? "L" : "M") + x + " " + y.toFixed(1);
    }
    addPath(field, d, { "vector-effect": "non-scaling-stroke" });
  }
  sprite.appendChild(field);
  document.body.appendChild(sprite);
  $$("[data-gl]").forEach(function (svg) {
    var kind = svg.getAttribute("data-gl");
    var use = document.createElementNS(SVGNS, "use");
    use.setAttribute("href", "#gl-" + kind);
    if (kind === "field") { svg.setAttribute("viewBox", "0 0 450 200"); svg.setAttribute("preserveAspectRatio", "none"); use.setAttribute("width", "450"); use.setAttribute("height", "200"); }
    else { svg.setAttribute("viewBox", "-100 -100 200 200"); use.setAttribute("x", "-100"); use.setAttribute("y", "-100"); use.setAttribute("width", "200"); use.setAttribute("height", "200"); }
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", kind === "field" ? "rgba(42,37,32,.3)" : "rgba(42,37,32,.6)");
    svg.setAttribute("stroke-width", kind === "field" ? ".6" : ".32");
    svg.appendChild(use);
  });

  /* Pochylenie banknotu za kursorem */
  if (finePointer && !reduce) {
    $$(".note").forEach(function (note) {
      note.addEventListener("pointermove", function (e) {
        var r = note.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        note.style.setProperty("--ry", (px * 9).toFixed(2) + "deg");
        note.style.setProperty("--rx", (py * -7).toFixed(2) + "deg");
      });
      note.addEventListener("pointerleave", function () { note.style.removeProperty("--rx"); note.style.removeProperty("--ry"); });
    });
  }

  /* ---------------------------------------------------------------------
     Manifest: słowa rozświetlane w rytmie czytania
     --------------------------------------------------------------------- */
  var manifest = $(".manifest-text"), words = [];
  if (manifest && !reduce) {
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/( )/).forEach(function (part) {
            if (part === " " || part === "") { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.appendChild(s); words.push(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) split(n);
      });
    })(manifest);
    manifest.classList.add("split");
  }

  /* ---------------------------------------------------------------------
     Przewijanie: postęp, paralaksa, aktywna usługa, trasa współpracy
     --------------------------------------------------------------------- */
  var bar = $("#progress-bar"), hero = $("#start"), van = $(".hero-van"), ghost = $(".hero-ghost");
  var svcs = $$(".svc"), stageImgs = $$(".stage-frame img"), cap = $("#stage-cap");
  var track = $(".route-track"), stops = $$(".stop");
  var dock = $("#dock"), quote = $("#wycena");
  var activeSvc = -1, ticking = false, lastLit = -1;

  function setService(i) {
    if (i === activeSvc || i < 0) return;
    activeSvc = i;
    svcs.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
    stageImgs.forEach(function (img) { img.classList.toggle("on", +img.getAttribute("data-stage") === i); });
    if (cap && svcs[i]) text(cap, $("h3", svcs[i]).textContent);
  }

  /* Strona osadzona w ramce o wysokości całej treści (np. podgląd) nie przewija się sama:
     wtedy efekty zależne od przewijania pokazują stan końcowy. */
  function staticMode() { return document.documentElement.scrollHeight - window.innerHeight < 40 || window.innerHeight > 2400; }
  function frame() {
    ticking = false;
    document.documentElement.classList.toggle("is-static", staticMode());
    if (staticMode()) {
      words.forEach(function (w) { w.classList.add("lit"); });
      if (track) { track.style.setProperty("--p", "1"); stops.forEach(function (s) { s.classList.add("on"); }); }
      if (bar) bar.style.setProperty("--p", 0);
      if (dock) dock.classList.remove("show");
      setService(activeSvc < 0 ? 0 : activeSvc);
      return;
    }
    var vh = window.innerHeight, sy = window.pageYOffset || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.setProperty("--p", max > 0 ? (sy / max).toFixed(4) : 0);

    if (!reduce && van && sy < vh * 1.4) {
      van.style.setProperty("--vy", (sy * -0.08).toFixed(1) + "px");
      if (ghost) ghost.style.setProperty("--gx", (sy * -0.12).toFixed(1) + "px");
    }

    if (words.length) {
      var mr = manifest.getBoundingClientRect();
      var f = clamp((vh * 0.82 - mr.top) / (mr.height + vh * 0.25), 0, 1);
      var lit = Math.round(f * words.length);
      if (lit !== lastLit) { lastLit = lit; words.forEach(function (w, k) { w.classList.toggle("lit", k < lit); }); }
    }

    if (svcs.length) {
      var best = -1, bestD = Infinity, mid = vh * 0.45;
      svcs.forEach(function (s, k) {
        var r = s.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { bestD = d; best = k; }
      });
      setService(best);
    }

    if (track) {
      var tr = track.getBoundingClientRect();
      var p = reduce ? 1 : clamp((vh * 0.78 - tr.top) / (tr.height * 0.95), 0, 1);
      track.style.setProperty("--p", p.toFixed(3));
      stops.forEach(function (s, k) { s.classList.toggle("on", p >= (k + 0.4) / stops.length); });
    }

    if (dock && hero) {
      var hb = hero.getBoundingClientRect().bottom, qr = quote.getBoundingClientRect();
      var inQuote = qr.top < vh * 0.6 && qr.bottom > vh * 0.4;
      dock.classList.toggle("show", hb < vh * 0.3 && !inQuote);
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  frame();

  /* Pojawianie się elementów */
  var revealables = $$(".note, .services-stage, .svc");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("in");
        if (el.classList.contains("note")) setTimeout(function () { el.classList.add("shine"); setTimeout(function () { el.classList.remove("shine"); }, 1500); }, 700);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------------------------------------------------------------------
     Linki do sekcji (przewijanie skryptem – działa też w osadzonym podglądzie)
     --------------------------------------------------------------------- */
  var form = $("#quote-form");
  function arrived(el) { var r = el.getBoundingClientRect(); return r.top > -40 && r.top < window.innerHeight * 0.6; }
  function jump(el) {
    var y = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
    try { window.scrollTo(0, y); } catch (err) {}
    (document.scrollingElement || document.documentElement).scrollTop = y;
    if (!arrived(el)) { try { el.scrollIntoView(true); } catch (err) {} }
  }
  function goTo(id) {
    var target = document.getElementById(id);
    if (!target) return false;
    try { target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); } catch (err) { jump(target); }
    setTimeout(function () {
      if (arrived(target)) return;
      jump(target);
      setTimeout(function () { if (!arrived(target)) { try { location.hash = id; } catch (err) {} } }, 120);
    }, reduce ? 60 : 1100);
    try { history.replaceState(null, "", "#" + id); } catch (err) {}
    if (id === "wycena") {
      setTimeout(function () {
        if (form.hidden) return;
        var el = firstEmptyInStep() || $("#f-name");
        try { el.focus({ preventScroll: true }); } catch (err) { el.focus(); }
      }, reduce ? 0 : 1150);
    }
    return true;
  }
  window.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (a.hasAttribute("data-service")) setRadio("service", a.getAttribute("data-service"));
    if (goTo(id)) e.preventDefault();
  }, true);

  /* ---------------------------------------------------------------------
     Mapa Polski: trasa między miastami (funkcja zachowana z poprzedniej wersji)
     --------------------------------------------------------------------- */
  var CITY = {};
  $$(".area-map .city").forEach(function (g) {
    var c = $(".dot", g);
    CITY[g.getAttribute("data-city")] = { g: g, x: +c.getAttribute("cx"), y: +c.getAttribute("cy") };
  });
  var line = $("#route-line"), status = $("#route-status"), routeCta = $("#route-cta");
  var pick = [];
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

  /* ---------------------------------------------------------------------
     Formularz wyceny – cztery kroki
     --------------------------------------------------------------------- */
  var steps = $$(".qstep", form), stepTabs = $$(".qsteps li", form), step = 1, LAST = steps.length;
  var btnBack = $("#q-back"), btnNext = $("#q-next"), btn = $("#submit-btn");
  var msgEl = $("#form-msg"), done = $("#form-done"), qcount = $("#qcount");
  var NO_DEST = ["Pomoc przy załadunku i rozładunku", "Inna usługa"];
  form.elements.started.value = String(Date.now());
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  var todayIso = today.toISOString().slice(0, 10);
  form.elements.date.min = todayIso;

  function radioVal(name) { var r = $('input[name="' + name + '"]:checked', form); return r ? r.value : ""; }
  function setRadio(name, value) {
    $$('input[name="' + name + '"]', form).forEach(function (r) { r.checked = r.value === value; });
    syncDest();
  }
  function destRequired() { return NO_DEST.indexOf(radioVal("service")) === -1; }
  function syncDest() {
    var lab = $('label[for="f-to"]');
    var req = destRequired();
    form.elements.to.required = req;
    lab.innerHTML = "Adres rozładunku" + (req ? "" : ' <span class="opt">(jeśli dotyczy)</span>');
  }
  $$('input[name="service"]', form).forEach(function (r) { r.addEventListener("change", function () { syncDest(); if (tried[2]) check("service"); }); });
  $$('input[name="volume"]', form).forEach(function (r) { r.addEventListener("change", function () { if (tried[2]) check("volume"); }); });

  var rules = {
    name: function (v) { return v.trim().length >= 3 ? "" : "Wpisz imię i nazwisko."; },
    phone: function (v) {
      if (!v.trim()) return "Wpisz numer telefonu, żebyśmy mogli oddzwonić z wyceną.";
      var d = v.replace(/[\s().-]/g, "").replace(/^(\+48|0048)/, "");
      return /^\d{9}$/.test(d) ? "" : "Wpisz 9-cyfrowy numer, np. 600 100 200.";
    },
    email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Sprawdź adres e-mail, np. jan.kowalski@poczta.pl."; },
    service: function () { return radioVal("service") ? "" : "Wybierz rodzaj usługi."; },
    volume: function () { return radioVal("volume") ? "" : "Wybierz przybliżoną ilość rzeczy. Jeśli nie wiesz, zaznacz „Trudno powiedzieć”."; },
    from: function (v) { return v.trim().length >= 2 ? "" : "Wpisz adres załadunku: miejscowość i ulicę."; },
    to: function (v) { return !destRequired() || v.trim().length >= 2 ? "" : "Wpisz adres rozładunku: miejscowość i ulicę."; },
    date: function (v) { return !v || (/^\d{4}-\d{2}-\d{2}$/.test(v) && v >= todayIso) ? "" : "Wybierz dzisiejszą lub późniejszą datę albo zostaw pole puste."; },
    consent: function () { return form.elements.consent.checked ? "" : "Zaznacz zgodę, żeby wysłać zapytanie."; }
  };
  var STEP_FIELDS = { 1: ["name", "phone", "email"], 2: ["service", "volume"], 3: ["from", "to", "date"], 4: ["consent"] };
  var tried = {};

  function fieldEl(n) {
    if (n === "service" || n === "volume") return $('input[name="' + n + '"]', form).closest(".chips");
    return form.elements[n];
  }
  function check(n) {
    var el = form.elements[n], v = el && el.value !== undefined ? el.value : "";
    var msg = rules[n](v);
    text($("#e-" + n), msg);
    var fe = fieldEl(n);
    if (n === "service" || n === "volume") fe.classList.toggle("bad", !!msg);
    else fe.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  ["name", "phone", "email", "from", "to", "date"].forEach(function (n) {
    var el = form.elements[n];
    el.addEventListener("blur", function () { if (tried[stepOf(n)] || el.value) check(n); });
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") check(n); });
  });
  form.elements.consent.addEventListener("change", function () { if (tried[4]) check("consent"); });
  function stepOf(n) { for (var s in STEP_FIELDS) if (STEP_FIELDS[s].indexOf(n) > -1) return +s; return 1; }
  function firstEmptyInStep() {
    var names = STEP_FIELDS[step] || [];
    for (var i = 0; i < names.length; i++) {
      var n = names[i];
      if (n === "service" || n === "volume") { if (!radioVal(n)) return $('input[name="' + n + '"]', form); continue; }
      var el = form.elements[n];
      if (el && el.type !== "checkbox" && !el.value.trim()) return el;
    }
    return $("input, textarea", steps[step - 1]);
  }
  function show(t, bad) { msgEl.textContent = t; msgEl.classList.toggle("bad", !!bad); }
  function plural(k) { return k === 1 ? "1 pole" : k + (k < 5 ? " pola" : " pól"); }

  function validateStep(s) {
    tried[s] = true;
    var bad = STEP_FIELDS[s].filter(function (n) { return !check(n); });
    if (bad.length) {
      show("Popraw " + plural(bad.length) + " zaznaczone na czerwono.", true);
      var f = bad[0] === "service" || bad[0] === "volume" ? $('input[name="' + bad[0] + '"]', form) : form.elements[bad[0]];
      f.focus();
      return false;
    }
    show("");
    return true;
  }
  function goStep(s, focus) {
    step = s;
    steps.forEach(function (fs, k) {
      var on = k === s - 1;
      fs.hidden = !on;
      fs.classList.remove("enter");
      if (on && !reduce) { void fs.offsetWidth; fs.classList.add("enter"); }
    });
    stepTabs.forEach(function (li, k) { li.classList.toggle("on", k === s - 1); li.classList.toggle("done", k < s - 1); });
    text(qcount, "Krok " + s + " z 4");
    btnBack.hidden = s === 1;
    btnNext.hidden = s === LAST;
    btn.hidden = s !== LAST;
    show("");
    if (focus) {
      var r = form.getBoundingClientRect();
      if (r.top < 0) { try { form.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); } catch (err) {} }
      var el = firstEmptyInStep();
      if (el) try { el.focus({ preventScroll: true }); } catch (err) { el.focus(); }
    }
  }
  btnNext.addEventListener("click", function () { if (validateStep(step)) goStep(step + 1, true); });
  btnBack.addEventListener("click", function () { goStep(step - 1, true); });

  /* Zdjęcia */
  var MAX_FILES = 6, MAX_FILE = 8 * 1024 * 1024, MAX_TOTAL = 20 * 1024 * 1024;
  var files = [], thumbs = $("#thumbs"), drop = $("#drop"), fileIn = $("#f-photos");
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

  /* Wysyłka */
  var sending = false;
  function sendQuote(e) {
    if (e) e.preventDefault();
    if (sending) return;
    if (step < LAST) { if (validateStep(step)) goStep(step + 1, true); return; }
    for (var s = 1; s <= LAST; s++) { if (!validateStep(s)) { if (s !== step) { goStep(s, false); validateStep(s); } return; } }
    if (!SITE.formEndpoint) { show("Wysyłka formularza nie jest skonfigurowana. Zadzwoń do nas, a przygotujemy wycenę przez telefon.", true); return; }
    var fd = new FormData(form);
    fd.delete("photos[]");
    files.forEach(function (f) { fd.append("photos[]", f, f.name); });
    sending = true; btn.disabled = true; btn.textContent = "Wysyłamy zapytanie…"; show("");
    fetch(SITE.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (j) {
        sending = false; btn.disabled = false; btn.textContent = "Zamów indywidualną wycenę";
        if (j.ok) { show(""); form.hidden = true; done.hidden = false; done.focus(); return; }
        if (j.errors) {
          var first = 0;
          Object.keys(j.errors).forEach(function (n) {
            text($("#e-" + n), j.errors[n]);
            var fe = fieldEl(n) || form.elements[n];
            if (fe && fe.classList && fe.classList.contains("chips")) fe.classList.add("bad");
            else if (fe && fe.setAttribute) fe.setAttribute("aria-invalid", "true");
            var s = stepOf(n); if (n === "photos") s = 4; if (!first || s < first) first = s;
          });
          if (first && first !== step) goStep(first, false);
          Object.keys(j.errors).forEach(function (n) { text($("#e-" + n), j.errors[n]); });
        }
        show(j.message || "Nie udało się wysłać zapytania. Spróbuj ponownie albo zadzwoń do nas.", true);
      })
      .catch(function () {
        sending = false; btn.disabled = false; btn.textContent = "Zamów indywidualną wycenę";
        show("Nie udało się połączyć z serwerem. Spróbuj ponownie albo zadzwoń do nas.", true);
      });
  }
  /* Kliknięcie obsługujemy wprost (działa też w podglądzie, gdzie „submit” bywa blokowany); Enter w polu – przez „submit” */
  btn.addEventListener("click", sendQuote);
  form.addEventListener("submit", sendQuote);
  $("#form-again").addEventListener("click", function () {
    form.reset(); files = []; renderThumbs(); tried = {};
    $$(".err", form).forEach(function (p) { p.textContent = ""; });
    $$("[aria-invalid]", form).forEach(function (el) { el.setAttribute("aria-invalid", "false"); });
    $$(".chips", form).forEach(function (c) { c.classList.remove("bad"); });
    form.elements.started.value = String(Date.now());
    syncDest(); done.hidden = true; form.hidden = false; goStep(1, true);
  });
  syncDest();
  goStep(1, false);
})();
