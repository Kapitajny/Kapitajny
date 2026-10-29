/*
 * IRONPEAK – interakcje sklepu. Bez bibliotek; każdy formularz działa także bez JavaScriptu
 * (wysyła się normalnie do serwera). Skrypt dodaje: zapytania w tle, podpowiedzi, walidację
 * w przeglądarce, ulubione gościa w localStorage i drobne animacje odpowiadające na działania.
 */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const meta = (name) => (document.querySelector(`meta[name="${name}"]`) || {}).content || '';
  const BASE = meta('ip-base') || '/';
  const CSRF = () => meta('csrf-token');
  const money = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // podgląd animacji mimo ograniczenia ruchu w systemie: ?ruch=1 (jak na stronie ComputerIT)
  if (new URLSearchParams(location.search).get('ruch') === '1') {
    document.documentElement.classList.add('force-motion');
  }

  async function request(url, { method = 'GET', body = null } = {}) {
    const headers = { Accept: 'application/json', 'X-Requested-With': 'fetch' };
    if (method !== 'GET') headers['X-CSRF-Token'] = CSRF();
    const res = await fetch(url, { method, body, headers, credentials: 'same-origin' });
    let data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    return { ok: res.ok && data && data.ok !== false, status: res.status, data: data || {} };
  }

  /* ---------- powiadomienia ---------- */
  const toastRegion = $('[data-toasts]');
  function toast({ title, text = '', image = '', actions = '', tone = '' }) {
    if (!toastRegion) return;
    const el = document.createElement('div');
    el.className = 'toast' + (image ? '' : ' toast--plain') + (tone === 'error' ? ' toast--error' : '');
    el.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    el.innerHTML = (image ? `<img src="${esc(image)}" alt="" width="56" height="56">` : '')
      + `<div><p class="toast__title">${esc(title)}</p>${text ? `<p class="toast__text">${esc(text)}</p>` : ''}</div>`
      + '<button class="icon-btn icon-btn--small toast__close" type="button"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-close"></use></svg><span class="sr-only">Zamknij</span></button>'
      + (actions ? `<div class="toast__actions">${actions}</div>` : '');
    const close = () => {
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 200);
    };
    $('.toast__close', el).addEventListener('click', close);
    toastRegion.appendChild(el);
    while (toastRegion.children.length > 3) toastRegion.firstElementChild.remove();
    setTimeout(close, tone === 'error' ? 7000 : 5000);
  }

  function setCartCount(n) {
    $$('[data-cart-count]').forEach((el) => {
      el.textContent = n;
      el.hidden = !n;
      el.classList.remove('is-bumped');
      void el.offsetWidth;
      el.classList.add('is-bumped');
    });
  }

  function busy(btn, on) {
    if (!btn) return;
    btn.setAttribute('aria-busy', on ? 'true' : 'false');
    btn.disabled = on;
  }

  /* ---------- nagłówek: tło po przewinięciu ---------- */
  const header = $('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- menu mobilne ---------- */
  const menu = $('[data-menu]');
  const menuToggle = $('[data-menu-toggle]');
  const backdrop = $('[data-menu-backdrop]');
  function setMenu(open) {
    if (!menu || !menuToggle) return;
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    if (backdrop) backdrop.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      const first = $('a, button', menu.querySelector('.mainnav__list'));
      setTimeout(() => (first || menu).focus(), 50);
    } else {
      menuToggle.focus();
    }
  }
  if (menuToggle) menuToggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  $$('[data-menu-close]').forEach((b) => b.addEventListener('click', () => setMenu(false)));
  if (backdrop) backdrop.addEventListener('click', () => { setMenu(false); setFilters(false); });

  /* ---------- podmenu kategorii ---------- */
  $$('[data-sub]').forEach((item) => {
    const btn = $('button', item);
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      $$('[data-sub].is-open').forEach((o) => { o.classList.remove('is-open'); $('button', o).setAttribute('aria-expanded', 'false'); });
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e) => {
    $$('[data-sub].is-open').forEach((o) => {
      if (!o.contains(e.target) && window.matchMedia('(min-width: 1081px)').matches) {
        o.classList.remove('is-open');
        $('button', o).setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (menu && menu.classList.contains('is-open')) setMenu(false);
    if (filters && filters.classList.contains('is-open')) setFilters(false);
    $$('[data-sub].is-open').forEach((o) => { o.classList.remove('is-open'); const b = $('button', o); b.setAttribute('aria-expanded', 'false'); b.focus(); });
    closeSuggest();
  });

  /* ---------- wyszukiwarka z podpowiedziami ---------- */
  const search = $('[data-search]');
  const searchInput = $('[data-search-input]');
  const suggest = $('[data-search-suggest]');
  const searchToggle = $('[data-search-toggle]');
  let suggestTimer = null;
  let suggestIndex = -1;
  let suggestReq = 0;
  function closeSuggest() {
    if (!suggest) return;
    suggest.hidden = true;
    suggestIndex = -1;
    if (searchInput) searchInput.setAttribute('aria-expanded', 'false');
  }
  if (searchToggle && search) {
    searchToggle.addEventListener('click', () => {
      const open = !search.classList.contains('is-open');
      search.classList.toggle('is-open', open);
      searchToggle.setAttribute('aria-expanded', String(open));
      if (open) searchInput.focus();
    });
  }
  if (searchInput && suggest) {
    searchInput.addEventListener('input', () => {
      clearTimeout(suggestTimer);
      const q = searchInput.value.trim();
      if (q.length < 2) { closeSuggest(); return; }
      suggestTimer = setTimeout(async () => {
        const id = ++suggestReq;
        const { data } = await request(BASE + 'api/szukaj?q=' + encodeURIComponent(q));
        if (id !== suggestReq) return;
        const items = data.items || [];
        suggest.innerHTML = items.length
          ? items.map((it, i) => `<a class="suggest__item" role="option" id="sg-${i}" href="${esc(it.url)}"><img src="${esc(it.image)}" alt="" width="52" height="52"><span><span class="suggest__name">${esc(it.name)}</span><span class="suggest__cat">${esc(it.category)}</span></span><span class="suggest__price">${esc(it.price)}</span></a>`).join('')
            + `<a class="suggest__all" href="${esc(data.all)}">Wszystkie wyniki dla „${esc(q)}”</a>`
          : `<p class="suggest__empty">Brak produktów dla „${esc(q)}”. Spróbuj ogólniejszego słowa.</p>`;
        suggest.hidden = false;
        suggestIndex = -1;
        searchInput.setAttribute('aria-expanded', 'true');
      }, 180);
    });
    searchInput.addEventListener('keydown', (e) => {
      const opts = $$('.suggest__item', suggest);
      if (suggest.hidden || !opts.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        suggestIndex = (suggestIndex + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
        opts.forEach((o, i) => o.setAttribute('aria-selected', String(i === suggestIndex)));
        searchInput.setAttribute('aria-activedescendant', opts[suggestIndex].id);
      } else if (e.key === 'Enter' && suggestIndex >= 0) {
        e.preventDefault();
        location.href = opts[suggestIndex].href;
      }
    });
    document.addEventListener('click', (e) => { if (!search.contains(e.target)) closeSuggest(); });
  }

  /* ---------- ulubione ---------- */
  const FAV_KEY = 'ironpeak_favorites';
  const loggedIn = document.body.dataset.user === '1';
  const readLocal = () => {
    try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]').map(Number).filter(Boolean); } catch (e) { return []; }
  };
  const writeLocal = (ids) => { try { localStorage.setItem(FAV_KEY, JSON.stringify(ids)); } catch (e) { /* tryb prywatny */ } };
  let favorites = loggedIn
    ? (document.body.dataset.favorites || '').split(',').map(Number).filter(Boolean)
    : readLocal();

  function paintFavorites() {
    $$('[data-fav]').forEach((btn) => {
      const on = favorites.includes(Number(btn.dataset.fav));
      btn.setAttribute('aria-pressed', String(on));
      const label = $('[data-fav-label]', btn);
      if (label) label.textContent = label.textContent.replace(/^(Dodaj do ulubionych|Usuń z ulubionych)/, on ? 'Usuń z ulubionych' : 'Dodaj do ulubionych');
    });
    $$('[data-fav-count]').forEach((c) => { c.textContent = favorites.length; c.hidden = !favorites.length; });
  }

  async function syncFavorites() {
    const local = readLocal();
    if (!loggedIn || !local.length) return;
    const fd = new FormData();
    local.forEach((id) => fd.append('ids[]', id));
    const { ok, data } = await request(BASE + 'api/ulubione/synchronizuj', { method: 'POST', body: fd });
    if (ok) {
      favorites = data.ids || favorites;
      writeLocal([]);
      paintFavorites();
      toast({ title: 'Ulubione zapisane w koncie', text: 'Produkty zapisane wcześniej w tej przeglądarce są teraz w Twoim koncie.' });
    }
  }

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-fav]');
    if (!btn) return;
    const id = Number(btn.dataset.fav);
    const adding = !favorites.includes(id);
    const card = btn.closest('[data-product-card]');
    const name = card ? ($('.card__title', card) || {}).textContent : (document.querySelector('.buybox__title') || {}).textContent;
    if (loggedIn) {
      const fd = new FormData();
      fd.append('product_id', id);
      fd.append('action', adding ? 'add' : 'remove');
      const { ok, data } = await request(BASE + 'api/ulubione', { method: 'POST', body: fd });
      if (!ok) { toast({ title: 'Nie udało się zapisać', text: data.message || 'Spróbuj ponownie.', tone: 'error' }); return; }
      favorites = data.ids || [];
    } else {
      favorites = adding ? [id, ...favorites.filter((f) => f !== id)] : favorites.filter((f) => f !== id);
      writeLocal(favorites);
    }
    paintFavorites();
    btn.classList.remove('is-popping');
    void btn.offsetWidth;
    btn.classList.add('is-popping');
    toast({
      title: adding ? 'Dodano do ulubionych' : 'Usunięto z ulubionych',
      text: (name || '').trim() + (adding && !loggedIn ? ' – lista zapisana w tej przeglądarce.' : ''),
      actions: adding ? `<a class="btn btn--small btn--secondary" href="${BASE}ulubione">Zobacz ulubione</a>` : '',
    });
    const page = $('[data-favorites-page]');
    if (page && !adding && card) {
      card.remove();
      const empty = $('[data-favorites-empty]');
      if (empty && !$('[data-product-card]', page)) empty.hidden = false;
    }
  });

  async function loadGuestFavorites() {
    const page = $('[data-favorites-page]');
    if (!page || loggedIn) return;
    const grid = $('[data-favorites-grid]', page);
    const empty = $('[data-favorites-empty]', page);
    if (!favorites.length) { empty.hidden = false; return; }
    const { data } = await request(BASE + 'api/ulubione/karty?ids=' + favorites.join(','));
    grid.innerHTML = data.html || '';
    if (!grid.children.length) empty.hidden = false;
    paintFavorites();
  }

  paintFavorites();
  syncFavorites();
  loadGuestFavorites();

  /* ---------- dodawanie do koszyka ---------- */
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-add-to-cart]');
    if (!form) return;
    const group = $('[data-variant-group]', form);
    if (group && !$('input[name="variant_id"]:checked', group)) {
      e.preventDefault();
      group.classList.add('is-invalid');
      const err = $('[data-variant-error]', form);
      if (err) err.hidden = false;
      const first = $('input[name="variant_id"]:not(:disabled)', group);
      if (first) first.focus();
      return;
    }
    e.preventDefault();
    const btn = $('button[type="submit"]', form);
    busy(btn, true);
    try {
      const { ok, data } = await request(form.action, { method: 'POST', body: new FormData(form) });
      if (ok) {
        setCartCount(data.count);
        const line = data.line || {};
        toast({
          title: 'Dodano do koszyka',
          text: [line.name, line.variant, line.price].filter(Boolean).join(', ') + (data.message !== 'Dodano do koszyka.' ? ' ' + data.message : ''),
          image: line.image,
          actions: `<a class="btn btn--small btn--primary" href="${BASE}koszyk">Przejdź do koszyka</a><button class="btn btn--small btn--ghost" type="button" data-toast-dismiss>Kupuj dalej</button>`,
        });
      } else {
        toast({ title: 'Nie dodano do koszyka', text: data.message || 'Spróbuj ponownie.', tone: 'error' });
      }
    } catch (err) {
      form.submit();
    } finally {
      busy(btn, false);
    }
  });
  document.addEventListener('click', (e) => {
    const d = e.target.closest('[data-toast-dismiss]');
    if (d) d.closest('.toast').querySelector('.toast__close').click();
  });

  /* ---------- strona produktu: warianty, ilość, galeria ---------- */
  const product = $('[data-product]');
  if (product) {
    const variants = JSON.parse(product.dataset.variants || '[]');
    const priceBox = $('[data-price-box]', product);
    const stock = $('[data-stock]', product);
    const qtyInput = $('[data-qty-input]', product);
    const maxQty = qtyInput ? Number(qtyInput.max) : 10;
    const group = $('[data-variant-group]', product);
    const hint = $('[data-variant-hint]', product);

    const stockState = (n) => (n <= 0 ? ['out', 'Brak w magazynie'] : n <= 3 ? ['low', `Ostatnie sztuki w magazynie (${n} szt.)`] : ['in', 'Dostępny w magazynie']);

    function applyVariant(v, updateUrl) {
      if (!v) return;
      priceBox.innerHTML = `<div class="price price--lg"><p class="price__row"><span class="price__now${v.onSale ? ' price__now--sale' : ''}">${v.onSale ? '<span class="sr-only">Cena promocyjna: </span>' : ''}${esc(v.price)}</span>${v.onSale ? `<s class="price__was"><span class="sr-only">Cena regularna: </span>${esc(v.regular)}</s>` : ''}</p>${v.onSale && v.lowest30 ? `<p class="price__omnibus">Najniższa cena z 30 dni przed obniżką: ${esc(v.lowest30)}</p>` : ''}</div>`;
      const [state, label] = stockState(v.stock);
      stock.className = 'stock stock--' + state;
      $('[data-stock-label]', stock).textContent = label;
      if (qtyInput) {
        qtyInput.max = Math.max(1, Math.min(maxQty, v.stock));
        if (Number(qtyInput.value) > Number(qtyInput.max)) qtyInput.value = qtyInput.max;
      }
      if (hint) hint.textContent = '';
      if (group) group.classList.remove('is-invalid');
      const err = $('[data-variant-error]', product);
      if (err) err.hidden = true;
      showSlide(v.image);
      if (updateUrl) {
        const url = new URL(location.href);
        url.searchParams.set('wariant', v.sku);
        history.replaceState(null, '', url);
      }
    }
    if (group) {
      group.addEventListener('change', (e) => {
        const v = variants.find((x) => String(x.id) === e.target.value);
        applyVariant(v, true);
      });
    }

    $$('[data-qty]', product).forEach((q) => {
      const input = $('[data-qty-input]', q);
      $$('[data-qty-step]', q).forEach((b) => b.addEventListener('click', () => {
        const next = Number(input.value || 1) + Number(b.dataset.qtyStep);
        input.value = Math.max(Number(input.min || 1), Math.min(Number(input.max || 10), next));
      }));
    });

    // galeria
    const slides = $$('[data-slide]', product);
    const thumbs = $$('[data-thumb]', product);
    function showSlide(key) {
      const target = slides.find((s) => s.dataset.slide === key);
      if (!target) return;
      slides.forEach((s) => { s.hidden = s !== target; });
      thumbs.forEach((t) => t.setAttribute('aria-current', String(t.dataset.thumb === key)));
    }
    thumbs.forEach((t) => t.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(t.dataset.thumb);
    }));
  }

  /* ---------- katalog: filtry ---------- */
  const filters = $('[data-filters]');
  const filtersOpen = $('[data-filters-open]');
  function setFilters(open) {
    if (!filters) return;
    filters.classList.toggle('is-open', open);
    if (filtersOpen) filtersOpen.setAttribute('aria-expanded', String(open));
    if (backdrop) backdrop.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) setTimeout(() => ($('input, select', filters) || filters).focus(), 50);
    else if (filtersOpen) filtersOpen.focus();
  }
  if (filtersOpen) filtersOpen.addEventListener('click', () => setFilters(true));
  $$('[data-filters-close]').forEach((b) => b.addEventListener('click', () => setFilters(false)));
  const filterForm = $('[data-filter-form]');
  if (filterForm) {
    // na komputerze filtry działają od razu; w szufladzie mobilnej – po „Pokaż wyniki”
    filterForm.addEventListener('change', (e) => {
      const isMobileDrawer = window.matchMedia('(max-width: 960px)').matches;
      if (!isMobileDrawer && e.target.matches('input[type="checkbox"], input[type="radio"]')) filterForm.requestSubmit();
    });
    filterForm.addEventListener('submit', () => {
      // puste pola ceny nie trafiają do adresu
      $$('input[type="number"]', filterForm).forEach((i) => { if (!i.value) i.disabled = true; });
    });
  }
  $$('[data-autosubmit]').forEach((el) => {
    if (el.closest('[data-cart-root]')) return; // koszyk obsługuje własna logika
    el.addEventListener('change', () => el.form.requestSubmit());
  });

  /* ---------- koszyk ---------- */
  const cartRoot = $('[data-cart-root]');
  if (cartRoot) {
    let qtyTimer = null;
    async function sendCartForm(form, submitter) {
      const fd = new FormData(form);
      if (submitter && submitter.name) fd.set(submitter.name, submitter.value);
      cartRoot.setAttribute('aria-busy', 'true');
      try {
        const { data, ok } = await request(form.action, { method: 'POST', body: fd });
        if (data.html !== undefined) {
          const focusedKey = document.activeElement && document.activeElement.id;
          cartRoot.innerHTML = data.html;
          if (focusedKey && document.getElementById(focusedKey)) document.getElementById(focusedKey).focus();
          setCartCount(data.count);
        }
        if (!ok && data.message) toast({ title: 'Nie udało się', text: data.message, tone: 'error' });
        else if (ok && /kod/i.test(form.action)) toast({ title: data.message });
      } catch (e) {
        form.submit();
      } finally {
        cartRoot.removeAttribute('aria-busy');
      }
    }
    cartRoot.addEventListener('submit', (e) => {
      const form = e.target.closest('[data-cart-form]');
      if (!form) return;
      e.preventDefault();
      sendCartForm(form, e.submitter);
    });
    cartRoot.addEventListener('change', (e) => {
      if (e.target.matches('[data-autosubmit]')) sendCartForm(e.target.form);
      if (e.target.matches('[data-autosubmit-qty]')) {
        clearTimeout(qtyTimer);
        qtyTimer = setTimeout(() => sendCartForm(e.target.form), 250);
      }
    });
  }

  /* ---------- zamówienie: podgląd kosztu dostawy ---------- */
  const checkout = $('[data-checkout]');
  if (checkout) {
    const cost = $('[data-shipping-cost]');
    const total = $('[data-grand-total]');
    checkout.addEventListener('change', (e) => {
      if (e.target.name !== 'shipping' || !cost || !total) return;
      const price = Number(e.target.dataset.price || 0);
      cost.textContent = money.format(price / 100);
      total.textContent = money.format((Number(total.dataset.base) + price) / 100);
    });
  }

  /* ---------- walidacja formularzy w przeglądarce (serwer i tak sprawdza wszystko) ---------- */
  const rules = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Wpisz poprawny adres e-mail, np. jan@example.com.',
    postal: (v) => /^\d{2}-\d{3}$/.test(v) || 'Kod pocztowy wpisz w formacie 00-000.',
    phone: (v) => /^\d{9}$/.test(v.replace(/[\s\-()]/g, '').replace(/^(\+48|0048)/, '')) || 'Wpisz 9-cyfrowy numer telefonu (opcjonalnie z +48).',
    nip: (v) => {
      const d = v.replace(/[\s-]/g, '');
      if (!/^\d{10}$/.test(d)) return 'NIP jest niepoprawny – sprawdź 10 cyfr.';
      const w = [6, 5, 7, 2, 3, 4, 5, 6, 7];
      const sum = w.reduce((s, x, i) => s + x * Number(d[i]), 0) % 11;
      return (sum !== 10 && sum === Number(d[9])) || 'NIP jest niepoprawny – sprawdź 10 cyfr.';
    },
  };
  function fieldError(input) {
    const v = input.value.trim();
    if (input.type === 'checkbox') return input.required && !input.checked ? 'To pole jest wymagane.' : '';
    if (input.required && !v) return input.dataset.required || 'To pole jest wymagane.';
    if (!v) return '';
    if (input.type === 'email') { const r = rules.email(v); if (r !== true) return r; }
    if (input.dataset.rule && rules[input.dataset.rule]) { const r = rules[input.dataset.rule](v); if (r !== true) return r; }
    if (input.minLength > 0 && v.length < input.minLength) return `Wpisz co najmniej ${input.minLength} znaków.`;
    if (input.dataset.match) { const other = document.getElementById(input.dataset.match); if (other && other.value !== input.value) return 'Hasła nie są takie same.'; }
    return '';
  }
  function showError(input, message) {
    const field = input.closest('.field');
    const err = field ? $('.field__error', field) : null;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (field) field.classList.toggle('field--error', !!message);
    if (err) {
      err.hidden = !message;
      const text = $('[data-error-text]', err);
      if (text) text.textContent = message;
      if (message && !(input.getAttribute('aria-describedby') || '').includes(err.id) && err.id) {
        input.setAttribute('aria-describedby', ((input.getAttribute('aria-describedby') || '') + ' ' + err.id).trim());
      }
    }
  }
  $$('form[data-validate]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      let first = null;
      $$('input.input, textarea.input', form).forEach((input) => {
        if (input.disabled || input.type === 'hidden') return;
        const msg = fieldError(input);
        showError(input, msg);
        if (msg && !first) first = input;
      });
      $$('input[type="radio"][required]', form).forEach((r) => {
        const set = $$(`input[name="${r.name}"]`, form);
        const section = r.closest('.form-section, .rating-input');
        const missing = !set.some((x) => x.checked);
        if (section) section.classList.toggle('form-section--error', missing);
        if (missing && !first) first = r;
      });
      $$('input[type="checkbox"][required]', form).forEach((c) => {
        const label = c.closest('.check');
        if (label) label.classList.toggle('check--error', !c.checked);
        if (!c.checked && !first) first = c;
      });
      if (first) {
        e.preventDefault();
        e.stopImmediatePropagation();
        first.focus();
        first.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    });
    form.addEventListener('focusout', (e) => {
      const input = e.target;
      if (input.matches('input.input, textarea.input') && (input.value || input.getAttribute('aria-invalid') === 'true')) {
        showError(input, fieldError(input));
      }
    });
  });

  /* ---------- newsletter ---------- */
  $$('[data-newsletter]').forEach((form) => {
    const msg = $('[data-form-msg]', form);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('input[type="email"]', form);
      const consent = $('input[name="consent"]', form);
      msg.className = 'form-msg';
      if (rules.email(email.value.trim()) !== true) {
        msg.textContent = 'Wpisz poprawny adres e-mail, np. jan@example.com.';
        msg.classList.add('is-error');
        email.setAttribute('aria-invalid', 'true');
        email.focus();
        return;
      }
      email.setAttribute('aria-invalid', 'false');
      if (!consent.checked) {
        msg.textContent = 'Zaznacz zgodę na otrzymywanie wiadomości – bez niej nie możemy zapisać adresu.';
        msg.classList.add('is-error');
        consent.focus();
        return;
      }
      const btn = $('button[type="submit"]', form);
      busy(btn, true);
      const { ok, data } = await request(form.action, { method: 'POST', body: new FormData(form) });
      busy(btn, false);
      msg.textContent = data.message || (ok ? 'Zapisano.' : 'Nie udało się zapisać. Spróbuj ponownie.');
      msg.classList.add(ok ? 'is-ok' : 'is-error');
      if (ok) { email.value = ''; consent.checked = false; }
    });
  });

  /* ---------- drobne zachowania formularzy ---------- */
  $$('form[data-once]').forEach((form) => form.addEventListener('submit', (e) => {
    if (form.dataset.sent) { e.preventDefault(); return; }
    form.dataset.sent = '1';
    const btn = e.submitter || $('button[type="submit"]', form);
    if (btn) {
      // wartość przycisku (np. wynik płatności) musi trafić do serwera mimo wyłączenia
      if (btn.name) { const h = document.createElement('input'); h.type = 'hidden'; h.name = btn.name; h.value = btn.value; form.appendChild(h); }
      setTimeout(() => busy(btn, true), 0);
    }
  }));
  $$('form[data-confirm]').forEach((form) => form.addEventListener('submit', (e) => {
    if (!window.confirm(form.dataset.confirm)) e.preventDefault();
  }));
  $$('[data-select-all]').forEach((el) => el.addEventListener('focus', () => el.select()));
  const summary = $('[data-error-summary]');
  if (summary) summary.focus();

  /* ---------- pojawianie się sekcji przy przewijaniu (subtelne, jednorazowe) ---------- */
  const forceMotion = document.documentElement.classList.contains('force-motion');
  if ('IntersectionObserver' in window && (!reducedMotion || forceMotion)) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.remove('is-hidden'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('is-hidden');
        io.observe(el);
      }
    });
  }
})();
