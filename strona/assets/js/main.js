(function () {
  "use strict";
  var SITE = window.SITE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function text(el, v) { if (el) el.textContent = v; }

  /* Dane firmy z config.js (puste pola nie są pokazywane) */
  var tel = (SITE.phone || "").replace(/[^\d+]/g, "");
  if (/^\d{9}$/.test(tel)) tel = "+48" + tel;
  $$("[data-call]").forEach(function (a) {
    a.href = tel ? "tel:" + tel : "#formularz";
    $$("[data-phone-text]", a).forEach(function (n) { if (SITE.phone) n.textContent = SITE.phone; });
  });
  $$("[data-phone-text]").forEach(function (n) { if (SITE.phone) n.textContent = SITE.phone; });
  function fillLink(sel, value, href, rowSel) {
    if (!value) return;
    $$(sel).forEach(function (el) { el.textContent = ""; var a = document.createElement("a"); a.href = href; a.textContent = value; el.appendChild(a); });
    if (rowSel) $$(rowSel).forEach(function (el) { el.hidden = false; });
  }
  fillLink("[data-email]", SITE.email, "mailto:" + SITE.email, "[data-email-row]");
  if (SITE.hours) { $$("[data-hours]").forEach(function (el) { el.textContent = SITE.hours; }); $$("[data-hours-row]").forEach(function (el) { el.hidden = false; }); }
  if (SITE.companyLegal) { $$("[data-legal], [data-legal-foot]").forEach(function (el) { el.textContent = SITE.companyLegal; }); }
  $$("[data-credit]").forEach(function (el) { el.textContent = SITE.credit || ""; });
  $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* Nagłówek z linią po przewinięciu */
  var top = $("#top"), hero = $("#start");
  function onScroll() { top.classList.toggle("solid", window.scrollY > 8); }
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu mobilne */
  var menuBtn = $("#menu-btn"), nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    $("use", menuBtn).setAttribute("href", open ? "#i-close" : "#i-menu");
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth > 980 && nav.classList.contains("open")) setMenu(false); });

  /* Aktywna pozycja menu i dolny pasek na telefonie */
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
    $$("main > section").forEach(function (s) { io.observe(s); });
    new IntersectionObserver(function (en) { callbar.classList.toggle("show", !en[0].isIntersecting); }, { threshold: 0.05 }).observe(hero);
  } else { callbar.classList.add("show"); }

  /* Przewijanie do sekcji: skryptem (działa też w osadzonym podglądzie) z rezerwowymi metodami */
  var form = $("#quote-form");
  function firstEmpty() {
    var order = ["name", "phone"];
    for (var i = 0; i < order.length; i++) { var el = form.elements[order[i]]; if (!el.value.trim()) return el; }
    if (!form.querySelector('input[name="kind"]:checked')) return form.querySelector('input[name="kind"]');
    if (!form.elements.from.value.trim()) return form.elements.from;
    return form.elements.details;
  }
  function arrived(el) { var r = el.getBoundingClientRect(); return r.top > -40 && r.top < window.innerHeight * 0.6; }
  function jump(el) {
    var y = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - (top.offsetHeight || 0) - 12;
    try { window.scrollTo(0, y); } catch (err) {}
    (document.scrollingElement || document.documentElement).scrollTop = y;
    if (!arrived(el)) { try { el.scrollIntoView(true); } catch (err) {} }
  }
  function goTo(id) {
    var target = document.getElementById(id);
    if (!target) return false;
    if (nav.classList.contains("open")) setMenu(false);
    try { target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); } catch (err) { jump(target); }
    setTimeout(function () {
      if (arrived(target)) return;
      jump(target);
      setTimeout(function () { if (!arrived(target)) { try { location.hash = id; } catch (err) {} } }, 120);
    }, reduce ? 60 : 1000);
    try { history.replaceState(null, "", "#" + id); } catch (err) {}
    if (id === "formularz" && !form.hidden) {
      setTimeout(function () { var f = firstEmpty(); try { f.focus({ preventScroll: true }); } catch (err) { f.focus(); } }, reduce ? 0 : 1150);
    }
    return true;
  }
  function setRadio(name, value) {
    $$('input[name="' + name + '"]', form).forEach(function (r) { r.checked = r.value === value; });
  }
  window.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (a.hasAttribute("data-kind")) { setRadio("kind", a.getAttribute("data-kind")); clearErr("kind"); }
    if (a.hasAttribute("data-help")) setRadio("help", a.getAttribute("data-help"));
    if (a.hasAttribute("data-extra")) $$('input[name="extras[]"]', form).forEach(function (c) { if (c.value === a.getAttribute("data-extra")) c.checked = true; });
    if (goTo(id)) e.preventDefault();
  }, true);

  /* Cennik: ramka „banknotu” (gilosz, mikrodruk, rozeta) rysowana na kanwie */
  var notes = $$(".note");
  function drawNote(note) {
    var c = $("canvas", note), w = note.clientWidth, h = note.clientHeight, d = window.devicePixelRatio || 1;
    if (!w || !h) return;
    c.width = Math.round(w * d); c.height = Math.round(h * d);
    var x = c.getContext("2d"); x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, w, h);
    var ink = "#4E6452", band = Math.max(9, w * .045), amp = band * .3;
    x.strokeStyle = ink; x.lineWidth = .65; x.globalAlpha = .7;
    function edge(x0, y0, x1, y1, nx, ny) {
      var len = Math.hypot(x1 - x0, y1 - y0), steps = Math.ceil(len / 2);
      for (var k = 0; k < 5; k++) {
        x.beginPath();
        for (var i = 0; i <= steps; i++) {
          var t = i / steps, off = band / 2 + amp * Math.sin(t * len / (band * .42) + k * Math.PI / 2.5);
          var px = x0 + (x1 - x0) * t + nx * off, py = y0 + (y1 - y0) * t + ny * off;
          if (i) x.lineTo(px, py); else x.moveTo(px, py);
        }
        x.stroke();
      }
    }
    edge(0, 0, w, 0, 0, 1); edge(0, h, w, h, 0, -1); edge(0, 0, 0, h, 1, 0); edge(w, 0, w, h, -1, 0);
    x.globalAlpha = .9; x.lineWidth = 1; x.strokeRect(band + 4, band + 4, w - 2 * band - 8, h - 2 * band - 8);
    x.globalAlpha = .5; x.strokeRect(band + 8, band + 8, w - 2 * band - 16, h - 2 * band - 16);
    /* mikrodruk wzdłuż wewnętrznej ramki */
    x.globalAlpha = .55; x.fillStyle = ink; x.font = "600 " + Math.max(5, w * .011) + "px Cinzel, Georgia, serif";
    var micro = "USŁUGI BUSEM · PRZEPROWADZKI · TRANSPORT BUSEM · ", line = "";
    while (x.measureText(line).width < w) line += micro;
    x.save(); x.beginPath(); x.rect(band + 12, 0, w * .72 - band - 12, h); x.clip();
    x.fillText(line, band + 12, band + 4 + Math.max(5, w * .011) + 4);
    x.fillText(line, band + 12, h - band - 10);
    x.restore();
    /* rozeta po prawej stronie */
    if (note.classList.contains("note-ind")) return;
    var cx = w * .8, cy = h * .52, R = h * .3; x.globalAlpha = .16; x.lineWidth = .55;
    for (var s = 0; s < 22; s++) {
      x.beginPath();
      for (var a = 0; a <= 360; a += 2) {
        var t2 = a * Math.PI / 180, rr = R * (.7 + .3 * Math.cos(8 * t2 + s * .28));
        var px2 = cx + rr * Math.cos(t2 + s * .14), py2 = cy + rr * Math.sin(t2 + s * .14);
        if (a) x.lineTo(px2, py2); else x.moveTo(px2, py2);
      }
      x.stroke();
    }
  }
  function drawNotes() { notes.forEach(drawNote); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawNotes); else drawNotes();
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(drawNotes, 120); });

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
    from: function (v) { return v.trim().length >= 2 ? "" : "Wpisz adres załadunku, np. miejscowość i ulicę."; }
  };
  var tried = false;
  function check(n) {
    var el = form.elements[n], msg = rules[n](el.value);
    text($("#e-" + n), msg); el.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  var kindPills = $('#l-kind').parentNode.querySelector(".pills");
  function clearErr(n) { text($("#e-" + n), ""); if (n === "kind") kindPills.removeAttribute("aria-invalid"); }
  function checkKind() {
    var ok = !!form.querySelector('input[name="kind"]:checked');
    text($("#e-kind"), ok ? "" : "Wybierz, czego dotyczy zlecenie.");
    if (ok) kindPills.removeAttribute("aria-invalid"); else kindPills.setAttribute("aria-invalid", "true");
    return ok;
  }
  function checkConsent() {
    var c = form.elements.consent, ok = c.checked;
    text($("#e-consent"), ok ? "" : "Zaznacz zgodę, żeby wysłać zapytanie.");
    c.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  }
  Object.keys(rules).forEach(function (n) {
    var el = form.elements[n];
    el.addEventListener("blur", function () { if (tried || el.value) check(n); });
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") check(n); });
  });
  $$('input[name="kind"]', form).forEach(function (r) { r.addEventListener("change", function () { if (tried) checkKind(); }); });
  form.elements.consent.addEventListener("change", function () { if (tried) checkConsent(); });

  var msgEl = $("#form-msg"), btn = $("#submit-btn"), done = $("#form-done"), sending = false;
  function plural(k) { return k === 1 ? "1 pole zaznaczone" : k + (k < 5 ? " pola zaznaczone" : " pól zaznaczonych"); }
  function show(t, bad) { msgEl.textContent = t; msgEl.classList.toggle("bad", !!bad); }

  /* Obsługa kliknięcia i Entera (w osadzonym podglądzie zdarzenie „submit” bywa blokowane) */
  function sendQuote(e) {
    e.preventDefault();
    if (sending) return;
    tried = true;
    /* kolejność jak w formularzu: imię, telefon, e-mail, rodzaj, adres załadunku, zgoda */
    var order = [
      ["name", function () { return check("name"); }, form.elements.name],
      ["phone", function () { return check("phone"); }, form.elements.phone],
      ["email", function () { return check("email"); }, form.elements.email],
      ["kind", checkKind, form.querySelector('input[name="kind"]')],
      ["from", function () { return check("from"); }, form.elements.from],
      ["consent", checkConsent, form.elements.consent]
    ];
    var bad = order.filter(function (o) { return !o[1](); });
    if (bad.length) { show("Popraw " + plural(bad.length) + " na czerwono.", true); bad[0][2].focus(); return; }
    if (!SITE.formEndpoint) { show("To jest podgląd strony. Wysyłka formularza działa po wgraniu strony na serwer z PHP (np. Hostinger).", true); return; }
    var fd = new FormData(form);
    fd.delete("photos[]");
    files.forEach(function (f) { fd.append("photos[]", f, f.name); });
    sending = true; btn.disabled = true; btn.textContent = "Wysyłamy zapytanie…"; show("");
    function reset() { sending = false; btn.disabled = false; btn.textContent = "Otrzymaj bezpłatną wycenę"; }
    fetch(SITE.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (j) {
        reset();
        if (j.ok) { show(""); form.hidden = true; done.hidden = false; done.focus(); return; }
        if (j.errors) Object.keys(j.errors).forEach(function (n) { text($("#e-" + n), j.errors[n]); if (form.elements[n] && form.elements[n].setAttribute) form.elements[n].setAttribute("aria-invalid", "true"); });
        show(j.message || "Nie udało się wysłać zapytania. Spróbuj ponownie albo zadzwoń do nas.", true);
      })
      .catch(function () { reset(); show("Nie udało się połączyć z serwerem. Spróbuj ponownie albo zadzwoń do nas.", true); });
  }
  btn.addEventListener("click", sendQuote);
  form.addEventListener("submit", sendQuote);
  $("#form-again").addEventListener("click", function () {
    form.reset(); files = []; renderThumbs(); tried = false;
    $$(".err", form).forEach(function (p) { p.textContent = ""; });
    $$("[aria-invalid]", form).forEach(function (el) { el.removeAttribute("aria-invalid"); });
    show(""); form.elements.started.value = String(Date.now());
    done.hidden = true; form.hidden = false; $("#f-name").focus();
  });
})();
