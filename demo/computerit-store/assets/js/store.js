/* ComputerIT Store — koszyk, katalog, karta produktu i zamówienie demonstracyjne (bez bibliotek). */
(() => {
  "use strict";
  const { COLORS, CATEGORIES, PRODUCTS, SHIPPING, FREE_SHIPPING_FROM, MAX_QTY, bySlug, fromPrice } = window.STORE;
  const { render: art } = window.STORE_ART;

  /* ================================================================ narzędzia */
  const money = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });
  const fmt = (grosze) => money.format(grosze / 100);
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const plural = (n, one, few, many) => {
    if (n === 1) return one;
    const d = n % 10, t = n % 100;
    return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many;
  };
  const productUrl = (p, color, option) => {
    const q = new URLSearchParams({ p: p.slug });
    if (color && color !== p.colors[0]) q.set("kolor", color);
    if (option && option !== p.options[0].id) q.set("wariant", option);
    return `produkt.html?${q}`;
  };
  const categoryName = (id) => CATEGORIES.find((c) => c.id === id)?.name ?? "";
  const stockInfo = (p) =>
    p.stock === 0 ? { cls: "out", text: "Chwilowo niedostępny" } : p.stock <= 3 ? { cls: "low", text: `Ostatnie sztuki (${p.stock})` } : { cls: "in", text: "Dostępny" };

  /* ================================================================ koszyk (localStorage) */
  const KEY = "cit-store-cart-v1";
  let memory = [];
  const storage = {
    read() {
      try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return memory; }
    },
    write(lines) {
      memory = lines;
      try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* tryb prywatny – koszyk tylko w pamięci */ }
    },
  };

  const cart = {
    // Odczyt z walidacją: nieznane produkty, warianty i ilości są poprawiane (dane z przeglądarki nie są zaufane).
    lines() {
      const raw = storage.read();
      if (!Array.isArray(raw)) return [];
      const seen = new Set();
      return raw.flatMap((l) => {
        const p = bySlug[l?.slug];
        if (!p || p.stock === 0) return [];
        const color = p.colors.includes(l.color) ? l.color : p.colors[0];
        const option = p.options.some((o) => o.id === l.option) ? l.option : p.options[0].id;
        const key = `${p.slug}|${color}|${option}`;
        if (seen.has(key)) return [];
        seen.add(key);
        const qty = Math.max(1, Math.min(Number.parseInt(l.qty, 10) || 1, MAX_QTY, p.stock));
        return [{ slug: p.slug, color, option, qty, key }];
      });
    },
    save(lines) {
      storage.write(lines.map(({ slug, color, option, qty }) => ({ slug, color, option, qty })));
      document.dispatchEvent(new CustomEvent("cart:change"));
    },
    add(slug, color, option, qty = 1) {
      const p = bySlug[slug];
      if (!p || p.stock === 0) return { ok: false, message: "Ten produkt jest chwilowo niedostępny." };
      const lines = this.lines();
      const key = `${slug}|${color}|${option}`;
      const line = lines.find((l) => l.key === key);
      const limit = Math.min(MAX_QTY, p.stock);
      const current = line?.qty ?? 0;
      if (current >= limit) return { ok: false, message: `Masz już w koszyku maksymalną liczbę sztuk (${limit}).` };
      const added = Math.min(qty, limit - current);
      if (line) line.qty += added;
      else lines.push({ slug, color, option, qty: added, key });
      this.save(lines);
      return { ok: true, added, capped: added < qty, limit };
    },
    setQty(key, qty) {
      const lines = this.lines();
      const line = lines.find((l) => l.key === key);
      if (!line) return;
      const p = bySlug[line.slug];
      line.qty = Math.max(1, Math.min(qty, MAX_QTY, p.stock));
      this.save(lines);
    },
    remove(key) { this.save(this.lines().filter((l) => l.key !== key)); },
    clear() { this.save([]); },
    detail(line) {
      const p = bySlug[line.slug];
      const option = p.options.find((o) => o.id === line.option);
      return { p, option, color: COLORS[line.color], unit: option.price, total: option.price * line.qty, max: Math.min(MAX_QTY, p.stock) };
    },
    totals() {
      const lines = this.lines();
      return {
        count: lines.reduce((s, l) => s + l.qty, 0),
        subtotal: lines.reduce((s, l) => s + this.detail(l).total, 0),
      };
    },
  };
  const shippingPrice = (method, subtotal) => (method.price > 0 && subtotal >= FREE_SHIPPING_FROM ? 0 : method.price);

  /* ================================================================ wspólne elementy UI */
  function updateCount() {
    const { count } = cart.totals();
    $$("[data-cart-count]").forEach((el) => {
      el.textContent = String(count);
      el.classList.toggle("is-empty", count === 0);
    });
    $$("[data-cart-count-label]").forEach((el) => (el.textContent = `, ${count} ${plural(count, "produkt", "produkty", "produktów")}`));
  }

  let toastTimer;
  function toast(message) {
    const el = $("[data-toast]");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3200);
  }

  function lineHTML(line, compact) {
    const { p, option, color, unit, total, max } = cart.detail(line);
    const variant = [color.name, p.options.length > 1 ? option.name : ""].filter(Boolean).join(" · ");
    return `<li class="line${compact ? " line--compact" : ""}" data-key="${esc(line.key)}">
      <a class="line__art" href="${productUrl(p, line.color, line.option)}" tabindex="-1" aria-hidden="true">${art(p, line.color, { label: false })}</a>
      <div class="line__info">
        <a class="line__name" href="${productUrl(p, line.color, line.option)}">${esc(p.name)}</a>
        <p class="line__variant">${esc(variant)}</p>
        <p class="line__unit">${fmt(unit)} / szt.</p>
      </div>
      <div class="qty" role="group" aria-label="Ilość: ${esc(p.name)}">
        <button type="button" class="qty__btn" data-qty="-1" aria-label="Zmniejsz ilość" ${line.qty <= 1 ? "disabled" : ""}>−</button>
        <input class="qty__input" type="number" inputmode="numeric" min="1" max="${max}" value="${line.qty}" aria-label="Liczba sztuk: ${esc(p.name)}" data-qty-input>
        <button type="button" class="qty__btn" data-qty="1" aria-label="Zwiększ ilość" ${line.qty >= max ? "disabled" : ""}>+</button>
      </div>
      <p class="line__total">${fmt(total)}</p>
      <button type="button" class="line__remove" data-remove aria-label="Usuń z koszyka: ${esc(p.name)}, ${esc(variant)}">Usuń</button>
    </li>`;
  }

  // Zmiana ilości i usuwanie – delegacja zdarzeń (panel koszyka i strona koszyka).
  function bindLineEvents(root) {
    root.addEventListener("click", (e) => {
      const li = e.target.closest("[data-key]");
      if (!li) return;
      const key = li.dataset.key;
      const step = e.target.closest("[data-qty]");
      if (step) {
        const line = cart.lines().find((l) => l.key === key);
        if (line) {
          cart.setQty(key, line.qty + Number(step.dataset.qty));
          // zachowaj fokus na tym samym przycisku po ponownym renderze
          requestAnimationFrame(() => {
            const again = $(`[data-key="${CSS.escape(key)}"] [data-qty="${step.dataset.qty}"]`, root);
            (again && !again.disabled ? again : $(`[data-key="${CSS.escape(key)}"] [data-qty-input]`, root))?.focus();
          });
        }
      }
      if (e.target.closest("[data-remove]")) {
        const name = bySlug[key.split("|")[0]].name;
        cart.remove(key);
        toast(`Usunięto z koszyka: ${name}.`);
        requestAnimationFrame(() => ($("[data-qty-input]", root) ?? $("[data-focus-after-empty]", root) ?? root.closest("[tabindex]"))?.focus());
      }
    });
    root.addEventListener("change", (e) => {
      const input = e.target.closest("[data-qty-input]");
      if (!input) return;
      const value = Number.parseInt(input.value, 10);
      cart.setQty(input.closest("[data-key]").dataset.key, Number.isFinite(value) ? value : 1);
    });
  }

  function freeShippingHTML(subtotal) {
    if (subtotal === 0) return "";
    const left = FREE_SHIPPING_FROM - subtotal;
    const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_FROM) * 100));
    return `<p>${left > 0 ? `Do darmowej dostawy brakuje <strong>${fmt(left)}</strong>.` : "<strong>Darmowa dostawa</strong> kurierem i do automatu."}</p>
      <div class="freeship__bar" role="progressbar" aria-label="Postęp do darmowej dostawy" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>`;
  }

  /* ---------------------------------------------------------------- panel koszyka */
  const drawer = $("[data-drawer]");
  const drawerPanel = $("[data-drawer-panel]");
  const drawerBody = $("[data-drawer-body]");
  let lastFocus = null;

  function renderDrawer() {
    if (!drawerBody) return;
    const lines = cart.lines();
    const { subtotal, count } = cart.totals();
    if (!lines.length) {
      drawerBody.innerHTML = `<div class="drawer__empty"><p class="empty__title">Koszyk jest pusty.</p><p>Dodaj coś z katalogu — produkty zostaną zapamiętane w tej przeglądarce.</p><a class="btn" href="index.html#katalog" data-cart-close-link data-focus-after-empty>Przeglądaj produkty</a></div>`;
      return;
    }
    drawerBody.innerHTML = `<ul class="lines">${lines.map((l) => lineHTML(l, true)).join("")}</ul>
      <div class="drawer__foot">
        <div class="freeship">${freeShippingHTML(subtotal)}</div>
        <p class="drawer__sum"><span>Suma (${count} ${plural(count, "szt.", "szt.", "szt.")})</span><strong>${fmt(subtotal)}</strong></p>
        <a class="btn btn--block btn--lg" href="koszyk.html">Przejdź do koszyka</a>
        <button type="button" class="btn btn--ghost btn--block" data-cart-close>Kontynuuj zakupy</button>
      </div>`;
  }
  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    renderDrawer();
    drawer.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      drawerPanel.focus();
    });
  }
  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    drawer.hidden = true;
    lastFocus?.focus?.();
  }
  if (drawer) {
    bindLineEvents(drawerBody);
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-cart-open]")) openDrawer();
      else if (e.target.closest("[data-cart-close]")) closeDrawer();
      else if (e.target.closest("[data-cart-close-link]")) {
        drawer.classList.remove("is-open");
        drawer.hidden = true;
        document.body.classList.remove("no-scroll");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (drawer.hidden) return;
      if (e.key === "Escape") closeDrawer();
      if (e.key === "Tab") {
        const focusable = $$('a[href], button:not([disabled]), input, [tabindex="-1"][data-drawer-panel]', drawerPanel).filter((el) => !el.closest("[aria-hidden=true]"));
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  document.addEventListener("cart:change", () => {
    updateCount();
    if (drawer && !drawer.hidden) renderDrawer();
  });
  // zmiany koszyka w innej karcie przeglądarki
  window.addEventListener("storage", (e) => e.key === KEY && document.dispatchEvent(new CustomEvent("cart:change")));
  updateCount();

  function addToCart(slug, color, option, qty = 1, { open = true } = {}) {
    const result = cart.add(slug, color, option, qty);
    const p = bySlug[slug];
    if (!result.ok) { toast(result.message); return result; }
    toast(result.capped ? `Dodano ${result.added} szt. — limit dla tego produktu to ${result.limit} szt.` : `Dodano do koszyka: ${p.name}.`);
    if (open) openDrawer();
    return result;
  }

  // Wyszukiwarka w nagłówku działa także na podstronach (przechodzi do katalogu).
  const searchForm = $("[data-search-form]");
  const params = new URLSearchParams(location.search);
  if (searchForm) searchForm.q.value = params.get("q") ?? "";

  /* ================================================================ karta produktu w siatce */
  function cardHTML(p) {
    const color = p.colors[0];
    const s = stockInfo(p);
    const multi = p.options.length > 1;
    return `<li class="card" data-slug="${p.slug}">
      <a class="card__art" href="${productUrl(p)}" tabindex="-1" aria-hidden="true" data-card-art>${art(p, color, { label: false })}</a>
      ${p.isNew ? '<span class="card__badge">Nowość</span>' : ""}
      <div class="card__body">
        <p class="card__cat">${esc(categoryName(p.category))}</p>
        <h3 class="card__name"><a href="${productUrl(p)}" data-card-link>${esc(p.name)}</a></h3>
        <p class="card__tag">${esc(p.tagline)}</p>
        ${p.colors.length > 1 ? `<div class="swatches" role="group" aria-label="Kolor — ${esc(p.name)}">${p.colors
          .map((c, i) => `<button type="button" class="swatch" style="--c:${COLORS[c].hex}" aria-pressed="${i === 0}" data-color="${c}"><span class="sr">${COLORS[c].name}</span></button>`)
          .join("")}</div>` : `<p class="swatch-label">${esc(COLORS[color].name)}</p>`}
        <div class="card__foot">
          <p class="card__price">${multi ? '<span class="from">od</span> ' : ""}${fmt(fromPrice(p))}</p>
          <p class="stock stock--${s.cls}">${s.text}</p>
        </div>
        ${multi && p.stock > 0
          ? `<a class="btn btn--block card__add" href="${productUrl(p)}" data-card-link>Wybierz wersję<span class="sr"> — ${esc(p.name)}</span></a>`
          : `<button type="button" class="btn btn--block card__add" data-add ${p.stock === 0 ? "disabled" : ""}>${p.stock === 0 ? "Niedostępny" : "Dodaj do koszyka"}<span class="sr"> — ${esc(p.name)}</span></button>`}
      </div>
    </li>`;
  }
  function bindCards(root) {
    root.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const p = bySlug[card.dataset.slug];
      const sw = e.target.closest("[data-color]");
      if (sw) {
        $$("[data-color]", card).forEach((b) => b.setAttribute("aria-pressed", String(b === sw)));
        const color = sw.dataset.color;
        $("[data-card-art]", card).innerHTML = art(p, color, { label: false });
        $$("[data-card-art], [data-card-link]", card).forEach((a) => (a.href = productUrl(p, color)));
      }
      if (e.target.closest("[data-add]")) {
        const color = $('[data-color][aria-pressed="true"]', card)?.dataset.color ?? p.colors[0];
        addToCart(p.slug, color, p.options[0].id);
      }
    });
  }

  /* ================================================================ strona główna + katalog */
  function pageHome() {
    const hero = $("[data-hero]");
    const featured = bySlug["aero-14"];
    hero.innerHTML = `<div class="wrap hero__inner">
        <div class="hero__copy">
          <p class="eyebrow">Nowość · ${esc(categoryName(featured.category))}</p>
          <h1 class="hero__title" id="hero-title">Sprzęt, który nadąża <span>za Twoją pracą.</span></h1>
          <p class="hero__lead">${esc(featured.name)} — ${esc(featured.tagline.toLowerCase())}. Aluminium, matowy ekran 2,8K i bateria na cały dzień.</p>
          <div class="hero__actions">
            <a class="btn btn--lg" href="${productUrl(featured)}">Zobacz ${esc(featured.name)}</a>
            <a class="btn btn--ghost btn--lg" href="#katalog">Przeglądaj katalog</a>
          </div>
          <p class="hero__price">od <strong>${fmt(fromPrice(featured))}</strong></p>
        </div>
        <a class="hero__art" href="${productUrl(featured)}" tabindex="-1" aria-hidden="true">${art(featured, "srebrny", { label: false })}</a>
      </div>`;

    $("[data-cats]").innerHTML = CATEGORIES.map((c) => {
      const first = PRODUCTS.find((p) => p.category === c.id);
      const n = PRODUCTS.filter((p) => p.category === c.id).length;
      return `<li><a class="cat" href="?kat=${c.id}#katalog" data-cat-link="${c.id}"><span class="cat__art" aria-hidden="true">${art(first, first.colors[0], { label: false })}</span><span class="cat__name">${esc(c.name)}</span><span class="cat__count">${n} ${plural(n, "produkt", "produkty", "produktów")}</span></a></li>`;
    }).join("");

    const chips = $("[data-chips]");
    const grid = $("[data-grid]");
    const sortEl = $("[data-sort]");
    const inStockEl = $("[data-instock]");
    const status = $("[data-catalog-status]");
    const title = $("[data-catalog-title]");
    const empty = $("[data-empty]");

    const state = {
      kat: CATEGORIES.some((c) => c.id === params.get("kat")) ? params.get("kat") : "",
      q: (params.get("q") ?? "").trim().slice(0, 60),
      sort: ["featured", "price-asc", "price-desc", "name"].includes(params.get("sort")) ? params.get("sort") : "featured",
      inStock: params.get("dostepne") === "1",
    };
    sortEl.value = state.sort;
    inStockEl.checked = state.inStock;

    chips.innerHTML = [{ id: "", name: "Wszystkie" }, ...CATEGORIES]
      .map((c) => `<button type="button" class="chip" data-chip="${c.id}" aria-pressed="false">${esc(c.name)}</button>`)
      .join("");

    const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l");
    function apply({ push = false } = {}) {
      const words = normalize(state.q).split(/\s+/).filter(Boolean);
      let list = PRODUCTS.filter((p) => {
        if (state.kat && p.category !== state.kat) return false;
        if (state.inStock && p.stock === 0) return false;
        const hay = normalize([p.name, p.tagline, p.description, categoryName(p.category), ...p.specs.flat()].join(" "));
        return words.every((w) => hay.includes(w));
      });
      const sorters = {
        featured: (a, b) => (a.featured ?? 99) - (b.featured ?? 99),
        "price-asc": (a, b) => fromPrice(a) - fromPrice(b),
        "price-desc": (a, b) => fromPrice(b) - fromPrice(a),
        name: (a, b) => a.name.localeCompare(b.name, "pl"),
      };
      list = [...list].sort(sorters[state.sort]);
      grid.innerHTML = list.map(cardHTML).join("");
      empty.hidden = list.length > 0;
      $$("[data-chip]", chips).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.chip === state.kat)));
      title.textContent = state.kat ? categoryName(state.kat) : "Wszystkie produkty";
      const parts = [`${list.length} ${plural(list.length, "produkt", "produkty", "produktów")}`];
      if (state.q) parts.push(`dla frazy „${state.q}”`);
      status.textContent = parts.join(" ");

      const q = new URLSearchParams();
      if (state.kat) q.set("kat", state.kat);
      if (state.q) q.set("q", state.q);
      if (state.sort !== "featured") q.set("sort", state.sort);
      if (state.inStock) q.set("dostepne", "1");
      const url = `${location.pathname}${q.toString() ? `?${q}` : ""}${location.hash}`;
      history[push ? "pushState" : "replaceState"](null, "", url);
    }

    chips.addEventListener("click", (e) => {
      const b = e.target.closest("[data-chip]");
      if (!b) return;
      state.kat = b.dataset.chip;
      apply();
    });
    $("[data-cats]").addEventListener("click", (e) => {
      const a = e.target.closest("[data-cat-link]");
      if (!a) return;
      e.preventDefault();
      state.kat = a.dataset.catLink;
      apply();
      $("#katalog").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      $(`[data-chip="${state.kat}"]`)?.focus({ preventScroll: true });
    });
    sortEl.addEventListener("change", () => { state.sort = sortEl.value; apply(); });
    inStockEl.addEventListener("change", () => { state.inStock = inStockEl.checked; apply(); });
    $("[data-clear]").addEventListener("click", () => {
      Object.assign(state, { kat: "", q: "", inStock: false });
      inStockEl.checked = false;
      searchForm.q.value = "";
      apply();
      searchForm.q.focus();
    });
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      state.q = searchForm.q.value.trim().slice(0, 60);
      apply();
      $("#katalog").scrollIntoView();
      status.focus?.();
    });
    let typing;
    searchForm.q.addEventListener("input", () => {
      clearTimeout(typing);
      typing = setTimeout(() => { state.q = searchForm.q.value.trim().slice(0, 60); apply(); }, 220);
    });
    bindCards(grid);
    apply();
    if (state.q || state.kat) $("#katalog").scrollIntoView();
  }

  /* ================================================================ karta produktu */
  function pageProduct() {
    const root = $("[data-product-root]");
    const p = bySlug[params.get("p")];
    if (!p) {
      document.title = "Nie znaleziono produktu — ComputerIT Store";
      $("[data-crumb-name]").textContent = "Nie znaleziono";
      root.innerHTML = `<div class="empty empty--page"><h1 class="h1">Nie znaleziono produktu</h1><p>Produkt mógł zostać usunięty albo adres jest niepoprawny.</p><a class="btn" href="index.html#katalog">Przejdź do katalogu</a></div>`;
      return;
    }
    let color = p.colors.includes(params.get("kolor")) ? params.get("kolor") : p.colors[0];
    let option = p.options.some((o) => o.id === params.get("wariant")) ? params.get("wariant") : p.options[0].id;
    const s = stockInfo(p);
    const max = Math.min(MAX_QTY, p.stock);

    document.title = `${p.name} — ${p.tagline} | ComputerIT Store (demo)`;
    $("[data-crumb-name]").textContent = p.name;
    const crumbCat = $("[data-crumb-cat]");
    crumbCat.textContent = categoryName(p.category);
    crumbCat.href = `index.html?kat=${p.category}#katalog`;

    root.innerHTML = `<article class="product">
      <div class="product__gallery">
        <div class="product__stage" data-stage>${art(p, color)}</div>
        ${p.colors.length > 1 ? `<div class="product__thumbs" aria-hidden="true">${p.colors.map((c) => `<span class="thumb" data-thumb="${c}">${art(p, c, { label: false })}</span>`).join("")}</div>` : ""}
      </div>
      <div class="product__info">
        <p class="eyebrow">${esc(categoryName(p.category))}${p.isNew ? " · Nowość" : ""}</p>
        <h1 class="product__name">${esc(p.name)}</h1>
        <p class="product__tagline">${esc(p.tagline)}</p>
        <p class="product__price" data-price aria-live="polite"></p>
        <p class="product__vat">Cena przykładowa, zawiera VAT · produkt fikcyjny</p>

        <fieldset class="picker">
          <legend>Kolor: <strong data-color-name>${esc(COLORS[color].name)}</strong></legend>
          <div class="picker__swatches">${p.colors
            .map((c) => `<label class="pick-swatch" style="--c:${COLORS[c].hex}"><input type="radio" name="color" value="${c}" ${c === color ? "checked" : ""}><span><span class="sr">${COLORS[c].name}</span></span></label>`)
            .join("")}</div>
        </fieldset>

        ${p.options.length > 1 ? `<fieldset class="picker">
          <legend>Wersja</legend>
          <div class="picker__options">${p.options
            .map((o) => `<label class="pick-option"><input type="radio" name="option" value="${o.id}" ${o.id === option ? "checked" : ""}><span><span>${esc(o.name)}</span><strong>${fmt(o.price)}</strong></span></label>`)
            .join("")}</div>
        </fieldset>` : ""}

        <p class="stock stock--${s.cls} product__stock">${s.text}${p.stock > 0 ? " · wysyłka w 24 h (przykładowo)" : ""}</p>

        <div class="buy">
          <div class="qty qty--lg" role="group" aria-label="Ilość">
            <button type="button" class="qty__btn" data-step="-1" aria-label="Zmniejsz ilość">−</button>
            <input class="qty__input" type="number" inputmode="numeric" min="1" max="${Math.max(1, max)}" value="1" aria-label="Liczba sztuk" data-buy-qty ${p.stock === 0 ? "disabled" : ""}>
            <button type="button" class="qty__btn" data-step="1" aria-label="Zwiększ ilość">+</button>
          </div>
          <button type="button" class="btn btn--lg buy__add" data-buy ${p.stock === 0 ? "disabled" : ""}>${p.stock === 0 ? "Chwilowo niedostępny" : "Dodaj do koszyka"}</button>
        </div>
        <p class="buy__hint" data-buy-hint>${p.stock > 0 ? `Maksymalnie ${max} szt. w jednym zamówieniu.` : "Ten produkt nie może zostać dodany do koszyka."}</p>

        <div class="product__desc">
          <h2 class="h4">Opis</h2>
          <p>${esc(p.description)}</p>
        </div>
        <div class="product__specs">
          <h2 class="h4">Parametry</h2>
          <table class="specs"><tbody>${p.specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table>
        </div>
        <p class="product__note">Produkt fikcyjny — nazwa, parametry, cena i stan magazynowy zostały przygotowane na potrzeby demonstracji. Ilustracja jest grafiką SVG, a nie zdjęciem produktu.</p>
      </div>
    </article>`;

    const priceEl = $("[data-price]", root);
    const qtyEl = $("[data-buy-qty]", root);
    const sync = () => {
      const o = p.options.find((x) => x.id === option);
      priceEl.textContent = fmt(o.price);
      $("[data-stage]", root).innerHTML = art(p, color);
      $("[data-color-name]", root).textContent = COLORS[color].name;
      $$("[data-thumb]", root).forEach((t) => t.classList.toggle("is-active", t.dataset.thumb === color));
      history.replaceState(null, "", productUrl(p, color, option));
    };
    root.addEventListener("change", (e) => {
      if (e.target.name === "color") { color = e.target.value; sync(); }
      if (e.target.name === "option") { option = e.target.value; sync(); }
      if (e.target === qtyEl) qtyEl.value = String(Math.max(1, Math.min(Number.parseInt(qtyEl.value, 10) || 1, max)));
    });
    root.addEventListener("click", (e) => {
      const step = e.target.closest("[data-step]");
      if (step && p.stock > 0) qtyEl.value = String(Math.max(1, Math.min((Number.parseInt(qtyEl.value, 10) || 1) + Number(step.dataset.step), max)));
      if (e.target.closest("[data-buy]")) addToCart(p.slug, color, option, Math.max(1, Math.min(Number.parseInt(qtyEl.value, 10) || 1, max)));
    });
    sync();

    const related = PRODUCTS.filter((x) => x.slug !== p.slug && x.category === p.category)
      .concat(PRODUCTS.filter((x) => x.slug !== p.slug && x.category !== p.category && x.featured))
      .slice(0, 4);
    const relGrid = $("[data-related-grid]");
    relGrid.innerHTML = related.map(cardHTML).join("");
    bindCards(relGrid);
    $("[data-related]").hidden = false;
  }

  /* ================================================================ koszyk i zamówienie */
  function pageCart() {
    const linesEl = $("[data-lines]");
    const emptyEl = $("[data-cart-empty]");
    const form = $("[data-order]");
    const summary = $("[data-summary]");
    const rowsEl = $("[data-summary-rows]");
    const freeEl = $("[data-freeship]");
    const result = $("[data-result]");
    const shipBox = $("[data-shipping]");

    shipBox.insertAdjacentHTML(
      "beforeend",
      SHIPPING.map((m, i) => `<label class="option"><input type="radio" name="shipping" value="${m.id}" ${i === 0 ? "checked" : ""}><span class="option__body"><span class="option__name">${esc(m.name)}</span><span class="option__eta">${esc(m.eta)}</span></span><span class="option__price" data-ship-price="${m.id}"></span></label>`).join(""),
    );
    const method = () => SHIPPING.find((m) => m.id === form.shipping.value) ?? SHIPPING[0];

    function render() {
      if (!result.hidden) return;
      const lines = cart.lines();
      const { subtotal, count } = cart.totals();
      linesEl.innerHTML = lines.map((l) => lineHTML(l, false)).join("");
      const has = lines.length > 0;
      emptyEl.hidden = has;
      form.hidden = !has;
      summary.hidden = !has;
      if (!has) return;
      SHIPPING.forEach((m) => {
        const price = shippingPrice(m, subtotal);
        $(`[data-ship-price="${m.id}"]`).textContent = price === 0 ? (m.price === 0 ? "0,00 zł" : "gratis") : fmt(price);
      });
      const ship = shippingPrice(method(), subtotal);
      rowsEl.innerHTML = `<div><dt>Produkty (${count} szt.)</dt><dd>${fmt(subtotal)}</dd></div>
        <div><dt>Dostawa — ${esc(method().name.toLowerCase())}</dt><dd>${ship === 0 ? "0,00 zł" : fmt(ship)}</dd></div>
        <div class="summary__total"><dt>Do zapłaty</dt><dd>${fmt(subtotal + ship)}</dd></div>`;
      freeEl.innerHTML = freeShippingHTML(subtotal);
    }
    bindLineEvents(linesEl);
    document.addEventListener("cart:change", render);
    form.addEventListener("change", (e) => e.target.name === "shipping" && render());

    const rules = {
      name: (v) => (v.trim().split(/\s+/).length >= 2 && v.trim().length >= 5 ? "" : "Podaj imię i nazwisko."),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Podaj poprawny adres e-mail."),
      phone: (v) => (/^(\+?48)?\d{9}$/.test(v.replace(/[\s-]/g, "")) ? "" : "Podaj numer telefonu — 9 cyfr."),
      street: (v) => (v.trim().length >= 3 && /\d/.test(v) ? "" : "Podaj ulicę i numer domu."),
      zip: (v) => (/^\d{2}-\d{3}$/.test(v.trim()) ? "" : "Kod pocztowy w formacie 00-000."),
      city: (v) => (v.trim().length >= 2 ? "" : "Podaj miejscowość."),
      terms: (_, el) => (el.checked ? "" : "Zaznacz, aby kontynuować."),
    };
    const validate = (name) => {
      const el = form.elements[name];
      const msg = rules[name](el.value, el);
      const field = el.closest(".field");
      field.classList.toggle("is-invalid", Boolean(msg));
      el.setAttribute("aria-invalid", String(Boolean(msg)));
      const err = $("[data-err]", field);
      err.id ||= `${el.id}-err`;
      el.setAttribute("aria-describedby", err.id);
      err.textContent = msg;
      return msg;
    };
    Object.keys(rules).forEach((n) => {
      const el = form.elements[n];
      el.addEventListener(n === "terms" ? "change" : "blur", () => {
        if (n !== "terms" && el.value.trim() === "" && el.getAttribute("aria-invalid") !== "true") return;
        validate(n);
      });
      // po pierwszym błędzie komunikat znika już podczas pisania (bez przeskoku układu przy kliknięciu dalej)
      el.addEventListener("input", () => el.getAttribute("aria-invalid") === "true" && validate(n));
    });
    form.addEventListener("input", () => {
      const status = $("[data-order-status]");
      if (status.textContent && !$(".is-invalid", form)) status.textContent = "";
    });
    form.elements.zip.addEventListener("input", (e) => {
      const d = e.target.value.replace(/\D/g, "").slice(0, 5);
      e.target.value = d.length > 2 ? `${d.slice(0, 2)}-${d.slice(2)}` : d;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = $("[data-order-status]");
      const bad = Object.keys(rules).filter(validate);
      if (bad.length) {
        status.textContent = `Popraw ${bad.length === 1 ? "zaznaczone pole" : `zaznaczone pola (${bad.length})`}.`;
        form.elements[bad[0]].focus();
        return;
      }
      status.textContent = "";
      const { subtotal, count } = cart.totals();
      const ship = shippingPrice(method(), subtotal);
      const number = `DEMO-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      const rows = [
        ["Numer (fikcyjny)", number],
        ["Produkty", cart.lines().map((l) => { const d = cart.detail(l); return `${d.p.name} (${d.color.name}${d.p.options.length > 1 ? `, ${d.option.name}` : ""}) × ${l.qty}`; }).join("\n")],
        ["Liczba sztuk", String(count)],
        ["Dostawa", `${method().name} — ${ship === 0 ? "0,00 zł" : fmt(ship)}`],
        ["Adres", `${form.street.value.trim()}, ${form.zip.value.trim()} ${form.city.value.trim()}`],
        ["Do zapłaty", fmt(subtotal + ship)],
      ];
      $("[data-result-list]").replaceChildren(...rows.map(([k, v]) => {
        const div = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = k;
        dd.textContent = v;
        div.append(dt, dd);
        return div;
      }));
      form.hidden = true;
      linesEl.hidden = true;
      summary.hidden = true;
      result.hidden = false;
      result.focus();
      window.scrollTo({ top: 0 });
    });
    $("[data-result-back]").addEventListener("click", () => {
      result.hidden = true;
      linesEl.hidden = false;
      render();
      form.name.focus();
    });
    $("[data-result-clear]").addEventListener("click", () => {
      cart.clear();
      location.href = "index.html";
    });
    render();
  }

  const page = document.body.dataset.page;
  if (page === "home") pageHome();
  if (page === "product") pageProduct();
  if (page === "cart") pageCart();
})();
