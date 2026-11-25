/* computerit – wszystkie skrypty (menu, strona główna, portfolio).
   Dodaj raz na całą stronę, np. wtyczką WPCode: JavaScript Snippet,
   miejsce: Site Wide Footer. Każda część działa tylko tam, gdzie jest jej HTML. */
function citStart(fn) {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
}

/* ===== Menu z logo i domkiem ===== */
citStart(function () {
  var menu = document.querySelector(".cit-dropdown");
  if (!menu) return;
  var toggle = menu.querySelector("summary");
  /* Podkreśla podstronę, na której jesteś */
  function clean(path) {
    return path.split("/").filter(Boolean).join("/");
  }
  var here = clean(location.pathname);
  menu.querySelectorAll(".cit-dropdown__link").forEach(function (link) {
    if (clean(new URL(link.href).pathname) === here) link.setAttribute("aria-current", "page");
  });
  /* Zamyka menu po kliknięciu obok */
  document.addEventListener("click", function (event) {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  /* Zamyka menu klawiszem Esc */
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menu.open) {
      menu.open = false;
      toggle.focus();
    }
  });
});

/* ===== Strona główna: tło, przycisk Oferta, usługi ===== */
citStart(function () {
  var hero = document.querySelector(".cit-hero");
  if (!hero) return;
  var img = hero.querySelector(".cit-hero__img");
  /* Rozmyte boki tła z tego samego obrazka */
  function ok() {
    hero.style.setProperty("--cit-tlo", 'url("' + img.currentSrc + '")');
    hero.classList.remove("cit-hero--broken");
  }
  function broken() {
    hero.classList.add("cit-hero--broken");
  }
  img.addEventListener("load", ok);
  img.addEventListener("error", broken);
  if (img.complete) {
    if (img.naturalWidth) ok();
    else broken();
  }
});

/* ===== Portfolio: kafelki demo + podgląd w okienku ===== */
citStart(function () {
  var root = document.querySelector(".cit-pf");
  if (!root) return;
  var dialog = root.querySelector(".cit-pf__dialog");
  var frame = root.querySelector(".cit-pf__frame");
  var stage = root.querySelector(".cit-pf__stage");
  var title = root.querySelector(".cit-pf__dtitle");
  var openLink = root.querySelector(".cit-pf__open");
  var devButtons = root.querySelectorAll(".cit-pf__dev");
  /* Brak zrzutu ekranu: pokaż kafelek z nazwą */
  root.querySelectorAll(".cit-pf__img").forEach(function (img) {
    function hide() { img.classList.add("cit-pf__img--brak"); }
    img.addEventListener("error", hide);
    if (img.complete && !img.naturalWidth) hide();
  });
  if (!dialog || typeof dialog.showModal !== "function") return;
  function setDevice(dev) {
    stage.classList.toggle("cit-pf__stage--mobile", dev === "mobile");
    devButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-dev") === dev ? "true" : "false");
    });
  }
  /* Kliknięcie w kafelek: podgląd strony w okienku */
  root.querySelectorAll(".cit-pf__card").forEach(function (card) {
    card.addEventListener("click", function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      title.textContent = card.querySelector(".cit-pf__name").textContent;
      openLink.href = card.href;
      frame.src = card.href;
      setDevice("desktop");
      dialog.showModal();
    });
  });
  devButtons.forEach(function (b) {
    b.addEventListener("click", function () { setDevice(b.getAttribute("data-dev")); });
  });
  root.querySelector(".cit-pf__close").addEventListener("click", function () { dialog.close(); });
  /* Kliknięcie w ciemne tło zamyka okienko */
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", function () { frame.src = "about:blank"; });
});
