/* NEON NAMI — interakcje (projekt demonstracyjny, bez bibliotek). */
(() => {
  "use strict";

  // Godziny otwarcia w minutach od północy; zamknięcie po północy = wartość > 1440.
  // Indeks: 0 = niedziela … 6 = sobota (jak Date.getDay()).
  const HOURS = [
    [16 * 60, 22 * 60],
    null,
    [17 * 60, 23 * 60],
    [17 * 60, 23 * 60],
    [17 * 60, 23 * 60],
    [17 * 60, 25 * 60],
    [17 * 60, 25 * 60],
  ];
  const DAY_NAMES = ["niedzielę", "poniedziałek", "wtorek", "środę", "czwartek", "piątek", "sobotę"];
  const OMAKASE_DAYS = [5, 6];
  const OMAKASE_TIME = 20 * 60;
  const LAST_SEATING_BEFORE_CLOSE = 90;

  const fmt = (min) => `${String(Math.floor(min / 60) % 24).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

  /** Bieżący czas w Polsce (niezależnie od strefy czasowej urządzenia). */
  function warsawNow() {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Warsaw",
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      }).formatToParts(new Date()).map((p) => [p.type, p.value]),
    );
    const date = `${parts.year}-${parts.month}-${parts.day}`;
    const day = new Date(`${date}T12:00:00Z`).getUTCDay();
    return { date, day, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
  }

  /* ------------------------------------------------------------ status „otwarte teraz” */
  function updateStatus() {
    const el = document.querySelector("[data-status]");
    const text = document.querySelector("[data-status-text]");
    if (!el || !text) return;
    const now = warsawNow();
    const today = HOURS[now.day];
    const yesterday = HOURS[(now.day + 6) % 7];
    let open = false;
    let closesAt = 0;
    if (yesterday && yesterday[1] > 1440 && now.minutes < yesterday[1] - 1440) {
      open = true;
      closesAt = yesterday[1];
    } else if (today && now.minutes >= today[0] && now.minutes < today[1]) {
      open = true;
      closesAt = today[1];
    }
    el.classList.toggle("is-open", open);
    el.classList.toggle("is-closed", !open);
    // „Otwarte” / „Zamknięte” + szczegóły (na wąskich ekranach szczegóły są ukryte przez CSS)
    const set = (main, more) => {
      const strong = document.createElement("span");
      strong.textContent = main;
      const extra = document.createElement("span");
      extra.className = "status__more";
      extra.textContent = ` · ${more}`;
      text.replaceChildren(strong, extra);
    };
    if (open) {
      set("Otwarte", `do ${fmt(closesAt)}`);
      return;
    }
    if (today && now.minutes < today[0]) {
      set("Zamknięte", `otwieramy o ${fmt(today[0])}`);
      return;
    }
    for (let i = 1; i <= 7; i++) {
      const d = (now.day + i) % 7;
      if (HOURS[d]) {
        set("Zamknięte", `otwieramy ${i === 1 ? "jutro" : `w ${DAY_NAMES[d]}`} o ${fmt(HOURS[d][0])}`);
        return;
      }
    }
  }
  updateStatus();
  setInterval(updateStatus, 60_000);
  const todayRow = document.querySelector(`[data-hours] tr[data-day="${warsawNow().day}"]`);
  todayRow?.classList.add("is-today");

  /* ------------------------------------------------------------ menu mobilne */
  const burger = document.querySelector("[data-burger]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if (burger && mobileNav) {
    const set = (open) => {
      burger.setAttribute("aria-expanded", String(open));
      mobileNav.hidden = !open;
    };
    burger.addEventListener("click", () => set(burger.getAttribute("aria-expanded") !== "true"));
    mobileNav.addEventListener("click", (e) => e.target.closest("a") && set(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !mobileNav.hidden) { set(false); burger.focus(); }
    });
  }

  /* ------------------------------------------------------------ menu: kategorie i filtry */
  const tabs = [...document.querySelectorAll("[data-tabs] [role=tab]")];
  const groups = [...document.querySelectorAll("[data-group]")];
  const dishes = [...document.querySelectorAll(".dish")];
  const dietInputs = [...document.querySelectorAll("[data-diet]")].filter((el) => el.matches("input"));
  const empty = document.querySelector("[data-menu-empty]");
  const count = document.querySelector("[data-menu-count]");
  let category = "all";

  function applyMenu() {
    const diets = dietInputs.filter((i) => i.checked).map((i) => i.dataset.diet);
    let shown = 0;
    for (const group of groups) {
      let groupShown = 0;
      for (const dish of group.querySelectorAll(".dish")) {
        const tags = dish.dataset.diet.split(" ");
        const visible = (category === "all" || dish.dataset.cat === category) && diets.every((d) => tags.includes(d));
        dish.hidden = !visible;
        if (visible) groupShown++;
      }
      group.hidden = groupShown === 0;
      shown += groupShown;
    }
    empty.hidden = shown !== 0;
    const filtered = category !== "all" || diets.length;
    count.textContent = filtered ? `Pokazano ${shown} z ${dishes.length} pozycji menu.` : "";
  }
  function selectTab(tab, focus = false) {
    tabs.forEach((t) => {
      const active = t === tab;
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
    });
    if (focus) tab.focus();
    category = tab.dataset.cat;
    applyMenu();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      selectTab(tabs[(next + tabs.length) % tabs.length], true);
    });
  });
  dietInputs.forEach((i) => i.addEventListener("change", applyMenu));
  document.querySelector("[data-reset]")?.addEventListener("click", () => {
    dietInputs.forEach((i) => (i.checked = false));
    selectTab(tabs[0], true);
  });

  /* ------------------------------------------------------------ rezerwacja (demo) */
  const form = document.querySelector("[data-booking]");
  if (!form) return;
  const summary = document.querySelector("[data-summary]");
  const summaryList = document.querySelector("[data-summary-list]");
  const status = form.querySelector("[data-booking-status]");
  const dateEl = form.elements.date;
  const timeEl = form.elements.time;

  const now = warsawNow();
  const maxDate = new Date(`${now.date}T12:00:00Z`);
  maxDate.setUTCDate(maxDate.getUTCDate() + 60);
  dateEl.min = now.date;
  dateEl.max = maxDate.toISOString().slice(0, 10);

  const seat = () => form.querySelector("input[name=seat]:checked").value;
  const dayOf = (iso) => new Date(`${iso}T12:00:00Z`).getUTCDay();

  function fillTimes() {
    const iso = dateEl.value;
    const previous = timeEl.value;
    timeEl.innerHTML = "";
    const add = (value, label) => timeEl.append(new Option(label, value));
    if (!iso) { add("", "Najpierw wybierz datę"); timeEl.disabled = true; return; }
    const day = dayOf(iso);
    const hours = HOURS[day];
    let slots = [];
    if (seat() === "omakase") {
      if (OMAKASE_DAYS.includes(day)) slots = [OMAKASE_TIME];
    } else if (hours) {
      for (let m = hours[0]; m <= hours[1] - LAST_SEATING_BEFORE_CLOSE; m += 30) slots.push(m);
    }
    if (iso === warsawNow().date) {
      const earliest = warsawNow().minutes + 60;
      slots = slots.filter((m) => m >= earliest);
    }
    if (!slots.length) {
      add("", seat() === "omakase" ? "Omakase tylko w piątki i soboty" : !hours ? "Tego dnia jesteśmy zamknięci" : "Brak wolnych godzin tego dnia");
      timeEl.disabled = true;
      return;
    }
    timeEl.disabled = false;
    add("", "Wybierz godzinę");
    slots.forEach((m) => add(fmt(m), fmt(m)));
    if ([...timeEl.options].some((o) => o.value === previous)) timeEl.value = previous;
  }
  dateEl.addEventListener("change", () => { fillTimes(); validate("date"); });
  form.querySelectorAll("input[name=seat]").forEach((r) => r.addEventListener("change", fillTimes));

  document.querySelectorAll("[data-omakase]").forEach((a) =>
    a.addEventListener("click", () => {
      form.querySelector('input[name=seat][value="omakase"]').checked = true;
      fillTimes();
    }),
  );

  const rules = {
    date: (v) => {
      if (!v) return "Wybierz datę.";
      if (v < dateEl.min || v > dateEl.max) return "Rezerwacje przyjmujemy na najbliższe 60 dni.";
      return "";
    },
    time: (v) => (timeEl.disabled ? "Wybierz inny dzień — tego dnia nie ma dostępnych godzin." : v ? "" : "Wybierz godzinę."),
    name: (v) => (v.trim().length >= 3 ? "" : "Podaj imię i nazwisko."),
    phone: (v) => (/^(\+?48)?\d{9}$/.test(v.replace(/[\s-]/g, "")) ? "" : "Podaj numer telefonu — 9 cyfr, np. 600 100 200."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Podaj poprawny adres e-mail."),
    consent: (_, el) => (el.checked ? "" : "Zaznacz, aby kontynuować."),
  };
  function validate(name) {
    const el = form.elements[name];
    const msg = rules[name](el.value, el);
    const field = el.closest(".field");
    field.classList.toggle("is-invalid", Boolean(msg));
    el.setAttribute("aria-invalid", String(Boolean(msg)));
    field.querySelector("[data-err]").textContent = msg;
    return msg;
  }
  Object.keys(rules).forEach((name) => {
    const el = form.elements[name];
    el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "blur", () => {
      if (el.type !== "checkbox" && el.value.trim() === "" && el.getAttribute("aria-invalid") !== "true") return;
      validate(name);
    });
    el.addEventListener("input", () => el.getAttribute("aria-invalid") === "true" && validate(name));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = Object.keys(rules).filter((n) => validate(n));
    if (bad.length) {
      status.textContent = "Uzupełnij zaznaczone pola.";
      form.elements[bad[0]].focus();
      return;
    }
    status.textContent = "";
    const d = new Date(`${dateEl.value}T12:00:00Z`);
    const dateLabel = new Intl.DateTimeFormat("pl-PL", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(d);
    const seatLabel = form.querySelector("input[name=seat]:checked").nextElementSibling.textContent;
    const rows = [
      ["Termin", `${dateLabel}, ${timeEl.value}`],
      ["Liczba osób", form.elements.guests.selectedOptions[0].textContent],
      ["Miejsce", seatLabel],
      ["Na nazwisko", form.elements.name.value.trim()],
      ["Kontakt", `${form.elements.phone.value.trim()} · ${form.elements.email.value.trim()}`],
    ];
    if (form.elements.notes.value.trim()) rows.push(["Uwagi", form.elements.notes.value.trim()]);
    summaryList.replaceChildren(
      ...rows.map(([k, v]) => {
        const wrap = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = k;
        dd.textContent = v;
        wrap.append(dt, dd);
        return wrap;
      }),
    );
    form.hidden = true;
    summary.hidden = false;
    summary.focus();
  });

  document.querySelector("[data-summary-reset]")?.addEventListener("click", () => {
    form.reset();
    fillTimes();
    form.querySelectorAll(".is-invalid").forEach((f) => f.classList.remove("is-invalid"));
    summary.hidden = true;
    form.hidden = false;
    dateEl.focus();
  });
})();
