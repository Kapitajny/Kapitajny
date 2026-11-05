/* NOVELIA ZDROWIE – koszyk w wersji demonstracyjnej (ComputerIT).
 * Koszyk działa wyłącznie w tej przeglądarce (localStorage, klucz "novelia-demo-cart").
 * Nic nie jest wysyłane na serwer, żadna płatność nie jest pobierana, a zamówienie demo nie jest realizowane.
 */
(function () {
  "use strict";

  var KEY = "novelia-demo-cart";
  var PRODUCTS = {
    "zdrowiej-kazdego-dnia": {
      title: "Zdrowiej każdego dnia",
      subtitle: "30 prostych przepisów na smaczne i zbilansowane posiłki",
      price: 39.99,
      img: "img/i32.webp",
      href: "sklep-zdrowiej-kazdego-dnia.html",
    },
  };
  var MAIN = "zdrowiej-kazdego-dnia";
  var MAX_QTY = 5;

  var money = function (v) {
    return v.toFixed(2).replace(".", ",") + " zł";
  };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  var read = function () {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(data) ? data.filter(function (l) { return PRODUCTS[l.id] && l.qty > 0; }) : [];
    } catch (e) {
      return [];
    }
  };
  var cart = read();
  var save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {}
    render();
  };
  var line = function (id) {
    return cart.filter(function (l) { return l.id === id; })[0];
  };
  var count = function () {
    return cart.reduce(function (n, l) { return n + l.qty; }, 0);
  };
  var total = function () {
    return cart.reduce(function (n, l) { return n + l.qty * PRODUCTS[l.id].price; }, 0);
  };
  var add = function (id) {
    var l = line(id);
    if (l) l.qty = Math.min(MAX_QTY, l.qty + 1);
    else cart.push({ id: id, qty: 1 });
    save();
  };
  var setQty = function (id, qty) {
    var l = line(id);
    if (!l) return;
    if (qty <= 0) cart = cart.filter(function (x) { return x.id !== id; });
    else l.qty = Math.min(MAX_QTY, qty);
    save();
  };

  // --- Ogłoszenia dla czytników ekranu
  var live = document.createElement("p");
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");
  live.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap";
  document.body.appendChild(live);
  var announce = function (msg) {
    live.textContent = "";
    setTimeout(function () { live.textContent = msg; }, 30);
  };

  // --- Szuflada koszyka (istniejący <dialog> ze statycznego eksportu)
  var drawer = document.querySelector('dialog[aria-label="Koszyk"]');
  var drawerList = drawer && drawer.querySelector("ul");
  var openDrawer = function () {
    if (!drawer) return (location.href = "koszyk.html");
    render();
    if (!drawer.open) drawer.showModal();
  };
  if (drawer) {
    drawer.addEventListener("click", function (e) {
      if (e.target === drawer) drawer.close();
    });
    var closeBtn = drawer.querySelector('button[aria-label="Zamknij koszyk"]');
    if (closeBtn) closeBtn.addEventListener("click", function () { drawer.close(); });
    Array.prototype.forEach.call(drawer.querySelectorAll("button"), function (b) {
      if ((b.textContent || "").trim() === "Kontynuuj zakupy") b.addEventListener("click", function () { drawer.close(); });
    });
  }

  var lineHtml = function (l, big) {
    var p = PRODUCTS[l.id];
    return (
      '<li class="flex gap-4 py-5' + (big ? " sm:gap-6" : "") + '" data-line="' + l.id + '">' +
      '<img alt="" width="' + (big ? 84 : 72) + '" height="' + (big ? 134 : 115) + '" class="' + (big ? "h-[134px] w-[84px]" : "h-[115px] w-[72px]") + ' shrink-0 object-cover book-shadow" src="' + p.img + '">' +
      '<div class="flex min-w-0 flex-1 flex-col">' +
      '<a class="font-serif ' + (big ? "text-xl" : "text-lg") + ' leading-snug text-forest hover:underline" href="' + p.href + '">' + esc(p.title) + "</a>" +
      '<p class="mt-1 text-sm text-muted">E-book PDF · ' + money(p.price) + " / licencja</p>" +
      '<div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">' +
      '<div class="inline-flex items-center rounded-full ring-1 ring-line" role="group" aria-label="Liczba licencji: ' + esc(p.title) + '">' +
      '<button type="button" class="inline-flex h-10 w-10 items-center justify-center text-forest hover:bg-beige disabled:opacity-40" data-dec="' + l.id + '" aria-label="Zmniejsz liczbę licencji"' + (l.qty <= 1 ? " disabled" : "") + ">−</button>" +
      '<span class="min-w-8 text-center font-medium tabular-nums" aria-live="polite">' + l.qty + "</span>" +
      '<button type="button" class="inline-flex h-10 w-10 items-center justify-center text-forest hover:bg-beige disabled:opacity-40" data-inc="' + l.id + '" aria-label="Zwiększ liczbę licencji"' + (l.qty >= MAX_QTY ? " disabled" : "") + ">+</button>" +
      "</div>" +
      '<span class="font-medium tabular-nums">' + money(l.qty * p.price) + "</span>" +
      '<button type="button" class="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm text-muted hover:text-danger" data-remove="' + l.id + '" aria-label="Usuń „' + esc(p.title) + '” z koszyka">Usuń</button>' +
      "</div></div></li>"
    );
  };

  var emptyHtml = function () {
    return '<li class="py-10 text-center text-muted">Koszyk jest pusty. <a class="link text-forest" href="sklep.html">Przejdź do sklepu</a></li>';
  };

  var render = function () {
    var n = count();
    // Licznik w nagłówku
    Array.prototype.forEach.call(document.querySelectorAll('header button[aria-label^="Koszyk"]'), function (btn) {
      btn.setAttribute("aria-label", n === 0 ? "Koszyk – pusty" : "Koszyk – " + n + (n === 1 ? " pozycja" : n < 5 ? " pozycje" : " pozycji"));
      var badge = btn.querySelector("span");
      if (badge) {
        badge.textContent = String(n);
        badge.style.display = n ? "" : "none";
      }
    });
    // Przyciski „Kup teraz” / „W koszyku”
    var inCart = !!line(MAIN);
    Array.prototype.forEach.call(document.querySelectorAll("button"), function (btn) {
      var t = (btn.textContent || "").trim();
      if (t === "W koszyku") btn.style.display = inCart ? "" : "none";
    });
    // Szuflada
    if (drawerList) {
      drawerList.innerHTML = cart.length ? cart.map(function (l) { return lineHtml(l, false); }).join("") : emptyHtml();
      var sum = drawer.querySelector(".font-serif.text-2xl.text-forest");
      if (sum) sum.textContent = money(total());
      var go = drawer.querySelector('a[href="koszyk.html"]');
      if (go) go.style.display = cart.length ? "" : "none";
    }
    // Strona koszyka
    if (cartPage) renderCartPage();
  };

  // --- Strona koszyka
  var cartPage = /koszyk\.html$/.test(location.pathname) ? document.querySelector("main form") : null;
  var renderCartPage = function () {
    var list = cartPage.querySelector("#koszyk-pozycje + ul") || cartPage.querySelector("ul");
    if (list) list.innerHTML = cart.length ? cart.map(function (l) { return lineHtml(l, true); }).join("") : emptyHtml();
    var dl = cartPage.querySelector("aside dl");
    if (dl) {
      dl.innerHTML =
        cart
          .map(function (l) {
            var p = PRODUCTS[l.id];
            return '<div class="flex justify-between gap-4"><dt class="text-muted">' + esc(p.title) + (l.qty > 1 ? " × " + l.qty : "") + '</dt><dd class="shrink-0 tabular-nums">' + money(l.qty * p.price) + "</dd></div>";
          })
          .join("") +
        '<div class="flex justify-between gap-4"><dt class="text-muted">Dostawa (plik PDF)</dt><dd>0,00 zł</dd></div>' +
        '<div class="flex items-baseline justify-between gap-4 border-t border-line pt-4"><dt class="font-medium">Do zapłaty</dt><dd class="font-serif text-3xl text-forest tabular-nums">' + money(total()) + "</dd></div>";
    }
    var submit = cartPage.querySelector('button[type="submit"]');
    if (submit) {
      submit.textContent = "Złóż zamówienie demo";
      submit.disabled = !cart.length;
    }
    var note = cartPage.querySelector("aside p.mt-4");
    if (note) note.textContent = "Wersja demonstracyjna: zamówienie nie zostanie zrealizowane, nie przechodzisz do płatności i nic nie jest wysyłane.";
  };

  var fieldError = function (input, msg) {
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    var id = input.id + "-blad";
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("p");
      el.id = id;
      el.className = "mt-1.5 text-sm text-danger";
      (input.closest("label") || input).insertAdjacentElement("afterend", el);
    }
    el.textContent = msg || "";
    var described = (input.getAttribute("aria-describedby") || "").split(" ").filter(function (x) { return x && x !== id; });
    if (msg) described.push(id);
    if (described.length) input.setAttribute("aria-describedby", described.join(" "));
    else input.removeAttribute("aria-describedby");
    return !msg;
  };

  if (cartPage) {
    cartPage.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!cart.length) return;
      var email = document.getElementById("pole-email");
      var confirm = document.getElementById("pole-emailConfirm");
      var terms = document.getElementById("pole-acceptTerms");
      var digital = document.getElementById("pole-digitalConsent");
      var re = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;
      var ok = true;
      var first = null;
      var check = function (input, msg) {
        if (!input) return;
        if (!fieldError(input, msg)) {
          ok = false;
          if (!first) first = input;
        }
      };
      var ev = email ? email.value.trim() : "";
      check(email, !ev ? "Podaj adres e-mail." : !re.test(ev) ? "Sprawdź adres e-mail – powinien wyglądać jak nazwa@domena.pl." : "");
      if (confirm) {
        var conf = document.getElementById("pole-emailConfirm-opis");
        if (conf) conf.textContent = "";
        check(confirm, confirm.value.trim().toLowerCase() !== ev.toLowerCase() ? "Adresy e-mail się różnią." : "");
      }
      check(terms, terms && !terms.checked ? "Zaakceptuj regulaminy, aby złożyć zamówienie." : "");
      check(digital, digital && !digital.checked ? "To oświadczenie jest wymagane przy zakupie treści cyfrowych." : "");
      if (!ok) {
        first.focus();
        announce("Formularz zawiera błędy. Popraw zaznaczone pola.");
        return;
      }
      var number = "NZ-DEMO" + Math.random().toString(36).slice(2, 6).toUpperCase();
      var items = cart.slice();
      var sum = total();
      cart = [];
      save();
      var main = document.querySelector("main");
      main.innerHTML =
        '<section class="container-x pb-20 pt-10 lg:pb-28 lg:pt-14"><div class="mx-auto max-w-2xl bg-cream p-7 ring-1 ring-line sm:p-10" tabindex="-1" id="potwierdzenie">' +
        '<p class="eyebrow">Zamówienie demonstracyjne</p><h1 class="mt-4 text-[clamp(2rem,1.4rem+2vw,3rem)]">Dziękujemy – to było zamówienie demo</h1>' +
        '<p class="mt-4 text-muted">Numer zamówienia demo: <strong class="text-ink">' + number + "</strong></p>" +
        '<dl class="mt-8 space-y-3 border-y border-line py-6">' +
        items.map(function (l) {
          var p = PRODUCTS[l.id];
          return '<div class="flex justify-between gap-4"><dt>' + esc(p.title) + " × " + l.qty + '</dt><dd class="tabular-nums">' + money(l.qty * p.price) + "</dd></div>";
        }).join("") +
        '<div class="flex justify-between gap-4 font-medium"><dt>Razem</dt><dd class="font-serif text-2xl text-forest tabular-nums">' + money(sum) + "</dd></div></dl>" +
        '<p class="mt-6 text-[0.98rem] leading-relaxed">To wersja demonstracyjna sklepu przygotowana przez ComputerIT. <strong>Żadna płatność nie została pobrana</strong>, zamówienie nie zostanie zrealizowane, a podany adres e-mail nie został nigdzie wysłany ani zapisany.</p>' +
        '<div class="mt-8 flex flex-wrap gap-3"><a class="btn btn-primary" href="sklep.html">Wróć do sklepu</a><a class="btn btn-outline" href="index.html">Strona główna</a></div></div></section>';
      var box = document.getElementById("potwierdzenie");
      if (box) box.focus();
      window.scrollTo(0, 0);
    });
  }

  // --- Kliknięcia
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("button") : null;
    if (!t) return;
    if (t.hasAttribute("data-inc")) return setQty(t.getAttribute("data-inc"), line(t.getAttribute("data-inc")).qty + 1);
    if (t.hasAttribute("data-dec")) return setQty(t.getAttribute("data-dec"), line(t.getAttribute("data-dec")).qty - 1);
    if (t.hasAttribute("data-remove")) {
      var p = PRODUCTS[t.getAttribute("data-remove")];
      setQty(t.getAttribute("data-remove"), 0);
      announce("Usunięto „" + p.title + "” z koszyka.");
      return;
    }
    var label = (t.textContent || "").trim().toLowerCase();
    var aria = t.getAttribute("aria-label") || "";
    if (label === "kup teraz" || label.indexOf("dodaj do koszyka") >= 0) {
      e.preventDefault();
      add(MAIN);
      announce("Dodano „" + PRODUCTS[MAIN].title + "” do koszyka.");
      openDrawer();
      return;
    }
    if (label === "w koszyku" || aria.indexOf("Koszyk") === 0) {
      e.preventDefault();
      openDrawer();
    }
  });

  // --- Menu mobilne i powiększanie stron (z oryginalnego podglądu)
  var burger = document.querySelector('button[aria-controls="menu-mobilne"]');
  if (burger) {
    var nav = document.createElement("nav");
    nav.id = "menu-mobilne";
    nav.hidden = true;
    nav.setAttribute("aria-label", "Menu");
    nav.style.cssText = "position:fixed;left:0;right:0;top:4.5rem;bottom:0;z-index:45;background:#fbf8f1;padding:16px max(16px,env(safe-area-inset-left,0px));overflow:auto";
    [["index.html#ebook", "E-book"], ["index.html#w-srodku", "Co w środku"], ["sklep.html", "Sklep"], ["index.html#jak-to-dziala", "Jak to działa"], ["index.html#faq", "FAQ"], ["kontakt.html", "Kontakt"]].forEach(function (l) {
      var a = document.createElement("a");
      a.href = l[0];
      a.textContent = l[1];
      a.style.cssText = "display:block;padding:14px 0;border-bottom:1px solid #ddd3bf;font:24px var(--font-playfair),Georgia,serif;color:#1f3a2b;text-decoration:none";
      a.addEventListener("click", function () { nav.hidden = true; burger.setAttribute("aria-expanded", "false"); });
      nav.appendChild(a);
    });
    document.body.appendChild(nav);
    burger.addEventListener("click", function () {
      nav.hidden = !nav.hidden;
      burger.setAttribute("aria-expanded", String(!nav.hidden));
      burger.setAttribute("aria-label", nav.hidden ? "Otwórz menu" : "Zamknij menu");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !nav.hidden) {
        nav.hidden = true;
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
  }
  var box = document.createElement("div");
  box.hidden = true;
  box.style.cssText = "position:fixed;inset:0;z-index:70;background:rgba(21,42,30,.85);display:flex;align-items:center;justify-content:center;padding:16px";
  box.addEventListener("click", function () { box.hidden = true; });
  var big = document.createElement("img");
  big.alt = "";
  big.style.cssText = "max-height:92vh;max-width:100%;background:#fbf8f1;box-shadow:0 20px 60px rgba(0,0,0,.4)";
  box.appendChild(big);
  document.body.appendChild(box);
  Array.prototype.forEach.call(document.querySelectorAll('button[aria-label^="Powiększ"]'), function (b) {
    b.addEventListener("click", function () {
      var i = b.querySelector("img");
      if (i) {
        big.src = i.getAttribute("src");
        box.hidden = false;
      }
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") box.hidden = true;
  });

  // --- Pozostałe formularze (kontakt, ponowne pobranie) – w demo niczego nie wysyłają
  Array.prototype.forEach.call(document.querySelectorAll("main form"), function (f) {
    if (f === cartPage) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) {
        f.reportValidity();
        return;
      }
      var m = f.querySelector(".preview-msg");
      if (!m) {
        m = document.createElement("p");
        m.className = "preview-msg";
        m.setAttribute("role", "status");
        m.style.cssText = "margin-top:16px;padding:12px 14px;background:#ebe1cf;color:#1f3a2b;font-size:15px;line-height:1.5";
        var btn = f.querySelector("button[type=submit]");
        (btn && btn.parentNode ? btn.parentNode : f).appendChild(m);
      }
      m.textContent = "Wersja demonstracyjna – formularz niczego nie wysyła. Wiadomość nie trafiła do sklepu.";
    });
  });

  window.addEventListener("storage", function (e) {
    if (e.key === KEY) {
      cart = read();
      render();
    }
  });

  render();
})();
