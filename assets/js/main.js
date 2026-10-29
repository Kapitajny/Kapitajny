/* ComputerIT — interakcje strony (bez bibliotek). */
(() => {
  "use strict";

  const doc = document.documentElement;
  doc.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- nagłówek */
  const header = document.querySelector("[data-header]");
  const hero = document.querySelector(".hero");
  if (header && hero && "IntersectionObserver" in window) {
    const headerHeight = () => header.offsetHeight;
    const io = new IntersectionObserver(
      ([entry]) => header.classList.toggle("is-on-dark", entry.isIntersecting),
      { rootMargin: `-${headerHeight()}px 0px -100% 0px` },
    );
    io.observe(hero);
  }

  /* ---------------------------------------------------------------- menu mobilne */
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    const label = toggle.querySelector(".menu-toggle__label");
    const setOpen = (open, { focusToggle = false } = {}) => {
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Zamknij" : "Menu";
      menu.hidden = !open;
      document.body.classList.toggle("menu-open", open);
      if (open) menu.querySelector("a")?.focus();
      else if (focusToggle) toggle.focus();
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) setOpen(false, { focusToggle: true });
      // fokus nie wychodzi poza otwarte menu (Tab / Shift+Tab)
      if (e.key === "Tab" && !menu.hidden) {
        const items = [toggle, ...menu.querySelectorAll("a")];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------------------------------------------------------------- aktywna sekcja w menu */
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="/#"]')];
  const sections = navLinks.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          navLinks.forEach((a) =>
            a.hash === `#${entry.target.id}` ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"),
          );
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------------------------------------------------------- filtr portfolio */
  const filters = document.querySelector("[data-filters]");
  const grid = document.querySelector("[data-work-grid]");
  const filterStatus = document.querySelector("[data-filter-status]");
  if (filters && grid) {
    const items = [...grid.children];
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      const value = btn.dataset.filter;
      filters.querySelectorAll("[data-filter]").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      let shown = 0;
      items.forEach((item) => {
        const visible = value === "all" || item.dataset.kind === value;
        item.hidden = !visible;
        if (visible) shown += 1;
      });
      if (filterStatus) {
        filterStatus.textContent = value === "all" ? "" : `Wyświetlono ${shown} z ${items.length} projektów.`;
      }
    });
  }

  /* ---------------------------------------------------------------- przyciski → rodzaj projektu w formularzu */
  const form = document.querySelector("[data-contact-form]");
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-project]");
    if (!link || !form) return;
    const select = form.elements.namedItem("type");
    if (select) select.value = link.dataset.project;
    const message = form.elements.namedItem("message");
    if (link.hasAttribute("data-promo") && message && !message.value.trim()) {
      message.value = "Interesuje mnie pakiet promocyjny „Oferta na start” (800 zł).\n\n";
      message.dispatchEvent(new Event("input"));
    }
  });

  /* ---------------------------------------------------------------- formularz kontaktowy */
  if (form) {
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector("[data-submit]");
    const counter = form.querySelector("[data-counter]");
    const started = form.querySelector("[data-started]");
    if (started) started.value = String(Date.now());

    const fields = {
      name: (v) => {
        const value = v.trim();
        if (!value) return "Podaj swoje imię.";
        if (value.length < 2) return "Imię jest za krótkie.";
        if (value.length > 80) return "Imię może mieć maksymalnie 80 znaków.";
        return "";
      },
      email: (v) => {
        const value = v.trim();
        if (!value) return "Podaj adres e-mail — na niego wyślę odpowiedź.";
        if (value.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Sprawdź adres e-mail — np. jan@firma.pl.";
        return "";
      },
      type: (v) => (v ? "" : "Wybierz rodzaj projektu."),
      message: (v) => {
        const value = v.trim();
        if (!value) return "Opisz krótko swój projekt.";
        if (value.length < 20) return `Opis jest za krótki — dodaj jeszcze ${20 - value.length} znaków.`;
        if (value.length > 4000) return "Opis może mieć maksymalnie 4000 znaków.";
        return "";
      },
      consent: (_, el) => (el.checked ? "" : "Potwierdź zapoznanie się z informacją o przetwarzaniu danych."),
    };

    const setError = (name, message) => {
      const wrapper = form.querySelector(`[data-field="${name}"]`);
      const el = form.elements.namedItem(name);
      if (!wrapper || !el) return;
      wrapper.classList.toggle("is-invalid", Boolean(message));
      el.setAttribute("aria-invalid", message ? "true" : "false");
      const err = wrapper.querySelector("[data-error]");
      if (err) err.textContent = message;
    };
    const validateField = (name) => {
      const el = form.elements.namedItem(name);
      const message = fields[name](el.value ?? "", el);
      setError(name, message);
      return message;
    };

    // Walidacja po opuszczeniu pola, a po pierwszym błędzie – na bieżąco.
    Object.keys(fields).forEach((name) => {
      const el = form.elements.namedItem(name);
      if (!el) return;
      // Puste pole nie jest oznaczane przy samym opuszczeniu (tylko przy wysyłce) – komunikat nie przesuwa
      // układu pod kursorem, gdy użytkownik klika dalej.
      el.addEventListener(name === "consent" || name === "type" ? "change" : "blur", () => {
        if (el.value.trim() === "" && el.getAttribute("aria-invalid") !== "true") return;
        validateField(name);
      });
      el.addEventListener("input", () => {
        if (el.getAttribute("aria-invalid") === "true") validateField(name);
      });
    });
    const message = form.elements.namedItem("message");
    if (message && counter) {
      const update = () => (counter.textContent = String(message.value.length));
      message.addEventListener("input", update);
      update();
    }

    const showStatus = (kind, title, text, { focus = true } = {}) => {
      status.className = `form__status form__status--${kind}`;
      status.innerHTML = "";
      const strong = document.createElement("strong");
      strong.textContent = title;
      status.append(strong, document.createTextNode(text));
      if (!focus) return;
      status.focus({ preventScroll: true });
      status.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "";
      const errors = Object.keys(fields).filter((name) => validateField(name));
      if (errors.length) {
        showStatus("error", "Formularz zawiera błędy.", ` Popraw ${errors.length === 1 ? "zaznaczone pole" : `zaznaczone pola (${errors.length})`} i wyślij ponownie.`, { focus: false });
        form.elements.namedItem(errors[0])?.focus();
        return;
      }

      // Hosting statyczny (np. GitHub Pages) – bez serwera PHP formularz przygotowuje gotowy e-mail.
      const mailto = form.dataset.mailto;
      if (mailto) {
        const pick = (n) => form.elements.namedItem(n);
        const label = (n) => pick(n).selectedOptions?.[0]?.textContent.trim() ?? "";
        const name = pick("name").value.trim();
        const subject = `Zapytanie ze strony ComputerIT: ${label("type")} — ${name}`;
        const body = [
          `Imię: ${name}`,
          `E-mail: ${pick("email").value.trim()}`,
          `Rodzaj projektu: ${label("type")}`,
          `Orientacyjny budżet: ${label("budget")}`,
          "",
          pick("message").value.trim().slice(0, 1800),
        ].join("\n");
        window.location.href = `mailto:${mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        showStatus("info", "Otwieram aplikację pocztową z gotową wiadomością.", ` Sprawdź treść i kliknij w niej „Wyślij”. Jeśli aplikacja się nie otworzyła, napisz bezpośrednio na adres ${mailto}.`);
        return;
      }

      submit.setAttribute("aria-busy", "true");
      submit.querySelector(".btn__label").textContent = "Wysyłanie…";
      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        let data = null;
        try { data = await res.json(); } catch { /* odpowiedź nie-JSON, np. hosting bez PHP */ }

        if (res.ok && data?.ok) {
          form.reset();
          if (counter) counter.textContent = "0";
          if (started) started.value = String(Date.now());
          Object.keys(fields).forEach((name) => setError(name, ""));
          showStatus("success", "Dziękuję, wiadomość została wysłana.", " Odpowiem na podany adres e-mail najszybciej, jak to możliwe.");
        } else if (data?.code === "not_configured") {
          showStatus("info", "Formularz nie jest jeszcze aktywny.", " Wiadomość NIE została wysłana — wysyłka e-maili nie została skonfigurowana na serwerze. Skorzystaj proszę z innej formy kontaktu.");
        } else if (data?.errors) {
          Object.entries(data.errors).forEach(([name, msg]) => setError(name, String(msg)));
          showStatus("error", "Nie udało się wysłać wiadomości.", ` ${data.message ?? "Popraw zaznaczone pola."}`);
        } else {
          showStatus("error", "Nie udało się wysłać wiadomości.", ` ${data?.message ?? "Serwer nie przyjął formularza. Spróbuj ponownie za chwilę."}`);
        }
      } catch {
        showStatus("error", "Brak połączenia.", " Sprawdź połączenie z internetem i spróbuj ponownie. Wiadomość nie została wysłana.");
      } finally {
        submit.removeAttribute("aria-busy");
        submit.querySelector(".btn__label").textContent = "Wyślij wiadomość";
      }
    });
  }

  /* ---------------------------------------------------------------- pojawianie się przy przewijaniu */
  if (!reduceMotion && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(".section-head, .offer__row, .work, .price-card, .process__step, .about__portrait, .about__body, .form");
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => {
      // elementy już widoczne przy wczytaniu nie są ukrywane
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.setAttribute("data-reveal", "");
      reveal.observe(el);
    });
  }
})();
