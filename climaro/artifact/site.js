/* CLIMARO – zachowanie strony w wersji statycznej (artefakt). Zastępuje logikę komponentów React:
   menu mobilne, pasek akcji na telefonach i walidację formularza kontaktowego. */
(function () {
  "use strict";
  document.documentElement.lang = "pl";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu mobilne (<dialog>) ---------- */
  var menuButton = document.querySelector('button[aria-controls="menu-mobilne"]');
  var dialog = document.getElementById("menu-mobilne");
  if (menuButton && dialog) {
    var closeTimer;
    var openMenu = function () {
      clearTimeout(closeTimer);
      dialog.removeAttribute("data-closing");
      dialog.showModal();
      menuButton.setAttribute("aria-expanded", "true");
    };
    var closeMenu = function () {
      if (!dialog.open) return;
      menuButton.setAttribute("aria-expanded", "false");
      if (reduceMotion) {
        dialog.close();
        return;
      }
      dialog.setAttribute("data-closing", "true");
      closeTimer = setTimeout(function () {
        dialog.close();
        dialog.removeAttribute("data-closing");
      }, 200);
    };
    menuButton.addEventListener("click", openMenu);
    dialog.addEventListener("cancel", function (event) {
      event.preventDefault();
      closeMenu();
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeMenu();
    });
    dialog.querySelectorAll("button").forEach(function (button) {
      button.addEventListener("click", closeMenu);
    });
    dialog.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Pasek akcji na telefonach ---------- */
  var bar = document.querySelector("[data-action-bar]");
  if (bar) {
    var updateBar = function () {
      var visible = window.scrollY > window.innerHeight * 0.6;
      if (visible) {
        bar.setAttribute("data-visible", "true");
        bar.removeAttribute("inert");
      } else {
        bar.removeAttribute("data-visible");
        bar.setAttribute("inert", "");
      }
    };
    updateBar();
    window.addEventListener("scroll", updateBar, { passive: true });
    window.addEventListener("resize", updateBar);
  }

  /* ---------- Formularz kontaktowy ---------- */
  var form = document.querySelector('form[aria-labelledby="formularz-tytul"]');
  if (!form) return;

  // Klasy modułu CSS mają wspólny prefiks (np. „ab12cd_”) – odczytujemy go z klasy formularza.
  var prefix = (form.className.match(/(\S*?)form\b/) || ["", ""])[1];
  var cls = function (name) {
    return prefix + name;
  };

  var PHONE = "+48 517 734 221";
  var PHONE_HREF = "tel:+48517734221";
  var EMAIL = "biuro@climaro.pl";
  var order = ["name", "phone", "email", "service", "message", "consent"];
  var labels = {
    name: "Imię i nazwisko",
    phone: "Numer telefonu",
    email: "Adres e-mail",
    service: "Interesująca Cię usługa",
    message: "Opis zapytania",
    consent: "Zgoda na przetwarzanie danych",
  };
  var field = function (name) {
    return document.getElementById("pole-" + name);
  };

  var validate = function (name) {
    var el = field(name);
    var value = name === "consent" ? el.checked : el.value;
    switch (name) {
      case "name":
        return value.trim().length < 3 ? "Wpisz imię i nazwisko." : "";
      case "phone": {
        var digits = value.replace(/[\s().-]/g, "");
        if (!digits) return "Wpisz numer telefonu.";
        return /^(\+48|0048|48)?\d{9}$/.test(digits) ? "" : "Wpisz 9-cyfrowy numer telefonu, np. 517 734 221.";
      }
      case "email":
        if (!value.trim()) return "Wpisz adres e-mail.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? "" : "Wpisz adres e-mail w formacie nazwa@domena.pl.";
      case "service":
        return value ? "" : "Wybierz usługę, której dotyczy zapytanie.";
      case "message":
        return value.trim().length < 20 ? "Opisz zapytanie w kilku zdaniach (co najmniej 20 znaków)." : "";
      case "consent":
        return value ? "" : "Zaznacz zgodę, abyśmy mogli odpowiedzieć na zapytanie.";
    }
    return "";
  };

  var errorAnchor = function (name) {
    var el = field(name);
    if (name === "service") return el.parentElement; // pole wyboru siedzi w opakowaniu ze strzałką
    if (name === "consent") return el.parentElement.lastElementChild;
    return el;
  };

  var describedBy = function (name, hasError) {
    var ids = [];
    if (hasError) ids.push("blad-" + name);
    if (name === "message") ids.push("pomoc-message");
    return ids.join(" ");
  };

  var showError = function (name, message) {
    var el = field(name);
    var existing = document.getElementById("blad-" + name);
    if (!message) {
      if (existing) existing.remove();
      el.removeAttribute("aria-invalid");
      var rest = describedBy(name, false);
      if (rest) el.setAttribute("aria-describedby", rest);
      else el.removeAttribute("aria-describedby");
      return;
    }
    if (!existing) {
      existing = document.createElement("p");
      existing.id = "blad-" + name;
      existing.className = cls("error");
      var anchor = errorAnchor(name);
      if (name === "consent") anchor.parentElement.appendChild(existing);
      else anchor.insertAdjacentElement("afterend", existing);
    }
    existing.textContent = message;
    el.setAttribute("aria-invalid", "true");
    el.setAttribute("aria-describedby", describedBy(name, true));
  };

  var touched = {};
  order.forEach(function (name) {
    var el = field(name);
    el.addEventListener("blur", function () {
      touched[name] = true;
      showError(name, validate(name));
    });
    el.addEventListener(name === "consent" || name === "service" ? "change" : "input", function () {
      removeStatus();
      if (touched[name] || document.getElementById("blad-" + name)) showError(name, validate(name));
    });
  });

  // Usługa przekazana z cennika: kontakt.html#usluga-klimatyzacja
  var hashMatch = location.hash.match(/^#usluga-([a-z-]+)$/);
  if (hashMatch) {
    var select = field("service");
    if (Array.prototype.some.call(select.options, function (o) { return o.value === hashMatch[1]; })) select.value = hashMatch[1];
  }

  var summary;
  var status;
  var removeStatus = function () {
    if (status) {
      status.remove();
      status = null;
    }
  };

  var plural = function (n) {
    var rule = new Intl.PluralRules("pl-PL").select(n);
    return rule === "one" ? "pole" : rule === "few" ? "pola" : "pól";
  };

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var invalid = [];
    order.forEach(function (name) {
      touched[name] = true;
      var message = validate(name);
      showError(name, message);
      if (message) invalid.push({ name: name, message: message });
    });

    if (summary) {
      summary.remove();
      summary = null;
    }
    removeStatus();

    if (invalid.length) {
      summary = document.createElement("div");
      summary.className = cls("summary");
      summary.setAttribute("role", "alert");
      summary.setAttribute("tabindex", "-1");
      summary.setAttribute("aria-labelledby", "podsumowanie-bledow");
      var h = document.createElement("h3");
      h.id = "podsumowanie-bledow";
      h.textContent = "Popraw " + invalid.length + " " + plural(invalid.length) + " formularza";
      var ul = document.createElement("ul");
      invalid.forEach(function (item) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#pole-" + item.name;
        a.textContent = labels[item.name] + ": " + item.message;
        li.appendChild(a);
        ul.appendChild(li);
      });
      summary.appendChild(h);
      summary.appendChild(ul);
      var required = form.querySelector("." + cls("required"));
      (required || form.firstElementChild).insertAdjacentElement("afterend", summary);
      summary.focus();
      return;
    }

    var serviceSelect = field("service");
    var serviceLabel = serviceSelect.options[serviceSelect.selectedIndex].text;
    var body =
      field("message").value.trim() + "\n\n" + field("name").value.trim() + "\ntel. " + field("phone").value.trim() + "\n" + field("email").value.trim();
    var mailto = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Zapytanie: " + serviceLabel) + "&body=" + encodeURIComponent(body);

    status = document.createElement("div");
    status.className = cls("status");
    status.setAttribute("role", "status");
    status.setAttribute("tabindex", "-1");
    status.innerHTML =
      "<h3>Twoje zapytanie jest gotowe do wysłania</h3>" +
      "<p>Dane są poprawne. Ta strona jest demonstracyjna i nie wysyła wiadomości sama – wyślij ją z własnej poczty albo zadzwoń.</p>" +
      '<div class="' + cls("statusActions") + '">' +
      '<a class="btn btn-primary btn-small" href="' + mailto + '">Wyślij e-mailem</a>' +
      '<a class="btn btn-secondary btn-small" href="' + PHONE_HREF + '"><span class="num">Zadzwoń: ' + PHONE + "</span></a>" +
      "</div>" +
      '<p class="' + cls("statusSmall") + '">Wiadomość e-mail zawiera już Twój opis i dane kontaktowe. Dopóki jej nie wyślesz, dane nigdzie nie trafiają. ' +
      "Jeśli link e-mail się nie otworzy, napisz na " + EMAIL + " lub zadzwoń: " + PHONE + ".</p>";
    form.appendChild(status);
    status.focus();
  });
})();
