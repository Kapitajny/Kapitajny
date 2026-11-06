(function () {
  "use strict";
  var SITE = window.SITE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function text(el, v) { if (el) el.textContent = v; }

  /* Dane kontaktowe z config.js */
  var tel = (SITE.phone || "").replace(/[^\d+]/g, "");
  $$("[data-call]").forEach(function (a) {
    a.href = tel ? "tel:" + tel : "#kontakt";
    if (!tel && a.hasAttribute("data-call-optional")) a.hidden = true;
    var num = a.querySelector("[data-phone-text]");
    if (tel && num) num.textContent = SITE.phone;
  });
  $$("[data-phone]").forEach(function (el) {
    if (!SITE.phone) return;
    el.textContent = ""; var a = document.createElement("a"); a.href = "tel:" + tel; a.textContent = SITE.phone; el.appendChild(a);
  });
  $$("[data-email]").forEach(function (el) {
    if (!SITE.email) return;
    el.textContent = ""; var a = document.createElement("a"); a.href = "mailto:" + SITE.email; a.textContent = SITE.email; el.appendChild(a);
  });
  $$("[data-legal]").forEach(function (el) { if (SITE.companyLegal) el.textContent = SITE.companyLegal; });
  $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* Menu na telefonie */
  var menuBtn = $("#menu-btn"), nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    $("use", menuBtn).setAttribute("href", open ? "#i-close" : "#i-menu");
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
    window.addEventListener("resize", function () { if (window.innerWidth > 900 && nav.classList.contains("open")) setMenu(false); });
  }

  /* Podświetlenie aktywnej sekcji w menu */
  var links = $$(".nav > a[href^='#']");
  if ("IntersectionObserver" in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var a = map[en.target.id]; if (a) a.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* Linki do sekcji: przewijanie obsługuje skrypt, więc działa też w osadzonym podglądzie */
  var form = $("#quote-form");
  function goTo(id) {
    var target = document.getElementById(id);
    if (!target) return false;
    if (nav && nav.classList.contains("open")) setMenu(false);
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    try { history.replaceState(null, "", "#" + id); } catch (err) {}
    if (id === "wycena") {
      setTimeout(function () { var f = $("#f-name"); if (f && !form.hidden) f.focus({ preventScroll: true }); }, reduce ? 0 : 650);
    }
    return true;
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (form && a.hasAttribute("data-service")) form.elements.service.value = a.getAttribute("data-service");
    if (goTo(id)) e.preventDefault();
  });

  /* Formularz */
  if (!form) return;
  var MAX_FILES = 6, MAX_FILE = 8 * 1024 * 1024, MAX_TOTAL = 20 * 1024 * 1024;
  var files = [], thumbs = $("#thumbs"), drop = $("#drop"), fileIn = $("#f-photos");
  form.elements.started.value = String(Date.now());

  function renderThumbs() {
    thumbs.innerHTML = "";
    files.forEach(function (f, i) {
      var li = document.createElement("li"), img = document.createElement("img"), x = document.createElement("button");
      img.alt = "Podgląd: " + f.name; img.width = 76; img.height = 76;
      img.src = URL.createObjectURL(f); img.onload = function () { URL.revokeObjectURL(img.src); };
      x.type = "button"; x.textContent = "×"; x.setAttribute("aria-label", "Usuń zdjęcie " + f.name);
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
    from: function (v) { return v.trim().length >= 2 ? "" : "Wpisz miejsce odbioru."; }
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

  form.addEventListener("submit", function (e) {
    e.preventDefault(); tried = true;
    var bad = Object.keys(rules).filter(function (n) { return !check(n); });
    if (!checkConsent()) bad.push("consent");
    if (bad.length) { show("Popraw " + plural(bad.length) + " na czerwono.", true); form.elements[bad[0]].focus(); return; }
    if (!SITE.formEndpoint) { show("To jest podgląd strony. Wysyłka formularza działa po wgraniu strony na serwer z PHP (np. Hostinger).", true); return; }
    var fd = new FormData(form);
    fd.delete("photos[]");
    files.forEach(function (f) { fd.append("photos[]", f, f.name); });
    btn.disabled = true; show("Wysyłamy zapytanie…");
    fetch(SITE.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (j) {
        btn.disabled = false;
        if (j.ok) { show(""); form.hidden = true; done.hidden = false; done.focus(); return; }
        if (j.errors) Object.keys(j.errors).forEach(function (n) { text($("#e-" + n), j.errors[n]); if (form.elements[n]) form.elements[n].setAttribute("aria-invalid", "true"); });
        show(j.message || "Nie udało się wysłać zapytania. Spróbuj ponownie albo zadzwoń do nas.", true);
      })
      .catch(function () { btn.disabled = false; show("Nie udało się połączyć z serwerem. Spróbuj ponownie albo zadzwoń do nas.", true); });
  });
  $("#form-again").addEventListener("click", function () {
    form.reset(); files = []; renderThumbs(); tried = false;
    $$(".err", form).forEach(function (p) { p.textContent = ""; });
    $$("[aria-invalid]", form).forEach(function (el) { el.setAttribute("aria-invalid", "false"); });
    show(""); form.elements.started.value = String(Date.now());
    done.hidden = true; form.hidden = false; $("#f-name").focus();
  });
})();
