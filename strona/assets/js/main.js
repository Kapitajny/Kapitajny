(function () {
  "use strict";
  var SITE = window.SITE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function text(el, v) { if (el) el.textContent = v; }

  /* ---------- Dane kontaktowe ---------- */
  var tel = (SITE.phone || "").replace(/[^\d+]/g, "");
  $$("[data-call]").forEach(function (a) {
    if (tel) {
      a.href = "tel:" + tel;
      var num = $("[data-phone-text]", a);
      if (num) num.textContent = SITE.phone;
    } else {
      a.href = "#kontakt";
      if (a.hasAttribute("data-call-optional")) a.hidden = true;
    }
  });
  $$("[data-phone]").forEach(function (el) {
    if (SITE.phone) { el.innerHTML = ""; var a = document.createElement("a"); a.href = "tel:" + tel; a.textContent = SITE.phone; el.appendChild(a); }
  });
  $$("[data-email]").forEach(function (el) {
    if (SITE.email) { el.innerHTML = ""; var a = document.createElement("a"); a.href = "mailto:" + SITE.email; a.textContent = SITE.email; el.appendChild(a); }
  });
  $$("[data-address]").forEach(function (el) {
    if (SITE.address) {
      el.innerHTML = ""; var a = document.createElement("a");
      a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(SITE.address);
      a.target = "_blank"; a.rel = "noopener"; a.textContent = SITE.address + " (Google Maps)"; el.appendChild(a);
    }
  });
  $$("[data-legal]").forEach(function (el) { if (SITE.companyLegal) el.textContent = SITE.companyLegal; });
  $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Menu na telefonie ---------- */
  var menuBtn = $("#menu-btn"), nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    $("use", menuBtn).setAttribute("href", open ? "#i-close" : "#i-menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
    window.addEventListener("resize", function () { if (window.innerWidth > 1020 && nav.classList.contains("open")) setMenu(false); });
  }

  /* ---------- Przejście do wyceny z wybraną usługą lub trasą ---------- */
  var form = $("#quote-form");
  function goToQuote(data) {
    if (!form) return;
    if (data.service) form.elements.service.value = data.service;
    if (data.from) form.elements.from.value = data.from;
    if (data.to) form.elements.to.value = data.to;
    $("#wycena").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setTimeout(function () { $("#f-name").focus({ preventScroll: true }); }, reduceMotion ? 0 : 500);
  }
  $$("[data-service]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); goToQuote({ service: a.getAttribute("data-service") }); });
  });

  /* ---------- Mapa ---------- */
  var MAP = window.PL_MAP, svg = $("#map");
  if (MAP && svg) {
    var NS = "http://www.w3.org/2000/svg";
    var gReg = document.createElementNS(NS, "g"), gDots = document.createElementNS(NS, "g"), gRoute = document.createElementNS(NS, "g");
    svg.appendChild(gReg); svg.appendChild(gDots); svg.appendChild(gRoute);
    var info = $("#region-info"), regs = {};
    var capitalsOf = function (name) { return MAP.cities.filter(function (c) { return c.w === name; }).map(function (c) { return c.n; }).join(" i "); };
    var selectRegion = function (name) {
      Object.keys(regs).forEach(function (k) { regs[k].classList.toggle("on", k === name); });
      $$("#voiv-list button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-w") === name)); });
      info.innerHTML = "";
      var b = document.createElement("b"); b.textContent = "Województwo " + name;
      info.appendChild(b);
      info.appendChild(document.createTextNode(". Miasto wojewódzkie: " + capitalsOf(name) + ". Przyjedziemy pod każdy adres w województwie i przewieziemy rzeczy do dowolnego miejsca w Polsce."));
    };
    var list = $("#voiv-list");
    MAP.regions.forEach(function (r) {
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", r.d); p.setAttribute("class", "reg"); p.setAttribute("tabindex", "-1");
      p.setAttribute("aria-hidden", "true");
      p.addEventListener("click", function () { selectRegion(r.name); });
      var t = document.createElementNS(NS, "title"); t.textContent = "Województwo " + r.name; p.appendChild(t);
      gReg.appendChild(p); regs[r.name] = p;
      var li = document.createElement("li"), btn = document.createElement("button");
      btn.type = "button"; btn.textContent = r.name; btn.setAttribute("data-w", r.name); btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function () { selectRegion(r.name); });
      li.appendChild(btn); list.appendChild(li);
    });
    MAP.cities.forEach(function (c) {
      var d = document.createElementNS(NS, "circle");
      d.setAttribute("cx", c.x); d.setAttribute("cy", c.y); d.setAttribute("r", 3.2); d.setAttribute("class", "dot");
      gDots.appendChild(d);
    });
    var dl = $("#cities");
    MAP.cities.map(function (c) { return c.n; }).sort(function (a, b) { return a.localeCompare(b, "pl"); }).forEach(function (n) {
      var o = document.createElement("option"); o.value = n; dl.appendChild(o);
    });
    var norm = function (s) { return s.trim().toLocaleLowerCase("pl"); };
    var findCity = function (name) { var n = norm(name); return MAP.cities.filter(function (c) { return norm(c.n) === n; })[0]; };
    var label = function (c, dy) {
      var t = document.createElementNS(NS, "text");
      t.setAttribute("x", c.x); t.setAttribute("y", c.y + dy); t.setAttribute("text-anchor", "middle"); t.setAttribute("class", "city-lbl");
      t.textContent = c.n; return t;
    };
    var drawRoute = function (a, b) {
      gRoute.innerHTML = "";
      var dx = b.x - a.x, dy = b.y - a.y, cx = (a.x + b.x) / 2 - dy * 0.2, cy = (a.y + b.y) / 2 + dx * 0.2;
      var path = document.createElementNS(NS, "path");
      path.setAttribute("d", "M" + a.x + " " + a.y + " Q" + cx + " " + cy + " " + b.x + " " + b.y);
      path.setAttribute("class", "route-line"); gRoute.appendChild(path);
      [a, b].forEach(function (c) {
        var pin = document.createElementNS(NS, "circle");
        pin.setAttribute("cx", c.x); pin.setAttribute("cy", c.y); pin.setAttribute("r", 7.5); pin.setAttribute("class", "pin");
        gRoute.appendChild(pin);
      });
      var up = a.y < b.y;
      gRoute.appendChild(label(a, up ? -14 : 26)); gRoute.appendChild(label(b, up ? 26 : -14));
    };
    var planner = $("#planner"), out = $("#pl-out"), quoteBtn = $("#pl-quote");
    planner.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = planner.elements.from.value.trim(), t = planner.elements.to.value.trim();
      quoteBtn.hidden = true; gRoute.innerHTML = "";
      if (!f || !t) { out.textContent = "Wpisz miejscowość początkową i docelową."; return; }
      if (norm(f) === norm(t)) { out.textContent = "Przeprowadzka w obrębie miejscowości? To też robimy. Poproś o wycenę."; quoteBtn.hidden = false; return; }
      var a = findCity(f), b = findCity(t);
      if (a && b) { drawRoute(a, b); out.textContent = "Trasa " + a.n + " – " + b.n + ". Przygotujemy wycenę dla tego przejazdu."; }
      else { out.textContent = "Trasa " + f + " – " + t + ". Na mapie pokazujemy miasta wojewódzkie, ale wycenę przygotujemy dla każdej trasy w Polsce."; }
      quoteBtn.hidden = false;
    });
    quoteBtn.addEventListener("click", function () { goToQuote({ from: planner.elements.from.value.trim(), to: planner.elements.to.value.trim() }); });
  }

  /* ---------- Opinie ---------- */
  var reviews = (SITE.reviews || []).filter(function (r) { return r && r.text && r.author; });
  var star = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>';
  var starEmpty = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>';
  var rList = $("#review-list"), rWait = $("#review-wait");
  if (reviews.length && rList) {
    reviews.forEach(function (r) {
      var li = document.createElement("li"); li.className = "review";
      var n = Math.max(0, Math.min(5, Math.round(r.rating || 0)));
      var stars = document.createElement("div"); stars.className = "stars"; stars.setAttribute("role", "img"); stars.setAttribute("aria-label", "Ocena " + n + " na 5");
      stars.innerHTML = new Array(n + 1).join(star) + new Array(6 - n).join(starEmpty);
      var p = document.createElement("p"); p.textContent = r.text;
      var ft = document.createElement("footer"); var au = document.createElement("b"); au.textContent = r.author;
      var tm = document.createElement("time"); tm.dateTime = r.date || ""; tm.textContent = r.date ? new Date(r.date).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" }) : "";
      ft.appendChild(au); ft.appendChild(tm);
      li.appendChild(stars); li.appendChild(p); li.appendChild(ft); rList.appendChild(li);
    });
    rList.hidden = false; if (rWait) rWait.hidden = true;
  }
  $$("[data-review-link]").forEach(function (a) { if (SITE.googleReviewUrl) { a.href = SITE.googleReviewUrl; a.hidden = false; } });
  $$("[data-profile-link]").forEach(function (a) { if (SITE.googleProfileUrl) { a.href = SITE.googleProfileUrl; a.hidden = false; } });
  var noLink = $("#review-nolink"); if (noLink && (SITE.googleReviewUrl || SITE.googleProfileUrl)) noLink.hidden = true;

  /* ---------- Formularz wyceny ---------- */
  if (!form) return;
  var MAX_FILES = 6, MAX_FILE = 8 * 1024 * 1024, MAX_TOTAL = 20 * 1024 * 1024;
  var files = [], thumbs = $("#thumbs"), drop = $("#drop"), fileIn = $("#f-photos");
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  form.elements.date.min = iso;
  form.elements.started.value = String(Date.now());

  function totalSize() { return files.reduce(function (s, f) { return s + f.size; }, 0); }
  function renderThumbs() {
    thumbs.innerHTML = "";
    files.forEach(function (f, i) {
      var li = document.createElement("li"), img = document.createElement("img"), x = document.createElement("button");
      img.alt = "Podgląd: " + f.name; img.width = 88; img.height = 88;
      img.src = URL.createObjectURL(f); img.onload = function () { URL.revokeObjectURL(img.src); };
      x.type = "button"; x.textContent = "×"; x.setAttribute("aria-label", "Usuń zdjęcie " + f.name);
      x.addEventListener("click", function () { files.splice(i, 1); renderThumbs(); fileIn.focus(); });
      li.appendChild(img); li.appendChild(x); thumbs.appendChild(li);
    });
    text($("#photo-count"), files.length ? "Dodane zdjęcia: " + files.length + " z " + MAX_FILES + "." : "");
  }
  function addFiles(list) {
    var msgs = [];
    Array.prototype.forEach.call(list, function (f) {
      if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(f.type)) { msgs.push("Plik " + f.name + " nie jest zdjęciem JPG, PNG, WEBP ani HEIC."); return; }
      if (f.size > MAX_FILE) { msgs.push("Zdjęcie " + f.name + " ma ponad 8 MB."); return; }
      if (files.length >= MAX_FILES) { msgs.push("Możesz dodać najwyżej 6 zdjęć."); return; }
      if (totalSize() + f.size > MAX_TOTAL) { msgs.push("Łącznie zdjęcia mogą mieć najwyżej 20 MB."); return; }
      files.push(f);
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
      var d = v.replace(/[\s().-]/g, "").replace(/^(\+48|0048)/, "");
      if (!v.trim()) return "Wpisz numer telefonu, żebyśmy mogli oddzwonić z wyceną.";
      return /^\d{9}$/.test(d) ? "" : "Wpisz 9-cyfrowy numer, np. 600 100 200.";
    },
    email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Sprawdź adres e-mail, np. jan.kowalski@poczta.pl."; },
    service: function (v) { return v ? "" : "Wybierz rodzaj usługi."; },
    from: function (v) { return v.trim().length >= 2 ? "" : "Wpisz miejsce odbioru."; },
    date: function (v) { return !v || v >= iso ? "" : "Wybierz dzisiejszą lub późniejszą datę."; }
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
    el.addEventListener(el.tagName === "SELECT" || n === "date" ? "change" : "blur", function () { if (tried || el.value) check(n); });
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") check(n); });
  });
  form.elements.consent.addEventListener("change", function () { if (tried) checkConsent(); });

  var msgEl = $("#form-msg"), submitBtn = $("#submit-btn"), done = $("#form-done");
  function plural(k) { return k === 1 ? "1 pole" : k + (k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 10 || k % 100 >= 20) ? " pola" : " pól"); }
  function showMsg(t, bad) { msgEl.textContent = t; msgEl.classList.toggle("bad", !!bad); }

  form.addEventListener("submit", function (e) {
    e.preventDefault(); tried = true;
    var bad = Object.keys(rules).filter(function (n) { return !check(n); });
    if (!checkConsent()) bad.push("consent");
    if (bad.length) {
      showMsg("Popraw " + plural(bad.length) + " zaznaczone na czerwono.", true);
      form.elements[bad[0]].focus();
      return;
    }
    var endpoint = SITE.formEndpoint;
    if (!endpoint) {
      showMsg("To jest podgląd strony. Wysyłka formularza działa po wgraniu strony na serwer z PHP (np. Hostinger).", true);
      return;
    }
    var fd = new FormData(form);
    fd.delete("photos[]");
    files.forEach(function (f) { fd.append("photos[]", f, f.name); });
    submitBtn.disabled = true; showMsg("Wysyłamy zapytanie…");
    fetch(endpoint, { method: "POST", body: fd, headers: { "Accept": "application/json" } })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }).then(function (j) { j.status = r.status; return j; }); })
      .then(function (j) {
        submitBtn.disabled = false;
        if (j.ok) {
          showMsg("");
          form.hidden = true; done.hidden = false; done.focus();
          return;
        }
        if (j.errors) {
          Object.keys(j.errors).forEach(function (n) { text($("#e-" + n), j.errors[n]); if (form.elements[n]) form.elements[n].setAttribute("aria-invalid", "true"); });
        }
        showMsg(j.message || "Nie udało się wysłać zapytania. Spróbuj ponownie albo zadzwoń do nas.", true);
      })
      .catch(function () {
        submitBtn.disabled = false;
        showMsg("Nie udało się połączyć z serwerem. Sprawdź internet i spróbuj ponownie albo zadzwoń do nas.", true);
      });
  });
  $("#form-again").addEventListener("click", function () {
    form.reset(); files = []; renderThumbs(); tried = false;
    $$(".err", form).forEach(function (p) { p.textContent = ""; });
    $$("[aria-invalid]", form).forEach(function (el) { el.setAttribute("aria-invalid", "false"); });
    showMsg(""); form.elements.started.value = String(Date.now());
    done.hidden = true; form.hidden = false; $("#f-name").focus();
  });
})();
