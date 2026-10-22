(() => {
  "use strict";

  const main = document.getElementById("tresc");
  const templates = new Map([...document.querySelectorAll("template[data-route]")].map((t) => [t.dataset.route, t]));
  const LAYER_ORDER = ["ludzie", "urzadzenia", "siec", "dane"];

  // ---------------------------------------------------------------- router
  // Trasa ma postać "/sciezka?zapytanie#kotwica". Podgląd działa w ramce, która nie zawsze
  // pozwala zmieniać adres, dlatego bieżąca trasa jest trzymana w zmiennej, a hash służy
  // tylko do obsługi przycisku „wstecz”, jeśli przeglądarka na to pozwala.
  function parseRoute(route) {
    const [beforeAnchor, anchor = ""] = route.split("#");
    const [rawPath, query = ""] = beforeAnchor.split("?");
    const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : "/";
    return { path: templates.has(path) ? path : "/404", query: new URLSearchParams(query), anchor };
  }

  function routeFromLocation() {
    let hash = "";
    try {
      hash = location.hash;
    } catch {
      // brak dostępu do adresu – zostaje strona główna
    }
    return hash.startsWith("#/") ? hash.slice(1) : "/";
  }

  let currentRoute = null;
  let firstRender = true;
  function render(route) {
    const { path, query, anchor } = parseRoute(route);
    const template = templates.get(path) ?? templates.get("/");
    currentRoute = route;
    closeMenu(false);
    main.replaceChildren(template.content.cloneNode(true));
    document.title = template.dataset.title || "Rygiel";
    updateNav(path);
    initForm(query);
    const target = anchor && document.getElementById(decodeURIComponent(anchor));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
    if (!firstRender) main.focus({ preventScroll: true });
    firstRender = false;
  }

  function navigate(route) {
    render(route);
    try {
      history.pushState(null, "", "#" + route);
    } catch {
      // ramka nie pozwala zmienić adresu – nawigacja i tak działa
    }
  }

  function updateNav(path) {
    document.querySelectorAll('header a[href^="#/"]').forEach((link) => {
      const href = parseRoute(link.getAttribute("href").slice(1)).path;
      const isPage = href === path;
      const isSection = href !== "/" && path.startsWith(href + "/");
      if (link.closest("nav")) {
        if (isPage) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
        if (isPage || isSection) link.setAttribute("data-active", "");
        else link.removeAttribute("data-active");
      }
    });
  }

  const onLocationChange = () => {
    const route = routeFromLocation();
    if (route !== currentRoute) render(route);
  };
  window.addEventListener("popstate", onLocationChange);
  window.addEventListener("hashchange", onLocationChange);

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href^='#']");
    if (!link) return;
    const href = link.getAttribute("href");
    // Linki do podstron (#/sciezka) obsługuje router.
    if (href.startsWith("#/")) {
      event.preventDefault();
      navigate(href.slice(1));
      return;
    }
    // Kotwice wewnątrz strony (#sekcja) przewijają widok zamiast zmieniać podstronę.
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!target) return;
    event.preventDefault();
    closeMenu(false);
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    if (target === main || target.tabIndex >= 0 || /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(target.tagName)) target.focus({ preventScroll: true });
  });

  // ----------------------------------------------------------- mobile menu
  const menuToggle = document.querySelector("header button[aria-controls]");
  const menuPanel = menuToggle && document.getElementById(menuToggle.getAttribute("aria-controls"));

  function setMenu(open) {
    if (!menuToggle || !menuPanel) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuPanel.hidden = !open;
    const label = menuToggle.querySelector("span");
    if (label) label.textContent = open ? "Zamknij" : "Menu";
    const bars = menuToggle.querySelector("span[aria-hidden]");
    if (bars) bars.toggleAttribute("data-open", open);
    for (const el of [main, document.getElementById("stopka")]) if (el) el.inert = open;
    if (open) document.body.dataset.scrollLocked = "";
    else delete document.body.dataset.scrollLocked;
  }

  function closeMenu(returnFocus) {
    if (menuToggle?.getAttribute("aria-expanded") !== "true") return;
    setMenu(false);
    if (returnFocus) menuToggle.focus();
  }

  menuToggle?.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
  menuPanel?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(true);
  });
  matchMedia("(min-width: 60.0625rem)").addEventListener("change", (event) => {
    if (event.matches) closeMenu(false);
  });

  // ------------------------------------------------------- delegated clicks
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    // Akordeon FAQ: przycisk w nagłówku sterujący panelem
    const heading = button.closest("h2, h3, h4");
    if (heading && button.hasAttribute("aria-controls")) {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      heading.parentElement.toggleAttribute("data-open", open);
      return;
    }

    // Przekrój infrastruktury w nagłówku strony głównej
    const figure = button.closest("figure[data-pillars]");
    if (figure && button.hasAttribute("aria-pressed")) {
      selectPillar(figure, button);
      return;
    }

    // Filtry realizacji i bazy wiedzy
    const root = button.closest("[data-case-index], [data-article-index]");
    if (root) {
      if (button.hasAttribute("data-filter-reset")) {
        root.querySelectorAll("[data-filter-key]").forEach((group) => setFilter(root, group.dataset.filterKey, "all"));
        applyFilters(root);
        return;
      }
      const group = button.closest("[data-filter-key]");
      if (group && button.dataset.value) {
        setFilter(root, group.dataset.filterKey, button.dataset.value);
        applyFilters(root);
      }
    }
  });

  function selectPillar(figure, button) {
    const pillars = JSON.parse(figure.dataset.pillars);
    const buttons = [...figure.querySelectorAll("button[aria-pressed]")];
    const pillar = pillars[buttons.indexOf(button)];
    if (!pillar) return;
    const descriptionId = buttons.map((b) => b.getAttribute("aria-describedby")).find(Boolean);
    buttons.forEach((b) => {
      b.setAttribute("aria-pressed", String(b === button));
      if (b === button && descriptionId) b.setAttribute("aria-describedby", descriptionId);
      else b.removeAttribute("aria-describedby");
    });

    const items = [...figure.querySelectorAll("ol > li")];
    const active = [];
    items.forEach((item, index) => {
      const note = pillar.layers[LAYER_ORDER[index]];
      item.toggleAttribute("data-active", Boolean(note));
      const p = item.querySelector("p");
      if (!p) return;
      p.replaceChildren();
      const hidden = document.createElement("span");
      hidden.className = "visually-hidden";
      if (note) {
        active.push(index);
        hidden.textContent = `${pillar.name} obejmuje: `;
        p.append(hidden, note);
      } else {
        hidden.textContent = `Poza zakresem usługi ${pillar.name}`;
        const empty = document.createElement("span");
        empty.style.cssText = "display:block;min-height:1em";
        empty.append(hidden);
        p.append(empty);
      }
    });

    const frame = figure.querySelector("[data-pillar]");
    if (frame && active.length) {
      frame.dataset.pillar = pillar.slug;
      frame.style.setProperty("--span-start", String(active[0]));
      frame.style.setProperty("--span-end", String(active[active.length - 1] + 1));
      const label = frame.querySelector("[aria-hidden] > span");
      if (label) label.textContent = pillar.name;
    }

    const description = descriptionId && document.getElementById(descriptionId);
    if (description) {
      const link = document.createElement("a");
      link.className = "text-link";
      link.href = "#" + pillar.href;
      link.textContent = `Szczegóły: ${pillar.name}`;
      description.replaceChildren(pillar.summary + " ", link);
    }
  }

  function setFilter(root, key, value) {
    root.dataset[`filter_${key}`] = value;
    const group = root.querySelector(`[data-filter-key="${key}"]`);
    group?.querySelectorAll("button[data-value]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.value === value)));
  }

  function plural(count) {
    if (count === 1) return "1 realizacja";
    const last = count % 10;
    const lastTwo = count % 100;
    return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? `${count} realizacje` : `${count} realizacji`;
  }

  function applyFilters(root) {
    const keys = [...root.querySelectorAll("[data-filter-key]")].map((group) => group.dataset.filterKey);
    const items = [...root.querySelectorAll("li[data-area], li[data-category]")];
    let visible = 0;
    for (const item of items) {
      const match = keys.every((key) => {
        const value = root.dataset[`filter_${key}`] ?? "all";
        return value === "all" || item.dataset[key] === value;
      });
      item.hidden = !match;
      if (match) visible += 1;
    }
    const filtered = keys.some((key) => (root.dataset[`filter_${key}`] ?? "all") !== "all");
    const list = items[0]?.parentElement;
    if (list) list.hidden = visible === 0;
    const empty = root.querySelector("[data-filter-empty]");
    if (empty) empty.hidden = visible > 0;
    root.querySelectorAll("[data-filter-reset]").forEach((b) => {
      if (!b.closest("[data-filter-empty]")) b.hidden = !filtered;
    });

    const status = root.querySelector('[role="status"]');
    if (!status) return;
    if (root.hasAttribute("data-case-index")) {
      status.textContent = filtered ? `Pasujące: ${plural(visible)} z ${items.length}` : `Wszystkie realizacje: ${items.length}`;
    } else {
      const value = root.dataset.filter_category ?? "all";
      const label = root.querySelector(`button[data-value="${value}"]`)?.textContent.trim();
      status.textContent = value === "all" ? `Wszystkie artykuły: ${items.length}` : `Artykuły w kategorii „${label}”: ${visible}`;
    }
  }

  // ------------------------------------------------------------------ form
  const LIMITS = { name: [2, 80], company: 120, message: [20, 3000] };
  const EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[a-z]{2,}$/i;
  const LABELS = {
    name: "Imię",
    email: "Służbowy adres e-mail",
    company: "Nazwa firmy",
    service: "Interesująca usługa",
    message: "Opis problemu lub potrzeby",
    consent: "Zgoda",
  };

  function validate(form, name) {
    const field = form.elements[name];
    if (!field) return undefined;
    const value = field.type === "checkbox" ? field.checked : field.value.trim();
    switch (name) {
      case "name":
        if (!value) return "Podaj imię, żebyśmy wiedzieli, jak się do Ciebie zwracać.";
        if (value.length < LIMITS.name[0]) return "Imię powinno mieć co najmniej 2 znaki.";
        return value.length > LIMITS.name[1] ? "Imię może mieć najwyżej 80 znaków." : undefined;
      case "email":
        if (!value) return "Podaj adres e-mail, na który mamy odpowiedzieć.";
        return value.length > 254 || !EMAIL.test(value) ? "Sprawdź adres e-mail – powinien mieć postać nazwa@firma.pl." : undefined;
      case "company":
        return value.length > LIMITS.company ? "Nazwa firmy może mieć najwyżej 120 znaków." : undefined;
      case "service":
        return value ? undefined : "Wybierz usługę, której dotyczy zapytanie.";
      case "message":
        if (!value) return "Opisz krótko problem lub potrzebę.";
        if (value.length < LIMITS.message[0]) return "Napisz trochę więcej – co najmniej 20 znaków. Wystarczą dwa zdania.";
        return value.length > LIMITS.message[1] ? "Opis może mieć najwyżej 3000 znaków." : undefined;
      case "consent":
        return value ? undefined : "Potwierdź, że znasz zasady przetwarzania danych.";
    }
    return undefined;
  }

  function showError(form, name, message) {
    const field = form.elements[name];
    if (!field) return;
    const wrapper = field.parentElement;
    const errorId = `${field.id}-error`;
    document.getElementById(errorId)?.remove();
    const described = (field.getAttribute("aria-describedby") || "").split(" ").filter((id) => id && id !== errorId);
    if (message) {
      const ui = JSON.parse(form.dataset.ui || "{}");
      const p = document.createElement("p");
      p.id = errorId;
      p.className = ui.error || "";
      p.textContent = message;
      wrapper.append(p);
      described.push(errorId);
      field.setAttribute("aria-invalid", "true");
      wrapper.setAttribute("data-invalid", "");
    } else {
      field.setAttribute("aria-invalid", "false");
      wrapper.removeAttribute("data-invalid");
    }
    if (described.length) field.setAttribute("aria-describedby", described.join(" "));
    else field.removeAttribute("aria-describedby");
  }

  function initForm(query) {
    const form = main.querySelector("form[data-ui]");
    if (!form) return;
    const ui = JSON.parse(form.dataset.ui || "{}");
    const fields = ["name", "email", "company", "service", "message", "consent"];
    const touched = new Set();

    const service = query.get("usluga");
    if (service && form.elements.service && [...form.elements.service.options].some((o) => o.value === service)) {
      form.elements.service.value = service;
    }

    const message = form.elements.message;
    const counter = message && document.getElementById(`${message.id}-hint`)?.lastElementChild;
    const updateCounter = () => {
      if (counter) counter.textContent = `${message.value.trim().length} / 3000`;
    };

    form.addEventListener("focusout", (event) => {
      const name = event.target.name;
      if (!fields.includes(name) || name === "consent") return;
      touched.add(name);
      showError(form, name, validate(form, name));
    });
    form.addEventListener("input", (event) => {
      const name = event.target.name;
      if (name === "message") updateCounter();
      if (touched.has(name) || event.target.getAttribute("aria-invalid") === "true") showError(form, name, validate(form, name));
    });
    form.addEventListener("change", (event) => {
      if (event.target.name === "consent" || event.target.name === "service") showError(form, event.target.name, validate(form, event.target.name));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.querySelector("[data-static-summary]")?.remove();
      const errors = fields.map((name) => [name, validate(form, name)]).filter(([, msg]) => msg);
      fields.forEach((name) => {
        touched.add(name);
        showError(form, name, errors.find(([n]) => n === name)?.[1]);
      });
      if (errors.length) {
        const summary = document.createElement("div");
        summary.className = ui.summary || "";
        summary.setAttribute("role", "alert");
        summary.dataset.staticSummary = "";
        const title = document.createElement("p");
        title.className = ui.summaryTitle || "";
        title.textContent = `Formularz wymaga poprawek (${errors.length}):`;
        const list = document.createElement("ul");
        for (const [name, msg] of errors) {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = "#" + form.elements[name].id;
          a.textContent = `${LABELS[name]}: ${msg}`;
          li.append(a);
          list.append(li);
        }
        summary.append(title, list);
        const notice = form.querySelector('p[id$="-demo"]');
        form.insertBefore(summary, notice ? notice.nextSibling : form.firstChild);
        form.elements[errors[0][0]].focus();
        return;
      }
      showDemoResult(form, ui);
    });
  }

  function showDemoResult(form, ui) {
    const panel = document.createElement("div");
    panel.className = ui.result || "";
    panel.setAttribute("role", "status");
    panel.innerHTML =
      `<h2 tabindex="-1" class="${ui.resultTitle || ""}">Wiadomość nie została wysłana – wersja podglądowa</h2>` +
      "<p>Formularz przeszedł walidację, ale ta wersja strony nie ma połączenia z serwerem, więc <strong>nikt nie otrzymał Twojej wiadomości</strong>. Twoje dane nie zostały nigdzie zapisane.</p>" +
      "<p>W pełnej wersji strony wiadomość trafia do skrzynki firmy po skonfigurowaniu dostawcy poczty.</p>" +
      `<div class="${ui.resultActions || ""}"><button type="button" class="${ui.secondaryButton || ""}">Wróć do formularza</button><a class="text-link" href="#/baza-wiedzy">Przejdź do bazy wiedzy</a></div>`;
    form.replaceWith(panel);
    panel.querySelector("h2").focus();
    panel.querySelector("button").addEventListener("click", () => {
      panel.replaceWith(form);
      form.elements.name?.focus();
    });
  }

  render(routeFromLocation());
})();
