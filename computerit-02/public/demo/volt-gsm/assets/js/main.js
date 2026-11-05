/* =====================================================================
   VOLT GSM — skrypty strony
   Bez zależności. Każdy moduł działa tylko, jeśli jego elementy
   istnieją na stronie (ten sam plik obsługuje podstrony prawne).
   ===================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Miejsca na zdjęcia: placeholder, gdy brak pliku ------------- */
  function initPhotoSlots() {
    document.querySelectorAll(".photo-slot").forEach(function (slot) {
      var img = slot.querySelector("img");
      if (!img) {
        slot.classList.add("is-empty");
        return;
      }
      var markEmpty = function () { slot.classList.add("is-empty"); };
      var markLoaded = function () { slot.classList.remove("is-empty"); };
      if (img.complete) {
        if (img.naturalWidth === 0) markEmpty(); else markLoaded();
      }
      img.addEventListener("error", markEmpty);
      img.addEventListener("load", markLoaded);
    });
  }

  /* --- Nagłówek i menu mobilne ------------------------------------- */
  function initHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;

    var label = toggle.querySelector(".nav-toggle__label");
    var icon = toggle.querySelector("use");
    var mq = window.matchMedia("(max-width: 960px)");

    var setOpen = function (open) {
      if (open) {
        nav.style.setProperty("--nav-top", header.getBoundingClientRect().bottom + "px");
      }
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
      if (label) label.textContent = open ? "Zamknij" : "Menu";
      if (icon) icon.setAttribute("href", open ? "#i-close" : "#i-menu");
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    var onBreakpoint = function () { if (!mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener("change", onBreakpoint);
    else mq.addListener(onBreakpoint);
  }

  /* --- Podświetlenie aktywnej sekcji w menu ------------------------ */
  function initActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (link) {
      var section = document.querySelector(link.getAttribute("href"));
      if (section) map[section.id] = link;
    });

    // Sekcje spoza menu (np. hero) czyszczą podświetlenie
    document.querySelectorAll("main > section[id]").forEach(function (section) {
      if (!map[section.id]) map[section.id] = null;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove("is-active"); l.removeAttribute("aria-current"); });
        var active = map[entry.target.id];
        if (active) {
          active.classList.add("is-active");
          active.setAttribute("aria-current", "location");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(map).forEach(function (id) { observer.observe(document.getElementById(id)); });
  }

  /* --- Subtelne pojawianie się elementów --------------------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* --- Filtr przykładowej oferty ----------------------------------- */
  function initFilter() {
    var buttons = document.querySelectorAll("[data-filter]");
    var products = document.querySelectorAll("[data-products] .product");
    var empty = document.querySelector("[data-products-empty]");
    if (!buttons.length || !products.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        var visible = 0;
        products.forEach(function (p) {
          var show = f === "all" || p.dataset.os === f || p.dataset.type === f;
          p.hidden = !show;
          if (show) visible++;
        });
        if (empty) empty.hidden = visible > 0;
      });
    });
  }

  /* --- Przyciski wypełniające formularz kontaktowy ----------------- */
  function initPrefill() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var subject = form.querySelector("[name='temat']");
    var message = form.querySelector("[name='wiadomosc']");

    document.querySelectorAll("[data-prefill-subject]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var s = trigger.getAttribute("data-prefill-subject");
        var m = trigger.getAttribute("data-prefill-message");
        if (subject && s) subject.value = s;
        if (message && m && !message.value.trim()) message.value = m;
        // Fokus po zakończeniu przewijania do sekcji
        window.setTimeout(function () {
          var target = form.querySelector("[name='imie']");
          if (target) target.focus({ preventScroll: true });
        }, reduceMotion ? 0 : 600);
      });
    });
  }

  /* --- Walidacja i wysyłka formularzy ------------------------------ */
  var ICONS = { demo: "#i-info", success: "#i-check", error: "#i-info" };

  function setStatus(box, state, title, text) {
    if (!box) return;
    box.setAttribute("data-state", state);
    box.innerHTML =
      '<svg class="i" aria-hidden="true"><use href="' + ICONS[state] + '"/></svg>' +
      "<div><strong></strong><span></span></div>";
    box.querySelector("strong").textContent = title;
    box.querySelector("span").textContent = text;
  }

  function clearStatus(box) {
    if (!box) return;
    box.removeAttribute("data-state");
    box.innerHTML = "";
  }

  function errorElFor(field) {
    var id = field.id + "-error";
    return document.getElementById(id);
  }

  function messageFor(field) {
    var v = field.validity;
    if (v.valueMissing) return field.getAttribute("data-msg-required") || "To pole jest wymagane.";
    if (v.typeMismatch) return field.getAttribute("data-msg-type") || "Sprawdź format wpisanej wartości.";
    if (v.patternMismatch) return field.getAttribute("data-msg-pattern") || "Sprawdź format wpisanej wartości.";
    if (v.tooShort) return field.getAttribute("data-msg-short") || "Wpisana wartość jest za krótka.";
    if (v.tooLong) return "Wpisana wartość jest za długa.";
    return "Sprawdź wartość tego pola.";
  }

  function showError(field, errEl, msg) {
    field.setAttribute("aria-invalid", "true");
    if (!errEl) return;
    errEl.textContent = msg;
    errEl.hidden = false;
    var describedBy = (field.getAttribute("aria-describedby") || "").split(" ").filter(Boolean);
    if (describedBy.indexOf(errEl.id) === -1) describedBy.push(errEl.id);
    field.setAttribute("aria-describedby", describedBy.join(" "));
  }

  function hideError(field, errEl) {
    field.removeAttribute("aria-invalid");
    if (!errEl) return;
    errEl.hidden = true;
    errEl.textContent = "";
    var describedBy = (field.getAttribute("aria-describedby") || "").split(" ").filter(function (id) {
      return id && id !== errEl.id;
    });
    if (describedBy.length) field.setAttribute("aria-describedby", describedBy.join(" "));
    else field.removeAttribute("aria-describedby");
  }

  function initForms() {
    document.querySelectorAll("form[data-form]").forEach(function (form) {
      var status = form.querySelector("[data-form-status]");
      var submit = form.querySelector("[type='submit']");
      var touched = false;

      // Pola tekstowe i listy wyboru (bez pól grupy kontaktowej i pułapki)
      var simpleFields = Array.prototype.filter.call(
        form.querySelectorAll("input:not([type='radio']), select, textarea"),
        function (f) { return f.name !== "website" && !f.closest("[data-contact-group]"); }
      );

      // Grupa radio „stan urządzenia”
      var radioGroup = form.querySelector("[data-group='condition']");
      var radios = radioGroup ? radioGroup.querySelectorAll("input[type='radio']") : [];
      var radioError = radioGroup ? radioGroup.querySelector(".field__error") : null;

      // Grupa kontaktowa: wymagany telefon LUB e-mail
      var contactGroup = form.querySelector("[data-contact-group]");
      var contactInputs = contactGroup ? contactGroup.querySelectorAll("input") : [];
      var contactError = contactGroup ? contactGroup.querySelector(".field__error") : null;

      function validateSimple(field) {
        var errEl = errorElFor(field);
        var value = field.value.trim();
        if (field.value !== value && field.tagName !== "SELECT") field.value = value;
        if (field.checkValidity()) { hideError(field, errEl); return true; }
        showError(field, errEl, messageFor(field));
        return false;
      }

      function validateRadios() {
        if (!radioGroup) return true;
        var checked = radioGroup.querySelector("input:checked");
        if (checked) {
          radioGroup.removeAttribute("data-invalid");
          radios[0].removeAttribute("aria-invalid");
          if (radioError) { radioError.hidden = true; radioError.textContent = ""; }
          return true;
        }
        radioGroup.setAttribute("data-invalid", "true");
        if (radioError) {
          radioError.textContent = radios[0].getAttribute("data-msg-required") || "Wybierz jedną z opcji.";
          radioError.hidden = false;
        }
        return false;
      }

      function validateContact() {
        if (!contactGroup) return true;
        var anyFilled = false;
        var firstBad = null;
        var msg = "";
        contactInputs.forEach(function (input) {
          input.value = input.value.trim();
          input.removeAttribute("aria-invalid");
          if (input.value) {
            anyFilled = true;
            if (!input.checkValidity()) {
              input.setAttribute("aria-invalid", "true");
              if (!firstBad) { firstBad = input; msg = messageFor(input); }
            }
          }
        });
        if (!anyFilled) {
          msg = "Podaj numer telefonu lub adres e-mail, abyśmy mogli przesłać wycenę.";
          contactInputs.forEach(function (i) { i.setAttribute("aria-invalid", "true"); });
        }
        var ok = anyFilled && !firstBad;
        if (contactError) {
          contactError.hidden = ok;
          contactError.textContent = ok ? "" : msg;
          contactInputs.forEach(function (i) {
            if (ok) i.removeAttribute("aria-describedby");
            else i.setAttribute("aria-describedby", contactError.id);
          });
        }
        return ok;
      }

      // Walidacja „na żywo” dopiero po pierwszej próbie wysłania
      form.addEventListener("input", function (e) {
        if (!touched) return;
        var t = e.target;
        if (t.type === "radio") validateRadios();
        else if (t.closest("[data-contact-group]")) validateContact();
        else if (simpleFields.indexOf(t) !== -1) validateSimple(t);
      });
      form.addEventListener("change", function (e) {
        if (touched && e.target.type === "radio") validateRadios();
      });
      form.addEventListener("focusout", function (e) {
        var t = e.target;
        if (simpleFields.indexOf(t) !== -1 && t.value.trim() !== "") validateSimple(t);
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        touched = true;
        clearStatus(status);

        var firstInvalid = null;
        simpleFields.forEach(function (f) {
          if (!validateSimple(f) && !firstInvalid) firstInvalid = f;
        });
        // Kolejność fokusu zgodna z kolejnością pól w formularzu
        var radiosOk = validateRadios();
        var contactOk = validateContact();
        var candidates = [];
        if (firstInvalid) candidates.push(firstInvalid);
        if (!radiosOk) candidates.push(radios[0]);
        if (!contactOk) candidates.push(contactInputs[0]);
        candidates.sort(function (a, b) {
          return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });

        if (candidates.length) {
          setStatus(status, "error", "Formularz zawiera błędy.", "Popraw zaznaczone pola i spróbuj ponownie.");
          candidates[0].focus();
          return;
        }

        // Pułapka antyspamowa — wypełniona przez bota: przerwij po cichu
        var hp = form.querySelector("[name='website']");
        if (hp && hp.value) return;

        var endpoint = (form.getAttribute("data-endpoint") || "").trim();

        if (!endpoint) {
          // Brak backendu: NIE udajemy wysyłki
          setStatus(
            status,
            "demo",
            "Tryb demonstracyjny — wiadomość nie została wysłana.",
            "Dane są poprawne, ale formularz nie jest jeszcze połączony z serwerem, więc zgłoszenie nie trafiło do firmy."
          );
          return;
        }

        submit.disabled = true;
        var originalLabel = submit.innerHTML;
        submit.textContent = "Wysyłanie…";

        fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form)
        })
          .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            setStatus(status, "success", "Dziękujemy, wiadomość została wysłana.", "Odpowiemy najszybciej, jak to możliwe, na podany kontakt.");
            form.reset();
            touched = false;
          })
          .catch(function () {
            setStatus(status, "error", "Nie udało się wysłać formularza.", "Sprawdź połączenie z internetem i spróbuj ponownie za chwilę.");
          })
          .then(function () {
            submit.disabled = false;
            submit.innerHTML = originalLabel;
          });
      });
    });
  }

  /* --- Bieżący rok w stopce ---------------------------------------- */
  function initYear() {
    var y = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = y; });
  }

  initPhotoSlots();
  initHeader();
  initActiveNav();
  initReveal();
  initFilter();
  initPrefill();
  initForms();
  initYear();
})();
