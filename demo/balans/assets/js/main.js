/* ==========================================================================
   BALANS — skrypty strony
   - nagłówek i menu mobilne
   - podświetlanie aktywnej sekcji w menu
   - subtelne animacje pojawiania się
   - formularz zapytania (walidacja + tryb demonstracyjny / integracja z API)
   Formularz NIE zapisuje danych w localStorage, sessionStorage ani cookies.
   ========================================================================== */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var nav = document.getElementById("nawigacja");
  var toggle = document.querySelector(".nav-toggle");
  var mobileQuery = window.matchMedia("(max-width: 1080px)");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Nagłówek: obramowanie po przewinięciu ---------- */
  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Menu mobilne ---------- */
  var outsideElements = Array.prototype.slice.call(
    document.querySelectorAll(".demo-bar, main, .wave, .site-footer, .skip-link")
  );

  function setOutsideInert(state) {
    outsideElements.forEach(function (el) {
      if (state) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
  }

  function openMenu() {
    if (!nav || !toggle) return;
    var bottom = header.getBoundingClientRect().bottom;
    nav.style.setProperty("--nav-top", Math.max(0, bottom) + "px");
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.querySelector(".nav-toggle__label").textContent = "Zamknij";
    document.body.classList.add("is-locked");
    setOutsideInert(true);
    var first = nav.querySelector("a");
    if (first) first.focus();
  }

  function closeMenu(returnFocus) {
    if (!nav || !toggle || !nav.classList.contains("is-open")) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.querySelector(".nav-toggle__label").textContent = "Menu";
    document.body.classList.remove("is-locked");
    setOutsideInert(false);
    if (returnFocus) toggle.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) closeMenu(false);
      else openMenu();
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        closeMenu(true);
        return;
      }
      // Pułapka fokusu: przycisk menu + linki w panelu
      if (e.key === "Tab") {
        var focusables = [toggle].concat(Array.prototype.slice.call(nav.querySelectorAll("a")));
        var firstEl = focusables[0];
        var lastEl = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    });

    var onBreakpointChange = function (e) {
      if (!e.matches) closeMenu(false);
    };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", onBreakpointChange);
    else mobileQuery.addListener(onBreakpointChange);
  }

  /* ---------- Aktywna sekcja w menu (tylko na stronie głównej) ---------- */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('.nav__link[href^="#"]')) : [];
  if (navLinks.length && "IntersectionObserver" in window) {
    var linkById = {};
    navLinks.forEach(function (link) {
      linkById[link.getAttribute("href").slice(1)] = link;
    });
    // Sekcje bez własnej pozycji w menu przypisujemy do najbliższej pozycji
    var sectionMap = {
      start: "start", oferta: "start", "pierwszy-kontakt": "start",
      "o-nas": "o-nas", specjalisci: "specjalisci", cennik: "cennik",
      historia: "historia", faq: "historia", rejestracja: "kontakt", kontakt: "kontakt"
    };
    var visible = {};
    var setActive = function (id) {
      navLinks.forEach(function (link) { link.removeAttribute("aria-current"); });
      if (id && linkById[id]) linkById[id].setAttribute("aria-current", "true");
    };
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });
      var current = null;
      Object.keys(sectionMap).forEach(function (id) {
        if (visible[id] && current === null) current = sectionMap[id];
      });
      if (current) setActive(current);
    }, { rootMargin: "-35% 0px -60% 0px" });
    Object.keys(sectionMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- Animacje pojawiania się ---------- */
  // Animujemy wyłącznie elementy leżące poniżej pierwszego ekranu w chwili załadowania.
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    var reveal = function (el) {
      el.classList.add("is-revealing");
      el.classList.remove("is-pending");
    };
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // Pokazujemy też elementy, które zostały już przewinięte (np. po skoku do kotwicy)
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          reveal(entry.target);
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    Array.prototype.forEach.call(revealEls, function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("is-pending");
        revealer.observe(el);
      }
    });
  }

  /* ---------- Formularz zapytania ---------- */
  var form = document.getElementById("booking-form");
  if (!form) return;

  var statusBox = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');
  var contactInput = form.elements.contact;
  var contactLabel = document.getElementById("f-contact-label");
  var contactHint = document.getElementById("f-contact-hint");
  var dateInput = form.elements.preferredDate;
  var attempted = false;

  // Najwcześniejsza data = dzisiaj, najpóźniejsza = za rok
  function toISODate(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }
  var today = new Date();
  var maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
  if (dateInput) {
    dateInput.min = toISODate(today);
    dateInput.max = toISODate(maxDate);
  }

  // Zmiana pola kontaktowego zależnie od wybranego sposobu kontaktu
  function syncContactField() {
    var method = form.elements.contactMethod.value;
    if (method === "email") {
      contactLabel.textContent = "Adres e-mail";
      contactInput.type = "email";
      contactInput.autocomplete = "email";
      contactInput.inputMode = "email";
      contactHint.textContent = "Na ten adres rejestracja odpisze z propozycją terminu.";
    } else {
      contactLabel.textContent = "Numer telefonu";
      contactInput.type = "tel";
      contactInput.autocomplete = "tel";
      contactInput.inputMode = "tel";
      contactHint.textContent = "Na ten numer rejestracja oddzwoni z propozycją terminu.";
    }
    if (attempted && contactInput.value) validateField("contact");
  }
  Array.prototype.forEach.call(form.elements.contactMethod, function (radio) {
    radio.addEventListener("change", syncContactField);
  });

  // Wstępny wybór specjalisty / usługi z przycisków na stronie
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-specialist], [data-service]");
    if (!trigger) return;
    var specialist = trigger.getAttribute("data-specialist");
    var service = trigger.getAttribute("data-service");
    if (specialist) {
      form.elements.specialist.value = specialist;
      // Dopasowanie rodzaju wizyty do profilu, jeśli wybrany rodzaj nie pasuje
      var current = form.elements.service.value;
      var isPsychiatrist = specialist === "anna-zielinska" || specialist === "michal-lewandowski";
      if (current && (current.indexOf("psychiatria") === 0) !== isPsychiatrist) form.elements.service.value = "";
    }
    if (service) {
      form.elements.service.value = service;
      var spec = form.elements.specialist.value;
      var wantsPsychiatry = service.indexOf("psychiatria") === 0;
      var specIsPsychiatrist = spec === "anna-zielinska" || spec === "michal-lewandowski";
      if (spec !== "pomoc-w-wyborze" && wantsPsychiatry !== specIsPsychiatrist) {
        form.elements.specialist.value = "pomoc-w-wyborze";
      }
    }
    // Po przewinięciu przenosimy fokus do pierwszego pola (bez dodatkowego skoku strony)
    window.setTimeout(function () {
      form.elements.name.focus({ preventScroll: true });
    }, reducedMotion.matches ? 0 : 600);
  });

  var messages = {
    nameRequired: "Podaj swoje imię.",
    nameInvalid: "Imię może zawierać litery, spację, apostrof i łącznik (2–60 znaków).",
    phoneRequired: "Podaj numer telefonu.",
    phoneInvalid: "Wpisz poprawny numer telefonu, np. 600 000 000 lub +48 600 000 000.",
    emailRequired: "Podaj adres e-mail.",
    emailInvalid: "Wpisz poprawny adres e-mail, np. imie@domena.pl.",
    dateInvalid: "Wybierz datę od dziś do roku naprzód.",
    consent: "Potwierdź zapoznanie się z polityką prywatności."
  };

  var validators = {
    name: function () {
      var v = form.elements.name.value.trim();
      if (!v) return messages.nameRequired;
      if (!/^[\p{L}][\p{L}\s'’-]{1,59}$/u.test(v)) return messages.nameInvalid;
      return "";
    },
    contact: function () {
      var v = contactInput.value.trim();
      if (form.elements.contactMethod.value === "email") {
        if (!v) return messages.emailRequired;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return messages.emailInvalid;
        return "";
      }
      if (!v) return messages.phoneRequired;
      var digits = v.replace(/[\s().-]/g, "");
      if (!/^\+?\d{9,15}$/.test(digits)) return messages.phoneInvalid;
      return "";
    },
    preferredDate: function () {
      var v = dateInput.value;
      if (!v) {
        // Pole wypełnione częściowo w przeglądarce = niepoprawna wartość
        return dateInput.validity && dateInput.validity.badInput ? messages.dateInvalid : "";
      }
      if (v < dateInput.min || v > dateInput.max) return messages.dateInvalid;
      return "";
    },
    consent: function () {
      return form.elements.consent.checked ? "" : messages.consent;
    }
  };

  var errorIds = {
    name: "f-name-error",
    contact: "f-contact-error",
    preferredDate: "f-date-error",
    consent: "f-consent-error"
  };

  function validateField(name) {
    var message = validators[name]();
    var field = form.elements[name];
    var errorEl = document.getElementById(errorIds[name]);
    if (errorEl) errorEl.textContent = message;
    if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
    return message;
  }

  Object.keys(validators).forEach(function (name) {
    var field = form.elements[name];
    if (!field) return;
    var evt = field.type === "checkbox" || field.type === "date" ? "change" : "blur";
    field.addEventListener(evt, function () {
      if (attempted || field.value) validateField(name);
    });
    field.addEventListener("input", function () {
      if (field.getAttribute("aria-invalid") === "true") validateField(name);
    });
  });

  function showStatus(type, title, body) {
    statusBox.className = "form-status form-status--" + type;
    statusBox.innerHTML = "";
    var h = document.createElement("h4");
    h.textContent = title;
    statusBox.appendChild(h);
    if (Array.isArray(body)) {
      var ul = document.createElement("ul");
      body.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      statusBox.appendChild(ul);
    } else if (body) {
      var p = document.createElement("p");
      p.textContent = body;
      statusBox.appendChild(p);
    }
  }

  function clearStatus() {
    statusBox.className = "form-status";
    statusBox.innerHTML = "";
  }

  function resetForm() {
    form.reset();
    attempted = false;
    syncContactField();
    Object.keys(errorIds).forEach(function (name) {
      document.getElementById(errorIds[name]).textContent = "";
      if (form.elements[name]) form.elements[name].removeAttribute("aria-invalid");
    });
  }

  function collectPayload() {
    return {
      name: form.elements.name.value.trim(),
      contactMethod: form.elements.contactMethod.value,
      contact: contactInput.value.trim(),
      specialist: form.elements.specialist.value,
      service: form.elements.service.value,
      preferredDate: dateInput.value,
      preferredTime: form.elements.preferredTime.value
    };
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    attempted = true;
    clearStatus();

    var errors = [];
    var firstInvalid = null;
    Object.keys(validators).forEach(function (name) {
      var msg = validateField(name);
      if (msg) {
        errors.push(msg);
        if (!firstInvalid) firstInvalid = form.elements[name];
      }
    });

    if (errors.length) {
      showStatus("error", "Sprawdź formularz (" + errors.length + ")", errors);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Pole-pułapka na boty: jeśli wypełnione, kończymy bez wysyłki
    if (form.elements.website.value) {
      resetForm();
      return;
    }

    var endpoint = (form.getAttribute("data-endpoint") || "").trim();

    if (!endpoint) {
      // Tryb demonstracyjny: nic nie jest wysyłane ani zapisywane
      resetForm();
      showStatus(
        "info",
        "Formularz demonstracyjny — zapytanie nie zostało wysłane",
        "To wersja pokazowa strony. Dane nie zostały nigdzie przesłane ani zapisane, a termin wizyty nie został zarezerwowany. Formularz został wyczyszczony."
      );
      statusBox.focus();
      return;
    }

    // Tryb produkcyjny: wysyłka do backendu
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Wysyłanie…";

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(collectPayload())
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        resetForm();
        showStatus(
          "success",
          "Dziękujemy, zapytanie zostało wysłane",
          "Rejestracja skontaktuje się z Tobą w godzinach pracy. Wysłanie zapytania nie oznacza rezerwacji — termin wizyty potwierdza rejestracja."
        );
      })
      .catch(function () {
        showStatus(
          "error",
          "Nie udało się wysłać zapytania",
          "Spróbuj ponownie za chwilę lub skontaktuj się z rejestracją telefonicznie albo mailowo."
        );
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
        submitBtn.textContent = originalLabel;
        statusBox.focus();
      });
  });
})();
